import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

interface RequestBody {
  favoriteMovie: string;
  era: 'ANY' | 'CLASSIC' | 'MODERN';
  vibe: 'FUN' | 'CHILL' | 'SERIOUS';
}

interface Movie {
  id: number;
  title: string;
  year: number;
  rating: string;
  duration: string;
  score: number;
  description: string;
  similarity: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { favoriteMovie, era, vibe } = body;

    const eraText = era === 'ANY' ? 'any era' : era === 'CLASSIC' ? 'classic era (before 2000)' : 'modern era (2000+)';
    const vibeText = vibe === 'FUN' ? 'fun and entertaining' : vibe === 'CHILL' ? 'relaxing and chill' : 'serious and thought-provoking';
    
    const queryText = `A ${vibeText} movie from ${eraText}.${favoriteMovie ? ` Similar to ${favoriteMovie}.` : ''}`;

    const embeddingResponse = await genAI.models.embedContent({
      model: 'gemini-embedding-001',
      contents: [queryText]
    });

    const queryEmbedding = embeddingResponse.embeddings[0].values;

    const { data: movies, error } = await supabase.rpc('match_movies', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: 5
    });

    if (error) {
      throw error;
    }

    if (!movies || movies.length === 0) {
      return NextResponse.json(
        { error: 'No matching movies found' },
        { status: 404 }
      );
    }

    const moviesContext = movies.map((m: Movie) => 
      `${m.title} (${m.year}) - ${m.description} [Rating: ${m.score}/10]`
    ).join('\n\n');

    const prompt = `You are an enthusiastic movie expert who loves recommending movies to people. You will be given two pieces of information - some context about movies and a question. Your main job is to formulate a short answer to the question using the provided context. If you are unsure and cannot find the answer in the context, say, "Sorry, I don't know the answer." Please do not make up the answer.
            Context about available movies:
            ${moviesContext}

            Question: Based on the user's preferences, recommend ONE movie that best matches their taste:
            - Era: ${eraText}
            - Vibe: ${vibeText}
            ${favoriteMovie ? `- Similar to: ${favoriteMovie}` : ''}

            Provide your recommendation in this format:
            Title: [Movie Title with Year]
            Why: [2-3 sentences explaining why this movie matches their preferences]

            Keep it concise and enthusiastic.`;

    const chatModel = genAI.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });

    const result = await chatModel;
    const recommendation = result.text;

    return NextResponse.json({
      recommendation,
      query: queryText,
      matchedMovies: movies.length
    });

  } catch (error) {
    console.error('Error generating recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendation' },
      { status: 500 }
    );
  }
}
