/* ============================================
   🎀 KAWAII APOLOGY WEBSITE - SCRIPT.JS
   For Arya from Cia Imup
   ============================================ */

// --- State ---
let currentScreen = 'screen-landing';
let noCount = 0;
let reasonIndex = 0;
let reasonInterval = null;
let musicPlaying = false;

// --- DOM Elements ---
const screens = {
    landing: document.getElementById('screen-landing'),
    apology: document.getElementById('screen-apology'),
    reasons: document.getElementById('screen-reasons'),
    question: document.getElementById('screen-question'),
    celebration: document.getElementById('screen-celebration'),
};

const btnOpen = document.getElementById('btn-open');
const btnNextApology = document.getElementById('btn-next-apology');
const btnNextReasons = document.getElementById('btn-next-reasons');
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');
const btnReplay = document.getElementById('btn-replay');
const musicToggle = document.getElementById('music-toggle');
const musicIcon = document.getElementById('music-icon');
const bgMusic = document.getElementById('bg-music');
const typewriterText = document.getElementById('typewriter-text');
const typingCursor = document.getElementById('typing-cursor');
const noCounter = document.getElementById('no-counter');
const noCountSpan = document.getElementById('no-count');
const bearMouth = document.getElementById('bear-mouth');
const buttonContainer = document.getElementById('button-container');
const confettiContainer = document.getElementById('confetti-container');
const floatingElements = document.getElementById('floating-elements');

// --- Floating Background Elements ---
const floatingEmojis = ['💕', '🌸', '✨', '💗', '🎀', '⭐', '🩷', '💫', '🦋', '🌷', '💝', '🫧'];

function createFloatingElement() {
    const el = document.createElement('span');
    el.classList.add('floating-item');
    el.textContent = floatingEmojis[Math.floor(Math.random() * floatingEmojis.length)];
    el.style.left = Math.random() * 100 + '%';
    el.style.fontSize = (14 + Math.random() * 20) + 'px';
    el.style.animationDuration = (8 + Math.random() * 12) + 's';
    el.style.animationDelay = Math.random() * 5 + 's';
    el.style.opacity = 0.3 + Math.random() * 0.4;
    floatingElements.appendChild(el);

    // Remove after animation
    const duration = parseFloat(el.style.animationDuration) + parseFloat(el.style.animationDelay);
    setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
    }, duration * 1000);
}

// Start floating elements
function startFloating() {
    for (let i = 0; i < 8; i++) {
        setTimeout(createFloatingElement, i * 600);
    }
    setInterval(createFloatingElement, 2000);
}

startFloating();

// --- Screen Navigation ---
function goToScreen(screenId) {
    // Hide current
    Object.values(screens).forEach(s => s.classList.remove('active'));

    // Show target
    const target = document.getElementById(screenId);
    setTimeout(() => {
        target.classList.add('active');
        currentScreen = screenId;

        // Trigger screen-specific actions
        if (screenId === 'screen-apology') startTypewriter();
        if (screenId === 'screen-reasons') startReasonCarousel();
        if (screenId === 'screen-celebration') startCelebration();
    }, 400);
}

// --- Screen 1: Landing ---
btnOpen.addEventListener('click', () => {
    // Envelope open animation
    const envelope = document.getElementById('envelope');
    envelope.style.animation = 'none';
    envelope.style.transform = 'scale(1.2)';
    setTimeout(() => {
        envelope.style.transition = 'all 0.5s ease';
        envelope.style.transform = 'scale(0) rotate(10deg)';
        envelope.style.opacity = '0';
    }, 200);
    setTimeout(() => goToScreen('screen-apology'), 700);

    // Try to play music
    tryPlayMusic();
});

// Also allow clicking the envelope
document.getElementById('envelope').addEventListener('click', () => {
    btnOpen.click();
});

// --- Screen 2: Apology (Typewriter) ---
const apologyMessages = [
    "Arya... aku tau kamu lagi sedih karna akuuuu...😿",
    "Aku tau aku sering nyakitinn kamu..",
    "Aku tau aku sering bikin kamu kecewaa...",
    "Dan mungkin aku belum jadi yang terbaik buat kamuu...",
    "Aku tauu, aku salaaa besarrr...",
    "Tolong maaafinn ciaaaa yyaaaa...."
];

