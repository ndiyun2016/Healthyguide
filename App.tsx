import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { AppSettings, Question, ViewState, UserResponse, AssessmentResult, Article } from './types';
import { DEFAULT_SETTINGS, INITIAL_QUESTIONS, MOCK_ARTICLES } from './constants';
import { generateHealthReport } from './services/geminiService';
import { 
  Play, 
  ChevronRight, 
  Check, 
  RefreshCcw, 
  Activity, 
  Utensils, 
  Moon, 
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Edit2,
  Save,
  BarChart2,
  Palette
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

// --- Sub-components for Screens ---

// 1. Welcome Screen
const WelcomeScreen: React.FC<{ 
  settings: AppSettings; 
  onStart: () => void; 
}> = ({ settings, onStart }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900" style={{ color: settings.primaryColor }}>
        {settings.welcomeTitle}
      </h1>
      <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
        {settings.welcomeSubtitle}
      </p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mt-8">
      {[
        { icon: Utensils, title: "Diet Analysis", desc: "Get insights on your nutrition habits." },
        { icon: Activity, title: "Activity Tracking", desc: "Evaluate your movement & exercise." },
        { icon: Moon, title: "Lifestyle Advice", desc: "Tips for sleep and stress management." },
      ].map((feature, idx) => (
        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <div className="p-3 rounded-full bg-gray-50 mb-4 text-gray-700">
            <feature.icon size={28} style={{ color: settings.primaryColor }} />
          </div>
          <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
          <p className="text-gray-500 text-sm">{feature.desc}</p>
        </div>
      ))}
    </div>

    <button
      onClick={onStart}
      className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 shadow-lg hover:shadow-xl mt-12"
      style={{ backgroundColor: settings.primaryColor }}
    >
      <span>Start Assessment</span>
      <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
    </button>
  </div>
);

// 2. Assessment Screen
const AssessmentScreen: React.FC<{
  questions: Question[];
  settings: AppSettings;
  onComplete: (answers: UserResponse[]) => void;
  onCancel: () => void;
}> = ({ questions, settings, onComplete, onCancel }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserResponse[]>([]);
  const currentQuestion = questions[currentIndex];

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(a => a.questionId === currentQuestion.id);
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex] = { questionId: currentQuestion.id, answer: value };
    } else {
      newAnswers.push({ questionId: currentQuestion.id, answer: value });
    }
    
    setAnswers(newAnswers);

    // Auto advance after short delay for better UX
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        onComplete(newAnswers);
      }
    }, 250);
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div 
            className="h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%`, backgroundColor: settings.primaryColor }}
          ></div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 min-h-[400px] flex flex-col justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        <span className={`text-xs font-bold uppercase tracking-wider mb-4 inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-600 w-fit`}>
          {currentQuestion.category}
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 leading-snug">
          {currentQuestion.text}
        </h2>

        <div className="space-y-4">
          {currentQuestion.options?.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleAnswer(opt.value)}
              className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-all group flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ 
                borderColor: answers.find(a => a.questionId === currentQuestion.id)?.answer === opt.value ? settings.primaryColor : undefined,
                backgroundColor: answers.find(a => a.questionId === currentQuestion.id)?.answer === opt.value ? `${settings.primaryColor}10` : undefined // 10% opacity hex
               }}
            >
              <span className="font-medium text-gray-700 text-lg group-hover:text-gray-900">{opt.label}</span>
              {answers.find(a => a.questionId === currentQuestion.id)?.answer === opt.value && (
                <Check size={20} style={{ color: settings.primaryColor }} />
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-6 flex justify-between">
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2">Cancel</button>
        {currentIndex > 0 && (
          <button onClick={() => setCurrentIndex(currentIndex - 1)} className="text-gray-600 font-medium px-4 py-2 hover:bg-gray-100 rounded-lg">Back</button>
        )}
      </div>
    </div>
  );
};

