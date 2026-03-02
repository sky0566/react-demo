'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function usePageTracking() {
  const pathname = usePathname();

  useEffect(() => {
    // Don't track admin pages
    if (pathname.startsWith('/admin')) return;

    const track = async () => {
      try {
        await fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page_path: pathname,
            page_title: document.title,
            referrer: document.referrer,
          }),
        });
      } catch {
        // Silent fail - tracking should not break the app
      }
    };

    // Small delay to let the page title update
    const timer = setTimeout(track, 500);
    return () => clearTimeout(timer);
  }, [pathname]);
}
