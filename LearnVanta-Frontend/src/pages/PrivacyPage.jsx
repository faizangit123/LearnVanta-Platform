import React from "react";
import { MainLayout } from "../components/layout";

const PrivacyPage = () => {
  return (
    <MainLayout>
      <div className="static-page">
        <section className="static-hero legal-hero">
          <div className="container">
            <div className="static-hero-content">
              <h1>Privacy Policy</h1>
              <p>Last updated: January 2024</p>
            </div>
          </div>
        </section>

        <section className="static-section">
          <div className="container">
            <div className="legal-content">
              <div className="legal-section">
                <h2>1. Introduction</h2>
                <p>
                  Welcome to EduStream ("we," "our," or "us"). We are committed to protecting 
                  your personal information and your right to privacy. This Privacy Policy 
                  explains how we collect, use, disclose, and safeguard your information when 
                  you visit our website and use our services.
                </p>
              </div>

              <div className="legal-section">
                <h2>2. Information We Collect</h2>
                <h3>Personal Information</h3>
                <p>We may collect personal information that you voluntarily provide to us when you:</p>
                <ul>
                  <li>Register for an account</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Contact us through our website</li>
                  <li>Participate in surveys or promotions</li>
                </ul>
                <p>This information may include:</p>
                <ul>
                  <li>Name and email address</li>
                  <li>Phone number</li>
                  <li>Educational details (class, school)</li>
                  <li>Learning preferences</li>
                </ul>

                <h3>Automatically Collected Information</h3>
                <p>
                  When you access our website, we automatically collect certain information 
                  about your device, including:
                </p>
                <ul>
                  <li>IP address and browser type</li>
                  <li>Operating system</li>
                  <li>Access times and pages viewed</li>
                  <li>Referring website addresses</li>
                </ul>
              </div>

              <div className="legal-section">
                <h2>3. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Provide and maintain our educational services</li>
                  <li>Personalize your learning experience</li>
                  <li>Send you updates, newsletters, and educational content</li>
                  <li>Respond to your comments, questions, and requests</li>
                  <li>Monitor and analyze usage patterns and trends</li>
                  <li>Improve our website and services</li>
                  <li>Protect against unauthorized access and legal liability</li>
                </ul>
              </div>

              <div className="legal-section">
                <h2>4. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational security measures to 
                  protect your personal information. However, no method of transmission over 
                  the Internet is 100% secure, and we cannot guarantee absolute security.
                </p>
              </div>

              <div className="legal-section">
                <h2>5. Third-Party Services</h2>
                <p>
                  Our website may contain links to third-party websites or services. We are 
                  not responsible for the privacy practices of these third parties. We encourage 
                  you to read their privacy policies.
                </p>
              </div>

              <div className="legal-section">
                <h2>6. Children's Privacy</h2>
                <p>
                  Our services are designed for students of all ages. For users under 18, we 
                  encourage parental guidance and supervision. We do not knowingly collect 
                  personal information from children under 13 without parental consent.
                </p>
              </div>

              <div className="legal-section">
                <h2>7. Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </div>

              <div className="legal-section">
                <h2>8. Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of 
                  any changes by posting the new Privacy Policy on this page and updating the 
                  "Last updated" date.
                </p>
              </div>

              <div className="legal-section">
                <h2>9. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <ul>
                  <li>Email: faizanrock@gmail.com</li>
                  <li>Phone: +91 1122334455</li>
                  <li>Address: 123 Education, New Delhi, India</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default PrivacyPage;
