import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/Login/LoginPage';
import Dashboard from './components/Dashboard/DashboardPage';
import PrivateRoute from './guards/AuthenticatedRoute';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/" element={<LoginPage />} />
            </Routes>
        </Router>
    );
}

export default App;
