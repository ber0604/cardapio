import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Share,
  Alert,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';

const NOMES_DIA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const TIPOS_ORDEM = ['Café-da-manhã', 'Almoço', 'Jantar'];
const TIPO_EMOJI = {
  'Café-da-manhã': '☕',
  'Almoço': '🍛',
  'Jantar': '🌙',
};

function getWeekDays() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Dom, 1=Seg, ..., 6=Sáb
  // Calcula quantos dias voltar para chegar na segunda-feira
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysFromMonday);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(d);
  }
  return days;
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateDisplay(date) {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function formatDatePtBr(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

export default function CardapioScreen() {
  const { usuario, cardapios, favoritos, toggleFavorito } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!usuario) router.replace('/login');
  }, [usuario]);

  const today = new Date();
  const todayStr = formatDate(today);
  const weekDays = getWeekDays();

  const [diaSelecionado, setDiaSelecionado] = useState(todayStr);

  const cardapiosDoDia = cardapios.filter((c) => c.data === diaSelecionado);
  const cardapiosOrdenados = TIPOS_ORDEM
    .map((tipo) => cardapiosDoDia.find((c) => c.tipo === tipo))
    .filter(Boolean);

  const handleShare = async (cardapio) => {
    const itensFormatados = cardapio.itens.map((i) => `  • ${i}`).join('\n');
    const texto =
      `🍽️ Cardápio Universitário\n` +
      `📅 Data: ${formatDatePtBr(cardapio.data)}\n` +
      `${TIPO_EMOJI[cardapio.tipo] || '🍽️'} Refeição: ${cardapio.tipo}\n\n` +
      `Itens:\n${itensFormatados}`;
    try {
      await Share.share({ message: texto });
    } catch {
      Alert.alert('Erro', 'Não foi possível compartilhar.');
    }
  };

  if (!usuario) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a472a" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.voltarBtn}>
          <Text style={styles.voltarTexto}>‹ Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.titulo}>Cardápio da Semana</Text>
        <Text style={styles.semanaTexto}>
          {formatDateDisplay(weekDays[0])} – {formatDateDisplay(weekDays[6])}
        </Text>
      </View>

      {/* Seletor de dias */}
      <View style={styles.semanaWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.semanaContent}
        >
          {weekDays.map((dia, index) => {
            const diaStr = formatDate(dia);
            const isHoje = diaStr === todayStr;
            const isSelecionado = diaStr === diaSelecionado;
            const temCardapio = cardapios.some((c) => c.data === diaStr);

            return (
              <TouchableOpacity
                key={diaStr}
                style={[
                  styles.diaBtn,
                  isHoje && styles.diaBtnHoje,
                  isSelecionado && styles.diaBtnSelecionado,
                ]}
                onPress={() => setDiaSelecionado(diaStr)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.diaNome,
                    (isHoje || isSelecionado) && styles.diaTextoDestaque,
                  ]}
                >
                  {NOMES_DIA[index]}
                </Text>
                <Text
                  style={[
                    styles.diaNumero,
                    (isHoje || isSelecionado) && styles.diaTextoDestaque,
                  ]}
                >
                  {formatDateDisplay(dia)}
                </Text>
                {isHoje && (
                  <Text style={[styles.hojeLabel, isSelecionado && { color: '#1a472a' }]}>
                    hoje
                  </Text>
                )}
                {temCardapio && !isHoje && (
                  <View
                    style={[
                      styles.dot,
                      isSelecionado && styles.dotSelecionado,
                    ]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Lista de cardápios */}
      <ScrollView
        style={styles.lista}
        contentContainerStyle={styles.listaContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.dataTitulo}>
          {formatDatePtBr(diaSelecionado)} —{' '}
          {NOMES_DIA[weekDays.findIndex((d) => formatDate(d) === diaSelecionado)] || ''}
        </Text>

        {cardapiosOrdenados.length === 0 ? (
          <View style={styles.vazio}>
            <Text style={styles.vazioEmoji}>🍽️</Text>
            <Text style={styles.vazioTitulo}>Sem cardápio</Text>
            <Text style={styles.vazioTexto}>
              Nenhuma refeição cadastrada para este dia.
            </Text>
          </View>
        ) : (
          cardapiosOrdenados.map((cardapio) => {
            const isFav = favoritos.includes(cardapio.id);
            return (
              <View key={cardapio.id} style={[styles.card, isFav && styles.cardFav]}>
                <View style={styles.cardTop}>
                  <View style={styles.cardTipoContainer}>
                    <Text style={styles.cardEmoji}>
                      {TIPO_EMOJI[cardapio.tipo] || '🍽️'}
                    </Text>
                    <Text style={styles.cardTipo}>{cardapio.tipo}</Text>
                  </View>
                  <View style={styles.acoes}>
                    <TouchableOpacity
                      onPress={() => toggleFavorito(cardapio.id)}
                      style={styles.acaoBtn}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.favIcone}>
                        {isFav ? '⭐' : '☆'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleShare(cardapio)}
                      style={styles.acaoBtn}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.shareIcone}>📤</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.divisor} />

                <View style={styles.itens}>
                  {cardapio.itens.map((item, i) => (
                    <View key={i} style={styles.itemRow}>
                      <View style={styles.itemDot} />
                      <Text style={styles.itemTexto}>{item}</Text>
                    </View>
                  ))}
                </View>

                {isFav && (
                  <View style={styles.favLabel}>
                    <Text style={styles.favLabelTexto}>⭐ Favoritado</Text>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4f0' },

  header: {
    backgroundColor: '#1a472a',
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  voltarBtn: { marginBottom: 10 },
  voltarTexto: { color: '#a8d5b8', fontSize: 16 },
  titulo: { color: '#fff', fontSize: 21, fontWeight: 'bold', marginBottom: 4 },
  semanaTexto: { color: '#a8d5b8', fontSize: 13 },

  semanaWrapper: {
    backgroundColor: '#1a472a',
    paddingBottom: 16,
  },
  semanaContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  diaBtn: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 58,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  diaBtnHoje: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  diaBtnSelecionado: {
    backgroundColor: '#fff',
  },
  diaNome: {
    color: '#a8d5b8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  diaNumero: {
    color: '#d0ead8',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 3,
  },
  diaTextoDestaque: { color: '#1a472a' },
  hojeLabel: {
    fontSize: 9,
    color: '#fff',
    fontWeight: '700',
    marginTop: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#a8d5b8',
    marginTop: 4,
  },
  dotSelecionado: { backgroundColor: '#1a472a' },

  lista: { flex: 1 },
  listaContent: { padding: 16, paddingBottom: 32 },
  dataTitulo: {
    fontSize: 15,
    fontWeight: '700',
    color: '#555',
    marginBottom: 14,
    textTransform: 'capitalize',
  },

  vazio: {
    alignItems: 'center',
    marginTop: 60,
    gap: 8,
  },
  vazioEmoji: { fontSize: 52 },
  vazioTitulo: { fontSize: 18, fontWeight: 'bold', color: '#999' },
  vazioTexto: { fontSize: 14, color: '#bbb', textAlign: 'center', paddingHorizontal: 30 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  cardFav: {
    borderWidth: 1.5,
    borderColor: '#f39c12',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardTipoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardEmoji: { fontSize: 22 },
  cardTipo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1a472a',
  },
  acoes: {
    flexDirection: 'row',
    gap: 4,
  },
  acaoBtn: {
    padding: 6,
  },
  favIcone: { fontSize: 22 },
  shareIcone: { fontSize: 20 },

  divisor: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
  },
  itens: { gap: 6 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#1a472a',
  },
  itemTexto: { fontSize: 15, color: '#444' },

  favLabel: {
    marginTop: 12,
    backgroundColor: '#fff9e6',
    borderRadius: 6,
    padding: 6,
    alignItems: 'center',
  },
  favLabelTexto: {
    fontSize: 12,
    color: '#d68910',
    fontWeight: '700',
  },
});
