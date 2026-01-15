import { useEffect, useRef } from "react";
import "./VanillaHorizontalMenu.css";

interface MenuItem {
  id: string;
  label: string;
}

interface VanillaHorizontalMenuProps {
  items: MenuItem[];
}

export const VanillaHorizontalMenu = ({
  items,
}: VanillaHorizontalMenuProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const prevButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const scroller = scrollerRef.current;
    const prevButton = prevButtonRef.current;
    const nextButton = nextButtonRef.current;

    if (!container || !scroller || !prevButton || !nextButton) return;

    // Update navigation button visibility based on scroll position
    const updateNavigationState = () => {
      const isAtStart = scroller.scrollLeft <= 0;
      const isAtEnd =
        scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 1;

      prevButton.style.display = isAtStart ? "none" : "flex";
      nextButton.style.display = isAtEnd ? "none" : "flex";
    };

    // Scroll by a fixed amount (adjust as needed)
    const scrollAmount = 300;

    const handlePrevClick = () => {
      scroller.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    };

    const handleNextClick = () => {
      scroller.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    };

    // Handle mouse wheel for horizontal scrolling
    // USER ACTIONS TO SCROLL HORIZONTALLY:
    // 1. Mouse: Shift + scroll wheel (vertical scroll converts to horizontal)
    // 2. Trackpad: Two-finger horizontal swipe (native gesture)
    // 3. Arrow buttons: Click left/right navigation buttons
    const handleWheel = (e: WheelEvent) => {
      // Only handle horizontal scroll or vertical scroll with shift key
      if (Math.abs(e.deltaX) > 0 || e.shiftKey) {
        e.preventDefault();

        // Use deltaX for trackpad horizontal swipe, deltaY for shift+wheel
        const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY;

        scroller.scrollBy({
          left: delta,
          behavior: "auto", // Instant scroll for better wheel feel
        });
      }
    };

    // Initial state
    updateNavigationState();

    // Event listeners
    prevButton.addEventListener("click", handlePrevClick);
    nextButton.addEventListener("click", handleNextClick);
    scroller.addEventListener("scroll", updateNavigationState);
    scroller.addEventListener("wheel", handleWheel, { passive: false });

    // Handle window resize
    const resizeObserver = new ResizeObserver(() => {
      updateNavigationState();
    });
    resizeObserver.observe(scroller);

    // Cleanup
    return () => {
      prevButton.removeEventListener("click", handlePrevClick);
      nextButton.removeEventListener("click", handleNextClick);
      scroller.removeEventListener("scroll", updateNavigationState);
      scroller.removeEventListener("wheel", handleWheel);
      resizeObserver.disconnect();
    };
  }, [items]);

  return (
    <div className="vanilla-menu-container" ref={containerRef}>
      <button
        ref={prevButtonRef}
        className="vanilla-arrow vanilla-arrow-prev"
        aria-label="Scroll left"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.5 15L7.5 10L12.5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="vanilla-menu-scroller" ref={scrollerRef}>
        <div className="vanilla-menu-track">
          {items.map((item) => (
            <div key={item.id} className="vanilla-menu-slide">
              <div className="vanilla-chip">
                <span className="vanilla-chip-label">{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        ref={nextButtonRef}
        className="vanilla-arrow vanilla-arrow-next"
        aria-label="Scroll right"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.5 5L12.5 10L7.5 15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};
