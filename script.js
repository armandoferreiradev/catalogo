// ===========================================
// CONFIGURAÇÃO INICIAL E DADOS
// ===========================================

/**
 * Array de produtos fixo com os caminhos reais das imagens
 * @type {Array<Object>}
 */
const produtos = [];

// Gerar as 28 revistas dinamicamente
for (let i = 1; i <= 28; i++) {
    const numeroRevista = i.toString().padStart(2, '0');
    produtos.push({
        id: i,
        nome: `Revista ${numeroRevista}`,
        imagemCapa: `imagens/revista${numeroRevista}.webp`,
        // A primeira imagem do carrossel é a própria capa
        imagensProjetos: [
            `imagens/revista${numeroRevista}.webp`,
            `imagens/revista${numeroRevista}_passo01.webp`,
            `imagens/revista${numeroRevista}_passo02.webp`,
            `imagens/revista${numeroRevista}_passo03.webp`
        ]
    });
}

/**
 * Estado da aplicação - variáveis globais
 * @type {Array} carrinho - Lista de itens no carrinho
 * @type {number} currentSlide - Slide atual do carrossel
 * @type {Object|null} currentProduct - Produto sendo visualizado no modal
 * @type {Array} toastQueue - Fila de notificações toast
 * @type {boolean} isToastShowing - Controle de exibição de toasts
 * @type {number} touchStartX - Posição X inicial do toque
 * @type {number} touchStartY - Posição Y inicial do toque
 * @type {number} touchEndX - Posição X final do toque
 * @type {number} touchEndY - Posição Y final do toque
 * @type {boolean} isSwiping - Flag para controle de swipe
 * @type {HTMLElement|null} currentSlideElement - Elemento do slide atual
 * @type {number} slideOffset - Deslocamento atual do slide durante swipe
 */
let carrinho = JSON.parse(localStorage.getItem('carrinhoEVA')) || [];
let currentSlide = 0;
let currentProduct = null;
let toastQueue = [];
let isToastShowing = false;
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let isSwiping = false;
let currentSlideElement = null;
let slideOffset = 0;

// ===========================================
// SISTEMA DE NOTIFICAÇÕES TOAST
// ===========================================

/**
 * Exibe uma notificação toast para o usuário
 * @param {string} message - Mensagem a ser exibida
 * @param {string} type - Tipo da notificação (success, error, warning, info)
 * @param {number} duration - Duração em milissegundos (padrão: 3000)
 */
function showToast(message, type = 'success', duration = 3000) {
    const toastContainer = document.getElementById('toast-container');

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = type === 'success' ? '✅' :
                type === 'error' ? '❌' :
                type === 'warning' ? '⚠️' : 'ℹ️';

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span>${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    toastContainer.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);

    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 400);
    }, duration);
}

/**
 * Anima os badges do carrinho (flutuante e header)
 */
function animateBadge() {
    // Animate floating cart badge
    const floatingBadge = document.getElementById('carrinho-badge');
    floatingBadge.classList.add('bounce', 'glow');
    setTimeout(() => {
        floatingBadge.classList.remove('bounce');
    }, 600);
    setTimeout(() => {
        floatingBadge.classList.remove('glow');
    }, 2000);

    // Animate header cart badge
    const headerBadge = document.getElementById('header-cart-badge');
    headerBadge.classList.add('bounce', 'glow');
    setTimeout(() => {
        headerBadge.classList.remove('bounce');
    }, 600);
    setTimeout(() => {
        headerBadge.classList.remove('glow');
    }, 2000);
}

/**
 * Anima um botão com efeito de clique e loading
 * @param {HTMLElement} button - Botão a ser animado
 */
function animateButton(button) {
    button.classList.add('clicked');
    button.classList.add('loading');

    setTimeout(() => {
        button.classList.remove('clicked');
        button.classList.remove('loading');
    }, 1000);
}

// ===========================================
// RENDERIZAÇÃO E INTERFACE
// ===========================================

/**
 * Renderiza o catálogo de produtos na página
 */
