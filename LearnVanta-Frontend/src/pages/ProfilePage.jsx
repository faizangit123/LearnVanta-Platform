import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { MainLayout } from "../components/layout/index.js";
import { updateUserProfile } from "../services/authService.js";
import ProfileAvatar from "../components/profile/ProfileAvatar.jsx";

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuth();
  
  const [name, setName] = useState(user?.name || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });
  const [passwordMessage, setPasswordMessage] = useState({ type: "", text: "" });
  const [avatarMessage, setAvatarMessage] = useState({ type: "", text: "" });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleAvatarChange = async (avatarData) => {
    setIsUploadingAvatar(true);
    setAvatarMessage({ type: "", text: "" });
    
    try {
      const updatedUser = await updateUserProfile(user.id, { avatar: avatarData });
      updateUser(updatedUser);
      setAvatarMessage({ 
        type: "success", 
        text: avatarData ? "Profile photo updated!" : "Profile photo removed!" 
      });
      setTimeout(() => setAvatarMessage({ type: "", text: "" }), 3000);
    } catch (error) {
      setAvatarMessage({ type: "error", text: error.message });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setProfileMessage({ type: "error", text: "Name cannot be empty" });
      return;
    }
    
    setIsUpdatingProfile(true);
    setProfileMessage({ type: "", text: "" });
    
    try {
      const updatedUser = await updateUserProfile(user.id, { name: name.trim() });
      updateUser(updatedUser);
      setProfileMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (error) {
      setProfileMessage({ type: "error", text: error.message });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (!currentPassword) {
      setPasswordMessage({ type: "error", text: "Current password is required" });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "New password must be at least 6 characters" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match" });
      return;
    }
    
    setIsUpdatingPassword(true);
    setPasswordMessage({ type: "", text: "" });
    
    try {
      await updateUserProfile(user.id, { 
        currentPassword, 
        newPassword 
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage({ type: "success", text: "Password updated successfully!" });
    } catch (error) {
      setPasswordMessage({ type: "error", text: error.message });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const styles = {
    page: {
      minHeight: "100vh",
      backgroundColor: "hsl(var(--background))",
      paddingTop: "6rem",
      paddingBottom: "4rem",
    },
    container: {
      maxWidth: "640px",
      margin: "0 auto",
      padding: "0 1rem",
    },
    header: {
      textAlign: "center",
      marginBottom: "2rem",
    },
    avatarLarge: {
      width: "80px",
      height: "80px",
      borderRadius: "50%",
      backgroundColor: "hsl(var(--primary))",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "hsl(var(--primary-foreground))",
      fontSize: "2rem",
      fontWeight: 700,
      margin: "0 auto 1rem",
    },
    title: {
      fontSize: "1.75rem",
      fontWeight: 700,
      color: "hsl(var(--foreground))",
      marginBottom: "0.5rem",
    },
    email: {
      color: "hsl(var(--muted-foreground))",
      fontSize: "0.875rem",
    },
    card: {
      backgroundColor: "hsl(var(--card))",
      border: "1px solid hsl(var(--border))",
      borderRadius: "0.75rem",
      padding: "1.5rem",
      marginBottom: "1.5rem",
    },
    cardTitle: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "1.125rem",
      fontWeight: 600,
      color: "hsl(var(--foreground))",
      marginBottom: "1rem",
    },
    cardIcon: {
      color: "hsl(var(--primary))",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "0.5rem",
    },
    label: {
      fontSize: "0.875rem",
      fontWeight: 500,
      color: "hsl(var(--foreground))",
    },
    input: {
      padding: "0.75rem 1rem",
      borderRadius: "0.5rem",
      border: "1px solid hsl(var(--border))",
      backgroundColor: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      fontSize: "0.875rem",
      outline: "none",
      transition: "border-color 0.2s",
    },
    button: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.5rem",
      padding: "0.75rem 1.5rem",
      borderRadius: "0.5rem",
      border: "none",
      backgroundColor: "hsl(var(--primary))",
      color: "hsl(var(--primary-foreground))",
      fontSize: "0.875rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "opacity 0.2s",
      marginTop: "0.5rem",
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: "not-allowed",
    },
    message: {
      padding: "0.75rem 1rem",
      borderRadius: "0.5rem",
      fontSize: "0.875rem",
      marginBottom: "1rem",
    },
    successMessage: {
      backgroundColor: "hsl(var(--success) / 0.1)",
      color: "hsl(var(--success))",
      border: "1px solid hsl(var(--success) / 0.2)",
    },
    errorMessage: {
      backgroundColor: "hsl(var(--destructive) / 0.1)",
      color: "hsl(var(--destructive))",
      border: "1px solid hsl(var(--destructive) / 0.2)",
    },
    roleBadge: {
      display: "inline-block",
      padding: "0.25rem 0.75rem",
      borderRadius: "9999px",
      fontSize: "0.75rem",
      fontWeight: 600,
      textTransform: "uppercase",
      marginTop: "0.5rem",
    },
    adminBadge: {
      backgroundColor: "hsl(var(--primary) / 0.1)",
      color: "hsl(var(--primary))",
    },
    userBadge: {
      backgroundColor: "hsl(var(--muted))",
      color: "hsl(var(--muted-foreground))",
    },
  };

  return (
    <MainLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          {/* Header with Avatar Upload */}
          <div style={styles.header}>
            <ProfileAvatar 
              user={user} 
              onAvatarChange={handleAvatarChange}
              isUploading={isUploadingAvatar}
            />
            {avatarMessage.text && (
              <div style={{
                ...styles.message,
                ...(avatarMessage.type === "success" ? styles.successMessage : styles.errorMessage),
                marginTop: "1rem",
                marginBottom: 0,
              }}>
                {avatarMessage.text}
              </div>
            )}
            <h1 style={{ ...styles.title, marginTop: "1rem" }}>My Profile</h1>
            <p style={styles.email}>{user?.email}</p>
            <span style={{
              ...styles.roleBadge,
              ...(user?.role === "admin" ? styles.adminBadge : styles.userBadge)
            }}>
              {user?.role || "user"}
            </span>
          </div>

          {/* Profile Update Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <span style={styles.cardIcon}><UserIcon /></span>
              Update Profile
            </h2>
            
            {profileMessage.text && (
              <div style={{
                ...styles.message,
                ...(profileMessage.type === "success" ? styles.successMessage : styles.errorMessage)
              }}>
                {profileMessage.text}
              </div>
            )}
            
            <form onSubmit={handleProfileUpdate} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={styles.input}
                  placeholder="Enter your name"
                />
              </div>
              <button
                type="submit"
                disabled={isUpdatingProfile}
                style={{
                  ...styles.button,
                  ...(isUpdatingProfile ? styles.buttonDisabled : {})
                }}
              >
                {isUpdatingProfile ? "Updating..." : <><CheckIcon /> Save Changes</>}
              </button>
            </form>
          </div>

          {/* Password Update Card */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>
              <span style={styles.cardIcon}><LockIcon /></span>
              Change Password
            </h2>
            
            {passwordMessage.text && (
              <div style={{
                ...styles.message,
                ...(passwordMessage.type === "success" ? styles.successMessage : styles.errorMessage)
              }}>
                {passwordMessage.text}
              </div>
            )}
            
            <form onSubmit={handlePasswordUpdate} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={styles.input}
                  placeholder="Enter current password"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={styles.input}
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={styles.input}
                  placeholder="Confirm new password"
                />
              </div>
              <button
                type="submit"
                disabled={isUpdatingPassword}
                style={{
                  ...styles.button,
                  ...(isUpdatingPassword ? styles.buttonDisabled : {})
                }}
              >
                {isUpdatingPassword ? "Updating..." : <><LockIcon /> Update Password</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
