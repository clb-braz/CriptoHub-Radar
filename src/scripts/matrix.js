// Matrix Rain Effect
const canvas = document.getElementById('matrix-effect');
const ctx = canvas.getContext('2d');

// Set canvas size
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initial setup
setCanvasSize();
window.addEventListener('resize', setCanvasSize);

// Characters to use in the matrix rain
const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*()_+-=[]{}|;:/<>~';
const charArray = chars.split('');

// Rain drops
const drops = [];
const fontSize = 14; // Tamanho reduzido para mais performance
const columns = canvas.width / fontSize;

// Initialize drops with posições aleatórias
for (let i = 0; i < columns; i++) {
    drops[i] = {
        y: Math.random() * -100,
        speed: 3 + Math.random() * 5, // Velocidade mais alta
        length: 15 + Math.floor(Math.random() * 15), // Comprimento mais consistente
        lastChar: 0,
        chars: []
    };
}

// Drawing speed
const frameRate = 60; // FPS máximo
let lastFrame = 0;

// Color configuration
const colors = {
    background: '#000000',
    primary: '#00FF00',
    bright: '#FFFFFF',
    dim: '#008800'
};

// Main animation function
function draw(timestamp) {
    if (timestamp - lastFrame < 1000 / frameRate) {
        requestAnimationFrame(draw);
        return;
    }
    lastFrame = timestamp;

    // Clear background com preto sólido
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw characters
    for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        
        // Update drop position
        drop.y += drop.speed;
        
        // Atualiza os caracteres da cauda
        if (drop.lastChar % 2 === 0) { // Muda caractere mais frequentemente
            drop.chars.unshift(charArray[Math.floor(Math.random() * charArray.length)]);
            if (drop.chars.length > drop.length) {
                drop.chars.pop();
            }
        }
        drop.lastChar++;

        // Desenha a cauda de caracteres
        for (let j = 0; j < drop.chars.length; j++) {
            const y = drop.y - (j * fontSize);
            if (y < canvas.height && y > 0) {
                // Primeiro caractere branco, resto verde
                if (j === 0) {
                    ctx.fillStyle = colors.bright;
                    ctx.font = `bold ${fontSize}px monospace`;
                } else {
                    ctx.fillStyle = j < 3 ? colors.primary : colors.dim;
                    ctx.font = `${fontSize}px monospace`;
                }

                ctx.fillText(drop.chars[j], i * fontSize, y);
            }
        }

        // Reset drop when it reaches bottom
        if (drop.y - (drop.length * fontSize) > canvas.height) {
            drops[i] = {
                y: -drop.length * fontSize,
                speed: 3 + Math.random() * 5,
                length: 15 + Math.floor(Math.random() * 15),
                lastChar: 0,
                chars: []
            };
        }
    }

    requestAnimationFrame(draw);
}

// Start animation
requestAnimationFrame(draw); 