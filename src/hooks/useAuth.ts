'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/src/config/env";
import { useUser } from "@/src/contexts/UserContext";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { setId, setImage, setName, setEmail } = useUser();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login?error=unauthorized");
      return;
    }

    const checkToken = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Token inválido");

        const data = await res.json();

        setId(data.id);
        setImage(data.image_url ? API_BASE_URL + data.image_url : null);
        setName(data.username || "");
        setEmail(data.email || "");

        setLoading(false);

      } catch (err) {
        localStorage.removeItem("token");
        router.replace("/login");
      }
    };

    checkToken();
  }, [router]);

  return loading;
}
