import { useCallback } from "react";

const useSafeZone = (selfContainer: React.RefObject<HTMLDivElement | null>) => {
  const getRandomSafePos = useCallback(() => {
    if (!selfContainer.current) return { x: 0, y: 0 };

    const rect = selfContainer.current.getBoundingClientRect();
    const padding = 60; // Space around the center card
    const itemSize = 120; // Estimated size of the peer div

    let x = 0,
      y = 0;
    let isInside = true;
    let attempts = 0;

    while (isInside && attempts < 50) {
      // Use window.innerWidth for X! (Your previous code used innerHeight for both)
      x = Math.random() * (window.innerWidth - itemSize);
      y = Math.random() * (window.innerHeight - itemSize);

      const overlapsX =
        x + itemSize > rect.left - padding && x < rect.right + padding;
      const overlapsY =
        y + itemSize > rect.top - padding && y < rect.bottom + padding;

      if (!(overlapsX && overlapsY)) {
        isInside = false;
      }
      attempts++;
    }
    return { x, y };
  }, [selfContainer]);

  return { getRandomSafePos };
};

export default useSafeZone;
