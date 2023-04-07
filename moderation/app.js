const express = require('express'),
        bodyParser = require('body-parser'),
        axios = require('axios');


const app = express(),
        port = 4003;

app.use(bodyParser.json())

app.post("/events", async(req, res) =>{
    const {type, data} = req.body

    if(type === "CommentCreated"){
        const status = data.comment.includes("orange") ? 'rejected' : 'approved'
        await axios.post("http://localhost:4005/events", 
        {
        type: 'CommentModerated',
        data: {
            id: data.id,
            postId: data.postId,
            status,
            content: data.content
        }
    })
    res.end()
}})

app.listen(port, () => console.log(`Listening on port ${port}`))