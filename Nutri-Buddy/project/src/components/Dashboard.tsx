import React from 'react';
import { Calendar, Target, Droplet, Utensils, TrendingUp, AlertCircle } from 'lucide-react';
import { UserProfile, FoodEntry, WaterIntake } from '../types';

interface DashboardProps {
  userProfile: UserProfile | null;
  foodEntries: FoodEntry[];
  waterIntake: WaterIntake;
}

const Dashboard: React.FC<DashboardProps> = ({ userProfile, foodEntries, waterIntake }) => {
  const today = new Date().toDateString();
  const todaysFoodEntries = foodEntries.filter(entry => entry.date === today);
  const todaysCalories = todaysFoodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const dailyCalorieGoal = userProfile?.dailyCalorieGoal || 2000;
  const caloriesRemaining = dailyCalorieGoal - todaysCalories;
  const waterProgress = (waterIntake.glasses / waterIntake.goal) * 100;

  const stats = [
    {
      title: 'Today\'s Calories',
      value: todaysCalories,
      goal: dailyCalorieGoal,
      icon: Utensils,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      title: 'Water Intake',
      value: waterIntake.glasses,
      goal: waterIntake.goal,
      icon: Droplet,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Meals Logged',
      value: todaysFoodEntries.length,
      goal: 4,
      icon: Target,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    }
  ];

  if (!userProfile) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Target className="mx-auto mb-4 text-gray-400" size={48} />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to NutriBuddy!</h2>
        <p className="text-gray-600 mb-6">
          Start your fitness journey by setting up your profile first.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertCircle size={20} />
            <span className="font-medium">Please complete your profile to get started</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="text-emerald-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {userProfile.name}!
          </h2>
        </div>
        <p className="text-gray-600">
          Here's your daily progress summary for {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const progress = (stat.value / stat.goal) * 100;
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={stat.color} size={24} />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                  <div className="text-sm text-gray-500">of {stat.goal}</div>
                </div>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{stat.title}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      progress > 100 ? 'bg-red-500' : progress > 80 ? 'bg-yellow-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Calorie Alert */}
      {caloriesRemaining < 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle size={20} />
            <span className="font-medium">
              Warning: You've exceeded your daily calorie goal by {Math.abs(caloriesRemaining)} calories!
            </span>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
            <Utensils className="text-emerald-600 mb-2" size={24} />
            <span className="text-sm font-medium text-emerald-700">Log Food</span>
          </button>
          <button className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Droplet className="text-blue-600 mb-2" size={24} />
            <span className="text-sm font-medium text-blue-700">Add Water</span>
          </button>
          <button className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <Target className="text-purple-600 mb-2" size={24} />
            <span className="text-sm font-medium text-purple-700">View Recipes</span>
          </button>
          <button className="p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
            <TrendingUp className="text-indigo-600 mb-2" size={24} />
            <span className="text-sm font-medium text-indigo-700">AI Tips</span>
          </button>
        </div>
      </div>

      {/* Recent Meals */}
      {todaysFoodEntries.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Meals</h3>
          <div className="space-y-3">
            {todaysFoodEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-800">{entry.foodName}</div>
                  <div className="text-sm text-gray-600 capitalize">{entry.mealType}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-800">{entry.calories} cal</div>
                  <div className="text-xs text-gray-500">
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;