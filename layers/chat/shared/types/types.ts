import type {
	Message as PrismaMessage,
	Chat as PrismaChat,
	Project as PrismaProject,
	MessageRole as PrismaMessageRole,
	Prisma,
} from "@prisma/client";

export type Message = PrismaMessage;
export type Chat = PrismaChat;
export type Project = PrismaProject;
export type MessageRole = PrismaMessageRole;

// https://www.prisma.io/docs/orm/prisma-client/type-safety
export type ChatWithMessages = Prisma.ChatGetPayload<{
	include: {
		messages: true;
		project: true;
	};
}>;

export type MessagesWithChat = Prisma.MessageGetPayload<{
	include: {
		chat: true;
	};
}>;

export type ProjectWithChats = Prisma.ProjectGetPayload<{
	include: {
		chats: {
			include: {
				messages: true;
			};
		};
	};
}>;

// Old types when there was no db and prisma:
// we will rename this ChatMessage to Message type
// export interface ChatMessage {
// 	id: string;
// 	role: "user" | "assistant";
// 	content: string;
// 	createdAt: Date;
// 	updatedAt: Date;
// }

// export interface Chat {
// 	id: string;
// 	title: string;
// 	messages: ChatMessage[];
// 	projectId?: string;
// 	createdAt: Date;
// 	updatedAt: Date;
// }

// export interface Project {
// 	id: string;
// 	name: string;
// 	createdAt: Date;
// 	updatedAt: Date;
// }

// export interface ChatWithProject extends Chat {
// 	project: Project | null;
// }
