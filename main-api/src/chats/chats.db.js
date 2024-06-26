const { db } = require('../db');

const getUserDisplayName = async (tx, userId) => {
	const q = `SELECT DisplayName as displayName FROM Users
                    WHERE UserId = @UserId`;

	const request = tx.request();
	const ret = await request.input('UserId', userId).query(q);
	return ret.recordset[0].displayName;
};

const createChat = async (tx, creatorUserId, otherUserId) => {
	const creatorUserName = await getUserDisplayName(tx, creatorUserId);
	const otherUserName = await getUserDisplayName(tx, otherUserId);
	const q = `
		INSERT INTO Chats(ChatName)
			VALUES(@ChatName);

		DECLARE @ChatId INT = SCOPE_IDENTITY();

		INSERT INTO UserChats(UserId, ChatId)
			VALUES (@CreatorUserId, @ChatId), (@OtherUserId, @ChatId);
			
		SELECT @ChatId as chatId;
	`;

	const request = tx.request();
	const ret = await request
		.input('ChatName', `${creatorUserName}, ${otherUserName}`)
		.input('CreatorUserId', creatorUserId)
		.input('OtherUserId', otherUserId)
		.query(q);

	return ret.recordset[0].chatId;
};

const getChats = async (userId) => {
	const q = `
	SELECT cht.ChatId as chatId, TeamChats.TeamId as teamId, cht.CreatedAt as createdAt, cht.ChatName AS chatName, msg.SavedAt AS lastMessageAt, msg.MessageText as messageText
	FROM Chats as cht
	INNER JOIN (
		SELECT ChatId FROM TeamChats as tc
		INNER JOIN (
			SELECT UserId, TeamId 
			FROM TeamMemberships
			WHERE UserId = @UserId
		) AS tm ON tm.TeamId = tc.TeamId
		UNION
		SELECT ChatId 
		FROM UserChats as uc
		WHERE UserId = @UserId
	) AS cids ON cids.ChatId = cht.ChatId
	LEFT JOIN (
		SELECT msgg.ChatId, msgg.SavedAt, tm.MessageText
		FROM (
			 SELECT *,
				 ROW_NUMBER() OVER (PARTITION BY ChatId ORDER BY SavedAt DESC) AS rn
			 FROM Messages
		) AS msgg
		LEFT JOIN TextMessages AS tm ON msgg.MessageId = tm.MessageId
		WHERE msgg.rn = 1
	) AS msg ON msg.ChatId = cht.ChatId
	LEFT JOIN TeamChats ON TeamChats.ChatId=cht.ChatId
	ORDER BY COALESCE(msg.SavedAt, cht.CreatedAt) DESC;
	`;

	const request = await db();
	const ret = await request.input('UserId', userId).query(q);

	return ret.recordset;
};

const getUsers = async (userId, searchStr) => {
	const q = `
		SELECT DisplayName as displayName FROM Users
		WHERE DisplayName LIKE '%'+@SearchStr+'%'
		AND UserId <> @UserId
		ORDER BY DisplayName;
	`;

	const request = await db();
	const ret = await request
		.input('UserId', userId)
		.input('SearchStr', searchStr)
		.query(q);

	return ret.recordset;
};

const getTeams = async (userId, searchStr) => {
	const q = `
		SELECT TeamName as teamName FROM Teams AS t
		INNER JOIN (
			SELECT TeamId FROM TeamMemberships
			WHERE UserId = @UserId
		) AS tm ON tm.TeamId = t.TeamId
		WHERE TeamName LIKE '%'+@SearchStr+'%'
		ORDER BY TeamName;
	`;

	const request = await db();
	const ret = await request
		.input('UserId', userId)
		.input('SearchStr', searchStr)
		.query(q);

	return ret.recordset;
};

const getSearch = async (userId, searchStr) => {
	const users = await getUsers(userId, searchStr);

	const teams = await getTeams(userId, searchStr);

	return [users, teams];
};

const isChatMember = async (userId, chatId) => {
	const q = `
		SELECT CASE WHEN EXISTS(
			SELECT 1 FROM (
				SELECT ChatId FROM TeamChats as tc
				INNER JOIN (
					SELECT UserId, TeamId 
					FROM TeamMemberships
					WHERE UserId = @UserId
				) AS tm ON tm.TeamId = tc.TeamId
				UNION
				SELECT ChatId 
				FROM UserChats as uc
				WHERE UserId = @UserId
			) AS cids
			WHERE cids.ChatId = @ChatId
		) THEN 1 ELSE 0 END AS [Exists]
	`;

	const request = await db();
	const ret = await request
		.input('UserId', userId)
		.input('ChatId', chatId)
		.query(q);

	return ret.recordset[0].Exists === 1;
};

const safeCreateChat = async (tx, creatorUserId, otherUserId) => {
	const creatorUserName = await getUserDisplayName(tx, creatorUserId);
	const otherUserName = await getUserDisplayName(tx, otherUserId);
	const query = `
		DECLARE @ChatId INT

		SELECT @ChatId = uc1.ChatId
		FROM UserChats as uc1
		INNER JOIN UserChats as uc2
		ON uc1.ChatId = uc2.ChatId
		WHERE uc1.UserId = 1
		AND uc2.UserId = 2
				
		IF @ChatId IS NULL
		BEGIN
			INSERT INTO Chats(ChatName)
				VALUES(@ChatName);
		
			SELECT @ChatId = SCOPE_IDENTITY();
		
			INSERT INTO UserChats(UserId, ChatId)
				VALUES (@CreatorUserId, @ChatId), (@OtherUserId, @ChatId);
		END
				
		SELECT @ChatId AS chatId
  `;

	const request = tx.request();

	const response = await request
		.input('ChatName', `${creatorUserName}, ${otherUserName}`)
		.input('CreatorUserId', creatorUserId)
		.input('OtherUserId', otherUserId)
		.query(query);

	return response.recordset[0].chatId;
};

const getUserChat = async (chatId) => {
	const q = `
	SELECT cht.ChatId as chatId, TeamChats.TeamId as teamId, cht.CreatedAt as createdAt, cht.ChatName AS chatName, msg.SavedAt AS lastMessageAt, msg.MessageText as messageText
	FROM UserChats as cht
	LEFT JOIN (
		SELECT msgg.ChatId, msgg.SavedAt, tm.MessageText
		FROM (
			 SELECT *,
				 ROW_NUMBER() OVER (PARTITION BY ChatId ORDER BY SavedAt DESC) AS rn
			 FROM Messages
		) AS msgg
		LEFT JOIN TextMessages AS tm ON msgg.MessageId = tm.MessageId
		WHERE msgg.rn = 1
	) AS msg ON msg.ChatId = cht.ChatId
	LEFT JOIN TeamChats ON TeamChats.ChatId=cht.ChatId
	WHERE cht.ChatId = @ChatId;
	`;

	const request = await db();
	const ret = await request.input('ChatId', chatId).query(q);
	return ret.recordset[0];
};

module.exports = {
	createChat,
	getChats,
	getSearch,
	isChatMember,
	safeCreateChat,
	getUserChat,
};
