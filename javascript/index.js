document.addEventListener("DOMContentLoaded", () => {
    
    // --- MENU ATIVO NO SCROLL ---
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-item");

    function changeLinkState() {
        let index = sections.length;

        // O valor 200 ajuda a trocar a cor um pouco antes de chegar na seção
        while(--index && window.scrollY + 200 < sections[index].offsetTop) {}
        
        navLinks.forEach((link) => link.classList.remove("active"));
        
        // Adiciona active se houver uma seção correspondente
        if(index >= 0) {
            navLinks[index].classList.add("active");
        }
    }
    
    changeLinkState();
    window.addEventListener("scroll", changeLinkState);

    // --- CONTADORES (STATS) ---
    const counters = document.querySelectorAll('.counter');
    const speed = 150; 

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace('+', '');
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 25);
                } else {
                    if (target > 5 && target < 1000) { 
                        counter.innerText = target + "+"; 
                    } else {
                        counter.innerText = target;
                    }
                }
            };
            updateCount();
        });
    };
    animateCounters();

    // --- ANIMAÇÃO SKILLS ---
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    const cards = document.querySelectorAll('.skill-card');
    cards.forEach((card, index) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = `all 0.5s ease ${index * 0.05}s`; 
        observer.observe(card);
    });
});