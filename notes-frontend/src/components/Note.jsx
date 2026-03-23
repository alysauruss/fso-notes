import { Star, X } from "lucide-react";

const Note = ({ note, onToggleImportance, onDelete, index }) => {
  const importanceLabel = note.important ? "Mark as not important" : "Mark as important";

  const starClass = note.important
    ? "fill-yellow-400 text-yellow-400"
    : "fill-none text-gray-400 hover:text-yellow-400";

  return (
    <li
      style={{ animationDelay: `${Math.min(index * 60, 360)}ms` }}
      className="note-enter group flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 transition-shadow hover:shadow-md"
    >
      <p className="flex-1 pt-0.5 text-sm leading-relaxed text-foreground overflow-wrap-anywhere">{note.content}</p>
      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={onToggleImportance}
          className="rounded-lg p-1.5 transition-all active:scale-90"
          aria-label={importanceLabel}
          title={importanceLabel}
        >
          <Star className={`h-4 w-4 transition-colors ${starClass}`} />
        </button>
        <button
          onClick={onDelete}
          className="rounded-lg p-1.5 text-muted-foreground/40 opacity-0 transition-all hover:text-destructive group-hover:opacity-100 active:scale-90"
          aria-label="Delete note"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
};

export default Note;
