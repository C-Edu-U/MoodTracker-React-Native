import React, { useState } from "react";
import { View, TextInput, Alert, StyleSheet, Text, KeyboardAvoidingView, Platform } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import CustomButton from "../components/CustomButton";
import { colors } from "../theme";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("¡Bienvenido!", "Inicio de sesión exitoso.");
      navigation.navigate("Home");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>MoodTrack</Text>
      <Text style={styles.subtitle}>Tu espacio emocional diario 💖</Text>

      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input} 
          placeholder="Correo electrónico" 
          placeholderTextColor={colors.muted} 
          value={email} 
          onChangeText={setEmail} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Contraseña" 
          placeholderTextColor={colors.muted} 
          secureTextEntry 
          value={password} 
          onChangeText={setPassword} 
        />
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton title="Iniciar Sesión" onPress={handleLogin} style={styles.loginButton} />
        <CustomButton title="Registrarse" onPress={() => navigation.navigate("Register")} style={styles.registerButton} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: colors.background, 
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 40,
  },
  inputContainer: {
    width: "100%", 
    marginBottom: 30,
  },
  input: {
    backgroundColor: colors.card,
    color: colors.text,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContainer: {
    width: "100%",
  },
  loginButton: {
    backgroundColor: colors.primary,
    width: "100%",
    paddingVertical: 12,
    borderRadius: 25,
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: colors.secondary,
    width: "100%",
    paddingVertical: 12,
    borderRadius: 25,
  },
});

export default LoginScreen;
