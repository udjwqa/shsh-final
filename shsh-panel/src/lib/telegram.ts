export async function sendTelegramNotification(
  botToken: string,
  chatId: string,
  message: string
) {
  if (!botToken || !chatId) return;

  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
      }),
    });
  } catch {
    // silently fail — don't break chat if telegram is down
  }
}
