import { readFileSync } from 'fs';
import { join } from 'path';

describe('Movie Data Ingestion', () => {
  it('parses movies.txt correctly', () => {
    const moviesPath = join(process.cwd(), 'data/movies.txt');
    const content = readFileSync(moviesPath, 'utf-8');
    const movieBlocks = content.split('\n\n').filter(block => block.trim());

    expect(movieBlocks.length).toBeGreaterThan(0);
  });

  it('extracts movie title and metadata from first line', () => {
    const testLine = 'Oppenheimer: 2023 | R | 3h | 8.6 rating';
    const match = testLine.match(/^(.+?):\s*(\d{4})\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([\d.]+)\s*rating/);

    expect(match).not.toBeNull();
    if (match) {
      const [, title, year, rating, duration, score] = match;
      expect(title).toBe('Oppenheimer');
      expect(year).toBe('2023');
      expect(rating.trim()).toBe('R');
      expect(score).toBe('8.6');
    }
  });

  it('extracts genre from description', () => {
    const extractGenre = (description: string): string => {
      const lowerDesc = description.toLowerCase();
      if (lowerDesc.includes('horror')) return 'horror';
      if (lowerDesc.includes('comedy')) return 'comedy';
      if (lowerDesc.includes('action')) return 'action';
      if (lowerDesc.includes('drama')) return 'drama';
      if (lowerDesc.includes('animated')) return 'animated';
      if (lowerDesc.includes('thriller')) return 'thriller';
      return 'general';
    };

    expect(extractGenre('This is a horror movie')).toBe('horror');
    expect(extractGenre('A comedy film')).toBe('comedy');
    expect(extractGenre('An action-packed adventure')).toBe('action');
    expect(extractGenre('A dramatic story')).toBe('drama');
    expect(extractGenre('An animated feature')).toBe('animated');
    expect(extractGenre('Random movie')).toBe('general');
  });
});
