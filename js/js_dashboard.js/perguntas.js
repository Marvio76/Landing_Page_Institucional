document.querySelectorAll(".title-pergunta").forEach(item => {
    item.addEventListener("click", () => {
        const texto = item.nextElementSibling; // Pega o próximo elemento (resposta)
        const icon = item.querySelector(".icon"); // Pega a imagem dentro da pergunta

        texto.classList.toggle("visible"); // Mostra ou oculta a resposta
        icon.classList.toggle("rotated"); // Aplica ou remove a rotação
    });
});