function renderizarCatalogo() {
    const catalogoDiv = document.getElementById('catalogo');
    catalogoDiv.innerHTML = '';

    produtos.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'revista-card';
        card.innerHTML = `
            <img src="${produto.imagemCapa}" alt="${produto.nome}" loading="lazy">
            <div class="card-info">
                <h3>${produto.nome}</h3>
                <div class="preco">R$ 16,90</div>
                <div class="card-actions">
                    <button class="btn-ver-projetos" onclick="abrirModal(${produto.id})">
                        👁️ Ver os projetos
                    </button>
                    <button class="btn-adicionar" onclick="adicionarAoCarrinho(event, ${produto.id})">
                        ➕ Adicionar revista
                    </button>
                </div>
            </div>
        `;

        // Adicionar evento de clique na imagem para abrir modal
        const cardImage = card.querySelector('img');
        if (cardImage) {
            cardImage.style.cursor = 'pointer';
            cardImage.addEventListener('click', (e) => {
                e.stopPropagation();
                abrirModal(produto.id);
            });
        }

        catalogoDiv.appendChild(card);
    });
}

// ===========================================
// SISTEMA DE MODAIS E CARROSSEL
// ===========================================

/**
 * Abre o modal de pré-visualização de um produto
 * @param {number|Object} produtoOuId - ID do produto ou objeto produto
 */
function abrirModal(produtoOuId) {
    // Se receber um ID, busca o produto no array
    if (typeof produtoOuId === 'number') {
        currentProduct = produtos.find(p => p.id === produtoOuId);
    } else {
        currentProduct = produtoOuId;
    }

    if (!currentProduct) return;

    document.getElementById('modal-titulo').textContent = currentProduct.nome;

    const carrossel = document.getElementById('carrossel');
    const indicators = document.getElementById('indicators');

    carrossel.innerHTML = '';
    indicators.innerHTML = '';

    // Criar slides
    currentProduct.imagensProjetos.forEach((imagem, index) => {
        const slide = document.createElement('div');
        slide.className = `carrossel-item ${index === 0 ? 'active' : ''}`;
        slide.innerHTML = `<img src="${imagem}" alt="Slide ${index + 1}" loading="lazy">`;
        carrossel.appendChild(slide);

        // Criar indicador
        const indicator = document.createElement('div');
        indicator.className = `indicator ${index === 0 ? 'active' : ''}`;
        indicator.onclick = () => goToSlide(index);
        indicators.appendChild(indicator);
    });

    // Adicionar botões de navegação
    if (currentProduct.imagensProjetos.length > 1) {
        carrossel.innerHTML += `
            <button class="carrossel-nav carrossel-prev" onclick="prevSlide()">❮</button>
            <button class="carrossel-nav carrossel-next" onclick="nextSlide()">❯</button>
        `;
    }

    currentSlide = 0;
    document.getElementById('modal-preview').style.display = 'flex';

    // Adicionar listeners para swipe após o modal ser exibido
    updateModalListeners();
}

/**
 * Navegação do carrossel - próximo slide
 */
function nextSlide() {
    if (!currentProduct) return;
    currentSlide = (currentSlide + 1) % currentProduct.imagensProjetos.length;
    updateCarrossel();
}

/**
 * Navegação do carrossel - slide anterior
 */
function prevSlide() {
    if (!currentProduct) return;
    currentSlide = currentSlide === 0 ? currentProduct.imagensProjetos.length - 1 : currentSlide - 1;
    updateCarrossel();
}

/**
 * Navegação do carrossel - ir para slide específico
 * @param {number} index - Índice do slide
 */
function goToSlide(index) {
    currentSlide = index;
    updateCarrossel();
}

/**
 * Atualiza a exibição do carrossel com transições suaves
 */
