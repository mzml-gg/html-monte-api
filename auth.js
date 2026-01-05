// إدارة المصادقة
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }
    
    init() {
        this.checkLoginStatus();
        this.setupEventListeners();
    }
    
    async checkLoginStatus() {
        try {
            const token = localStorage.getItem('monteDevToken');
            if (token) {
                const response = await fetch(`${API_URL}/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    this.currentUser = await response.json();
                    this.updateUserInterface();
                    return true;
                }
            }
        } catch (error) {
            console.error('خطأ في التحقق من حالة تسجيل الدخول:', error);
        }
        
        return false;
    }
    
    async login(email, password, isAdmin = true) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, isAdmin })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                localStorage.setItem('monteDevToken', data.token);
                this.currentUser = data.user;
                this.updateUserInterface();
                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('خطأ في تسجيل الدخول:', error);
            return { success: false, message: 'خطأ في الاتصال بالخادم' };
        }
    }
    
    logout() {
        localStorage.removeItem('monteDevToken');
        this.currentUser = null;
        window.location.reload();
    }
    
    updateUserInterface() {
        if (!this.currentUser) return;
        
        const userTypeBadge = document.getElementById('user-type-badge');
        const userTypeText = document.getElementById('user-type-text');
        
        if (userTypeBadge && userTypeText) {
            if (this.currentUser.type === 'admin') {
                userTypeBadge.className = 'user-type admin-badge';
                userTypeBadge.innerHTML = '<i class="fas fa-user-shield"></i><span>مسؤول النظام</span>';
            } else {
                userTypeBadge.className = 'user-type user-badge';
                userTypeBadge.innerHTML = '<i class="fas fa-user"></i><span>مستخدم</span>';
            }
        }
    }
    
    setupEventListeners() {
        // ستتم إضافة المستمعين من main.js
    }
    
    isAdmin() {
        return this.currentUser && this.currentUser.type === 'admin';
    }
}

// إنشاء كائن AuthManager عالمي
window.authManager = new AuthManager();
