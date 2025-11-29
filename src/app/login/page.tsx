"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { 
  X, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Loader2, 
  ShieldCheck 
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { API_BASE_URL } from "@/src/config/env";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "error">("error");

  React.useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'unauthorized') {
      setToastVariant("error");
      setToastMessage("Sessão expirada. Faça login novamente.");
      setToastOpen(true);
      router.replace('/login');
    }
  }, [searchParams, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

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
      setToastMessage("Login realizado com sucesso!");
      setToastOpen(true);

      setTimeout(() => router.push("/dashboard"), 800);
    } catch (err: any) {
      setToastVariant("error");
      setToastMessage(err.message || "Erro ao tentar entrar.");
      setToastOpen(true);
      setIsLoading(false);
    }
  };

  return (
    <ToastPrimitives.Provider swipeDirection="right">
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50/50 relative overflow-hidden">
        
        {/* Fundo decorativo sutil - Ajustado para ser neutro ou usar primary via CSS se desejado, aqui mantive neutro para destacar o botão */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,rgba(0,0,0,0.05)_100%)]"></div>

        <Card className="w-full max-w-md shadow-2xl border-0 ring-1 ring-gray-100 overflow-hidden">
          <CardHeader className="space-y-1 flex flex-col items-center pb-2 pt-8">
            {/* Ícone com bg-primary */}
            <div className="bg-primary p-3 rounded-2xl mb-2 shadow-lg shadow-primary/20">
              <ShieldCheck className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Bem-vindo de volta
            </h2>
            <p className="text-sm text-gray-500">
              Insira suas credenciais para acessar o painel
            </p>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Input Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="exemplo@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    // Alterado: focus:border-primary
                    className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
                  />
                </div>
              </div>

              {/* Input Senha */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Senha</Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    placeholder="••••••••"
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                    className="pl-10 pr-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-primary focus-visible:ring-0 focus-visible:ring-offset-0 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Botão Submit */}
              <Button 
                type="submit" 
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  "Entrar na conta"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              Não tem uma conta?{" "}
              <button
                type="button"
                className="font-semibold text-primary hover:text-primary/80 hover:underline transition-all"
                onClick={() => router.push("/register")}
              >
                Cadastre-se agora
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Toast Notificação */}
        <ToastPrimitives.Root
          open={toastOpen}
          onOpenChange={setToastOpen}
          className={`
            fixed top-5 right-5 z-50 
            flex items-center gap-3 
            w-auto max-w-sm rounded-xl p-4 shadow-2xl 
            border animate-in slide-in-from-right-full fade-in duration-300
            ${toastVariant === "success" 
              ? "bg-white border-green-200 text-green-800" 
              : "bg-white border-red-200 text-red-800"
            }
          `}
        >
          <div className={`p-2 rounded-full ${toastVariant === "success" ? "bg-green-100" : "bg-red-100"}`}>
            {toastVariant === "success" ? (
               <ShieldCheck className="h-5 w-5" />
            ) : (
               <X className="h-5 w-5" />
            )}
          </div>
          
          <div className="flex-1">
             <h3 className="font-semibold text-sm">
                {toastVariant === "success" ? "Sucesso" : "Erro"}
             </h3>
             <p className="text-sm opacity-90">{toastMessage}</p>
          </div>

          <ToastPrimitives.Close className="text-gray-400 hover:text-gray-600">
            <X className="h-4 w-4" />
          </ToastPrimitives.Close>
        </ToastPrimitives.Root>
        <ToastPrimitives.Viewport />
      </div>
    </ToastPrimitives.Provider>
  );
}

export default function Login() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}