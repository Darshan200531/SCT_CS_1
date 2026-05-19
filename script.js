/* ── Theme (dark / light) ─────────────────────────── */
let currentTheme = localStorage.getItem('cc-theme') || 'dark';

function applyTheme(theme) {
    const html  = document.documentElement;
    const icon  = document.getElementById('theme-icon');
    const label = document.getElementById('theme-label');

    if (theme === 'light') {
        html.setAttribute('data-theme', 'light');
        icon.textContent  = '🌙';
        label.textContent = 'Dark Mode';
    } else {
        html.removeAttribute('data-theme');
        icon.textContent  = '☀️';
        label.textContent = 'Light Mode';
    }
    currentTheme = theme;
    localStorage.setItem('cc-theme', theme);
}

function toggleTheme() {
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

// Restore saved preference on load
applyTheme(currentTheme);

/* ── State ────────────────────────────────── */
let currentMode = 'encrypt';

/* ── Mode switching ────────────────────────── */
function setMode(mode) {
    currentMode = mode;
    const btnE = document.getElementById('btn-encrypt');
    const btnD = document.getElementById('btn-decrypt');
    const runBtn = document.getElementById('run-btn');

    if (mode === 'encrypt') {
        btnE.classList.add('active');
        btnD.classList.remove('active');
        runBtn.textContent = '🔒 Encrypt Message';
    } else {
        btnD.classList.add('active');
        btnE.classList.remove('active');
        runBtn.textContent = '🔓 Decrypt Message';
    }

    // Hide output on mode change
    document.getElementById('output-card').classList.remove('visible');
}

/* ── Slider / number sync ──────────────────── */
function syncSlider(val) {
    const v = Math.min(25, Math.max(1, parseInt(val) || 1));
    document.getElementById('shift-slider').value = v;
    document.getElementById('shift-number').value = v;
}
function syncNumber(val) {
    document.getElementById('shift-number').value = val;
}

/* ── Caesar Cipher core ────────────────────── */
function caesarShift(text, shift, encrypt) {
    if (!encrypt) shift = (26 - shift) % 26;
    return text.split('').map(ch => {
        if (/[A-Z]/.test(ch)) return String.fromCharCode((ch.charCodeAt(0) - 65 + shift) % 26 + 65);
        if (/[a-z]/.test(ch)) return String.fromCharCode((ch.charCodeAt(0) - 97 + shift) % 26 + 97);
        return ch;
    }).join('');
}

/* ── Main action ───────────────────────────── */
function runCipher() {
    const inputText = document.getElementById('input-text').value;
    const shiftRaw = parseInt(document.getElementById('shift-number').value);
    const shift = Math.min(25, Math.max(1, isNaN(shiftRaw) ? 3 : shiftRaw));

    if (!inputText.trim()) {
        flashInput();
        return;
    }

    const result = caesarShift(inputText, shift, currentMode === 'encrypt');

    const outputCard = document.getElementById('output-card');
    const outputText = document.getElementById('output-text');

    outputText.textContent = result;
    outputCard.classList.remove('visible');
    // Force reflow for re-animation
    void outputCard.offsetWidth;
    outputCard.classList.add('visible');

    // Reset copy button
    const copyBtn = document.getElementById('copy-btn');
    copyBtn.classList.remove('copied');
    copyBtn.textContent = '📋 Copy';

    // Smooth scroll to output
    setTimeout(() => outputCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
}

/* ── Copy output ───────────────────────────── */
function copyOutput() {
    const text = document.getElementById('output-text').textContent;
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.getElementById('copy-btn');
        btn.classList.add('copied');
        btn.textContent = '✅ Copied!';
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.textContent = '📋 Copy';
        }, 2000);
    });
}

/* ── Flash empty input ─────────────────────── */
function flashInput() {
    const ta = document.getElementById('input-text');
    ta.style.borderColor = '#ff6584';
    ta.style.boxShadow = '0 0 0 3px rgba(255,101,132,.22)';
    ta.placeholder = 'Please enter a message first…';
    setTimeout(() => {
        ta.style.borderColor = '';
        ta.style.boxShadow = '';
        ta.placeholder = 'Type your message here…';
    }, 1800);
}

/* ── Enter key shortcut ────────────────────── */
document.getElementById('input-text').addEventListener('keydown', e => {
    if (e.ctrlKey && e.key === 'Enter') runCipher();
});