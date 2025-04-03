import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { LineChart } from "react-native-chart-kit";
import CustomButton from "../components/CustomButton";
import { colors } from "../theme";

const MoodChartScreen = ({ navigation }: any) => {
  const [moodData, setMoodData] = useState({ labels: [], data: [] });
  const [weightData, setWeightData] = useState({ labels: [], data: [] });
  const [heartRateData, setHeartRateData] = useState({ labels: [], data: [] });

  const user = getAuth().currentUser;

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const q = query(collection(db, "records"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const records = querySnapshot.docs
          .map((doc) => doc.data())
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Estado de ánimo
        const moodValues: Record<string, number> = {
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

        const labels = records.map((r) =>
          new Date(r.date).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
          })
        );

        setMoodData({
          labels,
          data: records.map((r) => moodValues[r.mood?.toLowerCase()] || 3),
        });

        // Peso
        const weight = records
          .filter((r) => r.weight !== null && r.weight !== undefined)
          .map((r) => r.weight);
        const weightLabels = records
          .filter((r) => r.weight !== null && r.weight !== undefined)
          .map((r) =>
            new Date(r.date).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
            })
          );
        setWeightData({ labels: weightLabels, data: weight });

        // Frecuencia cardíaca
        const heartRates = records.map((r) => r.heartRate || 0);
        setHeartRateData({ labels, data: heartRates });
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, [user]);

  const renderChart = (title: string, labels: any, data: any, color: string) => (
    <View style={styles.graphCard}>
      <Text style={styles.graphTitle}>{title}</Text>
      {labels.length > 0 ? (
        <LineChart
          data={{ labels, datasets: [{ data }] }}
          width={Dimensions.get("window").width - 40}
          height={220}
          chartConfig={{
            backgroundGradientFrom: colors.card,
            backgroundGradientTo: colors.card,
            decimalPlaces: 0,
            color: (opacity = 1) => `${color}${Math.floor(opacity * 255).toString(16)}`,
            labelColor: () => colors.text,
            strokeWidth: 2,
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: color,
            },
          }}
          bezier
          style={{ borderRadius: 16, marginTop: 10 }}
        />
      ) : (
        <Text style={styles.noDataText}>No hay datos disponibles.</Text>
      )}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📊 Estadísticas de Bienestar</Text>
      <Text style={styles.subtitle}>
        Visualiza tus tendencias y mejora tu salud emocional y física
      </Text>

      {renderChart("Estado de Ánimo", moodData.labels, moodData.data, "#FFA07A")}
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Escala de Estados de Ánimo:</Text>
        <Text style={styles.legendItem}>5 - Feliz</Text>
        <Text style={styles.legendItem}>4 - Contento</Text>
        <Text style={styles.legendItem}>3 - Neutral / Cansado</Text>
        <Text style={styles.legendItem}>2 - Triste / Ansioso / Estresado</Text>
        <Text style={styles.legendItem}>1 - Deprimido / Enojado</Text>
      </View>

      {renderChart("Peso Corporal (kg)", weightData.labels, weightData.data, "#A2D2FF")}
      {renderChart("Frecuencia Cardíaca (bpm)", heartRateData.labels, heartRateData.data, "#FFB4B4")}

      <CustomButton title="Volver" onPress={() => navigation.goBack()} style={styles.backButton} />
    </ScrollView>
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
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
    marginBottom: 20,
  },
  graphCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
    marginBottom: 10,
  },
  noDataText: {
    textAlign: "center",
    color: colors.muted,
    fontSize: 14,
    marginTop: 20,
  },
  legendContainer: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 12,
    marginBottom: 30,
  },
  legendTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: colors.text,
    marginBottom: 6,
  },
  legendItem: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 3,
    marginLeft: 6,
  },
  backButton: {
    backgroundColor: colors.secondary,
    borderRadius: 25,
    paddingVertical: 12,
    marginBottom: 20,
  },
});

export default MoodChartScreen;

