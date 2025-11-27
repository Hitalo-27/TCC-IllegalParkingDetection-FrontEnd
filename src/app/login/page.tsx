"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { API_BASE_URL } from "@/src/config/env";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "error">(
    "error"
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Credenciais inválidas");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access_token);

      setToastVariant("success");
      setToastMessage("Login realizado com sucesso! 😎");
      setToastOpen(true);

      // Redireciona após 1s para mostrar o toast
      setTimeout(() => router.push("/dashboard"), 1000);
    } catch (err: any) {
      setToastVariant("error");
      setToastMessage(err.message);
      setToastOpen(true);
    }
  };

  return (
    <ToastPrimitives.Provider swipeDirection="right">
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>

              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                  className="pr-10" // espaço para o ícone
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} color="hsl(var(--primary))" /> : <Eye size={18} color="hsl(var(--primary))" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
            <p className="text-center mt-4 text-sm text-gray-600">
              Ainda não tem uma conta?{" "}
              <Button
                variant="link"
                className="p-0"
                onClick={() => router.push("/register")}
              >
                Cadastre-se
              </Button>
            </p>
          </form>
        </Card>

        {/* Toast */}
        <ToastPrimitives.Root
          open={toastOpen}
          onOpenChange={setToastOpen}
          className={`fixed top-5 right-5 w-80 rounded-lg p-4 shadow-lg text-white ${
            toastVariant === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <div className="flex justify-between items-center">
            <span>{toastMessage}</span>
            <ToastPrimitives.Close>
              <X className="h-5 w-5" />
            </ToastPrimitives.Close>
          </div>
        </ToastPrimitives.Root>
        <ToastPrimitives.Viewport />
      </div>
    </ToastPrimitives.Provider>
  );
}
