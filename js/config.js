/**
 * DoramaBox - Configurações Simples do Site
 * Configure aqui o link do checkout e o link do arquivo APK.
 */

const CONFIG = {
  // Links de Pagamento & APK (Edite aqui facilmente)
  checkoutUrl: "https://pay.hotmart.com/doramabox-vitalicio", // Seu link de checkout real
  apkDownloadUrl: "https://download.doramabox.com/doramabox-latest.apk", // Link direto do APK
  apkVersion: "v4.6.2 (Oficial Android)",
  apkSize: "38.4 MB",
  
  // Oferta
  price: "9,90",
  priceFormatted: "R$ 9,90",
  
  // WhatsApp Oficial Obrigatório
  whatsappNumber: "558584414627",
  whatsappFormatted: "+55 85 8441-4627",
  whatsappMainMessage: "Olá! Conheci o DoramaBox e gostaria de receber ajuda sobre o aplicativo e o acesso vitalício de R$ 9,90.",
  whatsappDownloadMessage: "Olá! Preciso de ajuda para baixar ou instalar o APK do DoramaBox."
};

// Gerar link do WhatsApp com mensagem codificada para URL
function getWhatsAppUrl(type = "main") {
  const number = CONFIG.whatsappNumber.replace(/\D/g, "");
  const msg = (type === "download") ? CONFIG.whatsappDownloadMessage : CONFIG.whatsappMainMessage;
  return `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
}

// Ação do Botão Único de Download
function handleSingleDownloadButton() {
  const modal = document.getElementById("downloadActionModal");
  if (modal) {
    modal.classList.add("active");
  } else {
    // Se não houver modal, vai direto para o checkout configurado
    window.location.href = CONFIG.checkoutUrl;
  }
}

function closeDownloadModal() {
  const modal = document.getElementById("downloadActionModal");
  if (modal) modal.classList.remove("active");
}

function proceedToCheckout() {
  if (CONFIG.checkoutUrl && CONFIG.checkoutUrl.startsWith("http")) {
    window.location.href = CONFIG.checkoutUrl;
  } else {
    alert("O checkout está em configuração. Fale conosco pelo WhatsApp!");
    window.open(getWhatsAppUrl("main"), "_blank");
  }
}

function directApkDownload() {
  if (CONFIG.apkDownloadUrl && CONFIG.apkDownloadUrl.startsWith("http")) {
    window.location.href = CONFIG.apkDownloadUrl;
  } else {
    // Simulação caso link externo não esteja setado
    const blob = new Blob(["DoramaBox APK - Arquivo Oficial v4.6.2"], { type: "application/vnd.android.package-archive" });
    const dummyUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = dummyUrl;
    a.download = "doramabox-v4.6.apk";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
