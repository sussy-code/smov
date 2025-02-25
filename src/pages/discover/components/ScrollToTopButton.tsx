import { useEffect, useState } from "react";

import { Icon, Icons } from "@/components/Icon";

export function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    const scrolled = window.scrollY > 300;
    setIsVisible(scrolled);
  };

  useEffect(() => {
    const handleScroll = () => {
      const timeout = setTimeout(toggleVisibility, 100);
      return () => clearTimeout(timeout);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className={`absolute inset-0 mx-auto h-[50px] w-[200px] rounded-full blur-[50px] opacity-50 pointer-events-none z-0 ${
          isVisible ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{
          backgroundImage: `linear-gradient(to right, rgba(var(--colors-buttons-purpleHover)), rgba(var(--colors-progress-filled)))`,
          transition: "opacity 0.4s ease-in-out, transform 0.4s ease-in-out",
        }}
      />
      <button
        type="button"
        onClick={scrollToTop}
        className={`relative flex items-center justify-center space-x-2 rounded-full px-4 py-3 text-lg font-semibold text-white bg-pill-background bg-opacity-80 hover:bg-pill-backgroundHover transition-opacity hover:scale-105 duration-500 ease-in-out ${
          isVisible ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{
          transition: "opacity 0.4s ease-in-out, transform 0.4s ease-in-out",
        }}
      >
        <Icon icon={Icons.CHEVRON_UP} className="text-2xl z-10" />
        <span className="z-10">Back to top</span>
      </button>
    </div>
  );
}
