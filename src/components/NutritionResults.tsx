import { Flame, Activity, Beef, User } from "lucide-react";
import { NutritionResult } from "../services/api";

interface NutritionResultsProps {
  result: NutritionResult;
}

export default function NutritionResults({ result }: NutritionResultsProps) {
  const objectifLabel = (objectif: string) => {
    switch (objectif) {
      case "perte":
        return "Perte de poids";
      case "maintien":
        return "Maintien";
      case "prise":
        return "Prise de masse";
      default:
        return objectif;
    }
  };

  return (
    <div className="space-y-8">
      {/* PROFIL */}
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="w-6 h-6 text-emerald-600" />
          <h3 className="text-lg font-semibold text-gray-800">
            Profil nutritionnel
          </h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Taille</span>
            <p className="font-semibold text-gray-900">
              {result.profil.taille} cm
            </p>
          </div>
          <div>
            <span className="text-gray-600">Poids</span>
            <p className="font-semibold text-gray-900">
              {result.profil.poids} kg
            </p>
          </div>
          <div>
            <span className="text-gray-600">Âge</span>
            <p className="font-semibold text-gray-900">
              {result.profil.age} ans
            </p>
          </div>
          <div>
            <span className="text-gray-600">Objectif</span>
            <p className="font-semibold text-gray-900">
              {objectifLabel(result.profil.objectif)}
            </p>
          </div>
        </div>
      </div>

      {/* INDICATEURS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* BMR */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <h4 className="font-semibold text-gray-800">BMR</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {Math.round(result.bmr)}
          </p>
          <p className="text-sm text-gray-600 mt-1">kcal / jour au repos</p>
        </div>

        {/* CALORIES */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Activity className="w-6 h-6 text-emerald-600" />
            </div>
            <h4 className="font-semibold text-gray-800">
              Calories journalières
            </h4>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {Math.round(result.calories_journalieres)}
          </p>
          <p className="text-sm text-gray-600 mt-1">kcal / jour recommandées</p>
        </div>

        {/* PROTÉINES */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Beef className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-800">Protéines</h4>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {Math.round(result.besoins_proteiques)}
          </p>
          <p className="text-sm text-gray-600 mt-1">g / jour recommandés</p>
        </div>
      </div>
    </div>
  );
}
