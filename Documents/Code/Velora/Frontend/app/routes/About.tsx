import Nav from "../components/Nav";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-[#333e38]">
      <Nav />

      {/* Hero Section */}
      <header className="bg-[#f2f4f3] py-20 px-4 sm:px-6 lg:px-8 text-center border-b border-[#e2e8e4]">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3e564c] mb-6">
            About Velora<span className="text-[#68a49c]">.</span>
          </h1>
          <p className="text-lg text-[#8c9490] leading-relaxed">
            Crafting timeless pieces for the modern home, inspired by nature's elegance. We believe that everyday spaces should bring peace and harmony to your life.
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        
        {/* Story Section: Image & Text */}
        <section className="flex flex-col md:flex-row gap-12 items-center mb-24">
          {/* Image Placeholder  
          //   <div className="aspect-[4/3] bg-[#e2e8e4] rounded-sm flex items-center justify-center relative overflow-hidden group">
          //     <span className="text-[#8c9490] text-sm tracking-widest uppercase relative z-10">
          //       Image Placeholder
          //     </span>
          //     {/* Optional subtle gradient to mimic a real photo container */}
               {/* <div className="absolute inset-0 bg-gradient-to-tr from-[#e2e8e4] to-[#f2f4f3] group-hover:scale-105 transition-transform duration-700"></div>
             </div>
           </div>  */}
            <div className="w-full md:w-1/2">
                <h1 className="text-6xl font-serif text-[#3e564c] mb-6 align-center justify-center flex">
                  Velora
                </h1>
            </div>

          {/* Text Content */}
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-sm tracking-widest uppercase text-[#68a49c] font-medium">
              Our Story
            </h2>
            <h3 className="text-3xl md:text-4xl font-serif text-[#3e564c]">
              Rooted in simplicity and mindful design.
            </h3>
            <p className="text-[#2a3731] leading-relaxed">
              Founded on the principles of sustainable living, Velora started as a small passion project. We noticed a gap between beautiful aesthetics and ethical craftsmanship, and we set out to bridge it.
            </p>
            <p className="text-[#8c9490] leading-relaxed">
              Today, we partner with artisans worldwide to bring you curated collections that celebrate both modern functionality and the quiet beauty of natural, long-lasting materials.
            </p>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="text-center">
          <h2 className="text-3xl font-serif text-[#3e564c] mb-12">Our Core Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="p-8 border border-[#e2e8e4] bg-[#f2f4f3] rounded-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-[#3e564c] text-white flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                </svg>
              </div>
              <h3 className="text-sm tracking-widest uppercase text-[#2a3731] font-medium mb-3">Sustainability</h3>
              <p className="text-[#8c9490] text-sm leading-relaxed">
                We prioritize eco-friendly materials and ethical manufacturing processes in everything we create.
              </p>
            </div>

            {/* Value 2 */}
            <div className="p-8 border border-[#e2e8e4] bg-[#f2f4f3] rounded-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-[#3e564c] text-white flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.828M11.42 15.17l-3.96-3.96a3 3 0 010-4.242l1.414-1.414a3 3 0 014.242 0l3.96 3.96M11.42 15.17l-.707.707M17.25 21l-3.535-3.536M15.17 11.42l-.707.707M11.42 15.17l-.707.707" />
                </svg>
              </div>
              <h3 className="text-sm tracking-widest uppercase text-[#2a3731] font-medium mb-3">Craftsmanship</h3>
              <p className="text-[#8c9490] text-sm leading-relaxed">
                Every piece is thoughtfully designed and meticulously crafted to last a lifetime, honoring traditional techniques.
              </p>
            </div>

            {/* Value 3 */}
            <div className="p-8 border border-[#e2e8e4] bg-[#f2f4f3] rounded-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-[#3e564c] text-white flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              </div>
              <h3 className="text-sm tracking-widest uppercase text-[#2a3731] font-medium mb-3">Simplicity</h3>
              <p className="text-[#8c9490] text-sm leading-relaxed">
                We believe in the power of minimalism, creating spaces and designs that are both highly functional and beautiful.
              </p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
};

export default About;