import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Award, 
  ChevronRight, 
  Utensils, 
  ShieldAlert, 
  Video, 
  QrCode, 
  Sparkles,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { Recipe } from '../types';

interface RecipeDetailProps {
  recipe: Recipe;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function RecipeDetail({ recipe, onClose, isFavorite, onToggleFavorite }: RecipeDetailProps) {
  const [showVideo, setShowVideo] = useState(false);

  // Helper to extract YouTube ID or get safe embed link
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    try {
      let videoId = '';
      if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get('v') || '';
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
      } else if (url.includes('youtube.com/embed/')) {
        return url; // already embed
      }
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    } catch (e) {
      return '';
    }
  };

  const embedUrl = getEmbedUrl(recipe.videoUrl);
  // Free, stable, fast QR code API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=059669&data=${encodeURIComponent(recipe.qrUrl || `https://nutrife.app/recipe/${recipe.id}`)}`;

  // Convert newline-separated ingredients or comma-separated ingredients into a neat array
  const ingredientsList = recipe.ingredients
    ? recipe.ingredients.split('\n').filter(line => line.trim().length > 0)
    : [];

  const quantitiesList = recipe.quantities
    ? recipe.quantities.split('\n').filter(line => line.trim().length > 0)
    : [];

  const preparationSteps = recipe.preparation
    ? recipe.preparation.split('\n').filter(line => line.trim().length > 0)
    : [];

  // Age group badges friendly labels
  const getAgeBadgeLabel = (age: string) => {
    switch (age) {
      case '6_meses': return '6 meses';
      case '7_8_meses': return '7–8 meses';
      case '9_11_meses': return '9–11 meses';
      case '12_23_meses': return '12–23 meses (1 año)';
      case '2_5_anos': return '2 a 5 años';
      default: return age;
    }
  };

  return (
    <div id={`recipe-modal-${recipe.id}`} className="fixed inset-0 bg-black/60 backdrop-blur-xs flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div 
        id="recipe-modal-content" 
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-emerald-100 flex flex-col relative animate-scaleIn"
      >
        {/* Header Image / Hero */}
        <div className="relative h-64 sm:h-80 w-full shrink-0 bg-gray-100">
          <img 
            src={recipe.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600"} 
            alt={recipe.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => {
              // fallback image if dynamic load fails
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
          
          {/* Close button */}
          <button 
            id="close-recipe-modal-btn"
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/95 text-gray-700 hover:text-black p-2.5 rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer z-10"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Favorite button */}
          <button 
            id="favorite-recipe-toggle-btn"
            onClick={onToggleFavorite}
            className={`absolute top-4 left-4 p-2.5 rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer z-10 ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/95 text-gray-400 hover:text-red-500'
            }`}
            aria-label="Favorito"
          >
            <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current animate-pulse' : ''}`} />
          </button>

          {/* Title on image overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="bg-amber-500 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-md inline-block mb-3 uppercase tracking-wider">
              Categoría: {getAgeBadgeLabel(recipe.age)}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight drop-shadow-md">
              {recipe.name}
            </h2>
          </div>
        </div>

        {/* Modal Main Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Specs / Meta badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-orange-50/70 p-4 rounded-2xl border border-orange-100">
            <div className="flex flex-col items-center text-center p-2">
              <Clock className="w-5 h-5 text-orange-500 mb-1" />
              <span className="text-xxs text-gray-400 font-bold uppercase tracking-wider">Prep.</span>
              <span className="text-sm font-extrabold text-gray-800">{recipe.prepTime} min</span>
            </div>
            <div className="flex flex-col items-center text-center p-2 border-l border-orange-100/70 sm:border-l sm:border-r">
              <Utensils className="w-5 h-5 text-emerald-500 mb-1" />
              <span className="text-xxs text-gray-400 font-bold uppercase tracking-wider">Cocción</span>
              <span className="text-sm font-extrabold text-gray-800">{recipe.cookTime} min</span>
            </div>
            <div className="flex flex-col items-center text-center p-2 border-l border-orange-100/70 sm:border-r-0 sm:border-l">
              <Award className="w-5 h-5 text-amber-500 mb-1" />
              <span className="text-xxs text-gray-400 font-bold uppercase tracking-wider">Dificultad</span>
              <span className="text-sm font-extrabold text-gray-800">{recipe.difficulty}</span>
            </div>
            <div className="flex flex-col items-center text-center p-2 border-l border-orange-100/70 sm:border-l">
              <Sparkles className="w-5 h-5 text-purple-500 mb-1" />
              <span className="text-xxs text-gray-400 font-bold uppercase tracking-wider">Rico en</span>
              <span className="text-xs font-black text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md mt-0.5 max-w-full truncate">
                {recipe.ironRichIngredients.split(',')[0]}
              </span>
            </div>
          </div>

          {/* Quick Pediatric Recommendation Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 flex items-start gap-3">
              <div className="bg-emerald-500 text-white p-1.5 rounded-lg shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-emerald-800 uppercase tracking-wider">Textura Ideal</h4>
                <p className="text-sm font-bold text-gray-700 mt-0.5">{recipe.texture}</p>
              </div>
            </div>
            <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100 flex items-start gap-3">
              <div className="bg-amber-500 text-white p-1.5 rounded-lg shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-800 uppercase tracking-wider">Porción Recomendada</h4>
                <p className="text-sm font-bold text-gray-700 mt-0.5">{recipe.portionSize}</p>
              </div>
            </div>
          </div>

          {/* Iron Shield / Anemia Defense Alert */}
          <div className="bg-emerald-600 text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 items-center">
            <div className="bg-white/20 p-3 rounded-full shrink-0">
              <ShieldAlert className="w-8 h-8 text-amber-300" />
            </div>
            <div className="text-center sm:text-left">
              <h4 className="text-base font-black tracking-tight flex items-center justify-center sm:justify-start gap-2 text-amber-300">
                Defensa contra la Anemia Infantil
              </h4>
              <p className="text-xs font-bold leading-relaxed text-emerald-50 mt-1">
                <span className="underline decoration-amber-300 decoration-2 font-black">Ingredientes ricos en hierro:</span> {recipe.ironRichIngredients}.
                <br />
                {recipe.nutritionalBenefits}
              </p>
            </div>
          </div>

          {/* Ingredients and quantities */}
          <div className="space-y-3">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-2 border-b-2 border-emerald-100 pb-1">
              <span className="w-2.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
              Ingredientes y Cantidades
            </h3>
            
            {quantitiesList.length > 0 ? (
              <div className="bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {quantitiesList.map((qty, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 font-bold">
                    <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0"></span>
                    <span>{qty}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-4 sm:p-5 rounded-2xl border border-gray-100 space-y-2">
                {ingredientsList.map((ing, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-gray-700 font-bold">
                    <span className="w-2 h-2 rounded-full bg-orange-400 shrink-0 mt-1.5"></span>
                    <span>{ing}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preparation steps */}
          <div className="space-y-3">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-2 border-b-2 border-emerald-100 pb-1">
              <span className="w-2.5 h-6 bg-emerald-500 rounded-full inline-block"></span>
              Preparación Paso a Paso
            </h3>
            <div className="space-y-3.5">
              {preparationSteps.map((step, idx) => {
                // Check if step already starts with a number like "1."
                const hasNumberPrefix = /^\d+[\s.)]/.test(step.trim());
                return (
                  <div key={idx} className="flex items-start gap-4 p-3 hover:bg-emerald-50/30 rounded-xl transition-colors">
                    <div className="bg-orange-500 text-white font-black text-sm w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      {hasNumberPrefix ? step.trim().match(/^\d+/)?.[0] || (idx + 1) : (idx + 1)}
                    </div>
                    <p className="text-sm font-bold text-gray-700 leading-relaxed pt-0.5">
                      {hasNumberPrefix ? step.replace(/^\d+[\s.)\s]+/, '') : step}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Multimedia & QR Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t-2 border-gray-100 pt-6">
            
            {/* Video button or player */}
            <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-black text-amber-800 flex items-center gap-2">
                  <Video className="w-5 h-5 text-orange-500" />
                  Video de Preparación
                </h4>
                <p className="text-xs text-gray-500 font-bold mt-1.5">
                  Mira el video paso a paso para preparar esta receta como un profesional y asegurar una textura idónea.
                </p>
              </div>

              {recipe.videoUrl ? (
                <div className="mt-4">
                  {showVideo && embedUrl ? (
                    <div className="relative pb-[56.25%] h-0 rounded-xl overflow-hidden border border-amber-200 shadow-md">
                      <iframe 
                        className="absolute top-0 left-0 w-full h-full"
                        src={`${embedUrl}?autoplay=1`}
                        title={recipe.name}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        referrerPolicy="no-referrer"
                      ></iframe>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <button
                        id="embed-video-play-btn"
                        onClick={() => setShowVideo(true)}
                        className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black py-3 px-4 rounded-xl shadow-md cursor-pointer transition-transform hover:scale-101 text-sm"
                      >
                        <Video className="w-4 h-4 fill-white text-orange-500" />
                        Ver Video Integrado
                      </button>
                      <a 
                        id="external-youtube-link"
                        href={recipe.videoUrl} 
                        target="_blank" 
                        rel="noreferrer noopener"
                        className="w-full flex items-center justify-center gap-2 bg-white hover:bg-amber-100 text-amber-800 border border-amber-300 font-extrabold py-2 px-4 rounded-xl text-xs text-center"
                      >
                        Abrir en YouTube externo
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-gray-400 font-bold">
                  No hay video asignado para esta receta.
                </div>
              )}
            </div>

            {/* QR Code section */}
            <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 flex flex-col items-center text-center">
              <h4 className="text-sm font-black text-emerald-800 flex items-center gap-2 self-start">
                <QrCode className="w-5 h-5 text-emerald-600" />
                Llevar Receta en Celular
              </h4>
              <p className="text-xxs text-gray-500 font-bold mt-1.5 text-left self-start">
                Escanea el código QR con tu celular para llevar los ingredientes y preparación directamente al mercado o cocina.
              </p>
              
              <div className="mt-4 bg-white p-2.5 rounded-2xl shadow-inner border border-emerald-100 hover:scale-105 transition-transform duration-200">
                <img 
                  src={qrCodeUrl} 
                  alt="Código QR de la Receta"
                  className="w-32 h-32 object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fail gracefully with a placeholder text block
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="text-xxs font-mono text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full mt-2 font-bold max-w-full truncate">
                {recipe.id}
              </span>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 shrink-0 text-center rounded-b-3xl">
          <button 
            id="footer-close-recipe-modal-btn"
            onClick={onClose}
            className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-extrabold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Entendido, Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
