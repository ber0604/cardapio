import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';
import { itensRefeicao } from '../data/mockData';

const TIPOS = ['Café-da-manhã', 'Almoço', 'Jantar'];
const TIPO_EMOJI = { 'Café-da-manhã': '☕', 'Almoço': '🍛', 'Jantar': '🌙' };

function getTodayStr() {
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function AddCardapioScreen() {
  const { usuario, adicionarCardapio } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!usuario) {
      router.replace('/login');
    } else if (usuario.tipo !== 'servidor') {
      Alert.alert('Acesso negado', 'Apenas servidores podem criar cardápios.', [
        { text: 'OK', onPress: () => router.replace('/menu') },
      ]);
    }
  }, [usuario]);

  const [data, setData] = useState(getTodayStr());
  const [tipo, setTipo] = useState('Almoço');
  const [itensSelecionados, setItensSelecionados] = useState([]);

  const toggleItem = (item) => {
    setItensSelecionados((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const validarData = (str) => /^\d{4}-\d{2}-\d{2}$/.test(str);

  const handleSalvar = () => {
    if (!validarData(data)) {
      Alert.alert('Data inválida', 'Use o formato AAAA-MM-DD.\nExemplo: 2026-05-04');
      return;
    }
    if (itensSelecionados.length === 0) {
      Alert.alert('Selecione itens', 'Escolha pelo menos um item para a refeição.');
      return;
    }
    adicionarCardapio({ data, tipo, itens: itensSelecionados });
    Alert.alert(
      '✅ Cardápio salvo!',
      `${tipo} do dia ${data} foi adicionado com sucesso.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  if (!usuario || usuario.tipo !== 'servidor') return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1565c0" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.voltarBtn}>
          <Text style={styles.voltarTexto}>‹ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Criar Cardápio</Text>
        <Text style={styles.subtitulo}>Preencha os dados da refeição</Text>
      </View>

      <ScrollView contentContainerStyle={styles.form} showsVerticalScrollIndicator={false}>

        {/* Data */}
        <View style={styles.secao}>
          <Text style={styles.label}>📅 Data (AAAA-MM-DD)</Text>
          <TextInput
            style={[styles.input, !validarData(data) && data.length > 0 && styles.inputErro]}
            value={data}
            onChangeText={setData}
            placeholder="Ex: 2026-05-04"
            placeholderTextColor="#aaa"
            maxLength={10}
            keyboardType="numeric"
          />
          {data.length > 0 && !validarData(data) && (
            <Text style={styles.erroTexto}>Formato inválido. Use AAAA-MM-DD</Text>
          )}
        </View>

        {/* Tipo */}
        <View style={styles.secao}>
          <Text style={styles.label}>🍽️ Tipo de Refeição</Text>
          <View style={styles.tiposRow}>
            {TIPOS.map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.tipoChip, tipo === t && styles.tipoChipAtivo]}
                onPress={() => setTipo(t)}
                activeOpacity={0.75}
              >
                <Text style={styles.tipoEmoji}>{TIPO_EMOJI[t]}</Text>
                <Text style={[styles.tipoTexto, tipo === t && styles.tipoTextoAtivo]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Itens */}
        <View style={styles.secao}>
          <Text style={styles.label}>
            🥗 Itens da Refeição{' '}
            <Text style={styles.contadorTexto}>
              ({itensSelecionados.length} selecionado{itensSelecionados.length !== 1 ? 's' : ''})
            </Text>
          </Text>
          <View style={styles.itensGrid}>
            {itensRefeicao.map((item) => {
              const sel = itensSelecionados.includes(item);
              return (
                <TouchableOpacity
                  key={item}
                  style={[styles.itemChip, sel && styles.itemChipAtivo]}
                  onPress={() => toggleItem(item)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.itemChipTexto, sel && styles.itemChipTextoAtivo]}>
                    {sel ? '✓ ' : ''}{item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Preview */}
        {itensSelecionados.length > 0 && validarData(data) && (
          <View style={styles.preview}>
            <Text style={styles.previewTitulo}>Preview do cardápio:</Text>
            <Text style={styles.previewLinha}>
              {TIPO_EMOJI[tipo]} {tipo} — {data}
            </Text>
            <View style={styles.previewItens}>
              {itensSelecionados.map((item, i) => (
                <Text key={i} style={styles.previewItem}>• {item}</Text>
              ))}
            </View>
          </View>
        )}

        {/* Botão Salvar */}
        <TouchableOpacity
          style={[
            styles.salvarBtn,
            (itensSelecionados.length === 0 || !validarData(data)) && styles.salvarBtnDisabled,
          ]}
          onPress={handleSalvar}
          activeOpacity={0.85}
        >
          <Text style={styles.salvarTexto}>✓  Salvar Cardápio</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f0' },

  header: {
    backgroundColor: '#1565c0',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  voltarBtn: { marginBottom: 10 },
  voltarTexto: { color: '#aed6f1', fontSize: 16 },
  titulo: { color: '#fff', fontSize: 21, fontWeight: 'bold', marginBottom: 4 },
  subtitulo: { color: '#aed6f1', fontSize: 13 },

  form: { padding: 20 },

  secao: { marginBottom: 24 },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: '#444',
    marginBottom: 10,
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 13,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: '#ddd',
    color: '#333',
  },
  inputErro: {
    borderColor: '#e74c3c',
  },
  erroTexto: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 2,
  },

  tiposRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  tipoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#1565c0',
    backgroundColor: '#fff',
  },
  tipoChipAtivo: {
    backgroundColor: '#1565c0',
  },
  tipoEmoji: { fontSize: 16 },
  tipoTexto: {
    color: '#1565c0',
    fontWeight: '600',
    fontSize: 14,
  },
  tipoTextoAtivo: { color: '#fff' },

  contadorTexto: {
    fontWeight: '400',
    color: '#888',
    fontSize: 13,
  },
  itensGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  itemChip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  itemChipAtivo: {
    backgroundColor: '#1a472a',
    borderColor: '#1a472a',
  },
  itemChipTexto: {
    color: '#555',
    fontWeight: '600',
    fontSize: 14,
  },
  itemChipTextoAtivo: { color: '#fff' },

  preview: {
    backgroundColor: '#e8f5e9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#1a472a',
  },
  previewTitulo: {
    fontWeight: '700',
    color: '#1a472a',
    fontSize: 14,
    marginBottom: 8,
  },
  previewLinha: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  previewItens: { gap: 3 },
  previewItem: {
    fontSize: 14,
    color: '#555',
  },

  salvarBtn: {
    backgroundColor: '#1a472a',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  salvarBtnDisabled: {
    backgroundColor: '#a5c8a9',
  },
  salvarTexto: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
});
