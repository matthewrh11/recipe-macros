"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MacroResults } from "@/components/MacroResults";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { Link, AlertCircle } from "lucide-react";

type MacroSet = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
};

export type RecipeResult = {
  title: string;
  servings: number;
  servings_text: string;
  serving_weight_g: number | null;
  ingredients: string[];
  total: MacroSet;
  per_serving: MacroSet;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecipeResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try another link.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Failed to reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <span className="text-2xl">🥗</span>
          <span className="font-semibold text-lg tracking-tight">Recipe Macros</span>
        </div>
      </header>

      <div className="flex-1 max-w-3xl mx-auto w-full px-6 py-12 flex flex-col gap-10">
        {/* Hero */}
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            What&apos;s in your recipe?
          </h1>
          <p className="text-muted-foreground text-lg">
            Paste any recipe link and get a full macro breakdown — total and per serving.
          </p>
        </div>

        {/* Input form */}
        <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Link
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.allrecipes.com/recipe/..."
              className="w-full h-10 pl-9 pr-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 transition"
              required
            />
          </div>
          <Button type="submit" disabled={loading} size="default" className="shrink-0">
            {loading ? "Analyzing…" : "Analyze Recipe"}
          </Button>
        </form>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && <LoadingSkeleton />}

        {/* Results */}
        {result && !loading && <MacroResults result={result} />}
      </div>
    </main>
  );
}
