const daysContainer = document.getElementById('daysContainer');
const monthYearElement = document.getElementById('currentMonthYear');
const prevBtn = document.getElementById('prevMonth');
const nextBtn = document.getElementById('nextMonth');
const selectedDateDisplay = document.getElementById('selectedDateDisplay');
const noteInput = document.getElementById('noteInput');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesList = document.getElementById('notesList');

let currentDate = new Date();
let selectedDate = null;
const today = new Date();

// Carregar notas salvas ou iniciar vazio
let notes = JSON.parse(localStorage.getItem('calendarNotes')) || {};

// --- FUNÇÃO PRINCIPAL: RENDERIZAR CALENDÁRIO ---
function renderCalendar() {
    daysContainer.innerHTML = '';
    
    // Configura o mês atual
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    
    monthYearElement.innerText = new Date(year, month).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    
    // Primeiro dia do mês e total de dias
    const firstDayIndex = new Date(year, month, 1).getDay();
    const lastDay = new Date(year, month + 1, 0).getDate();
    
    // Dias em branco antes do dia 1
    for(let i = 0; i < firstDayIndex; i++){
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('empty');
        daysContainer.appendChild(emptyDiv);
    }

    // Dias do mês
    for(let i = 1; i <= lastDay; i++){
        const dayDiv = document.createElement('div');
        dayDiv.innerText = i;
        
        // Chave única para data: "2025-10-24"
        const dateKey = `${year}-${month}-${i}`;

        // Verifica se é Hoje
        if(i === today.getDate() && month === today.getMonth() && year === today.getFullYear()){
            dayDiv.classList.add('today');
        }

        // Verifica se está selecionado
        if(selectedDate && selectedDate === dateKey){
            dayDiv.classList.add('selected');
        }

        // Indicador se tem nota
        if(notes[dateKey] && notes[dateKey].length > 0) {
            dayDiv.classList.add('has-event');
        }

        // Evento de Clique no Dia
        dayDiv.addEventListener('click', () => {
            selectedDate = dateKey;
            renderCalendar(); // Re-renderiza para atualizar seleção
            renderNotes();    // Mostra notas do dia
        });

        daysContainer.appendChild(dayDiv);
    }
}

// --- FUNÇÃO: RENDERIZAR NOTAS DO DIA ---
function renderNotes() {
    notesList.innerHTML = '';
    
    if(!selectedDate) {
        selectedDateDisplay.innerText = "Selecione um dia";
        return;
    }

    // Formata data bonita para o título
    const [y, m, d] = selectedDate.split('-');
    const dateObj = new Date(y, m, d);
    selectedDateDisplay.innerText = `${d}/${parseInt(m)+1}/${y}`;

    // Pega notas do dia selecionado
    const dayNotes = notes[selectedDate] || [];

    dayNotes.forEach((note, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${note}
            <i class="fas fa-trash delete-note" onclick="deleteNote(${index})"></i>
        `;
        notesList.appendChild(li);
    });
}

// --- ADICIONAR NOTA ---
function addNote() {
    if(!selectedDate) {
        alert("Primeiro selecione um dia no calendário!");
        return;
    }
    
    const text = noteInput.value.trim();
    if(text === '') return;

    if(!notes[selectedDate]) {
        notes[selectedDate] = [];
    }

    notes[selectedDate].push(text);
    localStorage.setItem('calendarNotes', JSON.stringify(notes));
    
    noteInput.value = '';
    renderCalendar(); // Atualiza bolinhas no calendário
    renderNotes();
}

// --- DELETAR NOTA ---
window.deleteNote = (index) => {
    if(confirm('Apagar tarefa?')) {
        notes[selectedDate].splice(index, 1);
        
        // Limpa chave se ficar vazia
        if(notes[selectedDate].length === 0) {
            delete notes[selectedDate];
        }

        localStorage.setItem('calendarNotes', JSON.stringify(notes));
        renderCalendar();
        renderNotes();
    }
}

// --- EVENTOS ---
prevBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextBtn.addEventListener('click', () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

addNoteBtn.addEventListener('click', addNote);

// Tecla Enter no input
noteInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') addNote();
});

// --- TEMA (Sincronizado com o Portfólio Principal) ---
const savedTheme = localStorage.getItem('theme');
if(savedTheme === 'light') {
    document.body.classList.add('light-mode');
}

// Renderiza inicial
renderCalendar();