import { useState } from "react";
import ProfileForm from "./components/ProfileForm";
import NutritionResults from "./components/NutritionResults";
import ChatInterface from "./components/ChatInterface";
import FoodSearch from "./components/FoodSearch";
import {
  NutritionProfile,
  NutritionResult,
  nutritionAPI,
} from "./services/api";
import { Apple, MessageCircle, Search, Calculator } from "lucide-react";

type View = "profile" | "results" | "chat" | "search";

function App() {
  const [currentView, setCurrentView] = useState<View>("profile");
  const [profile, setProfile] = useState<NutritionProfile | null>(null);
  const [results, setResults] = useState<NutritionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleProfileSubmit = async (newProfile: NutritionProfile) => {
    setIsLoading(true);
    try {
      const result = await nutritionAPI.calculateProfile(newProfile);
      setProfile(newProfile);
      setResults(result);
      setCurrentView("results");
    } catch {
      alert(
        "Erreur lors du calcul. Assurez-vous que le backend FastAPI est démarré sur http://localhost:8000"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 rounded-lg">
                <Apple className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">NutriAI</h1>
                <p className="text-sm text-gray-600">
                  Assistant Nutritionnel Intelligent
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentView("profile")}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  currentView === "profile"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Calculator className="w-4 h-4" />
                Profil
              </button>
              {results && (
                <>
                  <button
                    onClick={() => setCurrentView("results")}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      currentView === "results"
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Résultats
                  </button>
                  <button
                    onClick={() => setCurrentView("chat")}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      currentView === "chat"
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat IA
                  </button>
                </>
              )}
              <button
                onClick={() => setCurrentView("search")}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  currentView === "search"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Search className="w-4 h-4" />
                Aliments
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === "profile" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Calculez vos besoins nutritionnels
              </h2>
              <p className="text-gray-600 mb-6">
                Renseignez vos informations pour obtenir un calcul personnalisé
                de vos besoins caloriques et protéiques.
              </p>
              <ProfileForm
                onSubmit={handleProfileSubmit}
                isLoading={isLoading}
              />
            </div>
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Assurez-vous que votre backend FastAPI
                est démarré sur{" "}
                <code className="bg-blue-100 px-2 py-1 rounded">
                  http://localhost:8000
                </code>
              </p>
            </div>
          </div>
        )}

        {currentView === "results" && results && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Vos besoins nutritionnels
              </h2>
              <p className="text-gray-600">
                Calculés avec la formule Mifflin-St Jeor
              </p>
            </div>
            <NutritionResults result={results} />
          </div>
        )}

        {currentView === "chat" && profile && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Chat avec l'Assistant IA
              </h2>
              <p className="text-gray-600">
                Posez vos questions et obtenez des recommandations
                personnalisées
              </p>
            </div>
            <ChatInterface profile={profile} />
          </div>
        )}

        {currentView === "search" && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Recherche d'aliments
              </h2>
              <p className="text-gray-600">
                Explorez la base de données nutritionnelles
              </p>
            </div>
            <FoodSearch />
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>NutriAI - Assistant Nutritionnel Intelligent</p>
            <p className="mt-2 text-xs text-gray-500">
              Données issues d'OpenFoodFacts, USDA FoodData Central et BBC Good
              Food
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
