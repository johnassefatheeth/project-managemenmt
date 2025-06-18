import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useSelector((state) => state.auth);
  const location = useLocation();

  console.log('Current user:', user);
  console.log('Required roles:', allowedRoles);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Only check roles if allowedRoles is defined and not empty
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    console.log('Role check failed. User role:', user?.role, 'Allowed:', allowedRoles);
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;