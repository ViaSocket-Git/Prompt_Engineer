import React, { useState, useEffect } from 'react';

const ChatbotEmbed = () => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  
  const scriptId = "chatbot-main-script";
  const scriptSrc = "https://chatbot-embed.viasocket.com/chatbot-prod.js";
  const chatbot_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdfaWQiOiIxMzQ3NSIsImNoYXRib3RfaWQiOiI2N2JlYWZmN2ZmMDNjZjI4N2Q2MzRjNDMiLCJ1c2VyX2lkIjoiMTAwMCIsInZhcmlhYmxlcyI6eyJrZXkiOiJ2YWx1ZSJ9fQ.r46CaeJtX_GWlFOFE5JJysaOzgFraTQ--WyZE97Cx6Y"; 

  // Function to inject custom CSS for styling the chatbot
  const injectCustomStyles = () => {
    const styleElement = document.createElement('style');
    styleElement.id = 'chatbot-custom-styles';
    styleElement.innerHTML = `
      .viasocket-chatbot-outer-container {
        background-color: #121212 !important;
        border-radius: 16px !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
      }
      
      .viasocket-chatbot-header {
        background: linear-gradient(135deg, #2A2A72 0%, #1A1A3A 100%) !important;
        border-bottom: 1px solid #333 !important;
        border-radius: 16px 16px 0 0 !important;
      }
      
      .viasocket-chatbot-message-container {
        background-color: #121212 !important;
        padding: 12px !important;
      }
      
      .viasocket-chatbot-user-message {
        background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%) !important;
        border-radius: 18px 18px 4px 18px !important;
        box-shadow: 0 2px 10px rgba(99, 102, 241, 0.15) !important;
      }
      
      .viasocket-chatbot-bot-message {
        background-color: #2D2D2D !important;
        border-radius: 18px 18px 18px 4px !important;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
      }
      
      .viasocket-chatbot-input-container {
        background-color: #1E1E1E !important;
        border-top: 1px solid #333 !important;
        border-radius: 0 0 16px 16px !important;
        padding: 12px !important;
      }
      
      .viasocket-chatbot-input {
        background-color: #2D2D2D !important;
        border: 1px solid #444 !important;
        border-radius: 24px !important;
        color: #E0E0E0 !important;
      }
      
      .viasocket-chatbot-send-button {
        background: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%) !important;
        border-radius: 50% !important;
        box-shadow: 0 2px 10px rgba(99, 102, 241, 0.2) !important;
      }
      
      /* Animation for messages */
      .viasocket-chatbot-message {
        transition: all 0.3s ease-in-out !important;
      }
      
      /* Custom scrollbar */
      .viasocket-chatbot-message-container::-webkit-scrollbar {
        width: 6px !important;
      }
      
      .viasocket-chatbot-message-container::-webkit-scrollbar-track {
        background: #1A1A1A !important;
      }
      
      .viasocket-chatbot-message-container::-webkit-scrollbar-thumb {
        background: #444 !important;
        border-radius: 6px !important;
      }
    `;
    document.head.appendChild(styleElement);
  };

  const updateScript = () => {
    console.log(chatbot_token);
    if (chatbot_token) {
      // Remove existing script if it exists
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement("script");
      script.setAttribute("embedToken", chatbot_token);
      script.setAttribute("hideIcon", "true");
      script.id = scriptId;
      script.src = scriptSrc;
      document.head.appendChild(script);
      console.log("Chatbot script updated.");
      setIsScriptLoaded(true);
      
      // Inject custom styles after script is loaded
      setTimeout(() => {
        injectCustomStyles();
      }, 1000);
    }
  };

  // Function to handle opening the chatbot
  const handleOpenChatbot = () => {
    if (window?.openChatbot) {
      window.openChatbot();
      console.log("Chatbot opened.");
    } else {
      console.log("Chatbot is not ready yet.");
    }
  };

  // Function to send data to the chatbot
  const sendDataToChatbot = () => {
    if (window?.SendDataToChatbot) {
      window.SendDataToChatbot({
        bridgeName: "Assistant",
        threadId: "Assistant",
        parentId: "parentChatbot",
        fullScreen: 'true',
        variables: {} // Add variables if needed
      });
      console.log("Data sent to chatbot.");
    } else {
      console.log("Chatbot is not ready yet.");
    }
  };

  // useEffect to trigger functions automatically when the component mounts
  useEffect(() => {
    // Update the script
    updateScript();

    // Run after script is loaded
    const checkScriptLoad = setInterval(() => {
      if (isScriptLoaded) {
        handleOpenChatbot();
        sendDataToChatbot();
        clearInterval(checkScriptLoad); // Stop checking once script is loaded and functions are called
      }
    }, 500);

    // Clean up function to remove the script when component unmounts
    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        existingScript.remove();
      }
      const customStyles = document.getElementById('chatbot-custom-styles');
      if (customStyles) {
        customStyles.remove();
      }
      clearInterval(checkScriptLoad); // Clear interval when component unmounts
    };
  }, [isScriptLoaded]); // Trigger useEffect when isScriptLoaded changes

  return (
    <div className="chatbot-wrapper">
      <div 
        id="parentChatbot" 
        className="chatbot-container"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: '500px',
          background: 'linear-gradient(135deg, #111827 0%, #0F172A 100%)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
          border: '1px solid #2D3748'
        }}
      ></div>
    </div>
  );
};

export default ChatbotEmbed;


