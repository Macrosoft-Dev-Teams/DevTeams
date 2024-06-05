const { Router } = require('express');
const { withTransaction } = require('../db');

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

usersRouter.post('/', (req, res) => {
	return withTransaction(async (transaction) => {
		const userId = await safeAddUser(
			transaction,
			req.body.email,
			req.body.name,
		);

		res.status(201).json({ userId });
	});
});

module.exports = {
	usersRouter,
};
