// editor.js - JavaScript do Editor de Cartões

var contadorElementos = 0;

// FUNDO DO CARTÃO

function mudarCorFundo() {
  var cor = document.getElementById('cor-fundo').value;
  document.getElementById('cartao').style.backgroundColor = cor;
}

function mudarBorda() {
  var valor = document.getElementById('tamanho-borda').value;
  document.getElementById('val-borda').textContent = valor + 'px';
  document.getElementById('cartao').style.borderRadius = valor + 'px';
}

function aplicarTema() {
  var tema = document.getElementById('tema').value;
  var cartao = document.getElementById('cartao');
  var inputCor = document.getElementById('cor-fundo');

  if (tema === 'aniversario') {
    cartao.style.backgroundColor = '#fff9c4';
    inputCor.value = '#fff9c4';
  } else if (tema === 'natal') {
    cartao.style.backgroundColor = '#c8f7c5';
    inputCor.value = '#c8f7c5';
  } else if (tema === 'pascoa') {
    cartao.style.backgroundColor = '#f9e4f7';
    inputCor.value = '#f9e4f7';
  }
}

// ADICIONAR TEXTO

function adicionarTexto() {
  var conteudo = document.getElementById('texto-novo').value.trim();

  if (conteudo === '') {
    document.getElementById('texto-novo').style.border = '2px solid red';
    return;
  }

  document.getElementById('texto-novo').style.border = '1px solid #bbb';

  var cor   = document.getElementById('cor-texto').value;
  var tam   = document.getElementById('tamanho-texto').value;
  var fonte = document.getElementById('fonte').value;

  var div = document.createElement('div');
  div.textContent      = conteudo;
  div.style.color      = cor;
  div.style.fontSize   = tam + 'px';
  div.style.fontFamily = fonte;
  div.style.padding    = '4px';
  div.style.cursor     = 'move';
  div.style.whiteSpace = 'nowrap';

  // Posição inicial: centro do cartão
  var cartao = document.getElementById('cartao');
  var posX = Math.round(cartao.offsetWidth / 2 - 60);
  var posY = Math.round(cartao.offsetHeight / 2 - 20);

  esconderTextoPadrao();
  adicionarElementoNoCartao(div, posX, posY, 'Texto: "' + conteudo.substring(0, 20) + '"');

  document.getElementById('texto-novo').value = '';
}

// ADICIONAR IMAGEM

function adicionarImagem() {
  var input   = document.getElementById('imagem');
  var arquivo = input.files[0];

  if (!arquivo) return;

  var leitor = new FileReader();
  leitor.onload = function(evento) {
    var img = document.createElement('img');
    img.src         = evento.target.result;
    img.alt         = 'Imagem do cartão';
    img.style.width  = '200px';
    img.style.height = '200px';
    img.style.objectFit = 'cover';
    img.style.cursor = 'move';
    img.style.display = 'block';

    // Posição inicial: centralizada na parte de baixo do cartão
    var cartao = document.getElementById('cartao');
    var posX = Math.round(cartao.offsetWidth / 2 - 50);  // 50 = metade de 100px
    var posY = cartao.offsetHeight - 110;                  // 10px acima da borda

    esconderTextoPadrao();
    adicionarElementoNoCartao(img, posX, posY, 'Imagem: ' + arquivo.name.substring(0, 20));

    input.value = '';
  };

  leitor.readAsDataURL(arquivo);
}

// FUNÇÃO CENTRAL: coloca o elemento no cartão e na lista

function adicionarElementoNoCartao(elemento, posX, posY, descricao) {
  contadorElementos++;
  var idEl = 'el-' + contadorElementos;
  elemento.id = idEl;

  elemento.style.position = 'absolute';
  elemento.style.left = posX + 'px';
  elemento.style.top  = posY + 'px';

  document.getElementById('cartao').appendChild(elemento);

  tornarArrastavel(elemento);
  adicionarNaLista(descricao, idEl);
}

// FUNÇÃO DE ARRASTAR

function tornarArrastavel(elemento) {
  var arrastando = false;
  var offsetX = 0;
  var offsetY = 0;

  elemento.addEventListener('mousedown', function(e) {
    arrastando = true;
    // Guarda onde o mouse clicou dentro do elemento
    offsetX = e.clientX - elemento.getBoundingClientRect().left;
    offsetY = e.clientY - elemento.getBoundingClientRect().top;
    e.preventDefault();
  });

  document.addEventListener('mousemove', function(e) {
    if (!arrastando) return;

    var cartao    = document.getElementById('cartao');
    var retCartao = cartao.getBoundingClientRect();

    // Nova posição = posição do mouse - posição do cartão - onde clicou no elemento
    var novoX = e.clientX - retCartao.left - offsetX;
    var novoY = e.clientY - retCartao.top  - offsetY;

    // Limita para não sair do cartão
    novoX = Math.max(0, Math.min(novoX, cartao.offsetWidth  - elemento.offsetWidth));
    novoY = Math.max(0, Math.min(novoY, cartao.offsetHeight - elemento.offsetHeight));

    elemento.style.left = novoX + 'px';
    elemento.style.top  = novoY + 'px';
  });

  document.addEventListener('mouseup', function() {
    arrastando = false;
  });
}

// LISTA DE ELEMENTOS

function adicionarNaLista(descricao, idEl) {
  document.getElementById('msg-vazio').style.display = 'none';

  var item = document.createElement('div');
  item.className = 'item-lista';
  item.id = 'item-' + idEl;

  var texto = document.createElement('span');
  texto.textContent = descricao;

  var btn = document.createElement('button');
  btn.textContent = 'Remover';
  btn.className   = 'btn-remover';
  btn.onclick = function() {
    removerElemento(idEl);
  };

  item.appendChild(texto);
  item.appendChild(btn);
  document.getElementById('lista-elementos').appendChild(item);
}

function removerElemento(idEl) {
  var el = document.getElementById(idEl);
  if (el) el.remove();

  var item = document.getElementById('item-' + idEl);
  if (item) item.remove();

  var itens = document.querySelectorAll('.item-lista');
  if (itens.length === 0) {
    document.getElementById('msg-vazio').style.display = 'block';
  }
}

// -------------------------------------------------------
// ESCONDE O TEXTO INICIAL DO CARTÃO VAZIO
// -------------------------------------------------------

function esconderTextoPadrao() {
  var padrao = document.getElementById('texto-padrao');
  if (padrao) padrao.style.display = 'none';
}