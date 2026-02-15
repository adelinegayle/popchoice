"use client";

import { useState } from "react";

type FormState = {
  favoriteMovie: string;
  era: "ANY" | "CLASSIC" | "MODERN";
  vibe: "FUN" | "CHILL" | "SERIOUS";
};

type View = "FORM" | "LOADING" | "RESULT" | "ERROR";

export default function Page() {
  const [view, setView] = useState<View>("FORM");
  const [form, setForm] = useState<FormState>({
    favoriteMovie: "",
    era: "ANY",
    vibe: "FUN",
  });
  const [recommendation, setRecommendation] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function handleSubmit() {
    setView("LOADING");
    setError("");

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error("Failed to get recommendation");
      }

      const data = await response.json();
      setRecommendation(data.recommendation);
      setView("RESULT");
    } catch (err) {
      setError("Failed to generate recommendation. Please try again.");
      setView("ERROR");
    }
  }

  function reset() {
    setView("FORM");
    setRecommendation("");
    setError("");
  }

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold">PopChoice</h1>
        <p className="text-gray-600">Simple movie recommender</p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* LEFT PANEL */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold">Your preferences</h2>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium">
                  Favourite movie (optional)
                </label>
                <textarea
                  className="mt-1 w-full rounded border p-2"
                  rows={3}
                  value={form.favoriteMovie}
                  onChange={(e) =>
                    setForm({ ...form, favoriteMovie: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Era</label>
                <select
                  className="mt-1 w-full rounded border p-2"
                  value={form.era}
                  onChange={(e) =>
                    setForm({ ...form, era: e.target.value as any })
                  }
                >
                  <option value="ANY">Any</option>
                  <option value="CLASSIC">Classic</option>
                  <option value="MODERN">Modern</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium">Vibe</label>
                <select
                  className="mt-1 w-full rounded border p-2"
                  value={form.vibe}
                  onChange={(e) =>
                    setForm({ ...form, vibe: e.target.value as any })
                  }
                >
                  <option value="FUN">Fun</option>
                  <option value="CHILL">Chill</option>
                  <option value="SERIOUS">Serious</option>
                </select>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full rounded bg-black py-2 text-white"
              >
                Recommend a movie
              </button>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold">Recommendation</h2>

            {view === "FORM" && (
              <p className="mt-4 text-gray-500">
                Fill the form and click recommend.
              </p>
            )}

            {view === "LOADING" && (
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
                  <p className="text-gray-600">Finding the perfect movie...</p>
                </div>
              </div>
            )}

            {view === "ERROR" && (
              <div className="mt-4">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={reset}
                  className="mt-4 rounded border px-3 py-1"
                >
                  Try again
                </button>
              </div>
            )}

            {view === "RESULT" && (
              <div className="mt-4">
                <div className="whitespace-pre-wrap text-gray-700">
                  {recommendation}
                </div>

                <button
                  onClick={reset}
                  className="mt-4 rounded border px-3 py-1 hover:bg-gray-50"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
