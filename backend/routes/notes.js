import express from "express";
import fetchuser from "../middleware/fetchuser.js";
import Notes from "../models/Notes.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

//Route 1 : To fetch all notes of the user : GET "api/notes/fetchallnotes". Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Some error occured");
  }
});

//Route 2 : Add a new note : POST "api/notes/addnote". Login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      //If there are any errors in validation return bad request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      //Create new note
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

//Route 3 : Update an existing note : PUT "api/notes/updatenote". Login required
router.put(
  "/updatenote/:id", fetchuser, async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      //Create new note object
      const newNote = {};

      if(title) {newNote.title = title};
      if(description) {newNote.description = description};
      if(tag) {newNote.tag = tag};

      //Find the note to be updated and update it
      let note = await Notes.findById(req.params.id);

      if(!note) {return res.status(404).send("Not found")};
      
      //Check if the user is trying to access someones else's note
      if(note.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed");
      }

      note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});

      res.json(note);
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

//Route 4 : Delete an existing note : DELETE "api/notes/deletenote". Login required
router.delete(
  "/deletenote/:id", fetchuser, async (req, res) => {
    try {
      //Find the note to be updated and delete it
      let note = await Notes.findById(req.params.id);
      if(!note) {return res.status(404).send("Not found")};
      
      //Check if the user is trying to access someones else's note
      if(note.user.toString() !== req.user.id) {
        return res.status(401).send("Not allowed");
      }

      note = await Notes.findByIdAndDelete(req.params.id);

      res.json({"Success" : "Note has been deleted"})
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Some error occured");
    }
  }
);

export default router;
