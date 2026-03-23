import { useState } from "react";
import { Star, NotebookPen } from "lucide-react";
import AddNoteForm from "./AddNoteForm";
import NotesList from "./NotesList";

const FilterToggle = ({ showAll, setShowAll, totalCount, importantCount, search }) => {
  return (
    <div className="mb-4 flex items-center gap-2 fade-up fade-up-delay-1">
      <button
        onClick={() => setShowAll(true)}
        className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all active:scale-95 ${
          showAll || search // ← looks active when searching, since search results include all notes
            ? "bg-primary text-background shadow-sm"
            : "bg-secondary text-muted-foreground hover:text-foreground"
        }`}
      >
        All ({totalCount})
      </button>
      <button
        onClick={() => setShowAll(false)}
        className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all active:scale-95 ${
          !showAll && !search
            ? "bg-primary text-background shadow-sm"
            : "bg-secondary text-muted-foreground hover:text-foreground"
        }`}
      >
        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
        Important ({importantCount})
      </button>
    </div>
  );
};

const Main = ({ search, notes, onToggleImportance, onDeleteNote, onAddNote }) => {
  const [showAll, setShowAll] = useState(true);

  // If searching, ignore showAll and search all notes
  // If not searching, apply showAll filter
  const notesToShow = search
    ? notes.filter((n) => n.content.toLowerCase().includes(search.toLowerCase()))
    : showAll
      ? notes
      : notes.filter((n) => n.important);

  const totalCount = notes.length;
  const importantCount = notes.filter((n) => n.important).length;

  return (
    <main className="mx-auto max-w-2xl px-4 py-6">
      <AddNoteForm onAddNote={onAddNote} />

      <FilterToggle
        showAll={showAll}
        setShowAll={setShowAll}
        totalCount={totalCount}
        importantCount={importantCount}
        search={search}
      />

      <NotesList
        notes={notesToShow}
        search={search}
        showAll={showAll}
        onToggleImportance={onToggleImportance}
        onDeleteNote={onDeleteNote}
      />
    </main>
  );
};

export default Main;
