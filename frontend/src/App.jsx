import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PostJobForm from '../components/PostJobForm';
import FeedPage from '../pages/FeedPage';

const App = () => {
    // Check if user is logged in
    const isAuthenticated = () => {
        return localStorage.getItem('token') && localStorage.getItem('user');
    };

    return (
        <Router>
            <div className="app">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<FeedPage />} />
                    <Route path="/feed" element={<FeedPage />} />
                    
                    {/* Protected Routes */}
                    <Route 
                        path="/post-job" 
                        element={
                            isAuthenticated() ? <PostJobForm /> : <Navigate to="/login" />
                        } 
                    />
                    
                    {/* Redirect unknown routes */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
