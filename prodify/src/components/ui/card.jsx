// src/components/ui/card.jsx
import React from "react";

/** Outer wrapper with rounded corners, backdrop blur and shadow */
export function Card({ children, className = "" }) {
  return (
    <div
      className={
        `bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden ` +
        className
      }
    >
      {children}
    </div>
  );
}

/** Header slot—gradient, icon + title live here */
export function CardHeader({ children, className = "" }) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-t-2xl ${className}`}>
      {children}
    </div>
  );
}

/** Content slot with standard padding and vertical spacing */
export function CardContent({ children, className = "" }) {
  return <div className={`p-6 space-y-4 ${className}`}>{children}</div>;
}
