import React, { useState } from 'react';
import { 
  Search, 
  Clock, 
  Award, 
  Heart, 
  Baby, 
  CheckCircle2, 
  Sparkles,
  Play,
  ArrowRight
} from 'lucide-react';
import { Recipe, AgeGroupId } from '../types';

interface SearchViewProps {
  recipes: Recipe[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  initialAgeFilter?: string;
  isFavoritesOnlyView?: boolean; // if we want to reuse this for "Mis Favoritos" tab
}

export default function SearchView({ 
  recipes, 
  favorites, 
  onToggleFavorite, 
  onSelectRecipe,
  initialAgeFilter = 'todos',
  isFavoritesOnlyView = false
}: SearchViewProps) {
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAge, setSelectedAge] = useState<string>(initialAgeFilter);

  // Friendly Age group helpers
  const getAgeFriendlyLabel = (age: string) => {
    switch (age) {
      case '6_meses': return '6 m';
      case '7_8_meses': return '7-8 m';
      case '9_11_meses': return '9-11 m';
      case '12_23_meses': return '12-23 m';
      case '2_5_anos': return '2-5 a';
      default: return age;
    }
  };

  // Filter recipes based on:
  // 1. Search term (matches name or ingredients or ironRichIngredients)
  // 2. Selected age
  // 3. Favorites only (if inside favorite view or toggled)
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          recipe.ingredients.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          recipe.ironRichIngredients.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAge = selectedAge === 'todos' || recipe.age === selectedAge;
    
    const matchesFavorites = !isFavoritesOnlyView || favorites.includes(recipe.id);

    return matchesSearch && matchesAge && matchesFavorites;
  });

  const ageTabs = [
    { id: 'todos', label: 'Cualquier Edad' },
    { id: '6_meses', label: '6 Meses' },
    { id: '7_8_meses', label: '7-8 Meses' },
    { id: '9_11_meses', label: '9-11 Meses' },
    { id: '12_23_meses', label: '12-23 Meses' },
    { id: '2_5_anos', label: '2-5 Años' }
  ];

  return (
    <div id="search-view-container" className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn">
      
      {/* Title Header depending on mode */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="text-xs font-black text-emerald-600 uppercase tracking-widest block">
          {isFavoritesOnlyView ? 'Tus Selecciones' : 'Buscador Inteligente'}
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-gray-800 tracking-tight leading-none">
          {isFavoritesOnlyView ? 'Tus Recetas Guardadas' : 'Explora el Recetario NutriFe'}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 font-bold">
          {isFavoritesOnlyView 
            ? 'Aquí encontrarás las papillas y guisos ricas en hierro que marcaste con el corazón para cocinar rápido.' 
            : 'Filtra por ingrediente (sangrecita, bazo, hígado, papa, camote) o rango de edad para encontrar el almuerzo perfecto.'}
        </p>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-xxs space-y-4">
        
        {/* Search Field */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
          <input 
            id="recipes-search-input"
            type="text" 
            placeholder="Escribe un ingrediente (ej. sangrecita, hígado, palta) o nombre de receta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-2 border-gray-100 text-sm font-bold text-gray-800 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Age Selector Tabs (Horizontal Scrollable on mobile) */}
        {!isFavoritesOnlyView && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-1">
            <span className="text-xs font-black text-gray-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">Filtrar:</span>
            <div className="flex gap-2">
              {ageTabs.map((tab) => {
                const isActive = selectedAge === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`search-tab-${tab.id}`}
                    onClick={() => setSelectedAge(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-150 cursor-pointer whitespace-nowrap border ${
                      isActive 
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-xs' 
                        : 'bg-gray-50 text-gray-600 border-gray-100 hover:bg-emerald-50/50 hover:text-emerald-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Grid of Results */}
      {filteredRecipes.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 space-y-4">
          <div className="bg-orange-50 text-orange-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
            <Baby className="w-6 h-6" />
          </div>
          <div className="text-gray-400 text-lg font-bold">No se encontraron resultados.</div>
          <p className="text-xs text-gray-400 font-bold max-w-sm mx-auto leading-relaxed">
            {isFavoritesOnlyView 
              ? 'Aún no has guardado ninguna receta como favorita. ¡Toca el ícono del corazón en cualquier receta para verla aquí!' 
              : 'Prueba buscando "sangrecita", "bazo" o cambia el filtro de edad para encontrar alternativas deliciosas.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => {
            const isFav = favorites.includes(recipe.id);
            return (
              <div 
                key={recipe.id}
                className="bg-white rounded-3xl border-2 border-orange-100 overflow-hidden shadow-xxs hover:shadow-md hover:scale-101 transition-all duration-200 flex flex-col justify-between group relative"
              >
                {/* Image Block */}
                <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                  <img 
                    src={recipe.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400"} 
                    alt={recipe.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {/* Floating age badge */}
                  <span className="absolute top-3 left-3 bg-white/95 text-emerald-800 font-extrabold text-3xs px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider">
                    {getAgeFriendlyLabel(recipe.age)}
                  </span>

                  {/* Favorite button icon on card */}
                  <button
                    id={`favorite-card-toggle-${recipe.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(recipe.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-150 cursor-pointer ${
                      isFav 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/95 text-gray-400 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Info Block */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-black text-gray-800 text-base leading-snug group-hover:text-emerald-600 transition-colors">
                      {recipe.name}
                    </h3>
                    
                    {/* Heme iron shield identifier */}
                    <div className="bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl p-2.5 flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-3xs font-bold leading-relaxed">
                        <strong className="text-emerald-950 block text-xxs font-black mb-0.5 uppercase tracking-wide">Rico en Hierro:</strong>
                        {recipe.ironRichIngredients}
                      </span>
                    </div>
                  </div>

                  {/* Prep times & button */}
                  <div className="pt-2 border-t border-gray-50 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-3xs text-gray-400 font-black uppercase tracking-wider">
                      <Clock className="w-3.5 h-3.5 text-orange-400" />
                      <span>{parseInt(recipe.prepTime) + parseInt(recipe.cookTime)} min total</span>
                    </div>

                    <button
                      id={`view-recipe-btn-${recipe.id}`}
                      onClick={() => onSelectRecipe(recipe)}
                      className="flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      Ver Receta
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
