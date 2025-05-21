document.querySelectorAll('[data-scroll]').forEach(button => {
  button.addEventListener('click', () => {
    scrollToSection(button.getAttribute('data-scroll'));
  });
});

function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Melhora acessibilidade: foca no título da seção se houver
    const focusable = section.querySelector('h1, h2, h3, h4, h5, h6');
    if (focusable) {
      focusable.setAttribute('tabindex', '-1'); // necessário para focar elementos não interativos
      focusable.focus();
    }
  } else {
    console.warn(`Elemento com ID "${id}" não encontrado.`);
  }
}
