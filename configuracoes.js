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
        const perfilBtn = document.querySelector('.profile-btn');
        if (perfilBtn) {
            perfilBtn.addEventListener('click', function() {
                // Aqui você pode abrir o modal de perfil se existir
                // ou navegar para a seção de perfil
                // Exemplo: abrir modal ou mostrar seção de perfil
                // document.getElementById('perfilModal').classList.add('active');
            });
        }
    }

  if (document.getElementById('configuracoes') || document.getElementById('perfilForm')) {
    // Adicione aqui apenas o código real de perfil/configurações.
  }
}); 