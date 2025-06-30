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
    logoutBtn.addEventListener('click', function() {
        if (confirm('Tem certeza que deseja sair do sistema?')) {
            // Aqui você pode adicionar lógica de logout
            alert('Logout realizado com sucesso!');
            // Redirecionar para página de login ou recarregar a página
            // window.location.href = 'login.html';
        }
    });

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

    // Função para simular dados dinâmicos do dashboard
    function updateDashboardData() {
        // Simula atualização de dados em tempo real
        const cards = document.querySelectorAll('.card .number');
        
        cards.forEach(card => {
            const currentValue = parseInt(card.textContent);
            const newValue = currentValue + Math.floor(Math.random() * 5);
            
            // Animação de contagem
            animateCounter(card, currentValue, newValue, 1000);
        });
    }

    // Função para animar contadores
    function animateCounter(element, start, end, duration) {
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = Math.floor(start + (end - start) * progress);
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        
        requestAnimationFrame(updateCounter);
    }

    // Simula atualização de dados a cada 30 segundos
    setInterval(updateDashboardData, 30000);

    // Função para adicionar novas atividades
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

        // Adiciona no início da lista
        activityList.insertBefore(activityItem, activityList.firstChild);

        // Remove o último item se houver mais de 5
        const items = activityList.querySelectorAll('.activity-item');
        if (items.length > 5) {
            activityList.removeChild(items[items.length - 1]);
        }
    }

    // Simula adição de atividades aleatórias
    const activities = [
        { icon: 'fas fa-plus text-success', text: 'Novo item cadastrado', time: 'Agora mesmo' },
        { icon: 'fas fa-edit text-warning', text: 'Item atualizado', time: 'Há 5 minutos' },
        { icon: 'fas fa-check text-success', text: 'Processo aprovado', time: 'Há 10 minutos' },
        { icon: 'fas fa-exclamation-triangle text-warning', text: 'Ação pendente', time: 'Há 15 minutos' }
    ];

    // Adiciona uma atividade aleatória a cada 2 minutos
    setInterval(() => {
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        addActivityItem(randomActivity.icon, randomActivity.text, randomActivity.time);
    }, 120000);

    // Função para verificar se o usuário está ativo
    let userActivityTimeout;
    
    function resetUserActivity() {
        clearTimeout(userActivityTimeout);
        userActivityTimeout = setTimeout(() => {
            // Simula logout por inatividade
            console.log('Usuário inativo por muito tempo');
        }, 1800000); // 30 minutos
    }

    // Event listeners para detectar atividade do usuário
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
        document.addEventListener(event, resetUserActivity, true);
    });

    // Inicializa o timer de atividade
    resetUserActivity();

    // Função para mostrar notificações toast
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        // Estilos do toast
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#667eea'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        // Anima entrada
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove após 3 segundos
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Exemplo de uso do toast
    // showToast('Sistema carregado com sucesso!', 'success');

    // Função para carregar dados do localStorage (se existir)
    function loadUserPreferences() {
        const lastSection = localStorage.getItem('lastSection');
        if (lastSection && pageTitles[lastSection]) {
            switchSection(lastSection);
        }
    }

    // Função para salvar preferências do usuário
    function saveUserPreferences(sectionId) {
        localStorage.setItem('lastSection', sectionId);
    }

    // Modifica a função switchSection para salvar preferências
    const originalSwitchSection = switchSection;
    switchSection = function(sectionId) {
        originalSwitchSection(sectionId);
        saveUserPreferences(sectionId);
    };

    // Carrega preferências ao inicializar
    loadUserPreferences();

    // Função para verificar conectividade
    function checkConnectivity() {
        if (!navigator.onLine) {
            showToast('Você está offline. Algumas funcionalidades podem não estar disponíveis.', 'error');
        }
    }

    // Event listeners para conectividade
    window.addEventListener('online', () => {
        showToast('Conexão restaurada!', 'success');
    });

    window.addEventListener('offline', () => {
        showToast('Conexão perdida. Verifique sua internet.', 'error');
    });

    // Verifica conectividade inicial
    checkConnectivity();

    // Função para exportar dados (exemplo)
    function exportData() {
        const data = {
            dashboard: {
                contratosAtivos: 24,
                emAndamento: 8,
                concluidos: 156,
                pendentes: 12
            },
            timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dashboard-data.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    // Adiciona função de exportação ao console para testes
    window.exportDashboardData = exportData;

    console.log('Sistema SIGPCA carregado com sucesso!');
    console.log('Use exportDashboardData() para exportar dados do dashboard');

    // === MODAL DE CADASTRO DE ITEM ===
    // Elementos do modal
    const itemModalOverlay = document.getElementById('itemModalOverlay');
    const itemModal = document.getElementById('itemModal');
    const openItemModalBtn = document.querySelector('.btn-primary'); // Botão "Novo Item"
    const closeItemModalBtn = document.getElementById('closeItemModal');
    const cancelItemModalBtn = document.getElementById('cancelItemModal');
    const itemForm = document.getElementById('itemForm');
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
    const itensTableBody = document.getElementById('itensTableBody');
    const cadastroPlaceholder = document.getElementById('cadastroPlaceholder');
    let editIndex = null; // Índice do item sendo editado
    let searchTerm = '';

    // Função para renderizar a tabela de itens (com filtro)
    function renderItensTable() {
        document.querySelectorAll('.itens-table th').forEach(th => th.classList.add('resizable'));
        let itensFiltrados = itensCadastrados;
        if (searchTerm.trim() !== '') {
            const termo = searchTerm.trim().toLowerCase();
            itensFiltrados = itensCadastrados.filter(item => {
                return Object.values(item).some(val =>
                    (val + '').toLowerCase().includes(termo)
                );
            });
        }
        if (itensFiltrados.length === 0) {
            itensTableBody.innerHTML = '<tr class="no-items-row"><td colspan="15" style="text-align:center;color:#aaa;">Nenhum item cadastrado</td></tr>';
            return;
        }
        itensTableBody.innerHTML = '';
        itensFiltrados.forEach((item, idx) => {
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
            renderItensTable();
        }
    }

    // Ao salvar o item, adiciona ou edita na lista e atualiza a tabela
    if (itemForm) {
        itemForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(itemForm);
            const item = {
                itemNumber: formData.get('itemNumber'),
                itemClass: formData.get('itemClass'),
                itemDesc: formData.get('itemDesc'),
                itemUnit: formData.get('itemUnit'),
                itemQty: formData.get('itemQty'),
                itemUnitValue: parseFloat(formData.get('itemUnitValue')).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                itemTotalValue: itemTotalValue.value,
                itemFonte: formData.get('itemFonte'),
                itemPrograma: formData.get('itemPrograma'),
                itemPrioridade: formData.get('itemPrioridade'),
                itemForma: formData.get('itemForma'),
                itemInicio: formData.get('itemInicio'),
                itemFim: formData.get('itemFim'),
                itemJustificativa: formData.get('itemJustificativa')
            };
            if (editIndex !== null) {
                itensCadastrados[editIndex] = item;
                editIndex = null;
            } else {
                itensCadastrados.push(item);
            }
            renderItensTable();
            closeItemModal();
        });
    }

    // Pesquisa em tempo real
    const itemSearchInput = document.getElementById('itemSearchInput');
    if (itemSearchInput) {
        itemSearchInput.addEventListener('input', function() {
            searchTerm = this.value;
            renderItensTable();
        });
    }

    // Renderiza a tabela ao carregar a página
    renderItensTable();

    // === MODAL PERFIL E SEGURANÇA ===
    const perfilSegurancaBtn = document.getElementById('perfilSegurancaBtn');
    const perfilModalOverlay = document.getElementById('perfilModalOverlay');
    const perfilModal = document.getElementById('perfilModal');
    const closePerfilModalBtn = document.getElementById('closePerfilModal');
    const cancelPerfilModalBtn = document.getElementById('cancelPerfilModal');
    const alterarFotoBtn = document.getElementById('alterarFotoBtn');
    const perfilFotoInput = document.getElementById('perfilFotoInput');
    const perfilFotoPreview = document.getElementById('perfilFotoPreview');
    const perfilForm = document.getElementById('perfilForm');

    function openPerfilModal() {
        perfilModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
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

    // === GOOGLE SHEETS INTEGRAÇÃO PERFIL ===
    const CLIENT_ID = '165495776336-46sf063kpq4hr9udih5ln760luuu3m0m.apps.googleusercontent.com';
    const SHEET_ID = '1PLm-xHvgAOjhRe1Y4CIKYa1rYxTryUE3USpBs3ZGw84';
    const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

    function handleClientLoad() {
        gapi.load('client:auth2', initClient);
    }

    function initClient() {
        gapi.client.init({
            clientId: CLIENT_ID,
            discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
            scope: SCOPES
        });
    }

    // Chama handleClientLoad ao carregar a página, aguardando o gapi estar disponível
    function waitForGapiAndInit() {
        if (window.gapi && window.gapi.load) {
            handleClientLoad();
        } else {
            setTimeout(waitForGapiAndInit, 100);
        }
    }
    window.addEventListener('load', waitForGapiAndInit);

    function signInAndSaveProfile(profileData, onSuccess, onError) {
        gapi.auth2.getAuthInstance().signIn().then(() => {
            gapi.client.sheets.spreadsheets.values.append({
                spreadsheetId: SHEET_ID,
                range: "PERFIL!A1",
                valueInputOption: "RAW",
                insertDataOption: "INSERT_ROWS",
                resource: {
                    values: [
                        [
                            profileData.telefone,
                            profileData.email,
                            profileData.id,
                            profileData.secretaria,
                            profileData.senha
                        ]
                    ]
                }
            }).then(response => {
                if (onSuccess) onSuccess(response);
            }, error => {
                if (onError) onError(error);
            });
        });
    }

    // Salvar perfil ao submeter o formulário
    if (perfilForm) {
        perfilForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const profileData = {
                telefone: perfilForm.perfilTelefone.value,
                email: perfilForm.perfilEmail.value,
                id: perfilForm.perfilId.value,
                secretaria: perfilForm.perfilSecretaria.value,
                senha: perfilForm.perfilSenha.value
            };
            if (window.gapi && gapi.auth2) {
                signInAndSaveProfile(profileData, function() {
                    alert('Perfil salvo com sucesso na planilha Google!');
                    closePerfilModal();
                }, function(error) {
                    alert('Erro ao salvar perfil: ' + error.result.error.message);
                });
            } else {
                alert('Google API não carregada. Tente recarregar a página.');
            }
        });
    }
});
