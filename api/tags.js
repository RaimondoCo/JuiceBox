const express = require('express');
const tagsRouter = express.Router();

tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});

const { getAllTags, getPostsByTagName } = require('../db');

tagsRouter.get('/', async (req, res) => {
    const allTags = await getAllTags();
    const tags = allTags.filter(tag => {
        return tag.active || (req.user && tag.author.id === req.user.id);
      });

  res.send({
    tags
    });
  });
  
  tagsRouter.get(`/:tags/posts`, async (req, res, next) => {
    // read the tagname from the params
  
    const { tags } = req.params;
    console.log("these are tags: ", tags)
    const { title, content } = req.body;
  const tagName = `%23${tags}`

    try {

        const posts = await getPostsByTagName(tags);

        res.send({posts})
      // use our method to get posts by tag name from the db
      // send out an object to the client { posts: // the posts }
    } catch ({ name, message }) {
      // forward the name and message to the error handler
      next({ name, message })
    }
  });

module.exports = tagsRouter;