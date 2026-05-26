import React from "react";

// Non-modal, non-blocking loading indicator (top-right banner)
const LoadingModal = ({ open, message = "Loading..." }) => {
  if (!open) return null;

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div className="pointer-events-none flex items-center gap-3 rounded-full bg-white/85 px-4 py-2 shadow-lg backdrop-blur-sm">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 p-1">
          <svg
            className="h-5 w-5 animate-spin text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-800">{message}</span>
          <span className="text-xs text-gray-600">Working on your request</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