let messageIndex = 0;
let charIndex = 0;
let typewriterTimer = null;
let isTyping = false;

function startTypewriter() {
    messageIndex = 0;
    charIndex = 0;
    typewriterText.textContent = '';
    typingCursor.style.display = 'inline-block';
    btnNextApology.classList.add('hidden');
    btnNextApology.classList.remove('show');
    typeNextMessage();
}

function typeNextMessage() {
    if (messageIndex >= apologyMessages.length) {
        // Done typing all messages
        typingCursor.style.display = 'none';
        btnNextApology.classList.remove('hidden');
        btnNextApology.classList.add('show');
        return;
    }

    isTyping = true;
    const currentMessage = apologyMessages[messageIndex];
    charIndex = 0;

    // Clear for new message with animation
    if (messageIndex > 0) {
        typewriterText.style.opacity = '0';
        typewriterText.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            typewriterText.textContent = '';
            typewriterText.style.opacity = '1';
            typewriterText.style.transform = 'translateY(0)';
            typewriterText.style.transition = 'all 0.3s ease';
            typeChar(currentMessage);
        }, 400);
    } else {
        typeChar(currentMessage);
    }
}

function typeChar(message) {
    if (charIndex < message.length) {
        typewriterText.textContent += message[charIndex];
        charIndex++;
        typewriterTimer = setTimeout(() => typeChar(message), 45 + Math.random() * 35);
    } else {
        isTyping = false;
        // Pause, then next message
        setTimeout(() => {
            messageIndex++;
            typeNextMessage();
        }, 1500);
    }
}

btnNextApology.addEventListener('click', () => {
    goToScreen('screen-reasons');
});

// --- Screen 3: Reasons Carousel ---
function startReasonCarousel() {
    reasonIndex = 0;
    const cards = document.querySelectorAll('.reason-card');
    const dotsContainer = document.getElementById('carousel-dots');

    // Create dots
    dotsContainer.innerHTML = '';
    cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => showReason(i));
        dotsContainer.appendChild(dot);
    });

    // Show first card
    cards.forEach(c => {
        c.classList.remove('active', 'exit-left');
    });
    cards[0].classList.add('active');

    // Auto-advance
    if (reasonInterval) clearInterval(reasonInterval);
    reasonInterval = setInterval(() => {
        showReason((reasonIndex + 1) % cards.length);
    }, 3500);
}

function showReason(index) {
    const cards = document.querySelectorAll('.reason-card');
    const dots = document.querySelectorAll('.carousel-dot');

    // Exit current
    cards[reasonIndex].classList.remove('active');
    cards[reasonIndex].classList.add('exit-left');

    // Enter new
    setTimeout(() => {
        cards.forEach(c => c.classList.remove('exit-left'));
        cards[index].classList.add('active');
    }, 300);

    // Update dots
    dots.forEach(d => d.classList.remove('active'));
    dots[index].classList.add('active');

    reasonIndex = index;
}

btnNextReasons.addEventListener('click', () => {
    if (reasonInterval) clearInterval(reasonInterval);
    goToScreen('screen-question');
});

// --- Screen 4: The Question (Runaway No Button) ---
// 🏃‍♂️ ULTRA FAST ESCAPE - Arya gabisa klik!
const noPhrases = [
    "Eits~ gabisa! 😜",
    "Hehe kabur~! 🏃‍♂️💨",
    "Coba aja terus~ 😏",
    "Aku terlalu cepat! ⚡",
    "Nggak bisa nolak kok! 💕",
    "Pencet yang iya aja~ 🥺",
    "Nyerah aja deh~ 😘",
    "Aku gaakan bisa di-klik! 😝",
    "Udah pencet iya aja sih~ 💗",
    "Iya kan? Iya dong! 🫶"
];

let noEscapeActive = false;

