"use client";

import { LogOut, User, Car, Camera } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/hooks/useAuth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loading = useAuth();

  if (loading) return <p className="text-center mt-10"></p>;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
        <div className="container flex h-16 items-center justify-between min-w-full">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <span className="text-xl text-[hsl(var(--primary))]">IPD</span>
          </Link>

          <nav className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/219/219983.png"
                    alt="User Avatar"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/cameras"
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    Minhas Cameras
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/vehicles"
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <Car className="w-4 h-4" />
                    Veículos Enviados
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/profile"
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/"
                    className="cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      localStorage.removeItem("token"); // limpa o token
                    }}
                  >
                    <LogOut className="w-4 h-4" />
                    Sair
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
