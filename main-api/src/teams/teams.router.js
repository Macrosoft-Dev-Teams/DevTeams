const { Router } = require('express');
const { withTransaction } = require('../db');
const {
	createTeam,
	updateTeamName,
	deleteTeam,
	addTeamMember,
	removeTeamMember,
} = require('./teams.db');

const teamsRouter = Router();
const teamNameLimit = 128;

teamsRouter.post('/', (req, res) => {
	return withTransaction(async (tx) => {
		const teamId = await createTeam(
			tx,
			req.body.teamName.substring(
				0,
				Math.min(teamNameLimit, req.body.teamName.length),
			),
			1,
		);
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

teamsRouter.delete('/', (req, res) => {
	return withTransaction(async (tx) => {
		const teamId = await deleteTeam(tx, res.locals.userId, req.body.teamId);
		res.status(201).json({ teamId });
	});
});

teamsRouter.post('/member', (req, res) => {
	return withTransaction(async (tx) => {
		const teamMembershipId = await addTeamMember(
			tx,
			req.body.userId,
			req.body.teamId,
		);
		res.status(201).json({ teamMembershipId });
	});
});

teamsRouter.delete('/member', (req, res) => {
	return withTransaction(async (tx) => {
		const teamMembershipId = await removeTeamMember(
			tx,
			res.locals.userId,
			req.body.userId,
			req.body.teamId,
		);
		res.status(201).json({ teamMembershipId });
	});
});

module.exports = {
	teamsRouter,
};
