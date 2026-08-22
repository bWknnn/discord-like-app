import { FiHash, FiVolume2 } from "react-icons/fi";

export default function Channel({ name, type, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-md font-mono text-xs cursor-pointer transition-all duration-150 select-none group ${
        active
          ? type === "voice"
            ? "bg-online/10 text-online font-medium border-l-2 border-online pl-2.5 shadow-[0_0_8px_rgba(74,222,128,0.1)]"
            : "bg-accent/10 text-accent font-medium border-l-2 border-accent pl-2.5"
          : "text-text-light/60 hover:bg-accent/5 hover:text-text-light border-l-2 border-transparent"
      }`}
    >
      {type === "voice" ? (
        <FiVolume2
          size={14}
          className={`transition-colors duration-150 ${
            active
              ? "text-online"
              : "text-text-light/40 group-hover:text-text-light/80"
          }`}
        />
      ) : (
        <FiHash
          size={14}
          className={`transition-colors duration-150 ${
            active
              ? "text-accent"
              : "text-text-light/40 group-hover:text-text-light/80"
          }`}
        />
      )}
      <span className="truncate">{name}</span>
    </button>
  );
}
