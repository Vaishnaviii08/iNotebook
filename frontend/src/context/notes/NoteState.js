import { useState } from "react";
import NoteContext from "./NoteContext.js";

const NoteState = (props) => {
  const host = "http://localhost:5000";

  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  //Get all notes
  const getNotes = async () => {
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authToken:
          localStorage.getItem('token'),
      },
    });

    const json = await response.json();

    setNotes(json);
  };

  //Add a note
  const addNote = async (title, description, tag) => {
    //API Call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authToken:
          localStorage.getItem('token'),
      },
      body: JSON.stringify({ title, description, tag }),
    });

    const note = {
      _id: "6859b0136cb16a327d85336c3",
      user: "6859af496cb16a327d853353",
      title: title,
      description: description,
      tag: tag,
      date: "2025-06-23T19:50:43.100Z",
      __v: 0,
    };
    setNotes(notes.concat(note));
  };

  //Delete a note
  const deleteNote = async (id) => {
    //API call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authToken:
          localStorage.getItem('token'),
      },
    });

    const json = await response.json();

    setNotes(json);
    const newNotes = notes.filter((note) => {
      return note._id != id;
    });
    setNotes(newNotes);
  };

  //Edit a note
  const editNote = async (id, title, description, tag) => {
  // API Call
  const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      authToken:
        localStorage.getItem('token'),
    },
    body: JSON.stringify({ title, description, tag }),
  });

  const json = await response.json();

  // Update client-side state with the updated note
  const updatedNotes = notes.map((note) =>
    note._id === id ? { ...note, title, description, tag } : note
  );
  setNotes(updatedNotes);
};

  return (
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
