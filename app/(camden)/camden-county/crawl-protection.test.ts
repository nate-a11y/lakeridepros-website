import { describe, expect, it } from 'vitest';
import robots from '@/app/robots';
import { metadata } from './layout';

describe('Camden County crawl protection', () => {
  it('blocks the portal for every configured crawler', () => {
    const rules = robots().rules;
    const ruleList = Array.isArray(rules) ? rules : [rules];

    expect(ruleList).not.toHaveLength(0);
    for (const rule of ruleList) {
      expect(rule.disallow).toContain('/camden-county');
    }
  });

  it('marks every portal page as non-indexable', () => {
    expect(metadata.robots).toMatchObject({
      index: false,
      follow: false,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      },
    });
  });
});
