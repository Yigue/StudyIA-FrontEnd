import { Notification } from '../types/settings.types';

export const NotificationMessage = ({ type, message }: Notification) => (
  <div className={`mb-6 p-4 rounded-lg ${
    type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
  }`}>
    {message}
  </div>
);
