import React, { useState } from 'react';
import { Send, Bot, User, MessageCircle } from 'lucide-react';
import { UserProfile, ChatMessage } from '../types';

interface ChatbotProps {
  userProfile: UserProfile | null;
}

const Chatbot: React.FC<ChatbotProps> = ({ userProfile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI nutrition and fitness assistant. I can help you with meal planning, workout suggestions, and answer any health-related questions you might have. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock AI responses based on message content
    const message = userMessage.toLowerCase();
    
    if (message.includes('weight') && message.includes('lose')) {
      return `Based on your profile, here are some personalized weight loss tips:

1. **Calorie Deficit**: Aim for a moderate deficit of 500-750 calories per day
2. **Protein Intake**: Include protein in every meal to maintain muscle mass
3. **Hydration**: Drink water before meals to help with satiety
4. **Regular Exercise**: Combine cardio with strength training 3-4 times per week
5. **Sleep**: Ensure 7-9 hours of quality sleep for optimal metabolism

Would you like specific meal suggestions or workout routines?`;
    }
    
    if (message.includes('meal') || message.includes('food') || message.includes('eat')) {
      const dietType = userProfile?.dietType || 'vegetarian';
      return `Great question about nutrition! Based on your ${dietType} diet preference, here are some healthy meal ideas:

**Breakfast:**
- Greek yogurt with berries and nuts
- Overnight oats with chia seeds
- Vegetable omelet with whole grain toast

**Lunch:**
- Quinoa salad with mixed vegetables
- Lentil soup with whole grain bread
- Buddha bowl with roasted vegetables

**Dinner:**
- Grilled tofu/chicken with steamed vegetables
- Stir-fry with brown rice
- Baked sweet potato with black beans

Remember to include a variety of colors in your meals for optimal nutrition!`;
    }
    
    if (message.includes('exercise') || message.includes('workout')) {
      return `Here's a balanced workout plan for your fitness level:

**Beginner (3 days/week):**
- 30 minutes brisk walking
- 2 sets of bodyweight exercises (squats, push-ups, lunges)
- 10 minutes stretching

**Intermediate (4 days/week):**
- 45 minutes cardio (alternating between running and cycling)
- 3 sets of strength training
- Core exercises and flexibility work

**Advanced (5-6 days/week):**
- High-intensity interval training (HIIT)
- Weight training with progressive overload
- Active recovery with yoga or swimming

Always listen to your body and rest when needed!`;
    }
    
    if (message.includes('water') || message.includes('hydration')) {
      return `Excellent question about hydration! Here's why water is crucial for your health:

**Daily Goals:**
- Aim for 8-10 glasses of water per day
- Increase intake during exercise or hot weather
- Monitor urine color (pale yellow is ideal)

**Benefits:**
- Boosts metabolism and aids weight loss
- Improves skin health and appearance
- Enhances cognitive function and mood
- Helps with digestion and nutrient absorption

**Tips:**
- Start your day with a glass of water
- Set reminders every 2 hours
- Add lemon or cucumber for flavor
- Eat water-rich foods like fruits and vegetables`;
    }
    
    // Default response
    return `Thank you for your question! I'm here to help with nutrition and fitness advice. Some topics I can assist with include:

- Meal planning and healthy recipes
- Weight management strategies
- Exercise routines and fitness tips
- Hydration and nutrition guidance
- Healthy lifestyle habits

Feel free to ask me anything specific about your health and fitness journey!`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    try {
      const response = await simulateAIResponse(inputMessage);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Bot className="text-emerald-600" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">AI Nutrition Assistant</h2>
            <p className="text-sm text-gray-600">Your personal health and fitness advisor</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.type === 'assistant' && (
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Bot className="text-emerald-600" size={20} />
              </div>
            )}
            
            <div
              className={`max-w-[70%] p-4 rounded-lg ${
                message.type === 'user'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              <div className={`text-xs mt-2 ${
                message.type === 'user' ? 'text-emerald-200' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
            
            {message.type === 'user' && (
              <div className="p-2 bg-gray-100 rounded-lg">
                <User className="text-gray-600" size={20} />
              </div>
            )}
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Bot className="text-emerald-600" size={20} />
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-200">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about nutrition, workouts, or healthy habits..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
        
        {/* Quick Questions */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {[
              'How can I lose weight?',
              'Suggest healthy meals',
              'Create a workout plan',
              'Water intake tips'
            ].map((question) => (
              <button
                key={question}
                onClick={() => setInputMessage(question)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;