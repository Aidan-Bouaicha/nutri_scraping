import { useState } from 'react';
import { Food, nutritionAPI } from '../services/api';
import { Search, Loader, Apple } from 'lucide-react';

export default function FoodSearch() {
  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState<Food[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      const results = await nutritionAPI.searchFoods(query);
      setFoods(results);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setFoods([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un aliment (ex: pomme, poulet, riz...)"
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Recherche...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Rechercher
            </>
          )}
        </button>
      </form>

      {hasSearched && foods.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Apple className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Aucun résultat trouvé pour "{query}"</p>
          <p className="text-sm text-gray-400 mt-2">
            Essayez avec un autre terme de recherche
          </p>
        </div>
      )}

      {foods.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {foods.map((food, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-gray-900">{food.nom}</h3>
                {food.source && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {food.source}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Calories</span>
                  <span className="font-semibold text-orange-600">
                    {food.calories} kcal
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Protéines</span>
                  <span className="font-semibold text-blue-600">
                    {food.proteines}g
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Glucides</span>
                  <span className="font-semibold text-green-600">
                    {food.glucides}g
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Lipides</span>
                  <span className="font-semibold text-yellow-600">
                    {food.lipides}g
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
