import { Link } from "react-router";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Navbar() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center gap-2 mr-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Dashboard
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full md:w-[300px] lg:w-[400px] pl-8"
              />
            </div>
          </div>

          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
              <User className="h-4 w-4" />
              <span className="sr-only">User account</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