// The No button INSTANTLY escapes on ANY interaction
function handleNoEscape(e) {
    if (!noEscapeActive) return;
    e.preventDefault();
    e.stopPropagation();

    noCount++;
    noCountSpan.textContent = noCount;
    noCounter.classList.remove('hidden');
    noCounter.classList.add('show');

    // Change button text
    const phraseIndex = Math.min(noCount - 1, noPhrases.length - 1);
    btnNo.querySelector('span').textContent = noPhrases[phraseIndex];

    // Make Yes button grow bigger each time
    const scale = 1 + (noCount * 0.1);
    btnYes.style.transform = `scale(${Math.min(scale, 1.8)})`;

    // Make No button shrink
    btnNo.style.fontSize = `${Math.max(0.6, 1 - noCount * 0.04)}rem`;
    btnNo.style.padding = `${Math.max(6, 14 - noCount)}px ${Math.max(12, 28 - noCount * 2)}px`;

    // INSTANTLY teleport to random position
    moveNoButton();

    // Shake the bear
    const bearFace = document.querySelector('.bear-face');
    bearFace.classList.add('shake');
    setTimeout(() => bearFace.classList.remove('shake'), 400);

    // Speed up tears
    const tearLeft = document.getElementById('tear-left');
    const tearRight = document.getElementById('tear-right');
    tearLeft.style.animationDuration = `${Math.max(0.3, 2 - noCount * 0.2)}s`;
    tearRight.style.animationDuration = `${Math.max(0.3, 2 - noCount * 0.2)}s`;

    // After 8 tries, remove No entirely
    if (noCount >= 8) {
        btnNo.style.display = 'none';
        noEscapeActive = false;
        btnYes.querySelector('span').textContent = 'Iya deh, aku maafin 💕🥹';
        btnYes.style.transform = 'scale(1.6)';
    }
}

function moveNoButton() {
    const btnRect = btnNo.getBoundingClientRect();
    const pad = 15;
    const safeTop = 55; // avoid music toggle button area
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxX = Math.max(pad, vw - btnRect.width - pad);
    const maxY = Math.max(safeTop, vh - btnRect.height - pad);
    // On small screens, reduce min teleport distance so loop doesn't get stuck
    const minDist = Math.min(100, Math.min(vw, vh) * 0.3);

    let newX, newY;
    let attempts = 0;
    const oldX = btnRect.left;
    const oldY = btnRect.top;
    do {
        newX = pad + Math.random() * (maxX - pad);
        newY = safeTop + Math.random() * (maxY - safeTop);
        attempts++;
    } while (attempts < 20 && Math.abs(newX - oldX) < minDist && Math.abs(newY - oldY) < minDist);

    // Clamp to viewport
    newX = Math.max(pad, Math.min(newX, vw - btnRect.width - pad));
    newY = Math.max(safeTop, Math.min(newY, vh - btnRect.height - pad));

    btnNo.style.position = 'fixed';
    btnNo.style.left = newX + 'px';
    btnNo.style.top = newY + 'px';
    btnNo.style.zIndex = '50';
    btnNo.style.transition = 'none'; // NO transition = instant teleport
}

// ESCAPE on hover (desktop) - runs BEFORE click is possible
btnNo.addEventListener('mouseenter', (e) => {
    handleNoEscape(e);
});

// ESCAPE on touch (mobile) - intercept before tap registers
btnNo.addEventListener('touchstart', (e) => {
    handleNoEscape(e);
}, { passive: false });

// ALSO escape if mouse gets CLOSE (within 80px proximity)
document.addEventListener('mousemove', (e) => {
    if (!noEscapeActive) return;
    if (btnNo.style.display === 'none') return;

    const rect = btnNo.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

    // If cursor is within 80px, RUN!
    if (dist < 80) {
        noCount++;
        noCountSpan.textContent = noCount;
        noCounter.classList.remove('hidden');
        noCounter.classList.add('show');
        const phraseIndex = Math.min(noCount - 1, noPhrases.length - 1);
        btnNo.querySelector('span').textContent = noPhrases[phraseIndex];
        const scale = 1 + (noCount * 0.1);
        btnYes.style.transform = `scale(${Math.min(scale, 1.8)})`;
        btnNo.style.fontSize = `${Math.max(0.6, 1 - noCount * 0.04)}rem`;
        moveNoButton();

        if (noCount >= 8) {
            btnNo.style.display = 'none';
            noEscapeActive = false;
            btnYes.querySelector('span').textContent = 'Iya deh, aku maafin 💕🥹';
            btnYes.style.transform = 'scale(1.6)';
        }
    }
});

