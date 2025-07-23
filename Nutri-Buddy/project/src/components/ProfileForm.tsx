import React, { useState } from 'react';
import { User, Save, Calculator } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileFormProps {
  userProfile: UserProfile | null;
  onSave: (profile: UserProfile) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ userProfile, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>({
    name: userProfile?.name || '',
    age: userProfile?.age || 25,
    gender: userProfile?.gender || 'male',
    height: userProfile?.height || 170,
    weight: userProfile?.weight || 70,
    targetWeight: userProfile?.targetWeight || 65,
    dietType: userProfile?.dietType || 'vegetarian',
    activityLevel: userProfile?.activityLevel || 'moderately-active',
    dailyCalorieGoal: userProfile?.dailyCalorieGoal || 2000
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' || name === 'gender' || name === 'dietType' || name === 'activityLevel' 
        ? value 
        : Number(value)
    }));
  };

  const calculateBMR = () => {
    const { gender, weight, height, age } = formData;
    let bmr;
    
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    const activityMultipliers = {
      'sedentary': 1.2,
      'lightly-active': 1.375,
      'moderately-active': 1.55,
      'very-active': 1.725
    };

    const tdee = bmr * activityMultipliers[formData.activityLevel];
    return Math.round(tdee);
  };

  const handleCalculateCalories = () => {
    const calculatedCalories = calculateBMR();
    setFormData(prev => ({
      ...prev,
      dailyCalorieGoal: calculatedCalories
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="text-emerald-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-800">Profile Setup</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              min="13"
              max="120"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              min="100"
              max="250"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              min="30"
              max="300"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Weight (kg)</label>
            <input
              type="number"
              name="targetWeight"
              value={formData.targetWeight}
              onChange={handleInputChange}
              min="30"
              max="300"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Diet Type</label>
            <select
              name="dietType"
              value={formData.dietType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="vegetarian">Vegetarian</option>
              <option value="non-vegetarian">Non-Vegetarian</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Activity Level</label>
            <select
              name="activityLevel"
              value={formData.activityLevel}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="sedentary">Sedentary (little/no exercise)</option>
              <option value="lightly-active">Lightly Active (light exercise 1-3 days/week)</option>
              <option value="moderately-active">Moderately Active (moderate exercise 3-5 days/week)</option>
              <option value="very-active">Very Active (hard exercise 6-7 days/week)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Daily Calorie Goal</label>
          <div className="flex gap-2">
            <input
              type="number"
              name="dailyCalorieGoal"
              value={formData.dailyCalorieGoal}
              onChange={handleInputChange}
              min="1000"
              max="5000"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={handleCalculateCalories}
              className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors flex items-center gap-2"
            >
              <Calculator size={16} />
              Calculate
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Click "Calculate" to estimate your daily calorie needs based on your profile
          </p>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            Save Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;