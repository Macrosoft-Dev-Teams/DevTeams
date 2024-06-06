require('dotenv').config();
const path = require('path');

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

const authenticatedApiRouter = express.Router();
authenticatedApiRouter.use(auth);
authenticatedApiRouter.use('/teams', teamsRouter);
authenticatedApiRouter.use('/chats', chatsRouter);
authenticatedApiRouter.use('/users', usersRouter);

app.use("/api", authenticatedApiRouter);
app.use('/config', configRouter);
app.use(express.static(path.join(__dirname, '../dist/frontend/browser')));

app.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.log(`Main API is running on port ${PORT}`);
});
