"use client";
import { useRef, useEffect } from "react";

export default function MermaidElement({ value }) {
  const mermaidRef = useRef(null);

  useEffect(() => {
    if (!mermaidRef.current) return;
    // Mermaid is ~1 MB of JavaScript. Load it only when a page actually contains
    // a diagram, so it stays out of the bundle for every other page.
    let cancelled = false;
    import("mermaid").then(({ default: mermaid }) => {
      if (cancelled) return;
      mermaid.initialize({ startOnLoad: false });
      mermaid.run({ nodes: [mermaidRef.current.querySelector(".mermaid")] });
    });
    return () => {
      cancelled = true;
    };
  }, [value]);

  return (
    <div contentEditable={false}>
      <div ref={mermaidRef}>
        <pre className="mermaid">{value}</pre>
      </div>
    </div>
  );
}
