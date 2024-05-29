const auth = async (req, res, next) => {
	// TODO: Do auth stuff and provide value for the logged in user id
	// Right now assuming that the user id is passed in the auth header (not secure).
	res.locals.userId = parseInt(req.headers['authorization']);
	next();
};

module.exports = {
	auth,
};
