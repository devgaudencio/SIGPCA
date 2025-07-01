// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos do DOM
    const menuItems = document.querySelectorAll('.menu-item');
    const contentSections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('pageTitle');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    const logoutBtn = document.querySelector('.logout-btn');
    const notificationBtn = document.querySelector('.notification-btn');
    const profileBtn = document.querySelector('.profile-btn');
    const perfilForm = document.getElementById('perfilForm');
    const itemForm = document.getElementById('itemForm');
    const itensTableBody = document.getElementById('itensTableBody');
    const gSignInWrapper = document.getElementById('gSignInWrapper');
    const loginGoogleBtn = document.getElementById('loginGoogleBtn');
    const loginEmailForm = document.getElementById('loginEmailForm');

    // Títulos das páginas
    const pageTitles = {
        'dashboard': 'Dashboard',
        'cadastro': 'Cadastro de Itens',
        'notificacoes': 'Notificações',
        'configuracoes': 'Configurações',
        'academy': 'SIGPCAAcademy'
    };

    // Função para alternar entre seções
    function switchSection(sectionId) {
        // Remove classe active de todas as seções
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // Remove classe active de todos os itens do menu
        menuItems.forEach(item => {
            item.classList.remove('active');
        });

        // Adiciona classe active à seção selecionada
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Adiciona classe active ao item do menu correspondente
        const targetMenuItem = document.querySelector(`[data-section="${sectionId}"]`);
        if (targetMenuItem) {
            targetMenuItem.classList.add('active');
        }

        // Atualiza o título da página
        if (pageTitles[sectionId]) {
            pageTitle.textContent = pageTitles[sectionId];
        }

        // Fecha o menu lateral em dispositivos móveis
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }
    }

    // Event listeners para os itens do menu
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            switchSection(sectionId);
        });
    });

    // Toggle do menu lateral para dispositivos móveis
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });

    // Fecha o menu ao clicar fora dele em dispositivos móveis
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnMenuToggle = menuToggle.contains(event.target);
            
            if (!isClickInsideSidebar && !isClickOnMenuToggle && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        }
    });

    // Função de logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            auth.signOut().then(() => {
                hideApp();
            });
        });
    }

    // Função para notificações
    notificationBtn.addEventListener('click', function() {
        // Simula abrir painel de notificações
        switchSection('notificacoes');
        
        // Em uma implementação real, você poderia:
        // - Abrir um modal com notificações
        // - Marcar notificações como lidas
        // - Atualizar o badge de notificações
    });

    // Função para perfil do usuário
    profileBtn.addEventListener('click', function() {
        // Simula abrir configurações do perfil
        switchSection('configuracoes');
        
        // Em uma implementação real, você poderia:
        // - Abrir um modal com informações do perfil
        // - Permitir edição de dados do usuário
        // - Configurações de conta
    });

    // === MODAL DE CADASTRO DE ITEM ===
    // Elementos do modal
    const itemModalOverlay = document.getElementById('itemModalOverlay');
    const itemModal = document.getElementById('itemModal');
    const openItemModalBtn = document.querySelector('.btn-primary'); // Botão "Novo Item"
    const closeItemModalBtn = document.getElementById('closeItemModal');
    const cancelItemModalBtn = document.getElementById('cancelItemModal');
    const itemQty = document.getElementById('itemQty');
    const itemUnitValue = document.getElementById('itemUnitValue');
    const itemTotalValue = document.getElementById('itemTotalValue');

    // Função para abrir o modal
    function openItemModal() {
        itemModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.body.classList.add('cadastro-modal-open');
    }

    // Função para fechar o modal
    function closeItemModal() {
        itemModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        document.body.classList.remove('cadastro-modal-open');
        itemForm.reset();
        itemTotalValue.value = 'R$ 0,00';
    }

    // Abrir modal ao clicar em "Novo Item" (só na seção Cadastro)
    if (openItemModalBtn && document.getElementById('cadastro')) {
        openItemModalBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openItemModal();
        });
    }

    // Fechar modal ao clicar em X ou Cancelar
    if (closeItemModalBtn) closeItemModalBtn.addEventListener('click', closeItemModal);
    if (cancelItemModalBtn) cancelItemModalBtn.addEventListener('click', closeItemModal);

    // Fechar modal ao clicar fora dele
    if (itemModalOverlay) {
        itemModalOverlay.addEventListener('mousedown', function(e) {
            if (e.target === itemModalOverlay) closeItemModal();
        });
    }

    // Calcular valor total automaticamente
    function updateTotalValue() {
        const qty = parseFloat(itemQty.value.replace(',', '.')) || 0;
        const unit = parseFloat(itemUnitValue.value.replace(',', '.')) || 0;
        const total = qty * unit;
        itemTotalValue.value = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    if (itemQty && itemUnitValue && itemTotalValue) {
        itemQty.addEventListener('input', updateTotalValue);
        itemUnitValue.addEventListener('input', updateTotalValue);
    }

    // === ITENS CADASTRADOS ===
    let itensCadastrados = [];
    const itensTableContainer = document.getElementById('itensTableContainer');
    const cadastroPlaceholder = document.getElementById('cadastroPlaceholder');
    let editIndex = null; // Índice do item sendo editado
    let searchTerm = '';

    // Função para renderizar a tabela de itens (com filtro)
    function renderItensTable(itens) {
        document.querySelectorAll('.itens-table th').forEach(th => th.classList.add('resizable'));
        if (itens.length === 0) {
            itensTableBody.innerHTML = '<tr class="no-items-row"><td colspan="15" style="text-align:center;color:#aaa;">Nenhum item cadastrado</td></tr>';
            return;
        }
        itensTableBody.innerHTML = '';
        itens.forEach((item, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${item.itemNumber}</td>
                <td>${item.itemClass}</td>
                <td>${item.itemDesc}</td>
                <td>${item.itemUnit}</td>
                <td>${item.itemQty}</td>
                <td>${item.itemUnitValue}</td>
                <td>${item.itemTotalValue}</td>
                <td>${item.itemFonte}</td>
                <td>${item.itemPrograma}</td>
                <td>${item.itemPrioridade}</td>
                <td>${item.itemForma}</td>
                <td>${item.itemInicio}</td>
                <td>${item.itemFim}</td>
                <td>${item.itemJustificativa}</td>
                <td>
                    <button class="action-btn edit" title="Editar" data-idx="${itensCadastrados.indexOf(item)}"><i class="fas fa-pencil-alt"></i></button>
                    <button class="action-btn delete" title="Excluir" data-idx="${itensCadastrados.indexOf(item)}"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            itensTableBody.appendChild(tr);
        });
        // Adiciona listeners para editar e deletar
        document.querySelectorAll('.action-btn.edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-idx'));
                editarItem(idx);
            });
        });
        document.querySelectorAll('.action-btn.delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-idx'));
                deletarItem(idx);
            });
        });
    }

    // Função para editar item
    function editarItem(idx) {
        const item = itensCadastrados[idx];
        if (!item) return;
        editIndex = idx;
        // Preenche o formulário com os dados do item
        itemForm.itemNumber.value = item.itemNumber;
        itemForm.itemClass.value = item.itemClass;
        itemForm.itemDesc.value = item.itemDesc;
        itemForm.itemUnit.value = item.itemUnit;
        itemForm.itemQty.value = item.itemQty;
        itemForm.itemUnitValue.value = item.itemUnitValue.replace('R$ ', '').replace('.', '').replace(',', '.');
        itemForm.itemFonte.value = item.itemFonte;
        itemForm.itemPrograma.value = item.itemPrograma;
        itemForm.itemPrioridade.value = item.itemPrioridade;
        itemForm.itemForma.value = item.itemForma;
        itemForm.itemInicio.value = item.itemInicio;
        itemForm.itemFim.value = item.itemFim;
        itemForm.itemJustificativa.value = item.itemJustificativa;
        // Atualiza o valor total
        itemTotalValue.value = item.itemTotalValue;
        openItemModal();
    }

    // Função para deletar item
    function deletarItem(idx) {
        if (confirm('Tem certeza que deseja excluir este item?')) {
            itensCadastrados.splice(idx, 1);
            renderItensTable(itensCadastrados);
        }
    }

    // Ao salvar o item, adiciona ou edita na lista e atualiza a tabela
    if (itemForm) {
        itemForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const user = auth.currentUser;
            if (!user) return alert('Faça login primeiro!');
            const formData = new FormData(itemForm);
            const item = {
                userId: user.uid,
                userEmail: user.email,
                itemNumber: formData.get('itemNumber'),
                itemClass: formData.get('itemClass'),
                itemDesc: formData.get('itemDesc'),
                itemUnit: formData.get('itemUnit'),
                itemQty: formData.get('itemQty'),
                itemUnitValue: formData.get('itemUnitValue'),
                itemTotalValue: itemTotalValue.value,
                itemFonte: formData.get('itemFonte'),
                itemPrograma: formData.get('itemPrograma'),
                itemPrioridade: formData.get('itemPrioridade'),
                itemForma: formData.get('itemForma'),
                itemInicio: formData.get('itemInicio'),
                itemFim: formData.get('itemFim'),
                itemJustificativa: formData.get('itemJustificativa'),
                criadoEm: firebase.firestore.FieldValue.serverTimestamp()
            };
            db.collection('itens').add(item)
                .then(() => {
                    alert('Item cadastrado!');
                    listarItensDoUsuario(user);
                    closeItemModal();
                })
                .catch(err => alert('Erro ao salvar item: ' + err.message));
        });
    }

    // Pesquisa em tempo real
    const itemSearchInput = document.getElementById('itemSearchInput');
    if (itemSearchInput) {
        itemSearchInput.addEventListener('input', function() {
            searchTerm = this.value;
            renderItensTable(itensCadastrados);
        });
    }

    // Renderiza a tabela ao carregar a página
    renderItensTable(itensCadastrados);

    // === MODAL PERFIL E SEGURANÇA ===
    const perfilSegurancaBtn = document.getElementById('perfilSegurancaBtn');
    const perfilModalOverlay = document.getElementById('perfilModalOverlay');
    const perfilModal = document.getElementById('perfilModal');
    const closePerfilModalBtn = document.getElementById('closePerfilModal');
    const cancelPerfilModalBtn = document.getElementById('cancelPerfilModal');
    const alterarFotoBtn = document.getElementById('alterarFotoBtn');
    const perfilFotoInput = document.getElementById('perfilFotoInput');
    const perfilFotoPreview = document.getElementById('perfilFotoPreview');

    function openPerfilModal() {
        perfilModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        const user = auth.currentUser;
        if (user) carregarPerfil(user);
    }
    function closePerfilModal() {
        perfilModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        if (perfilForm) perfilForm.reset();
        if (perfilFotoPreview) perfilFotoPreview.src = 'https://www.gravatar.com/avatar/?d=mp';
    }
    if (perfilSegurancaBtn) perfilSegurancaBtn.addEventListener('click', openPerfilModal);
    if (closePerfilModalBtn) closePerfilModalBtn.addEventListener('click', closePerfilModal);
    if (cancelPerfilModalBtn) cancelPerfilModalBtn.addEventListener('click', closePerfilModal);
    if (perfilModalOverlay) {
        perfilModalOverlay.addEventListener('mousedown', function(e) {
            if (e.target === perfilModalOverlay) closePerfilModal();
        });
    }
    if (alterarFotoBtn && perfilFotoInput) {
        alterarFotoBtn.addEventListener('click', function() {
            perfilFotoInput.click();
        });
        perfilFotoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(ev) {
                    perfilFotoPreview.src = ev.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // === FIREBASE AUTH + FIRESTORE ===

    // Funções de exibição
    function showApp() {
        document.getElementById('login').style.display = 'none';
        document.getElementById('app').style.display = '';
        document.getElementById('login-bg-anim').style.display = 'none';
    }
    function hideApp() {
        document.getElementById('login').style.display = '';
        document.getElementById('app').style.display = 'none';
        document.getElementById('login-bg-anim').style.display = '';
    }

    // Login Google
    if (loginGoogleBtn) {
        loginGoogleBtn.onclick = function() {
            const provider = new firebase.auth.GoogleAuthProvider();
            auth.signInWithPopup(provider)
                .then(result => {
                    const user = result.user;
                    showApp();
                    carregarPerfil(user);
                    listarItensDoUsuario(user);
                })
                .catch(error => {
                    alert('Erro no login: ' + error.message);
                });
        };
    }

    // Detecta login automático
    const ADMIN_EMAIL = 'gaudencio2006souza@gmail.com';

    function addAdminMenuIfNeeded(user) {
        if (!user || user.email !== ADMIN_EMAIL) return;
        const sidebarMenu = document.querySelector('.sidebar-menu');
        if (!sidebarMenu || document.getElementById('adminMenuItem')) return;
        const li = document.createElement('li');
        li.className = 'menu-item';
        li.id = 'adminMenuItem';
        li.innerHTML = '<i class="fas fa-user-shield"></i><span>Administrador</span>';
        li.onclick = () => { window.location.href = 'admin.html'; };
        sidebarMenu.appendChild(li);
    }

    firebase.auth().onAuthStateChanged(user => {
        if (!user) {
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
        showApp();
        carregarPerfil(user);
        listarItensDoUsuario(user);
        // Inicialização dos botões/modais
        inicializarModaisEBotoes();
    });

    function inicializarModaisEBotoes() {
        // Listeners para abrir perfil e adicionar item
        const perfilBtn = document.querySelector('.profile-btn');
        if (perfilBtn) {
            perfilBtn.addEventListener('click', function() {
                switchSection('configuracoes');
            });
        }
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

    // CRUD de Perfil
    if (perfilForm) {
        perfilForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const user = auth.currentUser;
            if (!user) return alert('Faça login primeiro!');
            const dadosPerfil = {
                nome: user.displayName,
                email: user.email,
                telefone: perfilForm.perfilTelefone.value,
                secretaria: perfilForm.perfilSecretaria.value
            };
            db.collection('usuarios').doc(user.uid).set(dadosPerfil, { merge: true })
                .then(() => {
                    alert('Perfil salvo!');
                    closePerfilModal();
                })
                .catch(err => alert('Erro ao salvar perfil: ' + err.message));
        });
    }
    function carregarPerfil(user) {
        db.collection('usuarios').doc(user.uid).get().then(doc => {
            if (doc.exists && perfilForm) {
                const dados = doc.data();
                perfilForm.perfilTelefone.value = dados.telefone || '';
                perfilForm.perfilEmail.value = dados.email || '';
                perfilForm.perfilId.value = user.uid;
                perfilForm.perfilSecretaria.value = dados.secretaria || '';
            }
        });
    }

    // CRUD de Itens
    function listarItensDoUsuario(user) {
        db.collection('itens').where('userId', '==', user.uid).orderBy('criadoEm', 'desc').get()
            .then(snapshot => {
                const itens = [];
                snapshot.forEach(doc => itens.push({ id: doc.id, ...doc.data() }));
                renderItensTable(itens);
            });
    }

    // === EFEITO DE PARTÍCULAS NA TELA DE LOGIN ===
    function startLoginParticles() {
        const canvas = document.getElementById('loginParticles');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let w = window.innerWidth;
        let h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;

        let particles = [];
        const PARTICLE_COUNT = Math.floor((w * h) / 3500);
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: 1.2 + Math.random() * 2.2,
                dx: (Math.random() - 0.5) * 0.7,
                dy: (Math.random() - 0.5) * 0.7
            });
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            // Desenha partículas
            for (let p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
                ctx.fillStyle = 'rgba(102,126,234,0.7)';
                ctx.shadowColor = '#764ba2';
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
            // Linhas entre partículas próximas
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    let a = particles[i];
                    let b = particles[j];
                    let dist = Math.hypot(a.x - b.x, a.y - b.y);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = 'rgba(102,126,234,' + (0.15 - dist / 800) + ')';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        }

        function update() {
            for (let p of particles) {
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > w) p.dx *= -1;
                if (p.y < 0 || p.y > h) p.dy *= -1;
            }
        }

        function loop() {
            draw();
            update();
            requestAnimationFrame(loop);
        }
        loop();

        // Responsivo
        window.addEventListener('resize', () => {
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w;
            canvas.height = h;
            // Recria partículas para novo tamanho
            particles = [];
            const NEW_COUNT = Math.floor((w * h) / 3500);
            for (let i = 0; i < NEW_COUNT; i++) {
                particles.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    r: 1.2 + Math.random() * 2.2,
                    dx: (Math.random() - 0.5) * 0.7,
                    dy: (Math.random() - 0.5) * 0.7
                });
            }
        });
    }
    window.addEventListener('DOMContentLoaded', startLoginParticles);

    // Login Email
    if (loginEmailForm) {
        loginEmailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const senha = document.getElementById('loginSenha').value;
            const loginError = document.getElementById('loginError');
            auth.signInWithEmailAndPassword(email, senha)
                .then(result => {
                    // O onAuthStateChanged já cuida do fluxo
                })
                .catch(error => {
                    if (loginError) loginError.textContent = 'Erro no login: ' + (error.message || 'Verifique usuário e senha.');
                });
        });
    }

    // === MODULARIZAÇÃO PARA PERFORMANCE ===

    // DASHBOARD
    if (document.getElementById('dashboard')) {
        // Função para simular dados dinâmicos do dashboard
        function updateDashboardData() {
            const cards = document.querySelectorAll('.card .number');
            cards.forEach(card => {
                const currentValue = parseInt(card.textContent);
                const newValue = currentValue + Math.floor(Math.random() * 5);
                animateCounter(card, currentValue, newValue, 1000);
            });
        }
        function animateCounter(element, start, end, duration) {
            const startTime = performance.now();
            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const current = Math.floor(start + (end - start) * progress);
                element.textContent = current;
                if (progress < 1) requestAnimationFrame(updateCounter);
            }
            requestAnimationFrame(updateCounter);
        }
        setInterval(updateDashboardData, 30000);
        // Simula adição de atividades aleatórias
        const activities = [
            { icon: 'fas fa-plus text-success', text: 'Novo item cadastrado', time: 'Agora mesmo' },
            { icon: 'fas fa-edit text-warning', text: 'Item atualizado', time: 'Há 5 minutos' },
            { icon: 'fas fa-check text-success', text: 'Processo aprovado', time: 'Há 10 minutos' },
            { icon: 'fas fa-exclamation-triangle text-warning', text: 'Ação pendente', time: 'Há 15 minutos' }
        ];
        function addActivityItem(icon, text, time) {
            const activityList = document.querySelector('.activity-list');
            if (!activityList) return;
            const activityItem = document.createElement('div');
            activityItem.className = 'activity-item';
            activityItem.innerHTML = `
                <i class="${icon}"></i>
                <div class="activity-content">
                    <p>${text}</p>
                    <small>${time}</small>
                </div>
            `;
            activityList.insertBefore(activityItem, activityList.firstChild);
            const items = activityList.querySelectorAll('.activity-item');
            if (items.length > 5) activityList.removeChild(items[items.length - 1]);
        }
        setInterval(() => {
            const randomActivity = activities[Math.floor(Math.random() * activities.length)];
            addActivityItem(randomActivity.icon, randomActivity.text, randomActivity.time);
        }, 120000);
    }

    // CADASTRO DE ITENS
    if (document.getElementById('cadastro')) {
        // Listeners, funções e timers do cadastro de itens
        // ... (mantenha aqui apenas o necessário para cadastro)
    }

    // PERFIL
    if (document.getElementById('perfilForm')) {
        // Listeners e funções do perfil
        // ... (mantenha aqui apenas o necessário para perfil)
    }

    // NOTIFICAÇÕES
    if (document.getElementById('notificacoes')) {
        // Listeners e funções de notificações
        // ... (mantenha aqui apenas o necessário para notificações)
    }

    // CONFIGURAÇÕES
    if (document.getElementById('configuracoes')) {
        // Listeners e funções de configurações
        // ... (mantenha aqui apenas o necessário para configurações)
    }

    console.log('Sistema SIGPCA carregado com sucesso!');
    console.log('Use exportDashboardData() para exportar dados do dashboard');
});
