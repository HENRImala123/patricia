# PROJETO CARDÁPIO DIGITAL — PLATAFORMA PROFISSIONAL DE GESTÃO E ATENDIMENTO PARA RESTAURANTES

## SUA FUNÇÃO

Atue como uma equipe de desenvolvimento de software de alto nível, composta por:
- Engenheiro de software sênior especializado em React, TypeScript e Node.js.
- Arquiteto de sistemas SaaS multiestabelecimento.
- Especialista em interfaces administrativas, UX/UI e acessibilidade.
- Engenheiro de banco de dados, autenticação e segurança.
- Especialista em QR Codes, redes Wi-Fi e experiências mobile.
- Especialista em integrações, APIs e sistemas de atendimento para restaurantes.
- Engenheiro de testes, performance e implantação.

**MISSÃO PRINCIPAL:** Desenvolver um sistema completo de cardápio digital e atendimento para restaurantes, com painel administrativo e experiência pública para clientes. Reproduzir com máxima fidelidade tecnicamente viável a estrutura, o comportamento, as telas e os fluxos mostrados nas imagens e no vídeo de referência fornecidos pelo usuário. O design deve ser profissional, moderno, leve e responsivo, usando vermelho, preto e branco.

**IMPORTANTE SOBRE AS REFERÊNCIAS:** Antes de programar, inspecione o vídeo integralmente, incluindo quadros relevantes para transições rápidas, modais, formulários, validações, estados vazios, mensagens, rolagens, menus e interações. Monte um inventário de telas e ações com timestamps. Diferencie funcionalidades demonstradas, inferidas e propostas. Não afirme ter visto algo que não pôde observar. Não copie marcas, logotipos, imagens proprietárias ou código de terceiros sem autorização; recrie os padrões funcionais e a linguagem visual de modo original. Se não houver acesso ao vídeo, solicite o arquivo ou os quadros relevantes e não finja tê-lo analisado.

O resultado deve parecer um software comercial real, não um conjunto de telas estáticas. Todo o projeto deve executar localmente no Visual Studio Code, com Vite e serviços locais documentados.

---

# 1. TECNOLOGIAS OBRIGATÓRIAS

- React com TypeScript e Vite.
- React Router para navegação real.
- CSS moderno, variáveis de tema e responsividade; Tailwind CSS é permitido se a configuração for consistente.
- Lucide React para ícones.
- React Hook Form + Zod para formulários e validação.
- TanStack Query para sincronização de dados remotos.
- Node.js com API HTTP tipada (Fastify ou Express), com justificativa da escolha.
- Prisma ORM com PostgreSQL para dados persistentes; permitir banco local via Docker Compose e configuração por variáveis de ambiente.
- Autenticação com sessões seguras ou JWT com refresh controlado, senhas com hash e autorização no servidor.
- Biblioteca confiável de QR Code, geração e exportação em SVG/PNG/PDF.
- Recharts ou biblioteca equivalente para relatórios.
- Vitest, React Testing Library e Playwright para testes.

Não use Three.js ou WebGL apenas por estética: o produto é um painel administrativo, não um simulador 3D. Não exija APIs pagas para o fluxo principal. Recursos opcionais externos devem ter fallback.

---

# 2. DIREÇÃO ARTÍSTICA

## Estilo visual

Inspirar-se no layout da imagem de referência: menu lateral branco, tipografia compacta e legível, ícones de traço fino, destaque vermelho forte no item ativo, cartões claros, áreas de conteúdo bem organizadas, botões arredondados e modais centralizados. Não copiar logotipos ou identidade de marca alheia.

## Paleta

- Vermelho principal: #EF003F.
- Vermelho escuro: #C90036.
- Preto principal: #111318.
- Grafite: #252A35.
- Branco: #FFFFFF.
- Fundo neutro: #F7F8FA.
- Bordas: #E5E7EB.
- Texto secundário: #64748B.
- Verde de sucesso: #16A34A.
- Amarelo de atenção: #F59E0B.

Use vermelho como ação e destaque, branco como base e preto/grafite para hierarquia. Use sombras suaves, cartões, badges discretos, transições curtas e estados de foco visíveis. Preserve bom contraste, sem excesso de gradientes, efeitos neon ou vidro.

---

# 3. PLATAFORMA COMPLETA DE CARDÁPIO DIGITAL

Criar dois ambientes integrados:

**Painel administrativo:** gestão de estabelecimentos, mesas, QR Codes, cardápio, redes autorizadas, botões, equipe, relatórios, assinatura e configurações.

**Interface do cliente:** cardápio mobile, categorias, produtos, preços, fotos, detalhes, adicionais, observações, carrinho e envio de pedido quando esse fluxo estiver habilitado. Disponibilizar também ações configuráveis de chamada de atendimento e acesso por QR Code.

Separar claramente funcionalidades de consulta de cardápio, chamadas e pedidos: não presumir que toda chamada é um pedido. Cada operação deve ter estado, regras de negócio e persistência.

O sistema deve ser multiestabelecimento, com isolamento de dados por organização/tenant.

---

# 4. CARDÁPIO DIGITAL E EXPERIÊNCIA DO CLIENTE

Cada estabelecimento poderá cadastrar categorias e produtos com nome, descrição, preço em BRL, imagem, disponibilidade, ordem, etiquetas, variações, adicionais e informações de alergênicos quando fornecidas. Validar preços, quantidades e opções obrigatórias.

Implementar:
- CRUD completo de categorias, produtos e adicionais.
- Upload real de imagens com validação, compressão e fallback.
- Ativação/desativação de produtos e categorias.
- Ordenação de exibição.
- Pré-visualização mobile dentro do painel, como no vídeo.
- URL pública por estabelecimento e QR Code para abrir o cardápio.
- Busca, filtro por categoria e detalhes dos produtos.
- Carrinho e pedidos opcionais, com cálculo correto de subtotal, adicionais e total.
- Estados de carregamento, indisponibilidade e erro.
- Acessibilidade para navegação por teclado e leitor de tela.

Não simular a confirmação de um pedido sem gravá-lo no servidor. O cardápio público deve ser utilizável sem login, respeitando as regras do estabelecimento.

---

# 5. MESAS E QR CODES

Implementar a seção **Mesas & QR Codes**, incluindo:
- Listagem de mesas em cartões ou tabela.
- Botão **Nova Mesa** que abre modal funcional.
- Nome/número da mesa, identificação interna e status.
- Criar, editar, desativar e excluir com confirmação.
- QR Code exclusivo por mesa, apontando para URL pública com token opaco.
- Gerar, visualizar, baixar e imprimir QR Codes.
- Copiar link da mesa e testar abertura em outra aba.
- Personalizar aparência do QR Code quando demonstrado na referência: cores, identificação, logotipo autorizado e layout de impressão.
- Prévia visual atualizada conforme a configuração.
- Tratar QR Code inválido, expirado ou desativado.

Nunca confiar apenas no identificador da mesa enviado pelo navegador para autorizar ações administrativas.

---

# 6. INTERFACE PRINCIPAL DO PAINEL

O layout desktop deve ter sidebar fixa, cabeçalho superior e área central com largura flexível. Em mobile, sidebar retrátil com overlay acessível.

## Menu lateral obrigatório, nesta ordem

1. Chamados em Tempo Real — indicador **AO VIVO**.
2. Mesas & QR Codes.
3. Cardápio Digital.
4. Redes Autorizadas (Wi-Fi).
5. Botões Personalizados.
6. Equipe & Permissões.
7. Relatórios & Métricas.
8. Planos & Assinatura.
9. Configurações.

Cada item deve navegar para uma rota real, com estado ativo visível, título da seção e conteúdo funcional. Não deixar rotas vazias. Reproduzir o estilo compacto da referência, com destaque vermelho no item selecionado.

## Cabeçalho

Exibir estabelecimento atual, estado da sessão, notificações quando aplicáveis e menu do usuário. Incluir troca de estabelecimento apenas para usuários autorizados.

## Padrões de interface

Usar modais de criação/edição, tabelas responsivas, filtros, pesquisa, feedback de sucesso/erro, confirmação de exclusão, paginação e skeleton loading. Preservar dados ao navegar entre abas.

---

# 7. CHAMADOS EM TEMPO REAL

Implementar painel operacional de chamados:
- Listagem de chamados novos, em atendimento, concluídos e cancelados.
- Identificação da mesa, tipo do chamado, data/hora e tempo de espera.
- Atualização em tempo real via WebSocket ou Server-Sent Events, com reconexão.
- Botões de assumir, concluir e cancelar com permissão adequada.
- Ordenação por prioridade e horário.
- Indicador de chamados pendentes e sinal sonoro opcional ativado pelo usuário.
- Histórico auditável dos eventos.
- Atualização consistente entre múltiplos navegadores.

O cliente poderá acionar um chamado por botão público, com limites anti-spam e confirmação de recebimento. Nunca mostrar um chamado como recebido se o servidor não o persistiu.

---

# 8. REDES AUTORIZADAS (WI-FI)

Implementar a seção conforme os fluxos demonstrados no vídeo:
- Listar redes autorizadas.
- Adicionar, editar, ativar, desativar e remover registros.
- Formulário com nome da rede, SSID e demais campos efetivamente necessários.
- Mostrar instruções e status das regras de autorização.
- Feedback de validação e ações persistidas.

**Limitação técnica obrigatória:** navegadores comuns não têm permissão para descobrir livremente o SSID Wi-Fi do cliente. Não prometa verificação automática de SSID no navegador. Se a funcionalidade exigir restringir acesso por rede, estudar verificação de IP público, gateway/proxy controlado, captive portal ou integração com infraestrutura de rede, explicando as limitações de NAT, VPN, redes móveis e falsos positivos. Fornecer um modo demonstrativo local explicitamente rotulado quando a infraestrutura real não estiver disponível.

---

# 9. BOTÕES PERSONALIZADOS

Criar a seção **Botões Personalizados** com:
- Listagem e ordenação dos botões.
- Modal **Novo Botão** e edição.
- Nome, descrição curta, ícone, cor, texto exibido e tipo de ação.
- Tipos de ação configuráveis: gerar chamado, abrir URL validada, abrir WhatsApp via link e ações internas suportadas.
- Associação por estabelecimento e, quando necessário, por mesa.
- Ativar/desativar, visualizar e excluir com confirmação.
- Pré-visualização do botão na interface do cliente.
- Registro de acionamentos quando a ação exigir auditoria.

Validar links para impedir protocolos inseguros. Não permitir ações arbitrárias executadas a partir de texto não confiável.

---

# 10. EQUIPE E PERMISSÕES

Implementar:
- Cadastro e convite de colaboradores.
- Papéis iniciais: proprietário, gerente, atendente e visualizador.
- Permissões granulares por módulo e operação.
- Listagem com nome, email, função e status.
- Alteração e revogação de acesso.
- Histórico de ações administrativas sensíveis.
- Proteção de rotas na interface e autorização obrigatória no backend.
- Bloqueio contra remoção acidental do último proprietário ativo.

Não armazenar senhas em texto puro. Nunca usar apenas a ocultação de botões como controle de segurança.

---

# 11. RELATÓRIOS E MÉTRICAS

Criar dashboard de indicadores, com:
- Quantidade de mesas e QR Codes ativos.
- Chamados por período e por tipo.
- Tempo médio de resposta e conclusão.
- Chamados abertos, resolvidos e cancelados.
- Uso de botões personalizados.
- Visualizações do cardápio quando houver coleta consentida e tecnicamente viável.
- Pedidos e faturamento somente quando o módulo de pedidos estiver habilitado.

Incluir filtros por intervalo de datas, gráficos legíveis, estados sem dados, tabelas e exportação CSV. Definir precisamente a fórmula de cada indicador. Não exibir métricas fictícias como reais. Dados de demonstração devem estar claramente identificados.

---

# 12. PLANOS E ASSINATURA

Implementar a área de planos:
- Plano atual, recursos incluídos, limites e status.
- Comparação de planos configuráveis.
- Informações de cobrança e histórico quando existir integração.
- Ações de alteração e cancelamento apenas quando suportadas.

O sistema deve funcionar localmente sem pagamento real. Caso seja necessária cobrança online, pesquisar e propor integração com provedor compatível com o Brasil, como Mercado Pago ou Stripe, consultando documentação oficial atualizada antes da implementação. Nunca armazenar dados completos de cartão. Webhooks precisam de verificação de assinatura, idempotência e tratamento de falhas. Não simular cobrança aprovada como real.

---

# 13. CONFIGURAÇÕES DO ESTABELECIMENTO

Reproduzir os agrupamentos identificados no vídeo, incluindo quando aplicável:
- Dados gerais: nome comercial, descrição, contatos e identidade visual.
- Personalização de marca: logo, cores, prévia e aparência do cardápio.
- Localização: endereço, cidade, CEP e mapa.
- Horários de funcionamento: dias, abertura, fechamento, intervalos e exceções.
- Preferências de atendimento e notificações.
- Regras de acesso e comportamento do QR Code.
- Preferências de exibição do cardápio e botões.

Criar formulários reais, validação, salvamento persistente, botão de cancelar alterações e feedback claro. A localização poderá usar OpenStreetMap com Leaflet; serviços de geocodificação públicos devem respeitar políticas de uso, limites e atribuição. Não exigir chave paga para mostrar um mapa básico.

---

# 14. RESPONSIVIDADE E ACESSIBILIDADE

Suportar monitores Full HD, 1440p, 4K, notebooks, tablets e smartphones.

No desktop, sidebar fixa e conteúdo distribuído em cartões, tabelas e painéis. No celular, menu lateral retrátil, formulários em coluna, tabelas com adaptação ou rolagem e botões com área de toque confortável.

Usar semântica HTML, rótulos associados aos campos, navegação por teclado, foco visível, mensagens anunciáveis, contraste adequado e respeito a `prefers-reduced-motion`. A prévia de celular deve caber na tela sem esconder campos essenciais.

---

# 15. OTIMIZAÇÃO E ESTABILIDADE

- Lazy loading de rotas e módulos pesados.
- Cache e invalidação consistente de consultas.
- Paginação em tabelas grandes.
- Compressão de imagens e formatos modernos.
- Índices adequados no banco de dados.
- Tratamento de erros de rede e reconexão.
- Evitar renderizações desnecessárias.
- Limitar taxa de chamadas públicas.
- Separar operações demoradas em tarefas assíncronas quando necessário.
- Estados de loading, erro, vazio e sucesso em todos os módulos.

Não sacrificar estabilidade para adicionar efeitos decorativos.

---

# 16. TELA INICIAL E PRIMEIRO ACESSO

Criar uma tela de entrada profissional com:
- Marca original do produto.
- Título: **CARDÁPIO DIGITAL INTELIGENTE**.
- Subtítulo: **Gerencie mesas, atendimento e experiência dos seus clientes em um só lugar.**
- Botões funcionais de entrar e criar conta.
- Tela de login, recuperação de acesso e cadastro de estabelecimento.
- Onboarding inicial para criar a primeira mesa e publicar o cardápio.

Após autenticação, abrir o painel administrativo. Se for modo demonstração, identificar claramente dados fictícios e oferecer um caminho simples para criar registros reais no banco local.

---

# 17. ESTRUTURA DO PROJETO

Organizar o código em arquitetura modular, por exemplo:

```text
cardapio-digital/
├── package.json
├── README.md
├── .env.example
├── docker-compose.yml
├── apps/
│   ├── web/
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   └── src/
│   │       ├── main.tsx
│   │       ├── App.tsx
│   │       ├── routes/
│   │       ├── components/
│   │       │   ├── layout/
│   │       │   ├── forms/
│   │       │   └── common/
│   │       ├── features/
│   │       │   ├── calls/
│   │       │   ├── tables/
│   │       │   ├── menu/
│   │       │   ├── wifi/
│   │       │   ├── buttons/
│   │       │   ├── team/
│   │       │   ├── reports/
│   │       │   ├── billing/
│   │       │   └── settings/
│   │       ├── services/
│   │       ├── hooks/
│   │       ├── styles/
│   │       └── types/
│   └── api/
│       ├── src/
│       │   ├── modules/
│       │   ├── middleware/
│       │   ├── realtime/
│       │   └── server.ts
│       └── prisma/
│           ├── schema.prisma
│           └── migrations/
├── packages/
│   └── shared/
└── tests/
    └── e2e/
```

