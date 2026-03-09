#  Plataforma Web Interativa Gamificado para Ensino de Desenvolvimento de Jogos Digitais (em desenvolvimento)

**Plataforma Educativa para Desenvolvimento de Jogos**

Construtor visual interativo com interface profissional para ensino de Teoria dos Jogos e desenvolvimento prático de jogos digitais.

---

## 📋 Conteúdo

- **3 Capítulos Educativos** com múltiplos tópicos cada
- **Sistema de Progresso** persistente com localStorage
- **Galeria de Imagens** com efeito 3D e scroll suave
- **Layout Responsivo** (Desktop, Tablet, Mobile)
- **Navegação Intuitiva** com sidebar fixa
- **Página Hub de Capítulos** com filtros e busca

---

## 🚀 Como Usar

### Iniciar
1. Abra: `frontend/pages/index.html` (Dashboard)
2. Navegue pelo menu principal
3. Escolha um capítulo em `frontend/capitulos/capitulos.html`
4. Estude os tópicos (progresso salvo automaticamente)

### Estrutura
```
frontend/
├── pages/          # Páginas principais
├── capitulos/      # Hub de capítulos + template
├── curso/          # Capítulos 1-3 (modular)
├── css/            # Estilos globais + específicos
└── js/             # Scripts globais + modulares
```

---

## ✨ Recursos Implementados

### Interface
- ✅ **Design Moderno** com gradientes e sombras 3D
- ✅ **Componentes Reutilizáveis** (cards, botões, badges)
- ✅ **Tipografia Profissional** (Google Fonts - Inter)
- ✅ **Animações Suaves** (transições 0.3-0.4s)
- ✅ **Variáveis CSS** para fácil personalização

### Funcionalidades
- ✅ **Busca e Filtros** dinâmicos nos capítulos
- ✅ **Sidebar Fixa** com navegação entre tópicos
- ✅ **Gallery 3D** com efeito hover e scroll mouse
- ✅ **Scroll Snap** automático entre slides
- ✅ **Rating System** com estrelas (⭐)
- ✅ **Flashcards** navegáveis
- ✅ **Badges de Progresso** visuais

### Performance
- ✅ **Sem Frameworks Pesados** (Vanilla JS/CSS)
- ✅ **Hardware Acceleration** via will-change
- ✅ **Lazy Loading** de imagens
- ✅ **Debouncing** em eventos
- ✅ **Event Delegation** eficiente

### Responsividade
- ✅ **Mobile-First** design
- ✅ **3 Breakpoints** (768px, 1024px)
- ✅ **Touch-Friendly** (swipe, tap)
- ✅ **Acessibilidade** (aria-labels, semantics)

---

## 🎨 Design System

### Cores
- **Primary:** Azul (#2563EB)
- **Secondary:** Roxo (#7C3AED)
- **Success:** Verde (#22C55E)
- **Backgrounds:** Cinza claro (#F8FAFC)

### Tipografia
- **Família:** Inter (Google Fonts)
- **Pesos:** 400, 500, 600, 700, 800
- **Tamanhos:** 0.75rem - 3rem (escala harmônica)

### Spacing
- **Base:** 4px (xs)
- **Incrementos:** 4x (sm=8px, md=16px, lg=24px, xl=32px)
- **Máximo:** 64px (3xl)

---

## 📂 Arquivos Principais

### HTML
- `pages/index.html` - Dashboard
- `capitulos/capitulos.html` - Hub de capítulos
- `capitulos/topico-template.html` - Template base

### CSS
- `css/base.css` - Reset + variáveis
- `css/layout.css` - Grid/containers
- `css/components.css` - Componentes
- `css/pages.css` - Páginas específicas
- `css/capitulos/` - Estilos dos capítulos

### JavaScript
- `js/app.js` - Inicialização
- `js/utils.js` - Funções utilitárias
- `js/progress.js` - Sistema de progresso
- `js/capitulos/` - Módulos dos capítulos

### Dados
- `data/tutorials.json` - Dados dos tutoriais

---

## 🔄 Modularidade

### Capítulos Independentes
Cada capítulo está em sua própria pasta:
```
curso/
├── capitulo1/
│   ├── topico1.html
│   ├── topico2.html
│   └── topico3.html
├── capitulo2/ (idem)
└── capitulo3/ (idem)
```

### CSS/JS Compartilhados
```
curso/css/
├── capitulos.css (estilos)
└── topicos.css (layout)

curso/js/
├── capitulos.js (lógica)
└── topicos.js (navegação)
```

---

## 🧪 Testes

### Browser Support
- Chrome/Edge (✅)
- Firefox (✅)
- Safari 13+ (✅)
- Mobile browsers (✅)

### Funcionalidades Testadas
- [x] Navegação entre páginas
- [x] Filtro e busca de capítulos
- [x] Scroll e swipe em galeria
- [x] Progresso persistente
- [x] Responsividade em 3 tamanhos
- [x] Performance (sem lag)

---

## 📝 Notas

- **localStorage** para persistência de progresso
- **Sem backend** necessário (frontend-only)
- **Sem CDN externo** (apenas Google Fonts)
- **Pronto para produção** (minificação opcional)

---

## 👨‍💻 Autor

- **Nome:** Rodrigo Abreu
- **Tipo:** Trabalho de Conclusão de Curso (TCC)
- **Objetivo:** Plataforma educativa para criação de jogos

---

## 📞 Suporte

Para issues ou dúvidas:
1. Verifique se JavaScript está habilitado
2. Limpe cache do navegador (Ctrl+Shift+Delete)
3. Teste em outro navegador
4. Verifique console (F12) para erros

**Pronto para uso! 🚀**
