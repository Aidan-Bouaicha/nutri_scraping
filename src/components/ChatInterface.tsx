import { useState, useEffect } from "react";
import { NutritionProfile, MCPResponse, nutritionAPI } from "../services/api";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

interface ChatInterfaceProps {
  profile: NutritionProfile;
}

const CHAT_STORAGE_KEY = "nutritionChatHistory";

const loadChatHistory = (): ChatMessage[] => {
  const stored = localStorage.getItem(CHAT_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return getInitialMessage();
    }
  }
  return getInitialMessage();
};

const getInitialMessage = (): ChatMessage[] => [
  {
    role: "assistant",
    content:
      "Bonjour ! Pose-moi une question nutritionnelle ou demande un plan de repas.",
  },
];

const saveChatHistory = (messages: ChatMessage[]) => {
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
};

export default function ChatInterface({ profile }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Charger l'historique au montage du composant
  useEffect(() => {
    const loadedMessages = loadChatHistory();
    setMessages(loadedMessages);
  }, [profile.id]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveChatHistory(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response: MCPResponse = await nutritionAPI.sendChatMessage(
        input,
        profile
      );

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response.explication,
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } catch {
      const errorMessages = [
        ...updatedMessages,
        {
          role: "assistant" as const,
          content:
            "❌ Une erreur est survenue. Vérifiez que le backend est démarré.",
        },
      ];
      setMessages(errorMessages);
      saveChatHistory(errorMessages);
    } finally {
      setLoading(false);
    }
  };

  const resetConversation = () => {
    const initialMessages = getInitialMessage();
    setMessages(initialMessages);
    saveChatHistory(initialMessages);
  };

  return (
    <div className="flex flex-col h-[600px] bg-white border border-gray-200 rounded-xl">
      {/* HEADER AVEC BOUTON RÉINITIALISER */}
      <div className="border-b border-gray-200 p-4 flex justify-between items-center">
        <h3 className="font-semibold text-gray-700">Chatbot Nutritionnel</h3>
        <button
          onClick={resetConversation}
          className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
        >
          🗑️ Réinitialiser
        </button>
      </div>

      {/* ZONE MESSAGES */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${
                msg.role === "user"
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-sm text-gray-500 italic">
            ⏳ L’IA réfléchit (max 30s)…
          </div>
        )}
      </div>

      {/* ZONE INPUT */}
      <div className="border-t border-gray-200 p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Écris ta question ici…"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg disabled:opacity-50"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}
