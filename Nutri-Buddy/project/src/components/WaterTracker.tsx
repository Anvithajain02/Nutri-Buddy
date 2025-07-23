import React, { useState, useEffect } from 'react';
import { Droplet, Plus, Minus, Target, Clock } from 'lucide-react';
import { WaterIntake } from '../types';

interface WaterTrackerProps {
  waterIntake: WaterIntake;
  onUpdateWater: (intake: WaterIntake) => void;
}

const WaterTracker: React.FC<WaterTrackerProps> = ({ waterIntake, onUpdateWater }) => {
  const [lastReminderTime, setLastReminderTime] = useState<Date | null>(null);
  const [showReminder, setShowReminder] = useState(false);

  // Check if it's a new day and reset water intake
  useEffect(() => {
    const today = new Date().toDateString();
    if (waterIntake.lastUpdate !== today) {
      onUpdateWater({
        ...waterIntake,
        glasses: 0,
        lastUpdate: today
      });
    }
  }, [waterIntake, onUpdateWater]);

  // Water reminder every 2 hours
  useEffect(() => {
    const checkReminder = () => {
      const now = new Date();
      const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
      
      if (!lastReminderTime || lastReminderTime < twoHoursAgo) {
        if (waterIntake.glasses < waterIntake.goal) {
          setShowReminder(true);
          setLastReminderTime(now);
        }
      }
    };

    const interval = setInterval(checkReminder, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [lastReminderTime, waterIntake]);

  const addWater = () => {
    if (waterIntake.glasses < 15) { // Max 15 glasses per day
      onUpdateWater({
        ...waterIntake,
        glasses: waterIntake.glasses + 1
      });
    }
  };

  const removeWater = () => {
    if (waterIntake.glasses > 0) {
      onUpdateWater({
        ...waterIntake,
        glasses: waterIntake.glasses - 1
      });
    }
  };

  const setGoal = (newGoal: number) => {
    onUpdateWater({
      ...waterIntake,
      goal: newGoal
    });
  };

  const progress = (waterIntake.glasses / waterIntake.goal) * 100;
  const isGoalReached = waterIntake.glasses >= waterIntake.goal;

  return (
    <div className="space-y-6">
      {/* Water Reminder */}
      {showReminder && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Droplet className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800">Time to Hydrate!</h3>
                <p className="text-sm text-blue-700">It's been 2 hours since your last water reminder</p>
              </div>
            </div>
            <button
              onClick={() => setShowReminder(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Water Progress */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <Droplet className="text-blue-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">Water Intake</h2>
        </div>

        <div className="text-center mb-6">
          <div className="text-6xl font-bold text-blue-600 mb-2">{waterIntake.glasses}</div>
          <div className="text-lg text-gray-600">glasses of {waterIntake.goal} today</div>
          
          {isGoalReached && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-green-800">
                <Target size={20} />
                <span className="font-medium">Goal achieved! Great job staying hydrated!</span>
              </div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={removeWater}
            disabled={waterIntake.glasses === 0}
            className="p-3 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus size={20} />
          </button>
          
          <button
            onClick={addWater}
            disabled={waterIntake.glasses >= 15}
            className="p-3 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Goal Setting */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Daily Goal</h3>
          <div className="flex gap-2 justify-center">
            {[6, 8, 10, 12].map(goal => (
              <button
                key={goal}
                onClick={() => setGoal(goal)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  waterIntake.goal === goal
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {goal} glasses
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Water Benefits */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Benefits of Staying Hydrated</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Droplet className="text-blue-600" size={16} />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Boosts Energy</h4>
              <p className="text-sm text-gray-600">Proper hydration helps maintain energy levels throughout the day</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="text-blue-600" size={16} />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Improves Focus</h4>
              <p className="text-sm text-gray-600">Adequate water intake enhances brain function and concentration</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="text-blue-600" size={16} />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Aids Digestion</h4>
              <p className="text-sm text-gray-600">Water helps break down food and absorb nutrients efficiently</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Droplet className="text-blue-600" size={16} />
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Healthy Skin</h4>
              <p className="text-sm text-gray-600">Proper hydration keeps your skin moisturized and glowing</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterTracker;