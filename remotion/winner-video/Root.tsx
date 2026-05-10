import React from 'react';
import { Composition } from 'remotion';
import {
  defaultWinnerDrawProps,
  WINNER_DRAW_DURATION_FRAMES,
  WINNER_DRAW_FPS,
  WINNER_DRAW_HEIGHT,
  WINNER_DRAW_VIDEO_ID,
  WINNER_DRAW_WIDTH,
} from './types';
import { WinnerDrawVideo } from './WinnerDrawVideo';

export function RemotionRoot() {
  return (
    <Composition
      id={WINNER_DRAW_VIDEO_ID}
      component={WinnerDrawVideo as unknown as React.FC<Record<string, unknown>>}
      durationInFrames={WINNER_DRAW_DURATION_FRAMES}
      fps={WINNER_DRAW_FPS}
      width={WINNER_DRAW_WIDTH}
      height={WINNER_DRAW_HEIGHT}
      defaultProps={defaultWinnerDrawProps}
    />
  );
}
