const canvas = document.getElementById('galaxyCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');

let width, height, exploded = false;
let rainParticles = [], photos = [], electricParticles = [], texts = [];
let time = 0;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// 1. Hujan Dot Brush 50% (Pink Soft)
function initRain() {
    rainParticles = [];
    for (let i = 0; i < 700; i++) {
        rainParticles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 3 + 1,
            speed: Math.random() * 3 + 2,
            dir: Math.random() > 0.5 ? 1 : -1,
            // Brush effect properties
            opacity: 0.5 
        });
    }
}

// 2. Inisialisasi Electric Love (Style Melengkung Pink)
function initElectricHeart() {
    electricParticles = [];
    for (let i = 0; i < 1000; i++) {
        let t = Math.random() * Math.PI * 2;
        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        electricParticles.push({
            tx: x * 13, 
            ty: y * 13,
            size: Math.random() * 2 + 1,
            offset: Math.random() * Math.PI * 2
        });
    }
}

// 3. Inisialisasi Explosion (65 Foto & 120 Teks)
function initExplosion() {
    photos = [];
    texts = [];
    for (let i = 0; i < 65; i++) {
        const imgObj = new Image();
        imgObj.src = `images/photo${(i % 5) + 1}.jpg`;
        photos.push({
            img: imgObj, x: 0, y: 0,
            vx: (Math.random() - 0.5) * 18,
            vy: (Math.random() - 0.5) * 18,
            rot: Math.random() * 360,
            rv: Math.random() * 4 - 2,
            scale: Math.random() * 0.08 + 0.05, 
            loaded: false
        });
        photos[i].img.onload = function() { this.pRef.loaded = true; }.bind({pRef: photos[i]});
    }

    for (let i = 0; i < 120; i++) {
        texts.push({
            x: 0, y: 0,
            vx: (Math.random() - 0.5) * 25,
            vy: (Math.random() - 0.5) * 25,
            opacity: 1
        });
    }
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);
    time += 0.05;

    // --- DRAW HUJAN DOT (BRUSH EFFECT) ---
    ctx.save();
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ffb6c1';
    ctx.globalAlpha = 0.5; // Brush 50%
    ctx.fillStyle = '#ffb6c1';
    rainParticles.forEach(p => {
        p.y += p.speed * p.dir;
        if (p.y > height) p.y = 0;
        if (p.y < 0) p.y = height;
        
        ctx.beginPath();
        // Pakai arc supaya bentuknya dot tapi blur (brush)
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.restore();

    if (exploded) {
        ctx.save();
        ctx.translate(width / 2, height / 2);

        // --- DRAW ELECTRIC LOVE (DINAMIS PINK) ---
        electricParticles.forEach(p => {
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#ff69b4';
            ctx.fillStyle = '#ffb6c1';
            
            // Efek meliuk seperti video
            let motion = Math.sin(time + p.offset) * 8;
            let jX = (Math.random() - 0.5) * 6 + motion;
            let jY = (Math.random() - 0.5) * 6 + motion;
            
            ctx.fillRect(p.tx + jX, p.ty + jY, p.size, p.size);
        });

        // --- DRAW TEKS "alum cantik" ---
        ctx.font = "bold 18px Arial";
        ctx.fillStyle = "white";
        ctx.shadowBlur = 0;
        texts.forEach(t => {
            t.x += t.vx; t.y += t.vy;
            ctx.globalAlpha = t.opacity;
            ctx.fillText("alum cantik", t.x, t.y);
            if (Math.abs(t.x) > width/2) t.vx *= -1;
            if (Math.abs(t.y) > height/2) t.vy *= -1;
        });

        // --- DRAW FOTO (ANTI-GEPENG + GLOW) ---
        ctx.globalAlpha = 1;
        photos.forEach(p => {
            if (p.loaded) {
                p.x += p.vx; p.y += p.vy; p.rot += p.rv;
                if (Math.abs(p.x) > width/2) p.vx *= -0.9;
                if (Math.abs(p.y) > height/2) p.vy *= -0.9;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot * Math.PI / 180);
                ctx.scale(p.scale, p.scale);
                
                ctx.shadowBlur = 50;
                ctx.shadowColor = 'rgba(255, 182, 193, 1)';
                
                const pad = 40; 
                ctx.fillStyle = 'white';
                ctx.fillRect(-p.img.width/2 - pad/2, -p.img.height/2 - pad/2, p.img.width + pad, p.img.height + pad);
                
                ctx.shadowBlur = 0; 
                ctx.drawImage(p.img, -p.img.width/2, -p.img.height/2);
                ctx.restore();
            }
        });
        ctx.restore();
    }
    requestAnimationFrame(draw);
}

overlay.addEventListener('click', () => {
    overlay.classList.add('hidden');
    exploded = true;
});

initRain();
initElectricHeart();
initExplosion();
draw();