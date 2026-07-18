import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Create a window object for DOMPurify on the server
const window = new JSDOM('').window as any;
const purify = DOMPurify(window);

const ALLOWED_TAGS = [
  'p', 'br',
  'h1', 'h2', 'h3',
  'strong', 'em', 'u',
  'a',
  'ul', 'ol', 'li',
  'blockquote',
  'pre', 'code',
  'img',
  'hr',
];

const ALLOWED_ATTRIBUTES = {
  'a': ['href', 'target', 'rel'],
  'img': ['src', 'alt', 'title', 'width', 'height'],
};

export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';

  return purify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: Object.keys(ALLOWED_ATTRIBUTES).flatMap(tag =>
      ALLOWED_ATTRIBUTES[tag as keyof typeof ALLOWED_ATTRIBUTES] || []
    ),
    KEEP_CONTENT: true,
    RETURN_DOM: false,
  }) as string;
}
