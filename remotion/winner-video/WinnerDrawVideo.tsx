import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import type { WinnerDrawVideoProps } from './types';

const black = '#050705';
const lrpGreen = '#62b946';
const brightGreen = '#7ee45a';
const white = '#f7fff2';
const mutedWhite = 'rgba(247,255,242,0.72)';
const gold = '#d6a93a';
const deepGold = '#9f7419';

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

function fitName(name: string) {
  if (name.length > 26) return 30;
  if (name.length > 20) return 34;
  return 39;
}

function EntryPill({ index, seed, names }: { index: number; seed: number; names: string[] }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const appear = spring({ frame: frame - index * 2, fps, config: { damping: 20, stiffness: 90 } });
  const cycleOffset = Math.floor(frame / 7) + index * 3;
  const name = names.length > 0
    ? names[(cycleOffset + Math.floor(seededNumber(seed, index) * names.length)) % names.length]
    : `Entry ${index + 1}`;
  const y = index * 82;
  const pulse = Math.sin((frame + index * 9) / 8) * 0.5 + 0.5;

  return (
    <div
      style={{
        position: 'absolute',
        left: 74,
        top: y,
        width: 782,
        height: 62,
        borderRadius: 999,
        border: `1.5px solid rgba(98,185,70,${0.42 + pulse * 0.22})`,
        background: `linear-gradient(90deg, rgba(98,185,70,${0.13 + pulse * 0.08}), rgba(0,0,0,0.62))`,
        color: white,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 34px',
        fontFamily: 'Inter, Arial, sans-serif',
        fontSize: fitName(name),
        fontWeight: 800,
        letterSpacing: 0.8,
        opacity: clamp(appear, 0, 1) * 0.95,
        transform: `translateY(${interpolate(frame % 82, [0, 82], [0, -82])}px) scale(${0.97 + clamp(appear, 0, 1) * 0.03})`,
        boxShadow: `0 0 28px rgba(98,185,70,${0.08 + pulse * 0.12})`,
        overflow: 'hidden',
        textAlign: 'center',
        whiteSpace: 'nowrap',
      }}
    >
      {name}
    </div>
  );
}

function ConfettiPiece({ index, seed }: { index: number; seed: number }) {
  const frame = useCurrentFrame();
  const start = 218 + Math.floor(seededNumber(seed, index) * 24);
  const progress = clamp((frame - start) / 112, 0, 1);
  const x = seededNumber(seed, index + 1) * 1080;
  const drift = interpolate(seededNumber(seed, index + 2), [0, 1], [-170, 170]);
  const y = interpolate(progress, [0, 1], [-50, 1420 + seededNumber(seed, index + 3) * 540]);
  const rotate = interpolate(progress, [0, 1], [0, 720 + seededNumber(seed, index + 4) * 540]);
  const colors = [gold, white, deepGold, '#fff4c4'];
  const color = colors[index % colors.length];

  return (
    <div
      style={{
        position: 'absolute',
        left: x + drift * progress,
        top: y,
        width: 12 + seededNumber(seed, index + 5) * 22,
        height: 24 + seededNumber(seed, index + 6) * 26,
        background: color,
        borderRadius: 4,
        opacity: progress === 0 ? 0 : interpolate(progress, [0, 0.12, 0.84, 1], [0, 1, 1, 0]),
        transform: `rotate(${rotate}deg)`,
      }}
    />
  );
}

