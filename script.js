// ================================================
// Live Clock & Date
// ================================================
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const ampmEl = document.getElementById('ampm');
const dateDisplayEl = document.getElementById('date-display');
const timezoneEl = document.getElementById('timezone-display');
const todayDateEl = document.getElementById('today-date');
const dayOfWeekEl = document.getElementById('day-of-week');
const yearProgressEl = document.getElementById('year-progress');
const greetingTextEl = document.getElementById('greeting-text');
const footerYearEl = document.getElementById('footer-year');

const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
const months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

function pad(n) {
    return n.toString().padStart(2, '0');
}

function getGreeting(hour) {
    if (hour >= 5 && hour < 12) return '☀️ 早安';
    if (hour >= 12 && hour < 17) return '🌤️ 午安';
    if (hour >= 17 && hour < 21) return '🌇 晚安';
    return '🌙 夜深了';
}

function getYearProgress(now) {
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear() + 1, 0, 1);
    const progress = ((now - start) / (end - start)) * 100;
    return progress.toFixed(1) + '%';
}

function updateClock() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    // 24-hour format
    hoursEl.textContent = pad(h);
    minutesEl.textContent = pad(m);
    secondsEl.textContent = pad(s);
    ampmEl.textContent = '';

    // Date display
    const year = now.getFullYear();
    const month = now.getMonth();
    const date = now.getDate();
    const day = now.getDay();

    dateDisplayEl.textContent = `${year}年 ${months[month]} ${date}日 ${weekdays[day]}`;

    // Timezone
    const tzOffset = -now.getTimezoneOffset();
    const tzHours = Math.floor(Math.abs(tzOffset) / 60);
    const tzMinutes = Math.abs(tzOffset) % 60;
    const tzSign = tzOffset >= 0 ? '+' : '-';
    const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    timezoneEl.textContent = `UTC${tzSign}${pad(tzHours)}:${pad(tzMinutes)} • ${tzName}`;

    // Info cards
    todayDateEl.textContent = `${month + 1}/${date}`;
    dayOfWeekEl.textContent = weekdays[day];
    yearProgressEl.textContent = getYearProgress(now);

    // Greeting
    greetingTextEl.textContent = getGreeting(h);

    // Footer year
    footerYearEl.textContent = year;
}

updateClock();
setInterval(updateClock, 1000);

// ================================================
// Particle Background
// ================================================
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 60;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.fadeSpeed = Math.random() * 0.005 + 0.002;
        this.fadingIn = Math.random() > 0.5;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.fadingIn) {
            this.opacity += this.fadeSpeed;
            if (this.opacity >= 0.5) this.fadingIn = false;
        } else {
            this.opacity -= this.fadeSpeed;
            if (this.opacity <= 0.05) this.fadingIn = true;
        }

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(124, 92, 252, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
}

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                const opacity = (1 - dist / 120) * 0.12;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(124, 92, 252, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    drawConnections();
    requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', () => {
    resizeCanvas();
});

resizeCanvas();
initParticles();
animateParticles();
