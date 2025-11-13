document.addEventListener('DOMContentLoaded', function() {
    const areaAgendamento = document.getElementById('areaAgendamento');
    const formBox = document.getElementById('formBox');
    const successBox = document.getElementById('successBox');
    const serviceCards = document.querySelectorAll('.card');
    const servicoSelect = document.getElementById('servico');
    const btnAbrir = document.getElementById('abrirAgendamento');
    const btnAbrir2 = document.getElementById('abrirAgendamento2');
    const btnFechar = document.getElementById('btnFechar');
    const btnVoltar = document.getElementById('voltarBtn');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const formAgendar = document.getElementById('formAgendar');
    const timeOptionsContainer = document.querySelector('.time-options');

    function abrirPopup() { areaAgendamento.style.display = 'flex'; formBox.style.display = 'block'; successBox.style.display = 'none'; }
    function fecharPopup() { areaAgendamento.style.display = 'none'; }

    btnAbrir.addEventListener('click', abrirPopup);
    btnAbrir2.addEventListener('click', abrirPopup);
    btnFechar.addEventListener('click', fecharPopup);
    btnVoltar.addEventListener('click', fecharPopup);
    areaAgendamento.addEventListener('click', function(event) { if (event.target === areaAgendamento) fecharPopup(); });

    let horarioSelecionado = '';

    timeOptionsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('time-btn')) {
            const todosOsBotoes = timeOptionsContainer.querySelectorAll('.time-btn');
            todosOsBotoes.forEach(btn => btn.classList.remove('selected'));
            event.target.classList.add('selected');
            horarioSelecionado = event.target.textContent;
        }
    });

    
    formAgendar.addEventListener('submit', async function(event) {
        event.preventDefault(); 

        if (!horarioSelecionado) {
            alert('Por favor, selecione um horário.');
            return;
        }

        // nomes dos com o backend
        const dadosParaEnviar = {
            nome: document.getElementById('nome').value, 
            telefone: document.getElementById('telefone').value,
            servico: servicoSelect.value,
            data: document.getElementById('data').value,
            horario: horarioSelecionado, 
        };
        
        try {
            // A URL relativa '/agendamentos' está correta!
            const response = await fetch('/agendamentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosParaEnviar),
            });

            // Se a resposta do servidor não for "OK", pega a mensagem de erro
            if (!response.ok) {
                const result = await response.json();
                throw new Error(result.error || 'Ocorreu um erro no servidor.');
            }

            // Se chegou aqui, a resposta foi OK.
            formAgendar.reset();
            horarioSelecionado = '';
            timeOptionsContainer.querySelectorAll('.time-btn').forEach(btn => btn.classList.remove('selected'));
            
            formBox.style.display = 'none';
            successBox.style.display = 'flex'; 

        } catch (error) {
            console.error('Falha na comunicação com o servidor:', error);
            alert(error.message); 
        }
    });
    
    serviceCards.forEach(card => { 
        card.addEventListener('click', function() { 
            const servicoNome = card.getAttribute('data-servico'); 
            if (servicoNome && servicoSelect) {
                servicoSelect.value = servicoNome; 
            }
            abrirPopup(); 
        }); 
    });

    window.onscroll = function() { 
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            backToTopBtn.style.display = "block"; 
        } else {
            backToTopBtn.style.display = "none"; 
        }
    };
    backToTopBtn.addEventListener('click', function() { 
        window.scrollTo({top: 0, behavior: 'smooth'}); 
    });
});