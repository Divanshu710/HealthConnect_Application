import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Loader2, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

const API_URL = `${API_BASE_URL}/api/v1/chat/patient-assistant`;

export default function ChatbotWidget({ patientUsername }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I'm your HealthConnect assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [pendingDraft, setPendingDraft] = useState(null);
  const chatEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");

    setMessages((prev) => [...prev, { role: "user", text }]);
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientUsername, message: text, threadId }),
      });

      const json = await res.json();

      if (json.success) {
        const data = json.data;
        if (data.threadId && !threadId) {
          setThreadId(data.threadId);
        }
        setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);

        // Store booking draft if payment is required
        if (data.action === "PAYMENT_REQUIRED" && data.bookingDraft) {
          setPendingDraft(data.bookingDraft);
        }
      } else {
        setMessages((prev) => [...prev, { role: "ai", text: "Sorry, I couldn't process your request." }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: "ai", text: "Network error. Please check your connection." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-200 hover:scale-110"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] h-[560px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span className="font-semibold">HealthConnect AI</span>
              </div>
              <button onClick={() => setOpen(false)} className="hover:bg-white/20 rounded-full p-1 transition">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-emerald-600 text-white rounded-br-md"
                        : "bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Payment card when booking draft is ready */}
              {pendingDraft && (
                <div className="bg-white rounded-2xl shadow-md border border-emerald-200 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <CreditCard className="w-5 h-5" />
                    <span>Booking Summary</span>
                  </div>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><span className="font-medium">Doctor:</span> Dr. {pendingDraft.doctorName}</p>
                    <p><span className="font-medium">Date:</span> {pendingDraft.date}</p>
                    <p><span className="font-medium">Time:</span> {pendingDraft.timeslot}</p>
                    <p><span className="font-medium">Reason:</span> {pendingDraft.reason || "Not specified"}</p>
                    <p className="text-lg font-bold text-emerald-700">₹{pendingDraft.amount || 200}</p>
                  </div>
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate(
                        `/patient/${patientUsername}/${encodeURIComponent(pendingDraft.doctorName)}/book-appointment`,
                        { state: { bookingDraft: pendingDraft } }
                      );
                    }}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    Proceed to Pay ₹{pendingDraft.amount || 200}
                  </button>
                </div>
              )}

              {/* Typing indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100 flex items-center gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 px-3 py-3 bg-white flex items-center gap-2 flex-shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-full p-2 transition"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
