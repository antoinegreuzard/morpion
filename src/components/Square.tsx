import React from "react";

interface SquareProps {
  value: string | null;
  onClick: () => void;
}

const Square: React.FC<SquareProps> = ({value, onClick}) => {
  return (
    <button
      className={`w-24 h-24 text-3xl font-bold flex items-center justify-center rounded-lg border-2
                  transition-all duration-300 ease-in-out transform hover:scale-105
                  ${value === "X" ? "text-blue-500 bg-blue-100 border-blue-300 animate-pop" : ""}
                  ${value === "O" ? "text-red-500 bg-red-100 border-red-300 animate-pop" : ""}
                  ${!value ? "bg-gray-50 border-gray-300 hover:bg-gray-100" : ""}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
};

export default Square;
