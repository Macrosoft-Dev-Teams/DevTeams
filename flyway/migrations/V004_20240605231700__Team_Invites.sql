CREATE TABLE TeamInvites
(
  TeamInviteId INT IDENTITY(1, 1) PRIMARY KEY,
  UserId INT NOT NULL,
  TeamId INT NOT NULL,
  DeletedAt DATETIME,
  DeletedBy INT,

  CONSTRAINT fk_TeamInvites_UserId FOREIGN KEY (UserId) REFERENCES Users(UserId),
  CONSTRAINT fk_TeamInvites_TeamId FOREIGN KEY (TeamId) REFERENCES Teams(TeamId)
)