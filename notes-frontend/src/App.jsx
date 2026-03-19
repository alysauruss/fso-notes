import { useState, useEffect } from 'react'
import Note from './components/Note'
import Notification from './components/Notification'
import Footer from './components/Footer'
import noteService from './services/notes'


const App = () => {
  const [notes, setNotes] = useState(null)
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
      .catch(error => {
        console.error('Failed to load notes:', error.message)
        alert('Could not load notes from the server.')
      })
  }, [])

  if (!notes) {
    return <p>Getting notes ...</p>
  }

  const handleAddNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5, //50% change of being marked as important
      // id: String(notes.length + 1), //total number of notes + 1
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote)) //add the new note on to the db
        setNewNote('') //set value of the form to ''
      })
      .catch(error => {
        console.error('Failed to add note:', error.message)
        alert('Failed to add note. Please try again.')
      })
  }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value) //make this the new note value
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)
  //if showAll is true, show all notes, otherwise filter the notes to show only important ones

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id) //find the note with the given id in the notes array
    const changedNote = { ...note, important: !note.important } //make the copy of the notes and change the important property from true to false or from false to true

    //put request replaces the whole note
    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note)) //loops every note, swap in the updated one, keep all others unchanged
      })
      .catch(error => {
        setErrorMessage(`Note '${note.content}' was already removed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        // remove the deleted note from local state
        setNotes(notes.filter(n => n.id !== id))
      })

  }

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)} />
        )}
      </ul>

      <form onSubmit={handleAddNote}>
        <input
          placeholder='Add a new note...'
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>

      <Footer />
    </div>
  )
}

export default App 