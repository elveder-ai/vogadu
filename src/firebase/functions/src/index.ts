import * as llmApi from './llm/api'
import * as discordChatApi from './chat/discord/api'

export const llmPrompt = llmApi.prompt;
export const discordChatInteractionsEndpoint = discordChatApi.interactionsEndpoint;