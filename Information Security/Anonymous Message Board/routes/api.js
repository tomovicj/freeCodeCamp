'use strict';

const bcrypt = require('bcrypt');

const Board = require('../models/Board.js');
const Thread = require('../models/Thread.js');
const Reply = require('../models/Reply.js');

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .post(async (req, res) => {
      const boardName = req.params.board;
      const {text, delete_password} = req.body;

      let board = await Board.findOne({ name: boardName });
      if (!board) {
        board = new Board({ name: boardName });
      }

      const timestamp = new Date();
      const hash = await bcrypt.hash(delete_password, 10);
      const thread = new Thread({ text, delete_password: hash, created_on: timestamp, bumped_on: timestamp });
      await thread.save();

      board.threads.unshift(thread);
      await board.save();

      const threadSafe = thread.toObject();
      delete threadSafe.delete_password;
      delete threadSafe.reported;
      return res.json(threadSafe);
    })
    .get(async (req, res) => {
      const boardName = req.params.board;
      
      const board = await Board.findOne({name: boardName});
      if (!board) return res.json({ error: "Board not found" });

      let threads = await Thread.find({ _id: { $in: board.threads } })
        .sort({ bumped_on: -1 }) // Sort by bumped_on date in descending order
        .limit(10); // Limit to 10 threads

      threads = await Promise.all(threads.map(async (thread) => {
        // Turn mongoose object to regular object, so that it is possible to delete fields
        thread = thread.toObject();
        // Remove delete_password and reported field from the response
        delete thread.delete_password;
        delete thread.reported;

        // Get at most 3 replies for the thread
        thread.replies = await Reply.find({ _id: { $in: thread.replies } }).limit(3);
        thread.replies = thread.replies.map((reply) => {
          reply = reply.toObject();
          delete reply.delete_password;
          delete reply.reported;
          return reply;
        });

        return thread;
      }));

      return res.json(threads);
    })
    .delete(async (req, res) => {
      const boardName = req.params.board;
      const { thread_id, delete_password } = req.body;

      const thread = await Thread.findById(thread_id);

      if (! await bcrypt.compare(delete_password, thread.delete_password)) {
        return res.send("incorrect password");
      }

      // Remove thread's _id from the board's thread array
      const board = await Board.findOne({ name: boardName });
      board.threads = board.threads.filter((thread) => thread._id != thread_id);
      await board.save();

      // Delete all replies for thread
      await Reply.deleteMany({ _id: { $in: thread.replies } });
      
      // Delete the thread
      await thread.deleteOne();
      
      return res.send("success");
    })
    .put(async (req, res) => {
      const thread_id = req.body.thread_id;

      const thread = await Thread.findById(thread_id);

      if (thread.reported != true) {
        thread.reported = true;
        await thread.save();
      }

      return res.send("reported");
    });
    
  app.route('/api/replies/:board')
    .post(async (req, res) => {
      const {text, delete_password, thread_id} = req.body;

      const thread = await Thread.findById(thread_id);
      if (!thread) return res.json({ error: "Invalid thread id" });

      const timestamp = new Date();
      const hash = await bcrypt.hash(delete_password, 10);
      const reply = new Reply({ text, delete_password: hash, created_on: timestamp });
      await reply.save();
      
      thread.bumped_on = timestamp;
      thread.replies.unshift(reply);
      await thread.save();

      const replySafe = reply.toObject();
      delete replySafe.delete_password;
      delete replySafe.reported;
      return res.json(replySafe);
    })
    .get(async (req, res) => {
      const thread_id = req.query.thread_id;

      let thread = await Thread.findById(thread_id);
      if (!thread) return res.json({ error: "Invalid thread id" });
      
      // Remove delete_password and reported fields from the response
      thread = thread.toObject();
      delete thread.delete_password;
      delete thread.reported;

      // Get all replies for this thread and remove delete_password and reported fields from the response
      thread.replies = await Promise.all(thread.replies.map(async (replyID) => {
        let reply = await Reply.findById(replyID);
        reply = reply.toObject();
        delete reply.delete_password;
        delete reply.reported;
        return reply;
      }));

      return res.json(thread);
    })
    .delete(async (req, res) => {
      const { reply_id, delete_password } = req.body;

      const reply = await Reply.findById(reply_id);

      if (! await bcrypt.compare(delete_password, reply.delete_password)) {
        return res.send("incorrect password");
      }

      reply.text = "[deleted]";
      await reply.save();

      return res.send("success");
    })
    .put(async (req, res) => {
      const reply_id = req.body.reply_id;

      const reply = await Reply.findById(reply_id);

      if (reply.reported != true) {
        reply.reported = true;
        await reply.save();
      }

      return res.send("reported");
    });
};
