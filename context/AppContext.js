import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateMockCardapios } from '../data/mockData';

const STORAGE_KEY = '@cardapios';
const FAVORITOS_KEY = (username) => `@favoritos_${username}`;
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cardapios, setCardapios] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [favoritosLoaded, setFavoritosLoaded] = useState(false);

  // Carrega os cardápios salvos no AsyncStorage ao iniciar
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((json) => {
        if (json) {
          const parsed = JSON.parse(json);
          if (parsed && parsed.length > 0) {
            setCardapios(parsed);
            return;
          }
        }
        // Se estiver vazio ou não existir, preenche com os dados mocados
        const mock = generateMockCardapios();
        setCardapios(mock);
      })
      .finally(() => setLoaded(true));
  }, []);

  // Persiste cardapios no AsyncStorage sempre que mudar (só após o carregamento inicial)
  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cardapios));
    }
  }, [cardapios, loaded]);

  // Carrega os favoritos do usuário ao fazer login
  useEffect(() => {
    if (usuario) {
      setFavoritosLoaded(false);
      AsyncStorage.getItem(FAVORITOS_KEY(usuario.username))
        .then((json) => {
          setFavoritos(json ? JSON.parse(json) : []);
        })
        .finally(() => setFavoritosLoaded(true));
    } else {
      setFavoritosLoaded(false);
    }
  }, [usuario?.username]);

  // Persiste favoritos no AsyncStorage sempre que mudar (só após carregar)
  useEffect(() => {
    if (usuario && favoritosLoaded) {
      AsyncStorage.setItem(FAVORITOS_KEY(usuario.username), JSON.stringify(favoritos));
    }
  }, [favoritos, favoritosLoaded, usuario]);

  const login = (user) => setUsuario(user);

  const logout = () => {
    setUsuario(null);
    setFavoritos([]); // Limpa da memória; favoritos ficam salvos no AsyncStorage para o próximo login
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

  const editarCardapio = (id, cardapioAtualizado) => {
    setCardapios((prev) =>
      prev.map((c) => (String(c.id) === String(id) ? { ...c, ...cardapioAtualizado } : c))
    );
  };

  const resetarCardapios = () => {
    const mock = generateMockCardapios();
    setCardapios(mock);
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
        editarCardapio,
        resetarCardapios,
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
