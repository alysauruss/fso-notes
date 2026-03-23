import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

const AddNoteForm = ({ onAddNote }) => {
  const [newNote, setNewNote] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(newNote);
    setNewNote("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 fade-up">
      <div className="flex gap-2">
        <Input
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          type="text"
          placeholder="Write a new note…"
          className="px-4 py-5"
        />
        <Button type="submit" className="px-4 py-5 font-semibold active:scale-[0.97]">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add</span>
        </Button>
      </div>
    </form>
  );
};

export default AddNoteForm;
