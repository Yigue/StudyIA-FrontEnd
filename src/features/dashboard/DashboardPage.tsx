import { useState, useEffect } from "react";
import { Brain, Clock, Trophy, Target, BookOpen } from "lucide-react";
import {
  StudyStats,
  StudySession,
  FlashcardReview,
} from "./types/dashboard.types";
import {
  generateMockStudySessions,
  calculateTotalStudyHours,
  calculateAchievements,
  calculateStreak,
} from "./utils/dashboard.utils";
import { StatsCard } from "./components/StatsCard";
import { StudyActivityChart } from "./components/StudyActivityChart";
import { UpcomingReviews } from "./components/UpcomingReviews";
import { useFlashcardsStore } from "../flashcards/store/flashcardsStore";
import { useMaterials } from "../../hook/useMaterials";

const DashboardPage = () => {
  const [stats, setStats] = useState<StudyStats>({
    totalMaterials: 0,
    totalFlashcards: 0,
    studyHours: 0,
    achievements: 0,
    streak: 0,
  });
  const { flashcards } = useFlashcardsStore();
  const { materials } = useMaterials();

  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [upcomingReviews] = useState<FlashcardReview[]>([]);

  useEffect(() => {
    const mockSessions = generateMockStudySessions();

    setStats({
      totalMaterials: materials?.length || 0,
      totalFlashcards: flashcards?.length || 0,
      studyHours: calculateTotalStudyHours(mockSessions),
      achievements: calculateAchievements(
        materials?.length || 0,
        flashcards?.length || 0
      ),
      streak: calculateStreak(mockSessions),
    });
    setStudySessions(mockSessions);
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          ¡Bienvenido de vuelta!
        </h2>
        <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-lg">
          <Target className="w-5 h-5 text-indigo-600" />
          <span className="font-medium text-indigo-600">
            {stats.streak} días de racha
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={BookOpen}
          label="Materiales"
          value={stats.totalMaterials}
          bgColor="bg-green-50"
          iconColor="text-green-600"
        />
        <StatsCard
          icon={Brain}
          label="Flashcards"
          value={stats.totalFlashcards}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatsCard
          icon={Clock}
          label="Horas de Estudio"
          value={stats.studyHours}
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <StatsCard
          icon={Trophy}
          label="Logros"
          value={stats.achievements}
          bgColor="bg-yellow-50"
          iconColor="text-yellow-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StudyActivityChart sessions={studySessions} />
        <UpcomingReviews reviews={upcomingReviews} />
      </div>
    </div>
  );
};

export default DashboardPage;
