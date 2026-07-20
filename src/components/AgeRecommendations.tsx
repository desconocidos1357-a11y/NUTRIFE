import React, { useState } from 'react';
import { 
  Heart, 
  Coffee, 
  Activity, 
  HelpCircle, 
  AlertCircle, 
  Sparkles, 
  Apple, 
  ArrowRight,
  Shield,
  UtensilsCrossed,
  Droplet,
  CheckCircle,
  ThumbsUp,
  RotateCcw
} from 'lucide-react';
import { ageCategoriesData } from '../data/defaultRecipes';
import { AgeCategoryInfo, AgeGroupId } from '../types';

interface AgeRecommendationsProps {
  onSelectAgeCategory: (id: AgeGroupId) => void;
  initialSelectedId?: AgeGroupId;
}

export default function AgeRecommendations({ onSelectAgeCategory, initialSelectedId }: AgeRecommendationsProps) {
  const [selectedAgeId, setSelectedAgeId] = useState<AgeGroupId>(initialSelectedId || '6_meses');

  const activeCategory = ageCategoriesData.find(cat => cat.id === selectedAgeId) || ageCategoriesData[0];

  return (
    <div id="age-recommendations-section" className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Introduction Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10 pointer-events-none">
          <UtensilsCrossed className="w-64 h-64" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="bg-amber-400 text-teal-950 font-black text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-sm inline-block mb-3">
            Guía Pediátrica Oficial
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            ¿Cómo alimentar a tu bebé según su edad?
          </h2>
          <p className="text-sm sm:text-base text-emerald-50 font-medium mt-2 leading-relaxed">
            Cada etapa del crecimiento de tu hijo requiere nutrientes específicos. Descubre la consistencia, porción, cantidad de comidas y hábitos recomendados para prevenir la anemia infantil.
          </p>
        </div>
      </div>

      {/* Grid Tabs for Age Groups */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {ageCategoriesData.map((cat) => {
          const isActive = selectedAgeId === cat.id;
          return (
            <button
              key={cat.id}
              id={`recommendation-tab-${cat.id}`}
              onClick={() => setSelectedAgeId(cat.id)}
              className={`p-4 rounded-2xl border-2 font-black text-sm sm:text-base transition-all duration-200 shadow-xs cursor-pointer flex flex-col items-center justify-center gap-1 text-center ${
                isActive
                  ? 'bg-emerald-500 text-white border-emerald-500 scale-102 shadow-md'
                  : 'bg-white text-gray-700 border-gray-100 hover:bg-emerald-50/50 hover:text-emerald-600'
              }`}
            >
              <span className="text-xs opacity-75 font-bold uppercase block">Bebé de</span>
              <span>{cat.ageRange}</span>
            </button>
          );
        })}
      </div>

      {/* Main Info Card Container */}
      <div className="bg-white rounded-3xl border-4 border-orange-100 shadow-sm overflow-hidden animate-fadeIn">
        {/* Header decoration bar */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-500 h-3"></div>
        
        <div className="p-6 sm:p-10">
          
          {/* Summary Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6 mb-8">
            <div>
              <span className="text-xs font-black text-orange-500 uppercase tracking-widest block mb-1">
                Guía de Crecimiento • {activeCategory.ageRange}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-gray-800">
                Alimentación a los {activeCategory.ageRange}
              </h3>
            </div>
            <button
              id={`view-recipes-shortcut-${activeCategory.id}`}
              onClick={() => onSelectAgeCategory(activeCategory.id)}
              className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-3.5 rounded-2xl shadow-md cursor-pointer transition-transform hover:scale-103 text-sm shrink-0"
            >
              Ver Recetas de esta edad
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Guidelines Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Guide Nutritional */}
            <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 space-y-2">
              <div className="flex items-center gap-2">
                <div className="bg-orange-500 text-white p-2 rounded-xl">
                  <Apple className="w-5 h-5" />
                </div>
                <h4 className="font-black text-gray-800 text-base">Guía Nutricional</h4>
              </div>
              <p className="text-sm font-bold text-gray-700 leading-relaxed pt-1">
                {activeCategory.nutritionalGuide}
              </p>
            </div>

            {/* Meals and Portion */}
            <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-500 text-white p-2 rounded-xl">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h4 className="font-black text-gray-800 text-base">Frecuencia de Comidas</h4>
                </div>
                <p className="text-sm font-bold text-gray-700 leading-relaxed">
                  {activeCategory.mealsCount}
                </p>
              </div>

              <div className="space-y-1 pt-1 border-t border-emerald-100/50">
                <span className="text-xxs text-emerald-600 font-extrabold uppercase tracking-wider block">Tamaño de Porción</span>
                <p className="text-sm font-extrabold text-emerald-950">
                  {activeCategory.portionSize}
                </p>
              </div>
            </div>

            {/* Texture */}
            <div className="bg-amber-50/50 p-6 rounded-2xl border border-amber-100 space-y-2">
              <div className="flex items-center gap-2">
                <div className="bg-amber-500 text-white p-2 rounded-xl">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <h4 className="font-black text-gray-800 text-base">Textura Recomendada</h4>
              </div>
              <p className="text-sm font-bold text-gray-700 leading-relaxed pt-1">
                {activeCategory.texture}
              </p>
              <span className="text-xxs font-black text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full inline-block mt-2">
                * Estimula la deglución
              </span>
            </div>

            {/* Healthy Drinks */}
            <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 space-y-2">
              <div className="flex items-center gap-2">
                <div className="bg-blue-500 text-white p-2 rounded-xl">
                  <Droplet className="w-5 h-5" />
                </div>
                <h4 className="font-black text-gray-800 text-base">Líquidos y Bebidas</h4>
              </div>
              <p className="text-sm font-bold text-gray-700 leading-relaxed pt-1">
                {activeCategory.healthyDrinks}
              </p>
            </div>

            {/* Hygiene Recs */}
            <div className="bg-teal-50/50 p-6 rounded-2xl border border-teal-100 space-y-2">
              <div className="flex items-center gap-2">
                <div className="bg-teal-500 text-white p-2 rounded-xl">
                  <Shield className="w-5 h-5" />
                </div>
                <h4 className="font-black text-gray-800 text-base">Higiene y Salud</h4>
              </div>
              <p className="text-sm font-bold text-gray-700 leading-relaxed pt-1">
                {activeCategory.hygieneRecs}
              </p>
            </div>

            {/* Signs of Hunger & Satiety */}
            <div className="bg-purple-50/50 p-6 rounded-2xl border border-purple-100 space-y-4 md:col-span-2 lg:col-span-1">
              <div className="space-y-2">
                <h5 className="text-xs font-black text-emerald-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                  Señales de Hambre
                </h5>
                <p className="text-sm font-bold text-gray-700 leading-relaxed">
                  {activeCategory.hungerSigns}
                </p>
              </div>
              <div className="space-y-2 pt-2 border-t border-purple-100/50">
                <h5 className="text-xs font-black text-amber-700 flex items-center gap-1.5 uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Señales de Saciedad
                </h5>
                <p className="text-sm font-bold text-gray-700 leading-relaxed">
                  {activeCategory.satietySigns}
                </p>
              </div>
            </div>

          </div>

          {/* Pediatric Note */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mt-8 text-center flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs text-gray-500 font-extrabold text-left max-w-xl">
              ⚠️ <strong>Nota pediátrica:</strong> Cada niño se desarrolla a su propio ritmo. Si tienes dudas sobre alergias o si el niño tolera adecuadamente las texturas, consulta siempre con su pediatra o nutricionista de cabecera.
            </span>
            <button
              id="back-to-all-recs-btn"
              onClick={() => setSelectedAgeId('6_meses')}
              className="px-4 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              Reiniciar Vista
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
