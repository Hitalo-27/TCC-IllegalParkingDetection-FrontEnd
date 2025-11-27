"use client";

import { LogOut, User, Car, Search, CheckCheck } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/hooks/useAuth";
import { useUser } from "@/src/contexts/UserContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loading = useAuth();
  const { image } = useUser(); // pegando a imagem do contexto

  if (loading) return <p className="text-center mt-10"></p>;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="w-full border-b bg-background/95 backdrop-blur px-4">
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
                    src={
                      image
                        ? image
                        : "https://cdn-icons-png.flaticon.com/512/219/219983.png"
                    }
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {/* <DropdownMenuItem asChild>
                  <Link href="/dashboard/cameras" className="flex items-center gap-2">
                    <Camera className="w-4 h-4" /> Minhas Câmeras
                  </Link>
                </DropdownMenuItem> */}
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/search"
                    className="flex items-center gap-2 focus:text-primary"
                  >
                    <Search className="w-4 h-4" /> Consultar Infrações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/validate"
                    className="flex items-center gap-2 focus:text-primary"
                  >
                    <CheckCheck className="w-4 h-4" /> Validar Infrações
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/vehicles"
                    className="flex items-center gap-2 focus:text-primary"
                  >
                    <Car className="w-4 h-4" /> Infrações Enviadas
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2 focus:text-primary"
                  >
                    <User className="w-4 h-4" /> Meu Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/"
                    className="flex items-center gap-2 focus:text-red-600"
                    onClick={() => localStorage.removeItem("token")}
                  >
                    <LogOut className="w-4 h-4" /> Sair
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>

      <footer className="w-full border-t bg-background py-5 px-4">
        <div className="container flex flex-col items-center justify-center md:h-12 text-sm text-muted-foreground min-w-full">
          <p className="text-center text-gray-500">
            &copy; {new Date().getFullYear()} IPD - Detecção de Infrações. Todos
            os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
