import { useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import axios from "axios";

const Contact = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const validateAndSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccess(false);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg('All fields are required.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (message.trim().length < 180) {
      setErrorMsg('Message must be at least 180 characters long.');
      return;
    }

    if (message.trim().length > 450) {
      setErrorMsg('Message cannot exceed 450 characters.');
      return;
    }

    axios.post('/api/usermessage', { name, email, message })
      .then(response => {
        console.log(response.data);
        setName('');
        setEmail('');
        setMessage('');
        setSuccess(true);
        LockBtn();
      })
      .catch(error => {
        console.error('Error submitting contact form:', error);
        setErrorMsg(error.response?.data || 'Error submitting contact form. Please try again.');
      });
  };

  const LockBtn = () => {
    setIsLocked(true);
  };

  const getCharCountColor = () => {
    const len = message.trim().length;
    if (len === 0) return 'text-[#8c9490]';
    if (len < 30 || len > 450) return 'text-red-500';
    return 'text-green-600';
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
        <form onSubmit={validateAndSubmitMessage} className="bg-[#f2f4f3] p-8 md:p-12 border border-[#e2e8e4] rounded-sm shadow-sm">
          {success && (
            <div className="mb-6 p-4 bg-[#e2f0d9] text-[#3e564c] border border-[#c5e0b4] rounded-sm text-sm">
              Thank you! Your message has been sent successfully.
            </div>
          )}
          {errorMsg && (
            <div className="mb-6 p-4 bg-[#f8d7da] text-[#721c24] border border-[#f5c6cb] rounded-sm text-sm">
              {errorMsg}
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="name" className="block text-sm tracking-widest uppercase text-[#2a3731] mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-[#e2e8e4] text-[#2a3731] px-4 py-3 focus:outline-none focus:border-[#68a49c] focus:ring-1 focus:ring-[#68a49c] transition-colors rounded-sm"
              placeholder="Your Name"
              disabled={isLocked}
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block text-sm tracking-widest uppercase text-[#2a3731] mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-[#e2e8e4] text-[#2a3731] px-4 py-3 focus:outline-none focus:border-[#68a49c] focus:ring-1 focus:ring-[#68a49c] transition-colors rounded-sm"
              placeholder="you@example.com"
              disabled={isLocked}
              required
            />
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="message" className="block text-sm tracking-widest uppercase text-[#2a3731]">
                Message
              </label>
              <span className={`text-xs ${getCharCountColor()}`}>
                {message.trim().length} / 30-450 characters
              </span>
            </div>
            <textarea
              id="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-white border border-[#e2e8e4] !text-[#2a3731] px-4 py-3 focus:outline-none focus:border-[#68a49c] focus:ring-1 focus:ring-[#68a49c] transition-colors rounded-sm resize-none"
              placeholder="How can we help you? (Minimum 30 characters)"
              disabled={isLocked}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isLocked}
            className={`w-full uppercase tracking-widest text-sm py-4 rounded-sm transition-colors duration-300 ${isLocked
              ? "bg-[#8c9490] text-[#e2e8e4] cursor-not-allowed"
              : "bg-[#3e564c] text-white hover:bg-[#2a3731]"
              }`}
          >
            {isLocked ? "Message Sent" : "Send Message"}
          </button>
        </form>

      </main>
      <Footer />
    </div>
  );
};

export default Contact;