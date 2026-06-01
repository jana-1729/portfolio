"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { runCommand } from "@/components/terminal/command-handlers";
import { profile } from "@/lib/data";

type Line = { kind: "in" | "out"; text: string };

export function TerminalOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [lines, setLines] = useState<Line[]>([
    { kind: "out", text: `${profile.name.toLowerCase().replace(/ /g, "")}@portfolio:~$ type 'help' for commands` },
  ]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 100); }, [open]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [lines]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const cmd = input;
    setInput("");
    const result = runCommand(cmd);
    if (result.output === "__CLEAR__") { setLines([]); return; }
    setLines((l) => [...l, { kind: "in", text: cmd }, { kind: "out", text: result.output }]);
    if (result.navigate) {
      if (result.navigate.startsWith("#")) {
        document.getElementById(result.navigate.slice(1))?.scrollIntoView({ behavior: "smooth" });
        onClose();
      } else {
        window.open(result.navigate, "_blank");
      }
    }
    if (result.close) setTimeout(onClose, 400);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Terminal"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ scale: 0.96, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 10 }}
            className="w-full max-w-3xl h-[70vh] glass rounded-2xl font-mono text-sm text-[var(--color-fg)] overflow-hidden flex flex-col"
          >
            <div className="flex items-center gap-2 px-4 py-2 border-b border-[var(--color-border)]">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
              <span className="ml-3 text-xs text-[var(--color-muted)]">~/janarthanan — zsh</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto leading-relaxed">
              {lines.map((l, i) => (
                <div key={i} className={l.kind === "in" ? "text-[var(--color-cyan)]" : "whitespace-pre-wrap"}>
                  {l.kind === "in" ? <span className="text-[var(--color-violet)]">$ </span> : null}
                  {l.text}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={submit} className="border-t border-[var(--color-border)] p-3 flex items-center gap-2">
              <span className="text-[var(--color-violet)]">$</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-transparent outline-none placeholder:text-[var(--color-muted)]"
                placeholder="type a command and press enter"
                autoComplete="off"
                spellCheck={false}
                aria-label="terminal input"
              />
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
