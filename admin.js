// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    
    // === VERIFICAÇÃO DE AUTENTICAÇÃO E ADMIN ===
    const ADMIN_EMAIL = 'gaudencio2006souza@gmail.com';

    firebase.auth().onAuthStateChanged(user => {
        if (!user) {
            // Redireciona para login se não autenticado
            if (!window.location.pathname.endsWith('index.html')) {
                window.location.href = 'index.html';
            }
            return;
        }
        // Verifica se é admin
        if (user.email !== ADMIN_EMAIL) {
            alert('Acesso negado. Apenas administradores podem acessar esta página.');
            window.location.href = 'index.html';
            return;
        }
        // Atualiza nome do usuário no menu, se existir
        const sidebarUser = document.getElementById('sidebarUser');
        if (sidebarUser) sidebarUser.textContent = user.email;
        // Adiciona Administrador ao menu se for admin
        const sidebarMenu = document.querySelector('.sidebar-menu');
        if (user.email === ADMIN_EMAIL && sidebarMenu && !document.getElementById('adminMenuItem')) {
            const adminLink = document.createElement('a');
            adminLink.href = 'admin.html';
            adminLink.className = 'menu-item';
            adminLink.id = 'adminMenuItem';
            adminLink.innerHTML = '<i class="fas fa-user-shield"></i><span>Administrador</span>';
            sidebarMenu.appendChild(adminLink);
        }
        inicializarModaisEBotoes();
    });

    function inicializarModaisEBotoes() {
        // Adicione aqui listeners de botões/modais se necessário
    }

  if (window.location.pathname.includes('admin.html')) {
    // Adicione aqui apenas o código real do painel admin.
  }
}); 