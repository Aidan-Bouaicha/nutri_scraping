import { useState } from 'react';
import { NutritionProfile } from '../services/api';
import { User, Target, Activity } from 'lucide-react';

interface ProfileFormProps {
  onSubmit: (profile: NutritionProfile) => void;
  isLoading?: boolean;
}

export default function ProfileForm({ onSubmit, isLoading }: ProfileFormProps) {
  const [formData, setFormData] = useState<NutritionProfile>({
    taille: 170,
    poids: 70,
    age: 30,
    sexe: 'homme',
    objectif: 'maintien',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field: keyof NutritionProfile, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Taille (cm)
          </label>
          <input
            type="number"
            value={formData.taille}
            onChange={(e) => handleChange('taille', Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            min="100"
            max="250"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Poids (kg)
          </label>
          <input
            type="number"
            value={formData.poids}
            onChange={(e) => handleChange('poids', Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            min="30"
            max="300"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Âge
          </label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => handleChange('age', Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            min="10"
            max="120"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline w-4 h-4 mr-1" />
            Sexe
          </label>
          <select
            value={formData.sexe}
            onChange={(e) => handleChange('sexe', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            required
          >
            <option value="homme">Homme</option>
            <option value="femme">Femme</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Target className="inline w-4 h-4 mr-1" />
          Objectif
        </label>
        <select
          value={formData.objectif}
          onChange={(e) => handleChange('objectif', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          required
        >
          <option value="perte">Perte de poids</option>
          <option value="maintien">Maintien</option>
          <option value="prise">Prise de masse</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Activity className="w-5 h-5 animate-spin" />
            Calcul en cours...
          </>
        ) : (
          <>
            <Target className="w-5 h-5" />
            Calculer mes besoins
          </>
        )}
      </button>
    </form>
  );
}
