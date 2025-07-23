import React from 'react';
import { Heart, Activity } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
              <Heart className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">NutriBuddy</h1>
              <p className="text-sm text-gray-600">Your AI Fitness & Diet Companion</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-emerald-600">
            <Activity size={20} />
            <span className="font-medium">Stay Healthy</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;