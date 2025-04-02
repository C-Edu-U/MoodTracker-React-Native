import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const AddRecordScreen = ({ navigation }: any) => {
  const [date, setDate] = useState("");
  const [mood, setMood] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [notes, setNotes] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [weight, setWeight] = useState("");

  const handleAddRecord = async () => {
    if (!date.trim() || !mood.trim() || !bloodPressure.trim() || !heartRate.trim()) {
      Alert.alert("Error", "Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      await addDoc(collection(db, "records"), {
        date: new Date(date).toISOString(),
        mood,
        symptoms: symptoms.split(",").map((s) => s.trim()),
        notes: notes || "",
        bloodPressure,
        heartRate: parseInt(heartRate),
        weight: weight ? parseFloat(weight) : null,
      });

      Alert.alert("Éxito", "Registro añadido correctamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al agregar registro:", error);
      Alert.alert("Error", "No se pudo guardar el registro.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Añadir Registro Diario</Text>

      <TextInput
        style={styles.input}
        placeholder="Fecha (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
      />

      <TextInput
        style={styles.input}
        placeholder="Presión arterial (Ej: 120/80)"
        value={bloodPressure}
        onChangeText={setBloodPressure}
      />

      <TextInput
        style={styles.input}
        placeholder="Frecuencia cardiaca (Ej: 72)"
        keyboardType="numeric"
        value={heartRate}
        onChangeText={setHeartRate}
      />

      <TextInput
        style={styles.input}
        placeholder="Peso (Ej: 72.5 - opcional)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <TextInput
        style={styles.input}
        placeholder="Estado de ánimo (Ej: Feliz, Contento, Neutral, Triste, Deprimido, Enojado, Ansioso, Estresado, Cansado)"
        value={mood}
        onChangeText={setMood}
      />

      <TextInput
        style={styles.input}
        placeholder="Síntomas (separados por coma)"
        value={symptoms}
        onChangeText={setSymptoms}
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Notas adicionales (opcional)"
        value={notes}
        onChangeText={setNotes}
        multiline
      />

      <Button title="Guardar Registro" onPress={handleAddRecord} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: "#fff" 
  },
  title: { 
    fontSize: 22, 
    fontWeight: "bold", 
    marginBottom: 20, 
    textAlign: "center",
    color: "#333"
  },
  input: { 
    height: 50, 
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: "#f9f9f9"
  },
});

export default AddRecordScreen;