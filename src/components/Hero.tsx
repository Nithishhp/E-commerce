export default function Hero() {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center bg-gradient-to-br from-green-500 via-green-600 to-emerald-800 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[url('/noice.svg')] opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
      
      {/* Floating leaf decorations */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-green-400 rounded-full opacity-20 blur-xl animate-float1" />
      <div className="absolute bottom-1/4 right-20 w-24 h-24 bg-emerald-300 rounded-full opacity-15 blur-xl animate-float2" />
      
      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
          <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-100 animate-text-fade">
            Grow Your Own 
          </span>
          <br />
          <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 to-green-300 animate-text-fade-delay">
            Organic Vegetables
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-green-100 font-light drop-shadow-lg">
          Start your sustainable home gardening journey with our premium, ethically-sourced saplings and expert guidance
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="relative overflow-hidden group bg-white text-green-800 px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
            <span className="relative z-10">Shop Now</span>
            <span className="absolute inset-0 bg-gradient-to-r from-green-100 to-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          
          <button className="relative overflow-hidden group border-2 border-white/30 text-white px-8 py-4 rounded-full text-lg font-semibold hover:border-white/60 transition-all duration-300 hover:-translate-y-1">
            <span className="relative z-10">Learn More</span>
            <span className="absolute inset-0 bg-white/5 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
      
      {/* Decorative plant illustration at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-[url('/plant-borders.svg')] bg-repeat-x bg-bottom opacity-80" />
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white/80 rounded-full mt-2 animate-scroll-indicator" />
        </div>
      </div>
    </section>
  );
}