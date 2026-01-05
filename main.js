// الملف الرئيسي لتنسيق العمل
document.addEventListener('DOMContentLoaded', function() {
    // متغيرات DOM
    const mainPage = document.getElementById('main-page');
    const sectionsPage = document.getElementById('sections-page');
    const adminLoginBtn = document.getElementById('admin-login-btn');
    const userLoginBtn = document.getElementById('user-login-btn');
    const adminLoginModal = document.getElementById('admin-login-modal');
    const cancelLoginBtn = document.getElementById('cancel-login-btn');
    const submitLoginBtn = document.getElementById('submit-login-btn');
    const backToMainBtn = document.getElementById('back-to-main-btn');
    const logoutBtn = document.getElementById('logout-btn');
    
    // تفويض وظائف للمديرين
    window.sectionsManager = sectionsManager;
    window.apiManager = apiManager;
    
    // تهيئة التطبيق
    initApp();
    
    async function initApp() {
        // التحقق من حالة تسجيل الدخول
        const isLoggedIn = await window.authManager.checkLoginStatus();
        
        if (isLoggedIn) {
            mainPage.style.display = 'none';
            sectionsPage.style.display = 'block';
            await sectionsManager.loadSections();
        }
        
        setupEventListeners();
    }
    
    function setupEventListeners() {
        // فتح نافذة تسجيل دخول الإدمن
        adminLoginBtn?.addEventListener('click', () => {
            adminLoginModal.classList.add('active');
        });
        
        // دخول كمستخدم عادي
        userLoginBtn?.addEventListener('click', async () => {
            const result = await window.authManager.login('user@example.com', 'password', false);
            
            if (result.success) {
                mainPage.style.display = 'none';
                sectionsPage.style.display = 'block';
                await sectionsManager.loadSections();
            } else {
                alert(result.message);
            }
        });
        
        // إغلاق نافذة تسجيل الدخول
        cancelLoginBtn?.addEventListener('click', () => {
            adminLoginModal.classList.remove('active');
            document.getElementById('admin-email').value = '';
            document.getElementById('admin-password').value = '';
            document.getElementById('login-error').classList.remove('active');
        });
        
        // تسجيل دخول الإدمن
        submitLoginBtn?.addEventListener('click', async () => {
            const email = document.getElementById('admin-email').value;
            const password = document.getElementById('admin-password').value;
            
            const result = await window.authManager.login(email, password, true);
            
            if (result.success) {
                adminLoginModal.classList.remove('active');
                document.getElementById('admin-email').value = '';
                document.getElementById('admin-password').value = '';
                document.getElementById('login-error').classList.remove('active');
                
                mainPage.style.display = 'none';
                sectionsPage.style.display = 'block';
                await sectionsManager.loadSections();
            } else {
                document.getElementById('login-error').classList.add('active');
                document.getElementById('error-message').textContent = result.message;
            }
        });
        
        // تسجيل الدخول عند الضغط على Enter
        document.getElementById('admin-password')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                submitLoginBtn.click();
            }
        });
        
        // تسجيل الخروج
        logoutBtn?.addEventListener('click', () => {
            window.authManager.logout();
        });
        
        // العودة للصفحة الرئيسية
        backToMainBtn?.addEventListener('click', () => {
            sectionsPage.style.display = 'none';
            mainPage.style.display = 'flex';
            
            const detailPages = document.querySelectorAll('.section-details-page');
            detailPages.forEach(page => page.remove());
        });
        
        // إغلاق النوافذ عند النقر خارجها
        adminLoginModal?.addEventListener('click', (e) => {
            if (e.target === adminLoginModal) {
                adminLoginModal.classList.remove('active');
                document.getElementById('admin-email').value = '';
                document.getElementById('admin-password').value = '';
                document.getElementById('login-error').classList.remove('active');
            }
        });
        
        document.getElementById('add-api-modal')?.addEventListener('click', (e) => {
            if (e.target === document.getElementById('add-api-modal')) {
                apiManager.closeAddApiModal();
            }
        });
        
        document.getElementById('confirm-delete-modal')?.addEventListener('click', (e) => {
            if (e.target === document.getElementById('confirm-delete-modal')) {
                apiManager.closeDeleteModal();
            }
        });
    }
});
