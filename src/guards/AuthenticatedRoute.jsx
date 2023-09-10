// components/PrivateRoute.jsx

import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    const employeeData = localStorage.getItem('employee'); 
    const isLoggedIn = !!employeeData;  // Convert to a boolean.

    return isLoggedIn ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
