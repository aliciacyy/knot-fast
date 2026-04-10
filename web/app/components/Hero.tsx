export default function Hero() {
  return (
    <section className="mx-auto max-w-5xl px-4 pt-2 sm:pt-4">
      <div className="animate-fadeUp relative overflow-hidden rounded-[2.25rem] border border-white/50 bg-[#f9eadf]/45 px-6 py-16 shadow-[0_28px_90px_rgba(92,60,38,0.12)] backdrop-blur sm:px-10 sm:py-24 lg:px-14">
        <div className="relative z-10">
          <div className="max-w-4xl">
            <h1 className="font-serif text-[3.85rem] leading-[0.82] tracking-[-0.08em] text-black/90 sm:text-[4.4rem] lg:text-[6.4rem]">
              <span className="hero-title-line">Knot Fast</span>
            </h1>

            <div
              className="hero-thread relative mt-6 h-12 w-full text-[#8f5d3e]/30"
              aria-hidden="true"
            >
              <div className="hero-thread-reveal absolute inset-0 origin-left overflow-hidden">
                <svg
                  className="h-full w-full"
                  viewBox="0 0 960 64"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M8 35C95 12 151 58 226 34C295 12 355 51 420 34C495 15 548 49 612 35C690 18 749 14 819 33C871 47 912 47 952 32"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <p className="hero-copy mt-4 max-w-xl text-lg leading-8 text-black/62 sm:text-xl">
              A small, cozy archive of my crochet works.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
