/* =====================================================================
   JOGO INFANTIL – Pré-escolar II
   Lógica do jogo: telas, voz, sons, pontuação e registro das tentativas.
   As perguntas ficam em perguntas.js.
   ===================================================================== */
(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));
  const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const embaralhar = (v) => { const a = v.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  const stage = $('#stage');

  /* ------------------------ tela cheia proporcional ------------------------ */
  function ajustar() {
    const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.transform = 'scale(' + s + ')';
    stage.style.left = (window.innerWidth - 1920 * s) / 2 + 'px';
    stage.style.top = (window.innerHeight - 1080 * s) / 2 + 'px';
  }
  window.addEventListener('resize', ajustar);
  ajustar();

  /* ------------------------------ telas ------------------------------ */
  const FUNDO = { tLogin: 1, tNivel: 1, tPergunta: 0.3, tAcerto: 0.6, tErro: 0.35, tFim: 0.5 };
  function mostrarTela(id) {
    $$('.tela').forEach((t) => t.classList.remove('ativa'));
    $('#' + id).classList.add('ativa');
    stage.style.setProperty('--fundo', FUNDO[id] != null ? FUNDO[id] : 1);
  }

  /* ------------------------------ voz ------------------------------ */
  const Voz = {
    voz: null, token: 0,
    disponivel: 'speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function',
    iniciar() {
      if (!this.disponivel) return;
      const carregar = () => {
        const v = window.speechSynthesis.getVoices();
        this.voz = v.find((x) => /^pt[-_]BR/i.test(x.lang) && /google|microsoft|natural|neural/i.test(x.name)) ||
                   v.find((x) => /^pt[-_]BR/i.test(x.lang)) || v.find((x) => /^pt/i.test(x.lang)) || null;
      };
      carregar();
      window.speechSynthesis.onvoiceschanged = carregar;
    },
    parar() { this.token++; if (this.disponivel) { try { window.speechSynthesis.cancel(); } catch (e) { /* ignora */ } } },
    falar(texto) {
      return new Promise((resolve) => {
        if (!this.disponivel || !texto) return resolve();
        const u = new window.SpeechSynthesisUtterance(texto);
        u.lang = 'pt-BR'; u.rate = 0.85; u.pitch = 1.05;
        if (this.voz) u.voice = this.voz;
        let fim = false;
        const acabar = () => { if (!fim) { fim = true; resolve(); } };
        u.onend = acabar; u.onerror = acabar;
        setTimeout(acabar, 8000 + texto.length * 110);   // nunca trava o jogo
        try { window.speechSynthesis.speak(u); } catch (e) { acabar(); }
      });
    },
    /* fala uma lista de frases, uma de cada vez; devolve false se foi interrompida */
    async sequencia(lista) {
      const meu = ++this.token;
      if (this.disponivel) { try { window.speechSynthesis.cancel(); } catch (e) { /* ignora */ } }
      await esperar(120);
      for (const t of lista) {
        if (meu !== this.token) return false;
        await this.falar(t);
        if (meu !== this.token) return false;
        await esperar(220);
      }
      return true;
    }
  };

  /* ------------------------------ sons ------------------------------ */
  const Som = {
    ctx: null,
    ligar() {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!this.ctx && C) { try { this.ctx = new C(); } catch (e) { this.ctx = null; } }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    },
    nota(freq, inicio, dur, tipo, vol) {
      if (!this.ctx) return;
      const t0 = this.ctx.currentTime + inicio;
      const o = this.ctx.createOscillator(); const g = this.ctx.createGain();
      o.type = tipo || 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(vol || 0.2, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      o.connect(g); g.connect(this.ctx.destination); o.start(t0); o.stop(t0 + dur + 0.05);
    },
    acerto() { [523, 659, 784, 1047].forEach((f, i) => this.nota(f, i * 0.11, 0.35, 'triangle', 0.22)); },
    tente()  { this.nota(392, 0, 0.3, 'sine', 0.16); this.nota(330, 0.22, 0.4, 'sine', 0.14); },   /* suave e acolhedor */
    fim()    { [523, 659, 784, 659, 784, 1047].forEach((f, i) => this.nota(f, i * 0.13, 0.4, 'triangle', 0.22)); }
  };

  /* ---------------------- registro das tentativas (.txt) ---------------------- */
  const Registro = {
    CH: 'jogoInfantil_registro_v1', SEQ: 'jogoInfantil_seq_v1',
    memoria: { linhas: [], seq: 0 }, usaMemoria: false,
    ler() {
      if (this.usaMemoria) return this.memoria.linhas;
      try { return JSON.parse(localStorage.getItem(this.CH) || '[]'); } catch (e) { this.usaMemoria = true; return this.memoria.linhas; }
    },
    gravar(linhas) {
      if (!this.usaMemoria) { try { localStorage.setItem(this.CH, JSON.stringify(linhas)); return; } catch (e) { this.usaMemoria = true; } }
      this.memoria.linhas = linhas;
    },
    proximoId() {            /* auto-incremento */
      if (!this.usaMemoria) {
        try { const n = (parseInt(localStorage.getItem(this.SEQ) || '0', 10) || 0) + 1; localStorage.setItem(this.SEQ, String(n)); return n; }
        catch (e) { this.usaMemoria = true; }
      }
      return ++this.memoria.seq;
    },
    adicionar(r) {
      const agora = new Date();
      const d = (n) => String(n).padStart(2, '0');
      r.id = this.proximoId();
      r.data = d(agora.getDate()) + '/' + d(agora.getMonth() + 1) + '/' + agora.getFullYear();
      r.hora = d(agora.getHours()) + ':' + d(agora.getMinutes()) + ':' + d(agora.getSeconds());
      const l = this.ler(); l.push(r); this.gravar(l);
    },
    texto() {
      const limpar = (v) => String(v == null ? '' : v).replace(/[;\r\n]+/g, ' ').trim();
      const cab = ['ID', 'Data', 'Hora', 'Nome', 'Escola', 'Idade', 'Nível', 'Área', 'Habilidade', 'ID da pergunta', 'Pergunta', 'Resposta escolhida', 'Resultado', 'Tentativa nº'];
      const linhas = this.ler().map((r) => [r.id, r.data, r.hora, r.nome, r.escola, r.idade, r.nivel, r.area, r.habilidade, r.qid, r.pergunta, r.resposta, r.resultado, r.tentativa].map(limpar).join(';'));
      return [cab.join(';')].concat(linhas).join('\r\n') + '\r\n';
    },
    baixar() {
      const blob = new Blob(['﻿' + this.texto()], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = 'registro_tentativas.txt';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    },
    limpar() {
      this.memoria = { linhas: [], seq: 0 };
      try { localStorage.removeItem(this.CH); localStorage.removeItem(this.SEQ); } catch (e) { /* ignora */ }
    }
  };

  /* ------------------------------ estado ------------------------------ */
  const estado = {
    jogador: { nome: '', escola: '', idade: '' }, nivel: null,
    fila: [], idx: 0, acertos: 0, tentativa: 0, q: null, ordem: [],
    bloqueado: false, passo: 0, cliqueAvanca: null
  };

  /* ------------------------------ desenho ------------------------------ */
  const ESTRELA = '<path d="M12 2.6l2.9 6.1 6.7.9-4.9 4.7 1.2 6.7L12 17.7l-5.9 3.3 1.2-6.7L2.4 9.6l6.7-.9z"/>';
  function estrelas(sel, acesas) {
    $(sel).innerHTML = [1, 2, 3].map((n) =>
      '<svg class="e' + n + (n <= acesas ? ' acesa' : '') + '" viewBox="0 0 24 24" style="animation-delay:' + (0.35 + n * 0.25) + 's">' + ESTRELA + '</svg>').join('');
  }

  const MASCOTES = {
    sapo:   { arq: 'img/mascotes/sapo.png',   alt: 'img/emoji/1f438.svg' },
    castor: { arq: 'img/mascotes/castor.png', alt: 'img/emoji/1f9ab.svg' },
    pato:   { arq: 'img/mascotes/pato.png',   alt: 'img/emoji/1f986.svg' }
  };
  function colocarMascotes() {
    const grupos = { '.m-acerto-esq': ['sapo', 'castor'], '.m-acerto-dir': ['pato'], '.m-erro-esq': ['sapo'], '.m-erro-dir': ['pato'] };
    Object.keys(grupos).forEach((sel) => $$(sel).forEach((cont) => {
      grupos[sel].forEach((nome) => {
        const img = document.createElement('img');
        img.className = 'm-' + nome; img.alt = '';
        img.onerror = function () { this.onerror = null; this.src = MASCOTES[nome].alt; };
        img.src = MASCOTES[nome].arq;
        cont.appendChild(img);
      });
    }));
  }

  const MARCA_CERTA = '<svg class="marca" viewBox="0 0 100 100"><rect x="6" y="6" width="88" height="88" rx="10" fill="rgba(255,255,255,.6)" stroke="#0a5a1f" stroke-width="5"/><path d="M24 52l19 19 34-40" fill="none" stroke="#2e9e3a" stroke-width="15" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const MARCA_ERRADA = '<svg class="marca" viewBox="0 0 100 100"><rect x="6" y="6" width="88" height="88" rx="10" fill="rgba(255,255,255,.6)" stroke="#700" stroke-width="5"/><path d="M27 27l46 46M73 27L27 73" fill="none" stroke="#e53935" stroke-width="14" stroke-linecap="round"/></svg>';

  function visual(o) {
    if (!o) return '';
    if (o.cor) return '<div class="bloco-cor" style="background:' + o.cor + '"></div>';
    if (o.html) return o.html;
    if (o.emoji) return emo(o.emoji);
    if (o.img) return '<img class="foto" src="' + encodeURI(o.img) + '" alt="" data-rotulo="' + esc(o.rotulo || '') + '">';
    return '<div class="texto-grande" style="white-space:nowrap">' + esc(o.rotulo || '') + '</div>';
  }

  /* se uma foto não for encontrada, mostra o nome da figura no lugar */
  stage.addEventListener('error', (e) => {
    const el = e.target;
    if (el && el.tagName === 'IMG' && el.classList.contains('foto')) {
      const d = document.createElement('div');
      d.className = 'texto-grande'; d.style.whiteSpace = 'nowrap'; d.textContent = el.dataset.rotulo || '?';
      el.replaceWith(d); ajustarTextos();
    }
  }, true);

  function ajustarTextos() {
    $$('#tPergunta .opt-rotulo, #tPergunta .texto-grande').forEach((el) => {
      const limite = el.classList.contains('texto-grande') ? el.parentElement.clientWidth - 24 : el.clientWidth - 8;
      if (!limite || limite < 30) return;
      let t = el.classList.contains('texto-grande') ? 120 : 40;
      el.style.fontSize = t + 'px';
      while (el.scrollWidth > limite && t > 18) { t -= 2; el.style.fontSize = t + 'px'; }
    });
  }

  /* ------------------------------ pergunta ------------------------------ */
  function montarPergunta(q) {
    $('#qNum').textContent = estado.idx + 1;
    const t = $('#qTexto');
    t.textContent = q.texto;
    t.className = 'pergunta' + (q.texto.length > 100 ? ' muito-longa' : q.texto.length > 58 ? ' longa' : '');

    const hero = $('#qHero');
    hero.innerHTML = q.hero ? visual(q.hero) : '';

    const caixa = $('#qOpcoes');
    caixa.className = 'opcoes n' + q.opcoes.length + (q.hero ? ' com-hero' : '');
    caixa.innerHTML = estado.ordem.map((i) => {
      const o = q.opcoes[i];
      const tipo = o.cor ? 'cor' : o.html ? 'html' : o.emoji ? 'emoji' : o.img ? 'foto' : 'texto';
      return '<button class="opt ' + tipo + (q.semRotulo ? ' sem-rotulo' : '') + (q.base ? ' base' : '') + '" data-i="' + i + '" aria-label="' + esc(o.rotulo || '') + '">' +
        '<div class="opt-img">' + visual(o) + '</div><div class="opt-rotulo">' + esc(o.rotulo || '') + '</div></button>';
    }).join('');
    $$('#qOpcoes .opt').forEach((b) => b.addEventListener('click', () => escolher(parseInt(b.dataset.i, 10))));
    mostrarTela('tPergunta');
    ajustarTextos();
  }

  function frasesDaPergunta(q) {
    return [q.falar || q.texto].concat(estado.ordem.map((i) => q.opcoes[i].fala || q.opcoes[i].rotulo));
  }

  async function mostrarPergunta() {
    Voz.parar();
    const q = estado.fila[estado.idx];
    estado.q = q; estado.tentativa = 0; estado.bloqueado = false; estado.cliqueAvanca = null;
    estado.ordem = embaralhar(q.opcoes.map((_, i) => i));
    montarPergunta(q);
    const meu = ++estado.passo;
    await esperar(500);
    if (meu === estado.passo) Voz.sequencia(frasesDaPergunta(q));
  }

  function marcar(i, certa) {
    const b = $('#qOpcoes .opt[data-i="' + i + '"]');
    if (!b) return;
    b.insertAdjacentHTML('beforeend', certa ? MARCA_CERTA : MARCA_ERRADA);
    b.classList.add(certa ? 'pulo' : 'tremer');
  }

  async function escolher(i) {
    if (estado.bloqueado) return;
    estado.bloqueado = true; Voz.parar(); Som.ligar();
    const q = estado.q, o = q.opcoes[i], certo = !!o.correta;
    estado.tentativa++;
    Registro.adicionar({
      nome: estado.jogador.nome, escola: estado.jogador.escola, idade: estado.jogador.idade,
      nivel: NIVEIS[estado.nivel].nome, area: q.area, habilidade: q.habilidade,
      qid: q.id, pergunta: q.texto, resposta: o.rotulo, resultado: certo ? 'ACERTO' : 'ERRO', tentativa: estado.tentativa
    });
    $$('#qOpcoes .opt').forEach((b) => { b.classList.add('travado'); if (parseInt(b.dataset.i, 10) !== i) b.classList.add('apagado'); });
    const meu = ++estado.passo;
    marcar(i, certo);
    if (certo) {
      estado.acertos++; Som.acerto();
      await esperar(1300);
      if (meu === estado.passo) mostrarAcerto();
    } else {
      Som.tente();
      await esperar(1200);
      if (meu !== estado.passo) return;
      if (estado.tentativa >= 2) revelarResposta(); else mostrarErro();
    }
  }

  /* depois de duas tentativas, mostramos a resposta com carinho e seguimos */
  async function revelarResposta() {
    const q = estado.q;
    estado.passo++;
    const meu = estado.passo;
    montarPergunta(q);
    const certo = q.opcoes.findIndex((o) => o.correta);
    $$('#qOpcoes .opt').forEach((b) => { b.classList.add('travado'); if (parseInt(b.dataset.i, 10) !== certo) b.classList.add('apagado'); });
    marcar(certo, true);
    await Promise.all([Voz.sequencia(['Vamos ver juntos! A resposta certa é ' + (q.opcoes[certo].fala || q.opcoes[certo].rotulo) + '.', q.explicacao]), esperar(3500)]);
    if (meu === estado.passo) proxima();
  }

  /* ------------------------------ feedback ------------------------------ */
  function placar() { return 'Você acertou ' + estado.acertos + ' de ' + (estado.idx + 1) + ' !'; }
  function estrelasParcial() { return Math.min(3, Math.round(3 * estado.acertos / (estado.idx + 1))); }

  async function mostrarAcerto() {
    const q = estado.q, meu = ++estado.passo, t0 = Date.now();
    $('#acertoPlacar').textContent = placar();
    estrelas('#acertoEstrelas', estrelasParcial());
    mostrarTela('tAcerto');
    let avancou = false;
    const avancar = () => { if (avancou || meu !== estado.passo) return; avancou = true; estado.cliqueAvanca = null; proxima(); };
    estado.cliqueAvanca = () => { if (Date.now() - t0 > 1200) avancar(); };
    await Promise.all([Voz.sequencia(['Muito bem! Parabéns!', q.explicacao]), esperar(3000)]);
    await esperar(500);
    avancar();
  }

  function mostrarErro() {
    const meu = ++estado.passo;
    $('#erroPlacar').textContent = placar();
    estrelas('#erroEstrelas', estrelasParcial());
    mostrarTela('tErro');
    Voz.sequencia(['Não foi dessa vez. Vamos tentar de novo? Você consegue!']);
    estado.cliqueAvanca = null;
    void meu;
  }

  function tentarNovamente() {
    Voz.parar();
    estado.bloqueado = false; estado.passo++;
    montarPergunta(estado.q);
    const meu = estado.passo;
    esperar(400).then(() => { if (meu === estado.passo) Voz.sequencia(frasesDaPergunta(estado.q)); });
  }

  function proxima() {
    Voz.parar();
    estado.idx++;
    if (estado.idx < estado.fila.length) mostrarPergunta(); else mostrarFim();
  }

  function mostrarFim() {
    const total = estado.fila.length, razao = estado.acertos / total;
    const acesas = razao >= 0.8 ? 3 : razao >= 0.5 ? 2 : 1;       /* sempre ao menos 1 estrela */
    $('#fimTitulo').textContent = razao === 1 ? 'Incrível!' : 'Parabéns!';
    $('#fimPlacar').textContent = 'Você acertou ' + estado.acertos + ' de ' + total + ' !';
    estrelas('#fimEstrelas', acesas);
    const prox = ORDEM_NIVEIS[ORDEM_NIVEIS.indexOf(estado.nivel) + 1];
    const b = $('#btnFimProximo');
    b.textContent = prox ? 'PRÓXIMO NÍVEL' : 'JOGAR DE NOVO';
    b.dataset.nivel = prox || estado.nivel;
    estado.passo++; estado.cliqueAvanca = null;
    mostrarTela('tFim'); Som.fim();
    Voz.sequencia([razao === 1 ? 'Incrível! Você acertou tudo!' : 'Parabéns! Você terminou o nível!']);
  }

  /* ------------------------------ início do jogo ------------------------------ */
  function ordenarFila(lista) {
    const sobra = embaralhar(lista), fila = [];
    while (sobra.length) {          /* evita duas perguntas seguidas da mesma área, quando possível */
      const ultima = fila.length ? fila[fila.length - 1].area : null;
      let k = sobra.findIndex((p) => p.area !== ultima);
      if (k < 0) k = 0;
      fila.push(sobra.splice(k, 1)[0]);
    }
    return fila;
  }

  function iniciarNivel(nivel) {
    estado.nivel = nivel;
    estado.fila = ordenarFila(PERGUNTAS.filter((p) => p.nivel === nivel));
    estado.idx = 0; estado.acertos = 0;
    if (!estado.fila.length) { avisar('Ainda não há perguntas neste nível.'); mostrarTela('tLogin'); return; }
    mostrarPergunta();
  }

  /* ------------------------------ login ------------------------------ */
  function avisar(msg) { $('#avisoLogin').textContent = msg || ''; }
  function marcarNivelNoCampo() {
    const el = $('#campoNivelTexto'), n = NIVEIS[estado.nivel];
    if (n) { el.textContent = n.nome; el.style.color = n.cor; el.style.fontFamily = "'Bungee', sans-serif"; el.style.fontSize = '26px'; }
  }
  function erroCampo(sel) { const c = $(sel); c.classList.remove('erro-campo'); void c.offsetWidth; c.classList.add('erro-campo'); }

  function jogar() {
    Som.ligar(); avisar('');
    const nome = $('#nome').value.trim();
    if (!nome) { erroCampo('#nome'); avisar('Escreva o seu nome!'); $('#nome').focus(); Voz.sequencia(['Escreva o seu nome!']); return; }
    if (!estado.nivel) { erroCampo('#campoNivel'); avisar('Escolha o nível!'); Voz.sequencia(['Escolha o nível!']); return; }
    estado.jogador = { nome: nome, escola: $('#escola').value.trim(), idade: $('#idade').value.trim() };
    iniciarNivel(estado.nivel);
  }

  /* ------------------------------ registro (professores) ------------------------------ */
  function abrirRegistro() {
    const l = Registro.ler();
    const criancas = new Set(l.map((r) => (r.nome || '').toLowerCase())).size;
    $('#regInfo').textContent = l.length + ' tentativa(s) registrada(s)' + (l.length ? ', de ' + criancas + ' criança(s).' : '.');
    $('#modalRegistro').hidden = false;
  }

  /* ------------------------------ eventos ------------------------------ */
  function ligarEventos() {
    $('#escola').setAttribute('list', 'listaEscolas');
    $('#listaEscolas').innerHTML = ESCOLAS.map((e) => '<option value="' + esc(e) + '">').join('');

    $('#btnJogar').addEventListener('click', jogar);
    ['#nome', '#escola', '#idade'].forEach((s) => $(s).addEventListener('keydown', (e) => { if (e.key === 'Enter') jogar(); }));
    $('#campoNivel').addEventListener('click', () => { Som.ligar(); mostrarTela('tNivel'); Voz.sequencia(['Escolha o nível de dificuldade.']); });
    $$('.nivel-op').forEach((b) => b.addEventListener('click', () => { estado.nivel = b.dataset.nivel; marcarNivelNoCampo(); avisar(''); mostrarTela('tLogin'); Voz.parar(); }));

    $('#btnOuvir').addEventListener('click', () => { Som.ligar(); if (estado.q) Voz.sequencia(frasesDaPergunta(estado.q)); });
    $('#btnTentar').addEventListener('click', tentarNovamente);
    stage.addEventListener('click', () => { if (estado.cliqueAvanca) estado.cliqueAvanca(); });

    $('#btnFimProximo').addEventListener('click', (e) => { Som.ligar(); iniciarNivel(e.currentTarget.dataset.nivel); });
    $('#btnFimNivel').addEventListener('click', () => { estado.nivel = null; $('#campoNivelTexto').textContent = 'NÍVEL DE DIFICULDADE'; $('#campoNivelTexto').removeAttribute('style'); mostrarTela('tNivel'); });

    $('#btnRegistro').addEventListener('click', abrirRegistro);
    $('#regFechar').addEventListener('click', () => { $('#modalRegistro').hidden = true; });
    $('#regBaixar').addEventListener('click', () => Registro.baixar());
    $('#regLimpar').addEventListener('click', () => {
      if (window.confirm('Apagar TODO o registro das tentativas deste computador?\nBaixe o arquivo .txt antes, se precisar dele.')) { Registro.limpar(); abrirRegistro(); }
    });
  }

  /* o "Escolher outro nível" volta para a tela de níveis; ao escolher, retorna ao login já preenchido */
  Voz.iniciar();
  colocarMascotes();
  ligarEventos();
  mostrarTela('tLogin');

  /* permite testar no console / testes automáticos */
  window.JOGO = { estado: estado, Registro: Registro, Voz: Voz };
})();
