import { useState } from "react";
import SectionHeader from "../components/SectionHeader";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Connect to backend mailer
    setSubmitted(true);
  };

  return (
    <section className="section section--padded">
      <SectionHeader
        eyebrow="CONTACT"
        title="Let's make something great together."
        text="Whether you have a campaign in mind or just want to explore possibilities, we're here to listen."
      />

      <div className="contact-grid">
        {/* Contact Info */}
        <div className="contact-info">
          <div className="contact-card">
            <div className="contact-card__icon">📍</div>
            <h3>VISIT US</h3>
            <p>
              Level - 6<br />
              29, Kawran Bazar
              <br />
              Dhaka - 1215
              <br />
              Bangladesh
            </p>
          </div>

          <div className="contact-card">
            <div className="contact-card__icon">📞</div>
            <h3>CALL US</h3>
            <p>
              <a href="tel:+8802XXXXXXXX">+880 2 XXX XXXX</a>
            </p>
            <p className="contact-card__sub">Sunday–Thursday, 10AM–7PM</p>
          </div>

          <div className="contact-card">
            <div className="contact-card__icon">✉️</div>
            <h3>EMAIL US</h3>
            <p>
              <a href="mailto:hello@reddot.com.bd">hello@reddot.com.bd</a>
            </p>
            <p>
              <a href="mailto:productions@reddot.com.bd">
                productions@reddot.com.bd
              </a>
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="contact-form-wrapper">
          {submitted ? (
            <div className="contact-success">
              <div className="contact-success__icon">✓</div>
              <h3>THANK YOU</h3>
              <p>
                Your message has been received. We'll get back to you within 24
                hours.
              </p>
              <button
                type="button"
                className="button button--ghost"
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: "", email: "", subject: "", message: "" });
                }}
              >
                SEND ANOTHER MESSAGE
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <h3>SEND A MESSAGE</h3>

              <div className="contact-form__row">
                <label className="contact-form__field">
                  <span>NAME</span>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </label>

                <label className="contact-form__field">
                  <span>EMAIL</span>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </label>
              </div>

              <label className="contact-form__field">
                <span>SUBJECT</span>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  placeholder="What's this about?"
                  required
                />
              </label>

              <label className="contact-form__field">
                <span>MESSAGE</span>
                <textarea
                  rows="6"
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  placeholder="Tell us about your project, timeline, and budget..."
                  required
                />
              </label>

              <button
                type="submit"
                className="button button--solid button--full"
              >
                SEND MESSAGE
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Map Section */}
      <div className="contact-map">
        <h3>FIND US ON THE MAP</h3>
        <div className="contact-map__placeholder">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d919.3195148883281!2d90.39560859835947!3d23.75183902170854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b9004f4daf99%3A0xe1bfc1f2860cb290!2sTEAM%20Group%20%7C%20Brand%20Marketing%20%26%20Communication!5e0!3m2!1sen!2sbd!4v1778065981849!5m2!1sen!2sbd"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="RED DOT — Level 6, TEAM Building, 29 Kawran Bazar, Dhaka 1215"
          />
        </div>
        <div className="contact-map__address">
          <span className="contact-map__pin">🔴</span>
          <div>
            <strong>RED DOT</strong>
            <p>Level 6, TEAM Building, 29 Kawran Bazar, Dhaka 1215</p>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="contact-social">
        <h3>FOLLOW RED DOT</h3>
        <div className="contact-social__links">
          <a
            href="https://facebook.com/reddotbd"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-social__link"
          >
            FACEBOOK
          </a>
          <a
            href="https://instagram.com/reddotbd"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-social__link"
          >
            INSTAGRAM
          </a>
          <a
            href="https://youtube.com/@reddotbd"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-social__link"
          >
            YOUTUBE
          </a>
          <a
            href="https://linkedin.com/company/reddotbd"
            target="_blank"
            rel="noopener noreferrer"
            className="contact-social__link"
          >
            LINKEDIN
          </a>
        </div>
      </div>
    </section>
  );
}
