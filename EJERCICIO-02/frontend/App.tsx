import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Pelicula = {
  id: number;
  titulo: string;
  genero: string;
  anio: number;
  puntuacion: number;
  favorita: boolean;
};

// En un móvil físico, sustituye localhost por la IPv4 del ordenador.
const API_URL = 'http://localhost:3000';

export default function App() {
  const [peliculas, setPeliculas] = useState<Pelicula[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarPeliculas() {
      try {
        const respuesta = await fetch(`${API_URL}/peliculas`);
        if (!respuesta.ok) {
          throw new Error('La API no ha respondido correctamente');
        }
        const datos: Pelicula[] = await respuesta.json();
        setPeliculas(datos);
      } catch {
        setError('No se ha podido conectar con NestJS. Revisa la IP y el puerto.');
      } finally {
        setCargando(false);
      }
    }

    void cargarPeliculas();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.eyebrow}>CINEBOX</Text>
        <Text style={styles.title}>Mis películas</Text>
        <Text style={styles.subtitle}>Tu colección, ordenada por puntuación</Text>
      </View>

      {cargando && <ActivityIndicator size="large" style={styles.center} />}
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      {!cargando && error === '' && (
        <FlatList
          data={peliculas}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.poster}>
                <Text style={styles.filmIcon}>🎬</Text>
                <Text style={item.favorita ? styles.heartSelected : styles.heart}>
                  {item.favorita ? '♥' : '♡'}
                </Text>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.movieTitle}>{item.titulo}</Text>
                <Text style={styles.details}>
                  {item.genero} · {item.anio}
                </Text>
                <Text style={styles.score}>
                  ★ {Number(item.puntuacion).toFixed(1)}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 20 },
  eyebrow: { color: '#F472B6', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', marginTop: 4 },
  subtitle: { color: '#94A3B8', marginTop: 6 },
  list: { paddingHorizontal: 18, paddingBottom: 24 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  poster: {
    width: 56,
    height: 68,
    borderRadius: 12,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filmIcon: { fontSize: 26 },
  heart: { color: '#CBD5E1', fontSize: 20, position: 'absolute', top: 4, right: 6 },
  heartSelected: { color: '#FB7185', fontSize: 20, position: 'absolute', top: 4, right: 6 },
  cardContent: { flex: 1, marginLeft: 14 },
  movieTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  details: { color: '#94A3B8', marginTop: 4 },
  score: { color: '#FDE68A', fontWeight: '800', marginTop: 8 },
  center: { marginTop: 80 },
  error: { color: '#FCA5A5', paddingHorizontal: 24, marginTop: 30, textAlign: 'center' },
});
