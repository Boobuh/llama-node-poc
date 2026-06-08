# Models Directory

Place Llama (or other) model files in **GGUF** format here.

## Recommended

| Model                           | Size   | Notes                           |
| ------------------------------- | ------ | ------------------------------- |
| Llama-2-7B-Chat Q4_K_M          | ~4 GB  | Default for this POC            |
| Llama-3.x / Qwen / Mistral GGUF | varies | Supported by node-llama-cpp 3.x |

## Sources

- [Hugging Face GGUF models](https://huggingface.co/models?library=gguf)
- Quantizers: [bartowski](https://huggingface.co/bartowski), [unsloth](https://huggingface.co/unsloth)
- Legacy: [TheBloke](https://huggingface.co/TheBloke) (no longer updated, files still available)

## Download example

```bash
wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7B-chat.Q4_K_M.gguf \
  -O models/llama-model.gguf
```

Update `src/config.ts` if you use a different path or model name.
