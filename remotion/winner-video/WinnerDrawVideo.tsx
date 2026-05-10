import React from 'react';
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { WinnerDrawVideoProps } from './types';

const gold = '#d6a93a';
const deepGold = '#a97a13';
const black = '#080806';
const cream = '#fff7e1';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededNumber(seed: number, idx: number) {
  const x = Math.sin(seed + idx * 999.1337) * 10000;
  return x - Math.floor(x);
}

function EntryPill({ index, seed }: { index: number; seed: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({ frame: frame - index * 3, fps, config: { damping: 18, stiffness: 80 } });
  const n = Math.floor(seededNumber(seed, index) * 997) + 1;
  const x = interpolate(seededNumber(seed, index + 100), [0, 1], [-110, 110]);
  const y = index * 82;
  const pulse = Math.sin((frame + index * 11) / 7) * 0.5 + 0.5;

  return (
    <div
      style={{
        position: 'absolute',
        left: 110 + x,
        top: 0 + y,
        width: 860,
        height: 62,
        borderRadius: 999,
        border: `1px solid rgba(214, 169, 58, ${0.28 + pulse * 0.22})`,
        background: `linear-gradient(90deg, rgba(255,255,255,${0.08 + pulse * 0.05}), rgba(214,169,58,${0.08 + pulse * 0.08}))`,
        color: 'rgba(255,247,225,0.74)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        fontFamily: 'Inter, Arial, sans-serif',
        fontSize: 26,
        letterSpacing: 1.4,
        opacity: clamp(appear, 0, 1) * 0.86,
        transform: `translateY(${interpolate(frame % 90, [0, 90], [0, -90])}px) scale(${0.96 + clamp(appear, 0, 1) * 0.04})`,
        filter: 'blur(0.2px)',
      }}
    >
      <span>VERIFIED ENTRY</span>
      <span>#{String(n).padStart(3, '0')}</span>
    </div>
  );
}

function ConfettiPiece({ index, seed }: { index: number; seed: number }) {
  const frame = useCurrentFrame();
  const start = 336 + Math.floor(seededNumber(seed, index) * 35);
  const progress = clamp((frame - start) / 110, 0, 1);
  const x = seededNumber(seed, index + 1) * 1080;
  const drift = interpolate(seededNumber(seed, index + 2), [0, 1], [-160, 160]);
  const y = interpolate(progress, [0, 1], [-40, 1320 + seededNumber(seed, index + 3) * 600]);
  const rotate = interpolate(progress, [0, 1], [0, 720 + seededNumber(seed, index + 4) * 540]);
  const colors = [gold, cream, '#ffffff', deepGold];
  const color = colors[index % colors.length];

  return (
    <div
      style={{
        position: 'absolute',
        left: x + drift * progress,
        top: y,
        width: 12 + seededNumber(seed, index + 5) * 20,
        height: 26 + seededNumber(seed, index + 6) * 24,
        background: color,
        borderRadius: 4,
        opacity: progress === 0 ? 0 : interpolate(progress, [0, 0.12, 0.82, 1], [0, 1, 1, 0]),
        transform: `rotate(${rotate}deg)`,
      }}
    />
  );
}

function PrivacyBadge() {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 74,
        left: 90,
        right: 90,
        borderRadius: 28,
        border: '1px solid rgba(255,247,225,0.18)',
        background: 'rgba(255,247,225,0.07)',
        color: 'rgba(255,247,225,0.72)',
        fontFamily: 'Inter, Arial, sans-serif',
        fontSize: 25,
        lineHeight: 1.35,
        textAlign: 'center',
        padding: '22px 28px',
      }}
    >
      Recording-safe draw: only the winner name is shown.
    </div>
  );
}

