import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { GoogleGenAI } from "@google/genai";
import config from "config";

const ai = new GoogleGenAI({ apiKey: config.get("gemini.apiKey") });

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export function AiChatBot(io: Server, socket: Socket) {
  socket.on("ai:message", async ({ message }: { message: string }) => {
    try {

      // 2️⃣ Gemini AI call
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: message,
      });

      const aiMessage: Message = {
        id: uuidv4(),
        text: response.text || "Sorry, I couldn't generate a response right now.",
        sender: "assistant",
        timestamp: new Date(),
      };

      // 3️⃣ Emit AI response
      socket.emit("ai:response", aiMessage);
    } catch (err: any) {
      console.error("AI Chat Bot error:", err);

      let friendlyMessage = "Oops! The AI is busy at the moment. Please try again in a few seconds.";

      // Specific 503 overload handling
      if (err?.status === 503) {
        friendlyMessage = "Our AI is currently overloaded. Please try again in a few moments!";
      }

      socket.emit("ai:response", {
        id: uuidv4(),
        text: friendlyMessage,
        sender: "assistant",
        timestamp: new Date(),
      });
    }
  });
}
