document.addEventListener("DOMContentLoaded", () => {
    // Menu Ativo no Scroll
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-item");
    function changeLinkState() {
        let index = sections.length;
        while(--index && window.scrollY + 200 < sections[index].offsetTop) {}
        navLinks.forEach((link) => link.classList.remove("active"));
        if(index >= 0) navLinks[index].classList.add("active");
    }
    window.addEventListener("scroll", changeLinkState);

    // Contadores (Stats)
    const counters = document.querySelectorAll('.counter');
    const speed = 150; 
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText.replace('+', '');
            const inc = target / speed;
            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 25);
            } else {
                counter.innerText = (target > 5 && target < 1000) ? target + "+" : target;
            }
        };
        updateCount();
    });

    // Animação Skills
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