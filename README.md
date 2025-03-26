# Vogadu - AI-Powered Car Information Assistant

Vogadu is an AI powered chatbot system designed to provide detailed information about cars using AI and RAG (Retrieval-Augmented Generation) technology.

## Features

- 🤖 AI-powered chatbot for car-related queries
- 📚 Access to hundreds of thousands of car-related articles
- 🔍 RAG (Retrieval-Augmented Generation) implementation
- 🤝 Multi-platform support:
  - Discord bot
  - Messenger bot
- 🌐 Hosted on Firebase
- 📊 Vector database (Qdrant) for efficient article retrieval

## Technical Stack

- **LLM**: 
  - LangChain for LLM request handling and RAG implementation
  - RAG for accurate information retrieval and response generation
- **Database**: Qdrant for vector storage
- **Hosting**: Firebase
- **Data Collection**: Custom web scrapers for car-related articles
- **Bot Platforms**: Discord and Messenger

## Setting Up Credentials

The project requires several credential files to be set up in the `src/credentials` directory. You'll need to add the following JSON files based on the example templates:

1. `discord.json` - Discord bot credentials
2. `firebase.json` - Firebase service account credentials
3. `langsmith.json` - LangSmith API credentials for LLM tracing
4. `messenger.json` - Facebook Messenger bot credentials
5. `mistral.json` - Mistral API credentials
6. `openai.json` - OpenAI API credentials and model configurations
7. `qdrant.json` - Qdrant vector database credentials

For each credential file, there is a corresponding example file (e.g., `firebase.json.example`) with the required structure. Copy these example files and fill in your credentials:

```bash
for file in src/credentials/*.json.example; do cp "$file" "${file%.example}"; done
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
