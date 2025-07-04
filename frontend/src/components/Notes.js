import React, { useContext, useEffect, useRef, useState } from "react";
import NoteContext from "../context/notes/NoteContext.js";
import NoteItem from "./NoteItem.js";
import AddNote from "./AddNote.js";
import { useNavigate } from "react-router-dom";

const Notes = (props) => {
  const context = useContext(NoteContext);
  const { notes, getNotes, editNote } = context;
  let navigate = useNavigate();

  const [note, setNote] = useState({id: "", title : "", description : "", tag : "default"})

  useEffect(() => {
    if(localStorage.getItem('token')){
      getNotes();
    } else {
      navigate("/login");
    }
    
  }, []);

  const updateNote = (currentNote) => {
    ref.current.click();
    setNote({id : currentNote._id, title: currentNote.title, description: currentNote.description, tag: currentNote.tag });
  };

  const handleClick = (e) => {
    editNote(note.id, note.title, note.description, note.tag);
    refClose.current.click() ;
    props.showAlert("Updated successfully", "success");
  }

  const onChange = (e) => {
    setNote({...note, [e.target.name]: e.target.value})
  } 

  const ref = useRef(null);
  const refClose = useRef(null);

  return (
    <div>
      <AddNote showAlert = {props.showAlert} />

      <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel"> Edit Note </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label"> Title </label>
                  <input type="text" className="form-control" id="etitle" name="title" value={note.title} onChange={onChange} minLength={5} required/>
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label"> Description </label>
                  <input type="text" className="form-control" id="edescription" name="description" value={note.description} onChange={onChange} minLength={5} required/>
                </div>
                <div className="mb-3">
                  <label htmlFor="tag" className="form-label"> Tag </label>
                  <input type="text" className="form-control" id="etag" name="tag" value={note.tag} onChange={onChange} />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button ref = {refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal" > Close </button>
              <button disabled={note.title.length < 5 || note.description.length < 5} type="button" className="btn btn-primary" onClick={handleClick}> Update Note </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row my-3">
        <h2>Your Notes</h2>
        <div className = "container">
        {notes.length === 0 && 'No Notes to display'}
        </div>
        {notes.map((note) => {
          return (
            <NoteItem key={note._id} updateNote={updateNote} note={note} showAlert = {props.showAlert} />
          );
        })}
      </div>
    </div>
  );
};

export default Notes;
