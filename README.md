# 📄 **Especificação do Projeto – Catálogo Online de Revistas Digitais (Versão Revisada)**

---

#### 🎯 **Objetivo do Projeto**

Desenvolver um catálogo web responsivo e interativo para as revistas digitais de artesanato em EVA da Arte Educadora **Ana Paula Merigo**. A aplicação prioriza a experiência do usuário em dispositivos móveis, com pré-visualização detalhada dos projetos de cada edição, gerenciamento de carrinho de compras com promoção automática e finalização de pedidos diretamente pelo WhatsApp. Esta versão incorpora otimizações para um design clean, uso de Bootstrap para estruturas responsivas e feedbacks visuais aprimorados via toasts.

---

#### 📝 **Descrição do Conteúdo**

- **Autoria:** Arte Educadora Ana Paula Merigo.
- **Conteúdo por Revista:** Cada edição contém 3 projetos completos de artesanato em EVA.
- **Metodologia:** Cada projeto é ensinado com um passo a passo fotográfico detalhado, com textos explicativos em cada imagem.
- **Recursos Adicionais:** Todas as revistas incluem moldes em tamanho natural (formato A4), prontos para impressão.
- **Preço Único:** Todas as revistas custam R$ 16,90.

---

#### 📌 **Necessidades e Soluções Implementadas**

| Necessidade | Solução Implementada |
|-----------|----------------------|
| **Catálogo de 28 Revistas** | Lista de produtos gerada dinamicamente via JavaScript a partir de um array fixo. Cada revista é identificada por um número (01 a 28). Preço fixo de R$ 16,90. |
| **Exibição de Capas** | Grid responsivo com Bootstrap: 1 coluna em mobile, 4 colunas em desktop (usando `col-12 col-md-3`). Largura máxima de 1200px via `container-xl`. |
| **Pré-visualização de Projetos** | Ao clicar na capa ou no botão "Ver Projetos", abre-se um **modal com carrossel** (Bootstrap Carousel) contendo: capa da revista + 3 passos do projeto. Navegação com setas e indicadores de slide. |
| **Imagens Otimizadas** | Formato **WebP** para melhor desempenho. Proporção fixa de **1080x1528px** (A4). Nomenclatura padronizada: `revistaXX.webp` e `revistaXX_passo01.webp`, etc. Lazy loading nativo. |
| **Interface Clean e Responsiva** | Design minimalista com Bootstrap, cores temáticas (`#F48FAC` rosa e `#A1C1E6` azul), tipografia `Poppins`. Sem efeitos de hover, sombras ou animações para foco em mobile. Destaques com negrito e cores para títulos e valores. |
| **Ícones** | Integração de Bootstrap Icons para botões (ex: carrinho, lixeira), toasts (ex: check, gift) e seções informativas, mantendo o layout clean. |
| **Carrinho de Compras** | Armazenamento local com `localStorage`. Permite adicionar e remover itens individualmente. Offcanvas (Bootstrap) para exibição lateral. |
| **Promoção "Compre 3, Leve 4"** | Cálculo automático: a cada 4 revistas, 1 é gratuita. O total é recalculado dinamicamente. Mensagem de promoção no carrinho. |
| **Finalização de Pedido** | Botão "Finalizar pelo WhatsApp" gera uma mensagem pré-formatada com o resumo do pedido e abre o link `wa.me` em nova aba. |
| **Feedback ao Usuário** | Notificações **Toast** (Bootstrap) com ícones para sucesso (ex: adição, brinde ganho), erro (ex: remoção, duplicado) e aviso (ex: sugestão de brinde). Toasts específicos para promoção: "Parabéns! Você ganhou 1 revista grátis!" (ao atingir 4 itens) e "Adicione mais 1 revista para ganhar uma grátis!" (com 3 itens). |
| **Elementos Flutuantes** | Botão de carrinho fixo no canto inferior direito, com badge para quantidade de itens. |

---

#### ✅ **Funcionalidades do Sistema**

