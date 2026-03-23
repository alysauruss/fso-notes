import Note from "./Note";
import EmptyState from "./EmptyState";

const NotesList = ({ notes, search, showAll, onToggleImportance, onDeleteNote }) => {
  if (notes.length === 0) {
    return <EmptyState search={search} showAll={showAll} />;
  }

  return (
    <ul className="space-y-2">
      {notes.map((note, index) => (
        <Note
          key={note.id}
          note={note}
          index={index}
          onToggleImportance={() => onToggleImportance(note.id)}
          onDelete={() => onDeleteNote(note.id)}
        />
      ))}
    </ul>
  );
};

export default NotesList;
