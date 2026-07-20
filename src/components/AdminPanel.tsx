import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Lock, 
  Unlock, 
  Upload, 
  FileText, 
  Check, 
  AlertCircle, 
  Sparkles,
  RefreshCw,
  Video,
  QrCode,
  Image as ImageIcon,
  Clock,
  BookOpen,
  ArrowLeft
} from 'lucide-react';
import { Recipe, AgeGroupId } from '../types';
import { 
  addRecipeToDb, 
  updateRecipeInDb, 
  deleteRecipeFromDb, 
  signInAdmin, 
  isFirebaseConfigured 
} from '../lib/firebase';

interface AdminPanelProps {
  recipes: Recipe[];
  onRefreshRecipes: () => void;
  isAdmin: boolean;
  adminEmail?: string;
  onLoginSuccess: (email: string) => void;
}

export default function AdminPanel({ recipes, onRefreshRecipes, isAdmin, adminEmail, onLoginSuccess }: AdminPanelProps) {
  // Authentication states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Form states for adding/editing recipes
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  
  const [formName, setFormName] = useState('');
  const [formAge, setFormAge] = useState<AgeGroupId>('6_meses');
  const [formIngredients, setFormIngredients] = useState('');
  const [formQuantities, setFormQuantities] = useState('');
  const [formPreparation, setFormPreparation] = useState('');
  const [formPortionSize, setFormPortionSize] = useState('');
  const [formTexture, setFormTexture] = useState('');
  const [formNutritionalBenefits, setFormNutritionalBenefits] = useState('');
  const [formIronRichIngredients, setFormIronRichIngredients] = useState('');
  const [formPrepTime, setFormPrepTime] = useState('15');
  const [formCookTime, setFormCookTime] = useState('20');
  const [formDifficulty, setFormDifficulty] = useState<'Fácil' | 'Medio' | 'Difícil'>('Fácil');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formQrUrl, setFormQrUrl] = useState('');

  // Status flags
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    
    const result = await signInAdmin(email, password);
    setIsLoggingIn(false);
    
    if (result.success) {
      onLoginSuccess(email || "admin@nutrife.com");
    } else {
      setLoginError(result.error || "Error de inicio de sesión");
    }
  };

  // Convert uploaded image file to base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setFormImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Fill form for editing
  const handleStartEdit = (recipe: Recipe) => {
    setEditingRecipeId(recipe.id);
    setFormName(recipe.name);
    setFormAge(recipe.age);
    setFormIngredients(recipe.ingredients);
    setFormQuantities(recipe.quantities || '');
    setFormPreparation(recipe.preparation);
    setFormPortionSize(recipe.portionSize);
    setFormTexture(recipe.texture);
    setFormNutritionalBenefits(recipe.nutritionalBenefits);
    setFormIronRichIngredients(recipe.ironRichIngredients);
    setFormPrepTime(recipe.prepTime);
    setFormCookTime(recipe.cookTime);
    setFormDifficulty(recipe.difficulty);
    setFormImageUrl(recipe.imageUrl);
    setFormVideoUrl(recipe.videoUrl);
    setFormQrUrl(recipe.qrUrl);
    
    setFormError('');
    setFormSuccess('');
    setIsFormOpen(true);
  };

  // Reset form fields
  const handleResetForm = () => {
    setEditingRecipeId(null);
    setFormName('');
    setFormAge('6_meses');
    setFormIngredients('');
    setFormQuantities('');
    setFormPreparation('');
    setFormPortionSize('');
    setFormTexture('');
    setFormNutritionalBenefits('');
    setFormIronRichIngredients('');
    setFormPrepTime('15');
    setFormCookTime('20');
    setFormDifficulty('Fácil');
    setFormImageUrl('');
    setFormVideoUrl('');
    setFormQrUrl('');
    
    setFormError('');
    setFormSuccess('');
    setIsFormOpen(false);
  };

  // Handle Form Submit (Add or Edit)
  const handleSubmitRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formName.trim() || !formIngredients.trim() || !formPreparation.trim()) {
      setFormError('Por favor complete los campos obligatorios: Nombre, Ingredientes y Preparación.');
      return;
    }

    setIsSubmitting(true);

    const recipePayload = {
      name: formName,
      age: formAge,
      ingredients: formIngredients,
      quantities: formQuantities,
      preparation: formPreparation,
      portionSize: formPortionSize || 'Al gusto',
      texture: formTexture || 'Papilla o puré blando',
      nutritionalBenefits: formNutritionalBenefits || 'Excelente fuente de vitaminas y minerales para el bebé.',
      ironRichIngredients: formIronRichIngredients || 'Ingredientes naturales',
      prepTime: formPrepTime || '15',
      cookTime: formCookTime || '15',
      difficulty: formDifficulty,
      imageUrl: formImageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
      videoUrl: formVideoUrl || 'https://www.youtube.com/watch?v=FOf6h9Zzsc8',
      qrUrl: formQrUrl || `https://nutrife.app/receta/${formName.toLowerCase().replace(/ /g, '_')}`
    };

    try {
      if (editingRecipeId) {
        // Edit flow
        const success = await updateRecipeInDb(editingRecipeId, recipePayload);
        if (success) {
          setFormSuccess('¡Receta actualizada con éxito!');
          setTimeout(() => {
            handleResetForm();
            onRefreshRecipes();
          }, 1200);
        } else {
          setFormError('Hubo un error al intentar actualizar la receta.');
        }
      } else {
        // Add flow
        await addRecipeToDb(recipePayload);
        setFormSuccess('¡Receta agregada con éxito a la base de datos!');
        setTimeout(() => {
          handleResetForm();
          onRefreshRecipes();
        }, 1200);
      }
    } catch (err: any) {
      setFormError(err.message || 'Ocurrió un error inesperado al procesar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Recipe
  const handleDeleteRecipe = async (id: string, name: string) => {
    if (window.confirm(`¿Estás completamente seguro de que deseas eliminar la receta "${name}"? Esta acción no se puede deshacer.`)) {
      try {
        const success = await deleteRecipeFromDb(id);
        if (success) {
          alert('Receta eliminada correctamente.');
          onRefreshRecipes();
        } else {
          alert('Hubo un error al intentar borrar la receta.');
        }
      } catch (err) {
        console.error(err);
        alert('Error al procesar la eliminación.');
      }
    }
  };

  // Friendly Age group helpers
  const getAgeFriendlyName = (age: string) => {
    switch (age) {
      case '6_meses': return '6 meses';
      case '7_8_meses': return '7–8 meses';
      case '9_11_meses': return '9–11 meses';
      case '12_23_meses': return '12–23 meses (1 año)';
      case '2_5_anos': return '2 a 5 años';
      default: return age;
    }
  };

  // 1. LOGIN SCREEN
  if (!isAdmin) {
    return (
      <div id="admin-login-screen" className="max-w-md mx-auto my-12 px-4 sm:px-0">
        <div className="bg-white rounded-3xl border-4 border-orange-100 shadow-xl overflow-hidden p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="bg-amber-100 text-amber-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-gray-800">Acceso Administrativo</h2>
            <p className="text-xs text-gray-500 font-bold leading-relaxed">
              Inicia sesión para gestionar el recetario oficial de NutriFe (Agregar, Editar y Eliminar recetas).
            </p>
          </div>

          <form id="admin-login-form" onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-600 uppercase tracking-wider block">Correo Electrónico</label>
              <input 
                id="login-email-input"
                type="email" 
                required 
                placeholder="admin@nutrife.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-100 text-sm font-bold text-gray-800 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-gray-600 uppercase tracking-wider block">Contraseña</label>
              <input 
                id="login-password-input"
                type="password" 
                required 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl border-2 border-gray-100 text-sm font-bold text-gray-800 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {loginError && (
              <div id="login-error-alert" className="bg-red-50 text-red-600 p-3 rounded-xl border border-red-100 flex items-start gap-2 text-xs font-bold leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              id="submit-login-btn"
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-3.5 px-4 rounded-xl shadow-md cursor-pointer transition-transform hover:scale-101 text-sm flex items-center justify-center gap-2"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Iniciando...
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  Ingresar al Panel
                </>
              )}
            </button>
          </form>

          {/* Test credentials helper bubble */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 space-y-1 text-center">
            <span className="text-xxs font-black text-amber-700 uppercase tracking-wider block">Credenciales Demo de Prueba</span>
            <span className="text-xs font-bold text-amber-900 block mt-1">
              Usuario: <code className="bg-white px-2 py-0.5 rounded border text-xxs select-all">admin@nutrife.com</code>
            </span>
            <span className="text-xs font-bold text-amber-900 block">
              Clave: <code className="bg-white px-2 py-0.5 rounded border text-xxs select-all">admin123</code>
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN ADMIN CONSOLE SCREEN
  return (
    <div id="admin-main-console" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fadeIn">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border-4 border-orange-100 shadow-xs">
        <div>
          <span className="bg-amber-100 text-amber-800 text-xxs font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            Consola Activa
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mt-2">
            Administración del Recetario
          </h2>
          <p className="text-xs text-gray-500 font-bold mt-1">
            Sesión iniciada como: <span className="text-emerald-600 underline">{adminEmail}</span>. Base de Datos: {isFirebaseConfigured() ? '🔥 Firestore' : '💾 LocalStorage Activo'}.
          </p>
        </div>
        
        {!isFormOpen && (
          <button
            id="add-recipe-btn"
            onClick={() => setIsFormOpen(true)}
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-black px-6 py-3.5 rounded-2xl shadow-md cursor-pointer transition-transform hover:scale-103 text-sm shrink-0"
          >
            <Plus className="w-5 h-5" />
            Nueva Receta
          </button>
        )}
      </div>

      {/* Recipe Creator/Editor Form */}
      {isFormOpen && (
        <div id="recipe-form-container" className="bg-white rounded-3xl border-4 border-emerald-500 shadow-md p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-lg sm:text-xl font-black text-gray-800 flex items-center gap-2">
              <span className="w-3 h-6 bg-emerald-500 rounded-full inline-block"></span>
              {editingRecipeId ? 'Editar Receta Existente' : 'Registrar Nueva Receta'}
            </h3>
            <button
              id="cancel-recipe-form-btn"
              onClick={handleResetForm}
              className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-black hover:bg-gray-100 rounded-xl"
            >
              Cancelar
            </button>
          </div>

          <form id="recipe-editor-form" onSubmit={handleSubmitRecipe} className="space-y-6">
            
            {/* Primary Details Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-600 uppercase tracking-wider block">Nombre de la Receta *</label>
                <input 
                  id="recipe-form-name"
                  type="text" 
                  required 
                  placeholder="Puré de brócoli con sangrecita..."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-gray-600 uppercase tracking-wider block">Categoría de Edad *</label>
                <select 
                  id="recipe-form-age"
                  value={formAge}
                  onChange={(e) => setFormAge(e.target.value as AgeGroupId)}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="6_meses">6 meses</option>
                  <option value="7_8_meses">7–8 meses</option>
                  <option value="9_11_meses">9–11 meses</option>
                  <option value="12_23_meses">12–23 meses (1 año)</option>
                  <option value="2_5_anos">2 a 5 años</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-gray-600 uppercase tracking-wider block">Dificultad *</label>
                <select 
                  id="recipe-form-difficulty"
                  value={formDifficulty}
                  onChange={(e) => setFormDifficulty(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="Fácil">Fácil</option>
                  <option value="Medio">Medio</option>
                  <option value="Difícil">Difícil</option>
                </select>
              </div>
            </div>

            {/* Preparation / Cook times / Portions */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-600 uppercase tracking-wider block">Prep. (minutos)</label>
                <input 
                  id="recipe-form-preptime"
                  type="number" 
                  min="0"
                  value={formPrepTime}
                  onChange={(e) => setFormPrepTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-gray-600 uppercase tracking-wider block">Cocción (minutos)</label>
                <input 
                  id="recipe-form-cooktime"
                  type="number" 
                  min="0"
                  value={formCookTime}
                  onChange={(e) => setFormCookTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-gray-600 uppercase tracking-wider block">Tamaño Porción</label>
                <input 
                  id="recipe-form-portionsize"
                  type="text" 
                  placeholder="2 a 3 cucharadas"
                  value={formPortionSize}
                  onChange={(e) => setFormPortionSize(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-gray-600 uppercase tracking-wider block">Consistencia/Textura</label>
                <input 
                  id="recipe-form-texture"
                  type="text" 
                  placeholder="Puré aplastado sin pieles"
                  value={formTexture}
                  onChange={(e) => setFormTexture(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Iron protection fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-emerald-700 uppercase tracking-wider block flex items-center gap-1">
                  Ingredientes ricos en Hierro (para escudo anemia) *
                </label>
                <input 
                  id="recipe-form-ironingredients"
                  type="text" 
                  required
                  placeholder="Sangrecita de pollo, Hígado de pollo, Bazo..."
                  value={formIronRichIngredients}
                  onChange={(e) => setFormIronRichIngredients(e.target.value)}
                  className="w-full px-4 py-2.5 bg-emerald-50/50 rounded-xl border border-emerald-200 text-sm font-bold text-emerald-950 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-gray-600 uppercase tracking-wider block">Beneficios Nutricionales</label>
                <input 
                  id="recipe-form-benefits"
                  type="text" 
                  placeholder="Excelente para la absorción de hemoglobina y estimulación cognitiva..."
                  value={formNutritionalBenefits}
                  onChange={(e) => setFormNutritionalBenefits(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Ingredients and quantities textareas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-600 uppercase tracking-wider block">
                  Ingredientes detallados * (Escribe uno por línea)
                </label>
                <textarea 
                  id="recipe-form-ingredients"
                  rows={4}
                  required
                  placeholder="1/2 camote amarillo&#10;2 cucharadas de hígado de pollo cocido&#10;1 cucharadita de aceite"
                  value={formIngredients}
                  onChange={(e) => setFormIngredients(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-gray-600 uppercase tracking-wider block">
                  Cantidades para lista de compras (Escribe una por línea)
                </label>
                <textarea 
                  id="recipe-form-quantities"
                  rows={4}
                  placeholder="Camote amarillo: 80g&#10;Hígado cocido: 30g&#10;Aceite vegetal: 5ml"
                  value={formQuantities}
                  onChange={(e) => setFormQuantities(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>
            </div>

            {/* Preparation instructions */}
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-600 uppercase tracking-wider block">
                Preparación paso a paso * (Escribe un paso por línea)
              </label>
              <textarea 
                id="recipe-form-preparation"
                rows={5}
                required
                placeholder="1. Sancocha el camote amarillo pelado hasta tierno.&#10;2. Sancocha el hígado de pollo por 10 minutos.&#10;3. Tritura el camote con el hígado y sirve caliente."
                value={formPreparation}
                onChange={(e) => setFormPreparation(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm font-bold text-gray-800 focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>

            {/* Image / Video / QR URL details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-4">
              
              {/* Image Input/Upload */}
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-600 uppercase tracking-wider block flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5 text-gray-500" />
                  Imagen de la Receta
                </label>
                <div className="flex flex-col gap-2">
                  <input 
                    id="recipe-form-imageurl"
                    type="url" 
                    placeholder="https://images.unsplash.com/..."
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 focus:outline-none focus:border-emerald-500"
                  />
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xxs rounded-lg border cursor-pointer flex items-center gap-1 transition-colors">
                      <Upload className="w-3 h-3" />
                      Subir archivo local
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden" 
                      />
                    </label>
                    {formImageUrl && (
                      <span className="text-xxs text-emerald-600 font-bold flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Cargado
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Video URL */}
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-600 uppercase tracking-wider block flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-orange-500" />
                  ID/Enlace Video de YouTube
                </label>
                <input 
                  id="recipe-form-videourl"
                  type="url" 
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formVideoUrl}
                  onChange={(e) => setFormVideoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* QR URL */}
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-600 uppercase tracking-wider block flex items-center gap-1">
                  <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                  URL para Código QR
                </label>
                <input 
                  id="recipe-form-qrurl"
                  type="text" 
                  placeholder="https://nutrife.app/receta/camote_higado"
                  value={formQrUrl}
                  onChange={(e) => setFormQrUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 focus:outline-none focus:border-emerald-500"
                />
              </div>

            </div>

            {/* Error & Success Messages */}
            {formError && (
              <div id="recipe-form-error" className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 flex items-start gap-2.5 text-xs font-bold leading-relaxed">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {formSuccess && (
              <div id="recipe-form-success" className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-100 flex items-start gap-2.5 text-xs font-bold leading-relaxed animate-pulse">
                <Check className="w-5 h-5 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
              <button
                id="recipe-form-cancel"
                type="button"
                onClick={handleResetForm}
                className="px-5 py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold text-sm rounded-xl"
              >
                Cancelar
              </button>
              <button
                id="recipe-form-submit"
                type="submit"
                disabled={isSubmitting}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-black py-2.5 px-6 rounded-xl shadow-md cursor-pointer transition-transform hover:scale-101 text-sm flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    {editingRecipeId ? 'Guardar Cambios' : 'Publicar Receta'}
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Grid of Existing Recipes with edit/delete triggers */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-gray-800 flex items-center gap-2">
          <span>Recetas Publicadas ({recipes.length})</span>
        </h3>

        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-50 border-b border-emerald-100">
                  <th className="p-4 text-xs font-black text-emerald-800 uppercase tracking-wider">Imagen</th>
                  <th className="p-4 text-xs font-black text-emerald-800 uppercase tracking-wider">Receta</th>
                  <th className="p-4 text-xs font-black text-emerald-800 uppercase tracking-wider">Edad</th>
                  <th className="p-4 text-xs font-black text-emerald-800 uppercase tracking-wider">Ingredientes Clave</th>
                  <th className="p-4 text-xs font-black text-emerald-800 uppercase tracking-wider">Dificultad</th>
                  <th className="p-4 text-xs font-black text-emerald-800 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recipes.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-sm font-bold text-gray-400">
                      No hay recetas disponibles en este momento.
                    </td>
                  </tr>
                ) : (
                  recipes.map((recipe) => (
                    <tr key={recipe.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <img 
                          src={recipe.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=80"}
                          alt={recipe.name}
                          className="w-14 h-14 object-cover rounded-xl border border-gray-100 shadow-xxs"
                          referrerPolicy="no-referrer"
                        />
                      </td>
                      <td className="p-4">
                        <span className="font-black text-sm text-gray-800 block">{recipe.name}</span>
                        {recipe.isCustom && (
                          <span className="inline-block bg-purple-100 text-purple-700 font-extrabold text-3xs px-2 py-0.5 rounded-md mt-1 uppercase">
                            Admin Creado
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="bg-orange-100 text-orange-800 font-extrabold text-xs px-2.5 py-1 rounded-full">
                          {getAgeFriendlyName(recipe.age)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-100 block max-w-xs truncate">
                          {recipe.ironRichIngredients}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-xs font-bold text-gray-700">
                          {recipe.difficulty}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            id={`edit-recipe-action-${recipe.id}`}
                            onClick={() => handleStartEdit(recipe)}
                            className="p-2 text-emerald-600 hover:text-white hover:bg-emerald-500 rounded-lg transition-colors border border-emerald-100 cursor-pointer"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            id={`delete-recipe-action-${recipe.id}`}
                            onClick={() => handleDeleteRecipe(recipe.id, recipe.name)}
                            className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-lg transition-colors border border-red-100 cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
