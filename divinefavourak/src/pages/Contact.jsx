import React from "react";

function Contact() {
  return (
    <main className="contact">
      <h1 className="page-title">
        Get In <span>Touch</span>
      </h1>
      <p className="page-subtitle">
        Have a project in mind or want to collaborate? Feel free to reach out!
      </p>

      <div className="contact-container">
        <div className="contact-info">
          <div className="info-box">
            <div className="icon">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="details">
              <h3>Location</h3>
              <p>Lagos, Nigeria</p>
            </div>
          </div>

          <div className="info-box">
            <div className="icon">
              <i className="fas fa-envelope"></i>
            </div>
            <div className="details">
              <h3>Email</h3>
              <p>divinefavourakanbi07@gmail.com</p>
            </div>
          </div>

          <div className="info-box">
            <div className="icon">
              <i className="fas fa-phone-alt"></i>
            </div>
            <div className="details">
              <h3>Phone</h3>
              <p>+2349031843486</p>
            </div>
          </div>

          <div className="social-links">
            <h3>Follow Me</h3>
            <div className="links">
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-github"></i></a>
              <a href="#"><i className="fab fa-linkedin-in"></i></a>
              <a href="#"><i className="fab fa-dribbble"></i></a>
              <a href="#"><i className="fab fa-behance"></i></a>
            </div>
          </div>
        </div>

        <div className="contact-form">
          <form action="https://formspree.io/f/xwpbqogl" method="POST">
            <div className="form-group">
              <input type="text" name="name" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <input type="email" name="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <input type="text" name="subject" placeholder="Subject" />
            </div>
            <div className="form-group">
              <textarea name="message" rows="5" placeholder="Your Message" required></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>
        </div>
      </div>
    </main>
  );
}

export default Contact;
