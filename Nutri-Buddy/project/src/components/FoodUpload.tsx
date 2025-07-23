import React, { useState } from 'react';
import { Upload, Camera, Plus, Trash2, AlertCircle } from 'lucide-react';
import { UserProfile, FoodEntry } from '../types';

interface FoodUploadProps {
  userProfile: UserProfile | null;
  foodEntries: FoodEntry[];
  onAddFood: (entries: FoodEntry[]) => void;
}

const FoodUpload: React.FC<FoodUploadProps> = ({ userProfile, foodEntries, onAddFood }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [manualEntry, setManualEntry] = useState({
    foodName: '',
    calories: '',
    mealType: 'breakfast' as const
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const simulateAIAnalysis = async (file: File): Promise<{ foodName: string; calories: number }> => {
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock food recognition based on file name or random selection
    const mockFoods = [
      { name: 'Grilled Chicken Breast', calories: 231 },
      { name: 'Caesar Salad', calories: 470 },
      { name: 'Banana', calories: 105 },
      { name: 'Apple', calories: 95 },
      { name: 'Rice Bowl', calories: 216 },
      { name: 'Pasta', calories: 220 },
      { name: 'Sandwich', calories: 300 },
      { name: 'Pizza Slice', calories: 285 }
    ];
    
    const randomFood = mockFoods[Math.floor(Math.random() * mockFoods.length)];
    return randomFood;
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    try {
      const result = await simulateAIAnalysis(selectedFile);
      
      const newEntry: FoodEntry = {
        id: Date.now().toString(),
        foodName: result.name,
        calories: result.calories,
        mealType: manualEntry.mealType,
        date: new Date().toDateString(),
        timestamp: new Date(),
        imageUrl: URL.createObjectURL(selectedFile)
      };

      onAddFood([...foodEntries, newEntry]);
      setSelectedFile(null);
      setManualEntry({ foodName: '', calories: '', mealType: 'breakfast' });
    } catch (error) {
      console.error('Error analyzing food:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleManualAdd = () => {
    if (!manualEntry.foodName || !manualEntry.calories) return;

    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      foodName: manualEntry.foodName,
      calories: Number(manualEntry.calories),
      mealType: manualEntry.mealType,
      date: new Date().toDateString(),
      timestamp: new Date()
    };

    onAddFood([...foodEntries, newEntry]);
    setManualEntry({ foodName: '', calories: '', mealType: 'breakfast' });
  };

  const handleDeleteEntry = (id: string) => {
    onAddFood(foodEntries.filter(entry => entry.id !== id));
  };

  const today = new Date().toDateString();
  const todaysFoodEntries = foodEntries.filter(entry => entry.date === today);
  const todaysCalories = todaysFoodEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const dailyCalorieGoal = userProfile?.dailyCalorieGoal || 2000;
  const caloriesRemaining = dailyCalorieGoal - todaysCalories;

  return (
    <div className="space-y-6">
      {/* Calorie Summary */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Daily Calorie Tracker</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{todaysCalories}</div>
            <div className="text-sm text-blue-700">Consumed</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600">{dailyCalorieGoal}</div>
            <div className="text-sm text-gray-700">Goal</div>
          </div>
          <div className={`text-center p-4 rounded-lg ${caloriesRemaining >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className={`text-2xl font-bold ${caloriesRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(caloriesRemaining)}
            </div>
            <div className={`text-sm ${caloriesRemaining >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {caloriesRemaining >= 0 ? 'Remaining' : 'Over Goal'}
            </div>
          </div>
        </div>
        
        {caloriesRemaining < 0 && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle size={20} />
              <span className="font-medium">You've exceeded your daily calorie goal!</span>
            </div>
          </div>
        )}
      </div>

      {/* Food Upload */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Add Food Entry</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Upload */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Upload Food Image</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {selectedFile ? (
                <div className="space-y-4">
                  <img 
                    src={URL.createObjectURL(selectedFile)} 
                    alt="Food preview" 
                    className="mx-auto max-h-48 rounded-lg"
                  />
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{selectedFile.name}</p>
                    <div className="flex gap-2 justify-center">
                      <select
                        value={manualEntry.mealType}
                        onChange={(e) => setManualEntry(prev => ({ ...prev, mealType: e.target.value as any }))}
                        className="px-3 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                      </select>
                      <button
                        onClick={handleImageUpload}
                        disabled={isAnalyzing}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                      >
                        {isAnalyzing ? 'Analyzing...' : 'Analyze Food'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <Camera className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-600 mb-4">Upload a food image for AI analysis</p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer">
                    <Upload size={16} />
                    Choose Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Manual Entry */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Manual Entry</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Food Name</label>
                <input
                  type="text"
                  value={manualEntry.foodName}
                  onChange={(e) => setManualEntry(prev => ({ ...prev, foodName: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., Grilled Chicken Breast"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calories</label>
                <input
                  type="number"
                  value={manualEntry.calories}
                  onChange={(e) => setManualEntry(prev => ({ ...prev, calories: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="e.g., 231"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
                <select
                  value={manualEntry.mealType}
                  onChange={(e) => setManualEntry(prev => ({ ...prev, mealType: e.target.value as any }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
              
              <button
                onClick={handleManualAdd}
                disabled={!manualEntry.foodName || !manualEntry.calories}
                className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Add Food Entry
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Food Entries */}
      {todaysFoodEntries.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Food Log</h2>
          <div className="space-y-3">
            {todaysFoodEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  {entry.imageUrl && (
                    <img 
                      src={entry.imageUrl} 
                      alt={entry.foodName}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <div className="font-semibold text-gray-800">{entry.foodName}</div>
                    <div className="text-sm text-gray-600 capitalize">{entry.mealType} • {entry.calories} calories</div>
                    <div className="text-xs text-gray-500">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodUpload;