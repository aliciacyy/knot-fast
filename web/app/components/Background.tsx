export default function ParallaxBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: -1 }}
    >
      <div className="absolute inset-0 bg-warm" />
      <div className="absolute inset-0 bg-warm-layer1" />
      <div className="absolute inset-0 bg-warm-layer2" />
      <div className="absolute inset-0 bg-grain opacity-[0.08]" />
    </div>
  );
}
