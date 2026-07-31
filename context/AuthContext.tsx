"use client";

import { User } from "@/types";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isDark: boolean;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  toggleDark: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { chidren: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async() => {
        try {
            const userData = await 
        }
    }
  })
};
