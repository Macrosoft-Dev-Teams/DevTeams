const { Router } = require('express');
const { withTransaction } = require('../db');
const {
	createTeam,
	updateTeamName,
	deleteTeam,
	isTeamAdmin,
	addTeamInvite,
} = require('./teams.db');
const { getUserIdByEmail } = require('../users/users.db');

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
			res.locals.userId,
		);
		res.status(201).json({ teamId });
	});
});

teamsRouter.put('/:teamId', (req, res) => {
	return withTransaction(async (tx) => {
		if (await isTeamAdmin(tx, res.locals.userId, parseInt(req.params.teamId))) {
			const teamName = await updateTeamName(
				tx,
				req.body.teamName.substring(
					0,
					Math.min(teamNameLimit, req.body.teamName.length),
				),
				req.body.teamId,
			);
			res.status(200).json({ teamName });
		} else {
			res.status(403).json({ message: 'Cannot perform this operation.' });
		}
	});
});

teamsRouter.delete('/:teamId', (req, res) => {
	return withTransaction(async (tx) => {
		if (await isTeamAdmin(tx, res.locals.userId, parseInt(req.params.teamId))) {
			const teamId = await deleteTeam(tx, res.locals.userId, req.body.teamId);
			res.status(200).json({ teamId });
		} else {
			res.status(403).json({ message: 'Cannot perform this operation.' });
		}
	});
});

teamsRouter.post('/:teamId/members', (req, res) => {
	return withTransaction(async (tx) => {
		if (await isTeamAdmin(tx, res.locals.userId, parseInt(req.params.teamId))) {
			const teamMemberId = await getUserIdByEmail(tx, req.body.userEmail);
			if (teamMemberId) {
				const teamInviteId = await addTeamInvite(
					tx,
					teamMemberId,
					req.params.teamId,
				);
				res.status(201).json({ teamInviteId });
			} else {
				res
					.status(400)
					.json({ message: 'User not found. Can only invite existing users.' });
			}
		} else {
			res.status(403).json({ message: 'Cannot perform this operation.' });
		}
	});
});

module.exports = {
	teamsRouter,
};
