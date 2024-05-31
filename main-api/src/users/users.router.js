const { Router } = require('express');
const { withTransaction } = require('../db');
const { createChat, getChats, getSearch } = require('./users.db');

const usersRouter = Router();

usersRouter.post('/', (req, res) => {
	return withTransaction(async (tx) => {
		const chatId = await createChat(tx, res.locals.userId, req.body.otherUserId);
		res.status(201).json({ chatId });
	});
});

usersRouter.get('/all', (req, res) => {
	return withTransaction(async (tx) => {
		const chats = await getChats(tx, res.locals.userId);
		res.status(201).json({ chats });
	});
});

usersRouter.get('/search', (req, res) => {
	return withTransaction(async (tx) => {
		const [users, teams] = await getSearch(tx, res.locals.userId, req.body.searchStr);
		res.status(201).json({ users, teams });
	});
});

module.exports = {
	usersRouter,
};