export function WinnerDrawVideo({
  giveawayTitle,
  prizeDescription,
  winnerName,
  entryCount,
  drawDate,
}: WinnerDrawVideoProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seed = hashString(`${giveawayTitle}:${winnerName}:${entryCount}:${drawDate}`);

  const introOpacity = interpolate(frame, [0, 30, 105], [0, 1, 0.2], { extrapolateRight: 'clamp' });
  const scanOpacity = interpolate(frame, [80, 115, 310, 348], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const reveal = spring({ frame: frame - 330, fps, config: { damping: 16, stiffness: 70 } });
  const logoScale = interpolate(frame, [0, 50, 330, 370], [0.82, 1, 0.86, 0.92], { extrapolateRight: 'clamp' });
  const scanLine = interpolate(frame % 70, [0, 70], [290, 1180]);
  const safeEntryCount = Math.max(0, Number.isFinite(entryCount) ? entryCount : 0);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 18%, rgba(214,169,58,0.30), transparent 36%), linear-gradient(180deg, #11100c 0%, ${black} 58%, #000 100%)`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -100,
          backgroundImage:
            'linear-gradient(rgba(214,169,58,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(214,169,58,0.08) 1px, transparent 1px)',
          backgroundSize: '72px 72px',
          transform: `translateY(${-(frame % 72)}px)`,
          opacity: 0.35,
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 86,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${logoScale})`,
        }}
      >
        <div
          style={{
            width: 520,
            height: 220,
            borderRadius: 42,
            background: 'rgba(0,0,0,0.22)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 80px rgba(214,169,58,0.22)',
          }}
        >
          <Img
            src={staticFile('Color logo - no background.png')}
            style={{ width: 430, objectFit: 'contain' }}
          />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 346,
          left: 80,
          right: 80,
          opacity: introOpacity,
          textAlign: 'center',
        }}
      >
        <div
          style={{
            color: gold,
            fontFamily: 'Inter, Arial, sans-serif',
            fontWeight: 800,
            fontSize: 34,
            letterSpacing: 8,
            textTransform: 'uppercase',
          }}
        >
          Lake Ride Pros
        </div>
        <div
          style={{
            color: cream,
            fontFamily: 'Georgia, serif',
            fontSize: 76,
            lineHeight: 1.05,
            fontWeight: 800,
            marginTop: 26,
            textShadow: '0 8px 40px rgba(0,0,0,0.45)',
          }}
        >
          {giveawayTitle}
        </div>
        {prizeDescription ? (
          <div
            style={{
              color: 'rgba(255,247,225,0.78)',
              fontFamily: 'Inter, Arial, sans-serif',
              fontSize: 34,
              marginTop: 24,
            }}
          >
            {prizeDescription}
          </div>
        ) : null}
      </div>

      <div style={{ position: 'absolute', inset: 0, opacity: scanOpacity }}>
        <div
          style={{
            position: 'absolute',
            top: 405,
            left: 76,
            right: 76,
            height: 875,
            borderRadius: 44,
            border: '2px solid rgba(214,169,58,0.35)',
            background: 'rgba(0,0,0,0.28)',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 80px rgba(214,169,58,0.10), 0 0 70px rgba(0,0,0,0.35)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 42,
              left: 0,
              right: 0,
              height: 1050,
            }}
          >
            {Array.from({ length: 18 }).map((_, i) => (
              <EntryPill key={i} index={i} seed={seed} />
            ))}
          </div>
          <div
            style={{
              position: 'absolute',
              top: scanLine,
              left: 0,
              right: 0,
              height: 4,
              background: `linear-gradient(90deg, transparent, ${gold}, #fff, ${gold}, transparent)`,
              boxShadow: `0 0 46px ${gold}`,
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            top: 1326,
            left: 80,
            right: 80,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              color: gold,
              fontFamily: 'Inter, Arial, sans-serif',
              fontSize: 44,
              fontWeight: 900,
              letterSpacing: 5,
              textTransform: 'uppercase',
            }}
          >
            Scanning verified entries
          </div>
          <div
            style={{
              color: 'rgba(255,247,225,0.72)',
              fontFamily: 'Inter, Arial, sans-serif',
              fontSize: 32,
              marginTop: 22,
            }}
          >
            {safeEntryCount.toLocaleString()} eligible {safeEntryCount === 1 ? 'entry' : 'entries'} • Random draw in progress
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: clamp(reveal, 0, 1),
          transform: `scale(${interpolate(clamp(reveal, 0, 1), [0, 1], [0.88, 1])})`,
        }}
      >
        {Array.from({ length: 90 }).map((_, i) => (
          <ConfettiPiece key={i} index={i} seed={seed} />
        ))}

        <div
          style={{
            position: 'absolute',
            top: 560,
            left: 68,
            right: 68,
            minHeight: 690,
            borderRadius: 58,
            background: `linear-gradient(145deg, rgba(214,169,58,0.24), rgba(255,247,225,0.08), rgba(0,0,0,0.36))`,
            border: `3px solid ${gold}`,
            boxShadow: '0 0 110px rgba(214,169,58,0.32), inset 0 0 90px rgba(255,247,225,0.06)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '62px 58px',
          }}
        >
          <div
            style={{
              color: gold,
              fontFamily: 'Inter, Arial, sans-serif',
              fontSize: 38,
              fontWeight: 900,
              letterSpacing: 7,
              textTransform: 'uppercase',
              marginBottom: 30,
            }}
          >
            Winner
          </div>
          <div
            style={{
              color: cream,
              fontFamily: 'Georgia, serif',
              fontSize: winnerName.length > 22 ? 82 : 104,
              lineHeight: 1.04,
              fontWeight: 900,
              textAlign: 'center',
              textShadow: '0 10px 48px rgba(0,0,0,0.48)',
              wordBreak: 'break-word',
            }}
          >
            {winnerName}
          </div>
          <div
            style={{
              width: 520,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${gold}, transparent)`,
              margin: '44px 0 34px',
            }}
          />
          <div
            style={{
              color: 'rgba(255,247,225,0.82)',
              fontFamily: 'Inter, Arial, sans-serif',
              fontSize: 31,
              textAlign: 'center',
              lineHeight: 1.35,
            }}
          >
            Congratulations from Lake Ride Pros
          </div>
        </div>
      </div>

      <PrivacyBadge />
    </AbsoluteFill>
  );
}
