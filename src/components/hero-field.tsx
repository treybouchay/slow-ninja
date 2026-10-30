const METEORS = [
  {
    left: "12%",
    top: "68%",
    delay: "0.8s",
    duration: "8.4s",
    x: "150px",
    y: "64px",
    angle: "28deg",
  },
  {
    left: "58%",
    top: "80%",
    delay: "3.6s",
    duration: "9.2s",
    x: "170px",
    y: "42px",
    angle: "22deg",
  },
] as const;

export function HeroField() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[var(--night)]"
    >
      <div className="absolute inset-0 bg-[#070d16]" />
      <div className="hero-sky absolute inset-0">
        <div className="starfield absolute inset-0 opacity-80" />
        {METEORS.map((meteor) => (
          <span
            key={`${meteor.left}-${meteor.top}`}
            className="structs-meteor absolute"
            style={{
              left: meteor.left,
              top: meteor.top,
              animationDelay: meteor.delay,
              animationDuration: meteor.duration,
              ["--meteor-x" as string]: meteor.x,
              ["--meteor-y" as string]: meteor.y,
              ["--meteor-angle" as string]: meteor.angle,
            }}
          />
        ))}
      </div>
      <div className="space-grid hero-grid-fade absolute inset-0 opacity-25" />
    </div>
  );
}
