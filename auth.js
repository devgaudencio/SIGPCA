// auth.js - Centralização da autenticação e menu lateral SIGPCA

document.addEventListener('DOMContentLoaded', function() {
  // Adiciona um loading visual enquanto aguarda o Firebase
  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loadingAuth';
  loadingDiv.style.position = 'fixed';
  loadingDiv.style.top = '0';
  loadingDiv.style.left = '0';
  loadingDiv.style.width = '100vw';
  loadingDiv.style.height = '100vh';
  loadingDiv.style.background = 'rgba(255,255,255,0.85)';
  loadingDiv.style.display = 'flex';
  loadingDiv.style.alignItems = 'center';
  loadingDiv.style.justifyContent = 'center';
  loadingDiv.style.zIndex = '9999';
  loadingDiv.innerHTML = '<div style="font-size:2rem;color:#667eea;"><i class="fas fa-spinner fa-spin"></i> Carregando...</div>';
  document.body.appendChild(loadingDiv);

  const ADMIN_EMAIL = 'gaudencio2006souza@gmail.com';

  // Aguarda o Firebase estar disponível
  if (typeof firebase === 'undefined' || !firebase.auth) {
    alert('Firebase não foi carregado corretamente!');
    return;
  }

  firebase.auth().onAuthStateChanged(user => {
    // Remove o loading
    const loading = document.getElementById('loadingAuth');
    if (loading) loading.remove();

    // Esconde o app até autenticar
    const app = document.getElementById('app');
    if (app) app.style.display = 'none';

    const path = window.location.pathname.split('/').pop();

    if (!user) {
      // Se não autenticado e não está na tela de login, redireciona para index.html
      if (path !== 'index.html') {
        window.location.href = 'index.html';
      }
      return;
    }

    // Se autenticado e não está no dashboard, redireciona para dashboard.html
    if (user && path === 'index.html') {
      window.location.href = 'dashboard.html';
      return;
    }

    // Mostra o app após autenticação
    if (app) app.style.display = '';

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

    // Protege admin.html para não-admins
    if (path === 'admin.html' && user.email !== ADMIN_EMAIL) {
      alert('Acesso negado. Apenas administradores podem acessar esta página.');
      window.location.href = 'index.html';
      return;
    }

    // Destaque dinâmico do item ativo
    document.querySelectorAll('.sidebar-menu .menu-item').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === path) {
        link.classList.add('active');
      }
    });
  });
}); 