// إدارة النظام المظلم/فاتح/نيون
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeMenu = document.getElementById('theme-menu');
    const themeOptions = document.querySelectorAll('.theme-option');
    const starsContainer = document.getElementById('stars');
    const body = document.body;
    
    // إنشاء النجوم للوضع الأسود
    function createStars() {
        starsContainer.innerHTML = '';
        const starCount = 200;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            
            const size = Math.random() * 3 + 1;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            
            starsContainer.appendChild(star);
        }
    }
    
    // تحميل الوضع المحفوظ
    function loadTheme() {
        const savedTheme = localStorage.getItem('monteDevTheme') || 'light';
        setTheme(savedTheme);
    }
    
    // تغيير الوضع
    function setTheme(theme) {
        body.classList.remove('light-mode', 'dark-mode', 'neon-mode');
        body.classList.add(`${theme}-mode`);
        
        if (theme === 'dark') {
            starsContainer.style.opacity = '1';
            createStars();
        } else {
            starsContainer.style.opacity = '0';
        }
        
        localStorage.setItem('monteDevTheme', theme);
        themeMenu.classList.remove('active');
    }
    
    // فتح/إغلاق قائمة الأوضاع
    themeToggle.addEventListener('click', function() {
        themeMenu.classList.toggle('active');
    });
    
    // تغيير الوضع عند النقر على خيار
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            setTheme(theme);
        });
    });
    
    // إغلاق قائمة الأوضاع عند النقر خارجها
    document.addEventListener('click', function(e) {
        if (!themeToggle.contains(e.target) && !themeMenu.contains(e.target)) {
            themeMenu.classList.remove('active');
        }
    });
    
    // تحميل الوضع عند بدء التشغيل
    loadTheme();
});
