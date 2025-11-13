// Roda o código quando o HTML da página terminar de carregar
document.addEventListener('DOMContentLoaded', function() {
  
  
  const loginForm = document.querySelector('.login-form');

  
  loginForm.addEventListener('submit', async function(event) {
    
    event.preventDefault();

   
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    
    const dadosLogin = {
      email: emailInput.value,
      password: passwordInput.value
    };

    try {
      
      const response = await fetch('/barbeiro/login', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(dadosLogin) 
      });

      
      const result = await response.json();

      
      if (response.ok) {
        
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('barbeiroLogado', result.nome);
        
        
        window.location.href = '/painel.html';

      } else {
       
        alert(`Erro: ${result.error}`);
      }

    } catch (error) {
      
      console.error('Erro de rede ao tentar fazer login:', error);
      alert('Não foi possível conectar ao servidor. Tente novamente mais tarde.');
    }
  });
});