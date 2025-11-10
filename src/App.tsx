import MindMapCanvas from './components/MindMapCanvas'
import Toolbar from './components/Toolbar'

export default function App() {
  return (
    <div className="h-full w-full flex flex-col">
      <Toolbar />
      <div className="flex-1">
        <MindMapCanvas />
      </div>
    </div>
  )
}
