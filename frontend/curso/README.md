# Pasta `curso` (frontend/curso)

Este README descreve a organização dos arquivos de HTML, CSS e JS dentro da pasta `curso`.

## Estrutura geral

- `css/`
  - `capitulos.css`: estilos específicos para as páginas de capítulos.
  - `topicos.css`: estilos específicos para as páginas de tópicos.

- `js/`
  - `capitulos.js`: scripts que controlam o comportamento das páginas de capítulos (por exemplo, navegação ou lógica de exibição de conteúdo).
  - `topicos-init.js`: inicializador de tópicos; carrega ou configura a navegação do conjunto de tópicos na abertura.
  - `topicos.js`: scripts para comportamento de tópicos individuais (ex: carregar conteúdo, manipular eventos de clique, renderizar tópicos de forma dinâmica).

- `modulos/`
  - `capitulos/`
    - `capitulo.html`: template ou componente HTML do capítulo (pode ser usado como estrutura base para cada capítulo).
  - `topicos/`
    - `topico1.html` até `topico8.html`: arquivos HTML de cada tópico.
    - `topicos.html`: índice/lista de tópicos (pode conter links ou menu para cada tópico).

## Fluxo típico

1. Usuário acessa a página de conteúdo de curso (provavelmente via rota do site).
2. O CSS de `curso/css` aplica estilo visual ao layout de capítulos e tópicos.
3. O JS de `curso/js` manipula a interatividade, carregamento dinâmico e navegação entre módulos.
4. Os módulos em `curso/modulos` contêm o conteúdo em HTML usado construtivamente na UI (capítulos e tópicos separados).

## Observações

- Verifique se os arquivos JS são importados corretamente nas páginas que exibem os capítulos e tópicos.
- Mantenha os estilos modulares (`capitulos.css` / `topicos.css`) para evitar conflitos globais.
- Ao adicionar um novo tópico, crie um novo `topicoN.html` e atualize `topicos.html` para incluir o link.
