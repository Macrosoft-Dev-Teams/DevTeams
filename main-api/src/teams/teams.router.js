const { Router } = require('express');
const { withTransaction } = require('../db');
const { createTeam } = require('./teams.db');

const teamsRouter = Router();

teamsRouter.post('/', (req, res) => {
	return withTransaction(async (tx) => {
		const teamId = await createTeam(tx, req.body.teamName, res.locals.userId);
		res.status(201).json({ teamId });
	});
});

module.exports = {
	teamsRouter,
};
