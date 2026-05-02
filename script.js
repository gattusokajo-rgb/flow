const canvas = document.getElementById('galaxyCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');

let width, height, exploded = false;
let rainParticles = [], photos = [], electricParticles = [], texts = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// 1. Hujan Garis (Dot Putih Vertikal)
function initRain() {
    rainParticles = [];
    for (let i = 0; i < 600; i++) {
        rainParticles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            length: Math.random() * 30 + 20,
            speed: Math.random() * 5 + 4,
            dir: Math.random() > 0.5 ? 1 : -1,
            opacity: Math.random() * 0.6 + 0.2
        });
    }
}

// 2. Electric Heart (Neon Pink)
function initElectricHeart() {
    electricParticles = [];
    for (let i = 0; i < 850; i++) {
        let t = Math.random() * Math.PI * 2;
        let x = 16 * Math.pow(Math.sin(t), 3);
        let y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        electricParticles.push({
            tx: x * 12, ty: y * 12,
            size: Math.random() * 3 + 1
        });
    }
}

// 3. Ledakan Foto & Teks
function initExplosion() {
    photos = [];
    texts = [];
    for (let i = 0; i < 65; i++) {
        const imgObj = new Image();
        imgObj.src = `images/photo${(i % 5) + 1}.jpg`;
        photos.push({
            img: imgObj, x: 0, y: 0,
            vx: (Math.random() - 0.5) * 16,
            vy: (Math.random() - 0.5) * 16,
            rot: Math.random() * 360,
            rv: Math.random() * 3 - 1.5,
            // Skala disesuaikan: Foto HP biasanya besar, jadi kita perkecil
            scale: Math.random() * 0.08 + 0.05, 
            loaded: false
        });
        photos[i].img.onload = function() {
            this.parentRef.loaded = true;
        }.bind({parentRef: photos[i]});
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

    // DRAW HUJAN GARIS
    ctx.lineWidth = 1.5;
    rainParticles.forEach(p => {
        p.y += p.speed * p.dir;
        if (p.y > height) p.y = 0;
        if (p.y < 0) p.y = height;
        ctx.strokeStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y + p.length * p.dir);
        ctx.stroke();
    });

    if (exploded) {
        ctx.save();
        ctx.translate(width / 2, height / 2);

        // DRAW ELECTRIC HEART
        electricParticles.forEach(p => {
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#ff69b4';
            ctx.fillStyle = '#ffb6c1';
            let jX = (Math.random() - 0.5) * 12;
            let jY = (Math.random() - 0.5) * 12;
            ctx.fillRect(p.tx + jX, p.ty + jY, p.size, p.size);
        });

        // DRAW TEKS
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

        // DRAW FOTO (Dinamis & Anti-Gepeng)
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
                
                // Efek Glow pada Foto
                ctx.shadowBlur = 50;
                ctx.shadowColor = 'rgba(255, 182, 193, 1)';
                
                // Frame Putih mengikuti ukuran asli foto
                const pad = 40; 
                ctx.fillStyle = 'white';
                // Menggambar frame putih sesuai lebar & tinggi asli image
                ctx.fillRect(-p.img.width/2 - pad/2, -p.img.height/2 - pad/2, p.img.width + pad, p.img.height + pad);
                
                ctx.shadowBlur = 0; 
                // Menggambar foto sesuai ukuran aslinya (1:1)
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