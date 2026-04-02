'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  if (!content) return null;

  return (
    <div className={`prose max-w-none 
      prose-headings:text-gray-900 prose-headings:font-semibold
      prose-h2:text-[20px] prose-h3:text-[17px] prose-h4:text-[15px]
      prose-p:text-[#555] prose-p:text-[15px] prose-p:leading-relaxed
      prose-a:text-[#2B6CB0] prose-a:no-underline hover:prose-a:underline
      prose-strong:text-gray-900
      prose-ul:text-gray-700 prose-ol:text-gray-700
      prose-li:text-gray-700
      prose-table:border prose-table:border-gray-200
      prose-th:bg-gray-50 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:text-sm prose-th:font-medium
      prose-td:px-3 prose-td:py-2 prose-td:text-sm prose-td:border-t
      prose-img:max-w-full prose-img:h-auto
      prose-code:text-[#2B6CB0] prose-code:bg-blue-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
      prose-pre:bg-gray-900 prose-pre:rounded-lg
      prose-blockquote:border-l-[#2B6CB0] prose-blockquote:text-gray-600
      ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
