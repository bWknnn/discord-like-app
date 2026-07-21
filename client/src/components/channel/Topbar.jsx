import { FiChevronDown } from "react-icons/fi";

export default function Topbar({ name }) {
  return (
    <div className="flex items-center justify-between font-mono text-[11px] text-text-light/40 px-2 py-1 tracking-wider uppercase">
      <span className="flex items-center gap-1.5">
        <FiChevronDown size={12} className="text-accent" /> {name}
      </span>
    </div>
  );
}
