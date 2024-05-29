const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

let data = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Alice Johnson', email: 'alice@example.com' }
];

app.use(bodyParser.json());

app.get('/users', (req, res) => {
    res.json(data);
});

app.post('/users', (req, res) => {
    const newUser = req.body;
    newUser.id = data.length + 1;
    data.push(newUser);
    res.status(201).json(newUser);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
