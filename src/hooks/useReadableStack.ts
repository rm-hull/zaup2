import { useEffect, useState } from "react";
import type { RawSourceMap } from "source-map-js";

const STACK_LINE_RE = /\((https?:\/\/.*?):(\d+):(\d+)\)/;

// Simple in-memory cache for source maps so we don't fetch repeatedly
const sourceMapCache = new Map<string, RawSourceMap>();

async function decodeStackTrace(stack: string): Promise<string> {
  const lines = stack.split("\n");
  const decoded: string[] = [];

  // lazy-load source-map only when needed
  const { SourceMapConsumer } = await import("source-map-js");

  for (const line of lines) {
    const match = STACK_LINE_RE.exec(line);
    if (!match) {
      decoded.push(line);
      continue;
    }

    const [, url, lineNum, colNum] = match;

    try {
      const cleanUrl = url.split("?")[0].split("#")[0];
      const mapUrl = `${cleanUrl}.map`;
      let rawMap = sourceMapCache.get(mapUrl);
      if (!rawMap) {
        const res = await fetch(mapUrl);
        if (!res.ok) throw new Error("Map not found");
        rawMap = (await res.json()) as RawSourceMap;
        sourceMapCache.set(mapUrl, rawMap);
      }

      const consumer = new SourceMapConsumer(rawMap);
      const pos = consumer.originalPositionFor({
        line: Number(lineNum),
        column: Number(colNum),
      });

      if (pos.source) {
        const fnName = pos.name ? ` (${pos.name})` : "";
        decoded.push(`${line}\n      → ${pos.source}:${pos.line}:${pos.column}${fnName}`);
      } else {
        decoded.push(line);
      }
    } catch (e) {
      console.error("Failed to decode stack line", line, e);
      decoded.push(line);
    }
  }

  return decoded.join("\n");
}

export function useReadableStack(error: Error | null) {
  const [stack, setStack] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!error?.stack) return;

    let cancelled = false;

    queueMicrotask(() => {
      if (!cancelled) {
        setStack(error.stack);
        setLoading(true);
      }
    });

    // eslint-disable-next-line promise/no-promise-in-callback
    void decodeStackTrace(error.stack)
      .then((decoded) => {
        if (!cancelled) setStack(decoded);
        return;
      })
      .catch((err) => {
        console.error("Failed to decode stack trace:", err);
        if (!cancelled) setStack(error.stack);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [error]);

  return { stack, loading };
}
