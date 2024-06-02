const { Router } = require('express');
const { withTransaction } = require('../db');
const {
	createTextMessage,
	createFileShareMessage,
	getMessages,
} = require('./messages.db');

const messagesRouter = Router();

messagesRouter.get('/', async (req, res) => {
	const messages = await getMessages(res.locals.userId, req.body.chatId);
	res.status(201).json(messages);
});

messagesRouter.post('/', (req, res) => {
	return withTransaction(async (tx) => {
		const messageId = await createTextMessage(
			tx,
			res.locals.userId,
			req.body.chatId,
			req.body.sentAt,
			req.body.messageText,
		);
		res.status(201).json({ messageId });
	});
});

messagesRouter.post('/file', (req, res) => {
	return withTransaction(async (tx) => {
		const messageId = await createFileShareMessage(
			tx,
			res.locals.userId,
			req.body.chatId,
			req.body.sentAt,
			req.body.filePath,
		);
		res.status(201).json({ messageId });
	});
});

module.exports = {
	messagesRouter,
};
