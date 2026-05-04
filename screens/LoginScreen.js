import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';
import { usuarios } from '../data/mockData';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const { login } = useApp();
  const router = useRouter();

  const handleLogin = () => {
    setErro('');
    if (!username.trim() || !password.trim()) {
      setErro('Preencha usuário e senha.');
      return;
    }
    const usuario = usuarios.find(
      (u) => u.username === username.trim() && u.password === password
    );
    if (usuario) {
      login(usuario);
      router.replace('/menu');
    } else {
      setErro('Usuário ou senha inválidos.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor="#1a472a" />
      <View style={styles.topDecoration} />

      <View style={styles.card}>
        <Text style={styles.emoji}>🍽️</Text>
        <Text style={styles.titulo}>Cardápio Universitário</Text>
        <Text style={styles.subtitulo}>Faça login para continuar</Text>

        <TextInput
          style={styles.input}
          placeholder="Usuário"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#aaa"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#aaa"
          onSubmitEditing={handleLogin}
          returnKeyType="done"
        />

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <TouchableOpacity style={styles.botao} onPress={handleLogin} activeOpacity={0.85}>
          <Text style={styles.botaoTexto}>Entrar</Text>
        </TouchableOpacity>

        <View style={styles.dicaContainer}>
          <Text style={styles.dicaTitulo}>Contas de teste:</Text>
          <Text style={styles.dica}>👨‍🎓 aluno1 / 123</Text>
          <Text style={styles.dica}>👷 servidor1 / 123</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a472a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '35%',
    backgroundColor: '#1a472a',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    width: '88%',
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a472a',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitulo: {
    fontSize: 14,
    color: '#888',
    marginBottom: 28,
  },
  input: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 13,
    marginBottom: 14,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  erro: {
    color: '#c0392b',
    marginBottom: 12,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  botao: {
    backgroundColor: '#1a472a',
    borderRadius: 10,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  dicaContainer: {
    backgroundColor: '#f5f9f5',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    alignItems: 'center',
  },
  dicaTitulo: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    fontWeight: '600',
  },
  dica: {
    color: '#666',
    fontSize: 13,
    marginTop: 2,
  },
});
