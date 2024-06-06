const { Router } = require('express');

const { getUsers } = require('./users.cognito');
const { safeAddUser, getUserByEmail } = require('./users.db');

const usersRouter = Router();

usersRouter.get('/', async (req, res) => {
	const response = await getUsers();

	if (!response.ok) {
		res.status(500).json(response.error);
	}

	res.status(200).json(response.data);
});

usersRouter.post('/', async (req, res) => {
	const email = res.locals.email;
	const name = res.locals.displayName;

	const userId = await safeAddUser(email, name);
	res.status(201).json({ userId });
});

usersRouter.get('/search/:userEmail', async (req, res) => {
	const response = await getUserByEmail(
		res.locals.userId,
		req.params.userEmail,
	);
	if (response == undefined) {
		res.status(400).json({ Response: 'User does not exist' });
	} else if (!response.ok) {
		res.status(500).json(response.error);
	} else {
		res.status(200).json(response.data);
	}
});

module.exports = {
	usersRouter,
};
