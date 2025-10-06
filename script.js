document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item:not(.pdf-button)');
    const sections = document.querySelectorAll('.section-container');
    const header = document.querySelector('.header-nav');
    const glitchOverlay = document.querySelector('.glitch-overlay');
    let isTransitioning = false;

    // Função para atualizar o hash na URL
    const updateHash = (hash) => {
        if (history.pushState) {
            history.pushState(null, null, hash);
        } else {
            window.location.hash = hash;
        }
    };

    // Função principal de navegação com efeito Glitch
    const navigateToSection = (targetId) => {
        if (isTransitioning) return;
        isTransitioning = true;

        const targetSection = document.querySelector(targetId);
        if (!targetSection) {
            isTransitioning = false;
            return;
        }

        // 1. Ativar Glitch Overlay
        glitchOverlay.classList.add('active');

        setTimeout(() => {
            // 2. Transição de Conteúdo (esconder atual, mostrar novo)
            sections.forEach(sec => {
                sec.classList.add('hidden');
                sec.classList.remove('active');
            });
            
            targetSection.classList.remove('hidden');
            targetSection.classList.add('active');

            // 3. Atualizar navegação
            navItems.forEach(item => item.classList.remove('active'));
            const activeNavItem = document.querySelector(`.nav-item[data-section="${targetId.substring(1)}"]`);
            if (activeNavItem) {
                activeNavItem.classList.add('active');
            }

            // 4. Atualizar o URL
            updateHash(targetId);

            // 5. Remover Glitch Overlay após a transição visual
            setTimeout(() => {
                glitchOverlay.classList.remove('active');
                isTransitioning = false;
            }, 300); // Deve ser maior que a animação CSS do glitch-overlay (0.3s)

        }, 100); // Tempo para o glitch começar a aparecer antes da troca de conteúdo
    };

    // Event Listeners para a Navegação
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault(); // Previne o comportamento padrão do link
            const targetId = item.getAttribute('href');
            navigateToSection(targetId);
        });
    });

    // Inicialização - Verifica o hash ao carregar a página
    const initialHash = window.location.hash || '#home';
    const initialSection = document.querySelector(initialHash);
    
    // Esconde todas as seções, exceto a inicial
    sections.forEach(sec => sec.classList.add('hidden'));
    
    // Mostra a seção inicial e ativa o nav-item correspondente
    if (initialSection) {
        initialSection.classList.remove('hidden');
        initialSection.classList.add('active');
        const initialNavItem = document.querySelector(`.nav-item[data-section="${initialHash.substring(1)}"]`);
        if (initialNavItem) {
            initialNavItem.classList.add('active');
        }
    } else {
         // Caso o hash seja inválido, default para Home
        document.getElementById('home').classList.remove('hidden');
        document.getElementById('home').classList.add('active');
        document.querySelector(`.nav-item[data-section="home"]`).classList.add('active');
    }

    // Navegação via botão de voltar/avançar do navegador
    window.addEventListener('popstate', () => {
        const hash = window.location.hash || '#home';
        navigateToSection(hash);
    });

});