import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Evento = {
  id: number;
  nombre: string;
  ciudad: string;
  categoria: string;
};

const API_URL = 'http://localhost:3000';

export default function App() {
  const [ciudad, setCiudad] = useState('');
  const [categoria, setCategoria] = useState('');
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [buscando, setBuscando] = useState(false);
  const [buscado, setBuscado] = useState(false);
  const [error, setError] = useState('');

  async function buscarEventos() {
    setBuscando(true);
    setBuscado(true);
    setError('');
    const parametros = new URLSearchParams();
    if (ciudad.trim()) {
      parametros.set('ciudad', ciudad.trim());
    }
    if (categoria.trim()) {
      parametros.set('categoria', categoria.trim());
    }

    try {
      const query = parametros.toString();
      const respuesta = await fetch(
        `${API_URL}/eventos${query ? `?${query}` : ''}`,
      );
      if (!respuesta.ok) {
        throw new Error('La API no ha podido consultar los eventos');
      }
      setEventos(await respuesta.json());
    } catch {
      setEventos([]);
      setError('No se ha podido conectar con NestJS. Revisa la IP y el puerto.');
    } finally {
      setBuscando(false);
    }
  }

  function limpiarFiltros() {
    setCiudad('');
    setCategoria('');
    setBuscado(false);
    setEventos([]);
    setError('');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.eyebrow}>EVENT RADAR</Text>
          <Text style={styles.title}>Encuentra tu evento</Text>
          <Text style={styles.subtitle}>Combina ciudad y categoría para filtrar</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Ciudad (por ejemplo, Zaragoza)"
            placeholderTextColor="#94A3B8"
            value={ciudad}
            onChangeText={setCiudad}
          />
          <TextInput
            style={styles.input}
            placeholder="Categoría (por ejemplo, Tecnología)"
            placeholderTextColor="#94A3B8"
            value={categoria}
            onChangeText={setCategoria}
          />
          <View style={styles.buttons}>
            <Pressable
              accessibilityRole="button"
              onPress={() => void buscarEventos()}
              style={styles.searchButton}
            >
              <Text style={styles.buttonText}>Buscar</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={limpiarFiltros}
              style={styles.clearButton}
            >
              <Text style={styles.buttonText}>Limpiar</Text>
            </Pressable>
          </View>
        </View>

        {buscando && <ActivityIndicator size="large" style={styles.center} />}
        {error !== '' && <Text style={styles.error}>{error}</Text>}
        {buscado && !buscando && error === '' && (
          <View style={styles.list}>
            <Text style={styles.sectionTitle}>Resultados: {eventos.length}</Text>
            {eventos.length === 0 ? (
              <Text style={styles.empty}>No se encontraron eventos.</Text>
            ) : (
              eventos.map((evento) => (
                <View key={evento.id} style={styles.card}>
                  <View style={styles.icon}>
                    <Text style={styles.eventEmoji}>🎟️</Text>
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.eventName}>{evento.nombre}</Text>
                    <Text style={styles.details}>
                      {evento.ciudad} · {evento.categoria}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 18 },
  eyebrow: { color: '#FBBF24', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#FFFFFF', fontSize: 30, fontWeight: '800', marginTop: 4 },
  subtitle: { color: '#94A3B8', marginTop: 6 },
  form: { marginHorizontal: 18, padding: 18, borderRadius: 18, backgroundColor: '#1E293B' },
  input: {
    color: '#FFFFFF',
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 9,
  },
  buttons: { flexDirection: 'row', gap: 10, marginTop: 14 },
  searchButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#B45309',
    borderRadius: 10,
    padding: 13,
  },
  clearButton: {
    alignItems: 'center',
    backgroundColor: '#475569',
    borderRadius: 10,
    padding: 13,
    paddingHorizontal: 20,
  },
  buttonText: { color: '#FFFFFF', fontWeight: '800' },
  center: { marginTop: 40 },
  list: { paddingHorizontal: 18, paddingTop: 20, paddingBottom: 24 },
  sectionTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', marginBottom: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventEmoji: { fontSize: 23 },
  cardContent: { flex: 1, marginLeft: 12 },
  eventName: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  details: { color: '#94A3B8', marginTop: 4 },
  empty: { color: '#94A3B8', textAlign: 'center', marginVertical: 20 },
  error: { color: '#FCA5A5', margin: 20, textAlign: 'center' },
});
