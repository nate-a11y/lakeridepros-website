import { inngest } from '../client';
import { requestExternalWinnerVideoRender, markWinnerVideoJobFailed } from '@/lib/giveaways/winner-video';

export const generateWinnerVideo = inngest.createFunction(
  {
    id: 'generate-giveaway-winner-video',
    name: 'Generate Giveaway Winner Video',
    retries: 1,
    concurrency: {
      limit: 1,
      key: 'event.data.giveawayId',
    },
    triggers: [{ event: 'giveaway/winner-video.generate' }],
  },
  async ({ event, step }) => {
    const { jobId, giveawayId } = event.data as { jobId: string; giveawayId: string };

    try {
      const result = await step.run('render-and-upload-winner-video', async () => {
        return requestExternalWinnerVideoRender({ jobId, giveawayId });
      });

      return {
        message: 'Winner video generated',
        jobId,
        giveawayId,
        ...result,
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown render error';
      await step.run('mark-render-failed', async () => {
        await markWinnerVideoJobFailed(jobId, message);
      });
      throw err;
    }
  }
);
