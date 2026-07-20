import React from 'react';
import { 
  Heart, 
  Award, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  UtensilsCrossed, 
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function AboutView() {
  return (
    <div id="about-view-container" className="space-y-10 max-w-4xl mx-auto px-4 sm:px-0 py-6 animate-fadeIn">
      
      {/* Intro Brand Banner */}
      <div className="bg-white rounded-3xl border-4 border-emerald-100 shadow-md p-6 sm:p-10 text-center space-y-4">
        <div className="bg-emerald-500 text-white w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-md">
          <span className="font-black text-2xl">NF</span>
        </div>
        <h2 className="text-3xl font-black text-gray-800">Sobre la Iniciativa NutriFe</h2>
        <p className="text-sm font-bold text-gray-500 max-w-xl mx-auto leading-relaxed">
          Nacimos con la firme convicción de que un niño bien alimentado es un niño con un futuro brillante. NutriFe es una plataforma gratuita dedicada a guiar a las familias en la prevención de la anemia.
        </p>
      </div>

      {/* Story & Mission Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 space-y-6 shadow-xxs">
        <h3 className="text-xl font-black text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Sparkles className="w-5 h-5 text-amber-500" />
          Nuestra Misión
        </h3>
        <p className="text-sm text-gray-600 font-medium leading-relaxed">
          En el Perú y América Latina, la anemia ferropénica (por falta de hierro) afecta a más del 40% de niños menores de 3 años. Esto debilita su capacidad inmunológica y limita su potencial intelectual de por vida.
          <br /><br />
          <strong>NutriFe</strong> busca democratizar el acceso a recetarios prácticos y nutritivos basados en ingredientes locales de bajo costo pero de altísima densidad de hierro hemínico, tales como la sangrecita, el bazo de res, el hígado de pollo y el pescado oscuro.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-center">
            <ShieldCheck className="w-6 h-6 text-orange-500 mx-auto mb-2" />
            <h4 className="font-black text-xs text-orange-950 uppercase tracking-wider">Recetas Seguras</h4>
            <span className="text-3xs text-orange-800 font-bold block mt-1">Validadas nutricionalmente</span>
          </div>
          <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-center">
            <UtensilsCrossed className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <h4 className="font-black text-xs text-emerald-950 uppercase tracking-wider">Fácil Acceso</h4>
            <span className="text-3xs text-emerald-800 font-bold block mt-1">Sin contraseñas para padres</span>
          </div>
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 text-center">
            <BookOpen className="w-6 h-6 text-amber-600 mx-auto mb-2" />
            <h4 className="font-black text-xs text-amber-950 uppercase tracking-wider">Videos y QR</h4>
            <span className="text-3xs text-amber-800 font-bold block mt-1">Ayuda visual en la cocina</span>
          </div>
        </div>
      </div>

      {/* Recommended Ingredients Highlights */}
      <div className="bg-amber-500 text-white rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <h3 className="text-lg font-black flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-200 fill-current" />
          Los 4 Guardianes de NutriFe contra la Anemia
        </h3>
        <p className="text-xs font-bold leading-relaxed text-amber-50">
          Prioriza estos alimentos en las papillas de tus hijos de 2 a 3 veces por semana para asegurar reservas óptimas de hemoglobina:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-white/10 p-3 rounded-xl">
            <span className="text-sm font-black block">1. Sangrecita</span>
            <span className="text-xxs text-amber-100 font-medium">El aporte de hierro más alto (29.5 mg)</span>
          </div>
          <div className="bg-white/10 p-3 rounded-xl">
            <span className="text-sm font-black block">2. Bazo de Res</span>
            <span className="text-xxs text-amber-100 font-medium">Súper concentrado y económico (28.7 mg)</span>
          </div>
          <div className="bg-white/10 p-3 rounded-xl">
            <span className="text-sm font-black block">3. Hígado</span>
            <span className="text-xxs text-amber-100 font-medium">Rico en hierro y Vitamina A (8.5 mg)</span>
          </div>
          <div className="bg-white/10 p-3 rounded-xl">
            <span className="text-sm font-black block">4. Pescado Azul</span>
            <span className="text-xxs text-amber-100 font-medium">Bonito y jurel con Omega 3 y Hierro</span>
          </div>
        </div>
      </div>

      {/* Pediatric Council & Contact */}
      <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 space-y-6 shadow-xxs">
        <h3 className="text-xl font-black text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
          <Mail className="w-5 h-5 text-emerald-500" />
          Consultas y Soporte NutriFe
        </h3>
        <p className="text-sm text-gray-500 font-medium leading-relaxed">
          ¿Tienes sugerencias de nuevas recetas ricas en hierro que te gustaría ver publicadas? ¿Eres profesional de salud y quieres sumarte a NutriFe? ¡Contáctanos directamente!
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
            <Phone className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <span className="text-xxs text-gray-400 font-black block uppercase tracking-wider">Llámanos</span>
              <span className="text-xs font-bold text-gray-700">+51 987 654 321</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
            <Mail className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <span className="text-xxs text-gray-400 font-black block uppercase tracking-wider">Escríbenos</span>
              <span className="text-xs font-bold text-gray-700">contacto@nutrife.org</span>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
            <MapPin className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <span className="text-xxs text-gray-400 font-black block uppercase tracking-wider">Sede Principal</span>
              <span className="text-xs font-bold text-gray-700">Lima, Perú</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
