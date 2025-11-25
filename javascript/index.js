document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. ALTERNAR TEMA (DARK / LIGHT MODE) ---
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;
    // Seleciona o ícone dentro do botão
    const icon = themeBtn.querySelector('i'); 

    // Função para aplicar o tema visualmente
    function applyTheme(theme) {
        if (theme === 'light') {
            body.classList.add('light-mode');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            body.classList.remove('light-mode');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // Verifica se o usuário já tinha escolhido um tema antes
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    }

    themeBtn.addEventListener('click', () => {
        // Alterna a classe no body
        body.classList.toggle('light-mode');

        // Salva a preferência e troca o ícone
        if (body.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            localStorage.setItem('theme', 'dark');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    // --- 2. ANIMAÇÃO DE SCROLL (Intersection Observer) ---
    const elementsToReveal = document.querySelectorAll('section, .project-card, .profile-header');
    elementsToReveal.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.15 });

    elementsToReveal.forEach(el => observer.observe(el));

    // --- 3. EFEITO DE DIGITAÇÃO ---
    const roleElement = document.querySelector('.profile-role');
    if(roleElement) { // Verificação de segurança
        roleElement.classList.add('typing-cursor'); 
        
        const texts = [
            "Desenvolvedor Full Stack",
            "Estudante de Ciência da Computação",
            "Entusiasta de IA & Automação",
            "Apaixonado por Java & React"
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function typeEffect() {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                roleElement.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                roleElement.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
            }

            let typeSpeed = isDeleting ? 50 : 100;

            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }

            setTimeout(typeEffect, typeSpeed);
        }
        typeEffect();
    }

    // --- 4. EFEITO TILT 3D (Apenas Desktop) ---
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (window.innerWidth < 768) return;
            
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
});