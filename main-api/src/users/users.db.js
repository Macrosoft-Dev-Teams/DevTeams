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

module.exports = {
	safeAddUser,
};
