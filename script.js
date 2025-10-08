document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item:not(.pdf-button)');
    const sections = document.querySelectorAll('.section-container');
    const headerHeight = document.querySelector('.header-nav').offsetHeight;

    // 1. Rolagem Suave (Fallback para navegadores mais antigos e para garantir o foco)
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Rola para a seção, compensando a altura do header fixo
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
                
                // Opcional: Atualiza o hash da URL (como o Tamal Sen faz)
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }
            }
        });
    });


    // 2. Observer para Atualizar o Item Ativo no Menu
    const observerOptions = {
        root: null, // viewport
        rootMargin: `-${headerHeight}px 0px -50% 0px`, // Ajusta a área de observação para logo abaixo do header
        threshold: 0 // A seção se torna ativa assim que ultrapassa o limite
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;

                // Remove a classe 'active' de todos os links
                navItems.forEach(item => item.classList.remove('active'));

                // Adiciona a classe 'active' ao link correspondente
                const activeLink = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);

    // Observa todas as seções
    sections.forEach(section => {
        sectionObserver.observe(section);
    });

});