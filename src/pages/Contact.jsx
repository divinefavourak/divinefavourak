import React from "react";
import SocialLinks from "../components/SocialLinks";
import SimpleSocialLinks from "../components/SocialLinks";

function Contact() {
  return (
    <main className="container">
      <div className="terminal-window">
        <h1 style={{ marginBottom: "2rem" }}>&gt; Initiate_Connection</h1>
        
        <form action="https://formspree.io/f/xwpbqogl" method="POST" style={{ maxWidth: "600px" }}>
          <div className="form-group">
            <label style={{ display:"block", color: "#888", marginBottom: "5px", fontSize: "0.9rem" }}>// ENTER ID (NAME)</label>
            <input type="text" name="name" className="form-control" placeholder="Guest_User" required />
          </div>
          
          <div className="form-group">
            <label style={{ display:"block", color: "#888", marginBottom: "5px", fontSize: "0.9rem" }}>// ENTER FREQUENCY (EMAIL)</label>
            <input type="email" name="email" className="form-control" placeholder="user@domain.com" required />
          </div>
          
          <div className="form-group">
            <label style={{ display:"block", color: "#888", marginBottom: "5px", fontSize: "0.9rem" }}>// DATA PACKET (MESSAGE)</label>
            <textarea name="message" rows="5" className="form-control" placeholder="Type your message here..." required></textarea>
          </div>

          <button type="submit" className="btn">
            &gt; SEND_TRANSMISSION
          </button>
        </form>

        <div style={{ marginTop: "3rem", borderTop: "1px dashed #444", paddingTop: "1rem" }}>
          <p><strong>Loc:</strong> Lagos, Nigeria</p>
          <p><strong>Tel:</strong> +234 903 184 3486</p>
          <p><strong>Mail:</strong> divinefavourakanbi07@gmail.com</p>
          <SocialLinks />
        </div>
      </div>
    </main>
  );
}

export default Contact;