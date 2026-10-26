import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
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

type Cancion = {
  id: number;
  titulo: string;
  artista: string;
};

type Playlist = {
  id: number;
  nombre: string;
  canciones: Cancion[];
};

const API_URL = 'http://localhost:3000';

export default function App() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [playlistId, setPlaylistId] = useState<number | null>(null);
  const [titulo, setTitulo] = useState('');
  const [artista, setArtista] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarPlaylists() {
      try {
        const respuesta = await fetch(`${API_URL}/playlists`);
        if (!respuesta.ok) {
          throw new Error('No se han podido cargar las playlists');
        }
        const datos: Playlist[] = await respuesta.json();
        setPlaylists(datos);
        setPlaylistId(datos[0]?.id ?? null);
      } catch {
        setError('No se ha podido conectar con NestJS. Revisa la IP y el puerto.');
      } finally {
        setCargando(false);
      }
    }

    void cargarPlaylists();
  }, []);

  async function anadirCancion() {
    if (playlistId === null || !titulo.trim() || !artista.trim()) {
      setError('Selecciona una playlist e indica título y artista.');
      return;
    }

    setGuardando(true);
    setError('');
    try {
      const respuesta = await fetch(
        `${API_URL}/playlists/${playlistId}/canciones`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ titulo: titulo.trim(), artista: artista.trim() }),
        },
      );
      if (!respuesta.ok) {
        throw new Error('No se ha podido guardar la canción');
      }
      const nuevaCancion: Cancion = await respuesta.json();
      setPlaylists((actuales) =>
        actuales.map((playlist) =>
          playlist.id === playlistId
            ? { ...playlist, canciones: [...playlist.canciones, nuevaCancion] }
            : playlist,
        ),
      );
      setTitulo('');
      setArtista('');
    } catch {
      setError('No se ha podido añadir la canción a la playlist.');
    } finally {
      setGuardando(false);
    }
  }

  const playlistSeleccionada = playlists.find(
    (playlist) => playlist.id === playlistId,
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.eyebrow}>MY PLAYLISTS</Text>
          <Text style={styles.title}>Tu música</Text>
          <Text style={styles.subtitle}>Canciones relacionadas con una playlist</Text>
        </View>

        {cargando ? (
          <ActivityIndicator size="large" style={styles.center} />
        ) : (
          <>
            <View style={styles.selector}>
              {playlists.map((playlist) => (
                <Pressable
                  key={playlist.id}
                  accessibilityRole="button"
                  onPress={() => {
                    setPlaylistId(playlist.id);
                    setError('');
                  }}
                  style={[
                    styles.playlistButton,
                    playlist.id === playlistId && styles.playlistSelected,
                  ]}
                >
                  <Text style={styles.playlistButtonText}>{playlist.nombre}</Text>
                </Pressable>
              ))}
            </View>

            {playlistSeleccionada && (
              <View style={styles.content}>
                <Text style={styles.sectionTitle}>{playlistSeleccionada.nombre}</Text>
                {playlistSeleccionada.canciones.map((cancion) => (
                  <View key={cancion.id} style={styles.songCard}>
                    <Text style={styles.musicIcon}>♫</Text>
                    <View style={styles.songDetails}>
                      <Text style={styles.songTitle}>{cancion.titulo}</Text>
                      <Text style={styles.artist}>{cancion.artista}</Text>
                    </View>
                  </View>
                ))}
                {playlistSeleccionada.canciones.length === 0 && (
                  <Text style={styles.empty}>Todavía no hay canciones.</Text>
                )}

                <View style={styles.form}>
                  <Text style={styles.formTitle}>Añadir canción</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Título"
                    placeholderTextColor="#94A3B8"
                    value={titulo}
                    onChangeText={setTitulo}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Artista"
                    placeholderTextColor="#94A3B8"
                    value={artista}
                    onChangeText={setArtista}
                  />
                  <Pressable
                    accessibilityRole="button"
                    disabled={guardando}
                    onPress={() => void anadirCancion()}
                    style={[styles.submit, guardando && styles.disabled]}
                  >
                    <Text style={styles.submitText}>
                      {guardando ? 'Guardando…' : 'Añadir a esta playlist'}
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </>
        )}
        {error !== '' && <Text style={styles.error}>{error}</Text>}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 20 },
  eyebrow: { color: '#F472B6', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', marginTop: 4 },
  subtitle: { color: '#94A3B8', marginTop: 6 },
  center: { marginTop: 70 },
  selector: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 18 },
  playlistButton: {
    backgroundColor: '#1E293B',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  playlistSelected: { backgroundColor: '#9D174D' },
  playlistButtonText: { color: '#FFFFFF', fontWeight: '700' },
  content: { paddingHorizontal: 18, paddingBottom: 24 },
  sectionTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', marginTop: 22, marginBottom: 12 },
  songCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginBottom: 9,
  },
  musicIcon: { color: '#F9A8D4', fontSize: 28, width: 42 },
  songDetails: { flex: 1 },
  songTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  artist: { color: '#94A3B8', marginTop: 4 },
  form: { backgroundColor: '#1E293B', borderRadius: 18, padding: 18, marginTop: 20 },
  formTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginBottom: 8 },
  input: {
    color: '#FFFFFF',
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 9,
  },
  submit: {
    alignItems: 'center',
    backgroundColor: '#9D174D',
    borderRadius: 10,
    padding: 14,
    marginTop: 14,
  },
  disabled: { opacity: 0.65 },
  submitText: { color: '#FFFFFF', fontWeight: '800' },
  empty: { color: '#94A3B8', textAlign: 'center', marginVertical: 20 },
  error: { color: '#FCA5A5', margin: 20, textAlign: 'center' },
});
