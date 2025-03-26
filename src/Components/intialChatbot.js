import React, { useState, useEffect, useRef } from 'react';
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
    if (input.trim() === '') return;

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
    loadChatbot();  // This will load the chatbot iframe dynamically
  };

  const loadChatbot = () => {
    const scriptId = process.env.REACT_APP_SCRIPT_ID;
    const scriptSrc = process.env.REACT_APP_SCRIPT_SRC;
    const chatbot_token = process.env.REACT_APP_CHATBOT_TOKEN;
  
    // Remove existing script and styles if they already exist
    const existingScript = document.getElementById(scriptId);
    const existingStyles = document.getElementById('chatbot-custom-styles');
  
    if (existingScript) {
      existingScript.remove(); // Remove existing chatbot script
    }
  
    if (existingStyles) {
      existingStyles.remove(); // Remove existing styles
    }
  
    // Load chatbot script
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = scriptSrc;
    script.setAttribute("embedToken", chatbot_token);
    script.setAttribute("hideIcon", "true");
  
    // Function to inject custom styles for the chatbot
   
    script.onload = () => {
      // Initialize the chatbot after script is loaded
      if (window.openChatbot && window.SendDataToChatbot) {
        window.openChatbot();
        window.SendDataToChatbot({
          bridgeName: "Assistant",
          threadId: String(Thread),
          parentId: "parentChatbot",
          fullScreen: 'true',
          variables: {}
        });
      }
    };
  
    script.onerror = () => {
      console.error("Failed to load chatbot script");
    };
  
    document.head.appendChild(script); // Append the script to the head of the document
  };

  const examplePrompts = [
    "generate a prompt for a study plan to prepare for a final exam",
    "generate prompt for creating maths test",
    "generate a step-by-step guide for setting up a WordPress website",
    "generate prompt for creating website using react ",
    "Give me a prompt for writing an ad for a high-end coffee machine",
  ];

  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center py-6">
      <div className="max-w-4xl w-full p-8 bg-white rounded-lg shadow-xl">
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">
          <span className="text-red-800 underline">Generate Your Custom Prompt</span>
        </h1>

        <div className="mb-4">
          <div className="flex items-center mb-2">
            <h2 className="text-xl font-medium text-gray-700">Let Us Assist You in Crafting the Perfect Prompt</h2>
            <svg className="ml-2 w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>

         
            
          <textarea
  value={input}
  onChange={(e) => setInput(e.target.value)}
  placeholder="Create a blog post prompt on the topic of sustainable business practices"
  className="w-full px-4 py-3 bg-gray-100 border rounded-md focus:outline-none focus:border-gray-500 transition duration-300 resize-none"
  rows="3"
/>

          
        </div>

        <div className="flex flex-wrap gap-3 mb-6 justify-center">
  {examplePrompts.map((prompt, index) => (
   <button
   key={index}
   onClick={() => setInput(prompt)}
   className="px-4 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg text-sm text-gray-800 hover:bg-gray-200 hover:border-gray-400 active:bg-gray-300 active:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 shadow-sm transform hover:scale-105 active:scale-95 transition duration-300 ease-in-out cursor-pointer"
 >
   {prompt}
 </button>
 
  ))}
</div>

       

<button
  onClick={generatePrompt}
  disabled={isLoading || input.trim() === ''}
  className="bg-gray-700 text-white px-6 py-2 rounded-md shadow-md hover:bg-gray-800 active:bg-gray-900 disabled:bg-gray-500 disabled:cursor-not-allowed w-full transition duration-300 ease-in-out font-medium tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
>
  {isLoading ? 'Generating...' : 'Generate'}
</button>


        {generatedContent && (
          <div className="bg-white border rounded-md p-6 mb-6 shadow-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Generated Prompt:</h3>
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
    className="bg-gray-700 text-white px-6 py-2 rounded-md shadow-md hover:bg-gray-800 active:bg-gray-900 w-full transition duration-300 ease-in-out font-medium tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
  >
    Not Satisfied? Chat for a Better Prompt
  </button>
)}

      </div>
    </div>
  );
}

export default PromptGenerator;
