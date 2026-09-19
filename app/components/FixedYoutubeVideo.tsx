"use client";

import React from "react";

interface FixedYoutubeVideoProps {
  embeddedUrl?: string | null;
  youtubeUrl?: string | null;
  title?: string;
  className?: string;
}

/**
 * Extracts a YouTube video ID and returns a valid embed URL.
 * Handles standard watch URLs, short youtu.be links, shorts, and raw embed links.
 */
export function getYouTubeEmbedUrl(rawUrl?: string | null): string | null {
  if (!rawUrl) return null;
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  try {
    // 1. Direct embed URL
    if (trimmed.includes("youtube.com/embed/")) {
      return trimmed;
    }

    // 2. Short youtu.be link
    const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch && shortMatch[1]) {
      return `https://www.youtube.com/embed/${shortMatch[1]}`;
    }

    // 3. Standard watch link (?v=...)
    const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch && watchMatch[1]) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`;
    }

    // 4. YouTube shorts
    const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch && shortsMatch[1]) {
      return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }

    // 5. Bare 11-char video ID fallback
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return `https://www.youtube.com/embed/${trimmed}`;
    }

    return null;
  } catch {
    return null;
  }
}

export function FixedYoutubeVideo({
  embeddedUrl,
  youtubeUrl,
  title = "Group Pitch Video",
  className = "",
}: FixedYoutubeVideoProps) {
  const urlToParse = embeddedUrl || youtubeUrl;
  const embedSrc = getYouTubeEmbedUrl(urlToParse);

  if (!embedSrc) {
    return (
      <div
        className={`w-full aspect-video rounded-sm bg-[#141211] border border-white/10 flex flex-col items-center justify-center p-6 text-center space-y-3 font-mono shadow-inner ${className}`}
      >
        <div className="w-12 h-12 rounded-sm bg-[#1d1b1a] border border-white/10 flex items-center justify-center text-[#83958d]">
          <svg className="w-6 h-6 text-[#83958d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#e8e1df] uppercase tracking-wider">
            NO PITCH VIDEO AVAILABLE
          </p>
          <p className="text-[10px] text-[#83958d]">
            This pitching group has not linked a YouTube presentation yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full aspect-video rounded-sm overflow-hidden bg-[#151312] border border-white/10 shadow-2xl ${className}`}
    >
      <iframe
        className="w-full h-full border-0"
        src={embedSrc}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

export default FixedYoutubeVideo;
