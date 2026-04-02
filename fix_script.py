from pathlib import Path
files = list(Path('frontend/curso/modulos/topicos').glob('topico*.html')) + [Path('frontend/curso/modulos/topicos/topicos.html')]
for p in files:
    text = p.read_text(encoding='utf-8')
    if '<script src="../../js/progress.js"></script>' in text:
        continue
    if '<script src="../../js/topicos.js"></script>' in text:
        text = text.replace('<script src="../../js/topicos.js"></script>', '<script src="../../js/progress.js"></script>\n    <script src="../../js/topicos.js"></script>')
        p.write_text(text, encoding='utf-8')
        print('updated', p)
