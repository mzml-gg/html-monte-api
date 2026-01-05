// إدارة الأقسام
class SectionsManager {
    constructor() {
        this.currentSection = '';
        this.sectionTemplates = {
            islamic: { name: 'API إسلامي', icon: 'fas fa-mosque', desc: 'واجهات برمجية للقرآن الكريم، الأحاديث النبوية، أوقات الصلاة، والتقويم الهجري. جميع البيانات من مصادر موثوقة.' },
            search: { name: 'API بحث و تحميل', icon: 'fas fa-search', desc: 'واجهات للبحث في المحتوى المختلف وتنزيل الملفات بأنواعها (فيديوهات، صور، مستندات) بجودة عالية.' },
            games: { name: 'API العاب', icon: 'fas fa-gamepad', desc: 'واجهات برمجية للألعاب الإلكترونية، معلومات الألعاب، اللاعبين، البطولات، والإحصائيات التفصيلية.' },
            news: { name: 'API اخبار', icon: 'fas fa-newspaper', desc: 'واجهات لجلب الأخبار المحلية والعالمية من مصادر متنوعة، مع إمكانية التصنيف حسب الفئة واللغة.' },
            anime: { name: 'API انمي', icon: 'fas fa-film', desc: 'واجهات برمجية للأنمي والمانغا، معلومات الحلقات، الشخصيات، التقييمات، والمحتوى ذو الصلة.' },
            ai: { name: 'API الذكاء الاصطناعي', icon: 'fas fa-robot', desc: 'واجهات للذكاء الاصطناعي، معالجة اللغة، التعرّف على الصور، توليد النصوص، والتحليلات التنبؤية.' }
        };
    }
    
    async loadSections() {
        try {
            const response = await fetch(`${API_URL}/sections`);
            const sections = await response.json();
            
            const container = document.getElementById('sections-container');
            if (!container) return;
            
            container.innerHTML = '';
            
            sections.forEach(section => {
                const template = this.sectionTemplates[section.id] || {
                    name: section.name,
                    icon: 'fas fa-folder',
                    desc: section.description || 'قسم واجهات برمجية'
                };
                
                const apiCount = section.apis ? section.apis.length : 0;
                
                const sectionCard = document.createElement('div');
                sectionCard.className = `section-card ${section.id === 'islamic' || section.id === 'search' || section.id === 'games' ? 'section-neon' : 'section-regular'}`;
                sectionCard.setAttribute('data-section', section.id);
                sectionCard.innerHTML = `
                    <div class="section-content">
                        <div>
                            <div class="section-icon">
                                <i class="${template.icon}"></i>
                            </div>
                            <h3 class="section-title">${template.name}</h3>
                            <p class="section-desc">${template.desc}</p>
                            <span class="section-apis-count">${apiCount} APIs متوفرة</span>
                        </div>
                        <div class="section-action-area">
                            <button class="open-section-btn">
                                <i class="fas fa-external-link-alt"></i>
                                انقر مرتين لفتح القسم
                            </button>
                            <div class="double-click-hint">اضغط مرتين على البطاقة للدخول إلى القسم</div>
                        </div>
                    </div>
                `;
                
                container.appendChild(sectionCard);
            });
            
            this.setupSectionClickListeners();
        } catch (error) {
            console.error('خطأ في تحميل الأقسام:', error);
        }
    }
    
