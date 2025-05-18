import React from "react";

export default function BackHeader({ onBack }) {
  return (
    <button
      className="absolute top-4 left-4 flex items-center gap-1 text-primary font-bold text-lg bg-white/80 rounded-full px-2 py-1 shadow"
      onClick={onBack}
      aria-label="Retour"
      style={{ zIndex: 10 }}
    >
      <svg 
        width="24" 
        height="24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="feather feather-arrow-left"
      >
        <line x1="19" y1="12" x2="5" y2="12"/>
        <polyline points="12 19 5 12 12 5"/>
      </svg>
      Retour
    </button>
  );
}
