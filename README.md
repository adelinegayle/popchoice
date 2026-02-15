# PopChoice

AI-powered movie recommendations using RAG (Retrieval Augmented Generation) with Gemini and Supabase.

## Tech Stack

- Next.js 16, React 19, TypeScript, Tailwind CSS
- Google Gemini API (embeddings + text generation)
- Supabase with pgvector extension

## Setup

1. Install dependencies
```bash
npm install
```

2. Create `.env.local` with your API keys:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
```

3. Run the database schema from `database/schema.sql` in Supabase SQL Editor

4. Ingest the movie data:
```bash
npm run ingest
```

5. Start the dev server:
```bash
npm run dev
```

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```
