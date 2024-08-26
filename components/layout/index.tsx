"use client"
import {
  Home,
  Package,
  Package2,
  PanelLeft,
  Sparkles,
  User2,
  Users2
} from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ModeToggle } from "../ThemeProvider"
import { useAuthProvider } from "../AuthProvider"
import { usePathname } from "next/navigation"
import { twMerge } from "tailwind-merge"
import { useCallback } from "react"
import { useRouter } from "next/navigation"

type Props = {
  children: React.ReactNode
}

export default function Layout({
  children
}: Props) {
  const { user, setUser, setIsAuthenticated } = useAuthProvider()
  const pathname = usePathname()
  const router = useRouter()
  const logout = useCallback(() => {
    localStorage.clear()
    setUser(null)
    setIsAuthenticated(false)
    router.push('/login')
  }, [])
  return (
    <div className="flex h-full w-full bg-muted/40">
      <div className="z-10 hidden lg:w-48 w-16 h-full flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col gap-2 px-2 sm:py-5">
          <Link
            href="/"
            className="group flex w-full shrink-0 items-center gap-2 rounded-md text-lg font-semibold"
          >
            <div className="p-3 bg-primary text-primary-foreground  md:text-base rounded-md">
              <Sparkles className="h-4 w-4 transition-all group-hover:scale-110" />
            </div>
            <span className="hidden lg:block">
              Dashboard
            </span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/dicoms"
                className={twMerge([
                  "flex gap-2  w-full items-center px-3 py-2 rounded-lg transition-colors hover:text-foreground",
                  pathname.includes("/dicoms") ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                ])}
              >
                <Package className="h-5 w-5" />
                <span className="hidden lg:block">
                  Dicoms
                </span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dicoms</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/users"
                className={twMerge([
                  "flex gap-2  w-full items-center px-3 py-2 rounded-lg transition-colors hover:text-foreground",
                  pathname.includes("/users") ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                ])}
              >
                <Users2 className="h-5 w-5" />
                <span className="hidden lg:block">
                  Users
                </span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Users</TooltipContent>
          </Tooltip>
        </nav>
      </div>
      <div className="flex w-full flex-col sm:gap-2 sm:py-2 justify-center h-full overflow-auto">
        <div className="sticky top-0 z-30 flex py-2 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="/"
                  className="group flex gap-2 rounded-full text-lg font-semibold md:text-base items-center"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary rounded-full text-primary-foreground ">
                    <Sparkles className="h-5 w-5 transition-all group-hover:scale-110" />
                    <span className="sr-only">Acme Inc</span>
                  </div>
                  Nova Server
                </Link>
                <Link
                  href="/dicoms"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Dicoms
                </Link>
                <Link
                  href="/users"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Users2 className="h-5 w-5" />
                  Users
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          {
            (pathname.includes("/dicoms") || pathname.includes("/users")) && (
              <Breadcrumb className="hidden md:flex">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/">
                        <Home className="w-5 h-5" />
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage >
                      {
                        pathname.includes("/dicoms") ? "Dicoms" : "Users"
                      }
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            )
          }
          <div className="flex-1" />
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden"
              >
                <User2 />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.username}
                <Badge
                  className="ml-2"
                  variant={
                    user?.role === "ADMIN" ? 'destructive' : "outline"
                  }>{user?.role}</Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="h-full overflow-auto">
          {
            children
          }
        </div>
      </div>
    </div>

  )
}