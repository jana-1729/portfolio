export function GridBg() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 grid-bg opacity-40"
      style={{ maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)" }}
    />
  );
}
