/* =====================================================================
   PERGUNTAS DO JOGO  (fonte: Perguntas.docx – "Grupo 37")
   ---------------------------------------------------------------------
   Para ACRESCENTAR uma pergunta basta copiar um bloco { ... } abaixo,
   colar no fim da lista PERGUNTAS e trocar os textos.

   Campos de cada pergunta
     id          identificador único (aparece no registro .txt)
     nivel       'facil' | 'medio' | 'dificil' | 'expert'
     area        área pedagógica   (aparece no registro .txt)
     habilidade  habilidade trabalhada (aparece no registro .txt)
     texto       pergunta exibida na tela
     falar       (opcional) texto lido em voz alta, se for diferente do texto
     hero        (opcional) figura mostrada acima das alternativas
     semRotulo   (opcional) true = não escreve o nome embaixo da figura
     explicacao  frase lida depois da resposta
     opcoes      lista de alternativas; exatamente UMA com correta:true
                 cada alternativa aceita UM destes visuais:
                    img   caminho de uma foto      (ex.: IMG.letras+'letra O.jpg')
                    emoji código Twemoji           (ex.: '1f418')
                    cor   cor CSS (bloco de cor)
                    html  desenho/SVG                (ver funções abaixo)
                 e também:  rotulo (texto), fala (como a voz deve ler)
   ===================================================================== */

/* ---------- pastas das imagens ---------- */
const IMG = {
  animais: 'img/animais/',   // "Animais e seus Habitats"
  letras:  'img/letras/',    // "Letras e palavras"
  silabas: 'img/silabas/',   // "Consciência silábica"
  emoji:   'img/emoji/'
};

/* ---------- pequenos ajudantes de desenho ---------- */
const emo = (cod, estilo = '') =>
  `<img class="emo" src="${IMG.emoji}${cod}.svg" alt="" style="${estilo}">`;

