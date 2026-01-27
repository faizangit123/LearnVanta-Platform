import React from "react";
import { MainLayout } from "../components/layout";

const TermsPage = () => {
  return (
    <MainLayout>
      <div className="static-page">
        <section className="static-hero legal-hero">
          <div className="container">
            <div className="static-hero-content">
              <h1>Terms of Service</h1>
              <p>Last updated: January 2024</p>
            </div>
          </div>
        </section>

        <section className="static-section">
          <div className="container">
            <div className="legal-content">
              <div className="legal-section">
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing and using EduStream's website and services, you accept and agree 
                  to be bound by these Terms of Service. If you do not agree to these terms, 
                  please do not use our services.
                </p>
              </div>

              <div className="legal-section">
                <h2>2. Description of Services</h2>
                <p>
                  EduStream provides online educational video content, study materials, and 
                  learning resources primarily focused on Mathematics and related subjects for 
                  students from Class 8 to College level.
                </p>
              </div>

              <div className="legal-section">
                <h2>3. User Accounts</h2>
                <h3>Registration</h3>
                <p>
                  To access certain features, you may need to create an account. You agree to:
                </p>
                <ul>
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Notify us immediately of any unauthorized access</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>

                <h3>Account Termination</h3>
                <p>
                  We reserve the right to suspend or terminate accounts that violate these 
                  terms or engage in prohibited activities.
                </p>
              </div>

              <div className="legal-section">
                <h2>4. Intellectual Property</h2>
                <p>
                  All content on EduStream, including videos, text, graphics, logos, and 
                  software, is the property of EduStream or its content providers and is 
                  protected by copyright and other intellectual property laws.
                </p>
                <p>You may not:</p>
                <ul>
                  <li>Copy, modify, or distribute our content without permission</li>
                  <li>Use our content for commercial purposes</li>
                  <li>Remove any copyright or proprietary notices</li>
                  <li>Create derivative works based on our content</li>
                </ul>
              </div>

              <div className="legal-section">
                <h2>5. User Conduct</h2>
                <p>When using our services, you agree not to:</p>
                <ul>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on the rights of others</li>
                  <li>Upload harmful or malicious content</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with other users' enjoyment of the services</li>
                  <li>Use automated systems to access our content</li>
                </ul>
              </div>

              <div className="legal-section">
                <h2>6. Educational Content</h2>
                <p>
                  Our educational content is provided for informational and learning purposes 
                  only. While we strive for accuracy, we do not guarantee that the content is 
                  error-free or suitable for any particular purpose.
                </p>
              </div>

              <div className="legal-section">
                <h2>7. Disclaimer of Warranties</h2>
                <p>
                  Our services are provided "as is" without warranties of any kind, either 
                  express or implied. We do not warrant that our services will be uninterrupted, 
                  secure, or error-free.
                </p>
              </div>

              <div className="legal-section">
                <h2>8. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law, EduStream shall not be liable for 
                  any indirect, incidental, special, consequential, or punitive damages arising 
                  from your use of our services.
                </p>
              </div>

              <div className="legal-section">
                <h2>9. Indemnification</h2>
                <p>
                  You agree to indemnify and hold harmless EduStream and its affiliates from 
                  any claims, damages, or expenses arising from your use of our services or 
                  violation of these terms.
                </p>
              </div>

              <div className="legal-section">
                <h2>10. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these Terms of Service at any time. Changes 
                  will be effective immediately upon posting. Continued use of our services 
                  after changes constitutes acceptance of the modified terms.
                </p>
              </div>

              <div className="legal-section">
                <h2>11. Governing Law</h2>
                <p>
                  These Terms of Service shall be governed by and construed in accordance 
                  with the laws of India. Any disputes shall be subject to the exclusive 
                  jurisdiction of the courts in New Delhi.
                </p>
              </div>

              <div className="legal-section">
                <h2>12. Contact Information</h2>
                <p>
                  For questions about these Terms of Service, please contact us at:
                </p>
                <ul>
                  <li>Email: legal@edustream.com</li>
                  <li>Phone: +91 98765 43210</li>
                  <li>Address: 123 Education Lane, New Delhi, India</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default TermsPage;
