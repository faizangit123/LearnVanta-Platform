import React from "react";

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
    <path d="M12 9v4"></path>
    <path d="M12 17h.01"></path>
  </svg>
);

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
  if (!isOpen) return null;

  const styles = {
    overlay: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "1rem",
    },
    modal: {
      backgroundColor: "hsl(var(--card))",
      borderRadius: "0.75rem",
      width: "100%",
      maxWidth: "400px",
      padding: "1.5rem",
      border: "1px solid hsl(var(--border))",
    },
    iconWrapper: {
      width: "48px",
      height: "48px",
      borderRadius: "50%",
      backgroundColor: "hsl(var(--destructive) / 0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 1rem",
      color: "hsl(var(--destructive))",
    },
    title: {
      fontSize: "1.125rem",
      fontWeight: 600,
      color: "hsl(var(--foreground))",
      textAlign: "center",
      marginBottom: "0.5rem",
    },
    message: {
      fontSize: "0.875rem",
      color: "hsl(var(--muted-foreground))",
      textAlign: "center",
      marginBottom: "1.5rem",
      lineHeight: 1.5,
    },
    actions: {
      display: "flex",
      gap: "0.75rem",
      justifyContent: "center",
    },
    cancelBtn: {
      flex: 1,
      padding: "0.75rem 1rem",
      borderRadius: "0.5rem",
      border: "1px solid hsl(var(--border))",
      backgroundColor: "transparent",
      color: "hsl(var(--foreground))",
      fontSize: "0.875rem",
      fontWeight: 500,
      cursor: "pointer",
    },
    deleteBtn: {
      flex: 1,
      padding: "0.75rem 1rem",
      borderRadius: "0.5rem",
      border: "none",
      backgroundColor: "hsl(var(--destructive))",
      color: "hsl(var(--destructive-foreground))",
      fontSize: "0.875rem",
      fontWeight: 600,
      cursor: "pointer",
      opacity: isLoading ? 0.6 : 1,
    },
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.iconWrapper}>
          <AlertIcon />
        </div>
        <h3 style={styles.title}>{title || "Delete Video"}</h3>
        <p style={styles.message}>
          {message || "Are you sure you want to delete this video? This action cannot be undone."}
        </p>
        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button style={styles.deleteBtn} onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
