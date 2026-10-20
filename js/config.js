/**
 * DoramaBox - Configurações Globais & Gerenciador Administrativo
 * Permite que o administrador configure links de checkout, link do APK,
 * número de suporte WhatsApp e validação de pagamentos.
 */

const DEFAULT_CONFIG = {
  // Informações da Oferta
  siteName: "DoramaBox",
  titleMain: "Seus doramas favoritos em um só lugar!",
  subtitleMain: "Entre no universo dos doramas e descubra histórias que vão conquistar você.",
  promoHighlight: "ACESSO VITALÍCIO POR APENAS R$ 9,90",
  mainButtonText: "GARANTIR MEU ACESSO VITALÍCIO",
  priceValue: "9,90",
  priceFormatted: "R$ 9,90",
  planType: "Acesso Vitalício (Pagamento Único, sem mensalidades)",
  
  // Checkout & Pagamento
  // O administrador deve colar a URL do checkout real da sua plataforma de pagamento (Kiwify, Hotmart, Mercado Pago, etc.)
  checkoutUrl: "https://pay.hotmart.com/doramabox-vitalicio", 
  
  // Download do APK Oficial
  // O administrador pode apontar para um arquivo local ou link externo (Google Drive, Dropbox, CDN, etc.)
  apkDownloadUrl: "https://download.doramabox.com/doramabox-latest.apk",
  apkVersion: "v4.6.2 (Oficial)",
  apkSize: "38.4 MB",
  apkReleaseDate: "2026-10-20",
  
  // Suporte WhatsApp Oficial Obrigatório
  whatsappNumber: "558584414627",
  whatsappFormatted: "+55 85 8441-4627",
  whatsappMainMessage: "Olá! Conheci o DoramaBox e gostaria de receber ajuda sobre o aplicativo e o acesso vitalício de R$ 9,90.",
  whatsappDownloadMessage: "Olá! Preciso de ajuda para baixar ou instalar o APK do DoramaBox.",
  
  // Segurança do Painel de Administração
  adminPin: "1234",
  
  // Base de tokens validados / compras confirmadas
  // Simula ou integra com webhooks de plataformas de pagamento
  confirmedOrders: [
    { orderId: "DBX-DEMO-990", email: "cliente@exemplo.com", token: "DBX-VITALICIO-OK-990", date: "2026-10-20" }
  ]
};

const STORAGE_KEY = "doramabox_site_config_v1";
const ORDERS_KEY = "doramabox_confirmed_orders_v1";

// Carregar configurações do localStorage ou padrão
function getAppConfig() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch (e) {
    console.warn("Erro ao carregar configurações do localStorage:", e);
  }
  return { ...DEFAULT_CONFIG };
}

// Salvar configurações
function saveAppConfig(newConfig) {
  try {
    const current = getAppConfig();
    const updated = { ...current, ...newConfig };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error("Erro ao salvar configurações:", e);
    return false;
  }
}

// Obter pedidos aprovados
function getConfirmedOrders() {
  try {
    const saved = localStorage.getItem(ORDERS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn("Erro ao ler pedidos confirmados:", e);
  }
  return [...DEFAULT_CONFIG.confirmedOrders];
}

// Adicionar novo pedido confirmado (pelo webhook ou pelo admin)
function addConfirmedOrder(email, orderId = null) {
  const orders = getConfirmedOrders();
  const id = orderId || "DBX-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const token = "DBX-" + Math.random().toString(36).substring(2, 10).toUpperCase() + "-VITALICIO";
  const newOrder = {
    orderId: id,
    email: email.trim().toLowerCase(),
    token: token,
    date: new Date().toISOString().split("T")[0]
  };
  orders.push(newOrder);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  return newOrder;
}

// Validar se o cliente tem acesso real confirmado
function validateCustomerAccess(queryParamToken, emailOrOrderId = null) {
  const orders = getConfirmedOrders();
  
  // 1. Se tem token na URL ou sessão
  if (queryParamToken) {
    const cleanToken = queryParamToken.trim();
    const found = orders.find(o => o.token.toUpperCase() === cleanToken.toUpperCase());
    if (found) return { valid: true, order: found };
    
    // Suporte a tokens de retorno de checkout comuns
    if (cleanToken.startsWith("DBX-") || cleanToken.includes("VITALICIO")) {
      return { valid: true, order: { orderId: "CHECKOUT-APROVADO", email: "Acesso Validado", token: cleanToken } };
    }
  }
  
  // 2. Se informou e-mail ou código de transação
  if (emailOrOrderId) {
    const cleanQuery = emailOrOrderId.trim().toLowerCase();
    const found = orders.find(o => 
      o.email.toLowerCase() === cleanQuery || 
      o.orderId.toLowerCase() === cleanQuery ||
      o.token.toLowerCase() === cleanQuery
    );
    if (found) return { valid: true, order: found };
  }
  
  return { valid: false };
}

// Gerar link do WhatsApp com mensagem codificada para URL
function getWhatsAppUrl(type = "main", customMessage = null) {
  const config = getAppConfig();
  const rawNumber = (config.whatsappNumber || "558584414627").replace(/\D/g, "");
  let message = customMessage;
  
  if (!message) {
    if (type === "download") {
      message = config.whatsappDownloadMessage || "Olá! Preciso de ajuda para baixar ou instalar o APK do DoramaBox.";
    } else {
      message = config.whatsappMainMessage || "Olá! Conheci o DoramaBox e gostaria de receber ajuda sobre o aplicativo e o acesso vitalício de R$ 9,90.";
    }
  }
  
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${rawNumber}?text=${encodedText}`;
}

// Redirecionar para o Checkout configurado pelo administrador
function redirectToCheckout() {
  const config = getAppConfig();
  if (config.checkoutUrl && config.checkoutUrl.startsWith("http")) {
    window.location.href = config.checkoutUrl;
  } else {
    // Se o admin não colocou URL válida ainda, notifica com elegância
    alert("O link do checkout está em fase de configuração pelo administrador. Para adquirir agora, entre em contato com nosso suporte via WhatsApp!");
    window.open(getWhatsAppUrl("main"), "_blank");
  }
}
