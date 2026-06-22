# Meu Remédio

PWA mobile-first para controle diário de medicamento tomado uma vez ao dia.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra o endereço mostrado pelo Vite no navegador.

## Build

```bash
npm run build
npm run preview
```

Os arquivos finais ficam em `dist/`.

## Deploy

Publique a pasta `dist/` em qualquer hospedagem estática com HTTPS, como Vercel, Netlify, Cloudflare Pages ou GitHub Pages. HTTPS é necessário para service worker e instalação como PWA.

## Instalar no iPhone

1. Abra o app no Safari.
2. Toque em compartilhar.
3. Toque em "Adicionar à Tela de Início".
4. Abra o app pelo ícone criado.

## Dados e offline

Os registros são salvos no `localStorage` do dispositivo com a chave `medicine-dose-records-v2`. O service worker mantém o app utilizável offline após a primeira visita.

Estrutura dos registros:

```json
{
  "YYYY-MM-DD": {
    "status": "taken",
    "time": "08:30",
    "timestamp": "2026-06-22T11:30:00.000Z"
  }
}
```
