import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAuthInitialized } = useSelector(
    (state) => state.auth
  );

  
  if (!isAuthInitialized) {
    return <div>Loading...</div>; 
  }
 

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