Ajustar conforme necessário sem concentrar tudo em um único arquivo. Modelar pelo menos organizações, usuários, vínculos/permissões, mesas, QR tokens, categorias, produtos, adicionais, chamados, botões, redes, configurações e logs de auditoria. Pedidos e assinaturas devem ter modelos próprios quando habilitados.

---

# 18. FUNCIONAMENTO NO VISUAL STUDIO CODE

O projeto deve funcionar em Windows com Node.js e VS Code.

Comandos esperados:

```bash
npm install
npm run dev
npm run build
npm run preview
npm run test
```

Se usar PostgreSQL local, incluir `docker compose up -d`, migrações e seed de demonstração documentados. `npm run dev` deve iniciar os serviços necessários por scripts claros ou informar o pré-requisito antes da execução. Disponibilizar `.env.example` sem segredos reais. Documentar URLs locais, portas, credenciais apenas de demonstração e processo para resetar o banco.

Fornecer README em português brasileiro com instalação, execução, arquitetura, recursos, variáveis de ambiente e solução de problemas.

---

# 19. QUALIDADE E TESTES OBRIGATÓRIOS

Validar com testes reais quando houver acesso a terminal e navegador:
- Login, logout e proteção de rotas.
- Isolamento de dados entre estabelecimentos.
- Todos os nove itens da sidebar abrem suas telas.
- Criação, edição e exclusão de mesas persistem.
- QR Code gerado abre a mesa correta.
- Cardápio público mostra dados atualizados.
- CRUD de categorias, produtos e adicionais funciona.
- Formulários exibem validações e erros.
- Chamados aparecem em tempo real em duas sessões.
- Botões personalizados executam ações reais.
- Redes autorizadas mostram claramente as limitações de verificação.
- Permissões são impostas pelo backend.
- Relatórios correspondem aos dados do banco.
- Configurações e horários persistem.
- Navegação e modais funcionam no celular.
- Teclado e foco são utilizáveis.
- `npm run build` conclui sem erros de TypeScript.
- Não há imports quebrados, recursos inexistentes ou botões decorativos.

Adicionar testes de API, componentes e fluxos ponta a ponta. Se não for possível executar, não afirmar que testou; fornecer comandos e checklist de validação.

---

# 20. REGRAS ABSOLUTAS DE IMPLEMENTAÇÃO

1. Não entregar somente um protótipo visual.
2. Não substituir funcionalidades por pseudocódigo.
3. Não deixar botões, menus, formulários ou modais sem comportamento.
4. Não inventar recursos que supostamente aparecem no vídeo.
5. Não omitir arquivos essenciais.
6. Não usar imagens ou endpoints inexistentes sem fallback.
7. Não concentrar todo o projeto em um único componente.
8. Não expor senhas, tokens ou segredos no frontend.
9. Não confiar em permissões verificadas apenas no navegador.
10. Não criar integrações de pagamento ou Wi-Fi falsamente funcionais.
11. Não usar dados simulados sem identificá-los.
12. Não copiar marcas, conteúdo protegido ou identidade de terceiros sem licença.
13. Não exigir serviços pagos para o funcionamento principal local.
14. Não negligenciar LGPD, segurança, acessibilidade ou desempenho.
15. Toda a interface e documentação devem estar em português brasileiro.
16. Preservar a consistência da paleta vermelho, preto e branco.
17. Toda ação de salvar deve refletir no banco e sobreviver a recarregamentos.
18. Toda ação destrutiva deve exigir confirmação apropriada.
19. APIs externas devem ser verificadas na documentação oficial, sem inventar endpoints.
20. O comportamento observado na referência tem prioridade sobre funcionalidades adicionais não solicitadas, desde que seja legal, seguro e tecnicamente viável.

---

# 21. ORDEM DE DESENVOLVIMENTO

**FASE 1 — Análise das referências:** examinar vídeo e imagens, produzir inventário de telas, timestamps, interações, modais, formulários, validações e lacunas de observação.

**FASE 2 — Fundação:** configurar React, Vite, TypeScript, API, banco, migrations, autenticação, tema e estrutura modular.

**FASE 3 — Interface principal:** implementar sidebar, cabeçalho, navegação, dashboard, estados e componentes compartilhados com fidelidade visual.

**FASE 4 — Operação básica:** implementar Mesas & QR Codes, Cardápio Digital e interface pública do cliente com persistência.

**FASE 5 — Atendimento e administração:** implementar Chamados em Tempo Real, Redes Autorizadas, Botões Personalizados e Equipe & Permissões.

**FASE 6 — Gestão:** implementar Relatórios & Métricas, Planos & Assinatura e Configurações do estabelecimento.

**FASE 7 — Refinamento visual:** reproduzir comportamentos observados, prévias mobile, animações, estados e responsividade.

**FASE 8 — Integrações e segurança:** validar APIs, autenticação, autorização, isolamento de dados, rate limiting e auditoria.

**FASE 9 — Testes e entrega:** executar testes, corrigir erros, validar build e documentar instalação.

Cada fase deve preservar o funcionamento das anteriores. Priorizar um fluxo ponta a ponta funcional antes de aumentar a abrangência.

---

# 22. RESULTADO ESPERADO

Quero uma plataforma de cardápio digital e gestão de atendimento com aparência de software SaaS comercial moderno, semelhante em organização e interações às referências fornecidas, mas com identidade própria em vermelho, preto e branco.

A experiência deve combinar:
- Fidelidade visual às referências.
- Navegação intuitiva entre as nove seções.
- Mesas e QR Codes operacionais.
- Cardápio público responsivo.
- Chamados realmente sincronizados.
- Configurações e dados persistentes.
- Segurança, acessibilidade e organização de código.
- Experiência estável em desktop e mobile.

**INSTRUÇÃO FINAL:**

Não responda somente com explicações de como desenvolver o projeto: implemente a aplicação. Se tiver acesso ao ambiente de arquivos, crie e modifique os arquivos diretamente. Caso esteja limitado ao chat, entregue os arquivos completos com seus caminhos e conteúdo, dividindo em etapas quando necessário. Não alegue que funcionalidades foram testadas sem executá-las.

Antes de começar, apresente um inventário objetivo do que foi efetivamente observado no vídeo, com timestamps e lacunas, seguido da arquitetura proposta. Em seguida, inicie a implementação sem aguardar aprovação adicional, salvo quando faltar informação indispensável.

O objetivo final é executar a plataforma localmente no Visual Studio Code e ter um sistema de cardápio digital e atendimento realmente funcional, com design profissional e comportamento fiel às referências.

---

# 23. PROTOCOLO DE FIDELIDADE À GRAVAÇÃO — AUDITORIA OBRIGATÓRIA

A gravação de referência possui aproximadamente 186,2 segundos. Não considerar esta especificação um inventário exaustivo de todos os quadros. Antes de afirmar fidelidade integral, inspecionar a gravação completa, inclusive rolagens, hover, cliques, transições e modais, registrando timestamps e capturas de cada estado distinto. Distinguir recursos visíveis de comportamentos não demonstrados; estes últimos exigem validação ou decisão de produto, não suposições.

Na gravação de referência, há evidência visual de:
- Painel inicial com resumo e indicadores, avisos, status e navegação lateral.
- Mesas & QR Codes: lista de mesas e modal Nova Mesa com campos e ações.
- Fluxo de personalização de mesa: modal de edição com etapas/abas, campos, opções e prévia de celular; seleção de imagem e alterações visuais; estados de prévia com conteúdo e estados vazios.
- Redes Autorizadas (Wi-Fi): listagem de redes, ação de cadastrar e formulário de rede autorizada.
- Botões Personalizados: listagem, criação de botão, configuração de nome, comportamento/ação e outras opções visíveis.
- Equipe & Permissões: visão geral e formulário de novo membro com atribuição de função/permissões.
- Relatórios & Métricas: indicadores, filtros e componentes de desempenho.
- Configurações do Estabelecimento: várias seções de configuração, identidade visual, prévias, mapa/localização, dados de endereço, preferências, funcionamento e horários por dia da semana.

REGRAS DE AUDITORIA:
1. Criar uma matriz de rastreabilidade: timestamp inicial/final, aba, ação, estado anterior, estado posterior, campos visíveis, validações observáveis e arquivo/componente implementado.
2. Conferir cabeçalho, menu lateral, área principal, rodapé, avisos, ícones, cores, tamanhos, espaçamentos, rótulos, estados desabilitados, toasts, modais e menus suspensos em cada tela.
3. Conferir separadamente estados de tela após cada clique e após cada rolagem; não tratar telas diferentes como uma só.
4. Implementar todos os controles observados com comportamento coerente, persistência quando necessária e mensagens de erro/sucesso.
5. Registrar o que o vídeo não demonstra, incluindo efeitos de ações não executadas e integrações externas; não afirmar que foram reproduzidos exatamente.
6. Fazer revisão comparativa lado a lado em desktop e mobile, com lista de divergências e correções.
7. Não declarar que o vídeo foi analisado quadro a quadro ou que a interface está idêntica sem realizar e documentar essa verificação.

Este protocolo complementa as 22 seções anteriores e não substitui os requisitos de segurança, testes, arquitetura e funcionalidades.

---

# 24. REELS GASTRONÔMICOS E VISUALIZAÇÃO 360° COM IA — MÓDULO OBRIGATÓRIO

**OBJETIVO:** Permitir que o restaurante publique vídeos curtos de comidas, petiscos, sobremesas e bebidas, vinculados a produtos reais do cardápio. O cliente deve visualizar um feed vertical estilo Reels e, quando houver mídia adequada, explorar uma apresentação interativa 360° do prato.

## 24.1 Painel administrativo de Reels

- Integrar **Vídeo Reels diretamente ao modal Cadastrar Novo Prato**, no painel lateral **STUDIO DE MÍDIAS (9:16)**, alternável com **Foto Vertical**, conforme as capturas da aba Cardápio Digital. Não criar uma aba principal separada chamada Reels como substituição desse fluxo. Um feed/gerenciador adicional é permitido como recurso complementar, mas nunca no lugar do editor de mídia do produto.
- Upload de vídeo MP4/WebM, com limite configurável de tamanho e duração, validação MIME real, progresso, cancelamento, tratamento de falhas e armazenamento persistente.
- Criar, editar, excluir, publicar, despublicar e reordenar vídeos.
- Associar cada vídeo a um ou mais produtos existentes; permitir capa, título, descrição, etiquetas e indicação de destaque.
- Pré-visualização desktop/mobile, incluindo o comportamento dos botões e do player.
- Miniaturas automáticas via processamento local (por exemplo FFmpeg) quando disponível, com fallback manual.
- Transcodificação opcional e geração de versões otimizadas, sem bloquear o painel; jobs assíncronos com estados de processamento.
- Permissões administrativas para publicação e exclusão, com trilha de auditoria.

## 24.2 Feed de Reels para o cliente

- Feed vertical mobile-first, com vídeos em tela cheia ou cartões verticais conforme contexto, rolagem fluida e navegação por toque.
- Reprodução automática **sem som** somente quando permitida pelo navegador e vídeo visível; pausar vídeos fora da tela e respeitar economia de dados e `prefers-reduced-motion`.
- Controles reais de reproduzir/pausar, ativar/desativar som, ver detalhes e acessar o produto no cardápio.
- Exibir nome do prato, preço vigente, descrição curta, disponibilidade e botão funcional **Ver prato** ou **Adicionar ao pedido**, este último apenas quando pedidos estiverem habilitados.
- Fallback com imagem/capa e mensagem amigável quando o vídeo não carregar.
- Não exibir preços ou disponibilidade inventados; ler dados do produto associado.
- Métricas de visualizações com critério explícito, sem contagem artificial por rerenderização.

## 24.3 Visualização 360° real e apresentação com IA

Oferecer **três modos distintos**, identificados corretamente:

**Modo A — Vídeo comum:** reproduz o vídeo enviado sem afirmar que é um modelo 3D.

**Modo B — Giro 360° a partir de imagens reais:** permitir upload de uma sequência de fotos do prato em ângulos sucessivos ou captura com câmera girando ao redor; implementar visualizador interativo que responde ao arraste horizontal e ao toque. Quando possível, criar a sequência de quadros a partir de uma filmagem orbital adequada. Não confundir isso com vídeo panorâmico esférico.

**Modo C — Reconstrução 3D assistida por IA:** oferecer fluxo opcional para geração de modelo 3D a partir de múltiplas imagens ou vídeo com cobertura suficiente, usando serviço/modelo compatível e licenciado após pesquisa técnica. Exibir status de processamento, custos e requisitos antes de iniciar; permitir prévia, aprovação, rejeição e publicação. A saída deve poder ser visualizada em um viewer WebGL (por exemplo Three.js/React Three Fiber) com rotação, zoom limitado, iluminação adequada e fallback 2D. Identificar a reconstrução como **representação estimada por IA**, que pode divergir do prato real. Não prometer reconstrução fiel de lados ocultos a partir de uma única foto ou de vídeo sem cobertura angular.

Não exigir APIs pagas para o funcionamento básico de upload, feed e visualização por sequência de imagens. O recurso de IA pode depender de GPU, processamento local especializado ou provedor externo; torná-lo opcional, documentar custos, privacidade e limitações. Nunca simular geração de IA como se fosse real.

## 24.4 APIs, arquitetura e armazenamento

- Pesquisar documentação oficial atualizada de upload multipart ou URL assinada, FFmpeg, armazenamento local/S3-compatível, geração de thumbnails, processamento assíncrono e visualização WebGL antes de escolher dependências.
- Modelar `Reel`, `ReelMedia`, `ReelProduct`, `MediaProcessingJob`, `Spin360Asset` e `Generated3DAsset` ou entidades equivalentes, vinculadas ao estabelecimento, com isolamento multi-tenant.
- Guardar arquivos de mídia fora do bundle do frontend; servir URLs autorizadas, validar tamanho e conteúdo, impedir path traversal e limitar requisições.
- Utilizar formatos web adequados e versões comprimidas; lazy loading, poster e carregamento progressivo.
- Proteger vídeos privados e mídia ainda não publicada contra acesso indevido.
- Definir política de retenção e exclusão de mídias, tratamento LGPD quando aplicável e autorização sobre conteúdos enviados.

## 24.5 Integração e testes obrigatórios

- O módulo deve funcionar tanto na área administrativa quanto na interface pública acessada pelo QR Code da mesa.
- Testar upload válido/inválido, processamento, publicação, despublicação, exclusão, vínculo ao produto, autoplay mudo, pausa fora da viewport, navegação por toque, áudio, acessibilidade e falhas de rede.
- Testar giro 360° com imagens reais e gestos de mouse/touch, além de fallback quando não existir ativo 360°.
- Caso IA não esteja configurada, mostrar **Recurso de IA não configurado**, sem botão que finja gerar conteúdo.
- Incluir na matriz de rastreabilidade do vídeo qualquer funcionalidade de Reels/360° efetivamente observada e diferenciar requisitos adicionais solicitados pelo proprietário do projeto.
- Incluir o módulo na ordem de desenvolvimento após o cardápio funcional, antes do refinamento visual final; atualizar README, modelos de dados e testes de build.

**CRITÉRIO DE ACEITAÇÃO:** O administrador consegue enviar um vídeo real de um petisco, vinculá-lo ao produto e publicá-lo; o cliente abre o cardápio pelo QR Code, assiste ao Reel e acessa o prato. Se houver sequência 360° real cadastrada, consegue girar o prato por toque/arraste. Se houver reconstrução por IA configurada e concluída, consegue abrir o modelo estimado em um visualizador 3D. Nenhuma dessas etapas pode ser apenas decorativa.

---

