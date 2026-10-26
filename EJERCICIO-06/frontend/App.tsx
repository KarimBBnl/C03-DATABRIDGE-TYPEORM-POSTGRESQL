import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Libro = {
  id: number;
  titulo: string;
  autor: string;
  leido: boolean;
};

const API_URL = 'http://localhost:3000';

export default function App() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarLibros() {
      try {
        const respuesta = await fetch(`${API_URL}/libros`);
        if (!respuesta.ok) {
          throw new Error('No se ha podido cargar la biblioteca');
        }
        setLibros(await respuesta.json());
      } catch {
        setError('No se ha podido conectar con NestJS. Revisa la IP y el puerto.');
      } finally {
        setCargando(false);
      }
    }

    void cargarLibros();
  }, []);

  async function marcarComoLeido(libro: Libro) {
    setError('');
    try {
      const respuesta = await fetch(`${API_URL}/libros/${libro.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leido: !libro.leido }),
      });
      if (!respuesta.ok) {
        throw new Error('No se ha podido actualizar el libro');
      }
      const actualizado: Libro = await respuesta.json();
      setLibros((actuales) =>
        actuales.map((item) => (item.id === actualizado.id ? actualizado : item)),
      );
    } catch {
      setError('No se ha podido guardar el estado de lectura.');
    }
  }

  async function eliminarLibro(id: number) {
    setError('');
    try {
      const respuesta = await fetch(`${API_URL}/libros/${id}`, {
        method: 'DELETE',
      });
      if (!respuesta.ok) {
        throw new Error('No se ha podido eliminar el libro');
      }
      setLibros((actuales) => actuales.filter((item) => item.id !== id));
    } catch {
      setError('No se ha podido eliminar el libro. La lista no se ha modificado.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>MY LIBRARY</Text>
          <Text style={styles.title}>Mi biblioteca</Text>
          <Text style={styles.subtitle}>Gestiona tus lecturas</Text>
        </View>

        {error !== '' && <Text style={styles.error}>{error}</Text>}
        {cargando ? (
          <ActivityIndicator size="large" style={styles.center} />
        ) : libros.length === 0 ? (
          <Text style={styles.empty}>No quedan libros en la biblioteca.</Text>
        ) : (
          <View style={styles.list}>
            {libros.map((libro) => (
              <View key={libro.id} style={styles.card}>
                <View style={styles.icon}>
                  <Text style={styles.bookEmoji}>📚</Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.bookTitle}>{libro.titulo}</Text>
                  <Text style={styles.author}>{libro.autor}</Text>
                  <Text style={libro.leido ? styles.read : styles.pending}>
                    {libro.leido ? 'Leído' : 'Pendiente'}
                  </Text>
                </View>
                <View style={styles.actions}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={libro.leido ? 'Marcar como pendiente' : 'Marcar como leído'}
                    onPress={() => void marcarComoLeido(libro)}
                    style={styles.readButton}
                  >
                    <Text style={styles.readButtonText}>
                      {libro.leido ? '↶' : '✓'}
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Eliminar ${libro.titulo}`}
                    onPress={() => void eliminarLibro(libro.id)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteText}>×</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 20 },
  eyebrow: { color: '#C084FC', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', marginTop: 4 },
  subtitle: { color: '#94A3B8', marginTop: 6 },
  center: { marginTop: 70 },
  list: { paddingHorizontal: 18, paddingBottom: 24 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookEmoji: { fontSize: 23 },
  cardContent: { flex: 1, marginLeft: 12 },
  bookTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  author: { color: '#94A3B8', marginTop: 3 },
  read: { color: '#6EE7B7', fontWeight: '700', marginTop: 5 },
  pending: { color: '#FCD34D', fontWeight: '700', marginTop: 5 },
  actions: { flexDirection: 'row', gap: 8, marginLeft: 8 },
  readButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#047857',
    alignItems: 'center',
    justifyContent: 'center',
  },
  readButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#7F1D1D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: { color: '#FECACA', fontSize: 24, lineHeight: 28 },
  empty: { color: '#94A3B8', textAlign: 'center', marginTop: 30 },
  error: { color: '#FCA5A5', paddingHorizontal: 24, textAlign: 'center' },
});
