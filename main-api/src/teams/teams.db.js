const { db } = require('../db');

const teamAdminMembershipTypeDescription = 'Team Admin';
const regularTeamMembershipTypeDescription = 'Regular Team Member';

const getTeamMembershipTypeId = async (tx, description) => {
	const q = `SELECT TeamMembershipTypeId FROM TeamMembershipTypes
                    WHERE Description = @Description`;

	const request = tx.request();
	const ret = await request.input('Description', description).query(q);

	return ret.recordset[0].TeamMembershipTypeId;
};

const createTeam = async (tx, teamName, creatorUserId) => {
	const teamAdminMembershipTypeId = await getTeamMembershipTypeId(
		tx,
		teamAdminMembershipTypeDescription,
	);
	const q = `
  INSERT INTO Teams(TeamName)
    VALUES(@TeamName);

  DECLARE @TeamId INT = SCOPE_IDENTITY();
  SELECT @TeamId as teamId;

  INSERT INTO Chats(ChatName)
    VALUES(@TeamName);

  DECLARE @ChatId INT = SCOPE_IDENTITY();

  INSERT INTO TeamChats(TeamId, ChatId)
    VALUES(@TeamId, @ChatId);

  INSERT INTO TeamMemberships(UserId, TeamId, MembershipTypeId)
    VALUES(@CreatorUserId, @TeamId, @TeamAdminMembershipTypeId);
    
  SELECT @TeamId AS teamId;
  `;

	const request = tx.request();
	const ret = await request
		.input('TeamName', teamName)
		.input('TeamAdminMembershipTypeId', teamAdminMembershipTypeId)
		.input('CreatorUserId', creatorUserId)
		.query(q);

	return ret.recordset[0].teamId;
};

const updateTeamName = async (tx, teamName, teamId) => {
	const q = `
		UPDATE Teams 
		SET TeamName = @TeamName 
		WHERE TeamId = @TeamId;
	
		SELECT @TeamName AS teamName;
	`;

	const request = tx.request();
	const ret = await request
		.input('TeamName', teamName)
		.input('TeamId', teamId)
		.query(q);

	return ret.recordset[0].teamName;
};

const deleteTeam = async (tx, deletedBy, teamId) => {
	const q = `
		UPDATE TeamMemberships 
		SET DeletedAt = GETDATE(), DeletedBy = @DeletedBy 
		WHERE TeamId = @TeamId;

		UPDATE Teams
		SET DeletedAt = GETDATE(), DeletedBy = @DeletedBy 
		WHERE TeamId = @TeamId;

		SELECT @TeamId AS teamId;
	`;

	const request = tx.request();
	const ret = await request
		.input('DeletedBy', deletedBy)
		.input('TeamId', teamId)
		.query(q);
	return ret.recordset[0].teamId;
};

const addTeamInvite = async (tx, userId, teamId) => {
	const q = `
		INSERT INTO TeamInvites(UserId, TeamId)
		VALUES(@UserId, @TeamId);

		SELECT SCOPE_IDENTITY() AS TeamInviteId;
	`;

	const request = tx.request();
	const ret = await request
		.input('UserId', userId)
		.input('TeamId', teamId)
		.query(q);
	return ret.recordset[0].TeamInviteId;
};

const addTeamMember = async (tx, userId, teamId) => {
	const teamAdminMembershipTypeId = await getTeamMembershipTypeId(
		tx,
		teamAdminMembershipTypeDescription,
	);
	const q = `
		INSERT INTO TeamMemberships(UserId, TeamId, MembershipTypeId)
		VALUES(@UserId, @TeamId, @MembershipTypeId);

		DECLARE @TeamMembershipId INT = SCOPE_IDENTITY();
		SELECT @TeamMembershipId AS teamMembershipId;
	`;

	const request = tx.request();
	const ret = await request
		.input('SenUserIdtBy', userId)
		.input('TeamId', teamId)
		.input('MembershipTypeId', teamAdminMembershipTypeId)
		.query(q);
	return ret.recordset[0].teamMembershipId;
};

