import { ArrowDown, Store } from "lucide-react";

function ThelaIllustration() {
  return (
    <svg viewBox="0 0 320 240" aria-hidden="true" className="thela-art">
      <g stroke="var(--color-teal)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 216h256" />
        <path d="M72 112v56m168-56v56" />
        <path d="m56 104 24-56h152l24 56Z" fill="var(--color-lavender)" />
        <path d="m120 48-8 56m56-56 8 56m32-56 24 56" fill="none" />
        <path d="M56 104v8a20 20 0 0 0 40 0 20 20 0 0 0 40 0 20 20 0 0 0 40 0 20 20 0 0 0 40 0 20 20 0 0 0 40 0v-8" fill="var(--color-lavender)" />
        <path d="M64 160h184v40H64z" fill="var(--color-lavender)" />
        <path d="M248 168h24v16" fill="none" />
        <circle cx="96" cy="204" r="12" fill="var(--color-page)" />
        <circle cx="216" cy="204" r="12" fill="var(--color-page)" />
        <path d="M88 160v-16h48v16m32 0v-24h48v24" fill="var(--color-green)" />
        <path d="M112 144v16m80-24v24" />
      </g>
    </svg>
  );
}

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
          <aside className="outline-card hello-card" aria-label="Tech Thela preview">
            <p className="font-semibold text-teal">Namaste, mohalla!</p>
            <ThelaIllustration />
            <p className="text-2xl font-semibold" lang="hi">अपना ठेला, अपनी पहचान।</p>
            <p className="mt-4">Abhi taiyaari chal rahi hai. Jaldi milte hain.</p>
          </aside>
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
