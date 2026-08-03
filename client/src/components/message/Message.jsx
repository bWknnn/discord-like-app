export default function Message({ msg, currentUser, showHeader }) {
  const isOwn = msg.sender === currentUser?.username;

  return (
    <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
      <div className="shrink-0 mt-1">
        {showHeader ? (
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono
              ${isOwn
                ? "bg-accent text-bg-main"
                : "bg-avatar-bg text-accent border border-border-dark"
              }`}
          >
            {msg.sender?.[0]?.toUpperCase()}
          </div>
        ) : (
          <div className="w-8" />
        )}
      </div>

      <div className={`flex flex-col gap-0.5 max-w-[65%] ${isOwn ? "items-end" : "items-start"}`}>
        {showHeader && (
          <div className={`flex items-baseline gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
            <span className="font-mono text-xs font-semibold text-accent">
              {msg.sender}
            </span>
            <span className="font-mono text-[10px] text-text-light/30">
              {msg.time}
            </span>
          </div>
        )}

        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
            ${isOwn
              ? "bg-accent text-bg-main rounded-tr-sm"
              : "bg-bg-card text-text-light border border-border-dark rounded-tl-sm"
            }`}
        >
          {msg.content}
        </div>
      </div>
    </div>
  );
}
