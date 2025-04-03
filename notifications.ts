// notifications.ts
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export const requestNotificationPermission = async () => {
  if (Device.isDevice) {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      alert("Permiso de notificaciones denegado 😢");
    }
  } else {
    console.log("Las notificaciones solo funcionan en dispositivos reales.");
  }
};

export const scheduleReminderNotification = async (
  message: string,
  time: string,
  repeat: "diario" | "semanal"
) => {
  const [hourStr, minuteStr] = time.split(":");
  const hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);

  const now = new Date();
  let weekday = now.getDay(); // 0 (domingo) - 6 (sábado)
  if (weekday === 0) weekday = 7; // Ajustar a lunes=1, domingo=7

  const trigger =
    repeat === "diario"
      ? { hour, minute, repeats: true }
      : { weekday, hour, minute, repeats: true };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "⏰ Recordatorio",
      body: message,
      sound: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    },
    trigger,
  });
};
