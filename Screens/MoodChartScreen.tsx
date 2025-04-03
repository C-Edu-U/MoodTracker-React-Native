import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { LineChart } from "react-native-chart-kit";
import CustomButton from "../components/CustomButton";
import { colors } from "../theme";

const MoodChartScreen = ({ navigation }: any) => {
  const [moodData, setMoodData] = useState<{ labels: string[]; data: number[] }>({
    labels: [],
    data: [],
  });

  const user = getAuth().currentUser;

  useEffect(() => {
    const fetchMoodData = async () => {
      if (!user) return;

      try {
        const q = query(collection(db, "records"), where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const records = querySnapshot.docs.map((doc) => doc.data());

        const sortedRecords = records.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        const lastSevenRecords = sortedRecords.slice(0, 7);

        const moodValues: Record<string, number> = {
          feliz: 5,
          contento: 4,
          neutral: 3,
          triste: 2,
          deprimido: 1,
          enojado: 1,
          ansioso: 2,
          estresado: 2,
          cansado: 3,
        };

        const labels = lastSevenRecords.map((record) =>
          new Date(record.date).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
          })
        );

        const data = lastSevenRecords.map(
          (record) => moodValues[record.mood.toLowerCase()] || 3
        );

        setMoodData({
          labels: labels.reverse(),
          data: data.reverse(),
        });
      } catch (error) {
        console.error("Error al obtener registros:", error);
      }
    };

    fetchMoodData();
  }, [user]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>📈 Historial de Ánimo</Text>
      <Text style={styles.subtitle}>Visualiza cómo te has sentido en los últimos días</Text>

      <View style={styles.graphCard}>
        <Text style={styles.graphTitle}>Últimos 7 días</Text>
        {moodData.labels.length > 0 ? (
          <>
            <LineChart
              data={{
                labels: moodData.labels,
                datasets: [{ data: moodData.data }],
              }}
              width={Dimensions.get("window").width - 40}
              height={240}
              yAxisLabel=""
              fromZero={true}
              yAxisSuffix=""
              yAxisInterval={1}
              chartConfig={{
                backgroundGradientFrom: colors.card,
                backgroundGradientTo: colors.card,
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(162, 210, 255, ${opacity})`,
                labelColor: () => colors.text,
                strokeWidth: 2,
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#A2D2FF",
                },
              }}
              bezier
              style={{
                borderRadius: 16,
                marginTop: 10,
              }}
            />

            <View style={styles.legendContainer}>
              <Text style={styles.legendTitle}>Escala de Estados de Ánimo:</Text>
              <Text style={styles.legendItem}>5 - Feliz</Text>
              <Text style={styles.legendItem}>4 - Contento</Text>
              <Text style={styles.legendItem}>3 - Neutral / Cansado</Text>
              <Text style={styles.legendItem}>2 - Triste / Ansioso / Estresado</Text>
              <Text style={styles.legendItem}>1 - Deprimido / Enojado</Text>
            </View>
          </>
        ) : (
          <Text style={styles.noDataText}>No hay datos disponibles aún.</Text>
        )}
      </View>

      <CustomButton
        title="Volver"
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      />
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
    elevation: 3,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
    marginBottom: 10,
  },
  legendContainer: {
    marginTop: 20,
    padding: 10,
    borderRadius: 12,
    backgroundColor: colors.background,
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
  },
  noDataText: {
    textAlign: "center",
    color: colors.muted,
    fontSize: 14,
    marginTop: 20,
  },
  backButton: {
    backgroundColor: colors.secondary,
    marginTop: 30,
    borderRadius: 25,
    paddingVertical: 14,
  },
});

export default MoodChartScreen;
