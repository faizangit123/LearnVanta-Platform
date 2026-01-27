import React from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

const MainLayout = ({ children, hideFooter = false }) => {
  const styles = {
    layout: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    main: {
      flex: 1,
      paddingTop: '4rem',
    },
  };

  return (
    <div style={styles.layout}>
      <Header />
      <main style={styles.main}>{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
