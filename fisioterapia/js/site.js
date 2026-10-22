// Lívia Moreira · Fisioterapia — comportamento da página (demonstração)
(function () {
  'use strict';

  // Cabeçalho ganha sombra quando a página rola
  var topo = document.getElementById('topo');
  var marcarTopo = function () { topo.classList.toggle('rolou', window.scrollY > 40); };
  marcarTopo();
  window.addEventListener('scroll', marcarTopo, { passive: true });

  // Entrada suave, em sequência dentro de cada seção
  var partes = Array.prototype.slice.call(document.querySelectorAll('.surge'));
  if (!('IntersectionObserver' in window)) {
    partes.forEach(function (el) { el.classList.add('visivel'); });
  } else {
    var contagem = new Map();
    partes.forEach(function (el) {
      var dono = el.closest('section, footer') || document.body;
      var n = contagem.get(dono) || 0;
      el.style.setProperty('--atraso', Math.min(n, 6) * 80 + 'ms');
      contagem.set(dono, n + 1);
    });
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visivel'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    partes.forEach(function (el) { obs.observe(el); });
  }

  // Aberto agora? Calculado no horário de Campinas (America/Sao_Paulo)
  var horarios = { 0: null, 1: [7, 20], 2: [7, 20], 3: [7, 20], 4: [7, 20], 5: [7, 20], 6: [8, 12] };
  var nomesDia = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];

  var agoraEmCampinas = function () {
    try {
      var partesData = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false
      }).formatToParts(new Date());
      var m = {};
      partesData.forEach(function (p) { m[p.type] = p.value; });
      var dia = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(m.weekday);
      return { dia: dia, hora: (parseInt(m.hour, 10) % 24) + parseInt(m.minute, 10) / 60 };
    } catch (e) {
      var d = new Date();
      return { dia: d.getDay(), hora: d.getHours() + d.getMinutes() / 60 };
    }
  };

  var agora = agoraEmCampinas();
  var status = document.getElementById('status');
  var statusTexto = document.getElementById('status-texto');
  if (status && statusTexto && agora.dia >= 0) {
    var hoje = horarios[agora.dia];
    if (hoje && agora.hora >= hoje[0] && agora.hora < hoje[1]) {
      status.classList.add('aberto');
      statusTexto.textContent = 'Aberto agora, até ' + hoje[1] + 'h';
    } else {
      // Próxima abertura
      var texto = '';
      for (var i = 0; i < 8; i++) {
        var d = (agora.dia + i) % 7;
        var h = horarios[d];
        if (!h) continue;
        if (i === 0 && agora.hora >= h[0]) continue;
        texto = i === 0 ? 'Fechado agora · abre hoje às ' + h[0] + 'h'
          : i === 1 ? 'Fechado agora · abre amanhã às ' + h[0] + 'h'
          : 'Fechado agora · abre ' + nomesDia[d] + ' às ' + h[0] + 'h';
        break;
      }
      statusTexto.textContent = texto;
    }
    status.hidden = false;

    // Destaca a linha de hoje na tabela de horários
    document.querySelectorAll('.horarios tr[data-dias]').forEach(function (tr) {
      if (tr.getAttribute('data-dias').split(',').indexOf(String(agora.dia)) > -1) tr.classList.add('hoje');
    });
  }

  // Política de privacidade em janela
  var janela = document.getElementById('privacidade');
  document.querySelectorAll('[data-abre="privacidade"]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (janela && typeof janela.showModal === 'function') janela.showModal();
      else if (janela) janela.setAttribute('open', '');
    });
  });

  // Aviso de cookies, lembrado no navegador
  var CHAVE = 'demo-fisio-cookies-ok';
  var aviso = document.getElementById('cookies');
  var jaViu = false;
  try { jaViu = window.localStorage.getItem(CHAVE) === '1'; } catch (e) { jaViu = false; }
  if (aviso && !jaViu) {
    aviso.hidden = false;
    document.getElementById('cookies-ok').addEventListener('click', function () {
      try { window.localStorage.setItem(CHAVE, '1'); } catch (e) { /* sem armazenamento: só esconde */ }
      aviso.hidden = true;
    });
  }
})();