const removeTeamMember = async (tx, deletedBy, userId, teamId) => {
	const q = `
		UPDATE TeamMemberships 
		SET DeletedAt = GETDATE(), DeletedBy = @DeletedBy 
		WHERE TeamId = @TeamId AND UserId = @UserId;

		SELECT @TeamMembershipId AS teamMembershipId
		WHERE TeamId = @TeamId AND UserId = @UserId;
	`;

	const request = tx.request();
	const ret = await request
		.input('DeletedBy', deletedBy)
		.input('UserId', userId)
		.input('TeamId', teamId)
		.query(q);
	return ret.recordset[0].teamMembershipId;
};

const isTeamAdmin = async (tx, userId, teamId) => {
	const teamAdminMembershipTypeId = await getTeamMembershipTypeId(
		tx,
		teamAdminMembershipTypeDescription,
	);

	const q = `
		SELECT CASE WHEN EXISTS(
			SELECT 1 FROM TeamMemberships 
			WHERE UserId=@UserId 
			  AND TeamId=@TeamId
				AND MembershipTypeId=@TeamAdminMembershipTypeId
			  AND DeletedAt IS NULL) THEN
			1 ELSE 0 END AS [Exists]
	`;

	const request = tx.request();
	const ret = await request
		.input('UserId', userId)
		.input('TeamId', teamId)
		.input('TeamAdminMembershipTypeId', teamAdminMembershipTypeId)
		.query(q);

	return ret.recordset[0].Exists === 1;
};

const getActiveTeamInvite = async (tx, inviteId) => {
	if (tx) {
		return getActiveTeamInviteWithRequest(tx.request(), inviteId);
	} else {
		return getActiveTeamInviteWithRequest(await db(), inviteId);
	}
};

const getActiveTeamInviteWithRequest = async (request, inviteId) => {
	const q = `
	  SELECT TeamInvites.UserId as userId, TeamInvites.TeamId as teamId, Teams.TeamName as teamName, TeamInvites.DeletedAt as deletedAt, TeamInvites.DeletedBy as deletedBy
		FROM TeamInvites
		  INNER JOIN Teams on Teams.TeamId=TeamInvites.TeamId
		WHERE TeamInviteId=@InviteId AND TeamInvites.DeletedAt IS NULL
	`;

	const ret = await request.input('InviteId', inviteId).query(q);

	return ret.recordset[0];
};

const insertRegularTeamMembership = async (tx, userId, teamId) => {
	const regularTeamMembershipTypeId = await getTeamMembershipTypeId(
		tx,
		regularTeamMembershipTypeDescription,
	);
	const q = `
		INSERT INTO TeamMemberships(UserId, TeamId, MembershipTypeId)
		  VALUES(@UserId, @TeamId, @MembershipTypeId);

		SELECT SCOPE_IDENTITY() AS TeamMembershipId;
	`;

	const request = tx.request();
	const ret = await request
		.input('UserId', userId)
		.input('TeamId', teamId)
		.input('MembershipTypeId', regularTeamMembershipTypeId)
		.query(q);

	return ret.recordset[0].TeamMembershipId;
};

const deleteTeamInvite = async (tx, inviteId, deletedBy) => {
	const q = `
	  UPDATE TeamInvites SET
		  DeletedAt = GETDATE(),
			DeletedBy = @DeletedBy
		WHERE TeamInviteId = @TeamInviteId
	`;

	const request = tx.request();
	return request
		.input('TeamInviteId', inviteId)
		.input('DeletedBy', deletedBy)
		.query(q);
};

module.exports = {
	createTeam,
	updateTeamName,
	deleteTeam,
	addTeamMember,
	removeTeamMember,
	isTeamAdmin,
	addTeamInvite,
	getActiveTeamInvite,
	insertRegularTeamMembership,
	deleteTeamInvite,
};
