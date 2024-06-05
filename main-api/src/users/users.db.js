const safeAddUser = async (transaction, email, name) => {
	const query = `
    DECLARE @UserId INT
    IF EXISTS (SELECT 1 FROM Users WHERE Email=@email)
    BEGIN 
      INSERT INTO Users (Email, DisplayName)
      VALUES (@email, COALESCE(@name, ''))
    END
    SET @UserId = SCOPE_IDENTITY()
 
    SELECT @UserId AS userId
  `;

	const request = transaction.request();

	const response = await request
		.input('email', email)
		.input('name', name)
		.query(query);

	return response.recordset[0].userId;
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
