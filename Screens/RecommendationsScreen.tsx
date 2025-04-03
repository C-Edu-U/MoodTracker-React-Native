import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { colors } from "../theme";

const RecommendationsScreen = () => {
  const [recommendations, setRecommendations] = useState([]);
  const user = getAuth().currentUser;

  const fetchRecommendations = async () => {
    if (!user) return;
    try {
      const q = query(
        collection(db, "recommendations"),
        where("userId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecommendations(list);
    } catch (error) {
      console.error("Error al obtener recomendaciones:", error);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleAccept = async (id: string) => {
    try {
      await deleteDoc(doc(db, "recommendations", id));
      setRecommendations((prev) => prev.filter((rec) => rec.id !== id));
      Alert.alert("Aceptado", "La recomendación ha sido eliminada.");
    } catch (error) {
      console.error("Error al eliminar recomendación:", error);
    }
  };

  const generateSmartRecommendation = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, "records"),
        where("userId", "==", user.uid),
        orderBy("date", "desc"),
        limit(7)
      );

      const snapshot = await getDocs(q);
      const records = snapshot.docs.map((doc) => doc.data());

      if (records.length === 0) {
        Alert.alert("Sin datos", "No hay registros recientes para analizar.");
        return;
      }

      const moodMap: Record<string, number> = {
        feliz: 5,
        contento: 4,
        neutral: 3,
        cansado: 3,
        triste: 2,
        ansioso: 2,
        estresado: 2,
        deprimido: 1,
        enojado: 1,
      };

      const moodScores = records.map((r) => moodMap[r.mood?.toLowerCase()] || 3);
      const avgMood = moodScores.reduce((a, b) => a + b, 0) / moodScores.length;

      const heartRates = records.map((r) => r.heartRate || 0);
      const avgHeartRate = heartRates.reduce((a, b) => a + b, 0) / heartRates.length;

      const weights = records
        .map((r) => r.weight)
        .filter((w) => w !== null && w !== undefined);
      const weightChange =
        weights.length >= 2 ? Math.abs(weights[0] - weights[weights.length - 1]) : 0;

      let recommendation = "";

      if (avgMood < 3) {
        recommendation +=
          "Parece que has estado sintiéndote decaído últimamente. Considera tomar pausas, hablar con alguien de confianza o hacer una actividad que disfrutes.\n\n";
      }

      if (avgHeartRate > 90) {
        recommendation +=
          "Tu frecuencia cardíaca promedio ha sido elevada. Intenta reducir el estrés y descansar más.\n\n";
      } else if (avgHeartRate < 50 && avgHeartRate > 0) {
        recommendation +=
          "Tu frecuencia cardíaca es bastante baja. Asegúrate de alimentarte bien y mantenerte activo.\n\n";
      }

      if (weightChange >= 3) {
        recommendation +=
          "Se ha detectado una variación importante en tu peso. Intenta mantener una alimentación y rutina más estable.\n\n";
      }

      if (recommendation === "") {
        recommendation =
          "¡Todo parece estar bien! Sigue cuidándote y mantén tus buenos hábitos 💪";
      }

      const newRec = {
        date: new Date().toISOString().split("T")[0],
        recommendation: recommendation.trim(),
        source: "Análisis de tus últimos 7 días",
        userId: user.uid,
      };

      await addDoc(collection(db, "recommendations"), newRec);
      fetchRecommendations();
      Alert.alert("Recomendación añadida", "Se ha generado un consejo personalizado.");
    } catch (error) {
      console.error("Error al generar recomendación:", error);
      Alert.alert("Error", "No se pudo generar la recomendación.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💡 Recomendaciones Personalizadas</Text>
      <Text style={styles.subtitle}>
        Consejos generados a partir de tus datos recientes
      </Text>

      <FlatList
        data={recommendations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.recommendationItem}>
            <View style={styles.recommendationContent}>
              <Text style={styles.recommendationText}>{item.recommendation}</Text>
              <Text style={styles.dateText}>📅 {item.date}</Text>
              <Text style={styles.sourceText}>Fuente: {item.source}</Text>
            </View>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleAccept(item.id)}
            >
              <Text style={styles.acceptButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.noData}>No hay recomendaciones aún</Text>
        }
      />

      <TouchableOpacity style={styles.button} onPress={generateSmartRecommendation}>
        <Text style={styles.buttonText}>Añadir Recomendación Inteligente</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: colors.background },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.primary,
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginBottom: 20,
  },
  recommendationItem: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  recommendationContent: {
    flex: 1,
  },
  recommendationText: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 6,
  },
  dateText: {
    fontSize: 13,
    color: colors.muted,
  },
  sourceText: {
    fontSize: 13,
    fontStyle: "italic",
    color: colors.secondary,
  },
  acceptButton: {
    backgroundColor: colors.success,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: "flex-end",
    marginTop: 10,
  },
  acceptButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  noData: {
    color: colors.muted,
    textAlign: "center",
    marginTop: 20,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default RecommendationsScreen;
