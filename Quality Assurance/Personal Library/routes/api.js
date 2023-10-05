/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

require("dotenv").config();
const mongoose = require("mongoose");
const { Book } = require("../models/Book.js");

// Connect to the database
mongoose.connect(process.env.MONGO_URI);

const checkBookId = (req, res, next) => {
  const bookId = req.params.id;

  if (bookId === undefined || bookId === "") return res.json("no book exists");

  try {
    req.bookId = new mongoose.Types.ObjectId(bookId);
  } catch {
    return res.json("no book exists");
  }

  next();
};

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      const books = await Book.aggregate([
        {
          $project: {
            _id: 1,
            title: 1,
            commentcount: { $size: "$comments" }, // Calculate comment count
          },
        },
      ]).catch((error) => {
        console.log(error);
        return res.json("Looks like an error occurred while retrieving books");
      });
      console.log(books);
      res.json(books);
    })

    .post(async function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (title === undefined || title === "")
        return res.json("missing required field title");

      const newBook = new Book({ title: title });
      await newBook.save().catch((error) => {
        console.log(error);
        return res.json("Looks like an error occurred while saving new book");
      });
      res.json({ _id: newBook._id, title: newBook.title });
    })

    .delete(async function (req, res) {
      //if successful response will be 'complete delete successful'
      await Book.deleteMany({}).catch((error) => {
        console.log(error);
        return res.json(
          "Looks like an error occurred while trying to delete all books"
        );
      });
      res.json("complete delete successful");
    });

  app
    .route("/api/books/:id")
    .get(checkBookId, async function (req, res) {
      const book = await Book.findById(req.bookId).catch((error) => {
        // console.log(error);
        return res.json("Looks like an error occurred");
      });

      if (book == null) return res.json("no book exists");

      res.json({ _id: book._id, title: book.title, comments: book.comments });
    })

    .post(checkBookId, async function (req, res) {
      let comment = req.body.comment;
      //json res format same as .get

      if (comment === undefined || comment === "")
        return res.json("missing required field comment");

      const book = await Book.findById(req.bookId);

      if (book == null) return res.json("no book exists");

      book.comments.push(comment);
      await book.save().catch((error) => {
        console.log(error);
        return res.json(
          "Looks like an error occurred while trying to save a comment"
        );
      });
      res.json(book);
    })

    .delete(checkBookId, async function (req, res) {
      //if successful response will be 'delete successful'

      const book = await Book.findByIdAndDelete(req.bookId).catch((error) => {
        console.log(error);
        return res.json(
          "Looks like an error occurred while trying to delete a book"
        );
      });

      if (book == null) return res.json("no book exists");

      res.json("delete successful");
    });
};
