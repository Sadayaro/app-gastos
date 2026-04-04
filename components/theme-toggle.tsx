"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  collapsed?: boolean
}

export function ThemeToggle({ collapsed }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleTheme()
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size={collapsed ? "icon" : "default"}
      onClick={handleClick}
      className={cn(
        "text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent justify-start",
        collapsed && "w-full justify-center"
      )}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      {!collapsed && (
        <span className="ml-2 text-sm">
          {theme === "dark" ? "Modo claro" : "Modo oscuro"}
        </span>
      )}
    </Button>
  )
}
