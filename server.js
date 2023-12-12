const express = require('express');
const app = express();
app.use(express.json());

const dotenv = require('dotenv');
dotenv.config();

const itemsPool = require('./DBConfig')

app.get('/', (req, res) => {
    res.send('API homepage');
})

app.get('/api/users', async(req, res) => {
    try {
        const allItems = await itemsPool.query(
            'SELECT * FROM users'
        );
        res.status(200).json(allItems.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})

app.post('/api/users', async (req, res) => {
    const { name, email, content } = req.body;
    try {
        const newItem = await itemsPool.query(
            'INSERT INTO users (name, email, content) VALUES ($1, $2, $3) RETURNING *',
            [name, email, content]
        );
        res.status(201).json({ 
            message: "New item added!",
            item: newItem.rows
         });
    } catch (error) {
        console.log(error);
        res.status(500).send(error.message)
    }
})

app.listen(5070, () => {
    console.log("Server running on port 5070");
})
