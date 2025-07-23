import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, Users, Leaf } from 'lucide-react';
import { UserProfile, Recipe } from '../types';

interface RecipesProps {
  userProfile: UserProfile | null;
}

const Recipes: React.FC<RecipesProps> = ({ userProfile }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    generateRecipes();
  }, [userProfile]);

  const generateRecipes = async () => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockRecipes: Recipe[] = [
      {
        id: '1',
        name: 'Quinoa Buddha Bowl',
        calories: 420,
        ingredients: [
          '1 cup cooked quinoa',
          '1/2 cup chickpeas',
          '1 cup mixed greens',
          '1/2 avocado',
          '1/4 cup shredded carrots',
          'Tahini dressing'
        ],
        instructions: [
          'Cook quinoa according to package instructions',
          'Roast chickpeas with olive oil and spices',
          'Prepare vegetables and arrange in bowl',
          'Drizzle with tahini dressing',
          'Serve immediately'
        ],
        prepTime: 25,
        category: 'lunch'
      },
      {
        id: '2',
        name: 'Greek Yogurt Berry Parfait',
        calories: 280,
        ingredients: [
          '1 cup Greek yogurt',
          '1/2 cup mixed berries',
          '2 tbsp granola',
          '1 tbsp honey',
          '1 tbsp chia seeds'
        ],
        instructions: [
          'Layer yogurt in a glass',
          'Add berries and granola',
          'Drizzle with honey',
          'Sprinkle chia seeds on top',
          'Serve chilled'
        ],
        prepTime: 5,
        category: 'breakfast'
      },
      {
        id: '3',
        name: 'Lemon Herb Baked Salmon',
        calories: 340,
        ingredients: [
          '6 oz salmon fillet',
          '1 lemon (juiced)',
          '2 tbsp olive oil',
          'Fresh herbs (dill, parsley)',
          'Salt and pepper',
          'Steamed broccoli'
        ],
        instructions: [
          'Preheat oven to 400°F',
          'Season salmon with herbs and lemon',
          'Bake for 12-15 minutes',
          'Steam broccoli until tender',
          'Serve with lemon wedges'
        ],
        prepTime: 20,
        category: 'dinner'
      },
      {
        id: '4',
        name: 'Energy Ball Bites',
        calories: 150,
        ingredients: [
          '1 cup dates (pitted)',
          '1/2 cup almonds',
          '2 tbsp cocoa powder',
          '1 tbsp coconut oil',
          'Shredded coconut for rolling'
        ],
        instructions: [
          'Blend dates and almonds in food processor',
          'Add cocoa powder and coconut oil',
          'Form into small balls',
          'Roll in shredded coconut',
          'Refrigerate for 30 minutes'
        ],
        prepTime: 15,
        category: 'snack'
      }
    ];

    // Filter recipes based on diet type
    const filteredRecipes = userProfile?.dietType === 'vegetarian' 
      ? mockRecipes.filter(recipe => recipe.name !== 'Lemon Herb Baked Salmon')
      : mockRecipes;

    setRecipes(filteredRecipes);
    setLoading(false);
  };

  const categories = [
    { id: 'all', name: 'All Recipes' },
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'lunch', name: 'Lunch' },
    { id: 'dinner', name: 'Dinner' },
    { id: 'snack', name: 'Snacks' }
  ];

  const filteredRecipes = selectedCategory === 'all' 
    ? recipes 
    : recipes.filter(recipe => recipe.category === selectedCategory);

  if (!userProfile) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <ChefHat className="mx-auto mb-4 text-gray-400" size={48} />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Recipe Recommendations</h2>
        <p className="text-gray-600">
          Please complete your profile to get personalized recipe recommendations
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <ChefHat className="text-emerald-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-800">Healthy Recipes</h2>
        </div>
        <p className="text-gray-600">
          Personalized recipe suggestions based on your {userProfile.dietType} diet preference
        </p>
      </div>

      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === category.id
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Grid */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Generating personalized recipes...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRecipes.map(recipe => (
            <div key={recipe.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{recipe.name}</h3>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <Leaf size={16} />
                    <span className="text-sm font-medium capitalize">{recipe.category}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span className="text-sm">{recipe.prepTime} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={16} />
                    <span className="text-sm">{recipe.calories} cal</span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Ingredients:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Instructions:</h4>
                  <ol className="text-sm text-gray-600 space-y-1">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-2">
                        <span className="font-medium text-emerald-600">{index + 1}.</span>
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredRecipes.length === 0 && !loading && (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <ChefHat className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No recipes found</h3>
          <p className="text-gray-600">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
};

export default Recipes;