document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticação
    if (localStorage.getItem('adminLogado') !== 'true') {
        window.location.href = '/admin/login';
        return;
    }
    
    // Elementos DOM
    const videoForm = document.getElementById('video-form');
    const videoList = document.getElementById('video-list');
    const emptyList = document.getElementById('empty-list');
    const videoTitulo = document.getElementById('video-titulo');
    const videoUrl = document.getElementById('video-url');
    const videoDescricao = document.getElementById('video-descricao');
    const videoId = document.getElementById('video-id');
    const saveBtn = document.getElementById('save-video');
    const cancelBtn = document.getElementById('cancel-edit');
    const logoutBtn = document.getElementById('logout-btn');
    
    // Array para armazenar vídeos
    let videos = [];
    
    // Carregar vídeos do arquivo JSON (simulado)
    carregarVideos();
    
    // Event Listeners
    videoForm.addEventListener('submit', salvarVideo);
    cancelBtn.addEventListener('click', cancelarEdicao);
    logoutBtn.addEventListener('click', logout);
    
    // Funções
    function carregarVideos() {
        // Primeiro tentamos carregar do localStorage para evitar problemas com o arquivo
        const videosString = localStorage.getItem('videos');
        if (videosString) {
            try {
                videos = JSON.parse(videosString);
                renderizarVideos();
                atualizarEstadoListaVazia();
                return;
            } catch (error) {
                console.error('Erro ao carregar vídeos do localStorage:', error);
            }
        }
        
        // Se não houver dados no localStorage, tentamos carregar do arquivo JSON
        fetch('../dbvideos.json')
            .then(response => {
                // Se o arquivo não existir ainda, inicializamos com array vazio
                if (!response.ok) {
                    return [];
                }
                return response.json();
            })
            .then(data => {
                videos = data;
                renderizarVideos();
                atualizarEstadoListaVazia();
            })
            .catch(error => {
                console.error('Erro ao carregar vídeos:', error);
                // Inicializar como array vazio em caso de erro
                videos = [];
                atualizarEstadoListaVazia();
            });
    }
    
    function salvarVideo(e) {
        e.preventDefault();
        
        // Coletar dados do formulário
        const titulo = videoTitulo.value.trim();
        const url = videoUrl.value.trim();
        const descricao = videoDescricao.value.trim();
        const id = videoId.value;
        
        // Validação mínima
        if (!titulo || !url) {
            alert('Por favor, preencha o título e a URL do vídeo.');
            return;
        }
        
        // Formatar URL do YouTube, se necessário
        let videoUrlFormatada = formatarUrlVideo(url);
        
        if (id) {
            // Editando um vídeo existente
            const index = videos.findIndex(v => v.id === id);
            if (index !== -1) {
                videos[index] = {
                    ...videos[index],
                    titulo,
                    link: videoUrlFormatada,
                    descricao
                };
            }
        } else {
            // Adicionando novo vídeo
            const novoVideo = {
                id: gerarId(),
                titulo,
                link: videoUrlFormatada,
                descricao,
                dataCriacao: new Date().toISOString()
            };
            
            videos.push(novoVideo);
        }
        
        // Salvar no arquivo JSON (simulado)
        salvarVideosNoJSON();
        
        // Renderizar lista atualizada
        renderizarVideos();
        
        // Resetar formulário
        resetarFormulario();
        
        // Atualizar estado da lista vazia
        atualizarEstadoListaVazia();
    }
    
    function editarVideo(id) {
        const video = videos.find(v => v.id === id);
        if (!video) return;
        
        // Preencher formulário com dados do vídeo
        videoId.value = video.id;
        videoTitulo.value = video.titulo;
        videoUrl.value = video.link;
        videoDescricao.value = video.descricao || '';
        
        // Mudar texto do botão e mostrar botão cancelar
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Atualizar Vídeo';
        cancelBtn.style.display = 'block';
        
        // Scroll para o formulário
        videoForm.scrollIntoView({ behavior: 'smooth' });
    }
    
    function excluirVideo(id) {
        if (!confirm('Tem certeza que deseja excluir este vídeo?')) return;
        
        // Filtrar o array para remover o vídeo
        videos = videos.filter(v => v.id !== id);
        
        // Salvar no arquivo JSON (simulado)
        salvarVideosNoJSON();
        
        // Renderizar lista atualizada
        renderizarVideos();
        
        // Atualizar estado da lista vazia
        atualizarEstadoListaVazia();
    }
    
    function cancelarEdicao() {
        resetarFormulario();
    }
    
    function resetarFormulario() {
        videoForm.reset();
        videoId.value = '';
        saveBtn.innerHTML = '<i class="fas fa-save"></i> Salvar Vídeo';
        cancelBtn.style.display = 'none';
    }
    
    function renderizarVideos() {
        // Limpar lista atual (exceto a mensagem de lista vazia)
        const itensVideo = videoList.querySelectorAll('.video-item');
        itensVideo.forEach(item => item.remove());
        
        // Renderizar cada vídeo
        videos.forEach(video => {
            const videoEl = document.createElement('div');
            videoEl.className = 'video-item';
            videoEl.innerHTML = `
                <div class="video-info">
                    <div class="video-title">${video.titulo}</div>
                    <div class="video-url">${video.link}</div>
                    ${video.descricao ? `<div class="video-desc">${video.descricao}</div>` : ''}
                </div>
                <div class="video-actions">
                    <button class="edit" title="Editar vídeo">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete" title="Excluir vídeo">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            // Adicionar event listeners para os botões
            videoEl.querySelector('.edit').addEventListener('click', () => editarVideo(video.id));
            videoEl.querySelector('.delete').addEventListener('click', () => excluirVideo(video.id));
            
            // Adicionar à lista
            videoList.insertBefore(videoEl, emptyList);
        });
    }
    
    function atualizarEstadoListaVazia() {
        if (videos.length === 0) {
            emptyList.style.display = 'block';
        } else {
            emptyList.style.display = 'none';
        }
    }
    
    function salvarVideosNoJSON() {
        // Salvar os vídeos no localStorage
        localStorage.setItem('videos', JSON.stringify(videos));
        
        // Mostrar mensagem de sucesso
        alert('Vídeo salvo com sucesso!');
        
        // Log para debug
        console.log('Dados salvos no formato JSON no localStorage:');
        console.log(JSON.stringify(videos, null, 2));
    }
    
    function gerarId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    
    function formatarUrlVideo(url) {
        // Converter URLs do YouTube para embedded
        if (url.includes('youtube.com/watch')) {
            const videoId = new URL(url).searchParams.get('v');
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
        } else if (url.includes('youtu.be/')) {
            const videoId = url.split('youtu.be/')[1].split('?')[0];
            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }
        }
        
        // Se não for do YouTube ou já estiver formatada, retorna a URL original
        return url;
    }
    
    function logout() {
        if (confirm('Tem certeza que deseja sair?')) {
            localStorage.removeItem('adminLogado');
            window.location.href = '/admin/login';
        }
    }
}); 