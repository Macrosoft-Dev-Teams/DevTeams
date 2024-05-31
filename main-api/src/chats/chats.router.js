const { Router } = require('express');
const { withTransaction } = require('../db');
const { createChat, getChats, getSearch } = require('./chats.db');

const chatsRouter = Router();

chatsRouter.post('/', (req, res) => {
	return withTransaction(async (tx) => {
		const chatId = await createChat(
			tx,
			res.locals.userId,
			req.body.otherUserId,
		);
		res.status(201).json({ chatId });
	});
});

chatsRouter.get('/', async (req, res) => {
	const chats = await getChats(res.locals.userId);
	res.status(201).json(chats);
});

chatsRouter.get('/search', async (req, res) => {
	const [users, teams] = await getSearch(res.locals.userId, req.body.searchStr);
	res.status(201).json({ users, teams });
});

module.exports = {
	chatsRouter,
};
