import { useState, useRef, useEffect } from "react";
import { API_ChatBot } from "../../app/api";

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

    const sendMessage = (e) => {
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
                    { role: "assistant", content: JSON.stringify(err) },
                ]);
            })
            .finally(() => setLoading(false));
    };

    return (
        <>
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="fixed bottom-6 right-6 h-14 w-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center z-50 transition transform hover:scale-110"
                >
                    <svg className="w-7 h-7" fill="none" stroke="white" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.46.497 2.825 1.35 3.95L4 20l3.15-1.05C8.175 19.663 10.02 20 12 20z" />
                    </svg>
                </button>
            )}

            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[550px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden z-50">

                    <div className="bg-orange-500 p-4 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <img
                                src="https://cdn-icons-png.freepik.com/512/6014/6014401.png"
                                className="w-9 h-9 rounded-full shadow"
                            />
                            <div>
                                <h2 className="font-semibold text-lg">FastFood Assistant</h2>
                                <p className="text-xs text-orange-100">Sẵn sàng hỗ trợ bạn</p>
                            </div>
                        </div>

                        <button
                            onClick={toggleChat}
                            className="p-2 rounded hover:bg-orange-600"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="white" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-500 pt-10">
                                Hãy nhắn điều bạn muốn hỏi!
                            </div>
                        )}

                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex items-start gap-3 ${
                                    msg.role === "user" ? "flex-row-reverse" : ""
                                }`}
                            >
                                {msg.role === "assistant" ? (
                                    <img
                                        src="https://cdn-icons-png.freepik.com/512/6014/6014401.png"
                                        className="w-8 h-8 rounded-full shadow"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold shadow">
                                        U
                                    </div>
                                )}

                                <div
                                    className={`px-4 py-2 rounded-xl max-w-[70%] text-sm shadow ${
                                        msg.role === "user"
                                            ? "bg-orange-500 text-white"
                                            : "bg-white border"
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                        <div ref={bottomRef} />
                    </div>

                    <form onSubmit={sendMessage} className="p-3 bg-white border-t flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-400 outline-none"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
                        >
                            {loading ? "..." : "Gửi"}
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
