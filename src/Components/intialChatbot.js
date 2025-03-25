import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useThread } from "../Context/ThreadContext";
import { nanoid } from "nanoid";




function PromptGenerator() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const messagesEndRef = useRef(null);
 
  const { Thread, setThread } = useThread();
  const navigate = useNavigate();
 
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const formatResponse = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/# (.*?)\n/g, '<h2>$1</h2>')
      .replace(/\n/g, '<br />');
  };

  const generateRandomThreadId = () => {
    return String(nanoid(9));
  };
 
  const generatePrompt = async () => {
    if (input.trim() === '') return; // Ensure input isn't empty

    setIsLoading(true);
    setShowContinue(false);
    setGeneratedContent('');

    const newThreadId = generateRandomThreadId();
    setThread(newThreadId);
    
    try {  
      const response = await fetch('https://api.gtwy.ai/api/v2/model/chat/completion', {
        method: 'POST',
        headers: {
          'pauthkey': process.env.REACT_APP_PAUTH_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          thread_id: String(newThreadId),  
          user: input,
          bridge_id: process.env.REACT_APP_BRIDGE_ID,
          response_type: 'text'
        })
      });
      
      const data = await response.json();
      let botResponse = "Sorry, I couldn't process that request.";

      if (data.success && data.response && data.response.data && data.response.data.content) {
        botResponse = data.response.data.content;
      }

      const formattedResponse = formatResponse(botResponse);
      setGeneratedContent(formattedResponse);
      setShowContinue(true);
    } catch (error) {
      console.error('Error fetching response:', error);
      setGeneratedContent("Sorry, there was an error connecting to the API.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    setShowContinue(false);
    setGeneratedContent('');
    navigate('/new-page');
  };

  const examplePrompts = [
    "Write a children story book",
    "Act as a Travel Guide",
    "Act as a Financial Analyst",
    "Act as a Essay Writer",
    "Act as a Real Estate Agent"
  ];

  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center"><span className="text-red-800 underline">Create your own prompt</span></h1>
        
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-medium">What would you like help with?</h2>
            <svg className="ml-2 w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          
          <div className="relative border rounded-md bg-white">
            <div className="absolute left-3 top-3 text-indigo-600">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16L7 11H17L12 16Z" fill="currentColor" />
              </svg>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="give me a prompt to create a story"
              className="w-full pl-12 pr-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
              rows="4"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {examplePrompts.map((prompt, index) => (
            <button 
              key={index}
              onClick={() => setInput(prompt)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm hover:bg-gray-50"
            >
              {prompt}
            </button>
          ))}
        </div>
        
        <button
          onClick={generatePrompt}
          disabled={isLoading || input.trim() === ''}
          className="bg-red-800 text-white px-6 py-2 rounded hover:bg-red-900 disabled:opacity-50 mb-6 w-full"
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
        
        {generatedContent && (
          <div className="bg-white border rounded-md p-6 mb-6 shadow-sm">
            <h3 className="text-lg font-medium mb-3">Generated Prompt:</h3>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: generatedContent }} 
            />
          </div>
        )}
        
        {isLoading && (
          <div className="bg-white border rounded-md p-6 mb-6 shadow-sm flex justify-center items-center h-40">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-800 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-red-800 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-red-800 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        
        {showContinue && (
          <button
            onClick={handleContinue}
            className="bg-red-800 text-white px-6 py-2 rounded hover:bg-red-900 w-full"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

export default PromptGenerator;
