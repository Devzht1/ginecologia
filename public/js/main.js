document.addEventListener('DOMContentLoaded', function() {
    // Inicializar animações AOS
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true,
        offset: 100
    });
    
    // Menu mobile
    const menuToggle = document.querySelector('.menu-mobile');
    const header = document.querySelector('header');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('menu-open');
        });
    });
    
    // Scroll suave para os links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Efeito de header com scroll
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Função para carregar vídeos
    function carregarVideos(videos) {
        const videoGallery = document.getElementById('video-gallery');
        if (!videoGallery) return;
        
        // Limpar mensagem de nenhum vídeo
        const noVideoMessage = videoGallery.querySelector('.no-video');
        if (noVideoMessage && videos.length > 0) {
            noVideoMessage.remove();
        }
        
        // Adicionar vídeos
        videos.forEach(video => {
            const videoItem = document.createElement('div');
            videoItem.className = 'video-item';
            videoItem.setAttribute('data-aos', 'fade-up');
            
            videoItem.innerHTML = `
                <iframe src="${video.link}" 
                    title="${video.titulo}" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
                <div class="video-info">
                    <h3>${video.titulo}</h3>
                    <p>${video.descricao || ''}</p>
                </div>
            `;
            
            videoGallery.appendChild(videoItem);
        });
    }
    
    // Carregar vídeos do localStorage
    function carregarVideosDoStorage() {
        try {
            const videosString = localStorage.getItem('videos');
            if (videosString) {
                const videos = JSON.parse(videosString);
                if (Array.isArray(videos) && videos.length > 0) {
                    carregarVideos(videos);
                    return true; // Retorna true se conseguiu carregar os vídeos
                }
            }
            return false; // Retorna false se não há vídeos no localStorage
        } catch (error) {
            console.error('Erro ao carregar vídeos do localStorage:', error);
            return false;
        }
    }
    
    // Carregar vídeos ao iniciar a página - Prioriza o localStorage
    // Se não encontrar dados no localStorage, tenta carregar do arquivo JSON
    if (!carregarVideosDoStorage()) {
        console.log('Não foram encontrados vídeos no localStorage, tentando carregar do arquivo JSON...');
        
        // Tenta carregar do arquivo JSON como fallback
        fetch('dbvideos.json')
            .then(response => {
                if (!response.ok) {
                    console.log('Arquivo de vídeos não encontrado.');
                    return [];
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    carregarVideos(data);
                    // Salvar no localStorage para uso futuro
                    localStorage.setItem('videos', JSON.stringify(data));
                }
            })
            .catch(error => {
                console.error('Erro ao carregar vídeos do arquivo JSON:', error);
            });
    }
    
    // Validação e envio do formulário de contato
    const formContato = document.getElementById('form-contato');
    if (formContato) {
        formContato.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Aqui seria implementada a lógica de envio de formulário
            // Por enquanto apenas simularemos o envio
            
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const telefone = document.getElementById('telefone').value;
            const mensagem = document.getElementById('mensagem').value;
            
            console.log('Formulário enviado:', { nome, email, telefone, mensagem });
            
            // Simular sucesso
            alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
            formContato.reset();
        });
    }
}); 