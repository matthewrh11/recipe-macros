import { NextRequest, NextResponse } from "next/server";

interface SpoonacularNutrient {
  name: string;
  amount: number;
  unit: string;
}

interface SpoonacularExtractResponse {
  title?: string;
  servings?: number;
  extendedIngredients?: { original: string }[];
  nutrition?: {
    nutrients: SpoonacularNutrient[];
    weightPerServing?: { amount: number; unit: string };
  };
}

function getNutrient(nutrients: SpoonacularNutrient[], name: string): number {
  const n = nutrients.find((n) => n.name.toLowerCase() === name.toLowerCase());
  return n ? Math.round(n.amount * 10) / 10 : 0;
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url?.trim()) {
      return NextResponse.json({ error: "Missing 'url' field." }, { status: 400 });
    }

    const apiKey = process.env.SPOONACULAR_API_KEY;
    const spoonacularUrl = `https://api.spoonacular.com/recipes/extract?url=${encodeURIComponent(url)}&includeNutrition=true&apiKey=${apiKey}`;

    const res = await fetch(spoonacularUrl);
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Spoonacular error ${res.status}: ${text}`);
    }

    const data: SpoonacularExtractResponse = await res.json();

    const title = data.title || "Recipe";
    const servings = data.servings ?? 1;
    const ingredients = (data.extendedIngredients ?? []).map((i) => i.original);
    const nutrients = data.nutrition?.nutrients ?? [];
    const weightPerServing = data.nutrition?.weightPerServing ?? null;

    if (ingredients.length === 0) {
      return NextResponse.json({ error: "No ingredients found on this page." }, { status: 422 });
    }

    // Spoonacular returns per-serving nutrition
    const perCalories = Math.round(getNutrient(nutrients, "Calories"));
    const perProtein  = getNutrient(nutrients, "Protein");
    const perCarbs    = getNutrient(nutrients, "Carbohydrates");
    const perFat      = getNutrient(nutrients, "Fat");
    const perFiber    = getNutrient(nutrients, "Fiber");
    const perSugar    = getNutrient(nutrients, "Sugar");

    const total = (v: number) => Math.round(v * servings * 10) / 10;

    return NextResponse.json({
      title,
      servings,
      servings_text: `${servings} serving${servings !== 1 ? "s" : ""}`,
      serving_weight_g: weightPerServing?.unit === "g" ? weightPerServing.amount : null,
      ingredients,
      total: {
        calories: Math.round(perCalories * servings),
        protein:  total(perProtein),
        carbs:    total(perCarbs),
        fat:      total(perFat),
        fiber:    total(perFiber),
        sugar:    total(perSugar),
      },
      per_serving: {
        calories: perCalories,
        protein:  perProtein,
        carbs:    perCarbs,
        fat:      perFat,
        fiber:    perFiber,
        sugar:    perSugar,
      },
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
