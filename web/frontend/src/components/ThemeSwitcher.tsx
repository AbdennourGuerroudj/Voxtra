import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { Button } from './ui/button'

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button 
      variant="outline" 
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 sm:h-10 sm:w-10 cursor-pointer border-border hover:bg-accent hover:text-accent-foreground transition-all duration-200"
    >
      {theme === 'light' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}