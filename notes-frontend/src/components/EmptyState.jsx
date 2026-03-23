import { NotebookPen } from "lucide-react";

const EmptyState = ({ search, showAll }) => {
  const message = search
    ? "No notes match your search"
    : !showAll
      ? "No important notes yet"
      : "No notes yet — add one above";

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center fade-up fade-up-delay-2">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
        <NotebookPen className="h-6 w-6 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
};

export default EmptyState;
