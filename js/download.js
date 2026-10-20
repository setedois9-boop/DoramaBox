/**
 * DoramaBox - Lógica da Página de Download do APK e Validação de Pagamento
 * Controla o bloqueio/desbloqueio do download, validação real de pagamento,
 * e os botões obrigatórios de suporte WhatsApp com mensagens pré-preenchidas.
 */

document.addEventListener("DOMContentLoaded", () => {
  setupWhatsAppLinks();
  checkAccessStatus();
  updateApkDetails();
});

// Configurar links de suporte WhatsApp com as mensagens obrigatórias exatas
function setupWhatsAppLinks() {
  const config = getAppConfig();

  // 1. Botão secundário na seção de download (OBRIGATÓRIO 3):
  // Mensagem: "Olá! Preciso de ajuda para baixar ou instalar o APK do DoramaBox."
  const downloadSupportBtn = document.getElementById("downloadSupportWhatsappBtn");
  if (downloadSupportBtn) {
    downloadSupportBtn.href = getWhatsAppUrl("download");
  }

  // 2. Botão flutuante no canto inferior direito (OBRIGATÓRIO 2):
  // Mensagem: "Olá! Conheci o DoramaBox e gostaria de receber ajuda sobre o aplicativo e o acesso vitalício de R$ 9,90."
  const floatingWhatsappBtn = document.getElementById("floatingWhatsappBtn");
  if (floatingWhatsappBtn) {
    floatingWhatsappBtn.href = getWhatsAppUrl("main");
  }

  // 3. Botão do header e link de auxílio na validação
  const headerSupportBtn = document.getElementById("headerSupportBtn");
  if (headerSupportBtn) {
    headerSupportBtn.href = getWhatsAppUrl("download");
    headerSupportBtn.setAttribute("target", "_blank");
  }

  const helpValidateWhatsapp = document.getElementById("helpValidateWhatsapp");
  if (helpValidateWhatsapp) {
    helpValidateWhatsapp.href = getWhatsAppUrl("main", "Olá! Já realizei o pagamento de R$ 9,90 e gostaria de validar meu acesso ao APK do DoramaBox.");
    helpValidateWhatsapp.setAttribute("target", "_blank");
  }
}

// Atualizar informações da versão e tamanho do APK
function updateApkDetails() {
  const config = getAppConfig();
  const apkVersionText = document.getElementById("apkVersionText");
  const apkSizeText = document.getElementById("apkSizeText");

  if (apkVersionText && config.apkVersion) {
    apkVersionText.textContent = config.apkVersion;
  }
  if (apkSizeText && config.apkSize) {
    apkSizeText.textContent = config.apkSize;
  }
}

// Verificar se o acesso está validado (por URL param, sessionStorage ou base local)
function checkAccessStatus() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const orderId = params.get("order_id");
  const email = params.get("email");
  const sessionValid = sessionStorage.getItem("doramabox_access_validated");

  const blockedGate = document.getElementById("gateBlockedState");
  const approvedGate = document.getElementById("gateApprovedState");

  // Se já foi validado na sessão atual
  if (sessionValid === "true") {
    showApprovedState();
    return;
  }

  // Se veio com token ou e-mail/pedido na URL
  if (token || orderId || email) {
    const result = validateCustomerAccess(token, email || orderId);
    if (result.valid) {
      sessionStorage.setItem("doramabox_access_validated", "true");
      showApprovedState();
      return;
    }
  }

  // Não validado: exibe tela de bloqueio e formulário de validação
  showBlockedState();
}

function showApprovedState() {
  const blockedGate = document.getElementById("gateBlockedState");
  const approvedGate = document.getElementById("gateApprovedState");
  if (blockedGate) blockedGate.style.display = "none";
  if (approvedGate) approvedGate.style.display = "block";
}

function showBlockedState() {
  const blockedGate = document.getElementById("gateBlockedState");
  const approvedGate = document.getElementById("gateApprovedState");
  if (blockedGate) blockedGate.style.display = "block";
  if (approvedGate) approvedGate.style.display = "none";
}

// Validação manual através do formulário
function handleValidateForm(event) {
  event.preventDefault();
  const input = document.getElementById("clientIdentifier");
  const feedback = document.getElementById("validationFeedback");
  if (!input) return;

  const query = input.value.trim();
  if (!query) return;

  const result = validateCustomerAccess(null, query);

  if (result.valid) {
    feedback.style.display = "block";
    feedback.style.background = "#DCFCE7";
    feedback.style.color = "#15803D";
    feedback.style.border = "1px solid #86EFAC";
    feedback.innerHTML = "✅ Pagamento validado com sucesso! Liberando download...";

    sessionStorage.setItem("doramabox_access_validated", "true");
    setTimeout(() => {
      showApprovedState();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 900);
  } else {
    feedback.style.display = "block";
    feedback.style.background = "#FEE2E2";
    feedback.style.color = "#B91C1C";
    feedback.style.border = "1px solid #FCA5A5";
    feedback.innerHTML = "❌ Não localizamos a confirmação de pagamento para este dado. Se você realizou o pagamento via Pix ou cartão, verifique o e-mail digitado ou <a href='" + getWhatsAppUrl("download") + "' target='_blank' style='color:#B91C1C;font-weight:700;text-decoration:underline;'>fale diretamente com o suporte no WhatsApp</a> para liberação imediata.";
  }
}

// Download do arquivo APK
function handleApkDownload() {
  const config = getAppConfig();
  const apkUrl = config.apkDownloadUrl;

  if (apkUrl && apkUrl.startsWith("http")) {
    window.location.href = apkUrl;
  } else {
    // Se ainda for caminho de demonstração ou local
    alert("Iniciando o download do APK oficial do DoramaBox. Siga o passo a passo abaixo para concluir a instalação no seu Android!");
    // Cria um download de simulação caso não haja link externo configurado
    const blob = new Blob(["DoramaBox APK - Arquivo Oficial v4.6.2"], { type: "application/vnd.android.package-archive" });
    const dummyUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = dummyUrl;
    a.download = "DoramaBox-v4.6.apk";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

// Trocar abas de instruções (Android vs Smart TV)
function switchInstallTab(tabId) {
  const tabs = document.querySelectorAll(".tab-content");
  const btns = document.querySelectorAll(".install-tab-btn");

  tabs.forEach(tab => tab.classList.remove("active"));
  btns.forEach(btn => btn.classList.remove("active"));

  const targetTab = document.getElementById(tabId);
  if (targetTab) targetTab.classList.add("active");

  const activeBtn = Array.from(btns).find(b => 
    (tabId === "tabAndroid" && b.textContent.includes("Android")) ||
    (tabId === "tabTv" && b.textContent.includes("Smart TV"))
  );
  if (activeBtn) activeBtn.classList.add("active");
}
