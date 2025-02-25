import React from "react";

import { Icon, Icons } from "@/components/Icon";

interface RandomMovieButtonProps {
  countdown: number | null;
  onClick: () => void;
  randomMovieTitle: string | null;
}

export function RandomMovieButton({
  countdown,
  onClick,
  randomMovieTitle,
}: RandomMovieButtonProps) {
  return (
    <div className="w-full max-w-screen-xl mx-auto px-4">
      <div className="flex items-center justify-center">
        <button
          type="button"
          className="flex items-center space-x-2 rounded-full px-4 text-white py-2 bg-pill-background bg-opacity-50 hover:bg-pill-backgroundHover transition-[background,transform] duration-100 hover:scale-105"
          onClick={onClick}
        >
          <span className="flex items-center">
            {countdown !== null && countdown > 0 ? (
              <div className="flex items-center">
                <span>Cancel Countdown</span>
                <Icon
                  icon={Icons.X}
                  className="text-2xl ml-[4.5px] mb-[-0.7px]"
                />
              </div>
            ) : (
              <div className="flex items-center">
                <span>Watch Something Random</span>
                <img
                  src="/lightbar-images/dice.svg"
                  alt="Dice"
                  style={{ marginLeft: "8px" }}
                />
              </div>
            )}
          </span>
        </button>
      </div>

      {/* Random Movie Countdown */}
      {randomMovieTitle && countdown !== null && (
        <div className="mt-4 mb-4 text-center">
          <p>
            Now Playing <span className="font-bold">{randomMovieTitle}</span> in{" "}
            {countdown}
          </p>
        </div>
      )}
    </div>
  );
}
