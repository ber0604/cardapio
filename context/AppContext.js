import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@cardapios';
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cardapios, setCardapios] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Carrega os cardápios salvos no AsyncStorage ao iniciar
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((json) => {
        if (json) setCardapios(JSON.parse(json));
      })
      .finally(() => setLoaded(true));
  }, []);

  // Persiste no AsyncStorage sempre que cardapios mudar (só após o carregamento inicial)
  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cardapios));
    }
  }, [cardapios, loaded]);

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

  // Substitui o cardápio existente com mesma data+tipo pelo novo
  const substituirCardapio = (novoCardapio) => {
    const id = Date.now();
    setCardapios((prev) => [
      ...prev.filter((c) => !(c.data === novoCardapio.data && c.tipo === novoCardapio.tipo)),
      { ...novoCardapio, id },
    ]);
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
        substituirCardapio,
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
