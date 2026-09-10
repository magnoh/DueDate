# Registro de Uso de Inteligência Artificial

Em conformidade com a Seção 4 e 21 do Case Técnico da ORION, este documento detalha as ferramentas de IA utilizadas durante o desenvolvimento, seus pontos positivos, onde ocorreram falhas e como foram solucionadas pelo desenvolvedor.

---

## 1. Ferramentas Utilizadas

- **Antigravity AI Agent** (Google DeepMind - Gemini & Claude Sonnet)
- **Claude Sonnet 4.6** (Refinamento arquitetural e planejamento de subagentes)

---

## 2. Onde a IA Ajudou Efetivamente

1. **Scaffolding e Estruturação do Monorepo**:
   - Geração ágil da estrutura com workspaces (`apps/api` e `apps/web`).
   - Configuração orquestrada do `docker-compose.yml` para PostgreSQL e scripts concatenados via `concurrently`.
2. **Modelagem e Seed**:
   - Criação do schema declarativo no Prisma com os devidos índices de busca por `responsible`, `status` e `dueDate`.
   - População do banco (`seed.ts`) baseada em dados realistas extraídos da planilha `Controle_Pendencias.xlsx`.
3. **Cálculo Derivado de Atraso**:
   - Implementação fiel da regra de negócio que calcula dinamicamente se uma demanda está em atraso (`dueDate < hoje AND status != COMPLETED`), garantindo que demandas concluídas nunca apareçam como atrasadas.
4. **Criação da Suíte de Testes Automatizados**:
   - Geração de 16 testes de integração utilizando Vitest e Supertest para cobertura dos fluxos felizes e exceções (`400`, `404`, filtros por responsável e busca textual).
   - Testes unitários no frontend com React Testing Library.
5. **Componentização e Design System Limpo**:
   - Construção dos componentes de interface fiéis ao mockup (`DemandTable`, `DemandFilters`, `DemandKanban`, Drawer com formulário, `Toast` e cards de métricas).
6. **Visualização de Dados e Gráficos com Recharts**:
   - Integração do Recharts no React 19 com Donut Chart de distribuição de status e BarChart empilhado de demandas por responsável.
7. **Quadro Kanban com Drag and Drop**:
   - Implementação de arrastar e soltar de cards de demandas entre colunas com atualização imediata de status.

---

## 3. Onde a IA Errou ou Teve Limitações (Exemplos Reais)

1. **Conflito de Portas de Rede com Contêineres Anteriores**:
   - *O que aconteceu:* A IA tentou subir o Docker Compose diretamente na porta 5432, recebendo o erro `Bind for 0.0.0.0:5432 failed: port is already allocated`.
   - *Como foi corrigido:* Foi realizada a inspeção de processos pelo WSL e verificado que contêineres antigos (`tickeven-postgres`) estavam escutando na porta. O desenvolvedor instruiu a liberação do socket e desativação do restart automático dos serviços anteriores.
2. **Conflito de Resolução de Módulos e Tipos do Vite 6 / Vite 7 no Monorepo**:
   - *O que aconteceu:* Ao rodar `npm run build` no workspace `apps/web`, o compilador do TypeScript apontou erros de incompatibilidade nas tipagens do `vite.config.ts` (`error TS2769: No overload matches this call` e `verbatimModuleSyntax` do Vite scaffolding).
   - *Como foi corrigido:* Ajuste manual do arquivo `tsconfig.app.json` e direcionamento do script de build (`tsc -p tsconfig.app.json && vite build`), isolando a tipagem da aplicação da tipagem do bundler Vite sem comprometer o TypeScript strict.
3. **Persistência de Variáveis de Ambiente no Prisma CLI**:
   - *O que aconteceu:* Ao executar `prisma migrate dev` dentro do monorepo, o Prisma procurou o arquivo `.env` no diretório raiz do pacote `apps/api` em vez da raiz do monorepo.
   - *Como foi corrigido:* Criou-se um `.env` local sincronizado no diretório `apps/api/`, garantindo execução determinística independente do diretório de onde o comando for disparado.
4. **Resolução de Injeção de Dependência NestJS em Ambiente Vitest**:
   - *O que aconteceu:* Ao migrar do Fastify para o NestJS, os testes de integração com Vitest falharam com `TypeError: Cannot read properties of undefined (reading 'create')` porque o compilador padrão do Vitest (esbuild) não preservava metadados TypeScript de decorators (`emitDecoratorMetadata`).
   - *Como foi corrigido:* Configuração do plugin `unplugin-swc` no `vitest.config.ts`, habilitando suporte completo à reflexão de tipos do NestJS e garantindo que os 16 testes de integração fossem executados com sucesso total.

---

## 4. Decisões Técnicas Mantidas pelo Desenvolvedor

- **Adoção do Zustand**: Escolha deliberada do desenvolvedor para simplificar o estado global dos filtros da tabela e modais sem a verbosidade de outros gerenciadores de estado.
- **Isolamento em Docker do PostgreSQL**: Escolha para garantir que o avaliador consiga inicializar o banco com um único comando sem instalar instâncias locais no sistema operacional.
- **Não criação de tabela de autenticação de usuários**: Manter a navalha de Occam conforme especificado no case — o requisito demanda um responsável por texto simples e não login/senha.
