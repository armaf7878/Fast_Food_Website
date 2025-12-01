from llama_cpp import Llama

# Khởi tạo mô hình
print("Đang tải mô hình...")
llm = Llama(
    model_path="./models/mistral-7b-openorca.Q4_0.gguf",
    n_gpu_layers=0,  # Thử =0 nếu không có GPU
    n_ctx=4096,
    verbose=False  # Tắt log chi tiết nếu không cần
)
print("Mô hình đã sẵn sàng!\n")

# Lịch sử hội thoại
conversation_history = """<|im_start|>system
You are a helpful chatbot.
<|im_end|>"""

# Vòng lặp chatbot
print("=" * 50)
print("🤖 CHATBOT ĐÃ SẴN SÀNG!")
print("Gõ 'quit', 'exit' hoặc 'q' để thoát")
print("=" * 50)
print()

while True:
    # Nhận input từ người dùng
    user_input = input("Bạn: ").strip()
    
    # Kiểm tra lệnh thoát
    if user_input.lower() in ['quit', 'exit', 'q', 'thoát']:
        print("\n👋 Tạm biệt!")
        break
    
    if not user_input:
        continue
    
    # Thêm câu hỏi của người dùng vào lịch sử
    conversation_history += f"\n<|im_start|>user\n{user_input}<|im_end|>\n<|im_start|>assistant"
    
    # Tạo completion
    print("\n🤖 Bot: ", end='', flush=True)
    output = llm.create_completion(
        conversation_history,
        max_tokens=500,
        stop=["<|im_end|>"],
        stream=True
    )
    
    # In response từng token
    assistant_response = ""
    for token in output:
        text = token["choices"][0]["text"]
        print(text, end='', flush=True)
        assistant_response += text
    
    print("\n")  # Xuống dòng
    
    # Thêm phản hồi vào lịch sử
    conversation_history += assistant_response + "<|im_end|>"