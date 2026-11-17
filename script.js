const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');
const chapterNumber = document.querySelector('#chapter-number');
const chapterSections = [...document.querySelectorAll('.chapter-section')];
const sinButtons = [...document.querySelectorAll('.sin-seal')];
const sinDialog = document.querySelector('#sin-dialog');
const secretPage = document.querySelector('#secret-page');
const toast = document.querySelector('#toast');
const foundSins = new Set();
let toastTimeout;

const sinData = {
  orgulho: { name: 'ORGULHO', mark: '獅', message: 'A assinatura de quem conhece o próprio valor.', clue: 'Procure a próxima pista entre os quadros.' },
  ira: { name: 'IRA', mark: '炎', message: 'Atitude é saber exatamente onde cada linha deve estar.', clue: 'Olhe para os detalhes, não apenas para o todo.' },
  inveja: { name: 'INVEJA', mark: '蛇', message: 'Observar é aprender. Evoluir é transformar referência em identidade.', clue: 'Toda boa história tem mais de um capítulo.' },
  preguica: { name: 'PREGUIÇA', mark: '狼', message: 'O automático termina onde começa a intenção.', clue: 'Continue explorando a página.' },
  ganancia: { name: 'GANÂNCIA', mark: '金', message: 'A ambição mais valiosa é continuar evoluindo.', clue: 'Nem toda pista está em um botão.' },
  luxuria: { name: 'LUXÚRIA', mark: '華', message: 'Estilo é o impacto que fica depois do primeiro olhar.', clue: 'O próximo segredo está perto de uma assinatura.' },
  gula: { name: 'GULA', mark: '鴉', message: 'A obsessão pelos detalhes transforma técnica em assinatura.', clue: 'Você está perto de virar a última página.' }
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3200);
}

menuButton?.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});
navigation?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Abrir menu');
}));

// Atualiza o capítulo do cabeçalho conforme a seção principal entra em foco.
if ('IntersectionObserver' in window) {
  const chapterObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const chapter = visible.target.dataset.chapter;
    chapterNumber.textContent = chapter;
    navigation.querySelectorAll('a').forEach((link) => link.classList.toggle('active', link.dataset.chapter === chapter));
  }, { rootMargin: '-25% 0px -55% 0px', threshold: [0, .15, .35, .6] });
  chapterSections.forEach((section) => chapterObserver.observe(section));
}

// Revelações suaves e respeitosas com a configuração de movimento reduzido.
const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else revealItems.forEach((item) => item.classList.add('visible'));

function updateSinProgress() {
  const count = foundSins.size;
  document.querySelector('#sin-count').textContent = count;
  document.querySelector('#sin-progress-fill').style.width = `${(count / 7) * 100}%`;
  document.querySelector('#sin-feedback').textContent = count === 7 ? 'Todos os selos foram revelados.' : count === 0 ? 'A investigação começou.' : 'Há mais segredos escondidos.';
  if (count === 7) setTimeout(() => { if (!secretPage.open) secretPage.showModal(); document.body.classList.add('dialog-open'); }, 650);
}

sinButtons.forEach((button) => button.addEventListener('click', () => {
  const key = button.dataset.sin;
  const sin = sinData[key];
  if (!sin) return;
  if (!foundSins.has(key)) {
    foundSins.add(key);
    button.classList.add('found');
    button.querySelector('b').textContent = '✓';
    updateSinProgress();
  }
  document.querySelector('#sin-dialog-kicker').textContent = `ARQUIVO DESBLOQUEADO / ${String(foundSins.size).padStart(2, '0')}-07`;
  document.querySelector('#dialog-seal').textContent = sin.mark;
  document.querySelector('#sin-dialog-title').textContent = sin.name;
  document.querySelector('#sin-dialog-copy').textContent = sin.message;
  if (!sinDialog.open) sinDialog.showModal();
  document.body.classList.add('dialog-open');
}));

document.querySelectorAll('.dialog-close').forEach((button) => button.addEventListener('click', () => {
  const dialog = button.closest('dialog');
  dialog.close();
  if (!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-open');
}));
[sinDialog, secretPage].forEach((dialog) => {
  dialog.addEventListener('click', (event) => { if (event.target === dialog) { dialog.close(); if (!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-open'); } });
  dialog.addEventListener('close', () => { if (!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-open'); });
});
document.querySelector('#secret-contact').addEventListener('click', () => {
  secretPage.close();
  document.body.classList.remove('dialog-open');
});

// Um dos selos fica escondido em uma interação de rodapé para recompensar a exploração.
const footerBrand = document.querySelector('.brand-footer');
footerBrand?.addEventListener('click', (event) => {
  if (event.detail > 1) {
    event.preventDefault();
    const hidden = document.querySelector('[data-sin="gula"]');
    hidden?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Você encontrou uma pista escondida. Explore os sete selos.');
  }
});

