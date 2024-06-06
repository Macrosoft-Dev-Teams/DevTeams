const { Router } = require('express');

const { getUsers } = require('./users.cognito');
const { safeAddUser } = require('./users.db');

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
	const name = res.locals.name;

	const userId = await safeAddUser(email, name);
	res.status(201).json({ userId });
});

module.exports = {
	usersRouter,
};