1. **Catálogo Dinâmico**
   - Geração automática dos 28 cards de revistas via JavaScript.
   - Cada card é clicável (imagem e botão "Ver Projetos" abrem o modal; botão "Adicionar ao Carrinho" adiciona o item).
   - Destaques: Títulos em negrito e cor azul (#A1C1E6); valores em negrito e cor rosa (#F48FAC).

2. **Modal de Pré-visualização**
   - Carrossel interativo com navegação por setas e indicadores.
   - Abre ao clicar na imagem da capa ou no botão "Ver Projetos".
   - Fechamento ao clicar fora, botão close ou pressionar `ESC`.

3. **Carrinho de Compras**
   - Dois acessos: botão no header e botão flutuante (com ícone de carrinho e badge).
   - Exibe quantidade de itens em tempo real.
   - Lista de itens com botão para remover (com ícone de lixeira).
   - Mostra mensagem de promoção quando aplicável.
   - Cálculo automático do total com desconto.
   - Fechamento com `ESC`.

4. **Finalização via WhatsApp**
   - Mensagem formatada com:
     - Lista de revistas (com quantidades).
     - Informação da promoção ativa.
     - Valor total do pedido.
   - Enviada para o número: `+55 12 98249-9196`.

5. **Notificações (Toasts)**
   - Feedback visual com ícones para:
     - Adição ao carrinho (sucesso).
     - Tentativa de adicionar item duplicado (aviso).
     - Remoção de item (erro).
     - Ganho de brinde (sucesso, ao adicionar o 4º item).
     - Sugestão de brinde (aviso, com exatamente 3 itens).
   - Cores diferenciadas por tipo (sucesso verde, erro vermelho, aviso amarelo).
   - Posicionamento fixo no topo direito, com auto-desaparecimento após 3 segundos.

6. **Informações Complementares**
   - Seção com 3 boxes informativos destacando:
     - Quantidade de projetos por revista (ícone de jornal).
     - Disponibilidade de moldes em tamanho A4 (ícone de impressora).
     - Promoção "Compre 3, leve 4" (ícone de presente).

---

#### 🧩 **Estrutura de Arquivos**

```
/projeto
  /imagens
     revista01.webp
     revista01_passo01.webp
     revista01_passo02.webp
     revista01_passo03.webp
     ... (total de 112 imagens para as 28 revistas)
  index.html
  style.css
  script.js
```

---

#### ⚙️ **Arquitetura do Código**

**1. `index.html`**
- Estrutura semântica com `<header>`, `<main>`, `<footer>` (implícito).
- Integração de Bootstrap 5.3 (CDN) para grid, modal, offcanvas, carousel e toasts.
- Integração de Bootstrap Icons (CDN) para ícones.
- Modal para pré-visualização e offcanvas para carrinho.
- Container para notificações toast.
- Inclusão de fonte (Poppins) e arquivos CSS/JS.

**2. `style.css`**
- Reset e configurações globais.
- Layout responsivo com Bootstrap Grid e Flexbox.
- Estilos clean para cards, modais, carrinho e toasts.
- Cores temáticas e negrito para destaques (sem hover, sombras ou animações).
- Media queries mínimas para mobile (até 480px).

**3. `script.js`**
- Array `produtos` gerado dinamicamente com 28 revistas (preço fixo R$ 16,90).
- Estado gerenciado com variáveis locais e `localStorage`.
- Funções para:
  - Renderizar catálogo (com cliques na imagem).
  - Controlar carrossel no modal.
  - Gerenciar carrinho (adicionar, remover, calcular total com promoção).
  - Exibir toasts com ícones e lógica para promoção.
  - Gerar link do WhatsApp.
- Eventos para abertura/fechamento de modais e offcanvas, incluindo suporte a `ESC`.

---

#### 📱 **Experiência do Usuário (UX)**

- **Mobile-first:** Design otimizado para celulares (1 coluna), com elementos flutuantes, tamanhos de fonte adequados e layout clean sem distrações visuais.
- **Acessibilidade:** Navegação por teclado (ESC para fechar modais/offcanvas), aria-labels em elementos Bootstrap e lazy loading de imagens.
- **Performance:** Imagens WebP, lazy loading, código modular e leve (client-side apenas).
- **Segurança:** Sem dados sensíveis, uso apenas de `localStorage`.
- **Feedback Intuitivo:** Toasts com ícones fornecem orientações claras, especialmente para a promoção, incentivando compras adicionais.

---

#### 🔗 **Link de Contato**
- [https://wa.me/5512982499196](https://wa.me/5512982499196) (com integração direta no sistema)

---
