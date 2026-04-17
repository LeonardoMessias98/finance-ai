# Melhorar diagnostico do seed MongoDB - 2026-04-17 10:40

## Contexto

O comando `npm run seed` estava falhando com mensagens cruas do driver do MongoDB, como `bad auth : authentication failed`, sem orientar se o problema vinha de credenciais, URI mal formada ou resolucao de host.

## Decisao

Foi extraida uma configuracao dedicada para `MONGODB_URI` em `src/lib/db/mongo-connection-config.ts`, responsavel por:

- sanitizar a URI lida do ambiente
- validar protocolo e host
- transformar erros comuns de conexao em mensagens acionaveis

O helper central de conexao em `src/lib/db/connect.ts` passou a reutilizar essa camada. Tambem foram adicionados testes unitarios e a documentacao do setup MongoDB foi atualizada para deixar explicito o formato recomendado da URI.

## Impacto

- o seed e qualquer outro fluxo que reuse `connectToDatabase()` agora retornam diagnosticos mais uteis
- erros de autenticacao deixam de aparecer apenas como `bad auth`
- falhas de resolucao SRV passam a apontar problema de rede, DNS ou host
- o README e o `.env.example` passam a orientar melhor o formato esperado de `MONGODB_URI`

## Arquivos criados

- `src/lib/db/mongo-connection-config.ts`
- `src/lib/db/mongo-connection-config.test.ts`
- `codex/history/melhorar-diagnostico-mongodb-seed-2026-04-17-1040.md`

## Arquivos alterados

- `src/lib/db/connect.ts`
- `README.md`
- `.env.example`
