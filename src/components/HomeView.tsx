import React from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  Baby, 
  Sparkles, 
  TrendingUp, 
  Heart,
  FileText,
  Utensils
} from 'lucide-react';
import { AgeGroupId } from '../types';

interface HomeViewProps {
  onStart: () => void;
  onSelectAge: (age: AgeGroupId) => void;
}

export default function HomeView({ onStart, onSelectAge }: HomeViewProps) {
  const categories = [
    { id: '6_meses', label: '6 meses', desc: 'Papillas suaves y purés homogéneos.', color: 'from-orange-400 to-orange-500' },
    { id: '7_8_meses', label: '7–8 meses', desc: 'Triturados con grumos suaves.', color: 'from-amber-400 to-amber-500' },
    { id: '9_11_meses', label: '9–11 meses', desc: 'Picaditos finos y desmenuzados.', color: 'from-emerald-400 to-emerald-500' },
    { id: '12_23_meses', label: '12–23 meses', desc: 'Trozos pequeños y olla familiar.', color: 'from-teal-400 to-teal-500' },
    { id: '2_5_anos', label: '2 a 5 años', desc: 'Sólida regular y hábitos saludables.', color: 'from-purple-400 to-purple-500' },
  ];

  return (
    <div id="home-view-container" className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Hero Welcome Section */}
      <div className="bg-white rounded-3xl border-4 border-[#ffedd5] shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
        {/* Text Content */}
        <div className="p-6 sm:p-10 lg:p-12 lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600 animate-pulse" />
            Nutrición de Acero • 100% Libre de Anemia
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-none">
            ¡Bienvenidos a <span className="text-emerald-500">Nutri</span><span className="text-orange-500">Fe</span>!
          </h1>

          <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed">
            Tu guía interactiva de alimentación complementaria con un propósito de amor: <strong>prevenir y combatir la anemia infantil</strong> mediante recetas nutritivas, deliciosas y con alto contenido de hierro biodisponible (sangrecita, bazo, hígado y pescado). Diseñado con cuidado pediátrico para acompañar a tu hijo desde los 6 meses hasta los 5 años.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              id="hero-start-btn"
              onClick={onStart}
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-4 rounded-2xl shadow-md cursor-pointer transition-transform hover:scale-103 text-base"
            >
              Comenzar a Cocinar
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#combat-anemia-section"
              className="flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold px-6 py-4 rounded-2xl border border-emerald-100 text-sm"
            >
              ¿Por qué el Hierro?
            </a>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div>
              <span className="text-xl sm:text-2xl font-black text-emerald-600 block">6m - 5a</span>
              <span className="text-3xs text-gray-400 font-bold uppercase tracking-wider">Rango de Edad</span>
            </div>
            <div className="border-l border-gray-100 pl-4">
              <span className="text-xl sm:text-2xl font-black text-orange-500 block">25+</span>
              <span className="text-3xs text-gray-400 font-bold uppercase tracking-wider">Recetas de Acero</span>
            </div>
            <div className="border-l border-gray-100 pl-4">
              <span className="text-xl sm:text-2xl font-black text-purple-600 block">100%</span>
              <span className="text-3xs text-gray-400 font-bold uppercase tracking-wider">Guía Pediátrica</span>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative lg:col-span-5 h-72 sm:h-96 lg:h-full w-full bg-orange-50 overflow-hidden flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1531983412531-1f49a365f698?auto=format&fit=crop&q=80&w=800" 
            alt="Madre alimentando a su hijo"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-orange-950/40 to-transparent"></div>
          
          {/* Subtle branding float badge */}
          <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-xs p-3 rounded-2xl shadow-lg border border-orange-100 flex items-center gap-2 max-w-xs animate-bounce">
            <div className="bg-orange-500 text-white p-2 rounded-xl">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xxs text-gray-400 font-black block uppercase tracking-wider">Consejo de Mamá</span>
              <span className="text-xs font-black text-gray-800 block">¡Sangrecita = Hemoglobina alta!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Choose Age Category Quick Selection */}
      <div className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-black text-orange-500 uppercase tracking-widest block">Recetas por Etapas</span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-800">
            Selecciona la Edad de tu Hijo
          </h2>
          <p className="text-sm text-gray-500 font-bold">
            Cada grupo etario tiene una consistencia de alimentos y frecuencia específica recomendada por el Ministerio de Salud para prevenir la desnutrición.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`home-category-${cat.id}`}
              onClick={() => onSelectAge(cat.id as AgeGroupId)}
              className="bg-white hover:scale-102 hover:shadow-md border border-gray-100 rounded-2xl p-5 text-center flex flex-col justify-between h-48 transition-all duration-200 cursor-pointer text-left group"
            >
              <div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${cat.color} text-white flex items-center justify-center font-black text-sm shadow-sm mb-4`}>
                  <Baby className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-gray-800 group-hover:text-emerald-500 transition-colors">
                  {getAgeFriendlyLabel(cat.id)}
                </h3>
                <p className="text-xs text-gray-500 font-bold mt-1 leading-snug">
                  {cat.desc}
                </p>
              </div>
              <span className="text-3xs font-black text-emerald-600 uppercase tracking-wider flex items-center justify-end gap-1 mt-2">
                Ver recetario
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Why Iron / Anemia Prevention Section */}
      <div id="combat-anemia-section" className="bg-[#f0fdf4] rounded-3xl border-2 border-emerald-100 p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div className="bg-emerald-500 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-800 tracking-tight leading-tight">
            La Anemia Infantil: Un enemigo silencioso que podemos vencer
          </h2>
          <p className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed">
            La anemia ocurre cuando el cuerpo no tiene suficientes glóbulos rojos sanos para transportar oxígeno a los tejidos y al cerebro. En los niños menores de 3 años, la anemia puede causar <strong>daños irreversibles en el aprendizaje, motricidad y defensas</strong>.
            <br /><br />
            El hierro de origen animal, conocido como <strong>hierro hemínico</strong> (presente en la sangrecita, bazo de res, hígado y pescados azules), se absorbe hasta 5 veces mejor que el hierro de las plantas. Con solo incorporar 2 cucharadas diarias en las comidas de tu bebé, lo estarás protegiendo de por vida.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-emerald-50 space-y-2">
            <div className="text-orange-500 font-black text-lg">💡 Tip de Oro</div>
            <p className="text-xs text-gray-600 font-bold leading-relaxed">
              Siempre acompaña las papillas que contengan hierro con una fuente de <strong>Vitamina C</strong> (naranja, mandarina, kiwi o tomate) para duplicar la absorción del hierro.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-50 space-y-2">
            <div className="text-red-500 font-black text-lg">⚠️ ¡Alerta!</div>
            <p className="text-xs text-gray-600 font-bold leading-relaxed">
              <strong>Nunca</strong> des infusiones, té, café o gaseosas a tus niños pequeños. Estos líquidos bloquean por completo la asimilación del hierro en el intestino.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-50 space-y-2">
            <div className="text-emerald-600 font-black text-lg">🥦 Hierro Animal</div>
            <p className="text-xs text-gray-600 font-bold leading-relaxed">
              La sangrecita de pollo deshidratada aporta <strong>29.5 mg</strong> de hierro, el bazo aporta <strong>28.7 mg</strong>, y el hígado de pollo aporta <strong>8.5 mg</strong> por cada 100g.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-50 space-y-2">
            <div className="text-purple-600 font-black text-lg">🥣 Textura Ideal</div>
            <p className="text-xs text-gray-600 font-bold leading-relaxed">
              No licúes los alimentos del bebé de más de 8 meses. Aplastarlos con un tenedor estimula el habla y la masticación de forma sana y natural.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

// Age Group helper
function getAgeFriendlyLabel(age: string) {
  switch (age) {
    case '6_meses': return 'Bebés de 6 meses';
    case '7_8_meses': return 'Bebés de 7 a 8 meses';
    case '9_11_meses': return 'Bebés de 9 a 11 meses';
    case '12_23_meses': return 'Niños de 12 a 23 meses';
    case '2_5_anos': return 'Niños de 2 a 5 años';
    default: return age;
  }
}
