// ========================================
// Slide Navigation Controller
// ========================================

(function () {
    'use strict';

    const container = document.getElementById('slidesContainer');
    const navDots = document.querySelectorAll('.nav-dot');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    let currentSlide = 0;
    let isTransitioning = false;

    // ---- Navigate to slide ----
    function goToSlide(index) {
        if (index < 0 || index >= totalSlides || isTransitioning) return;

        isTransitioning = true;
        currentSlide = index;

        // Move container
        container.style.transform = `translateX(-${index * 100}vw)`;

        // Update nav dots
        navDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        // Update arrow visibility
        prevBtn.classList.toggle('hidden', index === 0);
        nextBtn.classList.toggle('hidden', index === totalSlides - 1);

        // Trigger animations for the target slide
        triggerAnimations(slides[index]);

        // Allow transition to complete
        setTimeout(() => {
            isTransitioning = false;
        }, 800);
    }

    // ---- Trigger entrance animations ----
    function triggerAnimations(slide) {
        const elements = slide.querySelectorAll('.animate-in');
        elements.forEach(el => {
            el.classList.remove('visible');
            // Force reflow
            void el.offsetWidth;
            el.classList.add('visible');
        });
    }

    // ---- Event Listeners ----

    // Nav dots
    navDots.forEach(dot => {
        dot.addEventListener('click', () => {
            goToSlide(parseInt(dot.dataset.slide, 10));
        });
    });

    // Arrow buttons
    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            goToSlide(currentSlide - 1);
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault();
            goToSlide(currentSlide + 1);
        }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const SWIPE_THRESHOLD = 60;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > SWIPE_THRESHOLD) {
            if (diff > 0) {
                goToSlide(currentSlide + 1);
            } else {
                goToSlide(currentSlide - 1);
            }
        }
    }, { passive: true });

    // Mouse wheel navigation (horizontal scroll feeling)
    let wheelCooldown = false;
    document.addEventListener('wheel', (e) => {
        // Only act on significant horizontal intent or shift+scroll
        if (wheelCooldown) return;

        const isHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
        const delta = isHorizontal ? e.deltaX : e.deltaY;

        if (Math.abs(delta) < 30) return;

        wheelCooldown = true;
        if (delta > 0) {
            goToSlide(currentSlide + 1);
        } else {
            goToSlide(currentSlide - 1);
        }

        setTimeout(() => {
            wheelCooldown = false;
        }, 1200);
    }, { passive: true });

    // ---- Initial state ----
    prevBtn.classList.add('hidden');
    triggerAnimations(slides[0]);

    // ---- Table row highlight on hover (add subtle glow to the tier column) ----
    const tableRows = document.querySelectorAll('.comparison-table tbody tr');
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', () => {
            row.style.transition = 'background 0.3s ease';
        });
    });

    // ---- Intersection observer for scroll-triggered animations (within slides) ----
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        // Only observe elements in slide 0 initially
        slides[0].querySelectorAll('.animate-in').forEach(el => observer.observe(el));
    }

})();
