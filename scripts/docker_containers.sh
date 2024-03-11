# Start the Nomic Embed Text container
docker run -d -v /Users/alexanderkrustev/Ollama/nomic-embed-text:/root/.ollama -p 11434:11434 --name nomic-embed-text ollama/ollama

# Start the Mistral container
docker run -d -v /Users/alexanderkrustev/Ollama/mistral:/root/.ollama -p 11435:11434 --name mistral ollama/ollama

# Start the Qdrant container
docker run -d -v /Users/alexanderkrustev/Qdrant/vogadu:/qdrant/storage:z -p 6333:6333 -p 6334:6334 --name qdrant qdrant/qdrant