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

type Viaje = {
  id: number;
  destino: string;
  pais: string;
  estado: string;
  fecha: string;
};

const API_URL = 'http://localhost:3000';

export default function App() {
  const [viajes, setViajes] = useState<Viaje[]>([]);
  const [idSeleccionado, setIdSeleccionado] = useState<number | null>(null);
  const [estado, setEstado] = useState('');
  const [fecha, setFecha] = useState('');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    async function cargarViajes() {
      try {
        const respuesta = await fetch(`${API_URL}/viajes`);
        if (!respuesta.ok) {
          throw new Error('No se ha podido cargar la lista de viajes');
        }
        const datos: Viaje[] = await respuesta.json();
        setViajes(datos);
      } catch {
        setError('No se ha podido conectar con NestJS. Revisa la IP y el puerto.');
      } finally {
        setCargando(false);
      }
    }

    void cargarViajes();
  }, []);

  function seleccionarViaje(viaje: Viaje) {
    setIdSeleccionado(viaje.id);
    setEstado(viaje.estado);
    setFecha(viaje.fecha.slice(0, 10));
    setError('');
    setMensaje('');
  }

  async function guardarCambios() {
    if (idSeleccionado === null) {
      return;
    }
    if (!estado.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      setError('Introduce un estado y una fecha con formato AAAA-MM-DD.');
      setMensaje('');
      return;
    }

    setGuardando(true);
    setError('');
    setMensaje('');
    try {
      const respuesta = await fetch(`${API_URL}/viajes/${idSeleccionado}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: estado.trim(), fecha }),
      });
      if (!respuesta.ok) {
        throw new Error('La API ha rechazado los cambios');
      }

      const actualizado: Viaje = await respuesta.json();
      setViajes((actuales) =>
        actuales.map((viaje) =>
          viaje.id === actualizado.id ? actualizado : viaje,
        ),
      );
      setEstado(actualizado.estado);
      setFecha(actualizado.fecha.slice(0, 10));
      setMensaje('Cambios guardados en PostgreSQL.');
    } catch {
      setError('No se han podido guardar los cambios. Revisa la conexión con la API.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.eyebrow}>TRAVEL BOOK</Text>
          <Text style={styles.title}>Mis viajes</Text>
          <Text style={styles.subtitle}>Selecciona un viaje para editarlo</Text>
        </View>

        {cargando ? (
          <ActivityIndicator size="large" style={styles.center} />
        ) : (
          <View style={styles.list}>
            {viajes.map((viaje) => (
              <Pressable
                key={viaje.id}
                accessibilityRole="button"
                onPress={() => seleccionarViaje(viaje)}
                style={[
                  styles.card,
                  viaje.id === idSeleccionado && styles.cardSelected,
                ]}
              >
                <Text style={styles.destination}>{viaje.destino}</Text>
                <Text style={styles.details}>
                  {viaje.pais} · {viaje.estado} · {viaje.fecha.slice(0, 10)}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {idSeleccionado !== null && (
          <View style={styles.form}>
            <Text style={styles.formTitle}>Editar viaje</Text>
            <Text style={styles.label}>ESTADO</Text>
            <TextInput
              style={styles.input}
              value={estado}
              onChangeText={setEstado}
              placeholder="RESERVADO"
              placeholderTextColor="#94A3B8"
            />
            <Text style={styles.label}>FECHA (AAAA-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={fecha}
              onChangeText={setFecha}
              placeholder="2026-11-12"
              placeholderTextColor="#94A3B8"
              keyboardType="numbers-and-punctuation"
            />
            {error !== '' && <Text style={styles.error}>{error}</Text>}
            {mensaje !== '' && <Text style={styles.success}>{mensaje}</Text>}
            <Pressable
              accessibilityRole="button"
              onPress={() => void guardarCambios()}
              disabled={guardando}
              style={[styles.submit, guardando && styles.disabled]}
            >
              <Text style={styles.submitText}>
                {guardando ? 'Guardando…' : 'Guardar cambios'}
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 18 },
  eyebrow: { color: '#38BDF8', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#FFFFFF', fontSize: 32, fontWeight: '800', marginTop: 4 },
  subtitle: { color: '#94A3B8', marginTop: 6 },
  center: { marginTop: 70 },
  list: { paddingHorizontal: 18 },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardSelected: { borderColor: '#38BDF8' },
  destination: { color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  details: { color: '#94A3B8', marginTop: 5 },
  form: {
    margin: 18,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#1E293B',
  },
  formTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', marginBottom: 16 },
  label: { color: '#7DD3FC', fontSize: 11, fontWeight: '800', marginTop: 10 },
  input: {
    color: '#FFFFFF',
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 6,
  },
  submit: {
    alignItems: 'center',
    backgroundColor: '#0369A1',
    borderRadius: 10,
    padding: 14,
    marginTop: 18,
  },
  disabled: { opacity: 0.65 },
  submitText: { color: '#FFFFFF', fontWeight: '800' },
  error: { color: '#FCA5A5', marginTop: 12 },
  success: { color: '#6EE7B7', marginTop: 12 },
});