// Activate the escape behavior as soon as question screen shows
const originalGoToScreen = goToScreen;
goToScreen = function (screenId) {
    originalGoToScreen(screenId);
    if (screenId === 'screen-question') {
        // Small delay then activate escape
        setTimeout(() => {
            noEscapeActive = true;
            // Immediately make No button fixed positioned
            moveNoButton();
        }, 800);
    }
};

// Fallback: if somehow clicked, still escape
btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    handleNoEscape(e);
});

btnYes.addEventListener('click', () => {
    // Bear becomes happy
    bearMouth.classList.remove('sad');
    bearMouth.classList.add('happy');

    // Stop tears
    document.getElementById('tear-left').style.display = 'none';
    document.getElementById('tear-right').style.display = 'none';

    // Hide No button
    btnNo.style.display = 'none';

    // Explosion effect
    createStarExplosion(btnYes);

    setTimeout(() => goToScreen('screen-celebration'), 1000);
});

function createStarExplosion(element) {
    const rect = element.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const emojis = ['💕', '💗', '💖', '✨', '🌟', '⭐', '🎀', '💝', '🫶', '🥰'];

    for (let i = 0; i < 20; i++) {
        const star = document.createElement('span');
        star.classList.add('star-particle');
        star.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        star.style.left = cx + 'px';
        star.style.top = cy + 'px';
        star.style.fontSize = (12 + Math.random() * 20) + 'px';

        const angle = (Math.PI * 2 / 20) * i;
        const distance = 80 + Math.random() * 120;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        star.style.setProperty('--tx', tx + 'px');
        star.style.setProperty('--ty', ty + 'px');

        document.body.appendChild(star);
        setTimeout(() => star.remove(), 1000);
    }
}

// --- Screen 5: Celebration ---
function startCelebration() {
    // Confetti
    launchConfetti();

    // Reset no button for replay
    btnNo.style.display = '';
    btnNo.style.position = '';
    btnNo.style.left = '';
    btnNo.style.top = '';
    btnNo.style.zIndex = '';
    btnNo.style.fontSize = '';
    btnNo.querySelector('span').textContent = 'Nggak 😤';
}

function launchConfetti() {
    const colors = ['#ff85c0', '#d3adf7', '#91d5ff', '#ffd591', '#b7eb8f', '#ffadd2', '#ffc069'];
    const shapes = ['💕', '⭐', '🎀', '✨', '🌸', '💗', '🎉'];

    for (let i = 0; i < 60; i++) {
        setTimeout(() => {
            const confetti = document.createElement('span');
            confetti.classList.add('confetti');

            // Random between emoji and colored square
            if (Math.random() > 0.5) {
                confetti.textContent = shapes[Math.floor(Math.random() * shapes.length)];
                confetti.style.fontSize = (10 + Math.random() * 16) + 'px';
            } else {
                confetti.style.width = (6 + Math.random() * 8) + 'px';
                confetti.style.height = (6 + Math.random() * 8) + 'px';
                confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            }

            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDuration = (2 + Math.random() * 3) + 's';
            confetti.style.animationDelay = Math.random() * 0.5 + 's';

            confettiContainer.appendChild(confetti);

            setTimeout(() => confetti.remove(), 5500);
        }, i * 80);
    }
}

