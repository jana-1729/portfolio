import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-5">
      <div className="text-center">
        <p className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-3">404</p>
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          You took a <span className="text-gradient">wrong turn.</span>
        </h1>
        <Link href="/" className="font-mono text-sm text-[var(--color-violet)] hover:underline">← back home</Link>
      </div>
    </main>
  );
}
