'use client';

import mermaid from 'mermaid';
import { useEffect, useId, useRef } from 'react';

export function Mermaid({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useId().replaceAll(':', '');

  useEffect(() => {
    let active = true;

    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: document.documentElement.classList.contains('dark') ? 'dark' : 'neutral',
    });

    void mermaid.render(`mermaid-${id}`, chart).then(({ svg }) => {
      if (active && containerRef.current) {
        containerRef.current.innerHTML = svg;
      }
    });

    return () => {
      active = false;
    };
  }, [chart, id]);

  return <div className="mermaid-diagram" ref={containerRef} />;
}
