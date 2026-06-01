type Props = { index: string; name: string };

export function SectionLabel({ index, name }: Props) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted)] mb-3">
      <span className="text-[var(--color-violet)]">[</span> {index} / {name} <span className="text-[var(--color-violet)]">]</span>
    </p>
  );
}
