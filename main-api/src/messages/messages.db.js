const { db } = require('../db');

const createMessage = async (tx, sentBy, chatId, sentAt) => {
	const q = `
      INSERT INTO Messages(SentBy, ChatId, SentAt, SavedAt)
      VALUES(@SentBy, @ChatId, @SentAt, GETDATE());

      DECLARE @MessageId INT = SCOPE_IDENTITY();
      SELECT @MessageId as messageId;
    `;

	const request = tx.request();
	const ret = await request
		.input('SentBy', sentBy)
		.input('ChatId', chatId)
		.input('SentAt', sentAt)
		.query(q);
	return ret.recordset[0].messageId;
};

const createTextMessage = async (tx, sentBy, chatId, sentAt, messageText) => {
	const messageId = await createMessage(tx, sentBy, chatId, sentAt);
	const q = `
    INSERT INTO TextMessages(MessageId, MessageText)
    VALUES(@MessageId, @MessageText);
    
    DECLARE @TextMessageId INT = SCOPE_IDENTITY();
    SELECT @TextMessageId as textMessageId;
	`;

	const request = tx.request();
	const ret = await request
		.input('MessageId', messageId)
		.input('MessageText', messageText)
		.query(q);

	return ret.recordset[0].textMessageId;
};

const createFileShareMessage = async (tx, sentBy, chatId, sentAt, filePath) => {
	const messageId = await createMessage(tx, sentBy, chatId, sentAt);
	const q = `
    INSERT INTO FileShareMessages(MessageId, FilePath)
    VALUES(@MessageId, @FilePath);
    
    DECLARE @FileShareMessageId INT = SCOPE_IDENTITY();
    SELECT @FileShareMessageId as fileShareMessageId;
	`;

	const request = tx.request();
	const ret = await request
		.input('MessageId', messageId)
		.input('FilePath', filePath)
		.query(q);

	return ret.recordset[0].textMessageId;
};

const getMessages = async (sentBy, chatId) => {
	const q = `
    SELECT u.DisplayName AS displayName, u.IsCurrentUser AS isCurrentUser, u.UserIsDeleted AS userIsDeleted, 
      tm.MessageText AS messageText, fm.FilePath AS filePath, msg.SavedAt AS savedAt
    FROM Messages AS msg
    JOIN (
      SELECT UserId, DisplayName, 
          CASE WHEN DeletedAt IS NULL THEN 'True' ELSE 'False' END AS UserIsDeleted,
          CASE WHEN UserId = @SentBy THEN 'True' ELSE 'False' END AS IsCurrentUser
      FROM Users
    ) AS u ON u.UserId = msg.SentBy
    LEFT JOIN FileShareMessages AS fm 
      ON fm.MessageId = msg.MessageId
    LEFT JOIN TextMessages AS tm 
      ON tm.MessageId = msg.MessageId
    WHERE ChatId = @ChatId
    ORDER BY msg.SavedAt;
	`;

	const request = await db();
	const ret = await request
		.input('SentBy', sentBy)
		.input('ChatId', chatId)
		.query(q);

	return ret.recordset;
};

module.exports = {
	createTextMessage,
	createFileShareMessage,
	getMessages,
};
