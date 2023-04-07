const express = require('express'),
        cors = require('cors'),
        axios = require('axios'),
        bodyParser = require('body-parser'),
        {randomBytes} = require('crypto')


const app = express(),
        port = 4001;


//temporarily storing in memory, will update to DB after basic implimentation
const commentsByPostId = {};


app.use(cors());
app.use(bodyParser.json())


app.get('/posts/:id/comments', (req, res) =>{
    res.status(201).send(commentsByPostId[req.params.id] || [])
})

app.post('/posts/:id/comments', async (req, res) =>{
    const { comment } = req.body;
    const commentId = randomBytes(4).toString('hex')
    const comments = commentsByPostId[req.params.id] || [];
    comments.push({id: commentId, comment, status: 'pending'})
    commentsByPostId[req.params.id] = comments;

    await axios.post('http://localhost:4005/events', {
        type:"CommentCreated",
        data: {
            id: commentId,
            comment,
            postId: req.params.id,
            status: 'pending'
        }
    })

    res.status(201).send(comments)
})

app.post('/events', async (req, res) =>{
    console.log("Receved Event", req.body.type)
    const { type, data } = req.body;
    if(type === "CommentModerated") {
        console.log(data)
        const {postId, id, status, comment} = data;
        const comments = commentsByPostId[postId];
        const commentUpdated = comments.find(comment =>{
            return comment.id === id;
        })
        commentUpdated.status = status

        await axios.post("http://localhost:4005/events",
        {
            type:"CommentUpdated",
            data:{
                id,
                status,
                postId,
                comment: commentUpdated

            }
        })

    }
    res.end()
})


app.listen(port, () =>{
    console.log(`Server is lisening on port: ${port}`)
})