document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. BUSCAR DADOS DO GITHUB ---
    const fetchGitHubStats = async () => {
        try {
            // Substitua 'aluizi0' pelo seu usuário exato do GitHub se for diferente
            const response = await fetch('https://api.github.com/users/aluizi0');
            const data = await response.json();
            
            // Atualiza o data-target do contador de repositórios
            const repoCounter = document.getElementById('github-repos');
            if (repoCounter && data.public_repos) {
                repoCounter.setAttribute('data-target', data.public_repos);
                // Reinicia a animação para este contador específico se já tiver rodado
                // Mas como o fetch é rápido, geralmente a animação pega o valor novo a tempo
            }
        } catch (error) {
            console.error("Erro ao buscar dados do GitHub:", error);
        }
    };

    fetchGitHubStats(); // Chama a função

    // --- 2. MENU ATIVO NO SCROLL (MANTIDO) ---
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-item");

    function changeLinkState() {
        let index = sections.length;
        while(--index && window.scrollY + 200 < sections[index].offsetTop) {}
        navLinks.forEach((link) => link.classList.remove("active"));
        if(index >= 0) navLinks[index].classList.add("active");
    }
    window.addEventListener("scroll", changeLinkState);

    // --- 3. CONTADORES ANIMADOS (AJUSTADO PARA ESPERAR O FETCH) ---
    const counters = document.querySelectorAll('.counter');
    const speed = 150; 

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace('+', '');
                
                // Se o target for 0 (ainda não carregou do GitHub), não anima ou anima até 0
                if (target === 0) return;

                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 30);
                } else {
                    // Adiciona o "+" apenas para números grandes (ex: commits)
                    if (target > 100) { 
                        counter.innerText = target + "+"; 
                    } else {
                        counter.innerText = target;
                    }
                }
            };
            updateCount();
        });
    };
    
    // Pequeno delay para garantir que o fetch do GitHub tenha chance de atualizar o atributo
    setTimeout(animateCounters, 500); 

    // --- 4. ANIMAÇÃO SKILLS (MANTIDO) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.skill-card').forEach((card, index) => {
        card.style.transition = `all 0.5s ease ${index * 0.05}s`; 
        observer.observe(card);
    });
});