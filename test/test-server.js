const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

describe('Blog Post', function () {
  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should show all blog posts on GET', function() {
    return chai.request(app)
      .get('/blog-posts')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res).to.be.json;

        const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];

        res.body.forEach(function(post) {
          expect(post).to.be.a('object');
          expect(post).to.include.keys(expectedKeys);
        });
      });
  });

  it('should create a blog post on POST', function() {
    const newPost = {
      title: 'Letter',
      content: 'abc',
      author: 'Z',
      publishDate: '1/1/11'
    };

    const expectedKeys = ['title', 'content', 'author', 'publishDate'];

    return chai.request(app)
      .post('/blog-posts')
      .send(newPost)
      .then(function(res) {
        expect(res.body).to.be.an('object');
        expect(res.body).to.include.keys(expectedKeys);
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body.id).to.not.equal(null);
        expect(res.body).to.deep.equal(
          Object.assign(newPost, { id: res.body.id })
        );
      });
  });

  it('should update a blog post on PUT', function() {
    //use get request to get an id from a blog post
    //get blog post id for put request
    //and test
    const updatedPost = {
      title: 'updatedTitle',
      content: 'updatedContent',
      author: 'updatedAuthor',
      publishDate: '1/1/12'
    };

    return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      updatedPost.id = res.body[0].id;

      return chai.request(app)
        .put(`/blog-posts/${updatedPost.id}`)
        .send(updatedPost)
        .then(function(res) {
          expect(res).to.have.status(204);
          expect(res.body).to.be.empty;
        });
      })
    });
  });

  it('should delete a blog post on DELETE', function() {

    return chai.request(app)
    .get('/blog-posts')
    .then(function(res) {
      const firstPostId = res.body[0].id;

      return chai.request(app)
      .del(`/blog-posts/${firstPostId}`)
      .then(function(res) {
        expect(res).to.have.status(204);
        expect(res.body).to.be.empty;
      });
    });
  });
