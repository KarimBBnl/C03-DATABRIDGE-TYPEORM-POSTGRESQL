import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Mascota = {
  id: number;
  nombre: string;
  raza: string;
  edad: number;
  nivelEnergia: string;
};

// En un móvil físico, sustituye localhost por la IPv4 del ordenador.
const API_URL = 'http://localhost:3000';

export default function App() {
  const [idSeleccionado, setIdSeleccionado] = useState(1);
  const [mascota, setMascota] = useState<Mascota | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activa = true;

    async function cargarMascota() {
      setCargando(true);
      setError('');
      try {
        const respuesta = await fetch(`${API_URL}/mascotas/${idSeleccionado}`);
        if (!respuesta.ok) {
          throw new Error('No se ha podido cargar la ficha');
        }
        const datos: Mascota = await respuesta.json();
        if (activa) {
          setMascota(datos);
        }
      } catch {
        if (activa) {
          setError('No se ha podido conectar con NestJS. Revisa la IP y el puerto.');
          setMascota(null);
        }
      } finally {
        if (activa) {
          setCargando(false);
        }
      }
    }

    void cargarMascota();
    return () => {
      activa = false;
    };
  }, [idSeleccionado]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.eyebrow}>PET PROFILE</Text>
        <Text style={styles.title}>Ficha de mascota</Text>
        <Text style={styles.subtitle}>Consulta un registro por su identificador</Text>
      </View>

      <View style={styles.selector}>
        {[1, 2, 3].map((id) => (
          <Pressable
            key={id}
            accessibilityRole="button"
            accessibilityLabel={`Ver mascota ${id}`}
            onPress={() => setIdSeleccionado(id)}
            style={[styles.idButton, id === idSeleccionado && styles.idButtonSelected]}
          >
            <Text style={styles.idText}>{id}</Text>
          </Pressable>
        ))}
      </View>

      {cargando && <ActivityIndicator size="large" style={styles.center} />}
      {error !== '' && <Text style={styles.error}>{error}</Text>}
      {!cargando && error === '' && mascota !== null && (
        <View style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.petEmoji}>🐾</Text>
          </View>
          <Text style={styles.petName}>{mascota.nombre}</Text>
          <Text style={styles.breed}>{mascota.raza}</Text>
          <View style={styles.details}>
            <Text style={styles.label}>EDAD</Text>
            <Text style={styles.value}>{mascota.edad} años</Text>
          </View>
          <View style={styles.details}>
            <Text style={styles.label}>NIVEL DE ENERGÍA</Text>
            <Text style={styles.value}>{mascota.nivelEnergia}</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 20 },
  eyebrow: { color: '#34D399', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#FFFFFF', fontSize: 30, fontWeight: '800', marginTop: 4 },
  subtitle: { color: '#94A3B8', marginTop: 6 },
  selector: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  idButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  idButtonSelected: { backgroundColor: '#059669' },
  idText: { color: '#FFFFFF', fontWeight: '800' },
  center: { marginTop: 80 },
  card: {
    margin: 20,
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    alignItems: 'center',
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  petEmoji: { fontSize: 42 },
  petName: { color: '#FFFFFF', fontSize: 28, fontWeight: '800', marginTop: 16 },
  breed: { color: '#94A3B8', fontSize: 16, marginTop: 4 },
  details: {
    width: '100%',
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#0F172A',
  },
  label: { color: '#6EE7B7', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  value: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', marginTop: 5 },
  error: { color: '#FCA5A5', paddingHorizontal: 24, marginTop: 30, textAlign: 'center' },
});
