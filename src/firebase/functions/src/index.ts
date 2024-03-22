import * as llmApi from './llm/api'
import * as discordChatApi from './chat/discord/api'

// LLM
export const llmPrompt = llmApi.prompt;

// Discord Chat
export const discordChatInteractionsEndpoint = discordChatApi.interactionsEndpoint;
export const discortChatProcessUserInput = discordChatApi.processUserInput;
export const discordChatPing = discordChatApi.ping;