const seta = () =>
  `<svg class="seta" viewBox="0 0 40 24" width="40" height="24"><path d="M2 12h30M24 4l10 8-10 8" fill="none" stroke="#2c5d73" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

const sequencia = (cods) =>
  `<div class="seq">${cods.map(c => emo(c)).join(seta())}</div>`;

const grupo = (cod, n) =>
  `<div class="grupo">${Array.from({ length: n }, () => emo(cod)).join('')}</div>`;

const giz = () => `<svg viewBox="0 0 220 60" width="220" height="60">
  <rect x="6" y="14" width="180" height="32" rx="6" fill="#e53935"/>
  <rect x="6" y="14" width="180" height="9" rx="4" fill="#ff8a80" opacity=".7"/>
  <path d="M186 14l30 16-30 16z" fill="#b71c1c"/></svg>`;

const lapis = () => `<svg viewBox="0 0 460 60" width="460" height="60">
  <rect x="4" y="14" width="34" height="32" rx="6" fill="#f48fb1"/>
  <rect x="38" y="14" width="12" height="32" fill="#b0bec5"/>
  <rect x="50" y="14" width="350" height="32" fill="#fdd835"/>
  <rect x="50" y="14" width="350" height="9" fill="#fff59d" opacity=".8"/>
  <path d="M400 14l46 16-46 16z" fill="#ffcc80"/><path d="M432 25l14 5-14 5z" fill="#37474f"/></svg>`;

const copo = (larg, alt, nivelAgua) => `<svg viewBox="0 0 200 260" width="${larg}" height="${alt}">
  <path d="M30 20h140l-18 220q-2 12-14 12H62q-12 0-14-12z" fill="#e3f2fd" fill-opacity=".55" stroke="#5b8fb9" stroke-width="10" stroke-linejoin="round"/>
  <path d="M${44 - (nivelAgua - 120) * 0.08} ${nivelAgua}h${112 + (nivelAgua - 120) * 0.16}l-10 ${240 - nivelAgua}q-2 8-12 8H66q-10 0-12-8z" fill="#4fc3f7" fill-opacity=".8"/></svg>`;

const balao = (cor) => `<svg viewBox="0 0 120 190" width="120" height="190">
  <ellipse cx="60" cy="68" rx="48" ry="58" fill="${cor}"/>
  <ellipse cx="42" cy="46" rx="11" ry="18" fill="#fff" opacity=".45"/>
  <path d="M60 126l-8 12h16z" fill="${cor}"/>
  <path d="M60 138q-14 18 0 34t0 16" fill="none" stroke="#6d6d6d" stroke-width="3"/></svg>`;

const gotas = () => `<svg viewBox="0 0 420 200" width="420" height="200">
  <path d="M110 22C75 70 50 100 50 130a60 60 0 0 0 120 0c0-30-25-60-60-108z" fill="#1e88e5"/>
  <path d="M310 22c-35 48-60 78-60 108a60 60 0 0 0 120 0c0-30-25-60-60-108z" fill="#fdd835"/>
  <text x="210" y="125" text-anchor="middle" font-size="64" font-family="'Cherry Bomb One',sans-serif" fill="#2c5d73">+</text></svg>`;

const arcoiris = (cores) => {
  const arcos = cores.map((c, i) => {
    const r = 120 - i * (96 / cores.length);
    return `<path d="M${150 - r} 150A${r} ${r} 0 0 1 ${150 + r} 150" fill="none" stroke="${c}" stroke-width="${96 / cores.length + 1}"/>`;
  }).join('');
  return `<svg viewBox="0 0 300 160" width="300" height="160">${arcos}</svg>`;
};

/* dois caminhos saindo do mesmo ponto: o do cachorro é curto e reto,
   o do gato é bem mais comprido (dá a volta) */
const caminhosDuplos = () => `<svg viewBox="0 0 760 230" width="760" height="230">
  <circle cx="40" cy="115" r="18" fill="#4aa350" stroke="#2e7d32" stroke-width="5"/>
  <path d="M60 115H300" stroke="#7197af" stroke-width="12" stroke-linecap="round" stroke-dasharray="1 24" fill="none"/>
  <image href="${IMG.emoji}1f436.svg" x="310" y="68" width="94" height="94"/>
  <path d="M58 122C110 215 190 215 270 205S420 215 520 190 640 100 660 60" stroke="#7197af" stroke-width="12" stroke-linecap="round" stroke-dasharray="1 24" fill="none" transform="translate(0,-10)"/>
  <image href="${IMG.emoji}1f431.svg" x="650" y="20" width="94" height="94"/></svg>`;

const COR = {
  vermelho: '#e53935', azul: '#1e88e5', amarelo: '#fdd835', verde: '#43a047',
  roxo: '#8e24aa', laranja: '#fb8c00', marrom: '#795548', rosa: '#f48fb1',
  azulClaro: '#81d4fa', azulEscuro: '#0b2a78', azulNoite: '#10204f', branco: '#ffffff'
};

/* nome falado das letras */
const LETRA = { S: 'esse', A: 'a', P: 'pê', O: 'ó', Q: 'quê', C: 'cê', D: 'dê', T: 'tê', F: 'éfe', R: 'érre', M: 'ême', B: 'bê' };

/* ---------- áreas ---------- */
const AREA = {
  letras: 'Letras e Palavras',
  grand: 'Grandezas e Comparações',
  cores: 'Cores',
  animais: 'Animais e seus Habitats',
  silabas: 'Consciência Silábica'
};

/* =====================================================================
   LISTA DE PERGUNTAS
   ===================================================================== */
const PERGUNTAS = [

  /* ======================= LETRAS E PALAVRAS ======================= */
  { id: 'LP-F1', nivel: 'facil', area: AREA.letras, habilidade: 'Primeira letra de uma palavra',
    texto: 'Qual é a primeira letra da palavra SAPO?',
    hero: { img: IMG.letras + 'sapo.jpg' },
    explicacao: 'A palavra sapo começa com a letra S.',
    opcoes: [
      { rotulo: 'S', fala: LETRA.S, img: IMG.letras + 'letra s.jpg', correta: true },
      { rotulo: 'A', fala: LETRA.A, img: IMG.letras + 'letra A.jpg' },
      { rotulo: 'P', fala: LETRA.P, img: IMG.letras + 'letra P.jpg' },
      { rotulo: 'O', fala: LETRA.O, img: IMG.letras + 'letra O.jpg' }
    ] },

  { id: 'LP-F2', nivel: 'facil', area: AREA.letras, habilidade: 'Reconhecimento de letras',
    texto: 'Qual destas opções é a letra O?',
    explicacao: 'A letra O é redondinha, como um círculo.',
    opcoes: [
      { rotulo: 'O', fala: LETRA.O, img: IMG.letras + 'letra O.jpg', correta: true },
      { rotulo: 'Q', fala: LETRA.Q, img: IMG.letras + 'letra Q.jpg' },
      { rotulo: 'C', fala: LETRA.C, img: IMG.letras + 'letra C.jpg' },
      { rotulo: 'D', fala: LETRA.D, img: IMG.letras + 'LETRA D.jpg' }
    ] },

  { id: 'LP-M1', nivel: 'medio', area: AREA.letras, habilidade: 'Letras dentro de uma palavra',
    texto: 'Qual letra aparece na palavra GATO?',
    hero: { img: IMG.letras + 'GATO.jpg' },
    explicacao: 'A palavra gato é formada pelas letras G, A, T, O. A letra T está no meio dela.',
    opcoes: [
      { rotulo: 'T', fala: LETRA.T, img: IMG.letras + 'LETRA T.jpg', correta: true },
      { rotulo: 'F', fala: LETRA.F, img: IMG.letras + 'LETRA F.jpg' },
      { rotulo: 'R', fala: LETRA.R, img: IMG.letras + 'LETRA R.jpg' },
      { rotulo: 'M', fala: LETRA.M, img: IMG.letras + 'LETRA M.jpg' }
    ] },

  { id: 'LP-M2', nivel: 'medio', area: AREA.letras, habilidade: 'Palavras com a mesma letra inicial',
    texto: 'Qual destas palavras começa com a mesma letra de PATO?',
    hero: { img: IMG.letras + 'PATO.jpg' },
    explicacao: 'Pato e pipa começam com a letra P.',
    opcoes: [
      { rotulo: 'PIPA', img: IMG.letras + 'PIPA.jpg', correta: true },
      { rotulo: 'SOL', img: IMG.letras + 'SOL.jpg' },
      { rotulo: 'CASA', img: IMG.letras + 'CASA.jpg' },
      { rotulo: 'BOLA', img: IMG.letras + 'BOLA.jpg' }
    ] },

  { id: 'LP-D1', nivel: 'dificil', area: AREA.letras, habilidade: 'Letra inicial de palavras',
    texto: 'Entre as palavras CASA e SAPO, qual delas começa com a letra C?',
    explicacao: 'Casa começa com C. Sapo começa com S.',
    opcoes: [
      { rotulo: 'CASA', img: IMG.letras + 'CASA.jpg', correta: true },
      { rotulo: 'SAPO', img: IMG.letras + 'sapo.jpg' },
      { rotulo: 'LUA', img: IMG.letras + 'LUA.jpg' }
    ] },

  { id: 'LP-D2', nivel: 'dificil', area: AREA.letras, habilidade: 'Contagem de letras de uma palavra',
    texto: 'Quantas letras tem a palavra SOL?',
    hero: { img: IMG.letras + 'SOL.jpg' },
    explicacao: 'A palavra sol é formada por três letras: S, O e L.',
    opcoes: [
      { rotulo: '2' }, { rotulo: '3', correta: true }, { rotulo: '4' }, { rotulo: '5' }
    ] },

  { id: 'LP-E1', nivel: 'expert', area: AREA.letras, habilidade: 'Letra escondida dentro da palavra',
    texto: 'Qual destas palavras tem a letra T escondida dentro dela?',
    explicacao: 'Gato é formado por G, A, T, O. A letra T está no meio da palavra.',
    opcoes: [
      { rotulo: 'GATO', img: IMG.letras + 'GATO.jpg', correta: true },
      { rotulo: 'LUA', img: IMG.letras + 'LUA.jpg' },
      { rotulo: 'SOL', img: IMG.letras + 'SOL.jpg' },
      { rotulo: 'CASA', img: IMG.letras + 'CASA.jpg' }
    ] },

  { id: 'LP-E2', nivel: 'expert', area: AREA.letras, habilidade: 'Diferença entre letra e palavra',
    texto: 'Qual destas opções é uma PALAVRA, e não apenas uma LETRA?',
    explicacao: 'Pato é formado por várias letras juntas, por isso é uma palavra. B, S e M são só letras sozinhas.',
    opcoes: [
      { rotulo: 'B', fala: LETRA.B, img: IMG.letras + 'LETRA B.jpg' },
      { rotulo: 'PATO', img: IMG.letras + 'PATO.jpg', correta: true },
      { rotulo: 'S', fala: LETRA.S, img: IMG.letras + 'letra s.jpg' },
      { rotulo: 'M', fala: LETRA.M, img: IMG.letras + 'LETRA M.jpg' }
    ] },

  /* ====================== GRANDEZAS E COMPARAÇÕES ====================== */
  { id: 'GC-F1', nivel: 'facil', area: AREA.grand, habilidade: 'Comparação de tamanho',
    texto: 'Qual animal é maior?',
    explicacao: 'O elefante é muito maior que o gato.',
    opcoes: [
      { rotulo: 'Elefante', html: emo('1f418', 'width:100%'), correta: true },
      { rotulo: 'Gato', html: emo('1f431', 'width:42%') }
    ], base: true },

  { id: 'GC-F2', nivel: 'facil', area: AREA.grand, habilidade: 'Comparação de comprimento',
    texto: 'Qual objeto é mais comprido?',
    explicacao: 'O lápis é mais comprido que o giz de cera.',
    opcoes: [
      { rotulo: 'Giz de cera', html: giz() },
      { rotulo: 'Lápis', html: lapis(), correta: true }
    ] },

  { id: 'GC-M1', nivel: 'medio', area: AREA.grand, habilidade: 'Comparação de peso',
    texto: 'Qual deles é mais pesado?',
    explicacao: 'A pedra é mais pesada. A pena é leve e flutua no ar.',
    opcoes: [
      { rotulo: 'Pena', emoji: '1fab6' },
      { rotulo: 'Pedra', emoji: '1faa8', correta: true }
    ] },

  { id: 'GC-M2', nivel: 'medio', area: AREA.grand, habilidade: 'Comparação de capacidade',
    texto: 'Qual copo cabe mais água?',
    explicacao: 'O copo grande guarda mais água que o copo pequeno.',
    opcoes: [
      { rotulo: 'Copo pequeno', html: copo(110, 143, 120) },
      { rotulo: 'Copo grande', html: copo(220, 286, 100), correta: true }
    ], base: true },

  { id: 'GC-D1', nivel: 'dificil', area: AREA.grand, habilidade: 'Ordenação por tamanho',
    texto: 'Qual é a ordem do menor para o maior?',
    hero: { html: `<div class="seq">${emo('1f436')}${emo('1f418')}${emo('1f41c')}</div>` },
    explicacao: 'Do menor para o maior: formiga, cachorro e elefante.',
    opcoes: [
      { rotulo: 'Cachorro, formiga, elefante', fala: 'cachorro, formiga, elefante', html: sequencia(['1f436', '1f41c', '1f418']) },
      { rotulo: 'Formiga, cachorro, elefante', fala: 'formiga, cachorro, elefante', html: sequencia(['1f41c', '1f436', '1f418']), correta: true },
      { rotulo: 'Elefante, cachorro, formiga', fala: 'elefante, cachorro, formiga', html: sequencia(['1f418', '1f436', '1f41c']) }
    ], semRotulo: true },

  { id: 'GC-D2', nivel: 'dificil', area: AREA.grand, habilidade: 'Comparação de comprimento e percepção espacial',
    texto: 'Qual caminho é mais comprido?',
    hero: { html: caminhosDuplos() },
    explicacao: 'O caminho até o gato é mais comprido.',
    opcoes: [
      { rotulo: 'Caminho até o cachorro', emoji: '1f436' },
      { rotulo: 'Caminho até o gato', emoji: '1f431', correta: true }
    ] },

  { id: 'GC-E1', nivel: 'expert', area: AREA.grand, habilidade: 'Ordenação e comparação ao mesmo tempo',
    texto: 'O cachorro é menor que o elefante e maior que a formiga. Quem está no meio?',
    explicacao: 'O cachorro está no meio: é menor que o elefante e maior que a formiga.',
    opcoes: [
      { rotulo: 'Formiga', emoji: '1f41c' },
      { rotulo: 'Cachorro', emoji: '1f436', correta: true },
      { rotulo: 'Elefante', emoji: '1f418' }
    ] },

  { id: 'GC-E2', nivel: 'expert', area: AREA.grand, habilidade: 'Comparação de quantidades',
    texto: 'Qual grupo tem mais frutas?',
    hero: { html: `<div class="dois-grupos">${grupo('1f34e', 5)}${grupo('1f34c', 3)}</div>` },
    explicacao: 'Tem cinco maçãs e só três bananas. As maçãs são mais.',
    opcoes: [
      { rotulo: 'Maçãs', emoji: '1f34e', correta: true },
      { rotulo: 'Bananas', emoji: '1f34c' },
      { rotulo: 'Os dois têm a mesma quantidade', html: '<div class="texto-grande" style="font-size:130px">=</div>' }
    ] },

  /* ============================== CORES ============================== */
  { id: 'CO-F1', nivel: 'facil', area: AREA.cores, habilidade: 'Reconhecer cores',
    texto: 'Qual dessas é a cor de uma maçã vermelha?',
    hero: { emoji: '1f34e' },
    explicacao: 'A maçã vermelha é da cor vermelha.',
    opcoes: [
      { rotulo: 'Vermelho', cor: COR.vermelho, correta: true },
      { rotulo: 'Azul', cor: COR.azul },
      { rotulo: 'Amarelo', cor: COR.amarelo },
      { rotulo: 'Verde', cor: COR.verde }
    ] },

  { id: 'CO-F2', nivel: 'facil', area: AREA.cores, habilidade: 'Reconhecer cores',
    texto: 'Qual dessas é a cor de um sol amarelo?',
    hero: { emoji: '2600' },
    explicacao: 'O sol é amarelo.',
    opcoes: [
      { rotulo: 'Verde', cor: COR.verde },
      { rotulo: 'Amarelo', cor: COR.amarelo, correta: true },
      { rotulo: 'Roxo', cor: COR.roxo },
      { rotulo: 'Vermelho', cor: COR.vermelho }
    ] },

  { id: 'CO-M1', nivel: 'medio', area: AREA.cores, habilidade: 'Encontrar a cor em objetos',
    texto: 'Qual desses objetos é verde?',
    explicacao: 'A folha é verde.',
    opcoes: [
      { rotulo: 'Bola azul', html: `<svg viewBox="0 0 100 100" width="170" height="170"><circle cx="50" cy="50" r="46" fill="#1e88e5"/><ellipse cx="34" cy="32" rx="12" ry="8" fill="#fff" opacity=".5"/></svg>` },
      { rotulo: 'Banana amarela', emoji: '1f34c' },
      { rotulo: 'Folha verde', emoji: '1f343', correta: true }
    ] },

  { id: 'CO-M2', nivel: 'medio', area: AREA.cores, habilidade: 'Encontrar a cor em uma imagem',
    texto: 'Toque no balão laranja.',
    explicacao: 'Esse é o balão laranja.',
    opcoes: [
      { rotulo: 'Balão vermelho', html: balao(COR.vermelho) },
      { rotulo: 'Balão azul', html: balao(COR.azul) },
      { rotulo: 'Balão laranja', html: balao(COR.laranja), correta: true },
      { rotulo: 'Balão verde', html: balao(COR.verde) },
      { rotulo: 'Balão roxo', html: balao(COR.roxo) }
    ], semRotulo: true },

  { id: 'CO-D1', nivel: 'dificil', area: AREA.cores, habilidade: 'Mistura de cores',
    texto: 'Se misturar azul com amarelo, qual cor aparece?',
    hero: { html: gotas() },
    explicacao: 'Azul com amarelo forma o verde.',
    opcoes: [
      { rotulo: 'Verde', cor: COR.verde, correta: true },
      { rotulo: 'Roxo', cor: COR.roxo },
      { rotulo: 'Laranja', cor: COR.laranja },
      { rotulo: 'Marrom', cor: COR.marrom }
    ] },

  { id: 'CO-D2', nivel: 'dificil', area: AREA.cores, habilidade: 'Tons de uma mesma cor',
    texto: 'Qual dessas é o azul mais escuro?',
    explicacao: 'Esse é o azul mais escuro.',
    opcoes: [
      { rotulo: 'Azul claro', cor: COR.azulClaro },
      { rotulo: 'Azul escuro', cor: COR.azulEscuro, correta: true }
    ] },

  { id: 'CO-E1', nivel: 'expert', area: AREA.cores, habilidade: 'Cores no dia a dia',
    texto: 'Qual desses é a cor do céu à noite?',
    hero: { emoji: '1f319' },
    explicacao: 'O céu à noite é azul escuro.',
    opcoes: [
      { rotulo: 'Laranja', cor: COR.laranja },
      { rotulo: 'Azul escuro', cor: COR.azulNoite, correta: true },
      { rotulo: 'Rosa', cor: COR.rosa },
      { rotulo: 'Amarelo', cor: COR.amarelo }
    ] },

  { id: 'CO-E2', nivel: 'expert', area: AREA.cores, habilidade: 'Cores do arco-íris',
    texto: 'Quais são as cores certas do arco-íris?',
    explicacao: 'As cores do arco-íris são vermelho, laranja, amarelo, verde, azul, anil e violeta.',
    opcoes: [
      { rotulo: 'Primeiro arco-íris', html: arcoiris([COR.vermelho, COR.amarelo, COR.verde, COR.azul, COR.roxo]) },
      { rotulo: 'Segundo arco-íris', html: arcoiris([COR.vermelho, '#fb8c00', COR.amarelo, COR.verde, COR.azul, '#3949ab', '#8e24aa']), correta: true },
      { rotulo: 'Terceiro arco-íris', html: arcoiris([COR.rosa, COR.marrom, COR.amarelo, COR.verde, COR.azulClaro, '#3949ab', '#8e24aa']) }
    ], semRotulo: true },

  /* ======================= ANIMAIS E SEUS HABITATS ======================= */
  { id: 'AH-F1', nivel: 'facil', area: AREA.animais, habilidade: 'Habitat dos animais',
    texto: 'Onde o peixe vive?', semRotulo: true,
    explicacao: 'O peixe vive na água.',
    opcoes: [
      { rotulo: 'Na árvore', img: IMG.animais + 'Q1 Arvore.jpg' },
      { rotulo: 'Na água', img: IMG.animais + 'Q1 Mar.jpg', correta: true },
      { rotulo: 'No deserto', img: IMG.animais + 'Q1 Deserto.png' }
    ] },

  { id: 'AH-F2', nivel: 'facil', area: AREA.animais, habilidade: 'Habitat dos animais',
    texto: 'O passarinho precisa construir um ninho. Onde seria um bom lugar para ele morar?', semRotulo: true,
    explicacao: 'O passarinho faz o ninho em uma árvore.',
    opcoes: [
      { rotulo: 'Em uma árvore', img: IMG.animais + 'Q2 Arvore ninho.jpg', correta: true },
      { rotulo: 'No fundo do mar', img: IMG.animais + 'Q2 fundo mar.jpg' },
      { rotulo: 'No deserto', img: IMG.animais + 'Q2 Deserto.jpg' }
    ] },

  { id: 'AH-M1', nivel: 'medio', area: AREA.animais, habilidade: 'Habitat dos animais',
    texto: 'Onde o pinguim vive?', semRotulo: true,
    explicacao: 'O pinguim vive em lugares frios e gelados.',
    opcoes: [
      { rotulo: 'No deserto', img: IMG.animais + 'Q3 Deserto.jpg' },
      { rotulo: 'Em regiões frias e geladas', img: IMG.animais + 'Q3 Neve.jpg', correta: true },
      { rotulo: 'Na floresta tropical', img: IMG.animais + 'Q3 floresta.jpg' }
    ] },

  { id: 'AH-M2', nivel: 'medio', area: AREA.animais, habilidade: 'Moradia dos animais',
    texto: 'Qual animal vive em uma colmeia?', semRotulo: true,
    explicacao: 'A abelha vive na colmeia.',
    opcoes: [
      { rotulo: 'Abelha', img: IMG.animais + 'Q4 Abelha.jpg', correta: true },
      { rotulo: 'Cavalo', img: IMG.animais + 'Q4 Cavalo.jpg' },
      { rotulo: 'Elefante', img: IMG.animais + 'Q4 Elefante.jpg' }
    ] },

  { id: 'AH-D1', nivel: 'dificil', area: AREA.animais, habilidade: 'Características dos animais',
    texto: 'Um animal possui penas coloridas, alimenta-se de frutas e vive no topo de árvores altas em um local com clima quente. Qual é esse animal?', semRotulo: true,
    explicacao: 'É a arara, que tem penas coloridas e vive nas árvores altas.',
    opcoes: [
      { rotulo: 'Urso-polar', img: IMG.animais + 'Q5 Urso Polar.jpg' },
      { rotulo: 'Arara', img: IMG.animais + 'Q5 Arara.jpg', correta: true },
      { rotulo: 'Camelo', img: IMG.animais + 'Q5 Camelo.jpg' }
    ] },

  { id: 'AH-D2', nivel: 'dificil', area: AREA.animais, habilidade: 'Fauna brasileira',
    texto: 'Qual destes animais faz parte da fauna brasileira?', semRotulo: true,
    explicacao: 'A onça-pintada é um animal brasileiro.',
    opcoes: [
      { rotulo: 'Hipopótamo', img: IMG.animais + 'Q6 Hipopotamo.jpg' },
      { rotulo: 'Panda', img: IMG.animais + 'Q6 Panda.jpg' },
      { rotulo: 'Onça-pintada', img: IMG.animais + 'Q6 Onca Pintada.jpg', correta: true }
    ] },

  { id: 'AH-E1', nivel: 'expert', area: AREA.animais, habilidade: 'Moradia dos animais',
    texto: 'Qual animal vive embaixo da terra e faz túneis?', semRotulo: true,
    explicacao: 'A toupeira vive embaixo da terra e faz túneis.',
    opcoes: [
      { rotulo: 'Toupeira', img: IMG.animais + 'Q7 Toupeira.jpg', correta: true },
      { rotulo: 'Girafa', img: IMG.animais + 'Q7 Girafa.jpg' },
      { rotulo: 'Golfinho', img: IMG.animais + 'Q7 Golfinho.jpg' }
    ] },

  { id: 'AH-E2', nivel: 'expert', area: AREA.animais, habilidade: 'Fauna brasileira',
    texto: 'Qual animal é encontrado naturalmente no Pantanal brasileiro?', semRotulo: true,
    explicacao: 'O jacaré vive no Pantanal.',
    opcoes: [
      { rotulo: 'Jacaré', img: IMG.animais + 'Q8 Jacare.jpg', correta: true },
      { rotulo: 'Lobo', img: IMG.animais + 'Q8 Lobo.jpg' },
      { rotulo: 'Rinoceronte', img: IMG.animais + 'Q8 Rinoceronte.jpg' }
    ] },

  /* ========================= CONSCIÊNCIA SILÁBICA ========================= */
  { id: 'CS-F1', nivel: 'facil', area: AREA.silabas, habilidade: 'Sílaba inicial',
    texto: 'Qual palavra começa com a sílaba CA?', falar: 'Qual palavra começa com a sílaba cá?',
    explicacao: 'Cavalo começa com a sílaba ca.',
    opcoes: [
      { rotulo: 'CAVALO', img: IMG.animais + 'Q4 Cavalo.jpg', correta: true },
      { rotulo: 'BOLA', img: IMG.silabas + 'bola.jpg' },
      { rotulo: 'SAPO', img: IMG.silabas + 'sapo.jpg' }
    ] },

  { id: 'CS-F2', nivel: 'facil', area: AREA.silabas, habilidade: 'Contagem de sílabas',
    texto: 'Qual palavra tem 2 sílabas?',
    explicacao: 'Bo-la tem duas sílabas: bo e la.',
    opcoes: [
      { rotulo: 'BO-LA', fala: 'bó, lá', img: IMG.silabas + 'bola.jpg', correta: true },
      { rotulo: 'CA-DEI-RA', fala: 'ca, dei, ra', img: IMG.silabas + 'cadeira.jpg' },
      { rotulo: 'E-LE-FAN-TE', fala: 'e, le, fan, te', img: IMG.silabas + 'elefante.jpg' }
    ] },

  { id: 'CS-M1', nivel: 'medio', area: AREA.silabas, habilidade: 'Contagem de sílabas',
    texto: 'Quantas sílabas tem a palavra BANANA?',
    hero: { img: IMG.silabas + 'banana.jpg' },
    explicacao: 'Ba, na, na. A palavra banana tem três sílabas.',
    opcoes: [{ rotulo: '2' }, { rotulo: '3', correta: true }, { rotulo: '4' }] },

  { id: 'CS-M2', nivel: 'medio', area: AREA.silabas, habilidade: 'Sílaba final',
    texto: 'Qual palavra termina com a sílaba TO?', falar: 'Qual palavra termina com a sílaba tô?',
    explicacao: 'Gato termina com a sílaba to.',
    opcoes: [
      { rotulo: 'BOL', fala: 'bol' },
      { rotulo: 'GATO', img: IMG.silabas + 'gato.jpg', correta: true },
      { rotulo: 'CASA', img: IMG.silabas + 'casa.jpg' }
    ] },

  { id: 'CS-D1', nivel: 'dificil', area: AREA.silabas, habilidade: 'Sílaba inicial igual',
    texto: 'Qual palavra começa com a mesma sílaba de SAPO?',
    hero: { img: IMG.silabas + 'sapo.jpg' },
    explicacao: 'Sacola e sapo começam com a sílaba sa.',
    opcoes: [
      { rotulo: 'SACOLA', img: IMG.silabas + 'sacola.jpg', correta: true },
      { rotulo: 'BONECA', img: IMG.silabas + 'bonec.jpg' },
      { rotulo: 'PATO', img: IMG.silabas + 'pato.jpg' }
    ] },

  { id: 'CS-D2', nivel: 'dificil', area: AREA.silabas, habilidade: 'Juntar sílabas',
    texto: 'Se juntarmos as sílabas CA, DEI e RA, qual palavra formamos?', falar: 'Se juntarmos as sílabas cá, dêi e rá, qual palavra formamos?',
    explicacao: 'Ca, dei, ra forma a palavra cadeira.',
    opcoes: [
      { rotulo: 'CADERNO', img: IMG.silabas + 'caderno.jpg' },
      { rotulo: 'CADEIRA', img: IMG.silabas + 'cadeira.jpg', correta: true },
      { rotulo: 'CACHORRO', emoji: '1f436' }
    ] },

  { id: 'CS-E1', nivel: 'expert', area: AREA.silabas, habilidade: 'Retirar sílaba de uma palavra',
    texto: 'Se tirarmos a primeira sílaba da palavra BONECA, o que sobra?',
    hero: { img: IMG.silabas + 'bonec.jpg' },
    explicacao: 'Bo-ne-ca sem a primeira sílaba fica neca.',
    opcoes: [
      { rotulo: 'NECA', fala: 'néca', correta: true },
      { rotulo: 'BOCA', fala: 'bóca' },
      { rotulo: 'BONE', fala: 'bóne' }
    ] }
];

/* ---------- níveis ---------- */
const NIVEIS = {
  facil:   { nome: 'FÁCIL',   cor: '#0d5d22' },
  medio:   { nome: 'MÉDIO',   cor: '#f9a23e' },
  dificil: { nome: 'DIFÍCIL', cor: '#d40000' },
  expert:  { nome: 'EXPERT',  cor: '#332887' }
};
const ORDEM_NIVEIS = ['facil', 'medio', 'dificil', 'expert'];

/* Sugestões para o campo "Escola" (pode digitar outra). EDITE com as escolas reais. */
const ESCOLAS = [
  'Escola Municipal (exemplo 1)',
  'Escola Municipal (exemplo 2)',
  'Escola Municipal (exemplo 3)'
];
