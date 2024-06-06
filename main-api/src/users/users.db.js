const { db } = require('../db');

const safeAddUser = async (email, name) => {
	const query = `
		DECLARE @UserId INT

		SELECT @UserId = UserId 
		FROM Users 
		WHERE Email = @email
		
		IF @UserId IS NULL
		BEGIN
			INSERT INTO Users (DisplayName, Email)
			VALUES (@name, @email)
	
			SELECT @UserId = SCOPE_IDENTITY()
		END
		
		SELECT @UserId AS UserId
  `;

	const request = await db();

	const response = await request
		.input('email', email)
		.input('name', name)
		.query(query);

	return response.recordset[0].UserId;
};

const getUserIdByEmail = async (transaction, userEmail) => {
	const query = `
    SELECT UserId FROM Users
    WHERE LOWER(Email)=LOWER(@UserEmail)
  `;

	const request = transaction ? transaction.request() : await db();
	const response = await request.input('UserEmail', userEmail).query(query);
	return response.recordset[0]?.UserId;
};

const getUserByEmail = async (currentUserId, userEmail) => {
	const query = `
    SELECT UserId as userId, DisplayName as displayName 
		FROM Users
    WHERE LOWER(Email)=LOWER(@UserEmail)
		AND UserId <> @UserId
  `;

	const request = await db();
	const response = await request
		.input('UserEmail', userEmail)
		.input('UserId', currentUserId)
		.query(query);
	return response.recordset[0];
};

module.exports = {
	safeAddUser,
	getUserIdByEmail,
	getUserByEmail,
};
