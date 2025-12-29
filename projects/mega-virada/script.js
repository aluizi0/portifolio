document.addEventListener("DOMContentLoaded", () => {
    
    // Dados Históricos da "Loto-Virada" (Base real)
    const historicalResults = [
        { ano: 2009, numeros: [10, 33, 42, 43, 50, 51] },
        { ano: 2010, numeros: [02, 10, 34, 37, 43, 50] },
        { ano: 2011, numeros: [03, 04, 29, 36, 45, 55] },
        { ano: 2012, numeros: [14, 32, 33, 36, 41, 52] },
        { ano: 2013, numeros: [20, 30, 36, 38, 47, 53] },
        { ano: 2014, numeros: [01, 05, 11, 16, 20, 56] },
        { ano: 2015, numeros: [02, 18, 31, 42, 51, 56] },
        { ano: 2016, numeros: [05, 11, 22, 24, 53, 56] },
        { ano: 2017, numeros: [03, 06, 10, 17, 34, 37] },
        { ano: 2018, numeros: [05, 10, 12, 18, 25, 33] },
        { ano: 2019, numeros: [03, 35, 38, 40, 57, 58] },
        { ano: 2020, numeros: [17, 20, 22, 35, 41, 42] },
        { ano: 2021, numeros: [12, 15, 23, 32, 33, 46] },
        { ano: 2022, numeros: [04, 05, 10, 34, 58, 59] },
        { ano: 2023, numeros: [21, 24, 33, 41, 48, 56] }
    ];

    function renderStats() {
        const frequency = {};
        for(let i=1; i<=60; i++) frequency[i] = 0;

        historicalResults.forEach(draw => draw.numeros.forEach(num => frequency[num]++));

        const sorted = Object.keys(frequency).map(num => ({
            number: parseInt(num), count: frequency[num]
        })).sort((a, b) => b.count - a.count);

        document.getElementById('hotNumbers').innerHTML = sorted.slice(0, 6).map(n => 
            `<div class="ball hot" title="Frequência: ${n.count}">${n.number.toString().padStart(2,'0')}</div>`
        ).join('');

        // Mostra os últimos da lista (menos frequentes)
        document.getElementById('coldNumbers').innerHTML = sorted.slice(-6).reverse().map(n => 
            `<div class="ball cold" title="Frequência: ${n.count}">${n.number.toString().padStart(2,'0')}</div>`
        ).join('');
    }

    function renderCharts() {
        let counts = { '33': 0, '42': 0, '24': 0, 'other': 0 };
        const total = historicalResults.length;

        historicalResults.forEach(draw => {
            const evens = draw.numeros.filter(n => n % 2 === 0).length;
            const odds = 6 - evens;

            if (evens === 3 && odds === 3) counts['33']++;
            else if (evens === 4 && odds === 2) counts['42']++;
            else if (evens === 2 && odds === 4) counts['24']++;
            else counts['other']++;
        });

        const updateBar = (id, count) => {
            const pct = Math.round((count / total) * 100);
            document.getElementById(`bar${id}`).style.width = `${pct}%`;
            document.getElementById(`val${id}`).innerText = `${pct}%`;
        };

        setTimeout(() => {
            updateBar('33', counts['33']);
            updateBar('42', counts['42']);
            updateBar('24', counts['24']);
        }, 300);
    }

    // --- LÓGICA DO GERADOR INTELIGENTE (COM FILTROS PROBABILÍSTICOS) ---
    const btnGen = document.getElementById('btnGenerate');
    
    if(btnGen) {
        btnGen.addEventListener('click', () => {
            const resultBox = document.getElementById('generatedResult');
            const msg = document.getElementById('analysisText');
            
            // 1. Feedback visual de processamento
            resultBox.innerHTML = '<span style="color:#666">Aplicando filtros estatísticos...</span>';
            msg.innerText = "";

            // Pequeno delay para simular o processamento
            setTimeout(() => {
                let validGame = null;
                let attempts = 0;

                // 2. Loop de Filtragem (Tenta até 5000 vezes achar um jogo ideal)
                while (!validGame && attempts < 5000) {
                    const tempNumbers = new Set();
                    
                    // Gera 6 números aleatórios
                    while(tempNumbers.size < 6) {
                        tempNumbers.add(Math.floor(Math.random() * 60) + 1);
                    }
                    
                    const arrayNums = Array.from(tempNumbers).sort((a, b) => a - b);

                    // --- APLICAÇÃO DOS FILTROS (HEURÍSTICA) ---

                    // Filtro 1: Equilíbrio Par/Ímpar
                    // Aceitamos apenas distribuições mais prováveis: 3/3, 4/2 ou 2/4
                    const oddCount = arrayNums.filter(n => n % 2 !== 0).length;
                    const isBalanced = (oddCount >= 2 && oddCount <= 4);

                    // Filtro 2: Soma das Dezenas (Distribuição Normal)
                    // A soma estatisticamente mais provável fica entre 130 e 240
                    const sum = arrayNums.reduce((a, b) => a + b, 0);
                    const isSumGood = (sum >= 130 && sum <= 240);

                    // Se passar nos dois filtros, é um jogo válido!
                    if (isBalanced && isSumGood) {
                        validGame = arrayNums;
                    }
                    
                    attempts++;
                }

                // Fallback: Se não achar (muito raro), usa um aleatório simples
                if (!validGame) {
                    const fallback = new Set();
                    while(fallback.size < 6) fallback.add(Math.floor(Math.random() * 60) + 1);
                    validGame = Array.from(fallback).sort((a, b) => a - b);
                }

                // 3. Renderiza o Resultado
                resultBox.innerHTML = validGame.map(n => 
                    `<div class="ball result">${n.toString().padStart(2, '0')}</div>`
                ).join('');

                // 4. Exibe a Análise Técnica do Jogo
                const odd = validGame.filter(n => n % 2 !== 0).length;
                const even = 6 - odd;
                const totalSum = validGame.reduce((a, b) => a + b, 0);
                
                msg.innerHTML = `
                    <div style="font-size: 0.9rem; color: #ccc; margin-top: 10px;">
                        <div><strong style="color:var(--accent-color)">Padrão Par/Ímpar:</strong> ${odd} Ímpares / ${even} Pares</div>
                        <div><strong style="color:var(--accent-color)">Soma das Dezenas:</strong> ${totalSum} (Intervalo ideal 130-240)</div>
                    </div>
                `;
                
            }, 800); // Delay de 800ms
        });
    }
    
    // --- CONFERIDOR ---
    const btnCheck = document.getElementById('btnCheck');
    if(btnCheck) {
        btnCheck.addEventListener('click', () => {
            const inputs = document.querySelectorAll('.num-input');
            const userNumbers = Array.from(inputs).map(i => parseInt(i.value)).filter(n => !isNaN(n));
            const resultMsg = document.getElementById('checkResult');

            if (userNumbers.length !== 6) {
                resultMsg.innerHTML = "<span style='color:#ff4444'>Erro: Insira 6 números(1-60).</span>";
                return;
            }

            let maxHits = 0;
            let bestYear = null;

            historicalResults.forEach(draw => {
                const hits = draw.numeros.filter(n => userNumbers.includes(n)).length;
                if (hits > maxHits) {
                    maxHits = hits;
                    bestYear = draw.ano;
                }
            });

            if (maxHits === 6) {
                resultMsg.innerHTML = `<span style="color:var(--accent-color)">⚠️ Alerta: Essa combinação já foi sorteada em ${bestYear}!</span>`;
            } else if (maxHits === 5) {
                resultMsg.innerHTML = `<span style="color:#ffff00">Nota: Essa sequência faria uma QUINA em ${bestYear}.</span>`;
            } else if (maxHits === 4) {
                resultMsg.innerHTML = `<span style="color:#ccc">Nota: Essa sequência faria uma QUADRA em ${bestYear}.</span>`;
            } else {
                resultMsg.innerHTML = `<span style="color:#666">Combinação inédita na base de dados (Máx. acertos passados: ${maxHits}).</span>`;
            }
        });
    }

    renderStats();
    renderCharts();
});