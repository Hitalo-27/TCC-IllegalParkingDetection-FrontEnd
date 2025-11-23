"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { API_BASE_URL } from "@/src/config/env";

interface UserContextType {
  id: number | null;
  setId: (id: number | null) => void;
  image: string | null;
  setImage: (url: string | null) => void;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
}

const UserContext = createContext<UserContextType>({
  id: null,
  setId: () => {},
  image: null,
  setImage: () => {},
  name: "",
  setName: () => {},
  email: "",
  setEmail: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [id, setId] = useState<number | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;

        const data = await res.json();
        setId(data.id);
        setImage(data.image_url ? API_BASE_URL + data.image_url : null);
        setName(data.username || "");
        setEmail(data.email || "");
      } catch (err) {
        console.error(err);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ id, setId,image, setImage, name, setName, email, setEmail }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
