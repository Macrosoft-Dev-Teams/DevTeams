// const { db } = require('../db');

const createMessage = async (tx, userId, chatId, sentAt) => {
	const q = `
        INSERT INTO Messages(UserId, ChatId, SentAt, SavedAt)
        VALUES(@UserId, @ChatId, @SentAt, GETDATE());

        DECLARE @MessageId INT = SCOPE_IDENTITY();
        SELECT @MessageId as messageId;
    `;

	const request = tx.request();
	const ret = await request
		.input('UserId', userId)
		.input('ChatId', chatId)
		.input('SentAt', sentAt)
		.query(q);
	return ret.recordset[0].messageId;
};

const createTextMessage = async (tx, userId, chatId, sentAt, messageText) => {
	const messageId = await createMessage(tx, userId, chatId, sentAt);
	const q = `
        INSERT INTO TextMessages(MessageId, MessageText)
        VALUES(@MessageId, @MessageText);
        
        SELECT @TextMessageId as textMessageId;
	`;

	const request = tx.request();
	const ret = await request
		.input('MessageId', messageId)
		.input('MessageText', messageText)
		.query(q);

	return ret.recordset[0].textMessageId;
};

const createFileShareMessage = async (tx, userId, chatId, sentAt, filePath) => {
	const messageId = await createMessage(tx, userId, chatId, sentAt);
	const q = `
        INSERT INTO FileShareMessages(MessageId, FilePath)
        VALUES(@MessageId, @FilePath);
        
        SELECT @FileShareMessageId as fileShareMessageId;
	`;

	const request = tx.request();
	const ret = await request
		.input('MessageId', messageId)
		.input('FilePath', filePath)
		.query(q);

	return ret.recordset[0].textMessageId;
};

module.exports = {
	createTextMessage,
	createFileShareMessage,
};
