import { appContext } from '@/contexts/AppContext';
import { useContext } from 'react';

export const useSession = () => {
  const {
    userData, sessionData, sessionStatus, loadingSession,
  } = useContext(appContext);

  return {
    user: userData,
    session: sessionData,
    status: sessionStatus,
    loading: loadingSession,
  };
};
