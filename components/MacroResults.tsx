"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { RecipeResult } from "@/app/page";

const MACROS = [
  { key: "calories", label: "Calories", unit: "kcal", color: "text-orange-500" },
  { key: "protein", label: "Protein", unit: "g", color: "text-blue-500" },
  { key: "carbs", label: "Carbs", unit: "g", color: "text-amber-500" },
  { key: "fat", label: "Fat", unit: "g", color: "text-rose-500" },
  { key: "fiber", label: "Fiber", unit: "g", color: "text-green-500" },
  { key: "sugar", label: "Sugar", unit: "g", color: "text-pink-500" },
] as const;

type MacroKey = (typeof MACROS)[number]["key"];

export function MacroResults({ result }: { result: RecipeResult }) {
  const [view, setView] = useState<"per_serving" | "total">("per_serving");

  const data = view === "per_serving" ? result.per_serving : result.total;

  return (
    <div className="flex flex-col gap-6">
      {/* Title + servings */}
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight">{result.title}</h2>
        <p className="text-sm text-muted-foreground">{result.servings_text}</p>
      </div>

      {/* Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Show:</span>
        <div className="flex rounded-lg border border-input overflow-hidden text-sm font-medium">
          <button
            onClick={() => setView("per_serving")}
            className={`px-4 py-1.5 transition-colors ${
              view === "per_serving"
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-muted"
            }`}
          >
            Per Serving
          </button>
          <button
            onClick={() => setView("total")}
            className={`px-4 py-1.5 transition-colors ${
              view === "total"
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-muted"
            }`}
          >
            Total Recipe
          </button>
        </div>
      </div>

      {/* Weight info */}
      {result.serving_weight_g && (
        <p className="text-sm text-muted-foreground -mt-3">
          {view === "per_serving"
            ? `${result.serving_weight_g}g per serving`
            : `${Math.round(result.serving_weight_g * result.servings)}g total`}
        </p>
      )}

      {/* Macro cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {MACROS.map(({ key, label, unit, color }) => (
          <Card key={key} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className={`text-xs font-medium uppercase tracking-wider ${color}`}>
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <span className="text-3xl font-bold tabular-nums">
                {data[key as MacroKey]}
              </span>
              <span className="ml-1 text-sm text-muted-foreground">{unit}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ingredient list */}
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
          Ingredients ({result.ingredients.length})
        </h3>
        <ul className="flex flex-col divide-y divide-border rounded-xl border bg-card overflow-hidden">
          {result.ingredients.map((ing, i) => (
            <li key={i} className="px-4 py-2.5 text-sm">
              {ing}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
