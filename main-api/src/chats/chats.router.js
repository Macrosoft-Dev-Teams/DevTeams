const { Router } = require('express');
const { withTransaction } = require('../db');
const { createChat, getChats, getSearch } = require('./chats.db');
const {
	createTextMessage,
	createFileShareMessage,
	getMessages,
} = require('../messages/messages.db');

const chatsRouter = Router();

// TODO: Should create new chat or return existing chat. Only one chat between two users.
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

chatsRouter.post('/:chatId/messages/text', (req, res) => {
	return withTransaction(async (tx) => {
		const messageId = await createTextMessage(
			tx,
			res.locals.userId,
			parseInt(req.params.chatId),
			new Date(),
			req.body.messageText,
		);
		res.status(201).json({ messageId });
	});
});

chatsRouter.post('/:chatId/messages/file', (req, res) => {
	return withTransaction(async (tx) => {
		const messageId = await createFileShareMessage(
			tx,
			res.locals.userId,
			parseInt(req.params.chatId),
			new Date(),
			req.body.filePath,
		);
		res.status(201).json({ messageId });
	});
});

chatsRouter.get('/:chatId', async (req, res) => {
	const messages = await getMessages(res.locals.userId, req.params.chatId);
	res.status(201).json(messages);
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
