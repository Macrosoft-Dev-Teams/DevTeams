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
