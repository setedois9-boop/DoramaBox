/**
 * DoramaBox - Lógica da Interface Mobile
 */

document.addEventListener("DOMContentLoaded", () => {
  setupWhatsAppLinks();
  initVslAutoplay();
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

  // 4. Link do Suporte no Banner Inferior
  const bottomSupport = document.getElementById("bottomSupportLink");
  if (bottomSupport) {
    bottomSupport.href = getWhatsAppUrl("download");
  }
}

// Inicializar Autoplay Automático do Vídeo VSL
function initVslAutoplay() {
  const video = document.getElementById("vslVideo");
  const unmuteBtn = document.getElementById("vslUnmuteBtn");
  if (!video) return;

  // Garante muted para cumprir a política estrita de autoplay dos navegadores mobile/desktop
  video.muted = true;
  video.playsInline = true;

  const playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Caso algum navegador bloqueie até muted autoplay, inicia no primeiro toque na tela
      const playOnTouch = () => {
        video.play();
        window.removeEventListener("touchstart", playOnTouch);
        window.removeEventListener("click", playOnTouch);
      };
      window.addEventListener("touchstart", playOnTouch, { once: true });
      window.addEventListener("click", playOnTouch, { once: true });
    });
  }

  // Ativação do áudio com 1 clique
  function enableAudio() {
    video.muted = false;
    video.volume = 1.0;
    if (unmuteBtn) {
      unmuteBtn.style.display = "none";
    }
  }

  if (unmuteBtn) {
    unmuteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      enableAudio();
    });
  }

  video.addEventListener("click", () => {
    if (video.muted) {
      enableAudio();
    }
  });
}

function toggleFaq(btn) {
  const item = btn.parentElement;
  if (!item) return;
  const wasActive = item.classList.contains("active");
  document.querySelectorAll(".mobile-faq-item").forEach(i => i.classList.remove("active"));
  if (!wasActive) item.classList.add("active");
}
