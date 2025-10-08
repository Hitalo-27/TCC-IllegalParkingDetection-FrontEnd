"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { API_BASE_URL } from "@/src/config/env";

interface UserContextType {
  image: string | null;
  setImage: (url: string | null) => void;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
}

const UserContext = createContext<UserContextType>({
  image: null,
  setImage: () => {},
  name: "",
  setName: () => {},
  email: "",
  setEmail: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
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
    <UserContext.Provider value={{ image, setImage, name, setName, email, setEmail }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
