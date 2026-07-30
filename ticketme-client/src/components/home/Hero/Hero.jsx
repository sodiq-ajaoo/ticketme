import HeroContent from './HeroContent';
import HeroPoster from './HeroPoster';

function Hero() {
  return (
    <section className="bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <HeroContent />

          <div className="flex justify-center lg:justify-end">
            <HeroPoster />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
