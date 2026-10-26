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

type Sneaker = {
  id: number;
  modelo: string;
  marca: string;
  stock: number;
};

const API_URL = 'http://localhost:3000';

export default function App() {
  const [sneakers, setSneakers] = useState<Sneaker[]>([]);
  const [modelo, setModelo] = useState('');
  const [marca, setMarca] = useState('');
  const [stockInicial, setStockInicial] = useState('1');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarSneakers() {
      try {
        const respuesta = await fetch(`${API_URL}/sneakers`);
        if (!respuesta.ok) {
          throw new Error('No se ha podido cargar la colección');
        }
        setSneakers(await respuesta.json());
      } catch {
        setError('No se ha podido conectar con NestJS. Revisa la IP y el puerto.');
      } finally {
        setCargando(false);
      }
    }

    void cargarSneakers();
  }, []);

  async function crearSneaker() {
    setError('');
    const stock = Number(stockInicial);
    if (!modelo.trim() || !marca.trim() || !Number.isInteger(stock) || stock < 0) {
      setError('Indica el modelo, la marca y un stock entero igual o mayor que cero.');
      return;
    }

    try {
      const respuesta = await fetch(`${API_URL}/sneakers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modelo: modelo.trim(), marca: marca.trim(), stock }),
      });
      if (!respuesta.ok) {
        throw new Error('No se ha podido crear el sneaker');
      }
      const nuevo: Sneaker = await respuesta.json();
      setSneakers((actuales) => [...actuales, nuevo]);
      setModelo('');
      setMarca('');
      setStockInicial('1');
    } catch {
      setError('No se ha podido guardar el sneaker.');
    }
  }

  async function cambiarStock(sneaker: Sneaker, cambio: number) {
    const stock = sneaker.stock + cambio;
    if (stock < 0) {
      return;
    }

    setError('');
    try {
      const respuesta = await fetch(`${API_URL}/sneakers/${sneaker.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock }),
      });
      if (!respuesta.ok) {
        throw new Error('No se ha podido actualizar el stock');
      }
      const actualizado: Sneaker = await respuesta.json();
      setSneakers((actuales) =>
        actuales.map((item) => (item.id === actualizado.id ? actualizado : item)),
      );
    } catch {
      setError('No se ha podido actualizar el stock.');
    }
  }

  async function eliminarSneaker(id: number) {
    setError('');
    try {
      const respuesta = await fetch(`${API_URL}/sneakers/${id}`, {
        method: 'DELETE',
      });
      if (!respuesta.ok) {
        throw new Error('No se ha podido eliminar el sneaker');
      }
      setSneakers((actuales) => actuales.filter((item) => item.id !== id));
    } catch {
      setError('No se ha podido eliminar el sneaker.');
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.eyebrow}>SNEAKER VAULT</Text>
          <Text style={styles.title}>Mi colección</Text>
          <Text style={styles.subtitle}>Controla tus modelos y existencias</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitle}>Añadir sneaker</Text>
          <TextInput
            style={styles.input}
            placeholder="Modelo"
            placeholderTextColor="#94A3B8"
            value={modelo}
            onChangeText={setModelo}
          />
          <TextInput
            style={styles.input}
            placeholder="Marca"
            placeholderTextColor="#94A3B8"
            value={marca}
            onChangeText={setMarca}
          />
          <TextInput
            style={styles.input}
            placeholder="Stock inicial"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
            value={stockInicial}
            onChangeText={setStockInicial}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => void crearSneaker()}
            style={styles.addButton}
          >
            <Text style={styles.buttonText}>Guardar sneaker</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Sneakers guardados</Text>
        {error !== '' && <Text style={styles.error}>{error}</Text>}
        {cargando ? (
          <ActivityIndicator size="large" style={styles.center} />
        ) : (
          <View style={styles.list}>
            {sneakers.length === 0 && (
              <Text style={styles.empty}>Todavía no hay sneakers guardados.</Text>
            )}
            {sneakers.map((sneaker) => (
              <View key={sneaker.id} style={styles.card}>
                <View style={styles.shoeIcon}>
                  <Text style={styles.shoeEmoji}>👟</Text>
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.model}>{sneaker.modelo}</Text>
                  <Text style={styles.brand}>{sneaker.marca}</Text>
                  {sneaker.stock === 0 ? (
                    <Text style={styles.soldOut}>AGOTADO</Text>
                  ) : (
                    <Text style={styles.stock}>Stock: {sneaker.stock}</Text>
                  )}
                </View>
                <View style={styles.actions}>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Reducir stock de ${sneaker.modelo}`}
                    onPress={() => void cambiarStock(sneaker, -1)}
                    disabled={sneaker.stock === 0}
                    style={[styles.stockButton, sneaker.stock === 0 && styles.disabled]}
                  >
                    <Text style={styles.buttonText}>−</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Aumentar stock de ${sneaker.modelo}`}
                    onPress={() => void cambiarStock(sneaker, 1)}
                    style={styles.stockButton}
                  >
                    <Text style={styles.buttonText}>+</Text>
                  </Pressable>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Eliminar ${sneaker.modelo}`}
                    onPress={() => void eliminarSneaker(sneaker.id)}
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
  header: { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 16 },
  eyebrow: { color: '#A78BFA', fontSize: 12, fontWeight: '800', letterSpacing: 2 },
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
  addButton: {
    alignItems: 'center',
    backgroundColor: '#6D28D9',
    borderRadius: 10,
    padding: 14,
    marginTop: 14,
  },
  buttonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  sectionTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', margin: 20 },
  list: { paddingHorizontal: 18, paddingBottom: 24 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  shoeIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shoeEmoji: { fontSize: 23 },
  cardContent: { flex: 1, marginLeft: 12 },
  model: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  brand: { color: '#94A3B8', marginTop: 3 },
  stock: { color: '#C4B5FD', fontWeight: '700', marginTop: 5 },
  soldOut: { color: '#FCA5A5', fontWeight: '900', marginTop: 5, letterSpacing: 1 },
  actions: { alignItems: 'center', gap: 6, marginLeft: 8 },
  stockButton: {
    width: 32,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#5B21B6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: { opacity: 0.45 },
  deleteButton: {
    width: 32,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#7F1D1D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: { color: '#FECACA', fontSize: 22, lineHeight: 25 },
  center: { marginTop: 36 },
  empty: { color: '#94A3B8', textAlign: 'center', marginVertical: 20 },
  error: { color: '#FCA5A5', marginHorizontal: 22, marginBottom: 10 },
});
