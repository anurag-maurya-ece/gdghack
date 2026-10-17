import { ArrowDown, Store } from "lucide-react";
import ThelaScene from "./thela-scene";


export default function Home() {
  return (
    <>
      <header className="bg-navy text-page">
        <div className="shell flex min-h-20 items-center gap-4">
          <Store size={32} strokeWidth={2} aria-hidden="true" className="text-green" />
          <span className="text-2xl font-semibold">Tech Thela<span className="text-green">.</span></span>
        </div>
      </header>
      <main id="main" className="shell py-16" tabIndex={-1}>
        <div className="hello-layout">
          <section aria-labelledby="hello-title">
            <p className="mb-4 font-semibold text-teal">Apni gali. Apne log.</p>
            <h1 id="hello-title" className="hello-title">
              Aapka <mark>thela,</mark><br />ab sabki nazar mein.
            </h1>
            <p className="mt-8 max-w-lg text-xl">
              Gali ke kone se, seedha aap tak. Apne aas-paas ke thele walon se judne ki ek nayi shuruaat.
            </p>
            <a href="#about" className="button mt-8">
              Tech Thela kya hai? <ArrowDown size={24} strokeWidth={2} aria-hidden="true" />
            </a>
          </section>
          <ThelaScene />
        </div>
        <section id="about" aria-labelledby="about-title" className="about-section">
          <p className="mb-4 font-semibold text-teal">Bridge the Gap</p>
          <h2 id="about-title" className="text-3xl font-semibold">Chhota thela. Bada connection.</h2>
          <p className="mt-4 max-w-2xl text-xl">
            Tech Thela is being built to connect street vendors and their neighbours through a live map, orders and conversations in their own language.
          </p>
          <p className="mt-4 max-w-2xl">This is an early preview. Vendor discovery, ordering and chat are not available yet.</p>
        </section>
      </main>
      <footer className="bg-navy py-8 text-page">
        <div className="shell">Tech Thela / WEkreta <span className="text-green">·</span> Mohalle se, pyaar se.</div>
      </footer>
    </>
  );
}
