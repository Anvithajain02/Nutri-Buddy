import React, { useState, useEffect } from 'react';
import { Activity, User, MessageCircle, Utensils, Droplet, Target } from 'lucide-react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import ProfileForm from './components/ProfileForm';
import FoodUpload from './components/FoodUpload';
import WaterTracker from './components/WaterTracker';
import Recipes from './components/Recipes';
import Chatbot from './components/Chatbot';
import { UserProfile, FoodEntry, WaterIntake } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const [waterIntake, setWaterIntake] = useState<WaterIntake>({
    glasses: 0,
    goal: 8,
    lastUpdate: new Date().toDateString()
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const savedFoodEntries = localStorage.getItem('foodEntries');
    const savedWaterIntake = localStorage.getItem('waterIntake');

    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile));
    }
    if (savedFoodEntries) {
      setFoodEntries(JSON.parse(savedFoodEntries));
    }
    if (savedWaterIntake) {
      setWaterIntake(JSON.parse(savedWaterIntake));
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('userProfile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('foodEntries', JSON.stringify(foodEntries));
  }, [foodEntries]);

  useEffect(() => {
    localStorage.setItem('waterIntake', JSON.stringify(waterIntake));
  }, [waterIntake]);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'food', label: 'Food Log', icon: Utensils },
    { id: 'water', label: 'Water', icon: Droplet },
    { id: 'recipes', label: 'Recipes', icon: Target },
    { id: 'chat', label: 'AI Chat', icon: MessageCircle }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            userProfile={userProfile} 
            foodEntries={foodEntries} 
            waterIntake={waterIntake}
          />
        );
      case 'profile':
        return (
          <ProfileForm 
            userProfile={userProfile} 
            onSave={setUserProfile}
          />
        );
      case 'food':
        return (
          <FoodUpload 
            userProfile={userProfile}
            foodEntries={foodEntries}
            onAddFood={setFoodEntries}
          />
        );
      case 'water':
        return (
          <WaterTracker 
            waterIntake={waterIntake}
            onUpdateWater={setWaterIntake}
          />
        );
      case 'recipes':
        return <Recipes userProfile={userProfile} />;
      case 'chat':
        return <Chatbot userProfile={userProfile} />;
      default:
        return <Dashboard userProfile={userProfile} foodEntries={foodEntries} waterIntake={waterIntake} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:w-64 bg-white rounded-xl shadow-sm p-6">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;