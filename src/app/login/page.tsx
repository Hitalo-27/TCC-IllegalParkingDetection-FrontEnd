"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { X } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "error">(
    "error"
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/users/login", {
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
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
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
