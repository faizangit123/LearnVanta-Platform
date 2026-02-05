/**
 * AuthPromptContext
 * 
 * Global context to show login modal when user tries
 * to access protected features.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

import LoginPromptModal from "../components/LoginPromptModal.jsx";

// ============================================
// CONTEXT
// ============================================

const AuthPromptContext = createContext(null);

// ============================================
// HOOK
// ============================================

export const useAuthPrompt = () => {
  const context = useContext(AuthPromptContext);
  if (!context) {
    throw new Error("useAuthPrompt must be used within an AuthPromptProvider");
  }
  return context;
};

// ============================================
// PROVIDER
// ============================================

export const AuthPromptProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feature, setFeature] = useState("default");

  // Show modal with reason (feature name)
  const showLoginPrompt = useCallback((featureName = "default") => {
    setFeature(featureName);
    setIsOpen(true);
  }, []);

  // Hide modal
  const hideLoginPrompt = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AuthPromptContext.Provider
      value={{
        showLoginPrompt,
        hideLoginPrompt,
        isOpen,
      }}
    >
      {children}

      {/* Global modal */}
      <LoginPromptModal
        isOpen={isOpen}
        onClose={hideLoginPrompt}
        feature={feature}
      />
    </AuthPromptContext.Provider>
  );
};

export default AuthPromptContext;
