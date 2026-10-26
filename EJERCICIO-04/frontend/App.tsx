import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Restaurante = {
  id: number;
  nombre: string;
  tipoCocina: string;
  ciudad: string;
  precioMedio: number;
};

const API_URL = 'http://localhost:3000';

export default function App() {
  const [restaurantes, setRestaurantes] = useState<Restaurante[]>([]);
  const [nombre, setNombre] = useState('');
  const [tipoCocina, setTipoCocina] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [precioMedio, setPrecioMedio] = useState('');
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarRestaurantes() {
      try {
        const respuesta = await fetch(`${API_URL}/restaurantes`);
        if (!respuesta.ok) {
          throw new Error('No se ha podido cargar la lista');
        }
        setRestaurantes(await respuesta.json());
      } catch {
        setError('No se ha podido conectar con NestJS. Revisa la IP y el puerto.');
      } finally {
        setCargando(false);
      }
    }

    void cargarRestaurantes();
  }, []);

  async function crearRestaurante() {
    setError('');
    const precio = Number(precioMedio.replace(',', '.'));
    if (!nombre.trim() || !tipoCocina.trim() || !ciudad.trim() || !precioMedio.trim() || !Number.isFinite(precio) || precio < 0) {
      setError('Completa todos los campos e introduce un precio válido.');
      return;
    }

    setEnviando(true);
    try {
      const respuesta = await fetch(`${API_URL}/restaurantes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          tipoCocina: tipoCocina.trim(),
          ciudad: ciudad.trim(),
          precioMedio: precio,
        }),
      });
      if (!respuesta.ok) {
        throw new Error('La API ha rechazado los datos');
      }

      const nuevoRestaurante: Restaurante = await respuesta.json();
      setRestaurantes((actuales) => [nuevoRestaurante, ...actuales]);
      setNombre('');
      setTipoCocina('');
      setCiudad('');
      setPrecioMedio('');
    } catch {
      setError('No se ha podido guardar el restaurante. Comprueba la conexión con la API.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.eyebrow}>FOOD SPOTS</Text>
            <Text style={styles.title}>Descubre y guarda</Text>
            <Text style={styles.subtitle}>Añade un restaurante a tu colección</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.formTitle}>Nuevo restaurante</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre"
              placeholderTextColor="#94A3B8"
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              style={styles.input}
              placeholder="Tipo de cocina"
              placeholderTextColor="#94A3B8"
              value={tipoCocina}
              onChangeText={setTipoCocina}
            />
            <TextInput
              style={styles.input}
              placeholder="Ciudad"
              placeholderTextColor="#94A3B8"
              value={ciudad}
              onChangeText={setCiudad}
            />
            <TextInput
              style={styles.input}
              placeholder="Precio medio (€)"
              placeholderTextColor="#94A3B8"
              keyboardType="decimal-pad"
              value={precioMedio}
              onChangeText={setPrecioMedio}
            />
            {error !== '' && <Text style={styles.error}>{error}</Text>}
            <Pressable
              accessibilityRole="button"
              onPress={() => void crearRestaurante()}
              disabled={enviando}
              style={[styles.submit, enviando && styles.submitDisabled]}
            >
              <Text style={styles.submitText}>
                {enviando ? 'Guardando…' : 'Guardar restaurante'}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>Restaurantes guardados</Text>
          {cargando ? (
            <ActivityIndicator size="large" style={styles.center} />
          ) : (
            <View style={styles.list}>
              {restaurantes.length === 0 && (
                <Text style={styles.empty}>Aún no hay restaurantes guardados.</Text>
              )}
              {restaurantes.map((item) => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.icon}>
                    <Text style={styles.foodEmoji}>🍽️</Text>
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.restaurantName}>{item.nombre}</Text>
                    <Text style={styles.details}>
                      {item.tipoCocina} · {item.ciudad}
                    </Text>
                  </View>
                  <Text style={styles.price}>
                    {Number(item.precioMedio).toFixed(0)} €
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 18 },
  eyebrow: { color: '#FB923C', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  title: { color: '#FFFFFF', fontSize: 30, fontWeight: '800', marginTop: 4 },
  subtitle: { color: '#94A3B8', marginTop: 6 },
  form: {
    marginHorizontal: 18,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#1E293B',
  },
  formTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginBottom: 12 },
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
    backgroundColor: '#C2410C',
    borderRadius: 10,
    padding: 14,
    marginTop: 14,
  },
  submitDisabled: { opacity: 0.65 },
  submitText: { color: '#FFFFFF', fontWeight: '800' },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginHorizontal: 22,
    marginTop: 24,
    marginBottom: 12,
  },
  list: { paddingHorizontal: 18, paddingBottom: 24 },
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
  foodEmoji: { fontSize: 24 },
  cardContent: { flex: 1, marginLeft: 12 },
  restaurantName: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  details: { color: '#94A3B8', marginTop: 4 },
  price: { color: '#FDBA74', fontWeight: '800', marginLeft: 8 },
  center: { marginTop: 36 },
  empty: { color: '#94A3B8', textAlign: 'center', marginVertical: 20 },
  error: { color: '#FCA5A5', marginTop: 10 },
});
