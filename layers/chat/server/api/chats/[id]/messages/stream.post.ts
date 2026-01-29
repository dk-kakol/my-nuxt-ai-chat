import {
	getMessagesByChatId,
	createMessageForChat,
} from "#layers/chat/server/repository/chatRepository";
import {
	createOpenAiModel,
	streamChatResponse,
} from "#layers/chat/server/services/ai-service";

/**
 * API endpoint handler for streaming chat messages.
 * 
 * This handler processes POST requests to stream AI-generated chat responses for a specific chat.
 * It retrieves the chat history, generates a streaming response using OpenAI, and saves the complete
 * response to the database once streaming is finished.
 * 
 * @param event - The H3 event object containing the HTTP request context
 * @returns A readable stream that pipes the AI-generated response chunks to the client
 * 
 * @remarks
 * The handler performs the following operations:
 * 1. Extracts the chat ID from the route parameters
 * 2. Retrieves the message history for the specified chat
 * 3. Creates an OpenAI model instance and initiates streaming
 * 4. Sets appropriate response headers for streaming (chunked transfer encoding)
 * 5. Transforms the stream to accumulate the complete response
 * 6. Saves the complete assistant response to the database when streaming completes
 * 
 * @example
 * POST /api/chats/123/messages/stream
 * 
 * Response headers:
 * - Content-Type: text/html
 * - Cache-Control: no-cache
 * - Transfer-Encoding: chunked
 */
export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);

  const history = await getMessagesByChatId(id);

  // Create OpenAI model and get a streaming response
  const openai = createOpenAiModel(useRuntimeConfig().openaiApiKey);
  // `stream` is a ReadableStream that emits chunks of text as OpenAI generates them
  const stream = await streamChatResponse(openai, history);

  // Configure HTTP response for streaming:
  // - "text/html": Content type for text streaming
  // - "no-cache": Prevent caching to ensure real-time streaming
  // - "chunked": HTTP transfer encoding that sends data in chunks rather than all at once
  setResponseHeaders(event, {
    "Content-Type": "text/html",
    "Cache-Control": "no-cache",
    "Transfer-Encoding": "chunked",
  });

  // Variable to accumulate all chunks into a complete response
  let completeResponse = "";

  // TransformStream acts as a middleware between the input stream and output stream
  // It has two methods: transform (processes each chunk) and flush (runs when streaming ends)
  const transformStream = new TransformStream({
    // Called for each chunk received from OpenAI
    // @param chunk - A piece of text from the AI response (e.g., a word or sentence fragment)
    // @param controller - Controls the output stream
    transform(chunk, controller) {
      // Accumulate the chunk to build the complete response
      completeResponse += chunk;
      // Pass the chunk through to the client immediately (enables real-time display)
      controller.enqueue(chunk);
    },

    // Called once when the stream completes (all chunks have been processed)
    async flush() {
      // Save the complete AI response to the database
      await createMessageForChat({
        chatId: id,
        content: completeResponse,
        role: "assistant",
      });
    },
  });

  // Connect the streams: OpenAI stream → TransformStream → Client
  // This creates a pipeline where data flows through all stages
  return stream.pipeThrough(transformStream);
});
