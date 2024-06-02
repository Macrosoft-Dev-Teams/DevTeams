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

const updateTeamName = async (tx, teamName, teamId) => {
	const q = `
		UPDATE Teams 
		SET TeamName = @TeamName 
		WHERE TeamId = @TeamId;
	
  		SELECT @TeamName as teamName;
  `;

	const request = tx.request();
	const ret = await request
		.input('TeamName', teamName)
		.input('TeamId', teamId)
		.query(q);

	return ret.recordset[0].teamName;
};

module.exports = {
	createTeam,
	updateTeamName,
};
