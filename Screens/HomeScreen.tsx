import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { colors } from "../theme";
import { MaterialIcons } from "@expo/vector-icons"; // Cambia por el ícono que prefieras

const HomeScreen = ({ navigation }: any) => {
  const handleLogout = async () => {
    await signOut(auth);
    navigation.navigate("Login");
  };

  const tiles = [
    {
      title: "Añadir Registro",
      description: "Anota cómo te sientes hoy.",
      icon: "edit-note",
      color: colors.primary,
      onPress: () => navigation.navigate("AddRecord"),
    },
    {
      title: "Recordatorios",
      description: "Configura alertas para no olvidar registrar tu ánimo.",
      icon: "alarm",
      color: colors.success,
      onPress: () => navigation.navigate("Reminders"),
    },
    {
      title: "Recomendaciones",
      description: "Recibe consejos personalizados.",
      icon: "lightbulb",
      color: colors.secondary,
      onPress: () => navigation.navigate("Recommendations"),
    },
    {
      title: "Gráfica de Ánimo",
      description: "Visualiza tus emociones a lo largo del tiempo.",
      icon: "show-chart",
      color: colors.warning,
      onPress: () => navigation.navigate("MoodChart"),
    },
    {
      title: "Cerrar Sesión",
      description: "Salir de tu cuenta actual.",
      icon: "logout",
      color: colors.danger,
      onPress: handleLogout,
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>MoodTrack</Text>
      <Text style={styles.subtitle}>Elige una opción para continuar</Text>

      {tiles.map((tile, index) => (
        <TouchableOpacity key={index} style={[styles.card, { backgroundColor: tile.color }]} onPress={tile.onPress}>
          <MaterialIcons name={tile.icon as any} size={32} color="#fff" style={styles.icon} />
          <View>
            <Text style={styles.cardTitle}>{tile.title}</Text>
            <Text style={styles.cardDescription}>{tile.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
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
  },
  card: {
    width: "100%",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
  },
  icon: {
    marginRight: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: "#fff",
  },
});

export default HomeScreen;

