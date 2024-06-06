const { Router } = require('express');
const { withTransaction } = require('../db');
const {
	safeCreateChat,
	getChats,
	getSearch,
	isChatMember,
} = require('./chats.db');
const {
	createTextMessage,
	createFileShareMessage,
	getMessages,
} = require('./messages.db');

const chatsRouter = Router();
const textLimit = 2000;

// TODO: Should create new chat or return existing chat. Only one chat between two users.
chatsRouter.post('/', (req, res) => {
	return withTransaction(async (tx) => {
		const chatId = await safeCreateChat(
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
			req.body.messageText.substring(
				0,
				Math.min(textLimit, req.body.messageText.length),
			),
		);
		res.status(201).json({ messageId });
	});
});

chatsRouter.post('/:chatId/messages/file', (req, res) => {
	return withTransaction(async (tx) => {
		if (await isChatMember(res.locals.userId, parseInt(req.params.chatId))) {
			const messageId = await createFileShareMessage(
				tx,
				res.locals.userId,
				parseInt(req.params.chatId),
				new Date(),
				req.body.filePath,
			);
			res.status(201).json({ messageId });
		} else {
			res.status(403).json({ message: 'Cannot perform this operation.' });
		}
	});
});

chatsRouter.get('/:chatId/messages', async (req, res) => {
	if (await isChatMember(res.locals.userId, parseInt(req.params.chatId))) {
		const messages = await getMessages(
			res.locals.userId,
			parseInt(req.params.chatId),
		);
		res.status(200).json(messages);
	} else {
		res.status(403).json({ message: 'Cannot perform this operation.' });
	}
});

chatsRouter.get('/', async (req, res) => {
	const chats = await getChats(res.locals.userId);
	res.status(200).json(chats);
});

chatsRouter.get('/search', async (req, res) => {
	const [users, teams] = await getSearch(res.locals.userId, req.body.searchStr);
	res.status(200).json({ users, teams });
});

module.exports = {
	chatsRouter,
};
