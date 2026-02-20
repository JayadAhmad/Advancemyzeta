import { RouterProvider,createBrowserRouter,createRoutesFromElements,Route } from 'react-router-dom';
import DashboardLayout from './Components/Layout/DashboardLayout';
import SalesHome from './Components/Sales/Page/SalesHome';
import LoginPage from './Login/LoginPage';
import { useDispatch } from 'react-redux';
import { hydrateAuth,authInitialized } from './features/authSlice';
import { useEffect } from 'react';
import ProtectedRoute from './features/ProtectedRoute';



const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/' element={<div>Advance my zeta</div>} >
        {/* Define nested routes here */}
        
      </Route>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/sales' element={<ProtectedRoute>
        <DashboardLayout />
        </ProtectedRoute>} >
        {/* Define nested routes here */}
        <Route index element={<SalesHome />} />
      </Route>
    </>
  ))
    
function App() {
  const dispatch = useDispatch();

   useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
   
    if (storedAuth) {
      dispatch(hydrateAuth(JSON.parse(storedAuth)));
    }else {
      dispatch(authInitialized());
    }
  }, []);
  return (
    <RouterProvider router={router} />
  );
}

export default App;
