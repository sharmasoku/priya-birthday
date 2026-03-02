// === Element References ===
const startScreen = document.getElementById('start-screen');
const mainContent = document.getElementById('main-content');
const startBtn = document.getElementById('start-btn');
const bgMusic = document.getElementById('bg-music');
const particlesContainer = document.getElementById('particles-container');
const heartsContainer = document.getElementById('hearts-container');

// === Audio & Start Journey ===
startBtn.addEventListener('click', () => {
    // Attempt to play music
    bgMusic.volume = 0.5; // Soft volume
    bgMusic.play().catch(e => console.log("Audio play failed (maybe no file or blocked):", e));

    // Hide Start Screen, Show Main Content (Hero)
    startScreen.classList.remove('active');
    setTimeout(() => {
        startScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
        // Trigger first scene animations if needed
    }, 1500);
});

// === Background Animations ===
function createParticle() {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random position, size, and duration
    const size = Math.random() * 5 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}vw`;
    
    const duration = Math.random() * 10 + 10; // 10s to 20s
    particle.style.animationDuration = `${duration}s`;
    
    particlesContainer.appendChild(particle);
    
    // Cleanup
    setTimeout(() => {
        particle.remove();
    }, duration * 1000);
}

function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = '💖';
    
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.fontSize = `${Math.random() * 1.5 + 0.5}rem`;
    
    const duration = Math.random() * 10 + 15; // 15s to 25s
    heart.style.animationDuration = `${duration}s`;
    
    heartsContainer.appendChild(heart);
    
    // Cleanup
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

// Generate particles and hearts periodically
setInterval(createParticle, 300);
setInterval(createHeart, 800);

// === Scene Management ===
function nextScene(currentId, nextId) {
    const currentScene = document.getElementById(currentId);
    const nextScene = document.getElementById(nextId);

    // Fade out current
    currentScene.classList.remove('active-scene');
    currentScene.style.opacity = '0';
    
    setTimeout(() => {
        currentScene.classList.add('hidden');
        
        // Prepare next scene
        nextScene.classList.remove('hidden');
        
        // Trigger specific next scene animations
        triggerSceneAnimations(nextId);
        
        // Fade in next
        setTimeout(() => {
            nextScene.classList.add('active-scene');
        }, 50);

    }, 1500);
}

// === Scene-Specific Animations ===
function triggerSceneAnimations(sceneId) {
    if (sceneId === 'message') {
        const quote = document.querySelector('.typewriter-quote');
        const text = quote.innerHTML;
        quote.innerHTML = '';
        quote.style.borderRight = '3px solid var(--accent-color)';
        
        let i = 0;
        // HTML aware typewriter
        const typeWriter = () => {
            if (i < text.length) {
                if(text.charAt(i) === '<') {
                    let tag = '';
                    while(text.charAt(i) !== '>') {
                        tag += text.charAt(i);
                        i++;
                    }
                    tag += '>';
                    quote.innerHTML += tag;
                    i++;
                } else {
                    quote.innerHTML += text.charAt(i);
                    i++;
                }
                setTimeout(typeWriter, 50); // Typing speed
            } else {
                quote.style.borderRight = 'none';
                revealMessageBody();
            }
        };
        // Reset and start typing
        setTimeout(() => { quote.innerHTML = text; /* Fallback for HTML complexitiy if charAt fails */ }, 0); 
        // Just use CSS reveal instead of complex HTML typewriter for safety, actually CSS typewriter is easier, but let's just fade it in elegantly or use simple text revealing.
        // Let's replace the typewriter with a simple span fade-in
        quote.innerHTML = text; // Just put it back and rely on CSS animation
        
        setTimeout(revealMessageBody, 3000);
    }
    else if (sceneId === 'feelings') {
        const cards = document.querySelectorAll('.card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 500 * (index + 1));
        });
        
        setTimeout(() => {
            document.querySelector('.feelings-footer').classList.add('visible-elem');
            document.querySelector('#feelings .next-btn').classList.add('visible-elem');
        }, 2500);
    }
    else if (sceneId === 'wish') {
        createFireworks();
    }
    else if (sceneId === 'finale') {
        createRosePetals();
        // Fade out music gradually
        let vol = bgMusic.volume;
        const fadeOut = setInterval(() => {
            if (vol > 0.05) {
                vol -= 0.05;
                bgMusic.volume = vol;
            } else {
                clearInterval(fadeOut);
            }
        }, 500);
    }
}

function revealMessageBody() {
    const pTags = document.querySelectorAll('.message-body p');
    document.querySelector('.message-body').classList.add('visible-elem');
    pTags.forEach((p, i) => {
        p.style.opacity = '0';
        p.style.transform = 'translateY(10px)';
        p.style.transition = 'all 0.8s ease';
        setTimeout(() => {
            p.style.opacity = '1';
            p.style.transform = 'translateY(0)';
        }, 600 * i);
    });
    
    setTimeout(() => {
        document.querySelector('#message .next-btn').classList.add('visible-elem');
    }, 600 * pTags.length + 500);
}

// === Fireworks ===
function createFireworks() {
    const fwBg = document.querySelector('.fireworks-bg');
    if (!fwBg) return;
    
    setInterval(() => {
        const fw = document.createElement('div');
        fw.style.position = 'absolute';
        fw.style.left = `${Math.random() * 100}%`;
        fw.style.top = `${Math.random() * 50}%`;
        fw.style.width = '10px';
        fw.style.height = '10px';
        fw.style.borderRadius = '50%';
        fw.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 70%)`;
        fw.style.boxShadow = `0 0 20px 10px ${fw.style.backgroundColor}`;
        fw.style.opacity = '0';
        fw.style.animation = 'explode 1.5s ease-out forwards';
        
        fwBg.appendChild(fw);
        
        setTimeout(() => { fw.remove(); }, 1500);
    }, 800);
}

// Firework CSS rule Injection
const style = document.createElement('style');
style.innerHTML = `
@keyframes explode {
    0% { transform: scale(0.1); opacity: 1; }
    50% { opacity: 1; }
    100% { transform: scale(10); opacity: 0; }
}
.rose-petal {
    position: absolute;
    width: 15px;
    height: 15px;
    background: #ff007f;
    border-radius: 15px 0 15px 0;
    opacity: 0.8;
    animation: fall linear infinite;
}
@keyframes fall {
    0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
    10% { opacity: 1; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
`;
document.head.appendChild(style);

// === Rose Petals ===
function createRosePetals() {
    const petalsBg = document.querySelector('.rose-petals-bg');
    if (!petalsBg) return;
    
    setInterval(() => {
        const petal = document.createElement('div');
        petal.className = 'rose-petal';
        petal.style.left = `${Math.random() * 100}%`;
        petal.style.animationDuration = `${Math.random() * 5 + 5}s`;
        
        petalsBg.appendChild(petal);
        setTimeout(() => petal.remove(), 10000);
    }, 300);
}

// Candle blow logic
document.querySelector('#wish .next-btn').addEventListener('click', (e) => {
    // Actually, nextScene is triggered by the HTML onclick inline.
    // Let's blow the candle right before transition.
    const flame = document.querySelector('.flame');
    if (flame) flame.classList.add('blown-out');
});
