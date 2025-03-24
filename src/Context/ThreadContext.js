import React, { createContext, useContext, useState } from "react";

// Create context
const ThreadContext = createContext(null);

// Context provider component
export const ThreadProvider = ({ children }) => {
  const [Thread, setThread] = useState("501");
  return (
    <ThreadContext.Provider value={{ Thread, setThread }}>
      {children}
    </ThreadContext.Provider>
  );
};

// Custom hook to use the thread context
export const useThread = () => {
  const context = useContext(ThreadContext);
  if (!context) {
    throw new Error("useThread must be used within a ThreadProvider");
  }
  return context;
};
