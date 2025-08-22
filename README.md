### 📄 **Especificação do Projeto – Catálogo Online de Revistas Digitais**

---

#### 🎯 **Objetivo do Projeto**

Desenvolver um catálogo web responsivo e interativo para as revistas digitais de artesanato em EVA da Arte Educadora **Ana Paula Merigo**. A aplicação tem como foco principal a experiência do usuário em dispositivos móveis, permitindo a pré-visualização detalhada dos projetos de cada edição, gerenciamento de carrinho de compras com promoção automática e finalização de pedidos diretamente pelo WhatsApp.

---

#### 📝 **Descrição do Conteúdo**

- **Autoria:** Arte Educadora Ana Paula Merigo.
- **Conteúdo por Revista:** Cada edição contém 3 projetos completos de artesanato em EVA.
- **Metodologia:** Cada projeto é ensinado com um passo a passo fotográfico detalhado, com textos explicativos em cada imagem.
- **Recursos Adicionais:** Todas as revistas incluem moldes em tamanho natural (formato A4), prontos para impressão.

---

#### 📌 **Necessidades e Soluções Implementadas**

| Necessidade | Solução Implementada |
|-----------|----------------------|
| **Catálogo de 28 Revistas** | Lista de produtos gerada dinamicamente via JavaScript a partir de um array fixo. Cada revista é identificada por um número (01 a 28). |
| **Exibição de Capas** | Grid responsivo: 2 colunas em mobile, 4 em desktop. Cada card exibe a capa, nome e preço. |
| **Pré-visualização de Projetos** | Ao clicar na capa, abre-se um **modal com carrossel** contendo: capa da revista + 3 passos do projeto. Navegação com setas e indicadores de slide. |
| **Imagens Otimizadas** | Formato **WebP** para melhor desempenho. Proporção fixa de **1080x1528px** (A4). Nomenclatura padronizada: `revistaXX.webp` e `revistaXX_passo01.webp`, etc. |
| **Interface Moderna e Responsiva** | Layout com design limpo, cores temáticas (`#F48FAC` rosa e `#A1C1E6` azul), tipografia `Poppins` e efeitos sutis de animação (hover, transições). |
| **Carrinho de Compras** | Armazenamento local com `localStorage`. Permite adicionar e remover itens individualmente. |
| **Promoção "Compre 3, Leve 4"** | Sistema de cálculo automático: a cada 4 revistas, 1 é gratuita. O total é recalculado dinamicamente. |
| **Finalização de Pedido** | Botão "Finalizar pelo WhatsApp" gera uma mensagem pré-formatada com o resumo do pedido e abre o link `wa.me` em nova aba. |
| **Feedback ao Usuário** | Notificações **Toast** (sucesso, erro, aviso) com ícones e animações suaves. |
| **Elementos Flutuantes** | Botão de carrinho fixo no canto inferior direito, com badge animado. |

---

#### ✅ **Funcionalidades do Sistema**

1. **Catálogo Dinâmico**
   - Geração automática dos 28 cards de revistas via JavaScript.
   - Cada card é clicável (imagem e botão).

2. **Modal de Pré-visualização**
   - Carrossel interativo com navegação por setas e indicadores.
   - Fechamento ao clicar fora ou pressionar `ESC`.

3. **Carrinho de Compras**
   - Dois acessos: botão no header e botão flutuante.
   - Exibe quantidade de itens em tempo real.
   - Lista de itens com botão para remover 1 unidade.
   - Mostra mensagem de promoção quando aplicável.
   - Cálculo automático do total com desconto.

4. **Finalização via WhatsApp**
   - Mensagem formatada com:
     - Lista de revistas (com quantidades).
     - Informação da promoção ativa.
     - Valor total do pedido.
   - Enviada para o número: `+55 12 98249-9196`.

5. **Notificações (Toasts)**
   - Feedback visual para:
     - Adição ao carrinho.
     - Tentativa de adicionar item duplicado.
     - Remoção de item.
   - Cores diferenciadas por tipo (sucesso, erro, aviso).

6. **Animações e Efeitos**
   - Efeito de *bounce* e *glow* nos badges do carrinho ao adicionar/remover itens.
   - Animação de clique e loading nos botões.
   - Transições suaves em hover e modal.

7. **Informações Complementares**
   - Seção com 3 boxes informativos destacando:
     - Quantidade de projetos por revista.
     - Disponibilidade de moldes em tamanho A4.
     - Promoção "Compre 3, leve 4".

---

#### 🧩 **Estrutura de Arquivos**

```
/projeto
  /imagens
     revista01.webp
     revista01_passo01.webp
     revista01_passo02.webp
     revista01_passo03.webp
     revista02.webp
     ... (total de 112 imagens para as 28 revistas)
  index.html
  style.css
  script.js
```

---

#### ⚙️ **Arquitetura do Código**

**1. `index.html`**
- Estrutura semântica com `<header>`, `<main>`, `<footer>`.
- Modais para pré-visualização e carrinho.
- Container para notificações toast.
- Inclusão de fonte (Poppins) e arquivos CSS/JS.

**2. `style.css`**
- Reset e configurações globais.
- Layout responsivo com Grid e Flexbox.
- Estilos para cards, modais, carrinho, toasts e botões.
- Animações com `@keyframes`.
- Media queries para mobile (até 768px e 480px).

**3. `script.js`**
- Array `produtos` gerado dinamicamente com 28 revistas.
- Estado gerenciado com variáveis locais e `localStorage`.
- Funções para:
  - Renderizar catálogo.
  - Controlar carrossel.
  - Gerenciar carrinho (adicionar, remover, calcular total).
  - Exibir toasts e animações.
  - Gerar link do WhatsApp.

---

#### 📱 **Experiência do Usuário (UX)**

- **Mobile-first:** Design otimizado para celulares, com elementos flutuantes e tamanhos de fonte adequados.
- **Acessibilidade:** Navegação por teclado (ESC para fechar modais).
- **Performance:** Imagens WebP, lazy loading, código modular.
- **Segurança:** Sem dados sensíveis, uso apenas de `localStorage`.

---

#### 🔗 **Link de Contato**
- [https://wa.me/5512982499196](https://wa.me/5512982499196) (com integração direta no sistema)

---
