import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import CustomButton from "../components/CustomButton";
import { colors } from "../theme";
import { getAuth } from "firebase/auth";

const RemindersScreen = () => {
  const [message, setMessage] = useState("");
  const [repeat, setRepeat] = useState("");
  const [time, setTime] = useState("");
  const [reminders, setReminders] = useState<any[]>([]);
  const user = getAuth().currentUser;

  useEffect(() => {
    const fetchReminders = async () => {
      if (!user) return;
      try {
        const q = query(collection(db, "reminders"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const remindersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReminders(remindersList);
      } catch (error) {
        console.error("Error al obtener recordatorios:", error);
      }
    };

    fetchReminders();
  }, [user]);

  const handleAddReminder = async () => {
    if (!user) return;
    if (!message.trim() || !repeat.trim() || !time.trim()) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "reminders"), {
        message,
        repeat,
        time,
        userId: user.uid,
      });

      setReminders((prev) => [
        ...prev,
        { id: docRef.id, message, repeat, time, userId: user.uid },
      ]);

      setMessage("");
      setRepeat("");
      setTime("");
    } catch (error) {
      console.error("Error al agregar recordatorio:", error);
    }
  };

  const handleDeleteReminder = async (id: string) => {
    try {
      await deleteDoc(doc(db, "reminders", id));
      setReminders((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error al eliminar recordatorio:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <FlatList
        ListHeaderComponent={
          <View>
            <Text style={styles.title}>📌 Recordatorios</Text>
            <Text style={styles.subtitle}>
              Mantén tu rutina emocional en orden ✨
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Mensaje del recordatorio"
              placeholderTextColor={colors.muted}
              value={message}
              onChangeText={setMessage}
            />

            <TextInput
              style={styles.input}
              placeholder="Repetición (Ej: Diario, Semanal, etc.)"
              placeholderTextColor={colors.muted}
              value={repeat}
              onChangeText={setRepeat}
            />

            <TextInput
              style={styles.input}
              placeholder="Hora (Ej: 08:30 AM)"
              placeholderTextColor={colors.muted}
              value={time}
              onChangeText={setTime}
            />

            <CustomButton
              title="Agregar"
              onPress={handleAddReminder}
              style={styles.addButton}
            />

            <Text style={styles.sectionTitle}>🗓️ Tus recordatorios</Text>
          </View>
        }
        data={reminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reminderCard}>
            <View style={styles.reminderTextContainer}>
              <Text style={styles.reminderMessage}>{item.message}</Text>
              <Text style={styles.reminderDetails}>
                {item.repeat} · {item.time}
              </Text>
            </View>
            <CustomButton
              title="Eliminar"
              onPress={() => handleDeleteReminder(item.id)}
              style={styles.deleteButton}
            />
          </View>
        )}
        contentContainerStyle={styles.container}
      />
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
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: colors.card,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 15,
    elevation: 2,
  },
  addButton: {
    backgroundColor: colors.success,
    borderRadius: 25,
    paddingVertical: 12,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: colors.text,
  },
  reminderCard: {
    backgroundColor: colors.card,
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  reminderTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  reminderMessage: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  reminderDetails: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
});

export default RemindersScreen;

