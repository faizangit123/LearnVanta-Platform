import React, { useRef, useState } from "react";

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
    <circle cx="12" cy="13" r="3"></circle>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"></path>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
  </svg>
);

const LoaderIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
  </svg>
);

const ProfileAvatar = ({ user, onAvatarChange, isUploading }) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB");
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result;
      if (base64) {
        onAvatarChange(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveAvatar = () => {
    onAvatarChange(null);
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "1rem",
    },
    avatarWrapper: {
      position: "relative",
      cursor: "pointer",
    },
    avatar: {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      backgroundColor: "hsl(var(--primary))",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "hsl(var(--primary-foreground))",
      fontSize: "2.5rem",
      fontWeight: 700,
      overflow: "hidden",
      border: dragOver ? "3px dashed hsl(var(--primary))" : "3px solid hsl(var(--border))",
      transition: "all 0.2s",
    },
    avatarImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    overlay: {
      position: "absolute",
      inset: 0,
      borderRadius: "50%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      opacity: 0,
      transition: "opacity 0.2s",
    },
    overlayVisible: {
      opacity: 1,
    },
    hiddenInput: {
      display: "none",
    },
    actions: {
      display: "flex",
      gap: "0.5rem",
    },
    button: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.5rem 1rem",
      borderRadius: "0.5rem",
      border: "1px solid hsl(var(--border))",
      backgroundColor: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      fontSize: "0.875rem",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    removeButton: {
      color: "hsl(var(--destructive))",
      borderColor: "hsl(var(--destructive) / 0.3)",
    },
    hint: {
      fontSize: "0.75rem",
      color: "hsl(var(--muted-foreground))",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.container}>
      <div
        style={styles.avatarWrapper}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div style={styles.avatar}>
          {isUploading ? (
            <LoaderIcon />
          ) : user?.avatar ? (
            <img src={user.avatar} alt="Profile" style={styles.avatarImage} />
          ) : (
            user?.name?.charAt(0).toUpperCase() || "U"
          )}
        </div>
        <div
          style={{
            ...styles.overlay,
            ...(dragOver ? styles.overlayVisible : {}),
          }}
          className="avatar-overlay"
        >
          <CameraIcon />
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={styles.hiddenInput}
      />

      <div style={styles.actions}>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={styles.button}
          disabled={isUploading}
        >
          <CameraIcon /> Change Photo
        </button>
        {user?.avatar && (
          <button
            type="button"
            onClick={handleRemoveAvatar}
            style={{ ...styles.button, ...styles.removeButton }}
            disabled={isUploading}
          >
            <TrashIcon /> Remove
          </button>
        )}
      </div>

      <p style={styles.hint}>
        Click or drag to upload. Max 2MB. JPG, PNG, GIF.
      </p>

      <style>{`
        .avatar-overlay {
          opacity: 0;
        }
        .avatar-overlay:hover,
        div:hover > .avatar-overlay {
          opacity: 1;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ProfileAvatar;
