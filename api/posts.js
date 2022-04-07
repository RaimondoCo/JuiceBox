const express = require('express');
const postsRouter = express.Router();

postsRouter.use((req, res, next) => {
  console.log("A request is being made to /posts");

  next();
});

const { getAllPosts, createPost, updatePost, getPostById} = require('../db');

postsRouter.get('/', async (req, res) => {
    const posts = await getAllPosts();

  res.send({
    posts
    });
  });
  
const {requireUser} = require('./utils');

postsRouter.post('/', requireUser, async (req, res, next) => {
    const { title, content, tags = "" } = req.body;


    const tagArr = tags.trim().split(/\s+/)
    const postData = {};

    if (tagArr.length) {
        postData.tags = tagArr;
      }
    
      try {
        // add authorId, title, content to postData object
       postData.authorId = req.user.id;
        postData.title = title;
        postData.content = content;

        const post = await createPost(postData);
        // this will create the post and the tags for us
        if (post) {
            res.send({ post });
        } else {
            console.log("no post received!")
        }
        // otherwise, next an appropriate error object 
      } catch ({ name, message }) {
        next({ name, message });
      }

  });


  postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
    const { postId } = req.params;
    const { title, content, tags } = req.body;
  
    const updateFields = {};
  
    if (tags && tags.length > 0) {
      updateFields.tags = tags.trim().split(/\s+/);
    }
  
    if (title) {
      updateFields.title = title;
    }
  
    if (content) {
      updateFields.content = content;
    }
  
    try {
      const originalPost = await getPostById(postId);
  
      if (originalPost.author.id === req.user.id) {
        const updatedPost = await updatePost(postId, updateFields);
        res.send({ post: updatedPost })
      } else {
        next({
          name: 'UnauthorizedUserError',
          message: 'You cannot update a post that is not yours'
        })
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });

module.exports = postsRouter;