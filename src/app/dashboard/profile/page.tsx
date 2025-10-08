"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Camera, X } from "lucide-react";
import { API_BASE_URL } from "@/src/config/env";
import { useUser } from "@/src/contexts/UserContext";

export default function Profile() {
  const router = useRouter();
  const { image, setImage, name, setName, email, setEmail } = useUser();

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(image);
  const [form, setForm] = useState({
    name,
    email,
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
    setForm(prev => ({ ...prev, name, email }));
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

    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setToastVariant("error");
      setToastMessage("As novas senhas não coincidem");
      setToastOpen(true);
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
        setToastVariant("error");
        setToastMessage(error.detail || "Erro ao atualizar usuário");
        setToastOpen(true);
        return;
      }

      const data = await response.json();

      if (data.image_url) {
        const uploadedImageUrl = API_BASE_URL + data.image_url;
        setPreviewImage(uploadedImageUrl);
        setImage(uploadedImageUrl);
      }

      // Atualiza nome e email no contexto
      setName(form.name);
      setEmail(form.email);

      setToastVariant("success");
      setToastMessage("Perfil atualizado com sucesso! 😎");
      setToastOpen(true);
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setToastVariant("error");
      setToastMessage("Erro na comunicação com o servidor");
      setToastOpen(true);
    }
  };

  return (
    <ToastPrimitives.Provider swipeDirection="right">
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Meu Perfil</h1>

          <Card className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={previewImage || ""} />
                  <AvatarFallback className="text-4xl">
                    {form.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </label>
                <input
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" name="name" type="text" value={form.name} onChange={handleFormChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={form.email} onChange={handleFormChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <Input id="currentPassword" name="currentPassword" type="password" value={form.currentPassword} onChange={handleFormChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input id="newPassword" name="newPassword" type="password" value={form.newPassword} onChange={handleFormChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleFormChange} />
              </div>

              <Button type="submit" className="w-full">Salvar Alterações</Button>
            </form>
          </Card>
        </div>

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