export function WinnerDrawVideo({
  giveawayTitle,
  prizeDescription,
  winnerName,
  entryCount,
  entryNames = [],
  drawDate,
}: WinnerDrawVideoProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const seed = hashString(`${giveawayTitle}:${winnerName}:${entryCount}:${drawDate}`);
  const safeEntryCount = Math.max(0, Number.isFinite(entryCount) ? entryCount : 0);
  const names = entryNames.length > 0 ? entryNames : [winnerName];
  const revealStart = 210;

  const introOpacity = interpolate(frame, [0, 15, 58, 86], [0, 1, 1, 0.22], { extrapolateRight: 'clamp' });
  const scanOpacity = interpolate(frame, [60, 85, 195, 225], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const reveal = spring({ frame: frame - revealStart, fps, config: { damping: 16, stiffness: 72 } });
  const logoScale = interpolate(frame, [0, 36, revealStart, revealStart + 36], [0.84, 1, 0.84, 0.9], { extrapolateRight: 'clamp' });
  const scanLine = interpolate(frame % 62, [0, 62], [60, 760]);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 12%, rgba(98,185,70,0.36), transparent 30%), linear-gradient(180deg, #071007 0%, ${black} 58%, #000 100%)`,
        overflow: 'hidden',
      }}
    >
      <Sequence from={58} durationInFrames={172}>
        <Audio
          src={staticFile('audio/lrp-draw-riser.wav')}
          volume={(audioFrame) =>
            interpolate(audioFrame, [0, 18, 135, 172], [0, 0.36, 0.36, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />
      </Sequence>

      <Sequence from={207} durationInFrames={38}>
        <Audio
          src={staticFile('audio/lrp-winner-hit.wav')}
          volume={(audioFrame) =>
            interpolate(audioFrame, [0, 3, 30, 38], [0, 0.95, 0.72, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />
      </Sequence>

      <Sequence from={214} durationInFrames={86}>
        <Audio
          src={staticFile('audio/lrp-crowd-cheer.wav')}
          volume={(audioFrame) =>
            interpolate(audioFrame, [0, 8, 66, 86], [0, 0.82, 0.72, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          }
        />
      </Sequence>

      <div
        style={{
          position: 'absolute',
          inset: -100,
          backgroundImage:
            'linear-gradient(rgba(98,185,70,0.075) 1px, transparent 1px), linear-gradient(90deg, rgba(98,185,70,0.075) 1px, transparent 1px)',
          backgroundSize: '70px 70px',
          transform: `translateY(${-(frame % 70)}px)`,
          opacity: 0.42,
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: 46,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          transform: `scale(${logoScale})`,
          zIndex: 3,
        }}
      >
        <div
          style={{
            width: 330,
            height: 330,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(98,185,70,0.22) 0%, rgba(98,185,70,0.10) 42%, rgba(0,0,0,0) 72%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 90px rgba(98,185,70,0.20)',
          }}
        >
          <Img src={staticFile('Color logo - no background.png')} style={{ width: 300, height: 300, objectFit: 'contain' }} />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: 388,
          left: 80,
          right: 80,
          opacity: introOpacity,
          textAlign: 'center',
          zIndex: 2,
        }}
      >
        <div
          style={{
            color: white,
            fontFamily: 'Georgia, serif',
            fontSize: giveawayTitle.length > 22 ? 58 : 68,
            lineHeight: 1.05,
            fontWeight: 900,
            textShadow: '0 8px 36px rgba(0,0,0,0.58)',
          }}
        >
          {giveawayTitle}
        </div>
        {prizeDescription ? (
          <div
            style={{
              color: mutedWhite,
              fontFamily: 'Inter, Arial, sans-serif',
              fontSize: 30,
              fontWeight: 600,
              marginTop: 18,
            }}
          >
            {prizeDescription}
          </div>
        ) : null}
      </div>

      <div style={{ position: 'absolute', inset: 0, opacity: scanOpacity, zIndex: 1 }}>
        <div
          style={{
            position: 'absolute',
            top: 548,
            left: 75,
            right: 75,
            height: 770,
            borderRadius: 44,
            border: '2px solid rgba(98,185,70,0.48)',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.72), rgba(5,12,5,0.56))',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 80px rgba(98,185,70,0.10), 0 0 64px rgba(98,185,70,0.12)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 48,
              left: 0,
              right: 0,
              height: 980,
            }}
          >
            {Array.from({ length: 16 }).map((_, i) => (
              <EntryPill key={i} index={i} seed={seed} names={names} />
            ))}
          </div>
          <div
            style={{
              position: 'absolute',
              top: scanLine,
              left: 0,
              right: 0,
              height: 5,
              background: `linear-gradient(90deg, transparent, ${brightGreen}, ${white}, ${brightGreen}, transparent)`,
              boxShadow: `0 0 44px ${brightGreen}`,
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            top: 1370,
            left: 80,
            right: 80,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              color: lrpGreen,
              fontFamily: 'Inter, Arial, sans-serif',
              fontSize: 40,
              fontWeight: 950,
              letterSpacing: 5,
              textTransform: 'uppercase',
            }}
          >
            Scanning Entries
          </div>
          <div
            style={{
              color: mutedWhite,
              fontFamily: 'Inter, Arial, sans-serif',
              fontSize: 30,
              fontWeight: 600,
              marginTop: 18,
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
          transform: `scale(${interpolate(clamp(reveal, 0, 1), [0, 1], [0.9, 1])})`,
          zIndex: 4,
        }}
      >
        {Array.from({ length: 96 }).map((_, i) => (
          <ConfettiPiece key={i} index={i} seed={seed} />
        ))}

        <div
          style={{
            position: 'absolute',
            top: 600,
            left: 70,
            right: 70,
            minHeight: 690,
            borderRadius: 58,
            background: `linear-gradient(145deg, rgba(214,169,58,0.22), rgba(0,0,0,0.78), rgba(98,185,70,0.10))`,
            border: `4px solid ${gold}`,
            boxShadow: '0 0 110px rgba(214,169,58,0.34), inset 0 0 90px rgba(255,255,255,0.04)',
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
              fontWeight: 950,
              letterSpacing: 8,
              textTransform: 'uppercase',
              marginBottom: 34,
            }}
          >
            Winner
          </div>
          <div
            style={{
              color: white,
              fontFamily: 'Georgia, serif',
              fontSize: winnerName.length > 22 ? 82 : 104,
              lineHeight: 1.04,
              fontWeight: 900,
              textAlign: 'center',
              textShadow: '0 10px 48px rgba(0,0,0,0.58)',
              wordBreak: 'break-word',
            }}
          >
            {winnerName}
          </div>
          <div
            style={{
              width: 520,
              height: 3,
              background: `linear-gradient(90deg, transparent, ${gold}, transparent)`,
              margin: '46px 0 34px',
            }}
          />
          <div
            style={{
              color: 'rgba(247,255,242,0.86)',
              fontFamily: 'Inter, Arial, sans-serif',
              fontSize: 31,
              fontWeight: 650,
              textAlign: 'center',
              lineHeight: 1.35,
            }}
          >
            Congratulations from Lake Ride Pros
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
