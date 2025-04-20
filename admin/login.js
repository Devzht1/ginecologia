document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');
    
    // Verificar se já está autenticado
    if (localStorage.getItem('adminLogado') === 'true') {
        window.location.href = '/admin/dashboard';
    }
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        // Credenciais definidas conforme solicitado
        const CREDENCIAIS = {
            usuario: 'janeide',
            senha: '123'
        };
        
        // Verificação simples das credenciais
        if (username === CREDENCIAIS.usuario && password === CREDENCIAIS.senha) {
            // Armazena a autenticação (em um sistema real, isso seria feito com cookies httpOnly ou JWT)
            localStorage.setItem('adminLogado', 'true');
            
            // Redireciona para o dashboard
            window.location.href = '/admin/dashboard';
        } else {
            // Exibe mensagem de erro
            errorMessage.textContent = 'Usuário ou senha incorretos. Tente novamente.';
            
            // Limpa a senha
            document.getElementById('password').value = '';
        }
    });
}); 