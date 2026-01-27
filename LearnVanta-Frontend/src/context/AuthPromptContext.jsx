import React, { createContext, useContext, useState, useCallback } from "react";
import LoginPromptModal from "../components/LoginPromptModal.jsx";

const AuthPromptContext = createContext(null);

export const useAuthPrompt = () => {
  const context = useContext(AuthPromptContext);
  if (!context) {
    throw new Error("useAuthPrompt must be used within an AuthPromptProvider");
  }
  return context;
};

export const AuthPromptProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feature, setFeature] = useState("default");

  const showLoginPrompt = useCallback((featureName = "default") => {
    setFeature(featureName);
    setIsOpen(true);
  }, []);

  const hideLoginPrompt = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AuthPromptContext.Provider value={{ showLoginPrompt, hideLoginPrompt, isOpen }}>
      {children}
      <LoginPromptModal isOpen={isOpen} onClose={hideLoginPrompt} feature={feature} />
    </AuthPromptContext.Provider>
  );
};

export default AuthPromptContext;
