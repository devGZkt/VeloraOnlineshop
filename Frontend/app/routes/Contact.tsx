import { useState } from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import axios from "axios";

const MESSAGE_MIN_LENGTH = 180;

const Contact = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateAndSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill out all fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (message.trim().length < MESSAGE_MIN_LENGTH) {
      setError(`Your message must be at least ${MESSAGE_MIN_LENGTH} characters long.`);
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      await axios.post('/api/contact', {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
      setName('');
      setEmail('');
      setMessage('');
      setSuccess(true);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data || "Something went wrong. Please try again later.";
      setError(typeof msg === "string" ? msg : "Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
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
        <form className="bg-[#f2f4f3] p-8 md:p-12 border border-[#e2e8e4] rounded-sm shadow-sm" onSubmit={validateAndSubmitMessage}>
          {error && (
            <div className="mb-6 p-3 rounded-sm bg-red-50 border border-red-200 text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-3 rounded-sm bg-green-50 border border-green-200 text-green-700 text-sm text-center">
              Thank you for reaching out. We'll get back to you soon.
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
            />
          </div>

          <div className="mb-8">
            <label htmlFor="message" className="block text-sm tracking-widest uppercase text-[#2a3731] mb-2">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-white border border-[#e2e8e4] text-[#2a3731] px-4 py-3 focus:outline-none focus:border-[#68a49c] focus:ring-1 focus:ring-[#68a49c] transition-colors rounded-sm resize-none"
              placeholder="How can we help you?"
            ></textarea>
            <p className="mt-2 text-xs text-[#8c9490]">{message.trim().length}/{MESSAGE_MIN_LENGTH} characters minimum</p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#3e564c] text-white uppercase tracking-widest text-sm py-4 rounded-sm hover:bg-[#2a3731] disabled:opacity-50 transition-colors duration-300"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>

      </main>
      <Footer />
    </div>
  );
};

export default Contact;
