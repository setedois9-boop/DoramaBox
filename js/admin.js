/**
 * DoramaBox - Lógica do Painel Administrativo (admin.html)
 */

document.addEventListener("DOMContentLoaded", () => {
  loadCurrentSettings();
});

function loadCurrentSettings() {
  const config = getAppConfig();

  document.getElementById("cfgCheckoutUrl").value = config.checkoutUrl || "";
  document.getElementById("cfgApkUrl").value = config.apkDownloadUrl || "";
  document.getElementById("cfgApkVersion").value = config.apkVersion || "v4.6.2 (Oficial)";
  document.getElementById("cfgApkSize").value = config.apkSize || "38.4 MB";
  document.getElementById("cfgWhatsappNumber").value = config.whatsappNumber || "558584414627";
  document.getElementById("cfgWhatsappMainMsg").value = config.whatsappMainMessage || "";
  document.getElementById("cfgWhatsappDownloadMsg").value = config.whatsappDownloadMessage || "";
}

function saveAdminSettings(event) {
  event.preventDefault();

  const newConfig = {
    checkoutUrl: document.getElementById("cfgCheckoutUrl").value.trim(),
    apkDownloadUrl: document.getElementById("cfgApkUrl").value.trim(),
    apkVersion: document.getElementById("cfgApkVersion").value.trim(),
    apkSize: document.getElementById("cfgApkSize").value.trim(),
    whatsappNumber: document.getElementById("cfgWhatsappNumber").value.trim().replace(/\D/g, ""),
    whatsappMainMessage: document.getElementById("cfgWhatsappMainMsg").value.trim(),
    whatsappDownloadMessage: document.getElementById("cfgWhatsappDownloadMsg").value.trim()
  };

  const success = saveAppConfig(newConfig);

  if (success) {
    showToast("✅ Configurações salvas com sucesso!");
  } else {
    showToast("❌ Erro ao salvar configurações no navegador.");
  }
}

function handleGenerateToken() {
  const emailInput = document.getElementById("newCustomerEmail");
  const email = emailInput.value.trim();

  if (!email || !email.includes("@")) {
    alert("Por favor, digite um e-mail válido para gerar o token do cliente.");
    return;
  }

  const newOrder = addConfirmedOrder(email);
  const fullUrl = `${window.location.origin}${window.location.pathname.replace("admin.html", "")}download.html?token=${newOrder.token}`;

  const container = document.getElementById("generatedLinkContainer");
  const textSpan = document.getElementById("generatedUrlText");

  textSpan.textContent = fullUrl;
  container.style.display = "block";

  showToast(`✅ Token gerado para ${email}! Link pronto para envio.`);
}

function copyGeneratedLink() {
  const text = document.getElementById("generatedUrlText").textContent;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("📋 Link copiado para a área de transferência!");
    });
  } else {
    alert("Copie o link manualmente: " + text);
  }
}

function restoreDefaults() {
  if (confirm("Deseja restaurar todas as configurações para o padrão original de fábrica?")) {
    localStorage.removeItem("doramabox_site_config_v1");
    loadCurrentSettings();
    showToast("🔄 Configurações restauradas para o padrão.");
  }
}

function showToast(message) {
  const toast = document.getElementById("toastMessage");
  if (!toast) return;
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 3500);
}
