import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="relative min-h-screen w-full bg-white flex flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-gradient-to-br from-purple-200 via-indigo-200 to-sky-200 blur-3xl opacity-60" />
      </div>
      <header className="sticky top-0 z-10 backdrop-blur supports-[backdrop-filter]:bg-white/50 bg-white/70 border-b border-neutral-200">
        <div className="mx-auto max-w-screen-2xl px-4 py-3 flex items-center gap-4">
          <div className="text-lg font-semibold tracking-tight">MiniMind</div>
          <div className="flex-1" />
          <Link
            to="/editor"
            className="rounded-md bg-black text-white px-4 py-2 hover:bg-neutral-800 transition"
          >
            Open Editor
          </Link>
        </div>
      </header>
      <main className="relative flex-1">
        <div className="mx-auto max-w-screen-xl px-4 py-20">
          <div className="max-w-3xl">
            <h1 className="mt-5 text-5xl md:text-6xl font-extrabold tracking-tight text-neutral-900">
              A clean canvas to think <span className="bg-gradient-to-r from-neutral-900 to-neutral-500 bg-clip-text text-transparent">visually</span>.
            </h1>
            <p className="mt-5 text-lg text-neutral-600 leading-relaxed">
              Create nodes, connect ideas, and move freely. Save your progress locally and export to JSON.
              Built on React Flow for a delightful editing experience.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Link
                to="/editor"
                className="rounded-md bg-black text-white px-5 py-2.5 hover:bg-neutral-800 transition"
              >
                Start Mapping
              </Link>
            </div>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Fast & Fluid',
                desc: 'Pan, zoom, and connect with smooth interactions powered by React Flow.',
              },
              {
                title: 'Own your data',
                desc: 'Save to localStorage and export JSON. No servers, no signups.',
              },
              {
                title: 'Extensible',
                desc: 'Add AI or collaboration later. The codebase is structured to grow.',
              },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-neutral-200 bg-white/80 p-5 shadow-soft">
                <div className="text-base font-semibold text-neutral-900">{f.title}</div>
                <div className="mt-2 text-sm text-neutral-600">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

    </div>
  )
}


