import Toolbar from '../components/Toolbar'
import MindMapCanvas from '../components/MindMapCanvas'

export default function Editor() {
  return (
    <div className="relative h-screen w-full flex flex-col bg-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 right-[-200px] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-sky-200 via-indigo-200 to-purple-200 blur-3xl opacity-50" />
      </div>
      <Toolbar />
      <div className="flex-1">
        <MindMapCanvas />
      </div>
    </div>
  )
}


