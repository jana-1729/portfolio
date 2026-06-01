"use client";
import { useEffect } from "react";

type Options = {
  key: string;
  meta?: boolean;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  preventDefault?: boolean;
};

export function useKeyboardShortcut(opts: Options, handler: (e: KeyboardEvent) => void) {
  const { key, meta, ctrl, alt, shift, preventDefault = true } = opts;
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const metaOk = meta ? (e.metaKey || e.ctrlKey) : true;
      const ctrlOk = ctrl ? e.ctrlKey : true;
      const altOk = alt ? e.altKey : (!e.altKey || !alt);
      const shiftOk = shift ? e.shiftKey : (!e.shiftKey || !shift);
      if (e.key.toLowerCase() === key.toLowerCase() && metaOk && ctrlOk && altOk && shiftOk) {
        if (preventDefault) e.preventDefault();
        handler(e);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [key, meta, ctrl, alt, shift, preventDefault, handler]);
}