// 3. Results Screen
const ResultsScreen: React.FC<{
  result: AssessmentResult | null;
  loading: boolean;
  settings: AppSettings;
  onRetake: () => void;
}> = ({ result, loading, settings, onRetake }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 mb-4" style={{ borderColor: settings.primaryColor }}></div>
        <h2 className="text-xl font-semibold text-gray-700">Analyzing your lifestyle...</h2>
        <p className="text-gray-500 mt-2">Consulting our AI health engine</p>
      </div>
    );
  }

  if (!result) return <div>Error generating results.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 md:p-10 text-center bg-gradient-to-br from-white to-gray-50">
          <h2 className="text-3xl font-bold mb-2">Your Health Score</h2>
          <div className="relative inline-flex items-center justify-center w-40 h-40 my-6">
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-200" />
               <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                 strokeDasharray={440} 
                 strokeDashoffset={440 - (440 * result.score) / 100} 
                 className="transition-all duration-1000 ease-out"
                 style={{ color: result.score > 80 ? '#10B981' : result.score > 50 ? '#F59E0B' : '#EF4444' }}
               />
             </svg>
             <span className="absolute text-4xl font-extrabold text-gray-900">{result.score}</span>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed italic">
            "{result.summary}"
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {result.tips.map((tip, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider 
                ${tip.category === 'diet' ? 'bg-green-100 text-green-800' : 
                  tip.category === 'activity' ? 'bg-blue-100 text-blue-800' : 
                  'bg-purple-100 text-purple-800'}`}>
                {tip.category}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{tip.title}</h3>
            <p className="text-gray-600 leading-relaxed">{tip.description}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={onRetake}
          className="flex items-center px-6 py-3 rounded-full font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
          style={{ backgroundColor: settings.secondaryColor }}
        >
          <RefreshCcw className="mr-2 w-5 h-5" />
          Retake Assessment
        </button>
      </div>
    </div>
  );
};

// 4. Articles / Library Screen
const ArticlesScreen: React.FC<{ articles: Article[], settings: AppSettings }> = ({ articles, settings }) => (
  <div className="max-w-4xl mx-auto">
    <h2 className="text-3xl font-bold mb-8">Health Tips Library</h2>
    <div className="grid md:grid-cols-2 gap-8">
      {articles.map(article => (
        <div key={article.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-md transition-all">
          <div className="h-48 overflow-hidden bg-gray-200 relative">
             <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
             <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold text-gray-800 backdrop-blur-sm">
                {article.date}
             </div>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors" style={{ color: `group-hover:${settings.primaryColor}` }}>{article.title}</h3>
            <p className="text-gray-600 line-clamp-2">{article.summary}</p>
            <div className="mt-4 flex items-center text-sm font-semibold text-blue-600" style={{ color: settings.primaryColor }}>
              Read Article <ChevronRight size={16} className="ml-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// 5. Admin Dashboard
const AdminDashboard: React.FC<{
  settings: AppSettings;
  updateSettings: (s: AppSettings) => void;
  questions: Question[];
  updateQuestions: (q: Question[]) => void;
}> = ({ settings, updateSettings, questions, updateQuestions }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'theme'>('overview');
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);

  const mockStats = [
    { name: 'Completed', value: 120 },
    { name: 'Dropped Off', value: 35 },
  ];
  const COLORS = ['#10B981', '#EF4444'];

  const handleDeleteQuestion = (id: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      updateQuestions(questions.filter(q => q.id !== id));
    }
  };

  const handleUpdateQuestionText = (id: string, text: string) => {
    updateQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-24">
            <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider mb-4 px-2">Menu</h3>
            <nav className="space-y-1">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart2 },
                { id: 'questions', label: 'Questions', icon: Edit2 },
                { id: 'theme', label: 'Theme & Branding', icon: Palette },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id 
                      ? 'bg-gray-100 text-gray-900' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon size={18} className="mr-3" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-[500px]">
          
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Total Assessments</h4>
                  <div className="text-3xl font-bold">155</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Avg Health Score</h4>
                  <div className="text-3xl font-bold text-emerald-600">72</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Active Questions</h4>
                  <div className="text-3xl font-bold text-blue-600">{questions.length}</div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-80">
                <h4 className="text-lg font-bold mb-4">Completion Rate</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mockStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {mockStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Manage Questions</h2>
                <button className="flex items-center px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800">
                  <Plus size={16} className="mr-2" /> Add Question
                </button>
              </div>
              <div className="space-y-4">
                {questions.map((q, idx) => (
                  <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all hover:border-gray-400">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                         <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">Q{idx + 1}</span>
                         <span className="text-xs uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">{q.category}</span>
                      </div>
                      <div className="flex space-x-2">
                         <button onClick={() => setEditingQuestion(editingQuestion === q.id ? null : q.id)} className="p-2 text-gray-400 hover:text-blue-600">
                           <Edit2 size={18} />
                         </button>
                         <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 text-gray-400 hover:text-red-600">
                           <Trash2 size={18} />
                         </button>
                      </div>
                    </div>
                    
                    {editingQuestion === q.id ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
                          <input 
                            type="text" 
                            value={q.text} 
                            onChange={(e) => handleUpdateQuestionText(q.id, e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                        <div className="flex justify-end">
                           <button onClick={() => setEditingQuestion(null)} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                             <Save size={16} className="mr-2" /> Done
                           </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-lg font-medium text-gray-900">{q.text}</p>
                    )}

                    <div className="mt-4 pl-4 border-l-2 border-gray-100">
                      <p className="text-xs text-gray-400 mb-2 font-medium uppercase">Options Preview</p>
                      <div className="grid grid-cols-2 gap-2">
                        {q.options?.map(opt => (
                          <div key={opt.id} className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-md border border-gray-100">
                            {opt.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'theme' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Theme & Branding</h2>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">App Name</label>
                    <input 
                      type="text" 
                      value={settings.appName} 
                      onChange={(e) => updateSettings({...settings, appName: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                     <div className="flex items-center space-x-3">
                       <input 
                         type="color" 
                         value={settings.primaryColor} 
                         onChange={(e) => updateSettings({...settings, primaryColor: e.target.value})}
                         className="h-10 w-10 p-1 rounded border border-gray-300 cursor-pointer"
                       />
                       <input 
                         type="text" 
                         value={settings.primaryColor} 
                         onChange={(e) => updateSettings({...settings, primaryColor: e.target.value})}
                         className="flex-1 p-3 border border-gray-300 rounded-lg uppercase font-mono text-sm"
                       />
                     </div>
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Title</label>
                     <input 
                        type="text" 
                        value={settings.welcomeTitle} 
                        onChange={(e) => updateSettings({...settings, welcomeTitle: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                     />
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Subtitle</label>
                     <textarea 
                        value={settings.welcomeSubtitle} 
                        onChange={(e) => updateSettings({...settings, welcomeSubtitle: e.target.value})}
                        rows={3}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                     />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                   <div className="text-sm text-green-600 font-medium flex items-center animate-pulse">
                     <Check size={16} className="mr-1" /> Auto-saved
                   </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('welcome');
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [questions, setQuestions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [results, setResults] = useState<AssessmentResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle Assessment Completion
  const handleAssessmentComplete = async (answers: UserResponse[]) => {
    setView('results');
    setIsGenerating(true);
    
    // Call Gemini Service
    const report = await generateHealthReport(questions, answers);
    
    setResults(report);
    setIsGenerating(false);
  };

  return (
    <Layout settings={settings} currentView={view} setView={setView}>
      {view === 'welcome' && (
        <WelcomeScreen 
          settings={settings} 
          onStart={() => setView('assessment')} 
        />
      )}
      
      {view === 'assessment' && (
        <AssessmentScreen 
          questions={questions}
          settings={settings}
          onComplete={handleAssessmentComplete}
          onCancel={() => setView('welcome')}
        />
      )}

      {view === 'results' && (
        <ResultsScreen 
          result={results} 
          loading={isGenerating} 
          settings={settings}
          onRetake={() => {
            setResults(null);
            setView('assessment');
          }}
        />
      )}

      {view === 'articles' && (
        <ArticlesScreen articles={MOCK_ARTICLES} settings={settings} />
      )}

      {view === 'admin' && (
        <AdminDashboard 
          settings={settings}
          updateSettings={setSettings}
          questions={questions}
          updateQuestions={setQuestions}
        />
      )}

      {(view === 'history' || view === 'settings') && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
           <SettingsIcon size={48} className="mb-4 text-gray-300" />
           <p className="text-lg">This feature is coming soon.</p>
           <button onClick={() => setView('welcome')} className="mt-4 text-blue-600 hover:underline">Go Home</button>
        </div>
      )}
    </Layout>
  );
};

export default App;
