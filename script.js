// =========================
// Catálogo de Revistas
// =========================
const produtos = Array.from({ length: 28 }, (_, i) => ({
  id: i + 1,
  nome: `Revista ${String(i + 1).padStart(2, "0")}`,
  preco: 16.90,
  capa: `imagens/revista${String(i + 1).padStart(2, "0")}.webp`,
  passos: [
    `imagens/revista${String(i + 1).padStart(2, "0")}_passo01.webp`,
    `imagens/revista${String(i + 1).padStart(2, "0")}_passo02.webp`,
    `imagens/revista${String(i + 1).padStart(2, "0")}_passo03.webp`
  ]
}));

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

// =========================
// Renderizar Catálogo
// =========================
function renderCatalogo() {
  const catalogo = document.getElementById("catalog");
  catalogo.innerHTML = "";

  produtos.forEach(produto => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-3";

    col.innerHTML = `
      <div class="card h-100 border-primary">
        <img src="${produto.capa}" class="card-img-top" alt="${produto.nome}" 
             loading="lazy" onclick="abrirPreview(${produto.id})">
        <div class="card-body text-center">
          <h5 class="card-title">${produto.nome}</h5>
          <p class="card-text"><strong>R$ ${produto.preco.toFixed(2).replace(".", ",")}</strong></p>
          <button class="btn btn-primary w-100 mb-2" onclick="abrirPreview(${produto.id})">
            Ver Projetos
          </button>
          <button class="btn btn-success w-100" onclick="adicionarAoCarrinho(${produto.id})">
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    `;
    catalogo.appendChild(col);
  });
}

// =========================
// Pré-visualização (Modal)
// =========================
function abrirPreview(id) {
  const produto = produtos.find(p => p.id === id);
  const carouselInner = document.querySelector("#previewCarousel .carousel-inner");
  const carouselIndicators = document.querySelector("#previewCarousel .carousel-indicators");

  carouselInner.innerHTML = "";
  carouselIndicators.innerHTML = "";

  const imagens = [produto.capa, ...produto.passos];

  imagens.forEach((img, index) => {
    carouselIndicators.innerHTML += `
      <button type="button" data-bs-target="#previewCarousel" data-bs-slide-to="${index}" 
        ${index === 0 ? 'class="active" aria-current="true"' : ""} aria-label="Slide ${index + 1}">
      </button>`;

    carouselInner.innerHTML += `
      <div class="carousel-item ${index === 0 ? "active" : ""}">
        <img src="${img}" class="d-block w-100" alt="Slide ${index + 1}">
      </div>`;
  });

  new bootstrap.Modal(document.getElementById("previewModal")).show();
}

// =========================
// Carrinho
// =========================
function atualizarCarrinho() {
  const cartItems = document.getElementById("cartItems");
  const cartBadge = document.getElementById("cartBadge");
  const floatingCartBadge = document.getElementById("floatingCartBadge");
  const cartTotal = document.getElementById("cartTotal");
  const promoMessage = document.getElementById("promoMessage");

  cartItems.innerHTML = "";

  carrinho.forEach(item => {
    const produto = produtos.find(p => p.id === item.id);
    const li = document.createElement("div");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.innerHTML = `
      <span>${produto.nome}</span>
      <button class="btn btn-sm btn-outline-danger" onclick="removerDoCarrinho(${produto.id})">
        <i class="bi bi-trash"></i>
      </button>`;
    cartItems.appendChild(li);
  });

  cartBadge.textContent = carrinho.length;
  floatingCartBadge.textContent = carrinho.length;

  // Promoção
  let total = carrinho.length * 16.90;
  let brindes = Math.floor(carrinho.length / 4);
  let desconto = brindes * 16.90;
  let totalFinal = total - desconto;

  if (brindes > 0) {
    promoMessage.style.display = "block";
    promoMessage.textContent = `🎁 Promoção: Você ganhou ${brindes} revista(s) grátis!`;
  } else if (carrinho.length === 3) {
    promoMessage.style.display = "block";
    promoMessage.textContent = "✨ Adicione mais 1 revista e ganhe um brinde!";
  } else {
    promoMessage.style.display = "none";
  }

  cartTotal.textContent = totalFinal.toFixed(2).replace(".", ",");
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function adicionarAoCarrinho(id) {
  if (carrinho.some(item => item.id === id)) {
    mostrarToast("⚠️ Essa revista já está no carrinho!", "warning");
    return;
  }
  carrinho.push({ id });
  atualizarCarrinho();

  if (carrinho.length % 4 === 0) {
    mostrarToast("🎉 Parabéns! Você ganhou uma revista grátis!", "success");
  } else if (carrinho.length === 3) {
    mostrarToast("✨ Falta apenas 1 revista para ganhar um brinde!", "warning");
  } else {
    mostrarToast("✅ Revista adicionada ao carrinho!", "success");
  }
}

function removerDoCarrinho(id) {
  carrinho = carrinho.filter(item => item.id !== id);
  atualizarCarrinho();
  mostrarToast("🗑️ Revista removida do carrinho.", "error");
}

// =========================
// Toasts
// =========================
function mostrarToast(mensagem, tipo) {
  const container = document.querySelector(".toast-container");
  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-dark border-0 show toast-${tipo}`;
  toast.role = "alert";
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${mensagem}</div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"></button>
    </div>
  `;
  container.appendChild(toast);

  setTimeout(() => toast.remove(), 3000);
}

// =========================
// Finalizar Pedido (WhatsApp)
// =========================
document.getElementById("finalizeBtn").addEventListener("click", () => {
  if (carrinho.length === 0) {
    mostrarToast("⚠️ Seu carrinho está vazio!", "warning");
    return;
  }

  let mensagem = "✨ *Olá, Ana Paula!* Quero finalizar meu pedido ✨%0A%0A";
  mensagem += "📚 *Revistas escolhidas:*%0A";
  carrinho.forEach(item => {
    const produto = produtos.find(p => p.id === item.id);
    mensagem += `- ${produto.nome}%0A`;
  });

  if (carrinho.length >= 4) {
    let brindes = Math.floor(carrinho.length / 4);
    mensagem += `%0A🎁 *Promoção ativa:* Compre 3, leve 4! (ganhei ${brindes} brinde(s) 💕)%0A`;
  }

  let total = carrinho.length * 16.90;
  let desconto = Math.floor(carrinho.length / 4) * 16.90;
  let totalFinal = total - desconto;

  mensagem += `%0A💰 *Total:* R$ ${totalFinal.toFixed(2).replace(".", ",")}%0A%0A`;
  mensagem += "✅ Aguardando sua confirmação!";

  window.open(`https://wa.me/5512982499196?text=${mensagem}`, "_blank");
});

// =========================
// Inicialização
// =========================
document.getElementById("openCartBtn").addEventListener("click", () => {
  new bootstrap.Offcanvas(document.getElementById("cartOffcanvas")).show();
});

document.getElementById("floatingCartBtn").addEventListener("click", () => {
  new bootstrap.Offcanvas(document.getElementById("cartOffcanvas")).show();
});

renderCatalogo();
atualizarCarrinho();
