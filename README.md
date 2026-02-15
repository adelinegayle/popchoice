# PopChoice

A movie recommendation system powered by RAG (Retrieval Augmented Generation) using Gemini AI and Supabase vector database.

## Overview

PopChoice uses semantic search and AI to provide personalized movie recommendations based on user preferences like era, vibe, and favorite movies. The system combines vector embeddings, similarity search, and large language models to deliver contextual recommendations.

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **AI/ML**: Google Gemini API (embeddings + text generation)
- **Database**: Supabase with pgvector extension
- **Vector Search**: Cosine similarity with HNSW indexing

## Features

- Semantic movie search using vector embeddings
- Personalized recommendations based on user preferences
- Real-time AI-powered explanations
- 32 curated movies with rich metadata

## Architecture

```
User Input → Query Embedding → Vector Search → Context Retrieval → LLM Generation → Recommendation
```

1. **User submits preferences** (era, vibe, optional favorite movie)
2. **Query embedding** generated via Gemini embedding model
3. **Vector similarity search** in Supabase finds relevant movies
4. **Top matches** passed as context to Gemini LLM
5. **Personalized recommendation** generated and returned

## Project Structure

```
popchoice/
├── app/
│   ├── api/
│   │   └── recommend/
│   │       └── route.ts          # RAG API endpoint
│   ├── page.tsx                  # Main UI
│   └── globals.css
├── data/
│   └── movies.txt                # Movie dataset
├── database/
│   └── schema.sql                # Supabase schema with vector support
└── scripts/
    └── ingest-movies.ts          # Embedding generation & ingestion
```

## Setup

### Prerequisites

- Node.js 18+
- Supabase account
- Google AI API key

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd popchoice
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables

Create `.env.local`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
```

4. Set up Supabase database

Run the SQL in `database/schema.sql` in your Supabase SQL Editor:
```sql
-- Creates movies table with vector embeddings
-- Sets up vector similarity search function
```

5. Ingest movie data
```bash
npm run ingest
```

This will:
- Parse `data/movies.txt`
- Generate embeddings for each movie
- Store in Supabase with vector embeddings

6. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## How It Works

### Embedding Generation

Movies are converted to 3072-dimensional vectors using `gemini-embedding-001`:
```typescript
const embedding = await genAI.models.embedContent({
  model: 'gemini-embedding-001',
  contents: [movieText]
});
```

### Vector Search

User queries are embedded and compared using cosine similarity:
```sql
SELECT * FROM match_movies(
  query_embedding,
  match_threshold := 0.5,
  match_count := 5
);
```

### Recommendation Generation

Retrieved movies are passed as context to Gemini:
```typescript
const response = await genAI.models.generateContent({
  model: 'gemini-3-flash-preview',
  contents: prompt
});
```

## API Endpoints

### POST /api/recommend

Generates a movie recommendation based on user preferences.

**Request:**
```json
{
  "favoriteMovie": "Inception",
  "era": "MODERN",
  "vibe": "SERIOUS"
}
```

**Response:**
```json
{
  "recommendation": "Title: Interstellar (2014)\nWhy: ...",
  "query": "A serious movie from modern era...",
  "matchedMovies": 5
}
```

## Dataset

32 movies spanning multiple genres and eras (1972-2023):
- Classics: The Godfather, Pulp Fiction, Forrest Gump
- Modern: Oppenheimer, Everything Everywhere All at Once
- Animated: Spirited Away, Coco
- Sci-Fi: Inception, The Matrix, Interstellar
- And more...

## RAG Implementation Details

**Why RAG?**
- Grounds AI responses in actual movie data
- Prevents hallucinations
- Provides explainable recommendations
- Enables semantic search over traditional keyword matching

**Vector Database Choice:**
- Supabase pgvector for production-ready vector storage
- HNSW indexing (when scaled) for fast similarity search
- Supports 3072-dimensional embeddings

**Embedding Model:**
- `gemini-embedding-001` produces high-quality semantic representations
- Captures movie plot, genre, and thematic elements

## Future Enhancements

- Add more movies to the dataset
- Implement user ratings and feedback loop
- Add dimension reduction for indexing (PCA/UMAP)
- Multi-movie recommendations
- Filter by genre, rating, duration
- Explain why movies were retrieved (similarity scores)

## License

MIT