function updateCarrossel() {
    const slides = document.querySelectorAll('.carrossel-item');
    const indicators = document.querySelectorAll('.indicator');

    // Atualizar slides sem delay para evitar piscada
    slides.forEach((slide, index) => {
        if (index === currentSlide) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });

    // Atualizar indicadores
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

/**
 * Fecha o modal de pré-visualização
 */
function fecharModal() {
    document.getElementById('modal-preview').style.display = 'none';
    currentProduct = null;
}

// ===========================================
// GERENCIAMENTO DO CARRINHO
// ===========================================

/**
 * Adiciona um produto ao carrinho de compras
 * @param {Event} event - Evento do clique
 * @param {number} produtoId - ID do produto a ser adicionado
 */
function adicionarAoCarrinho(event, produtoId) {
    // Verifica se o produto já está no carrinho
    const produtoExistente = carrinho.find(item => item.id === produtoId);

    if (produtoExistente) {
        // Se já existe, mostra toast de aviso
        showToast('Esta revista já está no seu carrinho!', 'warning');
        return;
    }

    const produto = produtos.find(p => p.id === produtoId);
    if (produto) {
        carrinho.push(produto);
        salvarCarrinho();
        atualizarBadgeCarrinho();

        // Enhanced feedback visual
        const button = event.target.closest('.btn-adicionar');
        if (button) {
            animateButton(button);
        }

        animateBadge();

        // Show success toast
        showToast(`${produto.nome} adicionada ao carrinho!`, 'success');
    }
}

/**
 * Adiciona produto ao carrinho a partir do modal
 */
function adicionarAoCarrinhoModal() {
    if (currentProduct) {
        // Não precisa passar o evento aqui
        adicionarAoCarrinho({ stopPropagation: () => {} }, currentProduct.id);
        fecharModal();
    }
}

/**
 * Salva o estado do carrinho no localStorage
 */
function salvarCarrinho() {
    localStorage.setItem('carrinhoEVA', JSON.stringify(carrinho));
}

/**
 * Atualiza os badges de contador do carrinho
 */
function atualizarBadgeCarrinho() {
    const count = carrinho.length;
    document.getElementById('carrinho-badge').textContent = count;
    document.getElementById('header-cart-badge').textContent = count;
}

/**
 * Calcula o total do pedido com desconto
 * @returns {number} Total calculado com desconto
 */
function calcularTotal() {
    const quantidade = carrinho.length;
    let total;

    if (quantidade >= 3) {
        const gruposDeQuatro = Math.floor(quantidade / 4);
        const itensRestantes = quantidade % 4;
        const itensPagos = (gruposDeQuatro * 3) + itensRestantes;
        total = itensPagos * 16.90;
    } else {
        total = quantidade * 16.90;
    }

    return total;
}

/**
 * Abre o modal do carrinho de compras
 */
function abrirCarrinho() {
    renderizarCarrinho();
    document.getElementById('modal-carrinho').style.display = 'flex';
}

/**
 * Fecha o modal do carrinho
 */
function fecharCarrinho() {
    document.getElementById('modal-carrinho').style.display = 'none';
}

/**
 * Renderiza o conteúdo do carrinho no modal
 */
function renderizarCarrinho() {
    const listaDiv = document.getElementById('carrinho-lista');
    const totalDiv = document.getElementById('carrinho-total');

    if (carrinho.length === 0) {
        listaDiv.innerHTML = '<div class="carrinho-vazio">Seu carrinho está vazio</div>';
        totalDiv.innerHTML = 'Total: R$ 0,00';
        return;
    }

    const contadorItens = {};
    carrinho.forEach(item => {
        contadorItens[item.id] = (contadorItens[item.id] || 0) + 1;
    });

    listaDiv.innerHTML = '';

    if (carrinho.length >= 3) {
        const promocaoDiv = document.createElement('div');
        promocaoDiv.className = 'promocao-info';
        const revistasGratis = Math.floor(carrinho.length / 4);
        promocaoDiv.innerHTML = `
            🎉 Promoção Ativa: A cada 4 revistas, 1 é grátis!<br>
            Você ganhou ${revistasGratis} revista(s) de presente!
        `;
        listaDiv.appendChild(promocaoDiv);
    }

    Object.entries(contadorItens).forEach(([id, quantidade]) => {
        const produto = produtos.find(p => p.id == id);
        const itemDiv = document.createElement('div');
        itemDiv.className = 'carrinho-item';
        itemDiv.innerHTML = `
            <div class="item-info">
                <strong>${produto.nome}</strong> (x${quantidade})
            </div>
            <button class="btn-remover" onclick="removerDoCarrinho(${id})">Remover 1</button>
        `;
        listaDiv.appendChild(itemDiv);
    });

    const whatsappDiv = document.createElement('div');
    whatsappDiv.style.padding = '20px';
    whatsappDiv.innerHTML = `
        <button class="btn-whatsapp" onclick="finalizarPedido()">
            📱 Finalizar pelo WhatsApp
        </button>
    `;
    listaDiv.appendChild(whatsappDiv);

    const total = calcularTotal();
    totalDiv.innerHTML = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
}

/**
 * Remove um item do carrinho
 * @param {number} produtoId - ID do produto a ser removido
 */
function removerDoCarrinho(produtoId) {
    const index = carrinho.findIndex(item => item.id == produtoId);
    if (index > -1) {
        const produtoRemovido = carrinho[index];
        carrinho.splice(index, 1);
        salvarCarrinho();
        atualizarBadgeCarrinho();
        renderizarCarrinho();

        // Enhanced feedback visual
        animateBadge();

        // Show removal toast
        showToast(`${produtoRemovido.nome} removida do carrinho!`, 'error');
    }
}

/**
 * Finaliza o pedido e abre WhatsApp
 */
function finalizarPedido() {
    if (carrinho.length === 0) return;

    const contadorItens = {};
    carrinho.forEach(item => {
        contadorItens[item.id] = (contadorItens[item.id] || 0) + 1;
    });

    let mensagem = "🎨 *Pedido - Revistas de EVA*\n\n";
    mensagem += "Olá! Gostaria de fazer o pedido das seguintes revistas:\n";

    Object.entries(contadorItens).forEach(([id, quantidade]) => {
        const produto = produtos.find(p => p.id == id);
        mensagem += `• ${produto.nome} (x${quantidade})\n`;
    });

    if (carrinho.length >= 3) {
        mensagem += `\n🎉 *Promoção aplicada:* A cada 4 revistas, 1 sai de graça!\n`;
    }

    const total = calcularTotal();
    mensagem += `\n*Total do pedido: R$ ${total.toFixed(2).replace('.', ',')}*`;

    const numeroWhatsApp = "5512982499196";
    const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;

    window.open(urlWhatsApp, '_blank');
}

// ===========================================
// EVENTOS E INTERAÇÕES
// ===========================================

/**
 * Evento para fechar modais ao clicar fora deles
 */
window.addEventListener('click', function(e) {
    if (e.target == document.getElementById('modal-preview')) {
        fecharModal();
    }
    if (e.target == document.getElementById('modal-carrinho')) {
        fecharCarrinho();
    }
});

/**
 * Evento para fechar modais com tecla ESC
 */
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        fecharModal();
        fecharCarrinho();
    }
});

