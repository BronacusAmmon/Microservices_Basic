const express = require('express'),
        bodyParser = require('body-parser'),
        cors = require('cors'),
        axios = require('axios')

const app = express(),
        port = 4002;


app.use(cors())
app.use(bodyParser.json())

const posts = {}

app.get('/posts', (req, res) =>{
    res.send(posts)
})


app.post('/events', (req, res) =>{
    const {type, data} = req.body
    handleEvent(type, data)
     res.end()
})

app.listen(port, async() =>{
    console.log(`listening on port ${port}`)
    try {
      const res = await axios.get("http://localhost:4005/events");
   
      for (let event of res.data) {
        console.log("Processing event:", event.type);
   
        handleEvent(event.type, event.data);
      }
    } catch (error) {
      console.log(error.message);
    }
})


const handleEvent = (type, data) =>{
    if(type === "PostCreated"){
        const {id, title} = data;

        posts[id] = {id, title, comments: []}
    }
    if(type === "CommentCreated") {
        console.log(data)
        const {id, comment, postId, status} = data

        const post = posts[postId];
        post.comments.push({id, content:comment, status})
    }
    if(type === "CommentUpdated"){
        const {id, postId, comment, status} = data

        const post = posts[postId]
        const commentUpdated = post.comments.find(comment =>{
            return comment.id === id
        })
        commentUpdated.status = status
        commentUpdated.comment = comment.comment
    }
}