export default function Footer() {
    return (
       <footer className="border-t border-black/10 bg-white/40">
        <div className="mx-auto max-w-5xl px-4 py-10 text-sm text-black/55">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} Crochet Journal</p>
            <p className="text-black/45">Made with yarn, patience, and a little bit of Next.js.</p>
          </div>
        </div>
      </footer>
    );
}