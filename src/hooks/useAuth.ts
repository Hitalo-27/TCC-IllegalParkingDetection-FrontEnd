'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const checkToken = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Token inválido");
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
