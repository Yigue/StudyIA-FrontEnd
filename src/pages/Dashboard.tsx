import  { useState, useEffect } from 'react';
import { Brain, Clock, Trophy, TrendingUp, Calendar, Target, BookOpen } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface StudyStats {
  totalMaterials: number;
  totalFlashcards: number;
  studyHours: number;
  achievements: number;
  streak: number;
}

interface StudySession {
  date: string;
  duration: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<StudyStats>({
    totalMaterials: 0,
    totalFlashcards: 0,
    studyHours: 0,
    achievements: 0,
    streak: 0
  });
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [upcomingReviews, setUpcomingReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Obtener estadísticas de materiales
      const { data: materials } = await supabase
        .from('study_materials')
        .select('id')
        .eq('user_id', user.id);

      // Obtener estadísticas de flashcards
      const { data: flashcards } = await supabase
        .from('flashcards')
        .select('*')
        .eq('user_id', user.id)
        .gte('next_review', new Date().toISOString())
        .order('next_review');

      // Simular datos de sesiones de estudio (esto podría venir de una tabla real)
      const mockSessions = generateMockStudySessions();

      setStats({
        totalMaterials: materials?.length || 0,
        totalFlashcards: flashcards?.length || 0,
        studyHours: calculateTotalStudyHours(mockSessions),
        achievements: calculateAchievements(materials?.length || 0, flashcards?.length || 0),
        streak: calculateStreak(mockSessions)
      });

      setStudySessions(mockSessions);
      setUpcomingReviews(flashcards?.slice(0, 5) || []);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      setLoading(false);
    }
  };

  const generateMockStudySessions = (): StudySession[] => {
    const sessions = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      sessions.push({
        date: date.toISOString().split('T')[0],
        duration: Math.floor(Math.random() * 120) + 30 // 30-150 minutos
      });
    }
    
    return sessions;
  };

  const calculateTotalStudyHours = (sessions: StudySession[]): number => {
    return Math.round(sessions.reduce((total, session) => total + session.duration, 0) / 60);
  };

  const calculateAchievements = (materialsCount: number, flashcardsCount: number): number => {
    let achievements = 0;
    if (materialsCount >= 5) achievements++;
    if (materialsCount >= 10) achievements++;
    if (flashcardsCount >= 50) achievements++;
    if (flashcardsCount >= 100) achievements++;
    return achievements;
  };

  const calculateStreak = (sessions: StudySession[]): number => {
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    
    for (let i = sessions.length - 1; i >= 0; i--) {
      if (sessions[i].duration >= 30) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">¡Bienvenido de vuelta!</h2>
        <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg">
          <Target className="w-5 h-5 text-indigo-600" />
          <span className="font-medium text-indigo-600">{stats.streak} días de racha</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Materiales</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalMaterials}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Flashcards</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalFlashcards}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Horas de Estudio</p>
              <p className="text-2xl font-bold text-gray-800">{stats.studyHours}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Logros</p>
              <p className="text-2xl font-bold text-gray-800">{stats.achievements}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Actividad de Estudio</h3>
            </div>
          </div>
          
          <div className="space-y-4">
            {studySessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-gray-600">
                  {new Date(session.date).toLocaleDateString('es-ES', { 
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <div className="flex items-center gap-2">
                  <div 
                    className="bg-indigo-100 h-4 rounded"
                    style={{ width: `${(session.duration / 150) * 100}px` }}
                  ></div>
                  <span className="text-sm text-gray-600">{session.duration} min</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Próximas Revisiones</h3>
            </div>
          </div>

          <div className="space-y-4">
            {upcomingReviews.length > 0 ? (
              upcomingReviews.map((review, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{review.question}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(review.next_review).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    review.difficulty <= 2 ? 'bg-green-100 text-green-700' :
                    review.difficulty === 3 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {review.difficulty <= 2 ? 'Fácil' :
                     review.difficulty === 3 ? 'Normal' :
                     'Difícil'}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No hay revisiones pendientes</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;