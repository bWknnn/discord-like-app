export default function Message({ msg, currentUser, showHeader }) {
  const isOwn = msg.senderUid === currentUser?.uid;

  return (
    <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
      <div className="shrink-0 mt-1 select-none">
        {showHeader ? (
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono
              ${
                isOwn
                  ? "bg-accent text-bg-main"
                  : "bg-avatar-bg text-accent border border-border-dark"
              }`}
          >
            {msg.senderUsername?.[0]?.toUpperCase()}
          </div>
        ) : (
          <div className="w-8" />
        )}
      </div>

      <div
        className={`flex flex-col gap-0.5 max-w-[65%] ${isOwn ? "items-end" : "items-start"}`}
      >
        {showHeader && (
          <div
            className={`flex items-baseline gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
          >
            <span className="font-mono text-xs font-semibold text-accent">
              {msg.senderUsername}
            </span>
            <span className="font-mono text-[10px] text-text-light/30">
              {(() => {
                const date = new Date(msg.createdAt);
                const today = new Date();
                const isToday = date.toDateString() === today.toDateString();
                const userLocale = navigator.language || undefined;
                return isToday
                  ? date.toLocaleTimeString(userLocale, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : date.toLocaleDateString(userLocale, {
                      day: "numeric",
                      month: "short",
                    }) +
                      " " +
                      date.toLocaleTimeString(userLocale, {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
              })()}
            </span>
          </div>
        )}

        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed
            ${
              isOwn
                ? "bg-accent text-bg-main rounded-tr-sm"
                : "bg-bg-card text-text-light border border-border-dark rounded-tl-sm"
            }`}
        >
          {msg.text}
        </div>
      </div>
    </div>
  );
}
