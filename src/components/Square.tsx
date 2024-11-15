import React from "react";

interface SquareProps {
  value: string | null;
  onClick: () => void;
}

const Square: React.FC<SquareProps> = ({value, onClick}) => {
  return (
    <button
      className={`w-24 h-24 text-4xl font-extrabold flex items-center justify-center rounded-lg shadow-lg
                  transition-transform duration-300 ease-in-out transform hover:scale-105
                  ${value === "X" ? "text-[var(--color-player)] bg-blue-100 border-blue-300 animate-pop" : ""}
                  ${value === "O" ? "text-[var(--color-ai)] bg-red-100 border-red-300 animate-pop" : ""}
                  ${!value ? "bg-white border-gray-300 hover:bg-gray-100" : ""}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
};

export default Square;
