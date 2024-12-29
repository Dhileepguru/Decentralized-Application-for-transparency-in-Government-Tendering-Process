import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TenderManagement from './pages/TenderManagement.jsx';
import MilestoneManagement from './pages/MilestoneManagement.jsx';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<TenderManagement />} />
                <Route path="/milestones/:tenderId" element={<MilestoneManagement />} />
            </Routes>
        </Router>
    );
}

export default App;