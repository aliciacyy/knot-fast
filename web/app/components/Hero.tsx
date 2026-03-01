import Link from "next/link";

export default function Hero() {
return (
    <section className="mx-auto max-w-5xl px-4 pt-14 sm:pt-16">
        <div className="card-float animate-fadeUp rounded-3xl border border-black/10 bg-white/60 p-6 backdrop-blur sm:p-10">
          {/* <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-black/60">
            <span className="h-1.5 w-1.5 rounded-full bg-black/25" />
            crochet journal
          </div> */}

          <h1 className="mt-5 font-serif text-4xl tracking-tight sm:text-5xl">
            Handmade pieces, one stitch at a time.
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-black/60 sm:text-lg">
            A small, cozy archive of my crochet works. 
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/crochets"
              className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-black/90"
            >
              Browse gallery
            </Link>

            <Link
                href="/studio"
                className="rounded-full border border-black/15 bg-white/70 px-5 py-2.5 text-sm font-medium text-black/75 hover:bg-white"
              >
                About
              </Link>
          </div>
        </div>
      </section>
);
}
