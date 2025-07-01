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
        const openItemModalBtn = document.querySelector('.btn-primary');
        const itemModalOverlay = document.getElementById('itemModalOverlay');
        const itemModal = document.getElementById('itemModal');
        const closeItemModalBtn = document.getElementById('closeItemModal');
        const cancelItemModalBtn = document.getElementById('cancelItemModal');
        const itemForm = document.getElementById('itemForm');
        const itemTotalValue = document.getElementById('itemTotalValue');
        if (openItemModalBtn && itemModalOverlay && itemModal) {
            openItemModalBtn.addEventListener('click', function(e) {
                e.preventDefault();
                itemModalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                document.body.classList.add('cadastro-modal-open');
            });
            if (closeItemModalBtn) closeItemModalBtn.addEventListener('click', function() {
                itemModalOverlay.classList.remove('active');
                document.body.style.overflow = '';
                document.body.classList.remove('cadastro-modal-open');
                if (itemForm) itemForm.reset();
                if (itemTotalValue) itemTotalValue.value = 'R$ 0,00';
            });
            if (cancelItemModalBtn) cancelItemModalBtn.addEventListener('click', function() {
                itemModalOverlay.classList.remove('active');
                document.body.style.overflow = '';
                document.body.classList.remove('cadastro-modal-open');
                if (itemForm) itemForm.reset();
                if (itemTotalValue) itemTotalValue.value = 'R$ 0,00';
            });
            if (itemModalOverlay) {
                itemModalOverlay.addEventListener('mousedown', function(e) {
                    if (e.target === itemModalOverlay) {
                        itemModalOverlay.classList.remove('active');
                        document.body.style.overflow = '';
                        document.body.classList.remove('cadastro-modal-open');
                        if (itemForm) itemForm.reset();
                        if (itemTotalValue) itemTotalValue.value = 'R$ 0,00';
                    }
                });
            }
        }
    }

  if (document.getElementById('cadastro')) {
    // Adicione aqui apenas o código real do cadastro de itens.
  }
}); 