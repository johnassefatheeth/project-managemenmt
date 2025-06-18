import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const HomeRedirect = () => {
  const { user } = useSelector((state) => state.auth);
  
  return user?.role === 'project_manager' ? (
    <Navigate to="/manager-dashboard" replace />
  ) : (
    <Navigate to="/developer-dashboard" replace />
  );
};

export default HomeRedirect;