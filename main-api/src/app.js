require('dotenv').config();

const express = require('express');

const { configRouter } = require('./config/config');
const { teamsRouter } = require('./teams/teams.router');
const { chatsRouter } = require('./chats/chats.router');
const { usersRouter } = require('./users/users.router');

const { auth } = require('./auth');

const PORT = process.env.PORT || 3001;
const app = express();

const helmet = require('helmet');
const cors = require('cors');

app.use(express.json());
app.use(helmet());
app.use(cors());

app.use('/config', configRouter);

app.use(auth);
app.use('/teams', teamsRouter);
app.use('/chats', chatsRouter);
app.use('/users', usersRouter);

app.get('/', (req, res) => {
	res.status(200).send(JSON.stringify('Server status: OK'));
});

app.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`Main API is running on port ${PORT}`);
});
