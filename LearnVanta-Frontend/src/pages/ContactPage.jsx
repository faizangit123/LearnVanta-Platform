import React, { useState } from "react";
import { MainLayout } from "../components/layout";

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z"></path>
    <path d="M22 2 11 13"></path>
  </svg>
);

const contactInfo = [
  {
    icon: <MailIcon />,
    title: "Email",
    value: "support@edustream.com",
    link: "mailto:support@edustream.com",
  },
  {
    icon: <PhoneIcon />,
    title: "Phone",
    value: "+91 98765 43210",
    link: "tel:+919876543210",
  },
  {
    icon: <MapPinIcon />,
    title: "Address",
    value: "123 Education Lane, New Delhi, India",
    link: null,
  },
  {
    icon: <ClockIcon />,
    title: "Working Hours",
    value: "Mon - Sat: 9:00 AM - 6:00 PM",
    link: null,
  },
];

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <MainLayout>
      <div className="static-page">
        {/* Hero Section */}
        <section className="static-hero contact-hero">
          <div className="container">
            <div className="static-hero-content">
              <h1>Contact Us</h1>
              <p>
                Have questions? We'd love to hear from you. Send us a message 
                and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="static-section">
          <div className="container">
            <div className="contact-grid">
              {/* Contact Form */}
              <div className="contact-form-wrapper">
                <h2>Send us a Message</h2>
                {submitted ? (
                  <div className="form-success">
                    <div className="success-icon">✓</div>
                    <h3>Message Sent!</h3>
                    <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
                    <button 
                      className="btn btn-primary btn-md"
                      onClick={() => setSubmitted(false)}
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="name">Your Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          className="input"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          className="input"
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="subject">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        className="input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="message">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us more about your inquiry..."
                        className="input textarea"
                        rows={5}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <SendIcon />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Contact Info */}
              <div className="contact-info">
                <h2>Get in Touch</h2>
                <p>
                  We're here to help and answer any question you might have. 
                  We look forward to hearing from you.
                </p>
                <div className="contact-info-list">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="contact-info-item">
                      <div className="contact-info-icon">{item.icon}</div>
                      <div className="contact-info-content">
                        <h4>{item.title}</h4>
                        {item.link ? (
                          <a href={item.link}>{item.value}</a>
                        ) : (
                          <p>{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="static-section faq-section">
          <div className="container">
            <div className="section-header">
              <h2>Frequently Asked Questions</h2>
              <p>Quick answers to common questions</p>
            </div>
            <div className="faq-grid">
              <div className="faq-item">
                <h4>How do I access the video lessons?</h4>
                <p>Simply create a free account and browse through our class-wise video library. All videos are available for free.</p>
              </div>
              <div className="faq-item">
                <h4>Are the videos aligned with NCERT curriculum?</h4>
                <p>Yes, all our videos are designed to align with the NCERT curriculum and cover all board exam topics.</p>
              </div>
              <div className="faq-item">
                <h4>Can I download the study materials?</h4>
                <p>Yes, PDF notes and practice sheets are available for download on each video page.</p>
              </div>
              <div className="faq-item">
                <h4>How can I track my learning progress?</h4>
                <p>Once logged in, you can track your progress, save notes, and bookmark videos for later viewing.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default ContactPage;
