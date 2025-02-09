class NetworkBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('network-background');
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.nodes = [];
        this.lines = [];
        this.mouse = { x: 0, y: 0 };
        this.nodeCount = 70;
        this.maxDistance = 200;
        
        this.init();
        this.bindEvents();
        this.animate();
    }
    
    init() {
        this.resize();
        this.createNodes();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createNodes() {
        for (let i = 0; i < this.nodeCount; i++) {
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1
            });
        }
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
    }
    
    drawNode(node) {
        const distToMouse = Math.hypot(node.x - this.mouse.x, node.y - this.mouse.y);
        const glow = Math.max(0, 1 - distToMouse / 300);
        
        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, node.radius * (1 + glow * 2), 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(0, 102, 255, ${0.7 + glow * 0.3})`;
        this.ctx.fill();
        
        if (glow > 0) {
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.radius * 3 * (1 + glow), 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(0, 102, 255, ${glow * 0.5})`;
            this.ctx.stroke();
        }
    }
    
    drawLines() {
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[j].x - this.nodes[i].x;
                const dy = this.nodes[j].y - this.nodes[i].y;
                const distance = Math.hypot(dx, dy);
                
                if (distance < this.maxDistance) {
                    const opacity = (1 - distance / this.maxDistance) * 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
                    this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
                    this.ctx.strokeStyle = `rgba(0, 102, 255, ${opacity})`;
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                }
            }
        }
    }
    
    updateNodes() {
        this.nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
            
            // Mouse interaction
            const dx = this.mouse.x - node.x;
            const dy = this.mouse.y - node.y;
            const dist = Math.hypot(dx, dy);
            
            if (dist < 300) {
                const force = (300 - dist) * 0.002;
                node.vx += dx * force;
                node.vy += dy * force;
            }
            
            // Speed limit
            const speed = Math.hypot(node.vx, node.vy);
            if (speed > 3) {
                node.vx = (node.vx / speed) * 3;
                node.vy = (node.vy / speed) * 3;
            }
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.updateNodes();
        this.drawLines();
        this.nodes.forEach(node => this.drawNode(node));
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize background effect
document.addEventListener('DOMContentLoaded', () => {
    new NetworkBackground();
    
    // Add glow effect that follows mouse
    const glowEffect = document.createElement('div');
    glowEffect.classList.add('glow-effect');
    document.body.appendChild(glowEffect);
    
    document.addEventListener('mousemove', (e) => {
        glowEffect.style.transform = `translate(${e.clientX - 150}px, ${e.clientY - 150}px)`;
    });
}); 