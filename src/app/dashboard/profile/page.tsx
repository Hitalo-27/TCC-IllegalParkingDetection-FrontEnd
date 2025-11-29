"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { 
  Camera, 
  X, 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Lock, 
  Key, 
  Loader2, 
  Save,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { API_BASE_URL } from "@/src/config/env";
import { useUser } from "@/src/contexts/UserContext";

export default function Profile() {
  const router = useRouter();
  const { image, setImage, name, setName, email, setEmail } = useUser();

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordNew, setShowPasswordNew] = useState(false);
  const [showPasswordNewConfirm, setShowPasswordNewConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(image);
  
  const [form, setForm] = useState({
    name: name || "",
    email: email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "error">("error");

  // Sincroniza formulário e preview com o contexto
  useEffect(() => {
    setPreviewImage(image);
    setForm((prev) => ({ ...prev, name: name || "", email: email || "" }));
  }, [image, name, email]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setToastVariant("error");
      setToastMessage("As novas senhas não coincidem");
      setToastOpen(true);
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("username", form.name);
      formData.append("email", form.email);

      if (form.currentPassword && form.newPassword && form.confirmPassword) {
        formData.append("old_password", form.currentPassword);
        formData.append("new_password", form.newPassword);
        formData.append("new_password_confirm", form.confirmPassword);
      }

      if (profileImage) formData.append("image", profileImage);

      const response = await fetch(`${API_BASE_URL}/users/update`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Erro ao atualizar usuário");
      }

      const data = await response.json();

      if (data.image_url) {
        const uploadedImageUrl = API_BASE_URL + data.image_url;
        setPreviewImage(uploadedImageUrl);
        setImage(uploadedImageUrl);
      }

      setName(form.name);
      setEmail(form.email);

      // Limpar campos de senha após sucesso
      setForm(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));

      setToastVariant("success");
      setToastMessage("Perfil atualizado com sucesso!");
      setToastOpen(true);
      
    } catch (err: any) {
      console.error(err);
      setToastVariant("error");
      setToastMessage(err.message || "Erro na comunicação com o servidor");
      setToastOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ToastPrimitives.Provider swipeDirection="right">
      <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 pb-20">
        <div className="max-w-4xl mx-auto space-y-8">
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Configurações de Perfil</h1>
            <p className="text-gray-500">Gerencie suas informações pessoais e segurança da conta.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 items-start">
              
              {/* Card Esquerda: Foto e Resumo */}
              <Card className="shadow-md border-0 ring-1 ring-gray-100 overflow-hidden">
                <CardHeader className="bg-primary/5 pb-8 pt-6 flex flex-col items-center">
                  <div className="relative group">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-xl">
                      <AvatarImage src={previewImage || ""} className="object-cover" />
                      <AvatarFallback className="text-4xl bg-gray-200 text-gray-500">
                        {form.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    
                    <label
                      htmlFor="profile-image"
                      className="absolute bottom-1 right-1 p-2.5 bg-primary text-primary-foreground rounded-full cursor-pointer shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
                      title="Alterar foto"
                    >
                      <Camera className="w-4 h-4" />
                    </label>
                    <input
                      type="file"
                      id="profile-image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  <div className="text-center mt-4 space-y-1">
                    <h2 className="font-bold text-lg text-gray-900">{form.name || "Usuário"}</h2>
                    <p className="text-sm text-gray-500">{form.email || "email@exemplo.com"}</p>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-xs text-center text-gray-400">
                    Recomendado: .jpg ou .png, máx 2MB.
                  </p>
                </CardContent>
              </Card>

              {/* Card Direita: Formulário */}
              <div className="space-y-6">
                
                {/* Dados Pessoais */}
                <Card className="shadow-md border-0 ring-1 ring-gray-100">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Informações Pessoais
                    </CardTitle>
                    <CardDescription>Atualize seus dados de identificação.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="name"
                          name="name"
                          value={form.name}
                          onChange={handleFormChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleFormChange}
                          className="pl-10 bg-gray-50/50" // Email geralmente não muda fácil, visualmente mais suave
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Segurança */}
                <Card className="shadow-md border-0 ring-1 ring-gray-100">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                      <Lock className="w-5 h-5 text-primary" />
                      Segurança
                    </CardTitle>
                    <CardDescription>Preencha apenas se desejar alterar sua senha.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Senha Atual</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showPassword ? "text" : "password"}
                          value={form.currentPassword}
                          onChange={handleFormChange}
                          className="pl-10 pr-10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Nova Senha</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type={showPasswordNew ? "text" : "password"}
                            value={form.newPassword}
                            onChange={handleFormChange}
                            className="pl-10 pr-10"
                            placeholder="Nova senha"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswordNew(!showPasswordNew)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            {showPasswordNew ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type={showPasswordNewConfirm ? "text" : "password"}
                            value={form.confirmPassword}
                            onChange={handleFormChange}
                            className="pl-10 pr-10"
                            placeholder="Repita a senha"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswordNewConfirm(!showPasswordNewConfirm)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                          >
                            {showPasswordNewConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto min-w-[150px] shadow-lg shadow-primary/20 font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                </div>

              </div>
            </div>
          </form>
        </div>

        {/* Modern Toast */}
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
               <CheckCircle2 className="h-5 w-5" />
            ) : (
               <AlertCircle className="h-5 w-5" />
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