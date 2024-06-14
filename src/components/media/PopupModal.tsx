import React, { useEffect, useRef, useState } from "react";

import { MediaItem } from "@/utils/mediaTypes";

interface PopupModalProps {
  isVisible: boolean;
  onClose: () => void;
  playingTitle: {
    id: string;
    title: string;
    type: string;
  };
  media: MediaItem;
}

// Define the type for the style state
type StyleState = {
  opacity: number;
  visibility: "visible" | "hidden" | undefined;
};

export function PopupModal({
  isVisible,
  onClose,
  playingTitle,
  media,
}: PopupModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  // Use the StyleState type for the style state
  const [style, setStyle] = useState<StyleState>({
    opacity: 0,
    visibility: "hidden",
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (isVisible) {
      setStyle({ opacity: 1, visibility: "visible" });
    } else {
      setStyle({ opacity: 0, visibility: "hidden" });
    }
  }, [isVisible]);

  if (!isVisible && style.visibility === "hidden") return null;

  // In hindsight we dont need the store but lets keep it until discover
  // page works bc maybe we have to hack it into there
  return (
    <div
      className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-100"
      style={{ opacity: style.opacity, visibility: style.visibility }}
    >
      <div
        ref={modalRef}
        className="min-w-96 min-h-64 rounded-xl bg-mediaCard-hoverBackground flex justify-center items-center transition-opacity duration-200"
        style={{ opacity: style.opacity }}
      >
        {media.title}
      </div>
    </div>
  );
}
