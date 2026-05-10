// prova.js - Web Component da Prova Online

// Para adicionar uma nova questão, basta copiar um bloco abaixo
var questoes = [
  {
    pergunta: 'Qual tag HTML define o conteúdo principal de uma página?',
    alternativas: ['<section>', '<main>', '<div>'],
    correta: 1
  },
  {
    pergunta: 'Qual propriedade CSS coloca elementos lado a lado?',
    alternativas: ['display: block', 'display: flex', 'display: inline-block'],
    correta: 1
  },
  {
    pergunta: 'O que faz o método getElementById() no JavaScript?',
    alternativas: ['Cria um novo elemento HTML', 'Apaga um elemento da página', 'Encontra um elemento pelo seu id'],
    correta: 2
  },
  {
    pergunta: 'Qual atributo HTML torna um campo de formulário obrigatório?',
    alternativas: ['required', 'disabled', 'readonly'],
    correta: 0
  },
  {
    pergunta: 'O que significa CSS?',
    alternativas: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style System'],
    correta: 1
  }
];


// Evita que textos com < e > sejam interpretados como HTML
function escapar(texto) {
  return texto.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

class MinhaProva extends HTMLElement {

  connectedCallback() {
    var shadow = this.attachShadow({ mode: 'open' });

    var htmlQuestoes = '';

    questoes.forEach(function(q, i) {
      var opcoesHtml = '';
      q.alternativas.forEach(function(alt, j) {
        opcoesHtml += `
          <label class="opcao">
            <input type="radio" name="q${i}" value="${j}">
            ${escapar(alt)}
          </label>`;
      });

      htmlQuestoes += `
        <div class="questao">
          <p>${i + 1}) ${q.pergunta}</p>
          ${opcoesHtml}
          <div class="feedback" id="feedback-${i}"></div>
        </div>`;
    });

    shadow.innerHTML = `
      <style>
        .questao { background: white; border: 1px solid #ccc; border-radius: 6px; padding: 16px; margin-bottom: 16px; }
        .questao p { font-weight: bold; margin: 0 0 10px; }
        .opcao { display: block; margin: 6px 0; cursor: pointer; font-size: 14px; }
        .opcao input { margin-right: 8px; }
        button { padding: 10px 20px; background-color: #3d5a47; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; margin-right: 10px; }
        button:hover { background-color: #c8a96e; color: #2d2d2d; }
        #resultado { margin-top: 20px; padding: 16px; background: #f0f4e8; border: 1px solid #3d5a47; border-radius: 6px; display: none; font-size: 15px; text-align: center; }
        .certo { color: green; font-weight: bold; margin-top: 8px; }
        .errado { color: red; font-weight: bold; margin-top: 8px; }
      </style>

      ${htmlQuestoes}

      <button id="btn-corrigir">Corrigir Prova</button>
      <button id="btn-refazer" style="display:none">Responder Novamente</button>
      <div id="resultado"></div>
    `;

    this.shadow = shadow;
    this.inicializarEventos();
  }

  inicializarEventos() {
    this.shadow.getElementById('btn-corrigir').addEventListener('click', () => this.corrigir());
    this.shadow.getElementById('btn-refazer').addEventListener('click', () => this.refazer());
  }

  corrigir() {
    var acertos = 0;

    questoes.forEach((q, i) => {
      var selecionado = this.shadow.querySelector('input[name="q' + i + '"]:checked');
      var feedback = this.shadow.getElementById('feedback-' + i);

      if (!selecionado) {
        feedback.innerHTML = '<div class="errado">Você não respondeu esta questão.</div>';
        return;
      }

      if (parseInt(selecionado.value) === q.correta) {
        acertos++;
        feedback.innerHTML = '<div class="certo">✔ Resposta correta!</div>';
      } else {
        feedback.innerHTML = '<div class="errado">✘ Incorreta. Correta: ' + q.alternativas[q.correta] + '</div>';
      }
    });

    var resultado = this.shadow.getElementById('resultado');
    resultado.style.display = 'block';
    resultado.innerHTML = '<strong>Você acertou ' + acertos + ' de ' + questoes.length + ' — Nota: ' + ((acertos / questoes.length) * 10).toFixed(1) + '</strong>';

    this.shadow.getElementById('btn-corrigir').style.display = 'none';
    this.shadow.getElementById('btn-refazer').style.display = 'inline-block';
  }

  refazer() {
    this.shadow.querySelectorAll('input[type="radio"]').forEach(function(r) { r.checked = false; });
    this.shadow.querySelectorAll('.feedback').forEach(function(f) { f.innerHTML = ''; });

    var resultado = this.shadow.getElementById('resultado');
    resultado.style.display = 'none';
    resultado.innerHTML = '';

    this.shadow.getElementById('btn-corrigir').style.display = 'inline-block';
    this.shadow.getElementById('btn-refazer').style.display = 'none';
  }
}

customElements.define('minha-prova', MinhaProva);