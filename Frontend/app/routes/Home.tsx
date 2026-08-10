import React from 'react';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const CATEGORIES = [
  { key: 'parfuemDuefte', href: '/products?category=parfuem-duefte', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800' },
  { key: 'pflegeHygiene', href: '/products?category=pflege-hygiene', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800' },
  { key: 'gesichtHaut', href: '/products?category=gesicht-haut', image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=800' },
  { key: 'haarBart', href: '/products?category=haar-bart', image: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=80&w=800' },
  { key: 'makeUp', href: '/products?category=make-up', image: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?auto=format&fit=crop&q=80&w=800' },
  { key: 'oeleEssenzen', href: '/products?category=oele-essenzen', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=800' },
  { key: 'haushaltReinigung', href: '/products?category=haushalt-reinigung', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800' },
  { key: 'ernaehrungVitalitaet', href: '/products?category=ernaehrung-vitalitaet', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800' },
] as const;

const Home = () => {
  const { t } = useTranslation();
  return (
    <div className="font-sans min-h-screen bg-[#f8f9f8]">
      <Nav />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1615397323214-7f1545dbf416?auto=format&fit=crop&q=80&w=2000"
            alt="Velora Hero"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#2a3731]/80 to-[#2a3731]/40 mix-blend-multiply" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <span className="block text-sm md:text-base text-[#d8e2df] tracking-[0.3em] uppercase mb-4 opacity-0 animate-fade-in-up">
            {t('home.heroKicker')}
          </span>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
            {t('home.heroTitle')}
          </h1>
          <p className="text-lg md:text-xl text-[#d8e2df] mb-10 max-w-2xl mx-auto opacity-0 animate-fade-in-up font-light" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
            {t('home.heroSubtitle')}
          </p>
          <div className="opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
            <Link
              to="/products"
              className="inline-block bg-[#68a49c] hover:bg-[#528a83] text-white px-10 py-4 font-medium tracking-widest uppercase transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#68a49c]/30 rounded-sm"
            >
              {t('home.heroCta')}
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm tracking-[0.2em] font-bold uppercase text-[#68a49c] mb-2">{t('home.ourWorlds')}</h2>
          <h3 className="text-4xl font-serif text-[#2a3731]">{t('home.findProducts')}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {CATEGORIES.map((cat, index) => (
            <Link
              key={cat.key}
              to={cat.href}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 block"
            >
              {/* Category Image */}
              <div className="absolute inset-0">
                <img
                  src={cat.image}
                  alt={t(`categories.${cat.key}`)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2a3731]/90 via-[#2a3731]/20 to-transparent transition-opacity duration-300 group-hover:via-[#2a3731]/40" />

              {/* Text Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                  <h4 className="text-xl font-serif text-white mb-2">{t(`categories.${cat.key}`)}</h4>
                  <div className="flex items-center text-[#d8e2df] text-sm uppercase tracking-wider font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {t('home.discover')}
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Feature Section with Background */}
      <section className="py-24 bg-[#eef1f0] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md aspect-[3/4] rounded-tr-[100px] rounded-bl-[100px] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1590439471364-192aa70c0b53?auto=format&fit=crop&q=80&w=800"
                alt="Quality Products"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 text-left">
            <h2 className="text-sm tracking-[0.2em] font-bold uppercase text-[#68a49c] mb-2">{t('home.philosophyKicker')}</h2>
            <h3 className="text-4xl font-serif text-[#2a3731] mb-6">{t('home.philosophyTitle')}</h3>
            <p className="text-[#5b6a62] text-lg font-light leading-relaxed mb-8">
              {t('home.philosophyText')}
            </p>
            <Link
              to="/about"
              className="inline-flex items-center text-[#2a3731] font-semibold uppercase tracking-widest hover:text-[#68a49c] transition-colors group"
            >
              {t('home.moreAboutUs')}
              <span className="block w-12 h-[2px] bg-[#2a3731] ml-4 group-hover:w-16 group-hover:bg-[#68a49c] transition-all duration-300"></span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      {/* CSS for custom animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default Home;
