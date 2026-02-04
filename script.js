// --- CONFIGURACIÓN PERSONAL ---
const startDate = new Date("2023-01-20T00:00:00");

// 1. Iniciar Experiencia
window.startExperience = function () {
    const mainCard = document.getElementById('main-card');
    const audio = document.getElementById('bg-music');

    document.getElementById('overlay').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('overlay').style.display = 'none';
        if (mainCard) {
            mainCard.style.display = 'block';
            fireConfetti(); // Lanzar confeti al inicio
        }
        if (audio) {
            audio.play().catch(e => console.log("Audio playback error:", e));
        }
    }, 800);
}

// 2. Confetti de Corazones
function fireConfetti() {
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);

        const particleCount = 40 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            colors: ['#ffb7b2', '#ff85a1', '#ffdac1'],
            shapes: ['heart']
        }));
        confetti(Object.assign({}, defaults, {
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            colors: ['#ffb7b2', '#ff85a1', '#ffdac1'],
            shapes: ['heart']
        }));
    }, 250);
}

// 3. Carta Secreta
window.openLetter = function () {
    const container = document.getElementById('letter-container');
    const content = document.getElementById('letter-content');
    container.style.display = 'flex';
    setTimeout(() => content.classList.add('show'), 10);
}

window.closeLetter = function () {
    const container = document.getElementById('letter-container');
    const content = document.getElementById('letter-content');
    content.classList.remove('show');
    setTimeout(() => container.style.display = 'none', 500);
}

// 4. Lightbox para Fotos
window.closeLightbox = function () {
    document.getElementById('lightbox').classList.remove('active');
}

// Inicialización de componentes
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('track');
    const dots = document.querySelectorAll('.dot');
    const mainCard = document.getElementById('main-card');
    let currentIdx = 0;
    const totalSlides = 3;

    function updateCarousel() {
        if (!track) return;
        track.style.transform = `translateX(-${currentIdx * 100}%)`;
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIdx));
    }

    window.nextSlide = function () {
        currentIdx = (currentIdx + 1) % totalSlides;
        updateCarousel();
    }

    window.prevSlide = function () {
        currentIdx = (currentIdx - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    if (mainCard) {
        let touchStartX = 0;
        mainCard.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
        mainCard.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].clientX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) window.nextSlide();
                else window.prevSlide();
            }
        }, { passive: true });
    }

    if (track) {
        track.addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG') {
                const lightbox = document.getElementById('lightbox');
                const lightboxImg = document.getElementById('lightbox-img');
                if (lightbox && lightboxImg) {
                    lightboxImg.src = e.target.src;
                    lightbox.classList.add('active');
                }
            }
        });
    }

    // --- Efecto de Fondo (Estrellas) ---
    const canvas = document.getElementById('canvas-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        }
        window.addEventListener('resize', resize);

        class Particle {
            constructor() { this.init(); }
            init() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 15 + 2;
                this.opacity = Math.random() * 0.8 + 0.2;
                this.text = Math.random() > 0.95 ? '⭐' : (Math.random() > 0.9 ? '✨' : '·');
            }
            update() {
                this.opacity += (Math.random() - 0.5) * 0.05;
                if (this.opacity < 0.1) this.opacity = 0.1;
                if (this.opacity > 1) this.opacity = 1;
            }
            draw() {
                ctx.save();
                ctx.globalAlpha = this.opacity;
                if (this.text === '·') {
                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size / 4, 0, Math.PI * 2);
                    ctx.fill();
                } else {
                    ctx.font = `${this.size}px serif`;
                    ctx.fillText(this.text, this.x, this.y);
                }
                ctx.restore();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < 120; i++) particles.push(new Particle());
        }

        resize();

        function animate() {
            ctx.clearRect(0, 0, width, height);

            const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width);
            gradient.addColorStop(0, 'rgba(30, 0, 80, 0.1)');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }
});
