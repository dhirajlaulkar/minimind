import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="relative min-h-screen w-full bg-[#FDE047] text-black flex flex-col">
      <header className="sticky top-0 z-20 border-b-4 border-black bg-white shadow-[8px_8px_0_#000]">
        <div className="mx-auto max-w-screen-2xl px-6 py-5 flex items-center gap-6 uppercase font-black tracking-tightest">
          <div className="text-2xl">MiniMind</div>
          <div className="hidden md:flex items-center gap-4 text-xs font-semibold tracking-[0.2em]">
            <span className="px-3 py-2 border-3 border-black bg-[#F472B6] shadow-[4px_4px_0_#000]">Plan Bold</span>
            <span className="px-3 py-2 border-3 border-black bg-[#22D3EE] shadow-[4px_4px_0_#000]">Think Loud</span>
          </div>
          <div className="flex-1" />
          <Link
            to="/editor"
            className="px-6 py-3 border-4 border-black bg-[#F472B6] shadow-[4px_4px_0_#000] uppercase font-black tracking-tightest transition-transform duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_#000]"
          >
            Open Editor
          </Link>
        </div>
      </header>
      <main className="relative flex-1 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-grid opacity-60" />
        <div className="relative mx-auto max-w-screen-xl px-6 py-20 flex flex-col gap-16">
          <div className="grid gap-12 lg:grid-cols-[1.2fr,1fr]">
            <div className="space-y-8">
              <span className="inline-flex border-4 border-black bg-white px-5 py-3 uppercase font-black tracking-[0.3em] shadow-[6px_6px_0_#000] text-xs md:text-sm">
                Idea Architecture Suite
              </span>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tightest leading-[1.05] max-w-3xl">
                Build Loud Maps For Even Louder Ideas
              </h1>
              <p className="uppercase text-sm md:text-base font-semibold tracking-[0.12em] leading-[1.4] max-w-xl">
                MiniMind gives you a punchy workspace to capture concepts, connect them fast, and broadcast the story behind your strategy. No fluff. Just raw structure.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/editor"
                  className="px-7 py-4 border-4 border-black bg-[#22D3EE] shadow-[6px_6px_0_#000] uppercase font-black tracking-tightest transition-transform duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#000]"
                >
                  Start Mapping
                </Link>
                <a
                  href="#features"
                  className="px-7 py-4 border-4 border-black bg-white shadow-[6px_6px_0_#000] uppercase font-black tracking-tightest transition-transform duration-150 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#000]"
                >
                  Why It Works
                </a>
              </div>
            </div>
            <div className="border-4 border-black bg-white shadow-[10px_10px_0_#000] p-8 uppercase font-black tracking-tightest flex flex-col gap-6">
              <div className="text-sm text-left">
                <div className="text-3xl leading-[1.1]">Draw Structure. Drag Stories. Export Clarity.</div>
              </div>
              <ul className="text-xs md:text-sm font-semibold tracking-[0.18em] space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-3 w-3 bg-black" />
                  Grid-snapped precision with manual override whenever you need freedom.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-3 w-3 bg-[#F472B6] border border-black" />
                  Local-first storage keeps your maps on your machine—export JSON when you're ready to share.
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 inline-block h-3 w-3 bg-[#22D3EE] border border-black" />
                  Built on React Flow with a structure ready for AI assists or collaboration.
                </li>
              </ul>
            </div>
          </div>
          <section id="features" className="grid gap-8 md:grid-cols-3 uppercase font-black tracking-tightest">
            {[
              {
                title: 'Hard Lines',
                desc: 'Crisp edges, thick borders, and rigid grids keep every thought bold.',
                color: '#F472B6',
              },
              {
                title: 'Slam-Dunk Workflow',
                desc: 'Undo, redo, and snap-to-grid live beside essentials like save and load.',
                color: '#22D3EE',
              },
              {
                title: 'Export Ready',
                desc: 'One click JSON export keeps teammates aligned without friction.',
                color: '#A855F7',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="border-4 border-black bg-white shadow-[8px_8px_0_#000] p-8 flex flex-col gap-4"
              >
                <span
                  className="px-4 py-2 border-3 border-black shadow-[4px_4px_0_#000] text-xs"
                  style={{ backgroundColor: feature.color }}
                >
                  {feature.title}
                </span>
                <p className="text-sm font-semibold tracking-[0.12em] leading-[1.35] uppercase">{feature.desc}</p>
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  )
}
