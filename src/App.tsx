import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Clock, 
  Video, 
  Search, 
  Info, 
  Lock, 
  Baby, 
  ShieldAlert, 
  Sparkles, 
  Check, 
  Plus, 
  AlertCircle,
  HelpCircle,
  RotateCcw
} from 'lucide-react';

import { Recipe, AgeGroupId } from './types';
import { 
  fetchAllRecipes, 
  getFavorites, 
  toggleFavoriteInLocal, 
  subscribeToAuth, 
  signOutAdmin,
  initializeLocalDb
} from './lib/firebase';

import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import AgeRecommendations from './components/AgeRecommendations';
import RecommendationsView from './components/RecommendationsView';
import VideosView from './components/VideosView';
import SearchView from './components/SearchView';
import AboutView from './components/AboutView';
import AdminPanel from './components/AdminPanel';
import RecipeDetail from './components/RecipeDetail';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal State
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Search parameters for age redirects
  const [searchAgeFilter, setSearchAgeFilter] = useState<string>('todos');

  // Initialize and fetch all data
  const loadData = async () => {
    try {
      setIsLoading(true);
      initializeLocalDb();
      const allRecipes = await fetchAllRecipes();
      setRecipes(allRecipes);
      setFavorites(getFavorites());
    } catch (error) {
      console.error("Failed to load NutriFe recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Subscribe to Auth status
    const unsubscribe = subscribeToAuth((loggedIn, email) => {
      setIsAdmin(loggedIn);
      setAdminEmail(email);
    });

    return () => unsubscribe();
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    if (window.confirm("¿Seguro que deseas cerrar la sesión administrativa de NutriFe?")) {
      await signOutAdmin();
      setIsAdmin(false);
      setAdminEmail(undefined);
      setActiveTab('home');
    }
  };

  // Toggle favorite trigger
  const handleToggleFavorite = (recipeId: string) => {
    const updatedFavs = toggleFavoriteInLocal(recipeId);
    setFavorites(updatedFavs);
  };

  // Navigate directly to recipes for an age group
  const handleSelectAgeGroup = (ageId: AgeGroupId) => {
    setSearchAgeFilter(ageId);
    setActiveTab('search');
  };

  // Navigate to standard recipes tab but reset filter
  const handleStartButton = () => {
    setSearchAgeFilter('todos');
    setActiveTab('recipes_by_age');
  };

  if (isLoading) {
    return (
      <div id="app-loading-screen" className="fixed inset-0 bg-white flex flex-col justify-center items-center z-50 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-emerald-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Baby className="w-6 h-6 text-orange-500 animate-pulse" />
          </div>
        </div>
        <div className="text-center">
          <span className="font-black text-2xl tracking-tight text-emerald-600">
            Nutri<span className="text-orange-500">Fe</span>
          </span>
          <p className="text-xxs text-gray-400 font-bold uppercase tracking-widest mt-1">
            Alimentación Complementaria Segura
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Dynamic Top Banner for Anemia Prevention */}
      <div id="top-anemia-banner" className="bg-orange-500 text-white text-xs py-2 px-4 text-center font-black tracking-wide shrink-0 shadow-sm flex items-center justify-center gap-1.5">
        <span className="bg-white text-orange-600 text-3xs font-extrabold px-2 py-0.5 rounded-full uppercase">Alerta</span>
        <span>Previene la anemia infantil hoy. Incorpora 2 cucharadas de hierro animal en cada papilla de tu bebé.</span>
      </div>

      {/* Main Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // Reset search filter if clicking tab directly
          if (tab === 'search') {
            setSearchAgeFilter('todos');
          }
        }}
        isAdmin={isAdmin}
        adminEmail={adminEmail}
        onLogout={handleLogout}
      />

      {/* Main Page Content Body */}
      <main className="flex-1 pb-16">
        {activeTab === 'home' && (
          <HomeView 
            onStart={handleStartButton}
            onSelectAge={handleSelectAgeGroup}
          />
        )}

        {activeTab === 'recipes_by_age' && (
          <AgeRecommendations 
            onSelectAgeCategory={handleSelectAgeGroup}
          />
        )}

        {activeTab === 'recommendations' && (
          <RecommendationsView />
        )}

        {activeTab === 'videos' && (
          <VideosView 
            recipes={recipes}
            onSelectRecipe={(recipe) => setSelectedRecipe(recipe)}
          />
        )}

        {activeTab === 'search' && (
          <SearchView 
            recipes={recipes}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectRecipe={(recipe) => setSelectedRecipe(recipe)}
            initialAgeFilter={searchAgeFilter}
          />
        )}

        {activeTab === 'favorites' && (
          <SearchView 
            recipes={recipes}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectRecipe={(recipe) => setSelectedRecipe(recipe)}
            initialAgeFilter="todos"
            isFavoritesOnlyView={true}
          />
        )}

        {activeTab === 'about' && (
          <AboutView />
        )}

        {activeTab === 'admin' && (
          <AdminPanel 
            recipes={recipes}
            onRefreshRecipes={loadData}
            isAdmin={isAdmin}
            adminEmail={adminEmail}
            onLoginSuccess={(email) => {
              setIsAdmin(true);
              setAdminEmail(email);
              alert("¡Sesión iniciada con éxito! Bienvenido a la consola de administración de NutriFe.");
            }}
          />
        )}
      </main>

      {/* Persistent Footer */}
      <footer className="bg-white border-t-2 border-gray-100 py-8 text-center shrink-0">
        <div className="max-w-7xl mx-auto px-4 space-y-3">
          <div className="text-gray-400 text-xxs font-black uppercase tracking-widest">
            NutriFe • Alimentación Complementaria Saludable
          </div>
          <p className="text-xs text-gray-500 font-bold max-w-md mx-auto">
            Hecho con amor para los niños de 6 meses a 5 años de edad. Juntos podemos erradicar la anemia infantil.
          </p>
          <div className="text-3xs text-gray-400">
            © 2026 NutriFe. Todos los derechos reservados.
          </div>
        </div>
      </footer>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <RecipeDetail 
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          isFavorite={favorites.includes(selectedRecipe.id)}
          onToggleFavorite={() => handleToggleFavorite(selectedRecipe.id)}
        />
      )}

    </div>
  );
}
