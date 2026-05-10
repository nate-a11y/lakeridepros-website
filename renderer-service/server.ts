import http from 'node:http';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { WINNER_DRAW_VIDEO_ID, type WinnerDrawVideoProps } from '../remotion/winner-video/types';

const PORT = Number(process.env.PORT || 8080);

interface RenderRequest {
  jobId: string;
  inputProps: WinnerDrawVideoProps;
}

async function readJson(req: http.IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function sendJson(res: http.ServerResponse, status: number, payload: unknown) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function validateProps(props: WinnerDrawVideoProps) {
  if (!props || typeof props !== 'object') throw new Error('inputProps are required');
  if (!props.giveawayTitle || !props.winnerName || !props.drawDate) {
    throw new Error('inputProps.giveawayTitle, winnerName and drawDate are required');
  }
  if (!Number.isFinite(props.entryCount)) throw new Error('inputProps.entryCount must be a number');
}

async function renderMp4(inputProps: WinnerDrawVideoProps, jobId: string) {
  const entryPoint = path.resolve(process.cwd(), 'remotion/winner-video/index.ts');
  const publicDir = path.resolve(process.cwd(), 'public');
  const serveUrl = await bundle({
    entryPoint,
    publicDir,
    onProgress: (progress) => console.log(`Bundle ${Math.round(progress * 100)}%`),
    ignoreRegisterRootWarning: true,
  });

  const composition = await selectComposition({
    serveUrl,
    id: WINNER_DRAW_VIDEO_ID,
    inputProps: inputProps as unknown as Record<string, unknown>,
    timeoutInMilliseconds: 120000,
  });

  const outputPath = path.join(os.tmpdir(), `lrp-winner-${jobId}.mp4`);
  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation: outputPath,
    inputProps: inputProps as unknown as Record<string, unknown>,
    overwrite: true,
    crf: 20,
    concurrency: Number(process.env.REMOTION_CONCURRENCY || 2),
    timeoutInMilliseconds: 240000,
    chromiumOptions: { disableWebSecurity: true },
    logLevel: 'info',
  });

  return outputPath;
}

async function handleRender(req: http.IncomingMessage, res: http.ServerResponse) {
  const token = process.env.WINNER_VIDEO_RENDER_TOKEN;
  if (!token || req.headers.authorization !== `Bearer ${token}`) {
    return sendJson(res, 401, { error: 'Unauthorized' });
  }

  const body = (await readJson(req)) as RenderRequest;
  if (!body.jobId || !body.inputProps) {
    return sendJson(res, 400, { error: 'jobId and inputProps are required' });
  }
  validateProps(body.inputProps);

  const outputPath = await renderMp4(body.inputProps, body.jobId);
  const buffer = await fs.readFile(outputPath);
  await fs.unlink(outputPath).catch(() => undefined);

  res.writeHead(200, {
    'Content-Type': 'video/mp4',
    'Content-Length': String(buffer.byteLength),
    'X-Renderer': 'lrp-winner-video-renderer',
  });
  res.end(buffer);
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      return sendJson(res, 200, { ok: true, service: 'lrp-winner-video-renderer' });
    }
    if (req.method === 'POST' && req.url === '/render-winner-video') {
      return await handleRender(req, res);
    }
    return sendJson(res, 404, { error: 'Not found' });
  } catch (err) {
    console.error('Unhandled renderer error:', err);
    return sendJson(res, 500, { error: err instanceof Error ? err.message : 'Unknown error' });
  }
});

server.listen(PORT, () => {
  console.log(`LRP winner video renderer listening on ${PORT}`);
});
