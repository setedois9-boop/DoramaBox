/**
 * DoramaBox - Lógica da Interface Mobile
 */

document.addEventListener("DOMContentLoaded", () => {
  setupWhatsAppLinks();
});

function setupWhatsAppLinks() {
  // 1. Botão Flutuante (Todas as Páginas / Canto Inferior Direito)
  // Mensagem: "Olá! Conheci o DoramaBox e gostaria de receber ajuda sobre o aplicativo e o acesso vitalício de R$ 9,90."
  const floatingBtn = document.getElementById("floatingWhatsappBtn");
  if (floatingBtn) {
    floatingBtn.href = getWhatsAppUrl("main");
  }

  // 2. Botão Secundário na Seção de Download (Abaixo de BAIXAR APK)
  // Mensagem: "Olá! Preciso de ajuda para baixar ou instalar o APK do DoramaBox."
  const downloadSupport = document.getElementById("downloadSupportLink");
  if (downloadSupport) {
    downloadSupport.href = getWhatsAppUrl("download");
  }

  // 3. Link do WhatsApp dentro do Modal
  const modalWhatsapp = document.getElementById("modalWhatsappHelp");
  if (modalWhatsapp) {
    modalWhatsapp.href = getWhatsAppUrl("download");
  }
}

function toggleFaq(btn) {
  const item = btn.parentElement;
  if (!item) return;
  const wasActive = item.classList.contains("active");
  document.querySelectorAll(".mobile-faq-item").forEach(i => i.classList.remove("active"));
  if (!wasActive) item.classList.add("active");
}
