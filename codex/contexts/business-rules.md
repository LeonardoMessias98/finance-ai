# Business Rules

## Posicionamento do produto

- a aplicação é uma ferramenta pessoal e não uma plataforma financeira complexa
- a experiência principal deve girar em torno de saldo, histórico e criação de transações
- funcionalidades secundárias devem apoiar esse fluxo, nunca competir com ele

## Regras atuais do domínio

- toda entrada externa deve ser validada
- persistência deve passar por `repositories`
- regra de negócio deve passar por `services`
- UI não deve conhecer detalhes de banco

## Regras de produto para o MVP

- o mês selecionado deve orientar a leitura financeira principal
- dashboard e listagem de transações devem refletir sempre a competência ativa
- criar transações deve ser mais rápido do que configurar módulos auxiliares
- contas, categorias, orçamentos e metas devem permanecer acessíveis, mas com peso secundário na interface
- evitar escopo funcional que exija leitura analítica complexa para o uso diário

## Regras de simplificação

- não adicionar blocos informacionais sem impacto real na decisão do usuário
- não duplicar resumo financeiro em múltiplos lugares da mesma tela
- não usar textos promocionais, institucionais ou decorativos na interface
- preferir labels curtas, ações claras e poucos passos visíveis por vez
