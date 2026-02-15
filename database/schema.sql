create extension if not exists vector;

create table movies (
  id bigserial primary key,
  title text not null,
  year integer,
  rating text,
  duration text,
  score decimal(3,1),
  description text not null,
  metadata jsonb default '{}',
  embedding vector(3072),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create or replace function match_movies(
  query_embedding vector(3072),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  title text,
  year integer,
  rating text,
  duration text,
  score decimal(3,1),
  description text,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    movies.id,
    movies.title,
    movies.year,
    movies.rating,
    movies.duration,
    movies.score,
    movies.description,
    movies.metadata,
    1 - (movies.embedding <=> query_embedding) as similarity
  from movies
  where 1 - (movies.embedding <=> query_embedding) > match_threshold
  order by movies.embedding <=> query_embedding
  limit match_count;
$$;