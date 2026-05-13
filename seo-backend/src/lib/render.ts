import { renderToString } from 'react-dom/server';
import { createElement } from 'react';
import GeoTemplate from '../../templates/components/templates/GeoTemplate.jsx';
import IndustryTemplate from '../../templates/components/templates/IndustryTemplate.jsx';
import PillarTemplate from '../../templates/components/templates/PillarTemplate.jsx';
import SolutionTemplate from '../../templates/components/templates/SolutionTemplate.jsx';
import ConversionTemplate from '../../templates/components/templates/ConversionTemplate.jsx';

type TemplateType = 'geo' | 'industry' | 'pillar' | 'solution' | 'conversion';

const TEMPLATES: Record<TemplateType, any> = {
  geo: GeoTemplate,
  industry: IndustryTemplate,
  pillar: PillarTemplate,
  solution: SolutionTemplate,
  conversion: ConversionTemplate,
};

export interface RenderablePage {
  slug: string;
  template_type: TemplateType;
  meta: {
    title: string;
    description: string;
    canonical_url: string;
    og_image_url?: string;
  };
  sections: Record<string, any>;
}

export function renderPage(page: RenderablePage, cssPath: string): string {
  const Template = TEMPLATES[page.template_type];
  if (!Template) throw new Error(`Unknown template_type=${page.template_type}`);

  const body = renderToString(createElement(Template, { sections: page.sections }));

  const og = page.meta.og_image_url
    ? `<meta property="og:image" content="${escapeHtml(page.meta.og_image_url)}" />`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(page.meta.title)}</title>
<meta name="description" content="${escapeHtml(page.meta.description)}" />
<link rel="canonical" href="${escapeHtml(page.meta.canonical_url)}" />
<meta property="og:title" content="${escapeHtml(page.meta.title)}" />
<meta property="og:description" content="${escapeHtml(page.meta.description)}" />
${og}
<link rel="stylesheet" href="${escapeHtml(cssPath)}" />
</head>
<body class="antialiased text-slate-900 bg-white">
${body}
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>'"]/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&apos;', '"': '&quot;',
  })[c] ?? c);
}
