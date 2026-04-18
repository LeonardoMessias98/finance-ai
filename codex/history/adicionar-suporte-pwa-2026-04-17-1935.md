# Adicionar suporte PWA

## Contexto

O produto precisava poder ser instalado em Android e iOS sem mudar a arquitetura full-stack atual nem introduzir dependencias extras desnecessarias.

## Decisão

Foi implementado suporte PWA nativo do App Router com `manifest.webmanifest`, metadata para Apple Web App, icones gerados server-side e registro manual de `service worker`. O cache do service worker foi limitado a assets estaticos para evitar armazenar dados financeiros privados ou respostas autenticadas.

## Impacto

O app passa a ser instalavel em navegadores compatíveis no Android e via `Adicionar à Tela de Início` no Safari iOS. A interface ganha metadata e icones proprios de instalacao, enquanto a autenticacao e os dados do usuario continuam fora do cache offline.

## Arquivos criados

- `codex/history/adicionar-suporte-pwa-2026-04-17-1935.md`
- `public/sw.js`
- `src/app/manifest.ts`
- `src/app/icons/apple-touch-icon.png/route.ts`
- `src/app/icons/icon-192.png/route.ts`
- `src/app/icons/icon-512.png/route.ts`
- `src/app/icons/icon-512-maskable.png/route.ts`
- `src/components/pwa/service-worker-registration.tsx`
- `src/lib/pwa/create-pwa-icon-response.ts`

## Arquivos alterados

- `README.md`
- `src/app/layout.tsx`
