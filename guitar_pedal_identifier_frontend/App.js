import React, { useState } from 'react';
import { View, Text, Button, Image, ActivityIndicator, StyleSheet, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export default function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera permission', 'Allow camera access to photograph a pedal.');
      return;
    }

    const selection = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (selection.canceled || !selection.assets?.[0]) return;

    const asset = selection.assets[0];
    setImage(asset.uri);
    setResult(null);
    await uploadImage(asset);
  };

  const uploadImage = async (asset) => {
    setLoading(true);
    try {
      const form = new FormData();
      const name = asset.fileName || 'pedal.jpg';
      if (Platform.OS === 'web') {
        const blob = asset.file || await (await fetch(asset.uri)).blob();
        form.append('file', blob, name);
      } else {
        form.append('file', {
          uri: asset.uri,
          name,
          type: asset.mimeType || 'image/jpeg',
        });
      }
      const response = await fetch(`${API_BASE}/identify`, {
        method: 'POST',
        body: form,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || 'Upload failed');
      setResult(data);
    } catch (error) {
      Alert.alert('Upload failed', error.message || 'Check the API address and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PedalScan prototype</Text>
      <Button title="Photograph a pedal" onPress={pickImage} disabled={loading} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {loading && <ActivityIndicator size="large" />}
      {result && <Text style={styles.result}>{result.message}</Text>}
      <Text style={styles.note}>Image upload demo. Recognition and pricing are planned.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: '600', marginBottom: 16 },
  image: { width: 200, height: 200, marginVertical: 20 },
  result: { fontSize: 16, textAlign: 'center', marginBottom: 12 },
  note: { fontSize: 12, color: '#555', textAlign: 'center' },
});