/**
 * Detecta e processa gestos de swipe no carrossel
 */
function handleSwipe() {
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    const absDiffX = Math.abs(diffX);
    const absDiffY = Math.abs(diffY);

    // Verificar se é um swipe horizontal válido (não vertical)
    if (absDiffX > absDiffY && absDiffX > 50) {
        if (diffX > 0) {
            // Swipe para esquerda - próximo slide
            nextSlide();
        } else {
            // Swipe para direita - slide anterior
            prevSlide();
        }
    }
}

/**
 * Adiciona event listeners para swipe no carrossel
 */
function addSwipeListeners() {
    const carrossel = document.getElementById('carrossel');

    if (!carrossel) return;

    carrossel.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isSwiping = true;

        // Adicionar classe para feedback visual
        const activeSlide = carrossel.querySelector('.carrossel-item.active');
        if (activeSlide) {
            activeSlide.classList.add('swipe-active');
            currentSlideElement = activeSlide;
        }
    }, { passive: true });

    carrossel.addEventListener('touchmove', function(e) {
        if (!isSwiping || !currentSlideElement) return;

        touchEndX = e.touches[0].clientX;
        touchEndY = e.touches[0].clientY;

        const diffX = touchStartX - touchEndX;
        const diffY = Math.abs(touchStartY - touchEndY);

        // Prevenir scroll da página durante swipe horizontal
        if (Math.abs(diffX) > diffY && Math.abs(diffX) > 10) {
            e.preventDefault();

            // Calcular offset para movimento visual
            slideOffset = -diffX;

            // Limitar o movimento para não ir muito longe
            const maxOffset = 100;
            if (Math.abs(slideOffset) > maxOffset) {
                slideOffset = slideOffset > 0 ? maxOffset : -maxOffset;
            }

            // Aplicar transformação visual
            currentSlideElement.style.setProperty('--swipe-offset', slideOffset + 'px');
        }
    }, { passive: false });

    carrossel.addEventListener('touchend', function(e) {
        if (isSwiping && currentSlideElement) {
            // Remover classe e resetar transformação
            currentSlideElement.classList.remove('swipe-active');
            currentSlideElement.style.removeProperty('--swipe-offset');

            // Processar o swipe
            handleSwipe();
            isSwiping = false;
            currentSlideElement = null;
            slideOffset = 0;
        }
    }, { passive: true });
}

/**
 * Atualiza os event listeners quando o modal é aberto
 */
function updateModalListeners() {
    // Adicionar listeners diretamente sem recriar elementos
    addSwipeListeners();
}

// ===========================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ===========================================

/**
 * Inicializa a aplicação quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', function() {
    renderizarCatalogo();
    atualizarBadgeCarrinho();
});