    setupSectionClickListeners() {
        const sectionCards = document.querySelectorAll('.section-card');
        
        sectionCards.forEach(card => {
            let lastClickTime = 0;
            
            card.addEventListener('click', (e) => {
                if (e.target.closest('.open-section-btn')) return;
                
                const currentTime = new Date().getTime();
                const timeDiff = currentTime - lastClickTime;
                
                if (timeDiff < 300 && timeDiff > 0) {
                    // ضغط مزدوج
                    lastClickTime = 0;
                    
                    card.classList.add('double-click-active');
                    setTimeout(() => {
                        card.classList.remove('double-click-active');
                    }, 500);
                    
                    const section = card.getAttribute('data-section');
                    this.openSectionDetails(section);
                } else {
                    lastClickTime = currentTime;
                }
            });
            
            const openBtn = card.querySelector('.open-section-btn');
            if (openBtn) {
                openBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    card.classList.add('double-click-active');
                    setTimeout(() => {
                        card.classList.remove('double-click-active');
                    }, 500);
                    
                    const section = card.getAttribute('data-section');
                    this.openSectionDetails(section);
                });
            }
        });
    }
    
    openSectionDetails(sectionId) {
        this.currentSection = sectionId;
        
        // إخفاء صفحة الأقسام وإظهار صفحة التفاصيل
        document.getElementById('sections-page').style.display = 'none';
        
        // إنشاء صفحة التفاصيل ديناميكياً
        this.createSectionDetailsPage(sectionId);
    }
    
    async createSectionDetailsPage(sectionId) {
        try {
            const response = await fetch(`${API_URL}/sections/${sectionId}/apis`);
            const apis = await response.json();
            const template = this.sectionTemplates[sectionId];
            
            const detailPage = document.createElement('div');
            detailPage.className = 'section-details-page';
            detailPage.id = `section-details-${sectionId}`;
            
            const isAdmin = window.authManager.isAdmin();
            
            detailPage.innerHTML = `
                <div class="container">
                    <div class="section-details-header">
                        <div class="section-details-title">
                            <i class="${template.icon}"></i>
                            <div>
                                <h2>${template.name}</h2>
                                <p>إدارة واختبار واجهات البرمجة الخاصة بهذا القسم</p>
                            </div>
                        </div>
                        ${isAdmin ? `
                            <button class="add-api-btn" id="show-add-api-modal">
                                <i class="fas fa-plus"></i>
                                إضافة API جديدة
                            </button>
                        ` : ''}
                    </div>
                    
                    <div class="api-list">
                        <h3><i class="fas fa-code"></i> واجهات البرمجة المتاحة</h3>
                        
                        ${apis.length > 0 ? 
                            apis.map(api => `
                                <div class="api-item" data-api-id="${api.id}">
                                    <div class="api-header">
                                        <span class="api-method method-${api.method.toLowerCase()}">${api.method}</span>
                                        <div class="api-url">${api.url}</div>
                                        <div class="api-actions">
                                            <button class="action-btn test-btn" onclick="apiManager.testAPI('${api.id}')">
                                                <i class="fas fa-play"></i> Test
                                            </button>
                                            <button class="action-btn copy-btn" onclick="apiManager.copyToClipboard('${api.url}', this)">
                                                <i class="far fa-copy"></i> Copy
                                            </button>
                                        </div>
                                    </div>
                                    <p class="api-description">${api.description}</p>
                                    <div class="api-status ${api.status}">
                                        <i class="fas fa-circle"></i> ${api.status === 'online' ? 'Online' : 'Offline'}
                                    </div>
                                    ${isAdmin ? `
                                        <div class="admin-actions">
                                            <button class="action-btn edit-btn" onclick="apiManager.editAPI('${api.id}')">
                                                <i class="fas fa-edit"></i> تعديل
                                            </button>
                                            <button class="action-btn delete-btn" onclick="apiManager.deleteAPI('${api.id}')">
                                                <i class="fas fa-trash"></i> حذف
                                            </button>
                                        </div>
                                    ` : ''}
                                    <div class="test-panel" id="test-${api.id}">
                                        <div class="test-header">
                                            <h4>نتيجة الاختبار</h4>
                                            <div class="test-status success">نجاح: 200 OK</div>
                                        </div>
                                        <div class="test-response" id="response-${api.id}"></div>
                                    </div>
                                </div>
                            `).join('') 
                            : 
                            `<div class="no-apis">
                                <i class="fas fa-inbox"></i>
                                <h3>لا توجد واجهات برمجة بعد</h3>
                                <p>${isAdmin ? 'إضغط على زر "إضافة API جديدة" لإضافة أول واجهة برمجة لهذا القسم' : 'سيتم إضافة واجهات برمجية لهذا القسم قريباً'}</p>
                            </div>`
                        }
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <button class="back-btn" onclick="sectionsManager.backToSections()">
                            <i class="fas fa-arrow-right"></i>
                            العودة إلى الأقسام
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(detailPage);
            
            // إضافة مستمع للأحداث
            if (isAdmin) {
                document.getElementById('show-add-api-modal').addEventListener('click', () => {
                    apiManager.openAddApiModal();
                });
            }
            
        } catch (error) {
            console.error('خطأ في تحميل تفاصيل القسم:', error);
        }
    }
    
    backToSections() {
        const detailPages = document.querySelectorAll('.section-details-page');
        detailPages.forEach(page => page.remove());
        
        document.getElementById('sections-page').style.display = 'block';
    }
}

window.sectionsManager = new SectionsManager();
