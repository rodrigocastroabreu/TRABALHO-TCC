# Sistema de Avaliação por Estrelas ⭐

## Funcionalidades

O sistema de avaliação por estrelas oferece uma experiência interativa e visualmente atraente para coletar feedback dos usuários.

### ✨ Características Principais

- **Hover Interativo**: Passe o mouse sobre as estrelas para ver preview do feedback- **Seleção Flexível**: Clique para escolher de 1 a 5 estrelas
- **Alteração Dinâmica**: Mude sua avaliação clicando em estrelas diferentes
- **Desmarcação**: Clique na estrela selecionada para limpar
- **Botão Reset**: Botão ✕ para limpar avaliação completamente- **Animações Suaves**: Efeitos visuais com escala, rotação e sombras dinâmicas
- **Feedback Imediato**: Texto personalizado aparece instantaneamente
- **Persistência**: Avaliações são salvas automaticamente no localStorage
- **Responsivo**: Funciona perfeitamente em dispositivos móveis e desktop

### 🎯 Como Usar

1. **Hover**: Passe o mouse sobre as estrelas para ver o preview
2. **Clique**: Clique em qualquer estrela para definir sua avaliação (1-5 estrelas)
3. **Alterar**: Clique em uma estrela diferente para mudar a avaliação
4. **Desmarcar**: Clique na mesma estrela selecionada para limpar a avaliação
5. **Reset**: Use o botão ✕ para limpar a avaliação completamente
6. **Feedback**: Veja o texto de feedback aparecer suavemente

### 🎨 Estilos Visuais

- **Estrelas Inativas**: Cinza claro (#cbd5e1) com sombra sutil
- **Estrelas Ativas**: Dourado (#ffd700) com efeitos de brilho
- **Hover**: Escala 1.3x + rotação 5° + sombra intensa
- **Botão Reset**: Aparece apenas quando há avaliação, vermelho sutil
- **Animação de Clique**: Pulso escalonado para cada estrela

### 📱 Responsividade

- **Desktop**: Estrelas grandes (36px) com gap de 12px
- **Mobile**: Mantém proporções e interatividade
- **Toque**: Eventos de toque otimizados

### 🔧 Implementação Técnica

```javascript
// Inicialização automática
window.addEventListener('load', () => {
  new RatingSystem();
});
```

```css
.star:hover {
  transform: scale(1.3) rotate(5deg);
  filter: drop-shadow(0 4px 8px rgba(255, 215, 0, 0.4));
}
```

### 🆕 Novas Funcionalidades (v2.0)

- **Seleção Inteligente**: Sistema de clique duplo para desmarcar
- **Botão Reset Visual**: Aparece apenas quando necessário
- **Feedback de Estado**: Indicação clara do estado atual
- **Persistência Condicional**: Só salva quando há avaliação real
- **Limpeza Automática**: Remove dados do localStorage quando zerado

### 💾 Persistência

As avaliações são salvas no localStorage com a chave `chapterRatings`:
```javascript
{
  "Tópico 1": 5,
  "Tópico 2": 4
}
```

**Nota**: Avaliações de 0 (sem avaliação) são automaticamente removidas do localStorage.

### 🎉 Feedback Visual

- **Texto Animado**: Aparece com fade-in suave
- **Container**: Animação de sucesso quando avaliado
- **Estrelas**: Pulso individual escalonado
- **Ícone Flutuante**: Animação contínua no header

---

*Sistema implementado em `frontend/curso/js/capitulos.js` e estilizado em `frontend/curso/css/topicos.css`* 🚀