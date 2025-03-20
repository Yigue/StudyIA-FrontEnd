import { useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthInitializer } from "./components/auth/AuthInitializer";

// Importaciones actualizadas

import DashboardPage from "./features/dashboard/DashboardPage";
import StudyAreaPage from "./features/study/StudyAreaPage";
import LibraryPage from "./features/library/LibraryPage";
import FlashcardsReviewPage from "./features/flashcards/FlashcardsReviewPage";
import AuthPage from "./features/auth/AuthPage";
import SettingsPage from "./features/settings/SettingsPage";
import MainLayout from "./components/layouts/MainLayout";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { useAuth } from "./hook/userAuth";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <AuthInitializer />
      <Routes>
        <Route path="/" element={<AuthPage />} />
      
        <Route
          path="/*"
          element={
            <MainLayout activeTab={activeTab} setActiveTab={setActiveTab}>
              <Routes>
                <Route
                  path="dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="flashcards"
                  element={
                    <ProtectedRoute>
                      <FlashcardsReviewPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="study"
                  element={
                    <ProtectedRoute>
                      <StudyAreaPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="library"
                  element={
                    <ProtectedRoute>
                      <LibraryPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
