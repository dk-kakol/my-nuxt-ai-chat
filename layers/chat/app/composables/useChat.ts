export default function useChat(chatId: string) {
	const { chats } = useChats();
	const chat = computed(() => chats.value.find((c) => c.id === chatId));

	const messages = computed<ChatMessage[]>(() => chat.value?.messages || []);

	const { data, execute, status } = useFetch<ChatMessage[]>(
		`/api/chats/${chatId}/messages`,
		{
			default: () => [],
			immediate: false,
		},
	);

	async function fetchMessages({
		refresh = false,
	}: {
		refresh?: boolean;
	} = {}) {
		const hasExistingMessages = messages.value.length > 1;
		const isRequestInProgress = status.value !== "idle";
		const shouldSkipDueToExistingState =
			!refresh && (hasExistingMessages || isRequestInProgress);

		if (shouldSkipDueToExistingState || !chat.value) {
			return;
		}

		await execute();
		chat.value.messages = data.value;
	}

	async function generateChatTitle(message: string) {
		if (!chat.value) return;

		const updatedChat = await $fetch<Chat>(`/api/chats/${chatId}/title`, {
			method: "POST",
			body: {
				message,
			},
		});
		chat.value.title = updatedChat.title;
	}

	async function sendMessage(message: string) {
		if (!chat.value) return;

		if (messages.value.length === 0) {
			generateChatTitle(message);
		}

		// const newMessage = await $fetch<ChatMessage>(
		// 	`/api/chats/${chatId}/messages`,
		// 	{
		// 		method: "POST",
		// 		body: {
		// 			content: message,
		// 			role: "user",
		// 		},
		// 	},
		// );
		// messages.value.push(newMessage);
		const optimisticUserMessage: ChatMessage = {
			id: `optimistic-user-message-${Date.now()}`,
			role: "user",
			content: message,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		messages.value.push(optimisticUserMessage);

		const userMessageIndex = messages.value.length - 1;

		try {
			const newMessage = await $fetch<ChatMessage>(
				`/api/chats/${chatId}/messages`,
				{
					method: "POST",
					body: {
						content: message,
						role: "user",
					},
				},
			);
			messages.value[userMessageIndex] = newMessage;
		} catch (error) {
			console.error("Error sending user message", error);
			messages.value.splice(userMessageIndex, 1);
			return;
		}

		// const aiResponse = await $fetch<ChatMessage>(
		// 	`/api/chats/${chatId}/messages/generate`,
		// 	{
		// 		method: "POST",
		// 	},
		// );
		// messages.value.push(aiResponse);

		// starting placeholder for streaming response
		messages.value.push({
			id: `streaming-message-${Date.now()}`,
			role: "assistant",
			content: "",
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		// wyciągamy ostatnią wiadomość, która jest tą strumieniowaną
		// będziemy ją aktualizować w miarę napływania danych
		const lastMessage = messages.value[
			messages.value.length - 1
		] as ChatMessage;

		try {
			const response = await $fetch<ReadableStream>(
				`/api/chats/${chatId}/messages/stream`,
				{
					method: "POST",
					responseType: "stream",
					body: {
						messages: messages.value,
					},
				},
			);

			// Convert the raw byte stream into a text stream using TextDecoderStream
			// This allows us to read the response as readable text chunks
			const decodedStream = response.pipeThrough(new TextDecoderStream());

			// Get a reader to consume the decoded text stream
			const reader = decodedStream.getReader();

			// Recursively process each chunk of text as it arrives from the stream
			await reader.read().then(function processText({
				done,
				value,
			}): Promise<void> | void {
				// If the stream is finished, stop processing
				if (done) {
					return;
				}

				// Append the new chunk to the message content for real-time display
				lastMessage.content += value;

				// Continue reading the next chunk recursively
				return reader.read().then(processText);
			});
		} catch (error) {
			console.error("Error streaming message:", error);
		} finally {
			// Once streaming is complete, fetch the actual saved messages from the database
			// This replaces the temporary streaming placeholder with the real persisted message
			await fetchMessages({ refresh: true });
		}

		chat.value.updatedAt = new Date();
	}

	return {
		chat,
		messages,
		sendMessage,
		fetchMessages,
	};
}
