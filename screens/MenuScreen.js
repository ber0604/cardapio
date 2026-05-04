import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useApp } from '../context/AppContext';

export default function MenuScreen() {
  const { usuario, logout } = useApp();
  const router = useRouter();

  if (!usuario) return <Redirect href="/login" />;

  const isServidor = usuario.tipo === 'servidor';

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a472a" />

      <View style={styles.header}>
        <Text style={styles.headerEmoji}>🍽️</Text>
        <Text style={styles.titulo}>Cardápio Universitário</Text>
        <View style={styles.badgeContainer}>
          <View style={[styles.badge, isServidor && styles.badgeServidor]}>
            <Text style={styles.badgeTexto}>
              {isServidor ? '👷 Servidor' : '🎓 Aluno'}
            </Text>
          </View>
          <Text style={styles.usernameTexto}>{usuario.username}</Text>
        </View>
      </View>

      <View style={styles.conteudo}>
        <Text style={styles.secaoTitulo}>O que deseja fazer?</Text>

        <TouchableOpacity
          style={styles.opcao}
          onPress={() => router.push('/cardapio')}
          activeOpacity={0.8}
        >
          <View style={[styles.opcaoIcone, { backgroundColor: '#e8f5e9' }]}>
            <Text style={styles.opcaoEmoji}>📅</Text>
          </View>
          <View style={styles.opcaoTextoContainer}>
            <Text style={styles.opcaoTitulo}>Ver Cardápio</Text>
            <Text style={styles.opcaoDescricao}>Visualize o cardápio da semana atual</Text>
          </View>
          <Text style={styles.opcaoSeta}>›</Text>
        </TouchableOpacity>

        {isServidor && (
          <TouchableOpacity
            style={[styles.opcao, styles.opcaoServidor]}
            onPress={() => router.push('/add-cardapio')}
            activeOpacity={0.8}
          >
            <View style={[styles.opcaoIcone, { backgroundColor: '#e3f2fd' }]}>
              <Text style={styles.opcaoEmoji}>➕</Text>
            </View>
            <View style={styles.opcaoTextoContainer}>
              <Text style={[styles.opcaoTitulo, { color: '#1565c0' }]}>Criar Cardápio</Text>
              <Text style={styles.opcaoDescricao}>Adicione refeições ao cardápio</Text>
            </View>
            <Text style={[styles.opcaoSeta, { color: '#1565c0' }]}>›</Text>
          </TouchableOpacity>
        )}

        {!isServidor && (
          <View style={styles.infoBox}>
            <Text style={styles.infoTexto}>
              💡 Apenas servidores podem criar cardápios.
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.sairBotao} onPress={handleLogout} activeOpacity={0.8}>
        <Text style={styles.sairTexto}>↩ Sair da conta</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f0',
  },
  header: {
    backgroundColor: '#1a472a',
    paddingTop: 40,
    paddingBottom: 28,
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  badgeContainer: {
    alignItems: 'center',
    gap: 4,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeServidor: {
    backgroundColor: 'rgba(41,128,185,0.4)',
  },
  badgeTexto: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  usernameTexto: {
    color: '#a8d5b8',
    fontSize: 13,
  },
  conteudo: {
    flex: 1,
    padding: 24,
  },
  secaoTitulo: {
    fontSize: 14,
    fontWeight: '700',
    color: '#888',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  opcao: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    borderLeftWidth: 4,
    borderLeftColor: '#1a472a',
  },
  opcaoServidor: {
    borderLeftColor: '#1565c0',
  },
  opcaoIcone: {
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  opcaoEmoji: {
    fontSize: 26,
  },
  opcaoTextoContainer: {
    flex: 1,
  },
  opcaoTitulo: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a472a',
    marginBottom: 3,
  },
  opcaoDescricao: {
    fontSize: 13,
    color: '#888',
  },
  opcaoSeta: {
    fontSize: 26,
    color: '#1a472a',
    fontWeight: '300',
  },
  infoBox: {
    backgroundColor: '#fff9e6',
    borderRadius: 10,
    padding: 14,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#f39c12',
  },
  infoTexto: {
    color: '#7d6608',
    fontSize: 13,
  },
  sairBotao: {
    margin: 24,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#c0392b',
    borderRadius: 10,
  },
  sairTexto: {
    color: '#c0392b',
    fontSize: 15,
    fontWeight: '600',
  },
});
