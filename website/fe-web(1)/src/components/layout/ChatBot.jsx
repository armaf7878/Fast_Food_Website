import React, { useState, useRef, useEffect } from "react";
import {API_ChatBot} from "../../app/api";
const botLogo = "/images/logo1.png";
export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: "user", content: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);
        API_ChatBot(input)
        .then((res) => {
            const botMsg = {
                role: "assistant",
                content: res.message || "Bot không phản hồi.",
            };
            setMessages((prev) => [...prev, botMsg]);
        })
        .catch((err) => {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: JSON.stringify(err),
                },
            ]);
        })
        .finally(
            () => setLoading(false)
        )
    };

    return (
        <>

            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="fixed bottom-6 right-6 w-16 h-16 bg-orange-500 hover:bg-orange-600 
                    text-white rounded-full shadow-xl flex items-center justify-center 
                    transition-all duration-200 hover:scale-110 z-50"
                >
                    <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>
            )}


            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-xl shadow-2xl 
                    flex flex-col overflow-hidden z-50 border border-gray-200 animate-fadeUp">

                    <div className="bg-orange-500 text-white p-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <img 
                                src={botLogo}
                                className="w-9 h-9 rounded-full border border-white shadow"
                                alt="Bot"
                            />
                            <div>
                                <h2 className="font-bold text-lg">FastFood ChatBot</h2>
                                <p className="text-xs text-orange-100">Sẵn sàng hỗ trợ bạn</p>
                            </div>
                        </div>

                        <button onClick={toggleChat} className="hover:bg-orange-600 p-1 rounded">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Chat Body */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-500 py-10">
                                <p>Xin chào! Tôi có thể giúp gì cho bạn?</p>
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex items-start gap-3 ${
                                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                }`}
                            >
                                <div className="flex-shrink-0">
                                    {msg.role === "assistant" ? (
                                        <img
                                            src="https://th.bing.com/th/id/OIP.FV3x4TEtn472LJGjAkzAVgHaHa?rs=1&pid=ImgDetMain"
                                            className="w-8 h-8 rounded-full"
                                            alt="Bot"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                                            U
                                        </div>
                                    )}
                                </div>

                                <div
                                    className={`p-3 rounded-xl max-w-[75%] text-sm shadow ${
                                        msg.role === "user"
                                            ? "bg-orange-500 text-white"
                                            : "bg-white border border-gray-200"
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={sendMessage} className="p-3 bg-white border-t">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Nhập tin nhắn..."
                                className="flex-1 border border-gray-300 rounded-md px-3 py-2 
                                focus:ring-2 focus:ring-orange-400 focus:outline-none text-sm"
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-orange-500 text-white rounded-md 
                                hover:bg-orange-600 transition disabled:opacity-50"
                            >
                                {loading ? "..." : "Gửi"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* CSS Animation */}
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeUp { animation: fadeUp 0.25s ease-out; }
            `}</style>
        </>
    );
}
