'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function EscalatorFloat() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="fixed right-0 top-1/2 -translate-y-1/2 z-[998] flex items-center"
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Expanded panel */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${expanded ? 'max-w-[260px] opacity-100' : 'max-w-0 opacity-0'}
        `}
      >
        <div className="bg-white rounded-l-xl shadow-2xl border border-r-0 border-gray-200 p-4 w-[260px]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#2B6CB0] to-[#0891b2] flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l6 6-6 6M13 7l6 6-6 6" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#222] leading-tight">Escalator Parts</h3>
              <p className="text-[11px] text-[#888]">Premium Components</p>
            </div>
          </div>
          <p className="text-[12px] text-[#666] leading-relaxed mb-3">
            Steps, rollers, chains, comb plates, handrails & drive systems for all major brands.
          </p>
          <Link
            href="/products/escalator"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#2B6CB0] to-[#0891b2] text-white text-sm font-semibold py-2.5 rounded-lg hover:shadow-lg transition-all duration-200 group"
          >
            View All Parts
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Tab trigger */}
      <Link
        href="/products/escalator"
        className="
          flex flex-col items-center justify-center gap-1
          bg-gradient-to-b from-[#2B6CB0] to-[#0891b2]
          text-white py-4 px-2 rounded-l-lg
          shadow-lg hover:shadow-xl
          transition-all duration-300
          hover:px-3
          group
        "
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
      >
        <svg className="w-5 h-5 mb-1 rotate-0" style={{ writingMode: 'horizontal-tb' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l6 6-6 6M13 7l6 6-6 6" />
        </svg>
        <span className="text-[13px] font-bold tracking-wider whitespace-nowrap">
          ESCALATOR
        </span>
        <span className="text-[10px] font-medium opacity-80 tracking-wide whitespace-nowrap">
          PARTS
        </span>
      </Link>
    </div>
  );
}
