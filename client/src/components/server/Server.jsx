export default function Server({ name, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors duration-150
        ${
          active
            ? "bg-accent/10 border-l-2 border-accent hover:bg-accent/15"
            : "border-l-2 border-transparent hover:bg-accent/5"
        }`}
    >
      <div className="w-7 h-7 rounded-full bg-avatar-bg flex items-center justify-center">
        <span
          className={`text-xs font-mono ${active ? "text-accent" : "text-text-light/60"}`}
        >
          {name.charAt(0).toUpperCase()}
        </span>
      </div>
      <span
        className={`text-xs font-mono ${active ? "text-text-light" : "text-text-light/60"}`}
      >
        {name}
      </span>
    </div>
  );
}