# 25. COMPLEMENTO DE AUDITORIA VISUAL — FLUXOS E SUBTELAS IDENTIFICADOS

**Status da verificação:** esta seção foi acrescentada após revisão de amostras visuais distribuídas pelos 186,2 segundos da gravação (aproximadamente uma captura a cada três segundos). **Não equivale à inspeção individual dos ~11.172 quadros** e não autoriza afirmar cobertura integral. Antes da entrega definitiva, continuar a auditoria de todos os estados distintos, inclusive transições rápidas entre as amostras.

## 25.1 Painel inicial e navegação

- Reproduzir os avisos superiores de configuração/pendências, período de teste e ações de plano exibidos na área de trabalho.
- Reproduzir o bloco de boas-vindas ao restaurante, indicadores resumidos e acessos rápidos, com dados verdadeiros ou estados vazios claramente identificados.
- Manter a navegação lateral persistente e o destaque da rota ativa durante modais e rolagens.

## 25.2 Mesas e QR Codes — fluxos adicionais

- Modal **Nova Mesa**, com campos obrigatórios, validações, botão de confirmação e aviso de sucesso após salvar.
- Listagem em cartões de mesas com QR Code e ações contextuais; manter prévia do código e identificação da mesa.
- Fluxo **Cadastrar Novo Prato** aberto a partir do Cardápio Digital: modal amplo com rolagem interna e pré-visualização do celular à direita.

## 25.3 Cardápio Digital — subabas e criação de prato

- Na página principal, exibir as abas **Produtos (N)** e **Categorias (N)**; **Reels não é uma terceira aba comprovada nessa tela**. Dentro do modal de produto, o painel **STUDIO DE MÍDIAS (9:16)** alterna **Foto Vertical** e **Vídeo Reels**, com prévia de celular. Implementar exatamente essa hierarquia, conforme seção 28.
- Na criação de prato, incluir nome, categoria, preço normal, preço promocional quando aplicável, descrição, opções de tipo de mídia e prévia visual em celular.
- Permitir alternar entre mídia de imagem e vídeo, com área de upload e indicação de estado vazio ou prévia carregada.
- Preservar opções de personalização e configurações adicionais observáveis no modal, incluindo ações/toggles e seções expansíveis; reproduzir os rótulos exatos após leitura ampliada da gravação.
- Reproduzir validações e mensagens de atenção quando uma mídia ou configuração obrigatória estiver ausente.
- A prévia deve refletir mudanças reais dos campos, em vez de usar uma imagem estática independente dos dados.

## 25.4 Redes Autorizadas (Wi-Fi)

- Área de redes cadastradas, indicador de rede/identificador e status, botão de adicionar rede e ações de gerenciamento.
- Modal **Cadastrar Rede Autorizada** com nome da rede e identificador de rede, validação e confirmação de sucesso.
- Não presumir acesso automático à rede Wi-Fi do cliente pelo navegador: explicar limitações de identificação de SSID/BSSID e usar mecanismos de verificação permitidos quando aplicáveis.

## 25.5 Botões Personalizados

- Listagem de botões existentes com ícone, nome, tipo/estado e ações de edição/remoção.
- Modal **Novo Botão** com nome, escolha de ícone, tipo de ação e opções contextuais; campos condicionais devem aparecer conforme a ação escolhida.
- Reproduzir os diferentes estados do seletor de ação e do botão de salvar; não tratar todas as ações como um link genérico.

## 25.6 Equipe e Permissões

- Tela de equipe com indicadores/resumos e tabela de membros.
- Modal **Novo Membro da Equipe**, incluindo nome completo, e-mail, função/papel, regras de acesso e opções que mudam conforme a função selecionada.
- Validações de dados, salvamento e controle de permissões efetivo no backend; esconder controles na interface não substitui autorização.

## 25.7 Relatórios e Desempenho

- Área de indicadores e gráficos, seleção de período e agrupamentos de desempenho.
- Reproduzir gráficos de **chamados por tipo de ação** e **movimento por mesa**, quando houver dados; estados vazios honestos quando não houver.
- O filtro de período deve alterar consultas e resultados, não apenas o rótulo selecionado.

## 25.8 Configurações — página inteira e rolagem longa

A gravação percorre uma página extensa com múltiplas seções. Não implementar apenas o primeiro bloco visível. Incluir, preservando a ordem e hierarquia verificadas na referência:

- Abas internas de configurações e botão de salvar alterações.
- Identidade visual: nome, cores e personalização do estabelecimento, com visualização de cores.
- Dados cadastrais e faturamento, contatos e endereço.
- Upload de **imagem de fundo da tela de mesa**, com prévia e opção de substituição/remoção.
- Upload de **logotipo do estabelecimento**, com área de arquivo e estados de carregamento.
- Configuração da **mensagem de boas-vindas da mesa (QR Code)**, com campos e pré-visualização mobile.
- Regras de chamadas e retorno automático, incluindo opções de habilitar/desabilitar e campos condicionais.
- Opções de validação de presença/segurança que aparecem na gravação; reproduzir textos e dependências após inspeção ampliada.
- **Geolocalização** com mapa interativo, marcador, coordenadas e raio permitido quando aplicável; não solicitar geolocalização sem consentimento.
- Configurações adicionais de identificação da mesa e limites/validações, quando confirmadas.
- **Horários de funcionamento por dia da semana**, com ativação individual, horários de abertura/fechamento e salvamento real.
- Ao rolar, manter a continuidade da página, sem trocar blocos por telas fictícias desconectadas.

## 25.9 Verificação de fidelidade por elemento

Para cada campo, botão, opção, alerta, modal e subaba: registrar o texto exato, posição, estado padrão, comportamento após interação, requisito de dados, mensagem de erro, persistência e componente implementado. Se a resolução da captura não permitir ler um rótulo, marcá-lo como **PENDENTE DE CONFERÊNCIA**, em vez de inventar seu texto.

**Não confundir:** (a) recursos vistos na gravação; (b) comportamentos deduzidos; (c) novos requisitos solicitados, como geração 360° assistida por IA. Identificar essas três origens no checklist de aceite.

---

# 26. AUDITORIA INCREMENTAL DAS CAPTURAS — CHAMADOS EM TEMPO REAL (REFERÊNCIA RECEBIDA)

**Origem:** duas imagens enviadas pelo usuário: (1) item selecionado no menu lateral; (2) área superior e início dos indicadores da página. Tratar como referência visual e de elementos visíveis, não como prova de comportamento interno.

## 26.1 Navegação lateral
- Item **Chamados em Tempo Real**, com ícone de sino, fundo vermelho vivo, cantos arredondados e selo **AO VIVO** à direita; texto branco em duas linhas.
- Ao clicar, navegar para o painel de chamados mantendo menu e contexto do restaurante.

## 26.2 Aviso de confirmação de acesso
- Banner superior com fundo amarelo-claro, borda amarelo-alaranjada e selo **CONFIRMAÇÃO DE ACESSO**.
- Mensagem sobre acesso liberado durante 10 dias de teste; título **Confirme seu e-mail para proteger seu painel**.
- Explicação sobre link de confirmação, caixa de entrada, spam, notificações e recuperação de senha.
- Ações **Reenviar E-mail** e **Corrigir E-mail**, com fluxos reais, validação, estados de carregamento, limites de reenvio e mensagens de retorno.
- Não inserir e-mail pessoal ou nome do restaurante da captura como dados fixos: utilizar dados do usuário autenticado.

## 26.3 Período de teste e assinatura
- Cartão branco com selo **7 DIAS RESTANTES**, indicador **10 dias gratuitos**, título **Seu período gratuito termina em 7 dias**, explicação de uso gratuito, contador **Dia 4 de 10**, texto **7 dias para o fim** e barra de progresso.
- Botão **Escolher plano**, navegando para Planos & Assinatura.
- Os números são apenas o estado exemplificado na captura; calcular dinamicamente datas e dias restantes, com tratamento de expiração e fuso horário.

## 26.4 Cabeçalho operacional
- Nome do restaurante em destaque, ponto verde e selo **Ao vivo**.
- Subtítulo sobre acompanhar e atender chamados das mesas em tempo real com áudio no salão.
- Ações **Abrir Modo TV (nome do restaurante)** e **Atualizar**; implementar visualização TV funcional e atualização dos indicadores com feedback.

## 26.5 Painel de boas-vindas / ativação
- Card horizontal com gradiente vermelho-vinho até azul-marinho, texto branco, cantos grandes e selo verde **10 DIAS GRÁTIS ATIVOS** acompanhado de **Acesso completo liberado**.
- Título contextual **Tudo pronto para operar em [restaurante]** e texto sobre mesas iniciais, cardápio demonstrativo, impressão de QR Codes, chamadas da equipe e operação do salão.
- Botões **Ver Tutorial do Sistema**, **Ver Mesas & QR Codes** e **Modo TV**. Todos devem abrir destinos reais.
- Não mostrar mensagem de configuração inicial concluída quando as mesas ou o cardápio ainda não estiverem prontos.

## 26.6 Cartões de indicadores (parte visível)
- Layout em grade responsiva, cartões brancos arredondados, ícones coloridos e valores grandes.
- Indicadores observados: **Aguardando Atendimento**, **Tempo Médio de Resposta**, **Atendimentos Concluídos**, **Pedidos de Conta**, **Mesas Ativas** e **Produtos no Cardápio**.
- Exemplos visíveis: 0, 0s, 0, 0, 1/1 e 0; nunca codificar esses valores fixamente.
- Ícone flutuante de WhatsApp no canto inferior direito; se implementado, usar link configurável e destino real, sem número fictício.
- A imagem termina antes de mostrar o restante da página: marcar conteúdos inferiores como **PENDENTES DE CAPTURA**, sem inventar a estrutura.

## 26.7 Critérios de aceite desta captura
- Reproduzir ordem dos blocos, hierarquia, cores, arredondamentos, responsividade e rótulos observados, respeitando a paleta geral vermelha, preta e branca do projeto.
- Fazer os botões, contadores, avisos, atualização em tempo real e Modo TV funcionarem de fato; onde a captura não mostra o comportamento, marcar como **comportamento proposto, ainda não confirmado pela referência**.
- Manter uma matriz incremental por aba: elemento visto, requisito presente, implementação, teste e pendência. Acrescentar futuras capturas sem apagar seções anteriores.

---

# 27. AUDITORIA VISUAL — ABA MESAS & QR CODES (CINCO CAPTURAS)

## 27.1 Página principal e composição
- Item do menu lateral **Mesas & QR Codes**, com ícone de grade de quatro quadrados, estado selecionado em vermelho vivo, texto branco e cantos arredondados.
- Cabeçalho **Mesas & QR Codes**, subtítulo **Cadastre mesas, imprima cartões de acrílico com QR Code e gerencie tokens seguros.** e botão vermelho **+ Nova Mesa** à direita.
- Banner de divulgação **Atendimento por Aproximação (NFC) & Displays Personalizados**, selo **EXCLUSIVO**, ícone NFC branco sobre fundo laranja-avermelhado e texto sobre tags físicas NFC, personalização de QR Code, selo NFC, logo, nome do bar e instruções.
- Área de filtros em chips: **Todos os Setores** com total agregado e chips de setores existentes com contagem; chip selecionado em azul-marinho quase preto, não selecionados brancos com borda suave.
- Grade responsiva de cartões brancos arredondados com borda e sombra leve; botão flutuante do WhatsApp visível no canto inferior direito.

## 27.2 Cartões de mesa
- Cada cartão mostra miniatura do QR Code real, identificação pequena **MESA #N**, nome principal (ex.: **Mesa 01**), chip de setor (ex.: **Salão Principal**, **Deck**), legenda **Token v1** seguida de fragmento truncado do token, e selo amarelo **Editável** com cadeado.
- Ícones de lápis para editar e lixeira para excluir no topo do cartão; ações inferiores **Imprimir**, **Gravar NFC** e ícone de abrir link externo.
- Gerar QR exclusivo com URL da mesa e token assinado ou aleatório criptograficamente seguro; nunca expor segredo de assinatura no navegador. Persistir versão e estado do token, com estratégia segura de renovação/revogação. O fragmento visível é apenas identificação abreviada, nunca token completo exposto como segredo administrativo.
- Implementar edição, exclusão com confirmação, impressão em formato adequado, abertura do endereço correto e gravação NFC somente em dispositivos/navegadores compatíveis, com detecção de suporte e alternativa para copiar o link. Não alegar que a captura demonstra telas internas dessas ações.

## 27.3 Modal Nova Mesa
- Modal central branco arredondado, fundo da página escurecido, título **Nova Mesa**, subtítulo **Defina a identificação da mesa para geração do QR Code exclusivo.**, botão **X** de fechar.
- Campo **Nome ou Identificação da Mesa** (exemplo visível **Mesa 02**).
- Campo **Número de Identificação** (exemplo **2**).
- Campo **Setor / Área do Restaurante** (exemplo **Salão Principal**); sugestões clicáveis **Salão Principal**, **Varanda**, **Deck**, **Bar**, **Mezanino**, **Área Externa**. Permitir setor digitado/customizado, se aplicável à implementação; o comportamento de digitação deve ser confirmado em testes.
- Texto auxiliar **Permite que os painéis da TV filtrem e mostrem apenas as mesas deste setor.**
- Rodapé com botão vermelho **Criar Mesa & Gerar QR** e botão branco **Cancelar**.
- Validar nome e número, prevenir duplicidade por restaurante, mostrar carregamento, persistir a mesa, gerar QR válido e atualizar a interface sem reload. Cancelar/X devem fechar sem salvar.

## 27.4 Confirmação e atualização após criação
- Modal de sucesso com ícone de check verde, título **Tudo certo!**, mensagem **Mesa criada com sucesso!**, botões **Cancelar** e **Perfeito** conforme a referência. Preservar esses rótulos, mas não supor sem teste o destino de cada ação; assegurar fechamento coerente do modal.
- Sequência demonstrada: antes havia **Todos os Setores 1** e **Salão Principal 1**; depois da criação da **Mesa 02** no setor **Deck**, aparecem **Todos os Setores 2**, **Deck 1** e **Salão Principal 1**, com dois cartões visíveis.
- Atualizar imediatamente filtros, contadores, cartões e associação do setor ao Modo TV após criação, edição ou exclusão; não fixar contagens do exemplo.
- A nova mesa exibe **MESA #2**, chip **Deck**, **Mesa 02**, **Token v1**, QR Code, selo **Editável** e ações de imprimir, gravar NFC e abrir link.

## 27.5 Regras de fidelidade e testes
- Reproduzir visual, ordem, textos, ícones, estados e espaçamento das cinco capturas, usando dados dinâmicos do restaurante autenticado.
- Verificar criação em setor existente e novo, filtros, geração e abertura do QR, impressão, permissões de edição, cancelamento, exclusão, renovação do token, suporte NFC, feedback de sucesso e falha e layout móvel.
- Distinguir **visível nas capturas** de **comportamento técnico necessário/proposto**: as imagens não comprovam o funcionamento real de NFC, edição, exclusão ou impressão.
- Não remover nem substituir a seção 26 ou as seções anteriores ao incorporar futuras imagens.


---

# 28. AUDITORIA VISUAL DETALHADA — CARDÁPIO DIGITAL E CADASTRO DE PRATOS (CAPTURAS RECEBIDAS)

**Origem:** conjunto de dez capturas anexadas pelo usuário na etapa Cardápio Digital, incluindo item do menu lateral, tela da listagem, modal de cadastro em estados distintos, rolagem inferior do formulário, mídia em foto/vídeo, subabas, cadastro de categoria e importador. Esta seção tem prioridade sobre instruções genéricas anteriores quando houver divergência no layout ou na localização dos recursos. **A captura é evidência do estado visual, não prova automática da lógica interna.**

## 28.1 Menu lateral e página principal

