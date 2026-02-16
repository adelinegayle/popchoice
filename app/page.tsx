'use client';

import { useState } from 'react';
import FormPanel from './components/FormPanel';
import ResultPanel from './components/ResultPanel';

type FormState = {
  favoriteMovie: string;
  era: 'ANY' | 'CLASSIC' | 'MODERN';
  vibe: 'FUN' | 'CHILL' | 'SERIOUS';
};

type View = 'FORM' | 'LOADING' | 'RESULT' | 'ERROR';

export default function Page() {
  const [view, setView] = useState<View>('FORM');
  const [form, setForm] = useState<FormState>({
    favoriteMovie: '',
    era: 'ANY',
    vibe: 'FUN',
  });
  const [recommendation, setRecommendation] = useState<string>('');
  const [error, setError] = useState<string>('');

  async function handleSubmit() {
    setView('LOADING');
    setError('');

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendation');
      }

      const data = await response.json();
      setRecommendation(data.recommendation);
      setView('RESULT');
    } catch {
      setError('Failed to generate recommendation. Please try again.');
      setView('ERROR');
    }
  }

  function reset() {
    setView('FORM');
    setRecommendation('');
    setError('');
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold">PopChoice</h1>
        <p className="text-gray-600">Simple movie recommender</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <FormPanel
            form={form}
            onFormChange={setForm}
            onSubmit={handleSubmit}
          />
          <ResultPanel
            view={view}
            recommendation={recommendation}
            error={error}
            onReset={reset}
          />
        </div>
      </div>
    </main>
  );
}
