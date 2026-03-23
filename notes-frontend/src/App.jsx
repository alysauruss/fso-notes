import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./components/Main";
import Notification from "./components/Notification";
import useNotes from "./hooks/useNotes";

const App = () => {
  const [search, setSearch] = useState("");
  const { notes, notification, toggleImportanceOf, deleteNote, addNote } = useNotes();

  if (!notes) {
    return <p className="p-4 text-sm text-muted-foreground">Getting notes…</p>;
  }

  return (
    <div>
      <Header search={search} setSearch={setSearch} />
      <Notification
        message={notification?.message}
        title={notification?.title}
        type={notification?.type}
      />
      <Main
        search={search}
        notes={notes}
        onToggleImportance={toggleImportanceOf}
        onDeleteNote={deleteNote}
        onAddNote={addNote}
      />
      <Footer />
    </div>
  );
};

export default App;
