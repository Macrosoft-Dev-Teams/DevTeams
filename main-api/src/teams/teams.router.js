const { Router } = require('express');
const { withTransaction } = require('../db');
const { createTeam, updateTeamName } = require('./teams.db');

const teamsRouter = Router();

teamsRouter.post('/', (req, res) => {
	return withTransaction(async (tx) => {
		const teamId = await createTeam(tx, req.body.teamName, 1);
		res.status(201).json({ teamId });
	});
});

teamsRouter.put('/', (req, res) => {
	return withTransaction(async (tx) => {
		const teamName = await updateTeamName(
			tx,
			req.body.teamName,
			req.body.teamId,
		);
		res.status(201).json({ teamName });
	});
});

module.exports = {
	teamsRouter,
};
