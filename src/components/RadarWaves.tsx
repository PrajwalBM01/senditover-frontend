const RadarWaves = () => {
  // We'll create 8 circles for a clean, performing look
  const waveCount = 8;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 200 200"
    >
      <defs>
        <style>{`
          .wave {
            transform-origin: center;
            transform-box: fill-box; 
            fill: none;
            stroke: oklch(0.437 0.078 188.216);
            stroke-width: 1.5;
            opacity: 0;
            animation: pulse 3s linear infinite;
          }

          @keyframes pulse {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            10% {
              opacity: 0.4;
            }
            100% {
              transform: scale(1.8); /* Expand slightly beyond the viewbox */
              opacity: 0;
            }
          }
        `}</style>
      </defs>

      {[...Array(waveCount)].map((_, i) => (
        <circle
          key={i}
          cx="100"
          cy="100"
          r="80"
          className="wave"
          style={{
            // stagger the waves evenly
            animationDelay: `${i * (4 / waveCount)}s`,
          }}
        />
      ))}
    </svg>
  );
};

export default RadarWaves;
