import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import CustomButton from "../components/CustomButton";
import { colors } from "../theme";

const RecommendationsScreen = () => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const user = getAuth().currentUser;

  const fetchRecommendations = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, "recommendations"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const list = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecommendations(list);
    } catch (error) {
      console.error("Error al obtener recomendaciones:", error);
    }
  };

  const addRecommendation = async () => {
    if (!user) return;
    try {
      const newRec = {
        date: new Date().toISOString().split("T")[0],
        recommendation: "Tomar descansos cortos al trabajar 🧘",
        source: "IA personalizada",
        userId: user.uid,
      };

      await addDoc(collection(db, "recommendations"), newRec);
      fetchRecommendations();
    } catch (error) {
      console.error("Error al añadir recomendación:", error);
    }
  };

  const deleteRecommendation = async (id: string) => {
    try {
      await deleteDoc(doc(db, "recommendations", id));
      setRecommendations((prev) => prev.filter((rec) => rec.id !== id));
    } catch (error) {
      console.error("Error al eliminar recomendación:", error);
      Alert.alert("Error", "No se pudo eliminar la recomendación.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💡 Recomendaciones</Text>
      <Text style={styles.subtitle}>Pequeños consejos para sentirte mejor cada día 💛</Text>

      <FlatList
        data={recommendations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.recommendation}>{item.recommendation}</Text>
              <Text style={styles.meta}>📅 {item.date} · 📚 {item.source}</Text>
            </View>
            <CustomButton
              title="Eliminar"
              onPress={() => deleteRecommendation(item.id)}
              style={styles.deleteButton}
            />
          </View>
        )}
      />

      <CustomButton
        title="Añadir Recomendación"
        onPress={addRecommendation}
        style={styles.addButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 15,
    elevation: 3,
  },
  cardContent: {
    marginBottom: 12,
  },
  recommendation: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 6,
  },
  meta: {
    fontSize: 14,
    color: colors.muted,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addButton: {
    backgroundColor: colors.success,
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 25,
  },
});

export default RecommendationsScreen;
