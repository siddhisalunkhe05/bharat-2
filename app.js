const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB (make sure MongoDB is running)
mongoose.connect('mongodb://localhost:27017/blog', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a mongoose schema
const postSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Post = mongoose.model('Post', postSchema);

// Serve the main page
app.get('/', async (req, res) => {
    const posts = await Post.find();
    res.sendFile(__dirname + '/index.html');
});

// Serve individual blog posts
app.get('/post/:postId', async (req, res) => {
    const post = await Post.findById(req.params.postId);
    if (post) {
        res.send(`<h2>${post.title}</h2><p>${post.content}</p>`);
    } else {
        res.send('Post not found.');
    }
});

// Handle form submissions to create a new post
app.post('/create-post', async (req, res) => {
    const newPost = new Post({
        title: req.body.title,
        content: req.body.content
    });

    await newPost.save();
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

