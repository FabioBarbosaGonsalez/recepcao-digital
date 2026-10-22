// Recepção Digital — comportamento da página
(function () {
  'use strict';

  // Barra superior ganha uma linha de base ao rolar
  var topo = document.getElementById('topo');
  var marcarTopo = function () { topo.classList.toggle('rolou', window.scrollY > 8); };
  marcarTopo();
  window.addEventListener('scroll', marcarTopo, { passive: true });

  // Entrada suave: as partes de cada seção aparecem em sequência
  var partes = Array.prototype.slice.call(document.querySelectorAll('.surge'));
  if (!('IntersectionObserver' in window)) {
    partes.forEach(function (el) { el.classList.add('visivel'); });
  } else {
    var porSecao = new Map();
    partes.forEach(function (el) {
      var dono = el.closest('section, footer') || document.body;
      var lista = porSecao.get(dono) || [];
      el.style.setProperty('--atraso', Math.min(lista.length, 6) * 80 + 'ms');
      lista.push(el);
      porSecao.set(dono, lista);
    });
    var obs = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visivel'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    partes.forEach(function (el) { obs.observe(el); });
  }

  // Prévia do topo do site
  var profs = {
    fisio:  { nome: 'Fisioterapeuta · Pilates clínico', reg: 'CREFITO-3 000000-F', regra: 'Segue as normas de publicidade do COFFITO.', pedido: 'agendar uma avaliação' },
    dent:   { nome: 'Cirurgiã-dentista · Clínica geral', reg: 'CRO-SP 00000', regra: 'Segue o Código de Ética e as normas de publicidade do CFO.', pedido: 'agendar uma consulta' },
    psi:    { nome: 'Psicóloga · Atendimento adulto', reg: 'CRP 06/000000', regra: 'Segue o Código de Ética e as normas de publicidade do CFP e do CRP.', pedido: 'saber sobre horários para a primeira sessão' },
    nutri:  { nome: 'Nutricionista · Nutrição clínica', reg: 'CRN-3 00000', regra: 'Segue as normas de publicidade do CFN.', pedido: 'agendar uma consulta' },
    biomed: { nome: 'Biomédica esteta', reg: 'CRBM-1 00000', regra: 'Segue as normas de publicidade do CFBM.', pedido: 'agendar uma avaliação' },
    estet:  { nome: 'Esteticista · Estética facial', reg: 'Profissão regulamentada pela Lei 13.643/2018', regra: 'Sem conselho próprio: segue o Código de Defesa do Consumidor e a LGPD.', pedido: 'agendar um horário' }
  };

  var campoNome = document.getElementById('p-nome');
  var campoProf = document.getElementById('p-prof');
  var campoBairro = document.getElementById('p-bairro');
  if (!campoNome || !campoProf) return;

  var el = function (id) { return document.getElementById(id); };

  var atualizar = function () {
    var nome = campoNome.value.trim() || 'Seu nome';
    var p = profs[campoProf.value] || profs.fisio;
    var bairro = campoBairro.value.trim() || 'Seu bairro';
    el('v-nome').textContent = nome;
    el('v-nome-curto').textContent = nome;
    el('v-prof').textContent = p.nome;
    el('v-reg').textContent = p.reg;
    el('v-local').textContent = bairro + ', Campinas-SP · seg. a sex., 8h às 19h';
    el('v-msg').textContent = 'Olá, ' + nome + '! Vi seu site e gostaria de ' + p.pedido + '.';
    el('v-regra').textContent = p.regra;
  };

  [campoNome, campoProf, campoBairro].forEach(function (c) {
    c.addEventListener('input', atualizar);
    c.addEventListener('change', atualizar);
  });
  atualizar();
})();
