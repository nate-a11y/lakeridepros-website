export interface WinnerDrawVideoProps {
  giveawayTitle: string;
  prizeDescription?: string | null;
  winnerName: string;
  entryCount: number;
  entryNames?: string[];
  drawDate: string;
  brand?: 'lake-ride-pros';
}

export const WINNER_DRAW_VIDEO_ID = 'WinnerDrawVideo';
export const WINNER_DRAW_FPS = 30;
export const WINNER_DRAW_DURATION_FRAMES = 300; // 10 seconds
export const WINNER_DRAW_WIDTH = 1080;
export const WINNER_DRAW_HEIGHT = 1920;

export const defaultWinnerDrawProps: WinnerDrawVideoProps = {
  giveawayTitle: 'Lake Ride Pros Concert Ticket Giveaway',
  prizeDescription: 'Concert Ticket Giveaway',
  winnerName: 'Winner Name',
  entryCount: 128,
  entryNames: ['Ashley Morgan', 'Chris Taylor', 'Jordan Blake', 'Taylor Reed', 'Morgan Carter', 'Jamie Parker'],
  drawDate: new Date().toISOString(),
  brand: 'lake-ride-pros',
};
