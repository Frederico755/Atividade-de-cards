// prova.js - Web Component da Prova Online

// Objeto com as questões. Para adicionar uma nova questão,
// basta adicionar um novo objeto neste array.
const questoes = [
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
    alternativas: [
      'Cria um novo elemento HTML',
      'Apaga um elemento da página',
      'Encontra um elemento pelo seu id'
    ],
    correta: 2
  },
  {
    pergunta: 'Qual atributo HTML torna um campo de formulário obrigatório?',
    alternativas: ['required', 'disabled', 'readonly'],
    correta: 0
  },
  {
    pergunta: 'O que significa CSS?',
    alternativas: [
      'Computer Style Sheets',
      'Cascading Style Sheets',
      'Creative Style System'
    ],
    correta: 1
  }
];

class MinhaProva extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });

    shadow.innerHTML = `
      <style>
        * { box-sizing: border-box; }

        .prova {
          font-family: Arial, sans-serif;
          max-width: 650px;
          margin: 0 auto;
        }

        .questao {
          background: white;
          border: 1px solid #ccc;
          border-radius: 6px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .questao p {
          font-weight: bold;
          margin: 0 0 10px;
          color: #333;
        }

        .questao label {
          display: block;
          margin: 6px 0;
          cursor: pointer;
          font-size: 14px;
        }

        .questao input[type="radio"] {
          margin-right: 8px;
        }

        button {
          padding: 10px 20px;
          background-color: #2c7be5;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 15px;
          margin-right: 10px;
        }

        button:hover {
          background-color: #1a5bbf;
        }

        #resultado {
          margin-top: 20px;
          padding: 16px;
          background: #f0f4ff;
          border: 1px solid #2c7be5;
          border-radius: 6px;
          display: none;
        }

        #resultado h3 {
          margin: 0 0 12px;
          color: #2c7be5;
        }

        .resp-item {
          margin-bottom: 10px;
          font-size: 14px;
        }

        .certo  { color: green; }
        .errado { color: red;   }
      </style>

      <div class="prova">
        <div id="questoes"></div>
        <button id="btn-corrigir">Corrigir Prova</button>
        <button id="btn-refazer" style="display:none">Responder Novamente</button>
        <div id="resultado"></div>
      </div>
    `;

    this.shadow = shadow;
    this.renderQuestoes();

    shadow.getElementById('btn-corrigir').addEventListener('click', () => this.corrigir());
    shadow.getElementById('btn-refazer').addEventListener('click', () => this.refazer());
  }

  // Monta as questões na tela
  renderQuestoes() {
    const container = this.shadow.getElementById('questoes');
    container.innerHTML = '';

    questoes.forEach(function(q, i) {
      var div = document.createElement('div');
      div.className = 'questao';

      var p = document.createElement('p');
      p.textContent = (i + 1) + ') ' + q.pergunta;
      div.appendChild(p);

      q.alternativas.forEach(function(alt, j) {
        var label = document.createElement('label');
        var input = document.createElement('input');
        input.type = 'radio';
        input.name = 'q' + i;
        input.value = j;
        label.appendChild(input);
        label.appendChild(document.createTextNode(alt));
        div.appendChild(label);
      });

      container.appendChild(div);
    });
  }

  // Corrige a prova e mostra o resultado
  corrigir() {
    var acertos = 0;
    var html = '';

    for (var i = 0; i < questoes.length; i++) {
      var selecionado = this.shadow.querySelector('input[name="q' + i + '"]:checked');

      if (!selecionado) {
        // Impede envio se alguma questão não foi respondida
        this.shadow.querySelector('input[name="q' + i + '"]').closest('.questao').style.border = '2px solid red';
        return;
      }

      this.shadow.querySelector('input[name="q' + i + '"]').closest('.questao').style.border = '1px solid #ccc';

      var q = questoes[i];
      var resposta = parseInt(selecionado.value);
      var correta = q.correta;
      var acertou = resposta === correta;

      if (acertou) acertos++;

      var classe = acertou ? 'certo' : 'errado';
      var simbolo = acertou ? '✔' : '✘';

      html += '<div class="resp-item">';
      html += '<strong>' + (i + 1) + ') ' + q.pergunta + '</strong><br>';
      html += '<span class="' + classe + '">' + simbolo + ' Você respondeu: ' + q.alternativas[resposta] + '</span><br>';
      if (!acertou) {
        html += '<span class="certo">✔ Resposta correta: ' + q.alternativas[correta] + '</span>';
      }
      html += '</div>';
    }

    var nota = ((acertos / questoes.length) * 10).toFixed(1);

    var resultado = this.shadow.getElementById('resultado');
    resultado.style.display = 'block';
    resultado.innerHTML = '<h3>Resultado: ' + acertos + ' de ' + questoes.length + ' corretas — Nota: ' + nota + '</h3>' + html;

    this.shadow.getElementById('btn-corrigir').style.display = 'none';
    this.shadow.getElementById('btn-refazer').style.display = 'inline-block';

    // Desabilita os radios após correção
    this.shadow.querySelectorAll('input[type="radio"]').forEach(function(r) {
      r.disabled = true;
    });
  }

  // Limpa tudo e reinicia
  refazer() {
    this.renderQuestoes();
    var resultado = this.shadow.getElementById('resultado');
    resultado.style.display = 'none';
    resultado.innerHTML = '';
    this.shadow.getElementById('btn-corrigir').style.display = 'inline-block';
    this.shadow.getElementById('btn-refazer').style.display = 'none';
  }
}

customElements.define('minha-prova', MinhaProva);
