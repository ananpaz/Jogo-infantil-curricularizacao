# Jogo Infantil – Pré-escolar II (Unifebe × Prefeitura de Brusque, 2026/2)

Como abrir: dê duplo clique em `index.html` (Chrome, Edge ou Firefox, Linux ou Windows). Não precisa de internet nem instalação.

## Registro das tentativas (.txt)
Cada resposta é gravada (ID automático, data, hora, nome, escola, idade, nível, área, habilidade, pergunta, resposta, acerto/erro).
O navegador não grava arquivo sozinho: na tela inicial, clique em "registro das tentativas" > "Baixar .txt" (registro_tentativas.txt, separado por ponto e vírgula, abre no Excel).

## Falta colocar (copiar do Drive)
- Imagens das perguntas: `img/animais/`, `img/letras/`, `img/silabas/` com os MESMOS nomes do Drive (ex.: `Q1 Arvore.jpg`, `LETRA B.jpg`, `bola.jpg`). Enquanto faltarem, o jogo mostra o nome escrito no lugar da imagem.
- Personagens: `img/mascotes/sapo.png`, `castor.png`, `pato.png` (PNG transparente exportado do Figma). Sem eles, aparecem desenhos provisórios.
- Escolas: edite a lista `ESCOLAS` no fim de `perguntas.js`.

## Adicionar/editar perguntas
Tudo está em `perguntas.js` (veja o comentário no topo do arquivo).

## Observação
O PDF da Prefeitura sugere 3 níveis (Fácil, Médio, Difícil) de 20 perguntas, 5 por atividade. O Figma e o Perguntas.docx trazem 4 níveis (com Expert) e hoje há 39 perguntas. Para chegar a 20 por nível, basta incluir novas perguntas em `perguntas.js`.
