import { describe, expect, it } from 'vitest';
import { renderPage } from '../src/lib/render.js';

describe('renderPage', () => {
  const samplePage = {
    slug: 'india-b2b',
    template_type: 'geo' as const,
    meta: {
      title: 'B2B Data India',
      description: 'Verified contacts',
      canonical_url: 'https://zintlr.com/india-b2b',
    },
    sections: {
      hero: {
        title: 'Find the 100% Accurate B2B database for India',
        subheading: 'Verified data.',
        ctaLabel: 'Get Started',
        ctaUrl: '/signup',
        trustBadges: ['GDPR', 'SOC 2'],
      },
      faq: { items: [{ q: 'Q1?', a: 'A1.' }] },
      cta: { heading: 'Ready?', primaryLabel: 'Start', primaryUrl: '/signup' },
    },
  };

  it('renders <!DOCTYPE html> wrapper with title + canonical + css link', () => {
    const html = renderPage(samplePage, '/_static/main.css');
    expect(html).toMatch(/^<!DOCTYPE html>/);
    expect(html).toContain('<title>B2B Data India</title>');
    expect(html).toContain('href="https://zintlr.com/india-b2b"');
    expect(html).toContain('rel="canonical"');
    expect(html).toContain('href="/_static/main.css"');
  });

  it('includes the hero title from the rich template', () => {
    const html = renderPage(samplePage, '/_static/main.css');
    expect(html).toContain('Find the 100% Accurate B2B database for India');
  });

  it('includes the FAQ question', () => {
    const html = renderPage(samplePage, '/_static/main.css');
    expect(html).toContain('Q1?');
  });

  it('html size is more than 5kb (rich template)', () => {
    const html = renderPage(samplePage, '/_static/main.css');
    expect(Buffer.byteLength(html, 'utf-8')).toBeGreaterThan(5000);
  });
});
