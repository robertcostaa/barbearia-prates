document.addEventListener('DOMContentLoaded', async function() {
    const listaAgendamentos = document.getElementById('agendamentos-lista');
    const usernameDisplay = document.getElementById('username-display');
    const filtroSelect = document.getElementById('filtro');

    const token = localStorage.getItem('authToken');
    const usuarioLogado = localStorage.getItem('barbeiroLogado');

    if (!token || !usuarioLogado) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('barbeiroLogado');
        window.location.href = 'login.html';
        return;
    }

    usernameDisplay.textContent = `Olá, ${usuarioLogado}!`;

    // Função para buscar agendamentos no backend
    async function carregarAgendamentos() {
        
        const filtro = filtroSelect.value;
        
        
        let url = '/barbeiro/agendamentos/todos'; // Rota padrão CORRETA para "todos" e "semana"

        if (filtro === 'hoje') {
            url = '/barbeiro/agendamentos/dia';
        }

        try {
            
            const response = await fetch(url); 

            if (!response.ok) {
                if(response.status === 401 || response.status === 403) {
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
            // Adiciona a classe 'concluido' ou 'cancelado' se o status for diferente de 'agendado'
            card.className = `agendamento-card-admin ${agendamento.status !== 'agendado' ? agendamento.status : ''}`;
            
            const dataObj = new Date(agendamento.data);
            const dataFormatada = dataObj.toLocaleDateString('pt-BR', { timeZone: 'UTC' });

            // --- CORREÇÃO DOS NOMES DOS CAMPOS ---
            card.innerHTML = `
                <div class="card-info-header">
                    <p><strong>Nome:</strong> ${agendamento.nomeCliente}</p> <!-- CORRIGIDO para nomeCliente -->
                    <p><strong>Data:</strong> ${dataFormatada}</p>
                </div>
                <div class="card-info-body">
                    <p><strong>Telefone:</strong> ${agendamento.telefone}</p>
                    <p><strong>Horário:</strong> ${agendamento.hora}</p> <!-- CORRIGIDO para hora -->
                </div>
                <p class="card-info-service"><strong>Serviço:</strong> ${agendamento.servico}</p>
                <div class="card-info-status"><strong>Status:</strong> <span class="status-${agendamento.status}">${agendamento.status}</span></div>
                <div class="card-actions">
                    <button class="btn-cancelar" data-id="${agendamento.id}">Cancelar</button>
                    <button class="btn-concluir" data-id="${agendamento.id}">Concluir</button>
                </div>
            `;
            listaAgendamentos.appendChild(card);
        });
    }

    // Função para atualizar o status de um agendamento
    async function atualizarAgendamento(id, novoStatus) {
        // A rota agora é a mesma para qualquer atualização de status
        const url = `/barbeiro/agendamentos/${id}`;

        try {
            const response = await fetch(url, {
                method: 'PATCH', // Usamos PATCH para atualizações parciais
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: novoStatus }) // Enviamos o novo status no corpo
            });

            if (!response.ok) {
                throw new Error(`Falha ao atualizar o agendamento.`);
            }
            
            carregarAgendamentos(); // Recarrega a lista para mostrar a mudança

        } catch (error) {
            alert(error.message);
        }
    }

    // --- EVENT LISTENERS ---
    listaAgendamentos.addEventListener('click', function(event) {
        const target = event.target;
        const agendamentoId = target.getAttribute('data-id');

        if (!agendamentoId) return;

        if (target.matches('.btn-cancelar')) {
            if (confirm('Tem certeza que deseja CANCELAR este agendamento?')) {
                atualizarAgendamento(agendamentoId, 'cancelado');
            }
        } else if (target.matches('.btn-concluir')) {
             if (confirm('Marcar este agendamento como CONCLUÍDO?')) {
                atualizarAgendamento(agendamentoId, 'concluido');
            }
        }
    });

    filtroSelect.addEventListener('change', carregarAgendamentos);
    carregarAgendamentos(); // Carrega os agendamentos ao abrir a página
});