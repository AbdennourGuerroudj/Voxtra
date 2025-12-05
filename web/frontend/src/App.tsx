import { lazy, Suspense } from 'react'
import { useRouter } from './contexts/RouterContext'

// Lazy load route components for better performance
const Homepage = lazy(() => import('./components/Homepage').then(module => ({ default: module.Homepage })))
const AudioDetailView = lazy(() => import('./components/AudioDetailView').then(module => ({ default: module.AudioDetailView })))
const Settings = lazy(() => import('./pages/Settings').then(module => ({ default: module.Settings })))
const ChatPage = lazy(() => import('./pages/ChatPage').then(module => ({ default: module.ChatPage })))

// Modern loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-2 border-muted border-t-primary"></div>
      <p className="text-muted-foreground text-sm font-medium">Loading...</p>
    </div>
  </div>
)

function App() {
  const { currentRoute } = useRouter()

  return (
    <Suspense fallback={<PageLoader />}>
      {currentRoute.path === 'audio-detail' && currentRoute.params?.id ? (
        <AudioDetailView audioId={currentRoute.params.id} />
      ) : currentRoute.path === 'settings' ? (
        <Settings />
      ) : currentRoute.path === 'chat' ? (
        <ChatPage />
      ) : (
        <Homepage />
      )}
    </Suspense>
  )
}

export default App
