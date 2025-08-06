import React from "react";

interface CheckBoxProps {
  check: boolean;
  setCheck: (value: boolean) => void;
  title: string;
  disabled?: boolean;
}

const CheckBox: React.FC<CheckBoxProps> = ({
  check,
  setCheck,
  title,
  disabled = false,
}) => {
  const toggleCheckBox = () => {
    if (!disabled) {
      setCheck(!check);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && !disabled) {
      e.preventDefault();
      setCheck(!check);
    }
  };

  return (
    <div
      onClick={toggleCheckBox}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role="checkbox"
      aria-checked={check}
      aria-label={title}
      className={`
        flex items-center gap-3 mb-3 p-2 rounded-lg transition-all duration-200 
        ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:bg-gray-50 active:bg-gray-100"
        }
        select-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
      `}
    >
      <div className="relative">
        <div
          className={`
            w-5 h-5 rounded border-2 transition-all duration-200 ease-in-out
            ${
              check
                ? "bg-blue-500 border-blue-500 shadow-md"
                : "bg-white border-gray-300 hover:border-gray-400"
            }
            ${disabled ? "opacity-50" : ""}
          `}
        >
          {/* Checkmark */}
          <svg
            className={`
              w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200
              ${check ? "opacity-100 scale-100" : "opacity-0 scale-75"}
            `}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Ripple effect */}
        <div
          className={`
            absolute inset-0 rounded-full transition-all duration-300 pointer-events-none
            ${check ? "bg-blue-500" : "bg-gray-400"}
            opacity-0 scale-0 group-active:opacity-20 group-active:scale-150
          `}
        />
      </div>

      <span
        className={`
          text-sm font-medium transition-colors duration-200
          ${
            disabled
              ? "text-gray-400"
              : check
              ? "text-gray-900"
              : "text-gray-700 hover:text-gray-900"
          }
        `}
      >
        {title}
      </span>
    </div>
  );
};

export default CheckBox;
