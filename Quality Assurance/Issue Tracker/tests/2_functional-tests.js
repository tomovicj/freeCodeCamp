const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let _id;
const invalid_id = "Invalid _id";

suite("Functional Tests", function () {
  test("Create an issue with every field", (done) => {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .type("form")
      .send({
        issue_title: "Test",
        issue_text: "This is a test",
        created_by: "Jovan",
        assigned_to: "Tester",
        status_text: "testing...",
      })
      .end((err, res) => {
        _id = res.body._id;
        assert.strictEqual(res.body.issue_title, "Test", "Issue title");
        assert.strictEqual(res.body.issue_text, "This is a test", "Issue text");
        assert.strictEqual(res.body.created_by, "Jovan", "Created by");
        assert.strictEqual(res.body.assigned_to, "Tester", "Assigned to");
        assert.strictEqual(res.body.status_text, "testing...", "Status text");
        assert.isTrue(res.body.open, "Open");
        done();
      });
  });
  test("Create an issue with only required fields", (done) => {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .type("form")
      .send({
        issue_title: "Test",
        issue_text: "This is a test",
        created_by: "Jovan",
      })
      .end((err, res) => {
        assert.strictEqual(res.body.issue_title, "Test", "Issue title");
        assert.strictEqual(res.body.issue_text, "This is a test", "Issue text");
        assert.strictEqual(res.body.created_by, "Jovan", "Created by");
        assert.isTrue(res.body.open, "Open");
        done();
      });
  });
  test("Create an issue with missing required fields", (done) => {
    chai
      .request(server)
      .post("/api/issues/apitest")
      .type("form")
      .send({
        issue_text: "This is a test",
        created_by: "Jovan",
        assigned_to: "Tester",
        status_text: "testing...",
      })
      .end((err, res) => {
        assert.strictEqual(
          res.body.error,
          "required field(s) missing",
          "issue_title missing"
        );
        done();
      });
  });

  test("View issues on a project", (done) => {
    chai.request(server)
      .get('/api/issues/apitest')
      .end((err, res) => {
        assert.isArray(res.body, "Array is returned");
        assert.isNotEmpty(res.body, "Array is not empty");
        done();
      });
  });

  test("View issues on a project with one filter", (done) => {
    chai.request(server)
      .get('/api/issues/apitest?open=true')
      .end((err, res) => {
        assert.isArray(res.body, "Array is returned");
        assert.isNotEmpty(res.body, "Array is not empty");
        res.body.forEach(issue => {
          assert.isBoolean(issue.open, "Every issues has an open that is boolean");
          assert.isTrue(issue.open, "Filter's parameter");
        });
        done();
      });
  });

  test("View issues on a project with multiple filters", (done) => {
    chai.request(server)
      .get('/api/issues/apitest?open=true&assigned_to=Tester')
      .end((err, res) => {
        assert.isArray(res.body, "Array is returned");
        assert.isNotEmpty(res.body, "Array is not empty");
        assert.equal(res.body.length, 1, "Array's length is one")
        assert.isBoolean(res.body[0].open, "Every issues has an open that is boolean");
        assert.isTrue(res.body[0].open, "First filter's parameter");
        assert.strictEqual(res.body[0].assigned_to, "Tester", "Second filter's parameter")
        done();
      });
  });

  test("Update one field on an issue", (done) => {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({ _id: _id, issue_title: "New issue title" })
      .end((err, res) => {
        assert.strictEqual(res.body.result, "successfully updated");
        assert.strictEqual(res.body._id, _id);
        done();
      });
  });
  test("Update multiple fields on an issue", (done) => {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        _id: _id,
        issue_title: "New new issue title",
        created_by: "Tester",
      })
      .end((err, res) => {
        assert.strictEqual(res.body.result, "successfully updated");
        assert.strictEqual(res.body._id, _id);
        done();
      });
  });
  test("Update an issue with missing _id", (done) => {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        issue_title: "Add ID to this",
      })
      .end((err, res) => {
        assert.strictEqual(res.body.error, "missing _id");
        done();
      });
  });
  test("Update an issue with no fields to update", (done) => {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        _id: _id,
      })
      .end((err, res) => {
        assert.strictEqual(res.body.error, "no update field(s) sent");
        done();
      });
  });
  test("Update an issue with an invalid _id", (done) => {
    chai
      .request(server)
      .put("/api/issues/apitest")
      .send({
        _id: invalid_id,
        issue_title: "invalid ID"
      })
      .end((err, res) => {
        assert.strictEqual(res.body.error, "could not update");
        assert.strictEqual(res.body._id, invalid_id, "Invalid ID");
        done();
      });
  });
  test("Delete an issue", (done) => {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .send({ _id: _id })
      .end((err, res) => {
        assert.strictEqual(res.body.result, "successfully deleted");
        assert.strictEqual(res.body._id, _id);
        done();
      });
  });
  test("Delete an issue with an invalid _id", (done) => {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .send({ _id: invalid_id })
      .end((err, res) => {
        assert.strictEqual(res.body.error, "could not delete");
        assert.strictEqual(res.body._id, invalid_id);
        done();
      });
  });
  test("Delete an issue with missing _id", (done) => {
    chai
      .request(server)
      .delete("/api/issues/apitest")
      .send()
      .end((err, res) => {
        assert.strictEqual(res.body.error, "missing _id");
        done();
      });
  });
});
