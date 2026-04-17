/* ═══════════════════════════════════════════════════════
   Faisal Alhelali — Physical Replica Script
   ═══════════════════════════════════════════════════════ */

const card = document.getElementById('card');
const toast = document.getElementById('toast');

// Initialize Icons
lucide.createIcons();

// ── Flip Logic ────────────────────────────────────
card.addEventListener('click', (e) => {
    // Don't flip if clicking a contact link or the save button
    if (e.target.closest('a')) return;
    
    // Reset transform style to allow CSS class rotation to take over
    card.style.transform = '';
    card.classList.toggle('is-flipped');
});

// For mobile, help ensure the flip is seamless
card.addEventListener('touchstart', (e) => {
    if (e.target.closest('a')) return;
    // We don't preventDefault to allow clicking, but we can pre-clear transforms
    if (!card.classList.contains('is-flipped')) {
        card.style.transform = '';
    }
}, {passive: true});

// ── Interaction handlers for visual feedback ──────
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        if (href.startsWith('tel:')) {
            // Also attempt to copy the phone number if possible
            const phone = '+966533301766';
            navigator.clipboard.writeText(phone).then(() => {
                showToast('Phone number copied for dialing!');
            }).catch(() => {
                showToast('Opening dialer...');
            });
        }
        else if (href.startsWith('mailto:')) {
            showToast('Opening Email...');
        }
        else if (href.includes('linkedin.com')) {
            showToast('Opening LinkedIn...');
        }
        else if (href.endsWith('.vcf')) {
            showToast('Downloading contact to device...');
        }
    });
});

// ── Toast helper ─────────────────────────────────
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 2500);
}

// ── Realistic 3D floating effect (desktop only) ──
const cardScene = document.querySelector('.card-scene');

if (window.matchMedia("(min-width: 768px)").matches) {
    cardScene.addEventListener('mousemove', (e) => {
        if (card.classList.contains('is-flipped')) return;

        const rect = cardScene.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Subtle realistic rotation to feel like you're looking over it
        card.style.transition = 'transform 0.1s ease-out';
        card.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-5px)`;
        // add a dynamic shadow effect on hover
        card.querySelector('.card-front').style.boxShadow = `
            ${-x * 40}px ${y * 40 + 50}px 80px -20px rgba(0,0,0,0.9), 
            inset 0 0 0 1px rgba(255,255,255,0.05)
        `;
    });

    cardScene.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        if (!card.classList.contains('is-flipped')) {
            card.style.transform = 'rotateY(0deg) rotateX(0deg) translateY(0px)';
        }
        
        // Reset shadow
        card.querySelector('.card-front').style.transition = 'box-shadow 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        card.querySelector('.card-front').style.boxShadow = `
            0 40px 80px -20px rgba(0,0,0,0.9), 
            inset 0 0 0 1px rgba(255,255,255,0.03)
        `;
        
        setTimeout(() => {
            card.querySelector('.card-front').style.transition = 'none';
        }, 800);
    });
}
