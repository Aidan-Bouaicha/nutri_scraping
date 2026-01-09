const API_BASE_URL = "http://localhost:8000";

export interface NutritionProfile {
  taille: number;
  poids: number;
  age: number;
  sexe: string;
  objectif: string;
}

export interface NutritionResult {
  profil: NutritionProfile;
  bmr: number;
  calories_journalieres: number;
  besoins_proteiques: number;
}

export interface Food {
  nom: string;
  calories?: number;
  proteines?: number;
  glucides?: number;
  lipides?: number;
  source?: string;
}

export interface MCPResponse {
  profil: NutritionProfile;
  macros: {
    proteines: number;
    calories: number;
  };
  repas: {
    petit_dejeuner: Food[];
    dejeuner: Food[];
    diner: Food[];
  };
  explication: string;
}

export const nutritionAPI = {
  async calculateProfile(profile: NutritionProfile): Promise<NutritionResult> {
    const res = await fetch(`${API_BASE_URL}/nutrition/profile`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error("Erreur nutrition");
    return res.json();
  },

  async searchFoods(query: string): Promise<Food[]> {
    const res = await fetch(
      `${API_BASE_URL}/foods/search?query=${encodeURIComponent(query)}`
    );
    return res.json();
  },

  async sendChatMessage(
    message: string,
    profile: NutritionProfile
  ): Promise<MCPResponse> {
    const res = await fetch(`${API_BASE_URL}/chat/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, profile }),
    });
    if (!res.ok) throw new Error("Erreur chat");
    return res.json();
  },
};
