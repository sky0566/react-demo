import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks.
 * Allows safe HTML tags (headings, lists, tables, images, links)
 * while stripping dangerous elements (script, iframe, event handlers).
 */
export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'strong', 'b', 'em', 'i', 'u', 's', 'del', 'ins', 'mark', 'small', 'sub', 'sup',
      'ul', 'ol', 'li',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption', 'colgroup', 'col',
      'a', 'img',
      'div', 'span', 'section', 'article', 'header', 'footer', 'nav', 'main', 'aside',
      'figure', 'figcaption', 'blockquote', 'pre', 'code',
      'dl', 'dt', 'dd',
    ],
    ALLOWED_ATTR: [
      'href', 'target', 'rel', 'title',
      'src', 'alt', 'width', 'height', 'loading',
      'class', 'id', 'style',
      'colspan', 'rowspan', 'scope',
    ],
    ALLOW_DATA_ATTR: false,
  });
}
