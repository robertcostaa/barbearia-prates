document.addEventListener('DOMContentLoaded', function() {
    // Selecionando todos os elementos que vamos usar (seu código original)
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

    // Funções para abrir/fechar o pop-up (seu código original)
    function abrirPopup() { areaAgendamento.style.display = 'flex'; formBox.style.display = 'block'; successBox.style.display = 'none'; }
    function fecharPopup() { areaAgendamento.style.display = 'none'; }

    btnAbrir.addEventListener('click', abrirPopup);
    btnAbrir2.addEventListener('click', abrirPopup);
    btnFechar.addEventListener('click', fecharPopup);
    btnVoltar.addEventListener('click', fecharPopup);
    areaAgendamento.addEventListener('click', function(event) { if (event.target === areaAgendamento) fecharPopup(); });

    // Variável para guardar o horário selecionado (seu código original)
    let horarioSelecionado = '';

    // Lógica para selecionar o horário (seu código original)
    timeOptionsContainer.addEventListener('click', function(event) {
        if (event.target.classList.contains('time-btn')) {
            const todosOsBotoes = timeOptionsContainer.querySelectorAll('.time-btn');
            todosOsBotoes.forEach(btn => btn.classList.remove('selected'));
            event.target.classList.add('selected');
            horarioSelecionado = event.target.textContent;
        }
    });

    // ========================================================================
    // ### ATUALIZAÇÃO: LÓGICA PARA ENVIAR O AGENDAMENTO PARA O BACKEND ###
    // ========================================================================
    formAgendar.addEventListener('submit', async function(event) {
        event.preventDefault(); // Impede que a página recarregue

        // Validação simples: verifica se um horário foi selecionado
        if (!horarioSelecionado) {
            alert('Por favor, selecione um horário.');
            return;
        }

        // Pega os dados do formulário para enviar ao backend
        const dadosParaEnviar = {
            nomeCliente: document.getElementById('nome').value,
            telefone: document.getElementById('telefone').value,
            servico: servicoSelect.value,
            data: document.getElementById('data').value,
            hora: horarioSelecionado
        };
        
        try {
            // Faz a chamada para a API (backend) usando fetch
            const response = await fetch('/agendamentos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dadosParaEnviar),
            });

            // Pega a resposta do servidor
            const result = await response.json();

            // Se a resposta foi bem-sucedida (status 2xx)
            if (response.ok) {
                // Limpa o formulário para um próximo agendamento
                formAgendar.reset();
                horarioSelecionado = '';
                timeOptionsContainer.querySelectorAll('.time-btn').forEach(btn => btn.classList.remove('selected'));

                // Mostra a sua tela de sucesso
                formBox.style.display = 'none';
                successBox.style.display = 'block';
            } else {
                // Se o servidor retornou um erro (ex: "Horário indisponível")
                alert(`Erro: ${result.erro}`);
            }

        } catch (error) {
            // Caso aconteça um erro de rede (servidor desligado, sem internet, etc)
            console.error('Falha na comunicação com o servidor:', error);
            alert('Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.');
        }
    });
    
    // Lógica para preencher o serviço ao clicar no card (seu código original)
    serviceCards.forEach(card => { 
        card.addEventListener('click', function() { 
            const servicoNome = card.getAttribute('data-servico'); 
            if (servicoNome && servicoSelect) {
                servicoSelect.value = servicoNome; 
            }
            abrirPopup(); 
        }); 
    });

    // Lógica do botão "Voltar ao Topo" (seu código original)
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