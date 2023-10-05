/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    const testBook = {
      _id: "",
      title: "Test Book",
      comment: "This comment is used as a test"
    }

    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({
          title: testBook.title
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isObject(res.body, 'response should be an array');
          assert.strictEqual(res.body.title, testBook.title, 'The correct title is returned');
          assert.isString(res.body._id, "_id is a string");

          testBook._id = res.body._id;

          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.strictEqual(res.body, 'missing required field title', 'Handling no title provided')
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'response should be an array');
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/invalidID')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.strictEqual(res.body, "no book exists", 'response should be an array');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .get(`/api/books/${testBook._id}`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.strictEqual(res.body._id, testBook._id, "Checks for the _id");
          assert.strictEqual(res.body.title, testBook.title, "Checks for the title");
          assert.isArray(res.body.comments, "Checks if 'comments' is array");
          assert.isEmpty(res.body.comments, "Checks if 'comments' is empty");
          done();
        });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
        .post(`/api/books/${testBook._id}`)
        .send({
          comment: testBook.comment
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.strictEqual(res.body._id, testBook._id, "Checks for the _id");
          assert.strictEqual(res.body.title, testBook.title, "Checks for the title");
          assert.isArray(res.body.comments, "Checks if 'comments' is array");
          assert.isNotEmpty(res.body.comments, "Checks if 'comments' is not empty");
          assert.equal(res.body.comments[0], testBook.comment, "Checks if 'comments' contain the new comment");
          done();
        });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post(`/api/books/${testBook._id}`)
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.strictEqual(res.body, "missing required field comment", "Checks for missing comment field");
          done();
        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post('/api/books/invalidID')
        .send({
          comment: testBook.comment
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.strictEqual(res.body, "no book exists", "Checks for invalid _id");
          done();
        });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .delete(`/api/books/${testBook._id}`)
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.strictEqual(res.body, "delete successful", "Checks if delete is successful");
          done();
        });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
        .delete('/api/books/invalidID')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.strictEqual(res.body, "no book exists", "Checks for invalid _id");
          done();
        });
      });

    });

  });

});
