import React, { useState, useEffect, useCallback } from 'react';
import { useThread } from "../Context/ThreadContext";

const ChatbotEmbed = () => {
  const { Thread } = useThread();
  const [isScriptReady, setIsScriptReady] = useState(false);

  
  const scriptId = process.env.REACT_APP_SCRIPT_ID;
  const scriptSrc = process.env.REACT_APP_SCRIPT_SRC;
  const chatbot_token = process.env.REACT_APP_CHATBOT_TOKEN; 

  // Function to inject custom CSS for styling the chatbot
  const injectCustomStyles = useCallback(() => {
    if (document.getElementById('chatbot-custom-styles')) return;

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
      
      .viasocket-chatbot-message {
        transition: all 0.3s ease-in-out !important;
      }
      
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
  }, []);

  const initializeChatbot = useCallback(() => {
    if (window.openChatbot && window.SendDataToChatbot) {
      window.openChatbot();
      window.SendDataToChatbot({
        bridgeName: "Assistant",
        threadId: String(Thread),
        parentId: "parentChatbot",
        fullScreen: 'true',
        variables: {}
      });
      injectCustomStyles();
      return true;
    }
    return false;
  }, [Thread, injectCustomStyles]);

  const loadScript = useCallback(() => {
    // Remove existing script and styles if they exist
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }
    
    const customStyles = document.getElementById('chatbot-custom-styles');
    if (customStyles) {
      customStyles.remove();
    }

    if (!chatbot_token) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = scriptSrc;
    script.setAttribute("embedToken", chatbot_token);
    script.setAttribute("hideIcon", "true");
    
    script.onload = () => {
      setIsScriptReady(true);
      // Try to initialize immediately
      if (initializeChatbot()) return;
      
      // Fallback: check periodically if initialization fails
      const interval = setInterval(() => {
        if (initializeChatbot()) {
          clearInterval(interval);
        }
      }, 200);
    };

    script.onerror = () => {
      console.error("Failed to load chatbot script");
    };

    document.head.appendChild(script);
  }, [initializeChatbot]);

  useEffect(() => {
    loadScript();
    
    return () => {
      // Cleanup script and styles
      const script = document.getElementById(scriptId);
      if (script) script.remove();
      
      const styles = document.getElementById('chatbot-custom-styles');
      if (styles) styles.remove();
    };
  }, [loadScript]);

  // Re-initialize when Thread changes
  useEffect(() => {
    if (isScriptReady) {
      initializeChatbot();
    }
  }, [Thread, isScriptReady, initializeChatbot]);

  return (
    <div className="h-[100vh]">
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