/**
 * DoramaBox - Lógica da Página Principal (index.html)
 * Configuração dos links dinâmicos, WhatsApp oficial com mensagem codificada,
 * filtros do catálogo de doramas e interatividade.
 */

document.addEventListener("DOMContentLoaded", () => {
  initWhatsAppButtons();
  initFaqAccordion();
  applyDynamicConfig();
  setupScrollEffects();
});

// Inicializar todos os botões de WhatsApp com o link codificado obrigatório
function initWhatsAppButtons() {
  const floatingBtn = document.getElementById("floatingWhatsappBtn");
  const footerWhatsapp = document.getElementById("footerWhatsappLink");
  
  // Link oficial obrigatório com mensagem pré-preenchida codificada
  const mainWhatsappUrl = getWhatsAppUrl("main");
  
  if (floatingBtn) {
    floatingBtn.href = mainWhatsappUrl;
    floatingBtn.setAttribute("target", "_blank");
  }
  
  if (footerWhatsapp) {
    footerWhatsapp.href = mainWhatsappUrl;
    const config = getAppConfig();
    footerWhatsapp.textContent = `WhatsApp Oficial: ${config.whatsappFormatted || "+55 85 8441-4627"}`;
  }
}

// Aplicar textos e valores dinâmicos a partir do config.js / localStorage
function applyDynamicConfig() {
  const config = getAppConfig();
  
  // Garantir que todos os botões de CTA chamem o checkout configurado
  const headerCta = document.getElementById("headerCtaBtn");
  if (headerCta && config.mainButtonText) {
    headerCta.textContent = config.mainButtonText;
  }
  
  const heroBtn = document.getElementById("heroMainBtn");
  if (heroBtn && config.mainButtonText) {
    // Mantém o ícone e atualiza o texto se necessário
    const icon = heroBtn.querySelector("svg");
    heroBtn.innerHTML = "";
    if (icon) heroBtn.appendChild(icon);
    heroBtn.append(" " + config.mainButtonText);
  }

  const pricingBtn = document.getElementById("pricingCtaBtn");
  if (pricingBtn && config.mainButtonText) {
    const icon = pricingBtn.querySelector("svg");
    pricingBtn.innerHTML = "";
    if (icon) pricingBtn.appendChild(icon);
    pricingBtn.append(" " + config.mainButtonText);
  }
}

// Interatividade do FAQ (Accordion)
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const questionBtn = item.querySelector(".faq-question");
    if (!questionBtn) return;
    questionBtn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      // Fechar outros
      faqItems.forEach(other => {
        if (other !== item) other.classList.remove("active");
      });
      // Alternar atual
      if (isActive) {
        item.classList.remove("active");
      } else {
        item.classList.add("active");
      }
    });
  });
}

// Filtro do Catálogo de Doramas
function filterCatalog(category) {
  const tabs = document.querySelectorAll(".catalog-tab");
  tabs.forEach(tab => tab.classList.remove("active"));
  
  // Ativa a tab clicada
  const activeBtn = Array.from(tabs).find(t => t.textContent.toLowerCase().includes(category) || (category === 'todos' && t.textContent.toLowerCase().includes('todos')));
  if (activeBtn) activeBtn.classList.add("active");

  const cards = document.querySelectorAll(".dorama-card");
  cards.forEach(card => {
    const cardCategories = card.getAttribute("data-category") || "";
    if (category === "todos" || cardCategories.includes(category)) {
      card.style.display = "flex";
      card.style.animation = "fadeIn 0.4s ease";
    } else {
      card.style.display = "none";
    }
  });
}

// Efeitos de Scroll & Header Sticky
function setupScrollEffects() {
  const header = document.getElementById("mainHeader");
  const mobileBar = document.getElementById("mobileBottomBar");
  
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    
    // Sombra no header
    if (header) {
      if (scrollY > 40) {
        header.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)";
      } else {
        header.style.boxShadow = "none";
      }
    }
  }, { passive: true });
}
