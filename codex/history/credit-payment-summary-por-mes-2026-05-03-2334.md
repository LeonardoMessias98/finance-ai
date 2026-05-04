# Total de credito a pagar por mes

## Contexto

Foi solicitada uma forma simples de calcular o total de compras de credito a pagar em um mes usando `creditPaymentMonth`, sem criar entidade de fatura e sem alterar dados existentes.

## Decisao

Foi criado um helper puro para montar o resumo de pagamento de credito a partir de contas e transacoes ja carregadas. O helper considera apenas despesas em contas `credit` ou `credit_card`, soma transacoes com `creditPaymentMonth` igual ao mes selecionado, agrupa por conta de credito e devolve a lista de transacoes do total.

Para transacoes antigas de credito sem `creditPaymentMonth`, foi adotado fallback para `competencyMonth`. A decisao esta documentada no codigo para manter essas transacoes visiveis na listagem simples de fatura do MVP.

Tambem foi criado um service server-side que busca contas e transacoes do usuario autenticado via repositories e chama o helper.

## Impacto

O dominio agora consegue calcular uma fatura simples por mes sem nova collection. O resultado inclui total geral, grupos por conta de credito e transacoes que compoem o total, preservando compatibilidade com dados antigos.

Foram executados:

- `npm run test -- src/features/transactions/utils/build-credit-payment-summary.test.ts`
- `npm run typecheck`
- `npm run test`
- `npm run lint`

## Arquivos criados

- `src/features/transactions/types/credit-payment-summary.ts`
- `src/features/transactions/utils/build-credit-payment-summary.ts`
- `src/features/transactions/utils/build-credit-payment-summary.test.ts`
- `src/features/transactions/services/get-credit-payment-summary-service.ts`
- `codex/history/credit-payment-summary-por-mes-2026-05-03-2334.md`

## Arquivos alterados

- Nenhum arquivo existente foi alterado.
