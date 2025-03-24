import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useThread } from "../Context/ThreadContext";
import { nanoid } from "nanoid";
function Chatbot1() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContinue, setShowContinue] = useState(false); // State for "Continue" button
  const messagesEndRef = useRef(null);
 

  const { Thread, setThread } = useThread();
  const navigate = useNavigate(); // Initialize useNavigate hook
 
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Helper function to format the response
  const formatResponse = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold text
      .replace(/# (.*?)\n/g, '<h2>$1</h2>') // Heading
      .replace(/\n/g, '<br />'); // Line breaks
  };

  const generateRandomThreadId = () => {
    return String(nanoid(9));  // Ensures the ID is explicitly a string
  };
 
  const sendMessage = async (messageText = input) => {
    if (messageText.trim() === '') return;

    // Clear previous messages and show loading state
    setMessages([]);
    setInput('');
    setIsLoading(true);
    setShowContinue(false); // Hide "Continue" button

    const userMessage = { text: messageText, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    const newThreadId = generateRandomThreadId();
    setThread(newThreadId);
    console.log(newThreadId)
    // Use the local variable
    try {  
      const response = await fetch('https://api.gtwy.ai/api/v2/model/chat/completion', {
        method: 'POST',
        headers: {
          'pauthkey': '8c7ca6fd1ba9a90b1710a88070dfaa2b',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          thread_id: String(newThreadId),  
          user: messageText,
          bridge_id: '67beaf5c435a135f50eecdbc',
          response_type: 'text'
        })
      });
      console.log(`Using thread ID: ${newThreadId}`);
      const data = await response.json();
      let botResponse = "Sorry, I couldn't process that request.";

      if (data.success && data.response && data.response.data && data.response.data.content) {
        botResponse = data.response.data.content;
      }

      // Format the bot's response
      const formattedResponse = formatResponse(botResponse);

      setMessages(prevMessages => [...prevMessages, {
        text: formattedResponse,
        sender: 'bot'
      }]);

      // Show "Continue" button after the bot responds
      setShowContinue(true);
    } catch (error) {
      console.error('Error fetching response:', error);
      setMessages(prevMessages => [...prevMessages, {
        text: "Sorry, there was an error connecting to the API.",
        sender: 'bot'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    sendMessage(suggestion);
  };

  const handleContinue = () => {
    setShowContinue(false); // Hide "Continue" button
    setMessages([]); // Clear the chat for a new interaction
    navigate('/new-page'); // Navigate to the new page
  };

  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col h-screen w-3/4 bg-gray-200 shadow-xl">
        {/* Header */}
        <div className="bg-gray-800 border-b border-gray-700 p-4 flex items-center justify-between text-gray-100">
          <div className="flex items-center">
            <button className="mr-4 text-gray-300 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center">
              <span className="font-bold">Chatbot</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <span className="text-xs text-gray-400">Prompt Engineer</span>
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border-2 border-white">
                  <div className="w-3 h-3 rounded-full bg-white"></div>
                </div>
              </div>
              <h2 className="text-xl font-bold mb-4 text-gray-800">What can I help with?</h2>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`px-4 py-3 rounded-lg max-w-2xl w-full break-words ${message.sender === 'user' ? 'bg-black text-white rounded-br-none' : 'bg-gray-300 text-gray-800 rounded-bl-none'}`}
                    dangerouslySetInnerHTML={{ __html: message.text }} 
                  />
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Suggestions */}
        {messages.length === 0 }
        
        {/* Continue Button */}
        {showContinue && (
          <div className="px-6 pb-4 bg-gray-100">
            <button
              onClick={handleContinue}
              className="w-full bg-black text-white rounded-lg p-3 hover:bg-gray-800"
            >
              Continue
            </button>
          </div>
        )}
        
        {/* Input Box */}
        <div className="border-t border-gray-300 p-4 bg-gray-200">
          <div className="flex items-center relative">
            <input
              type="text"
              value={input}
              onChange={(e) =>{ 
                setInput(e.target.value)
               }}
              onKeyPress={handleKeyPress}
              placeholder="Message AI Assistant..."
              className="w-full bg-gray-300 border border-gray-400 rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-black text-gray-800"
            />
            <button
              onClick={() => sendMessage()}
              disabled={isLoading || input.trim() === ''}
              className="absolute right-3 text-gray-600 hover:text-black disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14m0 0l-7 7m7-7l-7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot1;
