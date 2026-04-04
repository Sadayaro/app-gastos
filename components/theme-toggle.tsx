"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ThemeToggleProps {
  collapsed?: boolean
}

export function ThemeToggle({ collapsed }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent",
        collapsed && "w-full"
      )}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
      {!collapsed && (
        <span className="ml-2 text-sm">
          {resolvedTheme === "dark" ? "Modo claro" : "Modo oscuro"}
        </span>
      )}
    </Button>
  )
}
