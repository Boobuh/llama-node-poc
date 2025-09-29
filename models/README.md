# Models Directory

This directory should contain Llama model files in GGUF format.

## Recommended Models:

1. **Llama-2-7B-Chat** (Smaller, faster): https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF
2. **Llama-2-13B-Chat** (Balanced): https://huggingface.co/TheBloke/Llama-2-13B-Chat-GGUF
3. **Llama-2-70B-Chat** (Larger, more capable): https://huggingface.co/TheBloke/Llama-2-70B-Chat-GGUF

## Download Instructions:

1. Visit one of the links above
2. Download the Q4_K_M.gguf file (recommended balance of size/quality)
3. Place the .gguf file in this directory
4. Rename it to 'llama-model.gguf' or update the model path in the examples

## Example:
```bash
# Download Llama-2-7B-Chat
wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_K_M.gguf -O models/llama-model.gguf
```

