const getUserIdByEmail = async (tx, userEmail) => {
	const q = `
    SELECT UserId FROM Users
    WHERE LOWER(Email)=LOWER(@UserEmail)
  `;

	const request = tx.request();
	const ret = await request.input('UserEmail', userEmail).query(q);
	return ret.recordset[0]?.UserId;
};

module.exports = {
	getUserIdByEmail,
};
