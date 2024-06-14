import React, { useEffect, useRef, useState } from "react";

import { MediaItem } from "@/utils/mediaTypes";
import { get } from "@/backend/metadata/tmdb";
import { conf } from "@/setup/config";

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
  const [style, setStyle] = useState<StyleState>({
    opacity: 0,
    visibility: "hidden",
  });
  // Use any or a more generic type here
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null); // State for storing API errors

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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

  useEffect(() => {
    const fetchData = async () => {
      if (!isVisible) return; // Ensure fetchData does not proceed if the modal is not visible
  
      try {
        const mediaTypePath = media.type === 'show' ? 'tv' : media.type;
        const result = await get<any>(`/${mediaTypePath}/${media.id}`, {
          api_key: conf().TMDB_READ_API_KEY,
          language: "en-US",
        });
        setData(result);
        setError(null); // Reset error state on successful fetch
      } catch (err) {
        setError('Failed to fetch media data');
        console.error(err);
      }
    };
  
    fetchData();
  }, [media.id, media.type, isVisible]); // Dependency array remains the same

  if (!isVisible && style.visibility === "hidden") return null;

  console.log(data);
  // Handle error state in the UI
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div
      className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-100"
      style={{ opacity: style.opacity, visibility: style.visibility }}
    >
      <div
        ref={modalRef}
        className="rounded-xl p-3 bg-mediaCard-hoverBackground flex justify-center items-center transition-opacity duration-200 w-full max-w-3xl"
        style={{ opacity: style.opacity }}
      >
        <div className="aspect-w-16 aspect-h-9 w-full">
          <img 
            src={`https://image.tmdb.org/t/p/original/${data?.backdrop_path}`} 
            className="rounded-xl object-cover w-full h-full" 
          />
        </div>
      </div>
    </div>
  );
}
