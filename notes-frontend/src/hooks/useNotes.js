import { useState, useEffect, useRef } from "react";
import noteService from "../services/notes";

const getApiErrorMessage = (error, fallback = "Something went wrong") => {
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return fallback;
};

const useNotes = () => {
  const [notes, setNotes] = useState(null);
  const [notification, setNotification] = useState(null);
  const timeoutRef = useRef(null);

  const showMessage = ({ type = "info", title = "Notice", message }) => {
    setNotification({ type, title, message });

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setNotification(null);
      timeoutRef.current = null;
    }, 5000);
  };

  useEffect(() => {
    noteService
      .getAll()
      .then((initialNotes) => {
        setNotes(initialNotes);
      })
      .catch((error) => {
        showMessage({
          type: "error",
          title: "Load Failed",
          message: getApiErrorMessage(error, "Could not load notes from the server."),
        });
      });

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const toggleImportanceOf = (id) => {
    const note = notes.find((n) => n.id === id); //find the note with the given id in the notes array
    if (!note) return;

    const changedNote = { ...note, important: !note.important }; //make the copy of the notes and change the important property from true to false or from false to true

    noteService
      .update(id, changedNote)
      .then((returnedNote) => {
        // loops every note, swap in the updated one, keep all others unchanged
        // prev is the latest state of notes
        setNotes((prev) => prev.map((note) => (note.id === id ? returnedNote : note)));
      })
      .catch((error) => {
        showMessage({
          type: "error",
          title: "Update Failed",
          message: getApiErrorMessage(error, `Failed to update note '${note.content}'. Please try again.`),
        });
        // remove the deleted note from local
        setNotes((prev) => prev.filter((n) => n.id !== id));
      });
  };

  const deleteNote = (id) => {
    noteService
      .remove(id)
      .then(() => {
        setNotes((prev) => prev.filter((n) => n.id !== id));
        showMessage({
          type: "success",
          title: "Note Deleted",
          message: "The note was removed successfully.",
        });
      })
      .catch((error) => {
        showMessage({
          type: "error",
          title: "Delete Failed",
          message: getApiErrorMessage(error, "Failed to delete note. Please try again."),
        });
      });
  };

  const addNote = (content) => {
    const noteObject = {
      content,
      important: Math.random() < 0.5,
    };

    noteService
      .create(noteObject)
      .then((returnedNote) => {
        setNotes((prev) => [...prev, returnedNote]);
        showMessage({
          type: "success",
          title: "Note Added",
          message: "Your note was saved.",
        });
      })
      .catch((error) => {
        showMessage({
          type: "error",
          title: "Save Failed",
          message: getApiErrorMessage(error, "Failed to add note. Please try again."),
        });
      });
  };

  return { notes, notification, toggleImportanceOf, deleteNote, addNote };
};

export default useNotes;
