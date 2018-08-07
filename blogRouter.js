const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create('My Introduction', 'Hi my name is Bobby', 'Aaron L.', '9/1/18');

router.get('/', (requestAnimationFrame, res) => {
  res.json(BlogPosts.get());
});

module.exports = router;