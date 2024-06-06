export interface AppConfig {
	baseApi: string;
	IT_WORKS: string;
}

export interface WithMessageId {
  messageId: number,
}

export interface WithTeamId {
  teamId: number,
}

export interface WithTeamInviteId {
  teamInviteId: number,
}

export interface withUserId {
	userId: number,
}

export interface withChatId {
	chatId: number,
}

export interface Message {
	displayName: string,
	isCurrentUser: boolean,
	userIsDeleted: boolean,
	messageText?: string,
	filePath?: string,
	savedAt: string,
	sentAt: string,
	messageId: number,	
}

export interface Chat {
	chatId: number;
	teamId: number,
	chatName: string;
	messageText?: string;
	lastMessageAt?: string;
}

export interface TeamInvite {
	userId: number,
	teamId: number,
	teamName: string,
	deletedAt?: string,
	deletedBy?: string,
}


export interface User {
	userId?: number,
	displayName?: string,
}
