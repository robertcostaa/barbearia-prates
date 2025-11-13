document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Impede o recarregamento da página

        const username = usernameInput.value;
        const password = passwordInput.value;

        // Limpa mensagens de erro antigas
        const oldError = document.querySelector('.error-message');
        if (oldError) {
            oldError.remove();
        }

        try {
            const response = await fetch('/barbeiro/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                // Se o servidor responder com erro (ex: 401 Não Autorizado)
                const errorData = await response.json();
                throw new Error(errorData.message || 'Usuário ou senha inválidos.');
            }

            const data = await response.json();

            // Salva o token e o nome de usuário para usar na próxima página
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('barbeiroLogado', data.user.name);

            // Redireciona para o painel de agendamentos
            window.location.href = 'painel.html';

        } catch (error) {
            // Cria e exibe uma mensagem de erro no formulário
            const errorElement = document.createElement('p');
            errorElement.textContent = error.message;
            errorElement.className = 'error-message';
            errorElement.style.color = 'red';
            errorElement.style.textAlign = 'center';
            errorElement.style.marginTop = '10px';
            loginForm.appendChild(errorElement);
        }
    });
});