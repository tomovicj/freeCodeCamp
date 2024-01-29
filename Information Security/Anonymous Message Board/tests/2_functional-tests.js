const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    const board = "testing";
    const thread = {
        text: "This is test thread",
        delete_password: "delete_me",
        _id: null,
        created_on: null
    }
    const reply = {
        text: "This is test reply",
        delete_password: "delete_me",
        _id: null
    }
    test("Creating a new thread", (done) => {
        chai.request(server)
        .post(`/api/threads/${board}`)
        .send({ text: thread.text, delete_password: thread.delete_password })
        .end((err, res) => {
            assert.isObject(res.body);
            assert.isString(res.body._id);
            assert.strictEqual(res.body.text, thread.text, "Thread's text should be the same as provided");
            assert.strictEqual(res.body.created_on, res.body.bumped_on, "created_on and bumped_on should be the same");
            thread._id = res.body._id;
            thread.created_on = res.body.created_on;
            done();
        });
    });
    test("Creating a new reply", (done) => {
        chai.request(server)
        .post(`/api/replies/${board}`)
        .send({ text: reply.text, delete_password: reply.delete_password, thread_id: thread._id })
        .end((err, res) => {
            assert.isString(res.body._id, "reply's _id should be a string");
            assert.strictEqual(res.body.text, reply.text);
            reply._id = res.body._id;
            done();
        });
    });
    test("Viewing the 10 most recent threads with 3 replies each", (done) => {
        chai.request(server)
        .get(`/api/threads/${board}`)
        .end((err, res) => {
            assert.isArray(res.body);
            assert.isAtMost(res.body.length, 10);
            assert.isObject(res.body[0]);
            assert.isArray(res.body[0].replies);
            assert.isAtMost(res.body[0].replies.length, 3);
            assert.isUndefined(res.body.delete_password);
            assert.isUndefined(res.body.reported);
            done();
        });
    });
    test("Viewing a single thread with all replies", (done) => {
        chai.request(server)
        .get(`/api/replies/${board}?thread_id=${thread._id}`)
        .end((err, res) => {
            assert.strictEqual(res.body._id, thread._id, "thread _id");
            assert.strictEqual(res.body.text, thread.text, "thread text");
            assert.strictEqual(res.body.created_on, thread.created_on, "thread created_on");
            assert.isAbove(new Date(res.body.bumped_on), new Date(res.body.created_on), "thread bumped_on > thread created_on");
            assert.isUndefined(res.body.delete_password, "thread delete_password");
            assert.isUndefined(res.body.reported, "thread reported");
            assert.isArray(res.body.replies, "replies is array");
            assert.strictEqual(res.body.replies[0]._id, reply._id, "reply _id");
            assert.strictEqual(res.body.replies[0].text, reply.text, "reply text");
            assert.strictEqual(res.body.replies[0].created_on, res.body.bumped_on, "reply[0] created_on > thread bumped_on");
            assert.isUndefined(res.body.replies[0].delete_password, "reply delete_password");
            assert.isUndefined(res.body.replies[0].reported, "reply reported");
            done();
        });
    });
    test("Reporting a thread", (done) => {
        chai.request(server)
        .put(`/api/threads/${board}`)
        .send({ thread_id: thread._id })
        .end((err, res) => {
            assert.isString(res.text);
            assert.strictEqual(res.text, "reported");
            done();
        });
    });
    test("Reporting a reply", (done) => {
        chai.request(server)
        .put(`/api/replies/${board}`)
        .send({ thread_id: thread._id, reply_id: reply._id })
        .end((err, res) => {
            assert.strictEqual(res.text, "reported");
            done();
        });
    });     
    test("Deleting a reply with the incorrect password", (done) => {
        chai.request(server)
        .delete(`/api/replies/${board}`)
        .send({ thread_id: thread._id, reply_id: reply._id, delete_password: "incorrect_password" })
        .end((err, res) => {
            assert.strictEqual(res.text, "incorrect password");
            done();
        });
    });
    test("Deleting a reply with the correct password", (done) => {
        chai.request(server)
        .delete(`/api/replies/${board}`)
        .send({ thread_id: thread._id, reply_id: reply._id, delete_password: reply.delete_password })
        .end((err, res) => {
            assert.strictEqual(res.text, "success");
            done();
        });
    });
    test("Deleting a thread with the incorrect password", (done) => {
        chai.request(server)
        .delete(`/api/threads/${board}`)
        .send({ thread_id: thread._id, delete_password: "incorrect_password" })
        .end((err, res) => {
            assert.isString(res.text);
            assert.strictEqual(res.text, "incorrect password");
            done();
        });
    });
    test("Deleting a thread with the correct password", (done) => {
        chai.request(server)
        .delete(`/api/threads/${board}`)
        .send({ thread_id: thread._id, delete_password: thread.delete_password })
        .end((err, res) => {
            assert.isString(res.text);
            assert.strictEqual(res.text, "success");
            done();
        });
    });
});
