import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';
import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

config({ path: '.env.local' });

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const genAI = new GoogleGenAI({});

interface Movie {
  title: string;
  year: number;
  rating: string;
  duration: string;
  score: number;
  description: string;
  metadata: any;
}

function parseMoviesFile(filePath: string): Movie[] {
  const content = readFileSync(filePath, 'utf-8');
  const movieBlocks = content.split('\n\n').filter(block=> block.trim());
  
  const movies: Movie[] = [];
  
  for (const block of movieBlocks) {
    const lines = block.split('\n');
    if (lines.length < 2) continue;
    
    const firstLine = lines[0];
    const match = firstLine.match(/^(.+?):\s*(\d{4})\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([\d.]+)\s*rating/);
    
    if (!match) {
      console.warn('Could not parse line:', firstLine);
      continue;
    }
    
    const [, title, yearStr, rating, duration, scoreStr] = match;
    const description = lines.slice(1).join(' ').trim();
    
    movies.push({
      title: title.trim(),
      year: parseInt(yearStr),
      rating: rating.trim(),
      duration: duration.trim(),
      score: parseFloat(scoreStr),
      description,
      metadata: { genre: extractGenre(description) }
    });
  }
  
  return movies;
}

function extractGenre(description: string): string {
  const lowerDesc = description.toLowerCase();
  if (lowerDesc.includes('horror')) return 'horror';
  if (lowerDesc.includes('comedy')) return 'comedy';
  if (lowerDesc.includes('action')) return 'action';
  if (lowerDesc.includes('drama')) return 'drama';
  if (lowerDesc.includes('animated')) return 'animated';
  if (lowerDesc.includes('thriller')) return 'thriller';
  return 'general';
}

async function generateEmbedding(movie: Movie): Promise<number[]> {
  const textToEmbed = `${movie.title} (${movie.year}). ${movie.description}`;
  
  const response = await genAI.models.embedContent({
    model: 'gemini-embedding-001',
    contents: [textToEmbed]
  });
  
  return response.embeddings[0].values;
}

async function insertMovie(movie: Movie, embedding: number[]) {
  const { error } = await supabase.from('movies').insert({
    title: movie.title,
    year: movie.year,
    rating: movie.rating,
    duration: movie.duration,
    score: movie.score,
    description: movie.description,
    metadata: movie.metadata,
    embedding: embedding
  });
  
  if (error) {
    throw new Error(`Failed to insert ${movie.title}: ${error.message}`);
  }
}


async function ingestMovies() {
  console.log('Starting movie ingestion...\n');
  
  const moviesPath = join(__dirname, '../data/movies.txt');
  console.log('Parsing movies.txt...');
  const movies = parseMoviesFile(moviesPath);
  console.log(`Found ${movies.length} movies\n`);
  
  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    console.log(`[${i + 1}/${movies.length}] Processing: ${movie.title}`);
    
    try {
      const embedding = await generateEmbedding(movie);
      console.log(`Generated embedding (${embedding.length} dimensions)`);
      
      await insertMovie(movie, embedding);
      console.log(`Inserted into database\n`);
      
      await new Promise(resolve=> setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`Error processing ${movie.title}:`, error);
    }
  }
  
  console.log('Ingestion complete!');
}

ingestMovies().catch(console.error);