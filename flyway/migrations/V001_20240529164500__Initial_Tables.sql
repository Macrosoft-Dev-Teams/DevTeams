CREATE TABLE Users (
    UserId INT IDENTITY(1, 1) PRIMARY KEY,
    Email VARCHAR(256) NOT NULL,
    DisplayName NVARCHAR(128) NOT NULL,
    DeletedAt DATETIME,
    DeletedBy INT,

    CONSTRAINT fk_Users_DeletedBy FOREIGN KEY (DeletedBy) REFERENCES Users(UserId)
);

CREATE TABLE AdminUsers (
    AdminUserId INT IDENTITY(1, 1) PRIMARY KEY,
    UserId INT NOT NULL,
    DeletedAt DATETIME,
    DeletedBy INT,

    CONSTRAINT fk_AdminUsers_UserId FOREIGN KEY (UserId) REFERENCES Users(UserId),
    CONSTRAINT fk_AdminUsers_DeletedBy FOREIGN KEY (DeletedBy) REFERENCES Users(UserId)
);

CREATE TABLE Chats (
    ChatId INT IDENTITY(1, 1) PRIMARY KEY,
    ChatName NVARCHAR(128) NOT NULL,
);

CREATE TABLE UserChats (
    UserChatId INT IDENTITY(1, 1) PRIMARY KEY,
    UserId INT NOT NULL,
    ChatId INT NOT NULL,

    CONSTRAINT fk_UserChats_UserId FOREIGN KEY (UserId) REFERENCES Users(UserId),
    CONSTRAINT fk_UserChats_ChatId FOREIGN KEY (ChatId) REFERENCES Chats(ChatId)
);

CREATE TABLE Teams (
    TeamId INT IDENTITY(1, 1) PRIMARY KEY,
    TeamName NVARCHAR(128) NOT NULL,
    DeletedAt DATETIME,
    DeletedBy INT,

    CONSTRAINT fk_Teams_DeletedBy FOREIGN KEY (DeletedBy) REFERENCES Users(UserId)
);

CREATE TABLE TeamChats (
    TeamChatId INT IDENTITY(1, 1) PRIMARY KEY,
    TeamId INT NOT NULL,
    ChatId INT NOT NULL,

    CONSTRAINT fk_TeamChats_TeamId FOREIGN KEY (TeamId) REFERENCES Teams(TeamId),
    CONSTRAINT fk_TeamChats_ChatId FOREIGN KEY (ChatId) REFERENCES Chats(ChatId)
);

CREATE TABLE TeamMembershipTypes (
    TeamMembershipTypeId INT IDENTITY(1, 1) PRIMARY KEY,
    Description VARCHAR(32)
);

CREATE TABLE TeamMemberships (
    TeamMembershipId INT IDENTITY(1, 1) PRIMARY KEY,
    UserId INT NOT NULL,
    TeamId INT NOT NULL,
    MembershipTypeId INT NOT NULL,
    DeletedAt DATETIME,
    DeletedBy INT,

    CONSTRAINT fk_TeamMemberships_UserId FOREIGN KEY (UserId) REFERENCES Users(UserId),
    CONSTRAINT fk_TeamMemberships_TeamId FOREIGN KEY (TeamId) REFERENCES Teams(TeamId),
    CONSTRAINT fk_TeamMemberships_MembershipTypeId FOREIGN KEY (MembershipTypeId) REFERENCES TeamMembershipTypes(TeamMembershipTypeId),
    CONSTRAINT fk_TeamMemberships_DeletedBy FOREIGN KEY (DeletedBy) REFERENCES Users(UserId)    
);

CREATE TABLE Messages (
    MessageId INT IDENTITY(1, 1) PRIMARY KEY,
    ChatId INT NOT NULL,
    SentAt DATETIME NOT NULL,
    SavedAt DATETIME NOT NULL,

    CONSTRAINT fk_Messages_ChatId FOREIGN KEY (ChatId) REFERENCES Chats(ChatId)
);

CREATE TABLE TextMessages (
    TextMessageId INT IDENTITY(1, 1) PRIMARY KEY,
    MessageId INT NOT NULL,
    MessageText TEXT NOT NULL,

    CONSTRAINT fk_TextMessages_MessageId FOREIGN KEY (MessageId) REFERENCES Messages(MessageId)
);

CREATE TABLE FileShareMessages (
    FileShareMessageId INT IDENTITY(1, 1) PRIMARY KEY,
    MessageId INT NOT NULL,
    Filepath VARCHAR(256) NOT NULL,

    CONSTRAINT fk_FileShareMessages_MessageId FOREIGN KEY (MessageId) REFERENCES Messages(MessageId)
);
