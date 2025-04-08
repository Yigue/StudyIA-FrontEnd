// Rutas de flashcards
import FlashcardsExplorerPage from './features/flashcards/pages/FlashcardsExplorerPage';
import StudySessionPage from './features/flashcards/pages/StudySessionPage';

const routes = [
  // Rutas de flashcards
  {
    path: '/flashcards',
    element: <FlashcardsExplorerPage />
  },
  {
    path: '/flashcards/study',
    element: <StudySessionPage />
  },
];

export default routes; 