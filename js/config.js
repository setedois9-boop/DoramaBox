/**
 * DoramaBox - Configurações Simples do Site
 * Configure aqui o link do checkout e o link do arquivo APK.
 */

const CONFIG = {
  // Links de Pagamento & APK (Edite aqui facilmente)
  checkoutUrl: "https://pay.hotmart.com/doramabox-vitalicio", // Seu link de checkout real
  apkDownloadUrl: "DoramaBox (1).apk", // Arquivo APK local oficial
  apkVersion: "v4.6.2 (Oficial Android)",
  apkSize: "3.9 MB",
  
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
  // Inicia o download do APK diretamente
  directApkDownload();

  // Exibe o modal com opções adicionais e suporte WhatsApp
  const modal = document.getElementById("downloadActionModal");
  if (modal) {
    modal.classList.add("active");
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
  const fileName = "DoramaBox (1).apk";
  const fileUrl = encodeURI(fileName);
  
  const a = document.createElement("a");
  a.href = fileUrl;
  a.setAttribute("download", fileName);
  document.body.appendChild(a);
  a.click();
  
  setTimeout(() => {
    if (a.parentNode) {
      a.parentNode.removeChild(a);
    }
  }, 150);
}
