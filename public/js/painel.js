document.addEventListener('DOMContentLoaded', async function() {
    const listaAgendamentos = document.getElementById('agendamentos-lista');
    const usernameDisplay = document.getElementById('username-display');
    const filtroSelect = document.getElementById('filtro');

    // --- VERIFICAÇÃO DE SEGURANÇA ---
    const token = localStorage.getItem('authToken');
    const usuarioLogado = localStorage.getItem('barbeiroLogado');

    if (!token || !usuarioLogado) {
        // Se não houver token ou nome, o usuário não está logado.
        // Limpa qualquer lixo e redireciona para o login.
        localStorage.removeItem('authToken');
        localStorage.removeItem('barbeiroLogado');
        window.location.href = 'login.html';
        return; // Para a execução do script
    }

    // Se chegou aqui, o usuário está logado. Mostra o nome.
    usernameDisplay.textContent = `Olá, ${usuarioLogado}!`;

    // --- FUNÇÕES DE API ---

    // Função para buscar agendamentos no backend
    async function carregarAgendamentos() {
        // Define qual rota usar com base no filtro selecionado
        const filtro = filtroSelect.value;
        let url = '/barbeiro/'; // Rota padrão para "todos"

        if (filtro === 'hoje') {
            url = '/barbeiro/agendamentos/dia';
        }
        // Nota: a rota para "semana" não existe no backend que você mostrou.
        // Se o usuário selecionar "semana", ele vai buscar "todos" por enquanto.

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}` // Envia o token para autenticação
                }
            });

            if (!response.ok) {
                if(response.status === 401 || response.status === 403) {
                     // Token inválido ou expirado
                     localStorage.removeItem('authToken');
                     localStorage.removeItem('barbeiroLogado');
                     window.location.href = 'login.html';
                }
                throw new Error('Falha ao buscar agendamentos.');
            }

            const agendamentos = await response.json();
            renderizarAgendamentos(agendamentos);

        } catch (error) {
            listaAgendamentos.innerHTML = `<p style="color: red;">${error.message}</p>`;
        }
    }

    // Função para renderizar os agendamentos na tela
    function renderizarAgendamentos(agendamentos) {
        if (!agendamentos || agendamentos.length === 0) {
            listaAgendamentos.innerHTML = '<p>Nenhum agendamento encontrado.</p>';
            return;
        }

        listaAgendamentos.innerHTML = '';
        agendamentos.forEach(agendamento => {
            const card = document.createElement('div');
            card.className = 'agendamento-card-admin';
            
            // Formatando a data para o padrão brasileiro
            const dataObj = new Date(agendamento.data);
            const dataFormatada = dataObj.toLocaleDateString('pt-BR', { timeZone: 'UTC' });

            card.innerHTML = `
                <div class="card-info-header">
                    <p><strong>Nome:</strong> ${agendamento.nome}</p>
                    <p><strong>Data:</strong> ${dataFormatada}</p>
                </div>
                <div class="card-info-body">
                    <p><strong>Telefone:</strong> ${agendamento.telefone}</p>
                    <p><strong>Horário:</strong> ${agendamento.horario}</p>
                </div>
                <p class="card-info-service"><strong>Serviço:</strong> ${agendamento.servico}</p>
                <div class="card-actions">
                    <button class="btn-cancelar" data-id="${agendamento.id}">Cancelar</button>
                    <button class="btn-concluir" data-id="${agendamento.id}">Concluído</button>
                </div>
            `;
            listaAgendamentos.appendChild(card);
        });
    }

    // Função para atualizar o status de um agendamento (cancelar/concluir)
    async function atualizarAgendamento(id, acao) {
        const url = `/barbeiro/${acao}/${id}`; // Ex: /barbeiro/cancelar/123

        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`Falha ao ${acao} o agendamento.`);
            }

            // Se a atualização deu certo, recarrega a lista da tela
            carregarAgendamentos();

        } catch (error) {
            alert(error.message);
        }
    }

    // --- EVENT LISTENERS ---

    // Escuta cliques nos botões de ação
    listaAgendamentos.addEventListener('click', function(event) {
        const target = event.target;
        const agendamentoId = target.getAttribute('data-id');

        if (!agendamentoId) return;

        if (target.matches('.btn-cancelar')) {
            if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
                atualizarAgendamento(agendamentoId, 'cancelar');
            }
        } else if (target.matches('.btn-concluir')) {
             if (confirm('Marcar este agendamento como concluído?')) {
                atualizarAgendamento(agendamentoId, 'concluir');
            }
        }
    });

    // Escuta mudanças no filtro
    filtroSelect.addEventListener('change', carregarAgendamentos);

    // --- INICIALIZAÇÃO ---
    // Carrega os agendamentos assim que a página é aberta
    carregarAgendamentos();
});