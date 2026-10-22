// Estúdio Aurora — comportamento da página (demonstração)
(function () {
  'use strict';

  var WHATS = 'https://wa.me/5519900000000?text=';

  // Quanto tempo reservar: soma as durações e monta a mensagem
  var caixas = Array.prototype.slice.call(document.querySelectorAll('.escolhas input[type="checkbox"]'));
  var total = document.getElementById('tempo-total');
  var nota = document.getElementById('tempo-nota');
  var msg = document.getElementById('tempo-msg');
  var botao = document.getElementById('tempo-botao');

  var formatar = function (min) {
    var h = Math.floor(min / 60), m = min % 60;
    if (!h) return m + ' min';
    return h + 'h' + (m ? String(m).padStart(2, '0') : '');
  };

  var juntar = function (nomes) {
    if (nomes.length < 2) return nomes.join('');
    return nomes.slice(0, -1).join(', ') + ' e ' + nomes[nomes.length - 1];
  };

  var atualizar = function () {
    var marcadas = caixas.filter(function (c) { return c.checked; });
    var texto;
    if (!marcadas.length) {
      total.textContent = '40 min';
      nota.textContent = 'Sem procedimento marcado, reserve o tempo de uma avaliação. Nela, a responsável técnica indica o que faz sentido para a sua pele.';
      texto = 'Olá! Gostaria de agendar uma avaliação no Estúdio Aurora.';
    } else {
      var min = 0, max = 0;
      marcadas.forEach(function (c) { min += +c.dataset.min; max += +c.dataset.max; });
      total.textContent = min === max ? formatar(min) : formatar(min) + ' a ' + formatar(max);
      nota.textContent = marcadas.length > 1
        ? 'Se feitos no mesmo dia. Na avaliação, a responsável técnica confirma o que é indicado e em que ordem.'
        : 'Na avaliação, a responsável técnica confirma se o procedimento é indicado para você.';
      texto = 'Olá! Gostaria de agendar uma avaliação para ' + juntar(marcadas.map(function (c) { return c.dataset.nome; })) + '.';
    }
    msg.textContent = '“' + texto + '”';
    botao.href = WHATS + encodeURIComponent(texto);
  };

  if (caixas.length && total) {
    caixas.forEach(function (c) { c.addEventListener('change', atualizar); });
    atualizar();
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
  var CHAVE = 'demo-aurora-cookies-ok';
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
