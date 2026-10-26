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

type Prioridad = 'ALTA' | 'MEDIA' | 'BAJA';
type Destino = {
  id: number;
  nombre: string;
  pais: string;
  prioridad: Prioridad;
  visitado: boolean;
};

const API_URL = 'http://localhost:3000';
const prioridades: Prioridad[] = ['ALTA', 'MEDIA', 'BAJA'];

export default function App() {
  const [destinos, setDestinos] = useState<Destino[]>([]);
  const [nombre, setNombre] = useState('');
  const [pais, setPais] = useState('');
  const [prioridad, setPrioridad] = useState<Prioridad>('MEDIA');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarDestinos() {
      try {
        const respuesta = await fetch(`${API_URL}/destinos`);
        if (!respuesta.ok) {
          throw new Error('No se han podido cargar los destinos');
        }
        setDestinos(await respuesta.json());
      } catch {
        setError('No se ha podido conectar con NestJS. Revisa la IP y el puerto.');
      } finally {
        setCargando(false);
      }
    }

    void cargarDestinos();
  }, []);

  async function crearDestino() {
    if (!nombre.trim() || !pais.trim()) {
      setError('Indica el destino y el país.');
      return;
    }
    setError('');
    try {
      const respuesta = await fetch(`${API_URL}/destinos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          pais: pais.trim(),
          prioridad,
        }),
      });
      if (!respuesta.ok) {
        throw new Error('No se ha podido crear el destino');
      }
      const nuevo: Destino = await respuesta.json();
      setDestinos((actuales) =>
        [...actuales, nuevo].sort(
          (a, b) =>
            prioridades.indexOf(a.prioridad) - prioridades.indexOf(b.prioridad) ||
            a.nombre.localeCompare(b.nombre),
        ),
      );
      setNombre('');
      setPais('');
    } catch {
      setError('No se ha podido guardar el destino.');
    }
  }

  async function actualizarDestino(id: number, cambios: Partial<Destino>) {
    setError('');
    try {
      const respuesta = await fetch(`${API_URL}/destinos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cambios),
      });
      if (!respuesta.ok) {
        throw new Error('No se ha podido actualizar el destino');
      }
      const actualizado: Destino = await respuesta.json();
      setDestinos((actuales) =>
        actuales
          .map((destino) => (destino.id === id ? actualizado : destino))
          .sort(
            (a, b) =>
              prioridades.indexOf(a.prioridad) - prioridades.indexOf(b.prioridad) ||
              a.nombre.localeCompare(b.nombre),
          ),
      );
    } catch {
      setError('No se han podido guardar los cambios del destino.');
    }
  }

  async function eliminarDestino(id: number) {
    setError('');
    try {
      const respuesta = await fetch(`${API_URL}/destinos/${id}`, {
        method: 'DELETE',
      });
      if (!respuesta.ok) {
        throw new Error('No se ha podido eliminar el destino');
      }
      setDestinos((actuales) => actuales.filter((destino) => destino.id !== id));
    } catch {
      setError('No se ha podido eliminar el destino.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.eyebrow}>WANDER</Text>
          <Text style={styles.title}>Mis destinos</Text>
          <Text style={styles.subtitle}>Organiza tus próximos viajes</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Añadir destino</Text>
          <TextInput
            style={styles.input}
            placeholder="Destino"
            placeholderTextColor="#94A3B8"
            value={nombre}
            onChangeText={setNombre}
          />
          <TextInput
            style={styles.input}
            placeholder="País"
            placeholderTextColor="#94A3B8"
            value={pais}
            onChangeText={setPais}
          />
          <View style={styles.priorityChoices}>
            {prioridades.map((opcion) => (
              <Pressable
                key={opcion}
                accessibilityRole="button"
                onPress={() => setPrioridad(opcion)}
                style={[
                  styles.priorityButton,
                  prioridad === opcion && styles.prioritySelected,
                ]}
              >
                <Text style={styles.priorityText}>{opcion}</Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => void crearDestino()}
            style={styles.addButton}
          >
            <Text style={styles.buttonText}>Guardar destino</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Prioridad más alta primero</Text>
        {error !== '' && <Text style={styles.error}>{error}</Text>}
        {cargando ? (
          <ActivityIndicator size="large" style={styles.center} />
        ) : destinos.length === 0 ? (
          <Text style={styles.empty}>Aún no hay destinos guardados.</Text>
        ) : (
          <View style={styles.list}>
            {destinos.map((destino) => (
              <View key={destino.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardContent}>
                    <Text style={styles.destination}>{destino.nombre}</Text>
                    <Text style={styles.country}>{destino.pais}</Text>
                  </View>
                  <View
                    style={[
                      styles.priorityBadge,
                      destino.prioridad === 'ALTA' && styles.highPriority,
                    ]}
                  >
                    <Text style={styles.badgeText}>
                      {`PRIORIDAD ${destino.prioridad}`}
                    </Text>
                  </View>
                </View>
                <Text style={destino.visitado ? styles.visited : styles.notVisited}>
                  {destino.visitado ? '✓ Visitado' : '○ Pendiente de visitar'}
                </Text>
                <View style={styles.actions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => {
                      const nextIndex =
                        (prioridades.indexOf(destino.prioridad) + 1) %
                        prioridades.length;
                      void actualizarDestino(destino.id, {
                        prioridad: prioridades[nextIndex],
                      });
                    }}
                    style={styles.actionButton}
                  >
                    <Text style={styles.actionText}>Cambiar prioridad</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() =>
                      void actualizarDestino(destino.id, {
                        visitado: !destino.visitado,
                      })
                    }
                    style={styles.actionButton}
                  >
                    <Text style={styles.actionText}>
                      {destino.visitado ? 'Desmarcar' : 'Marcar visitado'}
                    </Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Eliminar ${destino.nombre}`}
                    onPress={() => void eliminarDestino(destino.id)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteText}>Eliminar</Text>
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
  header: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 18 },
  eyebrow: { color: '#34D399', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', marginTop: 4 },
  subtitle: { color: '#94A3B8', marginTop: 6 },
  form: { marginHorizontal: 18, padding: 18, borderRadius: 18, backgroundColor: '#1E293B' },
  formTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginBottom: 8 },
  input: {
    color: '#FFFFFF',
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 9,
  },
  priorityChoices: { flexDirection: 'row', gap: 8, marginTop: 12 },
  priorityButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#334155',
    borderRadius: 9,
    paddingVertical: 10,
  },
  prioritySelected: { backgroundColor: '#047857' },
  priorityText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800' },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#047857',
    borderRadius: 10,
    padding: 14,
    marginTop: 14,
  },
  buttonText: { color: '#FFFFFF', fontWeight: '800' },
  sectionTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', margin: 20 },
  center: { marginTop: 36 },
  list: { paddingHorizontal: 18, paddingBottom: 24 },
  card: { backgroundColor: '#1E293B', borderRadius: 16, padding: 16, marginBottom: 12 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  cardContent: { flex: 1 },
  destination: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
  country: { color: '#94A3B8', marginTop: 4 },
  priorityBadge: { backgroundColor: '#334155', borderRadius: 999, padding: 8 },
  highPriority: { backgroundColor: '#B45309' },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '900' },
  visited: { color: '#6EE7B7', fontWeight: '700', marginTop: 14 },
  notVisited: { color: '#FCD34D', fontWeight: '700', marginTop: 14 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  actionButton: { backgroundColor: '#334155', borderRadius: 8, padding: 9 },
  actionText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  deleteButton: { backgroundColor: '#7F1D1D', borderRadius: 8, padding: 9 },
  deleteText: { color: '#FECACA', fontSize: 11, fontWeight: '700' },
  empty: { color: '#94A3B8', textAlign: 'center', marginTop: 20 },
  error: { color: '#FCA5A5', marginHorizontal: 20, marginBottom: 10 },
});
