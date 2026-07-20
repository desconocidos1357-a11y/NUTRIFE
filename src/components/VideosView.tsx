import React, { useState } from 'react';
import { 
  Video, 
  Clock, 
  Search, 
  Play, 
  ExternalLink,
  Sparkles,
  Baby
} from 'lucide-react';
import { Recipe, AgeGroupId } from '../types';

interface VideosViewProps {
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
}

export default function VideosView({ recipes, onSelectRecipe }: VideosViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAge, setSelectedAge] = useState<string>('todos');

  // Filter recipes that have a videoUrl and match search/age
  const videoRecipes = recipes.filter(r => {
    if (!r.videoUrl) return false;
    
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.ironRichIngredients.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAge = selectedAge === 'todos' || r.age === selectedAge;
    
    return matchesSearch && matchesAge;
  });

  // Helper to extract YouTube Thumbnail
  const getYoutubeThumbnail = (url: string) => {
    if (!url) return '';
    try {
      let videoId = '';
      if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get('v') || '';
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
      } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('youtube.com/embed/')[1]?.split('?')[0] || '';
      }
      return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';
    } catch (e) {
      return '';
    }
  };

  const getAgeBadgeLabel = (age: string) => {
    switch (age) {
      case '6_meses': return '6 meses';
      case '7_8_meses': return '7–8 meses';
      case '9_11_meses': return '9–11 meses';
      case '12_23_meses': return '12–23 m (1 año)';
      case '2_5_anos': return '2 a 5 años';
      default: return age;
    }
  };

  return (
    <div id="videos-view-container" className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 sm:p-8 rounded-3xl shadow-md">
        <div className="max-w-2xl">
          <span className="bg-white/25 text-white font-black text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs inline-block mb-3">
            Tutoriales Paso a Paso
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Videos de Cocina NutriFe
          </h2>
          <p className="text-sm sm:text-base text-orange-50 font-medium mt-2 leading-relaxed">
            Mira de forma interactiva la consistencia idónea, el color y el modo de preparación de nuestras mejores papillas ricas en hierro contra la anemia.
          </p>
        </div>
      </div>

      {/* Control bar: search + age filter */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-xxs grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search */}
        <div className="relative md:col-span-7">
          <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
          <input 
            id="video-search-input"
            type="text" 
            placeholder="Buscar videos por receta o ingredientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-2 border-gray-100 text-sm font-bold text-gray-800 focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>

        {/* Age Dropdown Filter */}
        <div className="md:col-span-5 flex items-center gap-2">
          <span className="text-xs font-black text-gray-500 uppercase tracking-wider shrink-0 hidden sm:inline">Filtrar Edad:</span>
          <select 
            id="video-age-filter"
            value={selectedAge}
            onChange={(e) => setSelectedAge(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 rounded-2xl border-2 border-gray-100 text-sm font-bold text-gray-800 focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="todos">Cualquier edad</option>
            <option value="6_meses">Bebés de 6 meses</option>
            <option value="7_8_meses">Bebés de 7 a 8 meses</option>
            <option value="9_11_meses">Bebés de 9 a 11 meses</option>
            <option value="12_23_meses">Niños de 12 a 23 meses (1 año)</option>
            <option value="2_5_anos">Niños de 2 a 5 años</option>
          </select>
        </div>
      </div>

      {/* Video Cards Grid */}
      {videoRecipes.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 space-y-3">
          <div className="text-gray-400 text-lg font-bold">No se encontraron videos explicativos.</div>
          <p className="text-xs text-gray-400 font-bold max-w-sm mx-auto leading-relaxed">
            Intente cambiar los filtros o el término de búsqueda para ver tutoriales sobre sangrecita, hígado o bazo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoRecipes.map((recipe) => {
            const thumb = getYoutubeThumbnail(recipe.videoUrl);
            return (
              <div 
                key={recipe.id}
                className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xxs hover:shadow-md hover:scale-101 transition-all duration-200 flex flex-col justify-between group"
              >
                {/* Thumbnail Block */}
                <div className="relative h-48 w-full bg-gray-900 overflow-hidden">
                  {thumb ? (
                    <img 
                      src={thumb} 
                      alt={recipe.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-orange-950 flex items-center justify-center">
                      <Video className="w-12 h-12 text-orange-500" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center group-hover:bg-black/35 transition-colors">
                    <div className="bg-orange-500 text-white p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-200">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>
                  
                  {/* Floating age badge */}
                  <span className="absolute top-3 left-3 bg-white/95 text-emerald-800 font-extrabold text-3xs px-2.5 py-1 rounded-full shadow-sm uppercase tracking-wider">
                    {getAgeBadgeLabel(recipe.age)}
                  </span>
                </div>

                {/* Info Block */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-gray-800 text-base leading-tight">
                      {recipe.name}
                    </h3>
                    <p className="text-xxs text-gray-400 font-bold mt-1 uppercase tracking-widest">
                      Rico en: {recipe.ironRichIngredients}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      id={`play-recipe-video-${recipe.id}`}
                      onClick={() => onSelectRecipe(recipe)}
                      className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs py-2.5 px-4 rounded-xl cursor-pointer text-center"
                    >
                      Ver en Recetario
                    </button>
                    <a
                      id={`external-youtube-shortcut-${recipe.id}`}
                      href={recipe.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 bg-gray-50 hover:bg-orange-50 hover:text-orange-600 text-gray-500 rounded-xl border border-gray-100"
                      title="Abrir en YouTube"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
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
