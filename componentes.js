// componentes.js - Web Components compartilhados do site

// BARRA LATERAL (header + nav juntos)
class BarraLateral extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div id="barra-lateral">
        <header>
          <h1>Design de Interface</h1>
          <p>Trabalhos do semestre</p>
        </header>
        <nav id="navegacao">
          <a class="button" href="index.html">Apresentação</a>
          <a class="button" href="trabalho1.html">Trabalho 1</a>
          <a class="button" href="trabalho2.html">Trabalho 2</a>
          <a class="button" href="#">Trabalho 3</a>
        </nav>
        <footer class="rodape">
          <p>Design de Interface &mdash; 2025</p>
        </footer>
      </div>
    `;
  }
}
customElements.define('barra-lateral', BarraLateral);

// CARD-INFO — template com slot
// Uso: <card-info titulo="Título">Conteúdo aqui</card-info>
const templateCard = document.createElement('template');
templateCard.innerHTML = `
  <style>
    .card {
      border: 1px solid #c8a96e;
      border-radius: 6px;
      padding: 16px;
      margin: 10px 0;
      background: #faf7f2;
    }
    .card h4 {
      margin: 0 0 8px;
      color: #3d5a47;
    }
  </style>
  <div class="card">
    <h4 id="titulo-card"></h4>
    <slot></slot>
  </div>
`;

class CardInfo extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(templateCard.content.cloneNode(true));
    shadow.getElementById('titulo-card').textContent = this.getAttribute('titulo') || '';
  }
}
customElements.define('card-info', CardInfo);
