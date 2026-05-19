import { useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import axios from "axios";

const Contact = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');


  const validateAndSubmitMessage = () => {
    if (!name.trim() || !email.trim() || !message.trim()) {
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      return;
    }

    if(message.trim().length < 180) {
      return;
    }

    axios.post('/api/usermessage', { name, email, message })
      .then(response => {
        console.log(response.data);
        setName('');
        setEmail('');
        setMessage('');
        LockBtn();
      })
      .catch(error => {
        console.error('Error submitting contact form:', error);
      });

      const LockBtn = () => {

      }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#333e38]">
      <Nav />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-24">
        
        {/* Contact & Email Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3e564c] mb-6">
            Contact Velora<span className="text-[#68a49c]">.</span>
          </h1>
          <p className="text-lg text-[#8c9490] leading-relaxed mb-10 max-w-2xl mx-auto">
            Crafting timeless pieces for the modern home, inspired by nature's elegance. 
            We believe that everyday spaces should bring peace and harmony to your life.
          </p>
          
          <div className="inline-block border-t border-[#e2e8e4] pt-8">
            <h2 className="text-sm tracking-widest uppercase text-[#68a49c] font-medium mb-3">
              Get in Touch
            </h2>
            <a 
              href="mailto:hello@velora.com" 
              className="text-2xl text-[#2a3731] hover:text-[#68a49c] transition-colors font-serif"
            >
              hello@velora.com
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <form className="bg-[#f2f4f3] p-8 md:p-12 border border-[#e2e8e4] rounded-sm shadow-sm">
          <div className="mb-6">
            <label htmlFor="name" className="block text-sm tracking-widest uppercase text-[#2a3731] mb-2">
              Name
            </label>
            <input 
              type="text" 
              id="name" 
              className="w-full bg-white border border-[#e2e8e4] text-[#2a3731] px-4 py-3 focus:outline-none focus:border-[#68a49c] focus:ring-1 focus:ring-[#68a49c] transition-colors rounded-sm"
              placeholder="Your Name"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm tracking-widest uppercase text-[#2a3731] mb-2">
              Email Address
            </label>
            <input 
              type="email" 
              id="email" 
              className="w-full bg-white border border-[#e2e8e4] text-[#2a3731] px-4 py-3 focus:outline-none focus:border-[#68a49c] focus:ring-1 focus:ring-[#68a49c] transition-colors rounded-sm"
              placeholder="you@example.com"
            />
          </div>

            <div className="mb-8">
                <label htmlFor="message" className="block text-sm tracking-widest uppercase text-[#2a3731] mb-2">
                    Message
                </label>
                <textarea
                    id="message"
                    rows={5}
                    className="w-full bg-white border border-[#e2e8e4] !text-[#2a3731] px-4 py-3 focus:outline-none focus:border-[#68a49c] focus:ring-1 focus:ring-[#68a49c] transition-colors rounded-sm resize-none"
                    placeholder="How can we help you?"
                ></textarea>
            </div>

          <button 
            type="submit" 
            className="w-full bg-[#3e564c] text-white uppercase tracking-widest text-sm py-4 rounded-sm hover:bg-[#2a3731] transition-colors duration-300"
            onClick={validateAndSubmitMessage}
          >
            Send Message
          </button>
        </form>

      </main>
      <Footer />
    </div>
  );
};

export default Contact;