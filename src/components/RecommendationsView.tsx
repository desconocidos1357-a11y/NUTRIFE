import React from 'react';
import { 
  ShieldCheck, 
  Droplet, 
  Award, 
  Baby, 
  Apple, 
  AlertCircle,
  HelpCircle,
  Heart,
  CheckCircle,
  BookOpen
} from 'lucide-react';

export default function RecommendationsView() {
  const guidelines = [
    {
      title: 'Higiene Rigurosa en la Cocina',
      desc: 'El sistema inmunológico de los bebés está en pleno desarrollo. Evita infecciones estomacales lavándote las manos por 20 segundos con jabón antes de cocinar y alimentarlo, utilizando siempre agua hervida pura y desinfectando frutas y verduras cuidadosamente.',
      icon: Droplet,
      color: 'bg-teal-500',
      textColor: 'text-teal-900',
      bgColor: 'bg-teal-50/60',
      borderColor: 'border-teal-100'
    },
    {
      title: 'El Secreto de la Vitamina C',
      desc: 'Para asimilar el hierro no hemínico (de las menestras o espinaca), combínalos siempre con limón, mandarina, naranja o tomate. La vitamina C cambia químicamente el hierro en el estómago para que el intestino pueda absorberlo muchísimo más rápido.',
      icon: Apple,
      color: 'bg-orange-500',
      textColor: 'text-orange-900',
      bgColor: 'bg-orange-50/60',
      borderColor: 'border-orange-100'
    },
    {
      title: 'Dile NO a las Infusiones y el Café',
      desc: 'Los tés, manzanilla, anís, café o gaseosas contienen taninos y fitatos que actúan como bloqueadores magnéticos, atrapando el hierro de la comida del bebé para que sea eliminado sin ser asimilado. Su única bebida recomendada es agua pura.',
      icon: AlertCircle,
      color: 'bg-red-500',
      textColor: 'text-red-900',
      bgColor: 'bg-red-50/60',
      borderColor: 'border-red-100'
    },
    {
      title: 'Respeta el Apetito del Niño',
      desc: 'No fuerces nunca a tu hijo a vaciar el plato. La alimentación complementaria busca construir una relación feliz y sana con los alimentos. Forzarlo destruye su sentido de saciedad natural y puede originar rechazo crónico o llantos en la mesa.',
      icon: Baby,
      color: 'bg-purple-500',
      textColor: 'text-purple-900',
      bgColor: 'bg-purple-50/60',
      borderColor: 'border-purple-100'
    }
  ];

  return (
    <div id="recs-view-container" className="space-y-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fadeIn">
      
      {/* Intro Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 sm:p-8 rounded-3xl shadow-md">
        <div className="max-w-2xl">
          <span className="bg-white/20 text-white font-black text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-xs inline-block mb-3">
            Saber es Prevenir
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Recomendaciones Generales para una Alimentación Sin Anemia
          </h2>
          <p className="text-sm sm:text-base text-emerald-50 font-medium mt-2 leading-relaxed">
            Consejos pediátricos prácticos que te ayudarán a optimizar la asimilación del hierro y construir excelentes hábitos alimenticios en casa.
          </p>
        </div>
      </div>

      {/* Grid of guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {guidelines.map((g, idx) => {
          const Icon = g.icon;
          return (
            <div 
              key={idx} 
              className={`${g.bgColor} border ${g.borderColor} rounded-3xl p-6 sm:p-8 flex items-start gap-4 shadow-xxs`}
            >
              <div className={`${g.color} text-white p-3 rounded-2xl shrink-0 shadow-sm`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <h3 className={`text-lg font-black ${g.textColor}`}>{g.title}</h3>
                <p className="text-sm font-bold text-gray-700 leading-relaxed">{g.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pediatric Nutrition Rules Card */}
      <div className="bg-white border-4 border-orange-100 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xs">
        <h3 className="text-xl font-black text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
          <BookOpen className="w-6 h-6 text-orange-500" />
          La Regla de las 3 C para la Alimentación Infantil
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
            <span className="text-3xl font-black text-orange-500 block">1. Calidad</span>
            <p className="text-xs font-bold text-gray-600 leading-relaxed">
              Ofrece alimentos frescos, variados y libres de químicos. Prioriza alimentos ricos en hierro animal como bazo, sangrecita, carnes e hígado de pollo antes que los procesados o papillas envasadas.
            </p>
          </div>

          <div className="space-y-2 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
            <span className="text-3xl font-black text-emerald-500 block">2. Cantidad</span>
            <p className="text-xs font-bold text-gray-600 leading-relaxed">
              Sirve porciones adaptadas al tamaño real del estómago de tu bebé, el cual es del tamaño de su puño cerrado. No busques raciones gigantescas; prioriza que cada cucharada sea rica en nutrientes.
            </p>
          </div>

          <div className="space-y-2 bg-gray-50/50 p-5 rounded-2xl border border-gray-100">
            <span className="text-3xl font-black text-purple-500 block">3. Consistencia</span>
            <p className="text-xs font-bold text-gray-600 leading-relaxed">
              Cambia la textura conforme el niño crezca. Pasar de papilla suave a puré aplastado con tenedor (8 meses) y luego picaditos (10 meses) estimula el desarrollo del habla y la motricidad dental.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
