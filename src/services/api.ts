const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface NutritionProfile {
  taille: number;
  poids: number;
  age: number;
  sexe: 'homme' | 'femme';
  objectif: 'perte' | 'maintien' | 'prise';
}

export interface NutritionResult {
  bmr: number;
  calories_journalieres: number;
  besoins_proteiques: number;
  profil: NutritionProfile;
}

export interface ChatMessage {
  message: string;
  profil: NutritionProfile;
}

export interface ChatResponse {
  response: string;
  plan_repas?: string[];
}

export interface Food {
  nom: string;
  calories: number;
  proteines: number;
  glucides: number;
  lipides: number;
  source?: string;
}

export const nutritionAPI = {
  async calculateProfile(profile: NutritionProfile): Promise<NutritionResult> {
    const response = await fetch(`${API_BASE_URL}/nutrition/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      throw new Error('Erreur lors du calcul du profil nutritionnel');
    }

    return response.json();
  },

  async sendChatMessage(message: string, profile: NutritionProfile): Promise<ChatResponse> {
    const response = await fetch(`${API_BASE_URL}/chat/message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, profil: profile }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'envoi du message');
    }

    return response.json();
  },

  async searchFoods(query: string): Promise<Food[]> {
    const response = await fetch(
      `${API_BASE_URL}/foods/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error('Erreur lors de la recherche d\'aliments');
    }

    return response.json();
  },
};
