const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 6000;

const data = [
	{ id: 1, sender: 'User 1', message: 'Hello there!' },
	{ id: 2, sender: 'User 2', message: 'Hi! How can I help you?' },
	{ id: 3, sender: 'User 1', message: 'I need assistance with something.' },
];

app.use(bodyParser.json());

app.get('/messages', (req, res) => {
  res.json(data);
});

app.post('/messages', (req, res) => {
  const newMessage = req.body;
  newMessage.id = data.length + 1;
  data.push(newMessage);
  res.status(201).json(newMessage);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
