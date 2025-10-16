const video = document.getElementById("promoVideo");

video.addEventListener("click", e => e.preventDefault());
video.addEventListener("mouseenter", () => {
    video.style.transition = "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out";
    video.style.transform = "scale(1.05)";
    video.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.6)";
});

video.addEventListener("mouseleave", () => {
    video.style.transform = "scale(1)";
    video.style.boxShadow = "none";
});

// Controles de Video


document.addEventListener('DOMContentLoaded', function() {
    
    // Obtener el video
    const promoVideo = document.getElementById('promoVideo');
    
    if (promoVideo) {

        // Activar controles del video
       
        promoVideo.controls = true;
        
        // Quitar muted para que tenga audio
        promoVideo.muted = false;
        
        // Establecer volumen inicial (70%)
        promoVideo.volume = 0.7;
        
        // Quitar autoplay
        promoVideo.autoplay = false;
        
        console.log('Controles de video activados');
        

        // Reprocir automaticamente cuando este visible
        // (Solo después de que el usuario lo active)
    
        let videoActivado = false; // Bandera para saber si el usuario ya lo activó
        
        // Detectar cuando el usuario da play por primera vez
        promoVideo.addEventListener('play', function() {
            videoActivado = true;
            console.log('Video activado por el usuario');
        });
        
       
        // Reproducir/Pausar al hacer click en el video         
        promoVideo.addEventListener('click', function(e) {

            // Evitar que el click en los controles active esta función
            if (e.target === promoVideo) {
                if (promoVideo.paused) {
                    promoVideo.play();
                    videoActivado = true;
                    console.log('Video reproduciendo (click en video)');
                } else {
                    promoVideo.pause();
                    console.log('Video pausado (click en video)');
                }
            }
        });
        
        // Cambiar cursor al pasar sobre el video
        promoVideo.style.cursor = 'pointer';
        
        // Observer para detectar cuando el video es visible
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                // Si el video está visible Y ya fue activado por el usuario
                if (entry.isIntersecting && videoActivado) {
                    promoVideo.play().catch(function(error) {
                        console.log('No se pudo reproducir automáticamente:', error);
                    });
                    console.log('▶️ Video reproduciéndose (visible en pantalla)');
                }
                // Si el video NO está visible, pausarlo
                else if (!entry.isIntersecting && videoActivado) {
                    promoVideo.pause();
                    console.log('⏸️ Video pausado (fuera de pantalla)');
                }
            });
        }, { 
            threshold: 0.5 // El video debe estar al menos 50% visible
        });
        
       observer.observe(promoVideo);
    }
});


// Efectos tarjetas de valores
document.addEventListener('DOMContentLoaded', function() {

  // Selecciona todas las tarjetas en la sección valores
  const valueCards = document.querySelectorAll('.grid.grid-cols-1 > div');

  valueCards.forEach((card, index) => {
    // Aplicar transición suave para todas las transformaciones
    card.style.transition = 'all 0.6s ease-out';

    // Zoom al hacer hover 
    card.addEventListener('mouseenter', function() {
      // Agrandar la tarjeta
      this.style.transform = 'scale(1.1)';
      // Agregar sombra para efecto de “elevación”
      this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.6)';
    });

  // Al quitar el cursor de la tarjeta 
    card.addEventListener('mouseleave', function() {
      // Volver al tamaño original
      this.style.transform = 'scale(1)';
      // Quitar sombra
      this.style.boxShadow = '';
    });

    // Zoom al hacer clic
    card.addEventListener('click', function() {
      // Hacer un zoom más fuerte momentáneo
      this.style.transform = 'scale(1.15)';
      // Después de 200 ms, regresar a un estado de “hover” más suave
      setTimeout(() => {
        this.style.transform = 'scale(1.1)';
      }, 200);
    });

    // — Animación automática del ícono dentro de la tarjeta
    // Buscar el elemento del ícono que tiene clases de tipo bg
    const icon = card.querySelector(
      '[class*="bg-sky-100"], ' +
      '[class*="bg-emerald-100"], ' +
      '[class*="bg-amber-100"], ' +
      '[class*="bg-indigo-100"], ' +
      '[class*="bg-rose-100"]'
    );

    if (icon) {
      // Darle una transición para transformaciones del ícono
      icon.style.transition = 'transform 0.8s ease-in-out';

      // Función que define la animación del ícono
      function animateIcon() {
        // Aplicar escala + rotación 360°
        icon.style.transform = 'scale(1.2) rotate(360deg)';
        // Después de 800 ms, volver al estado original
        setTimeout(() => {
          icon.style.transform = 'scale(1) rotate(0deg)';
        }, 800);
      }

      // Iniciar la animación con un retraso distinto para cada tarjeta
      setTimeout(() => {
        animateIcon();
        // Repetir la animación cada 3 segundos
        setInterval(animateIcon, 3000);
      }, index * 500);
    }
  });
});