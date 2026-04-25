/* ─────────────────────────────────────────────────────────
   TRANSLATIONS
───────────────────────────────────────────────────────── */
const translations = {
  es: {
    badge:    'No reírse está prohibido 😂',
    title:    'Reto de NO reír',
    subtitle: 'Un chiste fresco, solo para ti',
    loading:  'Cargando tu chiste…',
    btn:      '🎲 Otro chiste',
    portfolio:'Portafolio',
  },
  en: {
    badge:    'No laughing allowed 😂',
    title:    'Don\'t Laugh Challenge',
    subtitle: 'A fresh dad joke, just for you',
    loading:  'Loading your joke…',
    btn:      '🎲 Get another joke',
    portfolio:'Portfolio',
  },
};

/* ─────────────────────────────────────────────────────────
   CHISTES EN ESPAÑOL
   (icanhazdadjoke.com solo tiene inglés — usamos esta lista
    local que se baraja para simular aleatoriedad)
───────────────────────────────────────────────────────── */
const chistes = [
  "¿Por qué los pájaros vuelan hacia el sur en invierno? Porque caminando tardarían demasiado.",
  "¿Qué le dijo el océano a la playa? Nada.",
  "¿Por qué el libro de matemáticas estaba triste? Porque tenía demasiados problemas.",
  "¿Qué hace una abeja en el gimnasio? ¡Zum-ba!",
  "¿Cómo se llama el campeón de buceo de Japón? Tokofondo.",
  "¿Por qué el espantapájaros ganó un premio? Porque era sobresaliente en su campo.",
  "¿Qué le dijo un techo a otro techo? Nada, los techos no hablan.",
  "¿Por qué el café fue a la policía? Porque lo asaltaron.",
  "¿Cómo se dice 'pañal' en inglés? Creo que 'pamper', pero no estoy seguro de eso... solo lo estoy tirando.",
  "¿Qué le dice un jardinero a otro? ¡Que tengas un buen día, colega!",
  "¿Por qué el esqueleto no fue a la fiesta? Porque no tenía cuerpo para ir.",
  "¿Qué hace un pez cuando está aburrido? Nada.",
  "¿Por qué la luna no come? Porque ya está llena.",
  "¿Cómo sabe el océano que es salado? Porque nunca le entra agua dulce.",
  "¿Qué le dice un semáforo al otro? No me mires que me estoy cambiando.",
  "¿Por qué el fotógrafo fue a la cárcel? Por disparar y no dar la cara.",
  "¿Cómo se llama el cinturón de diamantes? Un derroche de lujo.",
  "¿Cuál es el colmo de un electricista? Que su hijo sea un apagado.",
  "¿Por qué el libro fue al médico? Porque le dolían las hojas.",
  "¿Qué le dice un río al otro? Nada, los ríos no hablan, pero hacen mucho ruido.",
  "¿Por qué el fantasma fue al bar? Para levantarle el espíritu a alguien.",
  "¿Qué le dijo el cero al ocho? Bonito cinturón.",
  "¿Por qué el tomate se puso rojo? Porque vio a la ensalada sin ropa.",
  "¿Cómo se dice 'elefante en pijama' en chino? Mi-cama-ya-no-cabe.",
  "¿Qué le dijo el mar al barco? Nada, solo lo saludó con las olas.",
];

let _chisteIndex = -1;
const _chistePool = [...chistes];

function getChisteAleatorio() {
  if (_chistePool.length === 0) _chistePool.push(...chistes);
  // shuffle once when we start a new round
  if (_chisteIndex < 0 || _chisteIndex >= _chistePool.length) {
    for (let i = _chistePool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [_chistePool[i], _chistePool[j]] = [_chistePool[j], _chistePool[i]];
    }
    _chisteIndex = 0;
  }
  return _chistePool[_chisteIndex++];
}

let currentLang = 'es';

function applyTranslations(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key] !== undefined) {
      el.textContent = translations[lang][key];
    }
  });

  // Highlight active lang option
  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
  });
}

/* ─────────────────────────────────────────────────────────
   LANGUAGE TOGGLE
───────────────────────────────────────────────────────── */
const langToggle = document.getElementById('langToggle');

langToggle.addEventListener('click', () => {
  const nextLang = currentLang === 'es' ? 'en' : 'es';
  applyTranslations(nextLang);

  // If there's already a joke loaded, re-fetch silently
  const jokeEl = document.getElementById('joke');
  if (!jokeEl.querySelector('.joke-placeholder')) {
    generateJoke();
  }
});

/* ─────────────────────────────────────────────────────────
   JOKE LOGIC (original logic preserved)
───────────────────────────────────────────────────────── */
const jokeEl  = document.getElementById('joke');
const jokeBtn = document.getElementById('jokeBtn');

jokeBtn.addEventListener('click', generateJoke);

// USING ASYNC/AWAIT
async function generateJoke() {
  jokeEl.classList.add('loading');
  jokeEl.classList.remove('revealed');

  let jokeText;

  if (currentLang === 'es') {
    // icanhazdadjoke.com only serves English — use local Spanish pool
    jokeText = getChisteAleatorio();
  } else {
    const config = {
      headers: {
        Accept: 'application/json',
      },
    };
    const res  = await fetch('https://icanhazdadjoke.com', config);
    const data = await res.json();
    jokeText = data.joke;
  }

  jokeEl.classList.remove('loading');
  jokeEl.innerHTML = jokeText;

  // Trigger reveal animation
  void jokeEl.offsetWidth; // reflow
  jokeEl.classList.add('revealed');
}

/* ─────────────────────────────────────────────────────────
   STARS CANVAS
───────────────────────────────────────────────────────── */
(function initStars() {
  const canvas = document.getElementById('starsCanvas');
  const ctx    = canvas.getContext('2d');
  let stars    = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    const count = Math.floor((canvas.width * canvas.height) / 6000);
    stars = Array.from({ length: count }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  Math.random() * 1.1 + 0.2,
      a:  Math.random(),
      da: (Math.random() * 0.004 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.a += s.da;
      if (s.a > 1 || s.a < 0) s.da *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,220,255,${s.a * 0.7})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

/* ─────────────────────────────────────────────────────────
   SERVICE WORKER REGISTRATION
───────────────────────────────────────────────────────── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

/* ─────────────────────────────────────────────────────────
   INIT
───────────────────────────────────────────────────────── */
applyTranslations('es');
generateJoke();