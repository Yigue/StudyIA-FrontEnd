import React from 'react';
import { StudyActivityChart } from './StudyActivityChart';
import { UpcomingReviews } from './UpcomingReviews';
import { StudySession, FlashcardReview } from '../types/dashboard.types';

interface ChartsGridProps {
  studySessions: StudySession[];
  upcomingReviews: FlashcardReview[];
}

const ChartsGrid: React.FC<ChartsGridProps> = ({ 
  studySessions, 
  upcomingReviews 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <StudyActivityChart sessions={studySessions} />
      <UpcomingReviews reviews={upcomingReviews} />
    </div>
  );
};

export default ChartsGrid; 