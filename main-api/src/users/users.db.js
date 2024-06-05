const safeAddUser = async (transaction, email, name) => {
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

	const request = transaction.request();

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

	const request = transaction.request();
	const response = await request.input('UserEmail', userEmail).query(query);
	return response.recordset[0]?.UserId;
};

module.exports = {
	safeAddUser,
	getUserIdByEmail,
};
