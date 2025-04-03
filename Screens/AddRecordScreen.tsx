import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import CustomButton from "../components/CustomButton";
import { colors } from "../theme";

const AddRecordScreen = ({ navigation }: any) => {
  const [date, setDate] = useState("");
  const [mood, setMood] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [notes, setNotes] = useState("");
  const [bloodPressure, setBloodPressure] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [weight, setWeight] = useState("");

  const user = getAuth().currentUser;

  const handleAddRecord = async () => {
    if (!user) return;
    if (!date.trim() || !mood.trim() || !bloodPressure.trim() || !heartRate.trim()) {
      Alert.alert("Error", "Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      await addDoc(collection(db, "records"), {
        userId: user.uid,
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.wrapper}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Añadir Registro Diario</Text>
        <Text style={styles.subtitle}>
          Cuida tu bienestar registrando cómo te sientes cada día 💖
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Fecha (YYYY-MM-DD)"
          placeholderTextColor={colors.muted}
          value={date}
          onChangeText={setDate}
        />

        <TextInput
          style={styles.input}
          placeholder="Presión arterial (Ej: 120/80)"
          placeholderTextColor={colors.muted}
          value={bloodPressure}
          onChangeText={setBloodPressure}
        />

        <TextInput
          style={styles.input}
          placeholder="Frecuencia cardiaca (Ej: 72)"
          placeholderTextColor={colors.muted}
          keyboardType="numeric"
          value={heartRate}
          onChangeText={setHeartRate}
        />

        <TextInput
          style={styles.input}
          placeholder="Peso (Ej: 72.5 - opcional)"
          placeholderTextColor={colors.muted}
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />

        <TextInput
          style={styles.input}
          placeholder="Estado de ánimo (Ej: Feliz, Triste, etc.)"
          placeholderTextColor={colors.muted}
          value={mood}
          onChangeText={setMood}
        />

        <TextInput
          style={styles.input}
          placeholder="Síntomas (separados por coma)"
          placeholderTextColor={colors.muted}
          value={symptoms}
          onChangeText={setSymptoms}
        />

        <TextInput
          style={[styles.input, styles.notes]}
          placeholder="Notas adicionales (opcional)"
          placeholderTextColor={colors.muted}
          value={notes}
          onChangeText={setNotes}
          multiline
        />

        <CustomButton
          title="Guardar Registro"
          onPress={handleAddRecord}
          style={styles.saveButton}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 30,
    textAlign: "center",
    lineHeight: 22,
  },
  input: {
    width: "100%",
    backgroundColor: colors.card,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  notes: {
    height: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: colors.primary,
    width: "100%",
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 10,
  },
});

export default AddRecordScreen;
