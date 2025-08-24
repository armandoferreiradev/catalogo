// Array de Produtos (gerado dinamicamente)
const produtos = [];
for (let i = 1; i <= 28; i++) {
    const num = i.toString().padStart(2, '0');
    produtos.push({
        id: num,
        nome: `Revista ${num}`,
        preco: 16.90, // Preço único atualizado
        imagem: `imagens/revista${num}.webp`
    });
}

// Estado do Carrinho (usando localStorage)
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Funções Auxiliares
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartBadge').textContent = totalItems;
    document.getElementById('floatingCartBadge').textContent = totalItems;
}

function calculateTotal() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const freeItems = Math.floor(totalItems / 4);
    const paidItems = totalItems - freeItems;
    const totalPrice = paidItems * produtos[0].preco; // Preço único
    return { totalItems, freeItems, totalPrice };
}

function showToast(message, type = 'success', icon = 'check-circle') {
    const toastContainer = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${type} border-0 show`;
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body"><i class="bi bi-${icon} me-2"></i> ${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Renderizar Catálogo
function renderCatalog() {
    const catalog = document.getElementById('catalog');
    catalog.innerHTML = '';
    produtos.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'col-12 col-md-3';
        card.innerHTML = `
            <div class="card h-100">
                <img src="${produto.imagem}" class="card-img-top" alt="${produto.nome}" loading="lazy" onclick="openPreview('${produto.id}')">
                <div class="card-body text-center">
                    <h5 class="card-title">${produto.nome}</h5>
                    <p class="card-text"><strong>R$ ${produto.preco.toFixed(2)}</strong></p>
                    <button class="btn btn-primary" onclick="openPreview('${produto.id}')">Ver Projetos</button>
                    <button class="btn btn-outline-primary mt-2" onclick="addToCart('${produto.id}')">Adicionar ao Carrinho</button>
                </div>
            </div>
        `;
        catalog.appendChild(card);
    });
}

// Abrir Preview Modal com Carousel
function openPreview(id) {
    const modal = new bootstrap.Modal(document.getElementById('previewModal'));
    const carouselInner = document.querySelector('#previewCarousel .carousel-inner');
    const carouselIndicators = document.querySelector('#previewCarousel .carousel-indicators');
    carouselInner.innerHTML = '';
    carouselIndicators.innerHTML = '';

    const images = [
        `imagens/revista${id}.webp`, // Capa
        `imagens/revista${id}_passo01.webp`,
        `imagens/revista${id}_passo02.webp`,
        `imagens/revista${id}_passo03.webp`
    ];

    images.forEach((img, index) => {
        const item = document.createElement('div');
        item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        item.innerHTML = `<img src="${img}" class="d-block w-100" alt="Slide ${index + 1}" loading="lazy">`;
        carouselInner.appendChild(item);

        const indicator = document.createElement('button');
        indicator.type = 'button';
        indicator.dataset.bsTarget = '#previewCarousel';
        indicator.dataset.bsSlideTo = index;
        indicator.className = index === 0 ? 'active' : '';
        indicator.ariaCurrent = index === 0 ? 'true' : '';
        indicator.ariaLabel = `Slide ${index + 1}`;
        carouselIndicators.appendChild(indicator);
    });

    document.getElementById('previewModalLabel').textContent = `Pré-Visualização: Revista ${id}`;
    modal.show();
}

// Gerenciar Carrinho
function addToCart(id) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        showToast('Revista já está no Carrinho!', 'warning', 'exclamation-triangle');
        return;
    }
    cart.push({ id, quantity: 1 });
    saveCart();
    updateCartBadge();
    renderCart();

    const { totalItems } = calculateTotal();
    showToast('Revista adicionada ao carrinho!', 'success', 'check-circle');

    // Toasts de promoção
    if (totalItems % 4 === 0) {
        showToast('Parabéns! Você ganhou 1 revista grátis!', 'success', 'gift');
    } else if (totalItems % 4 === 3) {
        showToast('Adicione mais 1 revista para ganhar uma grátis!', 'warning', 'exclamation-triangle');
    }
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartBadge();
    renderCart();
    showToast('Revista removida do carrinho.', 'error', 'x-circle');
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    const { totalItems, freeItems, totalPrice } = calculateTotal();

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-muted">Seu carrinho está vazio.</p>';
    } else {
        cart.forEach(item => {
            const produto = produtos.find(p => p.id === item.id);
            const listItem = document.createElement('div');
            listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            listItem.innerHTML = `
                ${produto.nome} (Qtd: ${item.quantity})
                <button class="btn btn-sm btn-danger" onclick="removeFromCart('${item.id}')"><i class="bi bi-trash"></i> Remover</button>
            `;
            cartItems.appendChild(listItem);
        });
    }

    const promoMessage = document.getElementById('promoMessage');
    if (freeItems > 0) {
        promoMessage.textContent = `Promoção ativa: ${freeItems} revista(s) grátis!`;
        promoMessage.style.display = 'block';
    } else {
        promoMessage.style.display = 'none';
    }

    document.getElementById('cartTotal').textContent = totalPrice.toFixed(2);
}

// Finalizar via WhatsApp
function finalizeOrder() {
    const { totalItems, freeItems, totalPrice } = calculateTotal();
    if (totalItems === 0) {
        showToast('Carrinho vazio!', 'warning', 'exclamation-triangle');
        return;
    }

    let message = 'Olá! Gostaria de comprar:\n';
    cart.forEach(item => {
        message += `- Revista ${item.id} (Qtd: ${item.quantity})\n`;
    });
    if (freeItems > 0) {
        message += `\nPromoção: ${freeItems} revista(s) grátis!\n`;
    }
    message += `\nTotal: R$ ${totalPrice.toFixed(2)}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5512982499196?text=${encodedMessage}`, '_blank');
}

// Eventos
document.addEventListener('DOMContentLoaded', () => {
    renderCatalog();
    updateCartBadge();
    renderCart();

    // Abrir Offcanvas do Carrinho
    const cartOffcanvas = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
    document.getElementById('openCartBtn').addEventListener('click', () => cartOffcanvas.show());
    document.getElementById('floatingCartBtn').addEventListener('click', () => cartOffcanvas.show());

    // Finalizar
    document.getElementById('finalizeBtn').addEventListener('click', finalizeOrder);

    // Fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            bootstrap.Modal.getInstance(document.getElementById('previewModal'))?.hide();
            cartOffcanvas.hide();
        }
    });
});
