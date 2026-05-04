import React, { createContext, useContext, useState } from 'react';
import { cardapiosIniciais } from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cardapios, setCardapios] = useState(cardapiosIniciais);
  const [favoritos, setFavoritos] = useState([]);

  const login = (user) => setUsuario(user);

  const logout = () => {
    setUsuario(null);
    setFavoritos([]);
  };

  const toggleFavorito = (cardapioId) => {
    setFavoritos((prev) =>
      prev.includes(cardapioId)
        ? prev.filter((id) => id !== cardapioId)
        : [...prev, cardapioId]
    );
  };

  const adicionarCardapio = (novoCardapio) => {
    const id = Date.now();
    setCardapios((prev) => [...prev, { ...novoCardapio, id }]);
  };

  return (
    <AppContext.Provider
      value={{
        usuario,
        login,
        logout,
        cardapios,
        favoritos,
        toggleFavorito,
        adicionarCardapio,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider');
  return ctx;
}
