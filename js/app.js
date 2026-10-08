// Câmbio Hoje — Incrementos 1 (JS básico) e 2 (DOM + eventos, sem reload).
// Fontes (sem chave, com CORS): BCB SGS (USD série 1, EUR série 21619) + CoinGecko (BTC).
// JS puro, sem dependências.
(function () {
  'use strict';

  var BCB = 'https://api.bcb.gov.br/dados/serie/bcdata.sgs.';
  var GECKO = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl';

  var FIAT = ['BRL', 'USD', 'EUR'];

  var state = {
    rates: { BRL: 1 }, // taxa em BRL por 1 unidade
    date: null,
    loading: false,
  };

  var form = document.getElementById('conversor-form');
  var valorInput = document.getElementById('valor');
  var deSelect = document.getElementById('de');
  var paraSelect = document.getElementById('para');
  var resultado = document.getElementById('resultado');
  var statusEl = document.getElementById('status');

  function setStatus(msg) {
    if (statusEl) statusEl.textContent = msg;
  }

  // Inc 1: variáveis, tipos, operadores, condicionais, funções, arrays e objetos.
  function parseValor(raw) {
    var n = parseFloat(String(raw).replace(',', '.'));
    return isNaN(n) || n < 0 ? null : n;
  }

  function formatMoeda(valor, moeda) {
    if (moeda === 'BTC') return valor.toFixed(8) + ' BTC';
    try {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: moeda }).format(valor);
    } catch (e) {
      return valor.toFixed(2) + ' ' + moeda;
    }
  }

  function converter(valor, de, para) {
    if (!(de in state.rates) || !(para in state.rates)) return null;
    var emBRL = valor * state.rates[de];
    return emBRL / state.rates[para];
  }

  function render() {
    var valor = parseValor(valorInput.value);
    var de = deSelect.value;
    var para = paraSelect.value;
    if (valor === null) {
      resultado.innerHTML = '<h3>Resultado</h3><p>Digite um valor válido (número maior ou igual a zero).</p>';
      return;
    }
    var out = converter(valor, de, para);
    if (out === null) {
      resultado.innerHTML = '<h3>Resultado</h3><p>Cotação indisponível. Tente recarregar a página.</p>';
      return;
    }
    resultado.innerHTML =
      '<h3>Resultado</h3>' +
      '<p class="valor">' + formatMoeda(out, para) + '</p>' +
      '<p><small>' + formatMoeda(valor, de) + ' = ' + formatMoeda(out, para) +
      ' (1 ' + de + ' = ' + formatMoeda(state.rates[de] / state.rates[para], para) + ')</small></p>';
  }

  function fetchJSON(url) {
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    });
  }

  function carregarCotacoes() {
    if (state.loading) return;
    state.loading = true;
    setStatus('Buscando cotações…');
    Promise.all([
      fetchJSON(BCB + '1/dados/ultimos/1?formato=json'),
      fetchJSON(BCB + '21619/dados/ultimos/1?formato=json'),
      fetchJSON(GECKO),
    ]).then(function (resp) {
      var usd = parseFloat(resp[0][0].valor);
      var eur = parseFloat(resp[1][0].valor);
      var btc = resp[2] && resp[2].bitcoin && resp[2].bitcoin.brl;
      if (!(usd > 0) || !(eur > 0) || !(btc > 0)) throw new Error('cotação inválida');
      state.rates.USD = usd;
      state.rates.EUR = eur;
      state.rates.BTC = btc;
      state.date = resp[0][0].data;
      state.loading = false;
      setStatus('Cotações atualizadas em ' + state.date + ' (BCB + CoinGecko).');
      render();
    }).catch(function () {
      state.loading = false;
      setStatus('Falha ao buscar cotações. Verifique sua conexão e recarregue.');
      resultado.innerHTML = '<h3>Resultado</h3><p>Não foi possível carregar as cotações agora.</p>';
    });
  }

  // Inc 2: interação sem recarregar a página.
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    render();
  });
  [valorInput, deSelect, paraSelect].forEach(function (el) {
    el.addEventListener('input', render);
    el.addEventListener('change', render);
  });

  carregarCotacoes();
})();
