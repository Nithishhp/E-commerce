import Button from '../ui/Button';

export default function Hero() {
  return (
    <section className="relative h-[80vh] flex items-center justify-center bg-gradient-to-r from-green-600 to-green-800 text-white">
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">Grow Your Own Vegetables</h1>
        <p className="text-xl md:text-2xl mb-8">Start your home gardening journey with our premium saplings</p>
        <Button variant="secondary" size="lg">
          Shop Now
        </Button>
      </div>
    </section>
  );
} 