btnReplay.addEventListener('click', () => {
    // Reset everything
    noCount = 0;
    noEscapeActive = false;
    noCountSpan.textContent = '0';
    noCounter.classList.add('hidden');
    noCounter.classList.remove('show');
    btnYes.style.transform = '';
    bearMouth.classList.add('sad');
    bearMouth.classList.remove('happy');
    document.getElementById('tear-left').style.display = '';
    document.getElementById('tear-right').style.display = '';
    document.getElementById('tear-left').style.animationDuration = '';
    document.getElementById('tear-right').style.animationDuration = '';
    btnNo.style.display = '';
    btnNo.style.position = '';
    btnNo.style.left = '';
    btnNo.style.top = '';
    btnNo.style.zIndex = '';
    btnNo.style.fontSize = '';
    btnNo.style.padding = '';
    btnNo.style.transition = '';
    btnNo.querySelector('span').textContent = 'Nggak 😤';
    btnYes.querySelector('span').textContent = 'Iya, aku maafin 💕';

    // Clear confetti
    confettiContainer.innerHTML = '';

    goToScreen('screen-landing');
});

// --- Music (fixed: no double playback & handles autoplay/mute) ---
let musicPlayPromise = null;
let userMuted = false;

// Sync play/pause events directly from the audio element to keep the visual state and global variable in sync
bgMusic.addEventListener('play', () => {
    musicPlaying = true;
    musicIcon.textContent = '🎵';
    musicToggle.classList.add('playing');
});

bgMusic.addEventListener('pause', () => {
    musicPlaying = false;
    musicIcon.textContent = '🔇';
    musicToggle.classList.remove('playing');
});

function stopMusic() {
    if (musicPlayPromise) {
        musicPlayPromise.then(() => {
            bgMusic.pause();
        }).catch(() => { });
        musicPlayPromise = null;
    } else {
        bgMusic.pause();
    }
}

function tryPlayMusic() {
    if (userMuted) return; // Don't play if user explicitly muted it
    if (!bgMusic.paused) return; // Already playing

    bgMusic.volume = 0.3;

    musicPlayPromise = bgMusic.play();
    if (musicPlayPromise !== undefined) {
        musicPlayPromise.catch((error) => {
            console.log("Autoplay blocked by browser policy. Music will play upon first interaction.");
        });
    }
}

musicToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent trigger from global click handler
    if (!bgMusic.paused) {
        userMuted = true;
        stopMusic();
    } else {
        userMuted = false;
        tryPlayMusic();
    }
});

// --- Autoplay Helper (for browser restriction bypass) ---
function initAutoplay() {
    // Try autoplay immediately
    tryPlayMusic();

    // Listen to first click/touch/keypress to trigger play if initial autoplay is blocked
    const autoplayTrigger = () => {
        if (bgMusic.paused && !userMuted) {
            tryPlayMusic();
        }
        if (!bgMusic.paused || userMuted) {
            removeListeners();
        }
    };

    const removeListeners = () => {
        document.removeEventListener('click', autoplayTrigger);
        document.removeEventListener('touchstart', autoplayTrigger);
        document.removeEventListener('keydown', autoplayTrigger);
    };

    document.addEventListener('click', autoplayTrigger, { capture: true });
    document.addEventListener('touchstart', autoplayTrigger, { capture: true });
    document.addEventListener('keydown', autoplayTrigger, { capture: true });
}

// Start autoplay logic
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAutoplay);
} else {
    initAutoplay();
}

// --- Touch Sparkle Effect ---
document.addEventListener('click', (e) => {
    createTouchSparkle(e.clientX, e.clientY);
});

function createTouchSparkle(x, y) {
    const sparkles = ['✨', '💕', '⭐'];
    for (let i = 0; i < 3; i++) {
        const sparkle = document.createElement('span');
        sparkle.classList.add('star-particle');
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.fontSize = '14px';

        const angle = Math.random() * Math.PI * 2;
        const dist = 30 + Math.random() * 40;
        sparkle.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
        sparkle.style.setProperty('--ty', Math.sin(angle) * dist + 'px');

        document.body.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
    }
}

// --- Prevent Pull-to-Refresh on Mobile ---
document.addEventListener('touchmove', (e) => {
    if (e.target.closest('.celebration-content')) return;
    e.preventDefault();
}, { passive: false });

// --- Initialize ---
console.log('💕 Website ini dibuat dengan cinta oleh Cia Imup untuk Arya 💕');