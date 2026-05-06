import { GradientBackground } from "./ui/paper-design-shader-background";

export default function DemoOne() {
  return (
    <main style={{ position: 'relative', minHeight: '100vh', height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <GradientBackground />
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: -10, backgroundColor: 'rgba(0,0,0,0.2)' }} />

      <section style={{ padding: '0 1.5rem' }}>
        <h1 style={{ color: 'white', textAlign: 'center', textWrap: 'balance', fontWeight: 300, letterSpacing: '-0.025em', fontSize: '3rem' }}>
          Backgrounds are awesome :)
        </h1>
      </section>
    </main>
  );
}
