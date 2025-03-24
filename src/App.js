import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chatbot1 from './Components/intialChatbot.js';  // Import the Chatbot1 component
import NewComponent from './Components/chatbot.js';  // Create this new component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Chatbot1/>} />
        <Route path="/new-page" element={<NewComponent />} /> 
      </Routes>
    </Router>
  );
}

export default App;
