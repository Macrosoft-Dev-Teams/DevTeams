const teamAdminMebershipTypeDescription = 'Team Admin';

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
		teamAdminMebershipTypeDescription,
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
    
  SELECT @TeamId as teamId;
  `;

	const request = tx.request();
	const ret = await request
		.input('TeamName', teamName)
		.input('TeamAdminMembershipTypeId', teamAdminMembershipTypeId)
		.input('CreatorUserId', creatorUserId)
		.query(q);

	return ret.recordset[0].teamId;
};

module.exports = {
	createTeam,
};
