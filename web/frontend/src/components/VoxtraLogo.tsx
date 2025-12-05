export function VoxtraLogo({ className = "", onClick }: { className?: string; onClick?: () => void }) {
  const clickable = typeof onClick === 'function'
  const base = `h-8 sm:h-10 w-auto select-none`
  const interaction = clickable ? 'cursor-pointer hover:opacity-80 focus:opacity-80 outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md transition-all duration-200' : ''

  return (
    <div
      className={`${className} relative inline-block ${interaction}`}
      role={clickable ? 'button' as const : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!clickable) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.()
        }
      }}
    >
      {/* Keep a fixed box to avoid layout shift */}
      <div className="h-8 sm:h-10 w-auto">
        {/* Light theme (black logo) */}
        <img
          src="/Voxtra-black.png"
          alt="Voxtra"
          className={`${base} transition-opacity duration-300 ease-in-out opacity-100 dark:opacity-0`}
        />
        {/* Dark theme (white logo) */}
        <img
          src="/Voxtra-white.png"
          alt="Voxtra"
          className={`${base} absolute inset-0 transition-opacity duration-300 ease-in-out opacity-0 dark:opacity-100`}
        />
      </div>
    </div>
  )
}