- Item **Cardápio Digital** no menu lateral com ícone de livro aberto e preenchimento vermelho vivo (#F50046 aproximadamente), texto e ícone brancos, cantos arredondados, na mesma hierarquia dos demais itens.
- Título grande **Cardápio Digital** e subtítulo **Cadastre categorias, organize pratos e bebidas e controle itens disponíveis hoje.**
- Ações alinhadas à direita, na ordem **Importar Planilha** (ícone de planilha, botão claro contornado), **Nova Categoria** (ícone de pasta com +, botão claro) e **+ Novo Produto** (fundo vermelho, texto branco).
- Abaixo, sistema de abas **Produtos (N)** e **Categorias (N)**, com contadores dinâmicos, estado ativo em vermelho e sublinhado vermelho. Exemplo das capturas: **Produtos (0)** e **Categorias (1)**; não fixar essas contagens.
- Caso não haja produtos cadastrados, manter o estado vazio sem dados fictícios. Não inventar uma terceira aba Reels na listagem principal.
- Ícone de WhatsApp flutuante no canto inferior direito como nos outros módulos, configurável, com destino real.
- Os três botões superiores devem abrir seus respectivos fluxos sem sair da área de Cardápio Digital; a troca de abas não pode perder dados sem aviso.

## 28.2 Modal amplo **Cadastrar Novo Prato**

- Clicar em **+ Novo Produto** abre modal grande de fundo branco e bordas arredondadas sobre a página. Título **Cadastrar Novo Prato**, subtítulo **Cadastre pratos, porções, bebidas e personalize fotos e vídeos verticais para o cardápio digital.**, botão **X** no canto superior direito.
- Desktop: conteúdo em duas colunas, formulário à esquerda e **STUDIO DE MÍDIAS (9:16)** à direita. Preservar divisória/gap entre colunas, alinhamento de títulos, layout claro e estilo dos controles.
- Abas horizontais no topo do formulário esquerdo: **DADOS PRINCIPAIS DO PRODUTO**, **VARIAÇÕES DO PRODUTO**, **PROMOÇÃO PROGRAMADA**, cada uma com ícone e destaque vermelho na aba ativa. A troca de aba altera só o formulário esquerdo; a prévia do Studio de Mídias permanece à direita.
- O modal possui rolagem interna (barra de rolagem visível) para conteúdo longo, com rodapé persistente contendo um ponto verde e o texto **Cardápio atualizado em tempo real para os clientes nas mesas**, além de botões **Cancelar** e **Cadastrar Produto** em vermelho. `Cancelar`/`X` descartam alterações com confirmação se houver dados não salvos; cadastrar valida e persiste o produto.
- Em smartphones, empilhar campos e studio, mantendo prévia proporcional, rolagem e ações de salvar acessíveis; não comprimir o celular a ponto de torná-lo ilegível.

## 28.3 Aba **DADOS PRINCIPAIS DO PRODUTO**

- Campo **Nome do Produto**, placeholder exemplificativo **Ex: Hambúrguer da Casa, Picanha na Chapa, Chopp 500ml**.
- Campo **Categoria no Cardápio** com `select`, exibindo categoria cadastrada (a referência contém uma categoria de exemplo chamada **OI**); vincular por ID da categoria, não por texto arbitrário.
- Dois campos lado a lado: **Preço Normal (R$)** e **Preço Promocional (Opcional)**. Aceitar vírgula/ponto de forma robusta e formatar em BRL, sem erro por ponto flutuante (usar valores em centavos).
- Ao preencher preço normal 36 e promocional 29, exibir mensagem verde **Promoção ativa: 19% de desconto** e **Economia de R$ 7,00 para o cliente**, calculando percentual por regra documentada (`(normal-promocional)/normal*100`, arredondado para inteiro). Recusar preço promocional negativo ou maior/igual ao normal quando tratado como desconto. Não fixar números do exemplo.
- Campo de texto grande **Descrição Detalhada do Prato**, com placeholder convidando a descrever ingredientes, acompanhamentos e modo de preparo; contador de caracteres atualizado em tempo real (observado: `0 caracteres` e estado preenchido).
- Seção **Tags e Selos Alimentares** com chips selecionáveis: **⭐ Mais Pedido**, **🌱 Vegetariano**, **🥦 Sem Glúten**, **🌶️ Picante**, **👨‍🍳 Artesanal**, **🆕 Novidade** e **🥩 Especial da Casa**. Respeitar conteúdo/ícones da referência; chips ativos com contorno/fundo rosa e marca de verificação, inativos cinza/azul claro.
- Campo **Outra tag personalizada (pressione Enter)** e botão **Adicionar**. Ao adicionar, a etiqueta deve surgir na lista de tags aplicadas; as etiquetas selecionadas também aparecem como chips escuros removíveis com `X`, persistindo no produto. Evitar tags duplicadas e tratar entrada inválida.
- Seção inferior **Produto em Destaque no Cardápio**, com checkbox de ativação e explicação **Fixado no carrossel de topo do cardápio para gerar mais visibilidade e pedidos.** Ao ativar, persistir o destaque e atualizar a ordem/carrossel público de forma determinística.
- Cartões/atalhos inferiores **Variações do Produto** (configurar por peso, tamanho ou tipo) e **Promoção Programada** (configurar Happy Hour e dias específicos), navegando às respectivas abas sem perder valores já digitados.
- Dados do formulário devem atualizar **em tempo real** a prévia do celular à direita: nome, categoria, preço vigente, preço normal riscado quando promocional, foto, tags relevantes. Captura de exemplo mostra título digitado na prévia e preço promocional `R$ 29,00` acompanhado do original riscado.

## 28.4 Painel **STUDIO DE MÍDIAS (9:16)** — Foto Vertical

- Título **STUDIO DE MÍDIAS (9:16)** e selo superior direito **Stories & Reels**.
- Controle segmentado para **Foto Vertical** e **Vídeo Reels**, com seleção em destaque e ponto verde visível junto à Foto Vertical em um estado de captura. Não confundir o indicador visual com a garantia de upload válido.
- Grande visualizador com moldura de smartphone, proporção aproximada **9:16**, cantos arredondados, moldura escura, representação de câmera/recorte e prévia de imagem gastronômica.
- Sobre a prévia da foto: selo **9:16 STORIES**, categoria, título do produto, preço atual e, se houver promoção, valor original riscado. Deixar o preview reagir aos dados preenchidos.
- Botão/área **Carregar Foto Vertical (JPG, PNG, WEBP)**, abrindo seletor real e aceitando arrastar/soltar quando suportado. Exibir progresso, prévia, trocar/remover, validação de formato/tamanho e erro amigável.
- Campo alternativo **ou link:** seguido de URL da imagem e ícone de lixeira para remover a URL/mídia. Não depender de uma foto externa fixa usada no screenshot; fallback quando a URL externa bloquear CORS ou falhar.
- Preservar a prévia 9:16 sem esticar imagens: permitir crop/`object-fit: cover`, orientação ao usuário e tamanho adequado no mobile.

## 28.5 Painel **STUDIO DE MÍDIAS (9:16)** — Vídeo Reels

- Selecionar **Vídeo Reels** no controle segmentado substitui o conteúdo da prévia pelo estado do vídeo, sem mudar os dados principais do produto ou as abas da esquerda.
- Estado vazio visto na captura: smartphone com fundo azul-marinho quase preto, ícone de vídeo rosa, título **Nenhum vídeo carregado** e instrução **Grave até 10 segundos na vertical para encantar seus clientes.**
- Abaixo: controle **Carregar Vídeo Vertical (MP4/MOV até 15s)** e campo **ou link:** com placeholder **YouTube Shorts, YouTube ou link .mp4**.
- Há uma divergência textual real na referência entre recomendação de gravar até **10 segundos** e indicação de upload de **até 15s**. Manter ambos como estão visualmente ou harmonizar com a regra de produto de forma explícita: **10s recomendados; 15s máximo aceito**, incluindo feedback claro para o usuário. Não assumir que a limitação efetiva foi comprovada por upload.
- Fazer upload verdadeiro de MP4/MOV, checar conteúdo real e duração, mostrar progresso, geração de poster, preview player com play/pause e som iniciado apenas por interação. Validar URL direta de mídia e links externos; para YouTube/Shorts usar integração/embeds compatíveis com políticas da plataforma, não tratá-los automaticamente como arquivo MP4 direto.
- O vídeo pertence ao **produto em criação/edição**; salvar vínculo no banco e exibi-lo na apresentação pública de Stories/Reels, segundo permissão e disponibilidade do item.
- Upload de Reel e visualização 360° assistida por IA são coisas distintas. As capturas **comprovam upload de vídeo vertical e prévia de Reels**, mas **não mostram um botão de geração 360° com IA**. Preservar a funcionalidade 360° como pedido adicional do usuário, não fingir que ela aparece nesses prints.

## 28.6 Aba **VARIAÇÕES DO PRODUTO**

- Ao selecionar essa aba, exibir na coluna esquerda os campos **Nome do Produto** e **Categoria no Cardápio**, mantendo seus valores entre abas.
- Exibir cartão com ícone vermelho e pergunta **Este produto possui variações? (ex: tamanho, peso)**; explicação **Ative para cadastrar opções individuais com nomes e preços próprios.**
- Controle toggle com estado inicial **Não** na captura; ativação deve revelar editor de variações com opções de nome, tipo/tamanho/peso, preço próprio, disponibilidade, ordenação, criação/remoção e validação. **O layout do estado 'Sim' não está demonstrado nessas capturas**; essas regras são requisitos funcionais propostos, não reproduções verificadas.
- Preservar na coluna direita o Studio de Mídias e respectivo estado (foto ou vídeo) durante a troca de abas.

## 28.7 Aba **PROMOÇÃO PROGRAMADA**

- Ao selecionar essa aba, exibir **Nome do Produto**, **Categoria no Cardápio**, **Preço Normal Base (R$)** e **Preço Promocional Padrão (Opcional)** com os valores já digitados.
- Exibir cartão com ícone de relógio vermelho, título **Ativar Promoção Programada (Happy Hour)?** e texto **O preço especial entrará e sairá do ar automaticamente nos dias e horários selecionados.**
- Toggle começa em **Não** no exemplo. Se ativado, implementar seleção de dias da semana, hora de início/fim e regra de vigência para o fuso horário do estabelecimento, com validação de conflitos, cálculo seguro do preço ativo e atualização automática no cardápio público. **O estado expandido do toggle não está visível nos prints recebidos**, logo sua aparência final deve ser marcada para conferir em futuras capturas.
- Não alterar campos preenchidos nem mídia ao alternar entre promoção e outras abas. Testar virada de dia, virada de horário, agenda expirada e promoções simultâneas.

## 28.8 Modal **Nova Categoria**

- Botão superior **Nova Categoria** abre modal pequeno, centralizado, branco, arredondado e com `X` para fechar.
- Título **Nova Categoria**; descrição **Agrupe seus pratos e bebidas em seções claras.**
- Campo **Nome da Categoria**, placeholder **Ex: Hambúrgueres, Bebidas, Sobremesas**.
- Campo **Descrição (Opcional)**, placeholder **Ex: Aperitivos e porções artesanais**.
- Rodapé com botões **Salvar Categoria** (vermelho) e **Cancelar** (claro). Validar obrigatoriedade de nome, duplicidades por restaurante e persistência; após salvar, atualizar contagem **Categorias (N)** e opções do `select` nos produtos. Os prints não mostram o estado depois de salvar, então não inventar a mensagem exata de sucesso.

## 28.9 Modal **Importar Produtos de Planilha**

- Botão superior **Importar Planilha** abre modal grande, centralizado, título **Importar Produtos de Planilha** e subtítulo **Carregue pratos e bebidas em lote de outros sistemas de forma rápida e inteligente.**, com `X` para fechar.
- Wizard horizontal de 3 passos, com números/indicadores e rótulos: **1 Arquivo** (`Excel ou CSV`), **2 Mapeamento** (`De-Para de colunas`) e **3 Prévia & Confirmar** (`Revisão final`). O passo ativo usa destaque vermelho.
- Primeiro passo: área grande de dropzone com borda azul-clara tracejada, ícone de upload e texto **Arraste sua planilha aqui**; explicação de compatibilidade com planilhas exportadas de **PDV, iFood, Saipos, Totvs ou planilha pessoal (.xlsx, .xls ou .csv)**; botão vermelho **Escolher Arquivo do Computador**.
- Rodapé de ajuda do modal com frase **Não tem uma planilha pronta? Baixe nosso modelo de exemplo para começar.** e botão **Baixar Modelo (.xlsx)**.
- Implementar leitura real dos três tipos via biblioteca compatível, validação de tamanho/formato, proteção contra planilha malformada e mensagens de erro; fazer download de um XLSX de modelo realmente utilizável.
- Passo 2: permitir mapear cabeçalhos de origem para campos internos (nome, categoria, descrição, preços, disponibilidade etc.), visualizar amostras e indicar campos obrigatórios sem perder o arquivo. Passo 3: exibir prévia e contagem de linhas válidas/inválidas, alertas de duplicados e opção de importar; confirmar gravação transacional e relatório de sucessos/falhas por linha.
- **As capturas mostram apenas o primeiro passo**, então a aparência dos passos 2 e 3 não está comprovada; implementar esses fluxos em conformidade com o conceito do wizard e marcar para auditoria quando receber prints correspondentes.

## 28.10 Comportamento, persistência e critérios de aceite

- `Novo Produto` abre o modal correto; `Categoria` e `Importar` abrem modais específicos; `X` e `Cancelar` fecham corretamente; `Cadastrar Produto` salva apenas com validação bem-sucedida.
- A alternância entre **Dados Principais**, **Variações** e **Promoção Programada** preserva formulário, mídias, tags e valores. Alternar Foto/Video não apaga uploads anteriores.
- Promoções atualizam preview e preço público segundo regras claras; economias e percentuais corretos em BRL, sem preços negativos.
- Foto e Reel utilizam upload verdadeiro, estado de erro, remoção e prévia. O conteúdo publicado é acessível aos clientes por QR Code do restaurante/mesa, sem expor mídias não publicadas.
- Depois de criar categoria ou produto, atualizar contadores/listagem e interface do cliente sem recarregar toda a aplicação. O texto **Cardápio atualizado em tempo real...** deve ser fundamentado em uma sincronização real, não apenas um selo decorativo.
- As cores finais do sistema devem permanecer vermelho, preto/grafite e branco; preservar os destaques verdes/laranja usados semanticamente em sucesso, promoções e avisos mostrados nas telas.
- Testes incluem largura desktop/mobile, modal com scroll, rodapé fixo, inputs, calculadora de desconto, tags customizadas, cadastro de categoria, importação real, upload de foto/vídeo, links, alternância de abas, estados vazios, falhas de rede e permissões.
- **MATRIZ DE EVIDÊNCIAS:** classificar cada item como **[VISÍVEL]**, **[INFERIDO PARA FUNCIONAR]** ou **[PEDIDO EXTRA: IA 360°]**. Não alegar que o vídeo/imagens comprovam o recurso de IA 360° ou estados de formulários não mostrados.
- Manter as seções 1–27 e adicionar esta seção como refinamento prioritário; novas capturas devem complementar, não substituir, os requisitos já registrados.


---

# 29. AUDITORIA VISUAL DETALHADA — BOTÕES PERSONALIZADOS (CINCO CAPTURAS)

> Esta seção complementa e detalha as seções 9 e 25.5. **Não apagar funcionalidades anteriores.** Usar como referência o menu lateral e as quatro telas de interface recebidas nesta etapa. Diferenciar cuidadosamente o que aparece nas imagens do que é necessário desenvolver para que as ações funcionem.

## 29.1 Menu lateral e composição da página

- Item do menu lateral **Botões Personalizados**, com ícone de brilhos/varinha à esquerda, texto branco em negrito e fundo vermelho vivo, arredondado, quando ativo.
- Página em fundo branco ou cinza muito claro, com espaçamento amplo, texto escuro/grafite e detalhes vermelhos.
- Título grande **Botões Personalizados**; subtítulo literal: **Configure as ações exibidas para o cliente na mesa (redes sociais, links, chamados extras).**
- Botão primário vermelho no canto superior direito: ícone **+** e rótulo **Novo Botão**. Clicar abre o modal de criação, sem navegar para outra página.
- Logo abaixo, banner horizontal de aviso com borda e fundo rosa/vermelho muito claro, ícone de smartphone em destaque, título **Frase de Boas-Vindas da Mesa** e descrição **Deseja editar o texto "Como podemos ajudar?" exibido acima dos botões na tela do cliente?**
- Na direita desse banner, botão contornado **Personalizar Frase da Mesa →**. Deve abrir um editor funcional para o texto de boas-vindas utilizado na tela do cliente, com prévia e persistência. **As capturas não mostram a tela/modal de destino desse botão**: não inventar sua aparência como se fosse observada; manter a navegação coerente, preferindo a configuração de mensagens já existente no projeto.
- Abaixo, lista vertical de linhas em painel grande de fundo branco, cantos arredondados, bordas suaves e separadores horizontais. Ao rolar a página, a lista continua; não considerar a última linha visível como fim do conteúdo.
- Botão flutuante do WhatsApp, verde, no canto inferior direito, tal como aparece em outras páginas; não confundir com os botões personalizáveis do cliente.

## 29.2 Listagem de botões e detalhes visuais

Cada linha deverá conter:

1. À esquerda, um ícone contextual em um quadrado cinza muito claro, com cantos arredondados e cor específica da função (livro/cardápio em verde, link externo em azul, sino em rosa/vermelho, cartão/conta em roxo, etc.).
2. Ao lado, o **rótulo definido para o botão** em negrito e um chip claro com tipo da ação em caixa alta.
3. Quando a ação for de link externo, exibir a URL em azul abaixo do nome, acompanhada de ícone de abrir link.
4. Quando exigir validação de presença na rede, exibir chip amarelo/laranja **Exige Wi-Fi**, com ícone de escudo.
5. À direita, dois ícones individuais de ação: **lápis para editar** e **lixeira para excluir**, ambos com área clicável adequada. A exclusão deve exigir confirmação antes de remover dados.
6. Boa adaptação no celular: rótulos, tipo, URL e chip de Wi-Fi não podem ficar ocultos atrás dos botões de ação; permitir quebra de linha.

Estados efetivamente visíveis nas capturas:

- Uma primeira linha **Ver cardápio** com ícone de livro, tipo **MENU** e sem chip **Exige Wi-Fi**.
- Outras linhas de exemplo com rótulos de teste **oi** / **OI** e diferentes tipos:
  - **EXTERNAL_LINK**, com URL de exemplo do Instagram, chip **Exige Wi-Fi**;
  - **CALL**, com chip **Exige Wi-Fi**;
  - **BILL_REQUEST**, com chip **Exige Wi-Fi**;
  - **MENU**, também com chip **Exige Wi-Fi**.
- Não assumir que os textos de teste “oi” ou “OI”, ou a URL de Instagram da captura, precisam estar pré-cadastrados no produto final. São **dados de exemplo** para comprovar que a listagem suporta vários botões do mesmo tipo e que a validação de Wi-Fi é configurável **por botão**, inclusive para ações de cardápio.
- **Não normalizar/restringir a apenas um botão por tipo** sem regra de negócio expressa: a imagem mostra tipos repetidos na mesma lista.
- Manter tipos legíveis por rótulos técnicos na área administrativa e rótulos amigáveis na experiência do cliente.

## 29.3 Modal **Novo Botão** — visual e campos

- Modal central branco com bordas arredondadas, sobreposição de fundo escurecido, largura aproximada de formulário pequeno em desktop e layout de tela confortável no mobile.
- Título **Novo Botão** e subtítulo literal **Personalize o texto, tipo de ação e ícone do botão.**
- Ícone **X** no canto superior direito para fechar.
- Campo obrigatório **Rótulo do Botão**, com placeholder **Ex: Siga no Instagram, WhatsApp, Wi-Fi**.
- Campo obrigatório **Tipo de Ação**, um seletor (`select`) que mostra a ação escolhida, com seta à direita.
- Com **Link Externo (Instagram, Site, WhatsApp)** selecionado, mostrar campo adicional **URL do Link**, cujo exemplo visível é `https://instagram.com/`. O campo deve validar `https://`/`http://` conforme política segura, bloquear esquemas inseguros e avisar quando URL for inválida.
- Abaixo, checkbox desmarcado na captura: **Exigir validação de presença no Wi-Fi para acionar este botão**. O valor inicial deve estar claramente visível, e a escolha deve persistir individualmente para cada botão.
- Rodapé com **Salvar Botão** (vermelho, primário) e **Cancelar** (botão claro contornado).
- Ao **Editar** uma linha, reutilizar o modal com os valores existentes, título/contexto de edição, opção de salvar alterações e validações. **A aparência exata do estado de edição não foi mostrada**, então reutilizar o padrão da criação e marcar esse estado para auditoria posterior.
- O subtítulo menciona “ícone”, porém **nenhum seletor explícito de ícone aparece na porção exibida do modal**. Implementar ícones coerentes automaticamente por tipo; oferecer seleção manual apenas se validada como requisito de outra captura, sem alegar que ela está visível aqui.

## 29.4 Lista aberta do campo **Tipo de Ação**

Reproduzir os quatro valores vistos no menu suspenso, na mesma ordem:

1. **Link Externo (Instagram, Site, WhatsApp)** — identificador persistido `EXTERNAL_LINK`.
2. **Chamado de Garçom Especial** — identificador `CALL`.
3. **Pedido de Conta** — identificador `BILL_REQUEST`.
4. **Abrir Cardápio** — identificador `MENU`.

Comportamento condicional exigido:

- `EXTERNAL_LINK`: exibir e validar **URL do Link**; ao ser acionado pelo cliente, abrir link real de forma segura.
- `CALL`: não exigir URL; ao ser acionado pelo cliente em uma mesa válida, criar chamado real no módulo **Chamados em Tempo Real**, com identificação da mesa, estabelecimento, tipo, hora, status e notificação sonora/visual configurada.
- `BILL_REQUEST`: não exigir URL; criar solicitação real de conta, com mesa, data/hora, status e integração aos cartões/indicadores do painel e Modo TV conforme permissões.
- `MENU`: não exigir URL; abrir o cardápio público do estabelecimento correto, associado ao contexto da mesa.
- Ao mudar o tipo selecionado, atualizar apenas os campos pertinentes sem apagar rótulo e escolha de Wi-Fi; manter o rascunho da URL quando o usuário alternar temporariamente entre tipos, mas não salvar URL desnecessária para tipos internos.
- O seletor deve funcionar com clique, teclado e toque. A ordem, o texto e os quatro tipos são **[VISÍVEL]**; a ação de backend correspondente é **[REQUISITO FUNCIONAL]**.

## 29.5 Validação de presença no Wi-Fi

- O checkbox não significa detectar SSID diretamente no navegador. Vincular a autorização à lógica do módulo **Redes Autorizadas (Wi-Fi)**, verificando **IP público de origem** no servidor e comparando com entradas ativas do estabelecimento, quando esse for o método configurado.
- Se um botão tiver `requiresWifi=true`, o cliente só poderá executar sua ação após a verificação. Exibir estado claro de impedimento e instrução de conectar-se à rede do local ou solicitar ajuda. Validar **também no backend**, não apenas na interface.
- Considerar IPv4/IPv6, NAT, proxies reversos confiáveis, CGNAT, VPN e situações de falsos positivos. Não confiar cegamente em cabeçalhos `X-Forwarded-For` fornecidos pelo usuário; somente proxies controlados podem definir IP confiável.
- Botões sem a exigência de Wi-Fi continuam acessíveis, conforme regras normais de estabelecimento/mesa.
- Aplicar a regra a `EXTERNAL_LINK`, `CALL`, `BILL_REQUEST` e `MENU`, pois a referência mostra até `MENU` com selo **Exige Wi-Fi**.
- Se o sistema estiver funcionando localmente sem infraestrutura pública de validação, sinalizar **modo demonstrativo** em vez de afirmar que a presença física foi provada.

## 29.6 Confirmação de sucesso ao cadastrar

- Após salvar um novo botão com sucesso, abrir modal compacto central com:
  - ícone grande de **check verde** dentro de quadrado verde muito claro;
  - título em negrito **Tudo certo!**;
  - texto **Novo botão criado com sucesso!**;
  - dois botões inferiores **Cancelar** (claro) e **Perfeito** (verde).
- O que se vê na captura comprova a mensagem e o visual, **não o comportamento exato de cada botão no modal**. Fazer **Perfeito** fechar a confirmação e manter a lista atualizada. Se **Cancelar** aparecer por fidelidade visual, ele também deve ter uma ação coerente e não desfazer silenciosamente um salvamento já confirmado; preferir fechar o aviso, deixando o registro persistido.
- Atualizar imediatamente a lista depois do cadastro sem recarregar a página. Exibir ícone, texto, tipo, link se aplicável e chip **Exige Wi-Fi** conforme os dados salvos.

## 29.7 Arquitetura, persistência e experiência do cliente

- Manter tabela/coleção de botões por estabelecimento com campos como `id`, `restaurantId`, `label`, `actionType`, `url` opcional, `requiresWifi`, `icon`, `sortOrder`, `isActive`, `createdAt`, `updatedAt`; validar tipos no backend e autorizar apenas administradores habilitados.
- Salvar os botões no banco com tratamento de erros, estados de loading e feedback real; não usar somente `localStorage` para dados compartilhados entre clientes.
- A seção **Botões Personalizados** é administrativa, mas as ações devem aparecer e funcionar de fato na **tela pública da mesa**, junto à frase de boas-vindas configurável.
- **CALL** e **BILL_REQUEST** precisam acionar o mesmo fluxo real de chamados/pedido de conta apresentado nas outras páginas, atualizando métricas e notificações de forma consistente e com proteção contra cliques duplicados.
- `MENU` deve abrir a área apropriada de cardápio, produtos e Stories/Reels. `EXTERNAL_LINK` deve tratar URLs externas com segurança (nova aba, quando aplicável, com proteção adequada).
- Testar persistência após atualização, acesso por outro dispositivo, edição, exclusão, duplicatas permitidas, URL inválida, Wi-Fi aprovado/negado, ausência de QR/mesa, estabelecimento inativo e perda de conexão.

## 29.8 Critérios de aceite e matriz de evidências desta etapa

- **[VISÍVEL]** menu lateral ativo, título/subtítulo, botão Novo Botão, banner da frase de boas-vindas, link de personalização, listagem com tipos/ícones/chips/URL, editar/excluir, modal Novo Botão, quatro valores de Tipo de Ação, checkbox de Wi-Fi e modal de sucesso.
- **[REQUISITO FUNCIONAL]** persistência, edição e exclusão reais, validação de URLs, funcionamento de chamado/conta/cardápio/link, sincronização para cliente, validação de IP no backend, confirmação antes de excluir e estados de erro.
- **[AINDA NÃO COMPROVADO NAS CAPTURAS]** tela de Personalizar Frase da Mesa, modal de edição aberto, confirmação de exclusão, conteúdo fora da área rolada, seletor manual de ícones, prévia específica dos botões para o cliente e possíveis estados adicionais. Não inventar tais telas como se tivessem sido observadas.
- Ao receber mais capturas, acrescentar detalhes à seção correspondente sem remover nada do histórico. Seguir as cores principais **vermelho, preto e branco** e os estados semânticos verde/laranja/rosa identificados.


---

# 30. AUDITORIA VISUAL DETALHADA — EQUIPE & PERMISSÕES (RBAC) (CINCO CAPTURAS)

> Este complemento é **obrigatório** e refina os requisitos da seção 10 sem substituí-los. Evidência: cinco capturas enviadas para a aba **Equipe & Permissões** — item do menu, página com funções e colaboradores, formulário de cadastro, modal de alerta de e-mail duplicado e modal de sucesso. Implementar fielmente a aparência observada e funções reais, sem confundir comportamentos previstos com demonstrações efetivamente capturadas.

## 30.1 Menu, cabeçalho e estrutura visual da página

- No menu lateral esquerdo, item com ícone de equipe/duas pessoas e texto **Equipe & Permissões**. Quando selecionado, fundo vermelho vivo, bordas arredondadas, ícone e texto brancos.
- Página com fundo cinza muito claro, cartões brancos de borda fina cinza-azulada, cantos arredondados, textos em azul-marinho quase preto, acentos vermelho/rosa, laranja, azul, verde e cinza conforme o significado do elemento.
- Título exato: **Equipe & Permissões (RBAC)**.
- Subtítulo exato: **Cadastre garçons e gerentes, defina funções e gerencie o PIN de 4 dígitos para identificação no salão.**
- Botão primário vermelho no topo direito: ícone **+** e **Convidar Membro**. Abre o formulário/modal **Novo Membro da Equipe** sem sair da tela.
- Logo abaixo, três cartões informativos alinhados horizontalmente no desktop e empilhados no celular, cada um com ícone, título com cor e descrição. Não transformar em simples bullets.
- Abaixo dos três cartões, painel/lista de membros existentes, com linhas separadas por divisórias horizontais; pode haver rolagem vertical para outros integrantes. Preservar navegação fluida e não deduzir que a última linha parcialmente exibida é a última cadastrada.
- Botão flutuante WhatsApp no canto inferior direito da página, como no padrão visual das outras abas; não deixar cobrir controles de colaboradores em telas pequenas.

## 30.2 Cartões de explicação dos três níveis de acesso

Apresentar em cartões distintos, com as seguintes palavras e semântica, tal como observado:

1. **OWNER (Proprietário)** — destaque vermelho, ícone de escudo. Texto: **Acesso total irrestrito: configurações fiscais, segurança, horários, faturamento e gestão da equipe.**
2. **MANAGER (Gerente)** — destaque laranja, ícone de usuário com gestão. Texto: **Acesso a chamados, edição do cardápio, gestão de mesas, regeneração de QR codes e relatórios.**
3. **STAFF (Atendente / Garçom)** — destaque azul, ícone de escudo/identificação. Texto: **Acesso focado no painel operacional e no Modo TV/Celular para atender e finalizar mesas com seu PIN.**

Estes cartões descrevem o RBAC visível; **as permissões devem ser executadas no servidor**, e não depender somente de menus ocultos. Permissões detalhadas podem ser refinadas pelo proprietário respeitando limites de segurança. Usar identificadores internos estáveis `OWNER`, `MANAGER` e `STAFF`.

## 30.3 Listagem de funcionários e controles por membro

Cada linha da lista deve conter, de forma equivalente à referência:

- Avatar quadrado claro com cantos arredondados e primeira letra do nome; nome em negrito e e-mail acompanhado de ícone de envelope. Tratar nomes e e-mails mostrados nas capturas como **dados exemplificativos**, não como contas a criar no projeto.
- Chip **OWNER** rosa/vermelho ao lado do nome quando aplicável. A captura mostra este chip em algumas contas do tipo proprietário; evitar inventar regras adicionais para sua ausência em outras linhas.
- Controle retangular de PIN com ícone de cadeado e rótulo **PIN Salão: ••••**, mantendo PIN oculto inicialmente. Ícone de olho para revelar/ocultar mediante autorização adequada.
- Botão contornado **Trocar PIN**, com ícone de chave laranja.
- Botão contornado **Trocar Senha**, com ícone de cadeado rosa/vermelho.
- Seleção de função diretamente na linha, com valores amigáveis como **Owner (Proprietário)**, **Manager (Gerente)** e **Staff (Atendente)**, além de seta dropdown. A alteração deve atualizar permissões e ser salva de verdade após autorização/confirmação.
- Ícone de **lixeira** para remover o membro. A tela mostra a lixeira em algumas posições diferentes devido à densidade/possível quebra de linha; implementar um layout responsivo coerente em vez de reproduzir eventual desalinhamento acidental.
- Ao reduzir a tela, empilhar ações em linhas claras, preservar acesso a todos os botões e evitar overflow horizontal.

Operações exigidas para o sistema funcional:

- **Trocar PIN**: formulário/modal para definir ou gerar novo PIN de quatro dígitos, verificar autorização, invalidar o anterior e avisar o usuário do resultado.
- **Trocar Senha**: fluxo para gerar ou definir nova senha de login com autorização adequada; nunca revelar senha atual, nunca incluir segredo em logs e preferir redefinição segura com confirmação.
- **Visualizar PIN**: só permitir a responsáveis autorizados e apenas se for realmente necessário; por padrão apresentar `••••`. Como uma arquitetura segura não armazena PIN recuperável, a opção de exibir PIN existente só pode ser implementada caso seja adotada arquitetura segura de recuperação explícita; **preferir botão para redefinição de PIN**, explicando limitação, a fingir revelar um hash. A existência do ícone de olho é **[VISÍVEL]**, mas os requisitos de armazenamento seguro têm prioridade.
- **Alterar papel**: verificação server-side de permissões e de políticas (somente OWNER gerencia outros OWNERS, se essa for a política definida); proteger última conta proprietária, alterações na própria conta e remoção acidental do último OWNER. Não permitir que MANAGER conceda privilégio OWNER por alteração indevida no cliente.
- **Excluir**: exibir confirmação e revogar sessões e permissões, preservando registros de auditoria/atendimentos associados ao funcionário para integridade histórica, em vez de apagar transações antigas.

## 30.4 Modal de cadastro — **Novo Membro da Equipe**

A captura mostra um modal vertical centralizado, com fundo branco, cantos grandes arredondados, ícone **X** no canto superior direito, formulário rolável internamente e ações inferiores. Reproduzir estes campos e textos:

- Cabeçalho **Novo Membro da Equipe**.
- Subtítulo **Cadastre um funcionário, defina o e-mail, a senha de login, o papel e o PIN de 4 dígitos.**
- **Nome Completo**: campo texto obrigatório, com nome digitado demonstrativo na captura.
- **E-mail de Acesso**: campo e-mail obrigatório, validação de formato e unicidade por equipe/estabelecimento (de acordo com arquitetura de usuários globais e vínculos por tenant).
- Bloco de segurança **Senha de Acesso de Login (Mín. 6 caracteres)**, com ícone de cadeado rosa, campo de senha, botão de mostrar/ocultar e ação textual **Gerar Senha** com ícone de brilhos. A captura apresenta uma senha gerada visível no campo; tratar como dado de demonstração, **não reutilizar esse segredo**.
- Ajuda sob senha: **O colaborador usará este e-mail e senha para fazer login no painel do restaurante.**
- **Função / Nível de Acesso**: select obrigatório, com opção demonstrada **Staff (Atendimento de Mesas)**; suportar também `MANAGER` e `OWNER` conforme políticas de permissão.
- Bloco de segurança **PIN de Acesso do Salão (4 Dígitos)**, ícone de chave rosa, campo de quatro caracteres numéricos e ação **Gerar Aleatório** com ícone de brilhos. O código de quatro dígitos exibido é amostra e não deve virar PIN padrão.
- Ajuda sob PIN: **O garçom digitará este PIN no celular ou na TV para assumir atendimentos das mesas rapidamente.**
- Rodapé: botão principal **Adicionar à Equipe** em vermelho e secundário **Cancelar** em claro/contornado. Ícone **X** também fecha.
- A modal deve permitir rolagem do formulário sem esconder o rodapé, ser completamente navegável por teclado e usar `label`s acessíveis. Em mobile, ajustar altura sem cortar PIN, mensagem de ajuda ou ações.

## 30.5 Validação e comportamento do cadastro

1. Abrir **Convidar Membro** -> mostrar o modal e permitir preencher nome, e-mail, senha, função e PIN.
2. Permitir alternar visibilidade da **nova senha digitada**. O comando **Gerar Senha** deve produzir senha aleatória criptograficamente segura, adequada à política de autenticação; manter a exigência mínima de seis caracteres indicada na interface, mas aceitar política mais forte se explicitamente comunicada. Nunca usar `Math.random()` para segredos.
3. PIN: aceitar **exatamente quatro dígitos numéricos**, inclusive zero inicial; o botão **Gerar Aleatório** cria um PIN de quatro dígitos, com checagem de conflito e bloqueio de PINs triviais conforme a política definida. Nunca converter PIN em número, para não perder zeros iniciais.
4. O botão **Adicionar à Equipe** valida campos obrigatórios, formatos, força mínima, permissões do operador e duplicidade antes de salvar. Fazer verificação definitiva de unicidade no servidor/banco, protegendo contra criação concorrente.
5. Ao salvar, persistir vínculo do funcionário com o estabelecimento e seu papel RBAC; iniciar fluxo de login e PIN sem depender de estado apenas local.
6. Atualizar imediatamente a listagem da equipe após sucesso; exibir estado de processamento, tratar erros de rede e prevenir envios duplos.
7. Documentar como as credenciais são entregues com segurança ao funcionário. **Não enviar senhas em texto puro em logs, notificações inseguras ou e-mails sem proteção.** É aceitável adaptar o cadastro para um convite seguro de definição de senha, desde que o fluxo pedido seja funcional e devidamente explicado.

## 30.6 Modal vermelho de alerta — e-mail duplicado

Em uma captura aparece modal branco compacto com ícone de **exclamação vermelha** dentro de quadrado vermelho muito claro, título em negrito **Atenção** e mensagem exata:

**Já existe um membro cadastrado com este e-mail na sua equipe.**

- Rodapé com dois botões: **Cancelar** (claro/contornado) e **Entendido** (vermelho).
- Exibir somente para duplicidade comprovada no escopo da equipe; não confundir com erro de sintaxe do e-mail.
- Após **Entendido** (ou fechar), permitir corrigir o endereço sem perder nome, papel, PIN e outros campos preenchidos, sempre que possível; evitar criar outra conta para o mesmo e-mail por cliques repetidos.
- Não incluir nos arquivos de demonstração os e-mails pessoais digitados nas imagens.

## 30.7 Modal verde de confirmação — membro criado

Em outra captura aparece modal de sucesso branco compacto com ícone de **check verde** dentro de quadrado verde muito claro, título **Tudo certo!** e mensagem exata:

**Membro cadastrado com sucesso! As credenciais de login e PIN já estão ativas.**

- Botões **Cancelar** (claro) e **Perfeito** (verde). **Perfeito** fecha o aviso, mantendo o membro salvo e visível na lista.
- Como o comportamento do botão **Cancelar** após salvar não foi demonstrado, tratá-lo como fechar confirmação sem desfazer silenciosamente o cadastro; deixar essa decisão explícita na implementação.
- Somente mostrar mensagem de sucesso quando o servidor confirmar que usuário, associação à equipe e permissões foram persistidos corretamente. Não usar alerta de sucesso fictício.

## 30.8 Segurança obrigatória e integração operacional

- RBAC aplicado no backend a cada endpoint e evento realtime, com verificação de identidade, permissão, estabelecimento (`restaurantId`/tenant) e, quando cabível, mesa. Não basta desabilitar dropdowns no frontend.
- Senhas de login armazenadas como hashes resistentes a ataques offline (Argon2id ou equivalente robusto) com salts adequados; PIN de quatro dígitos também deve ser protegido com hash apropriado mais limitações rigorosas de tentativa e proteção contra força bruta (4 dígitos têm apenas 10 mil combinações). Nunca gravar PIN ou senha em texto puro no banco.
- Exigir rate limiting, cooldown após erros, trilhas de auditoria em alterações de função, PIN, senha e exclusão, renovação/revogação de sessões e separação entre login administrativo e autenticação rápida do salão.
- STAFF só poderá assumir e finalizar atendimento via PIN nas operações autorizadas, e o servidor deve identificar qual membro realizou cada ação (para métricas, histórico de chamados e trilha de auditoria).
- MANAGER poderá operar os módulos descritos no cartão, mas ações de alto privilégio como faturamento, segurança e concessão de OWNER exigem OWNER.
- OWNER terá acesso à administração permitida pelo sistema, respeitando proteção da última conta proprietária e outras regras de segurança.
- Se o modo TV expuser dados em tela pública, não exibir senhas, e-mails pessoais completos ou PINs. Segurança das credenciais tem prioridade sobre fidelidade literal quando houver conflito.
- Garantir que alterações de perfil ou exclusão alterem imediatamente as permissões de futuras ações e de conexões em tempo real, invalidando tokens/sessões conforme o caso.

## 30.9 Matriz de conferência desta etapa

**[COMPROVADO PELAS CAPTURAS]** item lateral selecionado, título/subtítulo, três cartões RBAC, botão Convidar Membro, lista com avatar/nome/e-mail/chip de proprietário, PIN mascarado com olho, ações Trocar PIN/Trocar Senha, dropdown de função, lixeira, modal Novo Membro, campo de nome, e-mail, senha com gerador e visibilidade, papel, PIN de quatro dígitos com gerador, botões Adicionar à Equipe/Cancelar, modal Atenção para e-mail duplicado e modal Tudo certo para inclusão bem-sucedida.

**[REQUISITOS DE FUNCIONAMENTO A IMPLEMENTAR]** validações, salvamento real, rate limiting, hash, RBAC por tenant, atualização da equipe, alterações de papel, PIN e senha, exclusão com confirmação, trilhas de auditoria, proteção da última conta OWNER e conexão com atendimento por PIN.

**[NÃO MOSTRADO NAS CAPTURAS]** formulário de Trocar PIN aberto, fluxo de Trocar Senha aberto, confirmação de exclusão, lista completa após rolagem, estados do dropdown de alteração de função e respostas ao botão de revelar PIN. Construir estes fluxos de forma coerente, mas não afirmar que seus designs exatos foram extraídos das imagens.

**Critérios de aceite:** os três níveis RBAC aparecem e são respeitados; um OWNER consegue convidar um STAFF com e-mail único e PIN de quatro dígitos; e-mail duplicado apresenta a mensagem correta sem novo registro; novo membro aparece imediatamente na lista após sucesso; senhas permanecem protegidas; alteração de função afeta permissões reais; STAFF consegue autenticar-se no fluxo de salão sem obter poderes administrativos; telas de desktop e mobile preservam todos os campos e botões.

---

# 31. AUDITORIA VISUAL DETALHADA — RELATÓRIOS & MÉTRICAS / RELATÓRIOS & DESEMPENHO (DUAS CAPTURAS)

> **Fonte desta auditoria:** duas imagens enviadas pelo usuário: o item ativo **Relatórios & Métricas** no menu lateral e uma captura da página **Relatórios & Desempenho**. Esta seção complementa as seções 11 e 25.7, **sem substituir nem apagar nenhuma das seções anteriores**. O conteúdo abaixo distingue elementos visíveis da implementação técnica necessária. Não presumir o que existe abaixo da área visível, que termina após os dois painéis de gráficos.

## 31.1 Identidade da aba e composição exata

- Item de menu à esquerda: **Relatórios & Métricas**, ícone de gráfico de barras ascendentes à esquerda e, no estado selecionado, fundo vermelho vivo, texto e ícone brancos e bordas arredondadas, tal como os demais itens ativos da navegação.
- Página interna identificada com o título grande **Relatórios & Desempenho**; **o nome da aba lateral não é igual ao título da página** e ambos devem ser preservados.
- Subtítulo: **Acompanhe o tempo de resposta da equipe e volume de chamados por mesa.**
- Interface em fundo cinza quase branco, cabeçalho de texto azul-marinho/preto, cartões brancos com borda cinza-azulada muito clara, cantos arredondados e sombras discretas; rosa/vermelho para destaques, azul para métricas temporais e localização, verde para resoluções, roxo para contas e verde/laranja em estados de disponibilidade.
- O cabeçalho divide-se em duas zonas em telas amplas: título/subtítulo à esquerda; ações/filtros à direita. Preservar alinhamento e hierarquia sem sobreposição em telas menores.
- Botão flutuante do WhatsApp, verde, localizado no canto inferior direito e posicionado sem encobrir métricas ou ações no mobile. Deve ter função/URL configurada, nunca ser um elemento decorativo sem ação.

## 31.2 Exportação de planilha e bloqueio por plano

- Acima do seletor de períodos, aparece o controle **Exportar Planilha**, com ícone de cadeado e chip **BUSINESS** em cor azul/roxo, visualmente desabilitado/restrito na captura.
- Reproduzir a indicação de recurso exclusivo do plano Business. Caso a assinatura atual não inclua exportação, mostrar estado bloqueado e, se o usuário interagir, informar claramente a exigência do plano, com acesso coerente à página **Planos & Assinatura**. **Não gerar um arquivo fictício nem afirmar que houve exportação.**
- Se o plano autorizar a operação, disponibilizar exportação real de registros do estabelecimento correspondente ao período selecionado (CSV ou XLSX, com formatação apropriada). O tipo preciso do arquivo exportado e o fluxo de desbloqueio **não foram demonstrados**; estabelecer a implementação do produto e sinalizar esta decisão como técnica, e não visualmente comprovada.
- Autorizar o acesso no backend e proteger os dados por estabelecimento/usuário. Não confiar apenas em botão esmaecido na interface para restringir o recurso.

## 31.3 Filtro de período: cinco escolhas e estado selecionado

- Mostrar seletor horizontal compacto, estilo segmentado, em painel branco de bordas arredondadas.
- Opções da esquerda para a direita, com textos exatamente como na captura:
  1. **Hoje** — selecionado na imagem, com fundo vermelho forte, cantos arredondados e texto branco;
  2. **7 dias** — opção neutra;
  3. **30 dias** — opção neutra;
  4. **12 meses** — opção neutra;
  5. **Completo** — opção neutra com ícone de **cadeado**.
- Ao selecionar **Hoje**, **7 dias**, **30 dias** ou **12 meses**, recarregar/recalcular de verdade **todos os indicadores e gráficos em conjunto**. Não trocar somente o destaque visual do botão.
- Para **Completo**, respeitar a restrição de plano identificada pelo cadeado na captura: indicar claramente a limitação para quem não tem o nível exigido; disponibilizar histórico completo caso habilitado para aquele perfil/plano. **A captura não estabelece exatamente qual plano desbloqueia Completo**, portanto não inventar que é obrigatoriamente o Business.
- Interpretar intervalos de acordo com fuso horário configurado no estabelecimento, incluindo limites exatos de início/fim para hoje, últimos sete dias, trinta dias e doze meses. Definir no projeto se “últimos N dias” inclui o dia atual, usar consistentemente e documentar.
- Ao carregar ou alterar filtros, mostrar estado de atualização acessível. Evitar misturar métricas de períodos diferentes; em erros de consulta, exibir falha e opção funcional de tentar novamente, sem substituir silenciosamente por números fictícios.

## 31.4 Os seis cartões de resumo (ordem e conteúdo obrigatórios)

Exibir **seis cartões** brancos, com borda clara e cantos arredondados, formando uma fileira no desktop quando houver largura suficiente e reorganizando-se em grade responsiva no tablet/celular. Cada cartão traz um ícone colorido no topo, indicador em destaque e rótulo menor em duas ou mais linhas quando necessário. Ordem da captura:

1. **Aguardando Atendimento** — ícone de sino **laranja**, valor exemplar **0**, rótulo **Aguardando Atendimento**. Representa chamados pendentes/aguardando ação no período ou situação atual conforme definição operacional documentada.
2. **Tempo Médio de Resposta** — ícone de relógio **azul**, valor exemplar **0s**, rótulo **Tempo Médio de Resposta**. Calcular a partir da diferença entre criação do chamado e primeiro atendimento efetivo para registros elegíveis. Não apresentar ausência de registros como se fossem respostas instantâneas; se mostrar `0s` por fidelidade à referência, ter estado vazio/ajuda claro e acessível.
3. **Atendimentos Concluídos** — ícone de check em círculo **verde**, valor exemplar **0**, rótulo **Atendimentos Concluídos**. Contar chamados concluídos conforme status e período selecionado.
4. **Pedidos de Conta** — ícone de cartão **roxo**, valor exemplar **0**, rótulo **Pedidos de Conta**. Contar eventos de solicitação de conta sem confundi-los com pagamentos concluídos.
5. **Mesas Ativas** — ícone de quatro quadrados **azul-acinzentados**, valor exemplar **2/2**, rótulo **Mesas Ativas**. Exibir fração `mesas ativas / mesas cadastradas`, com dados reais provenientes da gestão de mesas; o `2/2` observado **é dado de exemplo da captura**, não valor fixo a ser codificado.
6. **Produtos no Cardápio** — ícone de talheres **vermelho/rosa**, valor exemplar **0**, rótulo **Produtos no Cardápio**, mais legenda laranja **Todos disponíveis**. A legenda deve refletir corretamente o estado real do estoque/disponibilidade; se houver produtos indisponíveis, alterar a mensagem e/ou o estado, sem manter "Todos disponíveis" de forma enganosa. O zero da captura é um estado de dados de exemplo.

**Regras comuns:** usar valores reais do estabelecimento, manter a contagem coerente com as páginas de Chamados em Tempo Real, Mesas & QR Codes e Cardápio Digital, respeitar filtros temporais onde pertinente, e não contabilizar eventos de outra unidade ou restaurante. Para "Mesas Ativas" e "Produtos no Cardápio", distinguir claramente métricas de estoque/estado atual de métricas históricas do período selecionado; não aplicar filtro cronológico inadequado à existência atual de mesas e produtos.

## 31.5 Painel "Chamados por Tipo de Ação"

- Primeira caixa grande na metade esquerda do conteúdo inferior (e acima do segundo painel quando empilhado no mobile); card branco com contorno/sombra discretos e cantos arredondados.
- Cabeçalho com ícone de pequenas barras **vermelho/rosa** e título **Chamados por Tipo de Ação**.
- Contém duas linhas específicas, nessa ordem:
  - **Chamar Garçom** — pequeno ícone de sino rosa, rótulo à esquerda, contagem exemplar **0** alinhada à direita; abaixo, trilho de barra horizontal arredondada com ênfase rosa forte;
  - **Pedir a Conta** — pequeno ícone roxo de cartão, rótulo à esquerda, contagem exemplar **0** alinhada à direita; abaixo, trilho horizontal cinza muito claro, com preenchimento proporcional se houver registros.
- Atualizar contagens usando os eventos reais do módulo de chamados e dos botões `CALL`/`BILL_REQUEST` correspondentes. Os indicadores devem responder imediatamente à alteração de período.
- **Atenção à integridade dos gráficos:** a captura exibe a trilha do primeiro tipo inteiramente rosa embora a contagem mostrada seja `0`. Interpretar isto como aparência de referência, **não como licença para desenhar 100% de uso quando o dado é zero**. Na implementação, manter destaque de cor sem representar contagem nula como volume positivo. Se ambas as séries forem zero, mostrar trilhos/base visual e marcação de `0`, ou estado vazio informativo, de maneira estatisticamente correta.
- Dar nomes e números acessíveis aos gráficos para leitores de tela; não depender apenas de cor para comparação.

## 31.6 Painel "Movimento por Mesa"

- Segunda caixa grande na metade direita, alinhada em altura e estilo ao painel de tipos de ação.
- Cabeçalho com ícone de grade de quatro quadrados em **azul** e título **Movimento por Mesa**.
- Estado vazio exibido na captura, centralizado na área útil, com frase literal **Nenhum chamado registrado no período.** em azul acinzentado claro.
- Se houver dados, substituir esse estado vazio por uma visualização real e clara dos chamados por mesa: nome/identificador da mesa, quantidade de eventos e representação visual proporcional. A captura **não mostra** como o gráfico fica com dados; portanto esta forma preenchida é requisito funcional a especificar, e não cópia confirmada da aparência.
- Usar os mesmos filtros, permissões e período dos cartões e do painel "Chamados por Tipo de Ação". Mesas removidas ou renomeadas devem ser tratadas adequadamente nos registros históricos, com referências estáveis para não corromper relatórios.

## 31.7 Modelo de eventos, métricas, consistência e desempenho

- Persistir, no mínimo, para cada chamado: identificador, restaurante, mesa, tipo de ação, data/hora de criação, primeiro atendimento, conclusão, estado e colaborador responsável quando aplicável; guardar histórico/auditoria de mudanças de status.
- Índices/consultas por restaurante, período, tipo, mesa e status. O dashboard pode usar agregações no backend ou endpoints específicos de analytics, evitando carregar todos os chamados históricos no navegador para somá-los.
- Estabelecer fórmulas documentadas para:
  - `aguardandoAtendimento`: chamados ainda pendentes;
  - `tempoMedioResposta`: média sobre atendimentos com primeiro atendimento registrado (em segundos ou unidade formatada); evitar registros não respondidos no denominador;
  - `atendimentosConcluidos`: registros concluídos no período conforme regra de data de fechamento;
  - `pedidosConta`: solicitações de conta criadas no período;
  - `mesasAtivas`: fração de mesas habilitadas atualmente entre mesas cadastradas;
  - `produtosCardapio`: total de produtos atuais elegíveis para publicação e estado de disponibilidade;
  - `chamadosPorTipo`: quantidade de chamados por categoria no intervalo;
  - `movimentoPorMesa`: contagem agrupada por identificador estável de mesa.
- Documentar distinção entre dados **instantâneos** (mesas ativas, produtos, chamados atualmente pendentes) e dados **históricos** (respostas, conclusões, chamadas por período). O filtro temporal nunca deve produzir números internamente contraditórios.
- Se filtros comportarem atualização em tempo real, atualizar de modo eficiente e consistente com o painel de Chamados, sem criar eventos duplicados ou consultas excessivas; estados de carregamento, ausência de registros e erro devem ser explícitos.
- Verificar permissões de acesso ao painel e de exportação. Restringir no backend por `restaurantId` e função RBAC, e jamais expor dados de outros estabelecimentos.

## 31.8 Responsividade, interações e aceitação visual

- A barra de filtros deve ser utilizável em telas pequenas sem cortar opções; permitir quebra controlada de linha ou rolagem horizontal acessível, mantendo **Hoje**, **7 dias**, **30 dias**, **12 meses** e **Completo** alcançáveis.
- Os seis cartões devem manter ícones, números e rótulos legíveis, sem alturas artificiais que cortem texto; os dois painéis de gráficos se empilham no celular.
- O visual usa branco, preto/azul-marinho e vermelho como cores principais, com cores semânticas para indicadores, tal como o conjunto das demais abas.
- Navegação pelo teclado, foco visível, contraste, descrições textuais dos gráficos, estados `aria-pressed`/equivalente nos filtros e indicação explícita de recursos bloqueados.
- **Casos obrigatórios para testar:** filtro Hoje selecionado no primeiro acesso; troca para 7 dias, 30 dias, 12 meses; tentativa de Completo bloqueado; exportação bloqueada em plano sem acesso e funcional em plano autorizado; todos os seis cartões; período sem chamados; criação de chamada no painel da mesa; pedido de conta; conclusão/atendimento; inclusão/remoção/desativação de mesa; cadastro/indisponibilidade de produto; consultas sem dados; dados de dois restaurantes separados; carga lenta e erro de conexão; exibição em desktop e celular.

## 31.9 Matriz de fidelidade: comprovado x implementação inferida

**[VISÍVEL NAS CAPTURAS]** menu lateral **Relatórios & Métricas** ativo; título **Relatórios & Desempenho** e subtítulo; **Exportar Planilha** com selo **BUSINESS** e cadeado; filtros **Hoje**, **7 dias**, **30 dias**, **12 meses**, **Completo** com cadeado; **Hoje** selecionado; seis cartões com valores demonstrativos `0`, `0s`, `0`, `0`, `2/2` e `0`, além de **Todos disponíveis**; gráficos **Chamados por Tipo de Ação** (Chamar Garçom, Pedir a Conta) e **Movimento por Mesa** com o texto **Nenhum chamado registrado no período.**; ícone flutuante WhatsApp.

**[REQUISITO FUNCIONAL PARA IMPLEMENTAR]** filtros com consultas verdadeiras, fórmulas, dados em tempo real, gráficos ao receber dados, segregação por estabelecimento, exportação efetiva quando autorizada, mensagens de plano e atualização responsiva/acessível.

**[NÃO DEMONSTRADO NAS CAPTURAS]** conteúdo abaixo do ponto de rolagem, gráficos com dados positivos, janela aberta de exportação, destino do clique em recurso bloqueado, qual plano desbloqueia "Completo", visual após escolher outro intervalo, possíveis relatórios extras em subtelas. Não fabricar essas telas como se tivessem sido vistas; complementar quando imagens novas as revelarem.

---

# 32. AUDITORIA VISUAL DETALHADA — CONFIGURAÇÕES DO ESTABELECIMENTO (CAPTURA LONGA + VÍDEO)

> **Referência desta atualização:** imagem do item ativo no menu e captura vertical extensa da página inteira **Configurações**, confrontadas com quadros legíveis do vídeo de referência. Esta seção amplia as seções 13 e 25.8; não substitua nem apague requisitos anteriores. A captura original foi comprimida verticalmente: quando um número ou texto específico não puder ser confirmado com segurança, preservar o **campo e a função**, mas marcar seu valor exato como **[PENDENTE DE CONFERÊNCIA]**. Não transportar nome de cliente, e-mail, CPF/CNPJ, telefone, senha, PIN, coordenadas ou tokens de teste vistos nas referências para a versão entregue.

## 32.1 Navegação e composição geral da página

- Item **Configurações** selecionado no menu lateral, com ícone de engrenagem branco, texto branco e fundo vermelho forte com cantos arredondados.
- Página **Configurações do Estabelecimento** com subtítulo explicando personalização de marca, modos de segurança, regras de Wi-Fi e horários de funcionamento.
- A página é **uma rolagem longa e contínua**, em cartões grandes com cantos arredondados, fundo branco e áreas externas cinza muito claro; não a reduzir a uma tela de nome/telefone ou distribuir os blocos em páginas desconexas.
- Botão vermelho **Salvar Alterações** perto do cabeçalho e botão vermelho **Salvar Todas as Configurações** após os horários. Devem executar salvamento efetivo da configuração editada, com estado carregando/resultado e tratamento de conflito/erro. Mudanças relacionadas à senha possuem fluxo separado e exigem validação própria.
- Na região superior aparecem os avisos compartilhados com o painel: **confirmação de e-mail** (ações **Reenviar E-mail** e **Corrigir E-mail**) e **período de teste gratuito** com dias restantes, barra de progresso e **Escolher plano**. Esses componentes são globais do painel, não exclusivos das configurações. A quantidade de dias da referência é um dado de demonstração, não valor fixo.
- Abaixo do título existe uma faixa de **atalhos internos com pequenos ícones**, incluindo os blocos de identidade, mensagem da mesa, monitor/TV, segurança, mapa/GPS, horários e senha/acesso. Esses atalhos devem navegar ao bloco correspondente na mesma página, inclusive por teclado, com rolagem suave opcional e compensação de cabeçalho fixo. A captura compactada não permite transcrever com certeza todos os títulos desses atalhos: os rótulos duvidosos permanecem [PENDENTE DE CONFERÊNCIA].
- Preservar o botão flutuante verde de WhatsApp no rodapé direito. No layout geral podem permanecer os atalhos laterais **Modo TV**, **Abrir Mesa (Cliente)** e os controles de som/notificações, que pertencem ao painel global.

## 32.2 Cartão **Identidade Visual, Capa & Logotipo**

**Primeira linha:**
- Campo **Nome do Estabelecimento** (texto editável).
- Área **Cor Primária dos Botões e Destaques** com seletor de cor nativo/visual, entrada hexadecimal e botão de amostra **Preview do Botão**, que muda de cor em tempo real conforme a escolha.
- Validar cor HEX e contraste para que o texto dos botões permaneça legível. Salvar a cor em dados do restaurante e propagar para a tela do cliente e demais componentes de marca; não modificar automaticamente a paleta administrativa global se não for a intenção.

**Dados cadastrais e faturamento:**
- Subtítulo **Dados Cadastrais & Faturamento da Empresa** e descrição de uso no faturamento da assinatura, cobranças e recibos fiscais.
- Campos em duas colunas: **Razão Social / Nome do Responsável**, **CPF ou CNPJ (Obrigatório para Gateway)**, **E-mail de Contato & Cobrança**, **WhatsApp / Telefone Principal**.
- Validar formatos brasileiros de CPF/CNPJ, e-mail e telefone. Não exibir identificadores privados em mensagens públicas. Dados de cobrança exigem autorização e cuidado com LGPD.
- A referência menciona um gateway de pagamentos específico no texto de ajuda; essa menção não prova que haja integração técnica operacional. A integração de cobrança deve ser modular/configurável e não exigir chaves pagas para rodar o restante do painel em desenvolvimento local.

**Imagem de Fundo do Topo (Capa da Mesa):**
- Descrição: banner panorâmico que aparece no topo da tela do cliente após escanear o QR Code.
- Área grande de pré-visualização de capa, com placeholder escuro se vazia; quando carregada, mostrar a fotografia, um degradê legível, rótulo de prévia e nome do estabelecimento.
- Ação **Remover Capa** quando houver capa cadastrada.
- Campo **Cole o link direto da imagem de capa (ex: https://...)** e botão **Upload da Foto**. Aceitar arquivo válido (com restrição de tamanho, MIME, dimensões e tratamento de falhas) ou URL segura. Evitar download/SSR F de URLs arbitrárias pelo backend.
- Opções rápidas de imagem **Restaurante Moderno**, **Bistrô & Café**, **Bar & Choperia**, **Hamburgueria Artesanal** e **Pizzaria Forno a Lenha**. Essas opções devem aplicar mídia utilizável e com direitos de uso verificados, não apontar para caminhos inexistentes. Deixar claro se são ilustrações de demonstração.

**Logotipo do Estabelecimento (Acima do Título):**
- Área com miniatura de logotipo (fallback em bloco colorido com inicial), campo **Cole o link da logo (ex: https://...)** e botão **Upload Logo**.
- Texto indica que o ícone/emblema aparece acima do nome do restaurante na tela da mesa.
- Presets vistos: **Gastronomia**, **Burger & Grill**, **Cafeteria**, **Pizzaria**; ao escolher, aplicar ícone/imagem apropriado e atualizar a prévia imediatamente.
- Ao salvar, propagar nome, cor, capa e logotipo para o cliente, incluindo a prévia da mesa, sem invalidar um link QR já existente.

## 32.3 **Mensagem de Boas-Vindas da Mesa (QR Code)**

- Cartão com ícone de smartphone, título literal **Mensagem de Boas-Vindas da Mesa (QR Code)**, chip **VISÃO DO CLIENTE** e botão **Restaurar Padrão**.
- Subtítulo: personalizar título e descrição que aparecem no smartphone quando o cliente escaneia o QR Code.
- Campo **Título Principal de Boas-Vindas**: texto curto (na referência o limite de caracteres aparece como **60**; aplicar contador e limite real).
- Campo **Mensagem de Apoio / Subtítulo**: texto de instruções (contador visível até **180** caracteres), com quebra de linha e orientação curta.
- Mensagem informativa destacada: textos salvos aparecem em tempo real para clientes em mesas ao acessarem pelo QR Code.
- Ao lado, um **mockup de smartphone** com título **Prévia na Tela do Cliente**, chip verde **EM TEMPO REAL**, logo do restaurante, nome, identificador da mesa (ex.: **Mesa 01**), título e subtítulo cadastrados, e botão real/representativo de ação **Chamar Garçom**.
- Alterações de rascunho atualizam a prévia instantaneamente; **salvar** persiste no servidor e propaga aos clientes. **Restaurar Padrão** restaura textos padrão de forma clara, com confirmação quando necessário.
- O atalho **Personalizar Frase da Mesa** da aba Botões Personalizados deve direcionar para **este cartão**, não para uma tela inventada.
- Não copiar nomes de restaurante ou frases modificadas de teste como padrão universal.

## 32.4 **Regras de Chamados & Retorno Automático da Mesa**

- Cartão com título **Regras de Chamados & Retorno Automático da Mesa** e descrição sobre intervalo de segurança para novo chamado após atendimento e conclusão.
- Campo numérico **Tempo de retorno após atendimento / intervalo para novo chamado (segundos)**.
- Valor editável e botões rápidos demonstrados no vídeo/captura: **10s (Padrão)**, **15s**, **30s**, **60s**; a interface pode exibir valor manual diferente dos presets. Não fixar o valor de teste.
- Texto informativo explica que, ao atender e concluir o chamado, a mesa volta automaticamente ao estado pronto para novos pedidos após o tempo configurado.
- Implementar máquina de estados de chamado: `pending`, `in_progress`, `completed`, `ready_again` (ou estados equivalentes) com carimbo de tempo, regras de idempotência e proteção contra chamados duplicados durante intervalo.
- Não confundir **retorno automático da mesa** com exclusão de histórico ou fechamento do atendimento; preservar auditoria.
- Mudança de configuração deve aplicar-se de forma previsível a novos eventos, com documentação sobre eventos em andamento.

## 32.5 **Modo de Validação de Presença** — quatro cartões de escolha

Mostrar **quatro opções como cartões radio**, com borda vermelha/rosa quando a opção estiver selecionada, texto explicativo curto e seleção mutuamente exclusiva:

1. **Básico (Padrão - Sem verificação de IP)** — acesso por QR Code/link sem validação da rede, sujeito aos demais controles de segurança.
2. **Rede Wi-Fi (Alta Segurança)** — valida presença por correspondência com os **IPs públicos ativos** cadastrados em **Redes Autorizadas (Wi-Fi)**.
3. **Wi-Fi OU Geolocalização (Fallback)** — aceita verificação por rede autorizada **ou** localização permitida dentro do raio configurado. Este é o modo destacado na captura; ao reproduzir o estado de exemplo, mostrar a seleção claramente.
4. **Estrito (Strict)** — exige validações simultâneas de rede e localização/sessão conforme política configurada; documentar precisamente o algoritmo e o tratamento quando a localização é negada.

- Abaixo, banner amarelo/laranja **Como funciona a validação por Wi-Fi na web?** com explicação técnica e botão laranja **Acessar Redes**, que navega para a aba de redes autorizadas.
- Esclarecer que **navegadores comuns não expõem o SSID conectado**, nem provam que o usuário está fisicamente no restaurante apenas por JavaScript. Na implementação web, a checagem da rede deve ocorrer no servidor comparando IP de origem confiável; esse método tem limitações (NAT, VPN, IP móvel, proxies) e não oferece prova absoluta de presença.
- Campos complementares: **Nome da Rede Wi-Fi exibida ao cliente**, **Senha do Wi-Fi (Opcional)**, **Duração da Sessão do Cliente (minutos)**. Preservar a funcionalidade sem assumir que o nome mostrado na interface pode ser detectado automaticamente.
- O campo de senha Wi-Fi é uma **informação configurada pelo estabelecimento**, não a senha de acesso do painel. Tratar armazenamento/acesso conforme a finalidade: evitar expô-la em APIs públicas sem intenção explícita, fornecer controle de visibilidade e limites de permissão.
- Validação de presença deve integrar QR Code e botões configurados como **Exige Wi-Fi**. Verificar no backend, emitir sessão com expiração, tratar falha de GPS, negar permissão, perda de conexão, modo desenvolvimento e sinalizar o método pelo qual a ação foi permitida.
- Não inventar uma API mágica de detecção de Wi-Fi ou usar SSID como prova garantida de autenticidade. O nome da opção **Estrito** na captura não prova o conjunto completo de condições ocultas; definir/testar política segura e documentá-la.

## 32.6 **Coordenadas de Geolocalização (Fallback Geofence)**

- Cartão com título literal **Coordenadas de Geolocalização (Fallback Geofence)** e subtítulo: usado se o cliente não conseguir se conectar ao Wi-Fi e o estabelecimento permitir validação por localização.
- Campo de busca por endereço com placeholder semelhante a **Digite o endereço do restaurante (rua, número, bairro ou cidade)...**; botão rosa **Buscar** e botão escuro **Usar meu GPS atual**.
- **Mapa interativo grande** com tiles reais, zoom `+`/`-`, marcador rosa e sobreposição do raio permitido; dica visível **Arraste o PIN ou clique no mapa para posicionar o restaurante**.
- Crédito do provedor de mapas visível, como **Leaflet | © OpenStreetMap contributors**, respeitando a atribuição e os termos de uso.
- Sob o mapa, três campos conectados ao marcador: **Latitude**, **Longitude** e **Raio Permitido (Metros)**.
- Atalhos de raio observados: **50m**, **100m**, **150m**, **250m**, com estado selecionado destacado (250m na captura). Permitir também edição numérica razoável, com limites e unidade explícita.
- Informação **Dica de precisão para seu restaurante** explica que marcar o ponto com exatidão melhora a validação. Posicionar pelo mapa, pelo resultado da pesquisa, por coordenadas e pelo GPS deve manter todos os valores sincronizados em tempo real.
- Utilizar, por exemplo, **Leaflet + OpenStreetMap** para o mapa; geocodificação com serviço compatível com os termos de uso e limites do provedor, com alternativa local ou mensagens de falha. Obter GPS **somente após clique e consentimento do usuário**. Geolocalização do cliente deve igualmente respeitar permissão e HTTPS quando necessário.
- Na verificação por geofence, calcular distância geodésica coerentemente, considerar precisão informada pelo dispositivo e casos de incerteza, e evitar prometer resistência perfeita a localização falsificada.
- Latitude/longitude presentes na gravação são **apenas dados de demonstração** e não devem ser publicados como localização inicial de todos os estabelecimentos.

## 32.7 **Regras de Visualização do Cardápio**

- Cartão com título **Regras de Visualização do Cardápio** e link de ação à direita para **Gerenciar Botões da Mesa** (o rótulo exato na captura deve ser conferido antes de adotar grafia diferente).
- Checkbox marcado em exemplo: **Exibir itens esgotados com badge de “Indisponível”**. Descrição indica que, se desmarcado, itens indisponíveis não ficam visíveis para clientes.
- Mostrar aviso com ícone sobre **Validação de presença no Wi-Fi** e como ela afeta ações/botões especiais da mesa, relacionado à aba **Botões Personalizados**.
- Regra funcional: produto com estoque/estado indisponível deve mostrar identificação clara, botão de pedido desabilitado e acessibilidade adequada **ou** ser ocultado, conforme configuração. Não permitir pedidos de produto indisponível por chamada direta à API.
- Manter consistência de disponibilidade nos produtos, importação, Stories/Reels, destaques e visualização pública do cardápio; salvar a preferência por restaurante.

## 32.8 **Monitor de Salão & TV (VIP)** — controles operacionais

- Cartão maior de borda rosa/vermelha, chip **NOVO**, título **Monitor de Salão & TV (VIP)** e link à direita **Abrir Monitor de TV em nova aba**.
- Texto descritivo relaciona acesso ao monitor, botões touchscreen e comportamento automático dos chamados em telas de TV e paredes do estabelecimento.
- Checkbox **Exigir PIN / Login para visualizar o Monitor de Salão (TV)**, apresentado marcado na referência.
- Campo condicional **Senha Geral da TV (código PIN do Salão)**, demonstrado como entrada de quatro dígitos. O valor exibido no vídeo é **DADO DE TESTE**: nunca o usar como PIN fixo na aplicação. Definir validação por servidor, limitação de tentativas, segredo armazenado com hash e rotação autorizada.
- Checkbox **Exibir botões “Atender” e “Concluir” nos cards da TV**, demonstrado marcado. Se desabilitado, o monitor torna-se apropriado para exibição passiva, sem operações expostas; o backend mantém autorização independente do checkbox.
- Checkbox **Avançar e finalizar chamados automaticamente por tempo (Modo Passivo de Parede)**, demonstrado marcado.
- Ao marcar o modo passivo, mostrar dois campos numéricos independentes:
  - **Mover para “Em Atendimento” após (segundos)** — exemplo visual de 60 segundos;
  - **Finalizar e Liberar da TV após (segundos)** — exemplo visual de 180 segundos.
- Os valores das capturas são **configurações de exemplo**, não timers imutáveis. Validar limites e ordem cronológica dos estágios, e permitir desligar a automação.
- Integração com chamados reais da aba **Chamados em Tempo Real**; status de TV e painel devem permanecer consistentes, com processamento de timers **no backend**, adequado a reconexões, reinícios e múltiplas TVs. Não disparar timers independentes em cada monitor, causando transições duplicadas.
- O Modo TV deve respeitar autenticação, papel RBAC, filtro por setor/mesa, PIN do salão, permissões de operação e diferenciação entre visualização passiva e atendimento manual.

## 32.9 **Horário de Funcionamento por Dia da Semana**

- Cartão com título **Horário de Funcionamento por Dia da Semana** e sete linhas, **Segunda-feira**, **Terça-feira**, **Quarta-feira**, **Quinta-feira**, **Sexta-feira**, **Sábado**, **Domingo**.
- Cada linha é um bloco horizontal de fundo cinza muito claro e cantos arredondados com nome do dia à esquerda; à direita, checkbox **Fechado**, horário de **abertura** e horário de **fechamento**, com ícones de relógio.
- Exibir valores próprios por dia, inclusive possibilidade de segunda-feira ter expediente diferente dos demais, como na imagem. Não hardcodar os horários mostrados na referência.
- Checkbox **Fechado** precisa ter comportamento real: desabilitar ou ignorar os horários daquele dia no calendário público; ao desmarcar, preservar os valores editados.
- Validar formato HH:mm, intervalos, fechamento depois de abertura, virada de madrugada quando suportada, timezone do estabelecimento e dias sem funcionamento; explicar como tratar exceções/feriados se implementados como recurso adicional.
- Botão **Salvar Todas as Configurações** próximo ao fim do cartão, com confirmação real, feedback de validação e persistência no banco.
- Aplicar regras consistentes nas telas de mesa/cardápio/ações: cliente deve receber mensagem adequada quando o restaurante estiver fechado, sem ocultar silenciosamente informações úteis.

## 32.10 **Segurança da Conta & Alteração de Senha**

- Cartão final com título **Segurança da Conta & Alteração de Senha**, subtítulo sobre alterar a senha de acesso ao painel para manter a conta protegida, e indicador do e-mail da conta à direita (não reproduzir dados pessoais da captura).
- Campos **Senha Atual**, **Nova Senha** e **Confirmar Nova Senha**, com tipo `password` e controles de revelar/ocultar quando apropriado.
- Indicador/ação **Gerar Forte** perto da nova senha, se esse recurso for implementado na mesma posição de referência; não enviar senha gerada a serviços externos.
- Botão vermelho **Salvar Nova Senha**; validação da senha atual no servidor, confirmação idêntica, regra de força de senha, hash resistente (Argon2id ou equivalente), limitação de tentativas e feedback seguro.
- Não registrar segredos em logs, eventos de analytics, URL ou localStorage. Exigir autenticação/reautenticação conforme sensibilidade e encerrar sessões quando apropriado.
- Alterar a senha da conta **não** altera automaticamente o PIN do salão, o PIN individual de funcionários nem a senha de Wi-Fi; manter domínios de credenciais separados.

## 32.11 Comportamentos transversais obrigatórios

- **Arquitetura:** `RestaurantSettings`/entidades correlatas no banco, isoladas por `restaurantId`, com subconfigurações tipadas para branding, fiscal/billing, mensagem, regras de chamada, presença, geofence, cardápio, TV e horários. Credenciais/segredos mantidos separados dos dados de interface pública.
- **Salvamento:** estado de edição, validação por campo e no servidor, salvamento atômico ou transacional dos grupos afetados, indicadores de alterações não salvas, recuperação de falha e proteção contra sobreposição de edições simultâneas.
- **Navegação:** atalhos internos acessíveis, foco visível, layout de desktop em duas colunas onde mostrado, no celular cartões empilhados, mapa responsivo, mockup reduzido sem cortar campos e botões de salvar sempre alcançáveis.
- **Tema:** painel claro e elegante com títulos escuros, botões primários rosa/vermelho, botões secundários brancos, linhas suaves, chips verdes/amarelos para status e aviso, bordas arredondadas. A cor de marca selecionada no cartão de identidade deve aparecer na **experiência do cliente**, independentemente da paleta global administrativa.
- **Integrações:** configurações da mensagem -> tela pública por QR; Wi-Fi/geofence -> autorização de presença e botões protegidos; prazo de chamado -> dashboard/TV; horários -> estado operacional; capa/logo/tema -> cardápio público; regra de indisponíveis -> listagem de pratos e Reels; PIN TV -> monitor; dados de faturamento -> assinatura/gateway se habilitado.
- **Segurança:** autenticação RBAC no servidor para alterar configurações; dados fiscais e de contato não devem vazar para clientes; validação de URLs e upload; respeito à LGPD e permissões de geolocalização; IP confiável e limites da verificação por Wi-Fi; nenhum segredo fixo extraído das capturas.

## 32.12 Matriz de evidência, divergências e testes de aceite

**[VISÍVEL NAS CAPTURAS / VÍDEO]**: menu Configurações ativo, avisos de confirmação de e-mail e teste gratuito no topo, cabeçalho e botões de salvar, atalhos de navegação, **Identidade Visual, Capa & Logotipo** com nome e cor HEX/preview, dados cadastrais, upload/link e presets de capa/logo, **Mensagem de Boas-Vindas** com título/subtítulo/restaurar/preview mobile e contadores, **Regras de Chamados & Retorno Automático**, **Modo de Validação de Presença** com quatro cartões e alerta Wi-Fi, campos de rede e sessão, **Coordenadas de Geolocalização** com busca/GPS/mapa/raio, **Regras de Visualização do Cardápio**, **Monitor de Salão & TV** com PIN, checkboxes e temporizadores, os sete **Horários de Funcionamento**, **Salvar Todas as Configurações** e **Segurança da Conta & Alteração de Senha**.

**[REQUISITO FUNCIONAL A IMPLEMENTAR, NÃO COMPROVADO PELO PRINT ESTÁTICO]**: persistência real; validação de CPF/CNPJ/telefone; upload e manipulação segura de mídias; seleção e restrições do GPS; cálculo efetivo de presença no backend; integração dos modos de segurança; atualização da tela do cliente; transições de status por timers robustos; autenticação do monitor TV; alteração de senha real; consistência entre configurações e módulos do sistema; confirmação de operações sensíveis.

**[NÃO COMPROVADO / PENDENTE]**: todos os títulos da faixa de atalhos na captura compactada, conteúdos ocultos por rolagem interna caso existam, estados visuais completos de erro/loading, modais de confirmação de remoção de capa, algoritmo interno usado pelo site original para presença, ação real do gateway, comportamento ao abrir Modo TV a partir dessa página, aparência do cardápio com itens indisponíveis e integração operacional de pagamentos.

**CHECKLIST DE TESTES:** alterar nome/cor/preview; carregar/remover capa e logo; escolher presets; salvar/reabrir; restaurar mensagem e ver atualização no celular; usar todos os presets de tempo; alternar os quatro modos de presença e negar GPS; ativar/desativar IP autorizado; configurar nome/senha de Wi-Fi e sessão; pesquisar endereço e arrastar marcador; editar raio e coordenadas; testar indisponíveis exibidos/ocultos; ativar PIN TV, testar incorreto/correto e bloqueio após tentativas; ligar/desligar botões Atender/Concluir e modo passivo; conferir timers sem duplicação; alterar os sete horários e dias fechados; salvar tudo; alterar senha com dados incorretos/corretos; conferir acesso em duas contas de restaurantes diferentes, navegação pelo teclado, tela pequena e falha de rede. **Não considerar a página pronta enquanto qualquer controle visível for meramente decorativo.**
