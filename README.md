# 🍿 PopChoice

A Next.js web application that uses AI and RAG (Retrieval Augmented Generation) to provide personalized movie recommendations based on your preferences.

## 🛠️ Tech Stack

- Next.js 16 (React 19, TypeScript)
- Tailwind CSS
- Google Gemini API (embeddings + text generation)
- Supabase with pgvector extension

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Google Gemini API key (free)
- A Supabase account (free tier available)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd popchoice
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
```

4. Set up the database:
   - Go to your Supabase project's SQL Editor
   - Run the schema from `database/schema.sql`

5. Ingest the movie data:
```bash
npm run ingest
```

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔑 API Setup

### Google Gemini (Currently Used - Free)
Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Supabase (Free Tier Available)
1. Create a project at [Supabase](https://supabase.com)
2. Get your project URL and API keys from Settings > API
3. Enable the pgvector extension in your project

## 📁 Project Structure

```
popchoice/
├── app/
│   ├── api/
│   │   └── recommend/
│   │       └── route.ts      # API endpoint for recommendations
│   ├── components/
│   │   ├── FormPanel.tsx     # User input form
│   │   └── ResultPanel.tsx   # Recommendation results
│   ├── page.tsx              # Main page component
│   └── layout.tsx            # Root layout
├── scripts/
│   └── ingest-movies.ts      # Movie data ingestion script
├── database/
│   └── schema.sql            # Database schema with pgvector
├── data/
│   └── movies.txt            # Movie dataset
├── .env.local                # Environment variables
└── package.json
```

## 🎨 Usage

1. Enter your movie preferences or describe what you're in the mood for
2. Click the recommendation button
3. The AI will search through the movie database using semantic similarity
4. Get personalized movie recommendations with details

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.
