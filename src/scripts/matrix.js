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
const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const charArray = chars.split('');

// Rain drops
const drops = [];
const fontSize = 14;
const columns = canvas.width / fontSize;

// Initialize drops
for (let i = 0; i < columns; i++) {
    drops[i] = Math.floor(Math.random() * canvas.height / fontSize);
}

// Drawing speed
const frameRate = 30;
let lastFrame = 0;

// Main animation function
function draw(timestamp) {
    if (timestamp - lastFrame < 1000 / frameRate) {
        requestAnimationFrame(draw);
        return;
    }
    lastFrame = timestamp;

    // Semi-transparent black background to create fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Green text
    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';

    // Draw characters
    for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        
        // Calculate position
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Draw the character
        ctx.fillText(char, x, y);

        // Reset drop if it reaches bottom or randomly
        if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        // Move drop down
        drops[i]++;
    }

    requestAnimationFrame(draw);
}

// Start animation
requestAnimationFrame(draw); 