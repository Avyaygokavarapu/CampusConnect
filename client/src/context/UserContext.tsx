import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  auracoins: number;
  spendCoins: (amount: number) => boolean;
  addCoins: (amount: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [auracoins, setAuracoins] = useState(1000); // Start with 1000 Auracoins

  const spendCoins = (amount: number) => {
    if (auracoins >= amount) {
      setAuracoins((prev) => prev - amount);
      return true;
    }
    return false;
  };

  const addCoins = (amount: number) => {
    setAuracoins((prev) => prev + amount);
  };

  return (
    <UserContext.Provider value={{ auracoins, spendCoins, addCoins }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
