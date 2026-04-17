# AGENTS

## Ordem obrigatória de leitura

1. `AGENTS.md`
2. `codex/contexts/product-overview.md`
3. `codex/contexts/business-rules.md`
4. `codex/contexts/architecture-rules.md`
5. `codex/contexts/code-conventions.md`
6. `codex/contexts/prompting-guidelines.md`
7. `codex/contexts/auth-strategy.md`

## Objetivo do projeto

Manter uma base inicial de `finance-ai` pronta para desenvolvimento rápido com IA, com stack simples, previsível e fácil de expandir.

## Regras permanentes

- Use apenas a stack aprovada no projeto
- Não crie backend separado
- Não crie frontend separado
- Não use microserviços
- Não use `any`
- Não introduza abstrações prematuras
- Não crie arquivos gigantes
- Não misture UI com regra de negócio
- Não misture regra de negócio com acesso ao banco

## Estrutura obrigatória

- `src/app`: rotas e composição de páginas
- `src/features`: código por domínio de negócio
- `src/components`: componentes compartilhados
- `src/lib`: infraestrutura compartilhada
- `src/hooks`: hooks compartilhados
- `src/types`: tipos globais pequenos
- `codex/history`: histórico das tarefas relevantes
- `codex/contexts`: contexto operacional do projeto
- `codex/prompts`: checklists e prompts reutilizáveis
- `codex/templates`: templates auxiliares

## Contrato de feature

Cada feature deve conter apenas o necessário, com separação clara entre:

- `components`
- `actions`
- `schemas`
- `services`
- `repositories`
- `types`
- `utils`

Se uma camada ainda não é necessária, não a invente.

## Critérios de implementação

- Prefira Server Components
- Use Client Components apenas quando houver interação local real
- Use Zod em toda entrada externa
- Use React Hook Form em formulários
- Use Mongoose para persistência
- Use Server Actions quando surgirem mutações do app
- Escreva nomes explícitos
- Mantenha funções curtas e arquivos legíveis
- Garanta reaproveitamento de conexão do MongoDB no ambiente Next.js
- Mantenha a base de testes pronta desde o início

## Critérios de documentação

- Registre decisões técnicas relevantes
- Atualize `README.md` quando o setup ou a arquitetura mudarem
- Ao final de cada tarefa importante, adicione um arquivo novo em `codex/history`
- O histórico deve explicar contexto, decisão, impacto e arquivos afetados
- Use os templates em `codex/templates` sempre que fizer sentido

## Checklist de entrega

- Ler os contextos atuais
- Preservar o padrão do código existente
- Entregar código pronto para produção
- Listar arquivos criados
- Listar arquivos alterados
- Gerar histórico em `codex/history`
