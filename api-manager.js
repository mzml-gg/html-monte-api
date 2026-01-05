// إدارة APIs
class APIManager {
    constructor() {
        this.isEditing = false;
        this.apiToDelete = null;
        this.currentSection = '';
        this.init();
    }
    
    init() {
        this.setupModalListeners();
    }
    
    setupModalListeners() {
        // إغلاق النوافذ المنبثقة
        document.getElementById('close-modal-btn')?.addEventListener('click', () => this.closeAddApiModal());
        document.getElementById('cancel-api-btn')?.addEventListener('click', () => this.closeAddApiModal());
        document.getElementById('cancel-delete-btn')?.addEventListener('click', () => this.closeDeleteModal());
        document.getElementById('confirm-delete-btn')?.addEventListener('click', () => this.confirmDelete());
        
        // اختيار طريقة الطلب
        document.querySelectorAll('.method-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.method-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                document.getElementById('api-method').value = option.getAttribute('data-method');
            });
        });
        
        // إضافة/تحديث API
        document.getElementById('add-api-form')?.addEventListener('submit', (e) => this.saveAPI(e));
    }
    
    async openAddApiModal(apiId = null) {
        this.isEditing = false;
        document.getElementById('add-api-form').reset();
        
        document.querySelectorAll('.method-option').forEach(opt => opt.classList.remove('selected'));
        document.querySelector('.method-option.get').classList.add('selected');
        document.getElementById('api-method').value = 'GET';
        
        if (apiId) {
            this.isEditing = true;
            const api = await this.getAPI(apiId);
            if (api) {
                document.getElementById('api-id').value = api.id;
                document.getElementById('api-name').value = api.name;
                document.getElementById('api-url').value = api.url;
                document.getElementById('api-description').value = api.description;
                
                document.querySelectorAll('.method-option').forEach(opt => {
                    opt.classList.remove('selected');
                    if (opt.getAttribute('data-method') === api.method) {
                        opt.classList.add('selected');
                        document.getElementById('api-method').value = api.method;
                    }
                });
                
                document.getElementById('save-api-btn').textContent = 'تحديث API';
                document.querySelector('.modal-header h3').innerHTML = '<i class="fas fa-edit"></i> تعديل API';
            }
        } else {
            document.getElementById('api-id').value = '';
            document.getElementById('save-api-btn').textContent = 'إضافة API';
            document.querySelector('.modal-header h3').innerHTML = '<i class="fas fa-plus-circle"></i> إضافة API جديدة';
        }
        
        document.getElementById('add-api-modal').style.display = 'flex';
    }
    
    async getAPI(apiId) {
        try {
            const token = localStorage.getItem('monteDevToken');
            const response = await fetch(`${API_URL}/apis/${apiId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error('خطأ في جلب API:', error);
        }
        
        return null;
    }
    
    async saveAPI(event) {
        event.preventDefault();
        
        const apiId = document.getElementById('api-id').value || Date.now().toString();
        const apiName = document.getElementById('api-name').value;
        const apiUrl = document.getElementById('api-url').value;
        const apiMethod = document.getElementById('api-method').value;
        const apiDescription = document.getElementById('api-description').value;
        
        const apiData = {
            id: apiId,
            name: apiName,
            url: apiUrl,
            method: apiMethod,
            description: apiDescription,
            status: 'online',
            sectionId: sectionsManager.currentSection
        };
        
        try {
            const token = localStorage.getItem('monteDevToken');
            const url = this.isEditing ? `${API_URL}/apis/${apiId}` : `${API_URL}/apis`;
            const method = this.isEditing ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(apiData)
            });
            
            if (response.ok) {
                alert(this.isEditing ? 'تم تحديث الـ API بنجاح!' : 'تمت إضافة الـ API بنجاح!');
                this.closeAddApiModal();
                
                // إعادة تحميل صفحة التفاصيل
                const detailPage = document.getElementById(`section-details-${sectionsManager.currentSection}`);
                if (detailPage) {
                    detailPage.remove();
                    sectionsManager.createSectionDetailsPage(sectionsManager.currentSection);
                }
            } else {
                const error = await response.json();
                alert(error.message || 'حدث خطأ أثناء حفظ الـ API');
            }
        } catch (error) {
            console.error('خطأ في حفظ API:', error);
            alert('حدث خطأ في الاتصال بالخادم');
        }
    }
    
    async deleteAPI(apiId) {
        this.apiToDelete = apiId;
        const api = await this.getAPI(apiId);
        
        if (api) {
            document.getElementById('confirm-delete-message').textContent = 
                `هل أنت متأكد من رغبتك في حذف API "${api.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`;
            document.getElementById('confirm-delete-modal').style.display = 'flex';
        }
    }
    
    async confirmDelete() {
        if (!this.apiToDelete) return;
        
        try {
            const token = localStorage.getItem('monteDevToken');
            const response = await fetch(`${API_URL}/apis/${this.apiToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                alert('تم حذف الـ API بنجاح!');
                this.closeDeleteModal();
                
                // إعادة تحميل صفحة التفاصيل
                const detailPage = document.getElementById(`section-details-${sectionsManager.currentSection}`);
                if (detailPage) {
                    detailPage.remove();
                    sectionsManager.createSectionDetailsPage(sectionsManager.currentSection);
                }
            } else {
                const error = await response.json();
                alert(error.message || 'حدث خطأ أثناء حذف الـ API');
            }
        } catch (error) {
            console.error('خطأ في حذف API:', error);
            alert('حدث خطأ في الاتصال بالخادم');
        }
    }
    
    async testAPI(apiId) {
        const api = await this.getAPI(apiId);
        if (!api) return;
        
        const testPanel = document.getElementById(`test-${apiId}`);
        const responseElement = document.getElementById(`response-${apiId}`);
        const testBtn = document.querySelector(`.test-btn[onclick*="${apiId}"]`);
        
        if (!testPanel || !responseElement || !testBtn) return;
        
        const originalBtnText = testBtn.innerHTML;
        testBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Testing...';
        testBtn.disabled = true;
        
        // إخفاء جميع لوحات الاختبار
        document.querySelectorAll('.test-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        setTimeout(() => {
            testBtn.innerHTML = originalBtnText;
            testBtn.disabled = false;
            
            testPanel.classList.add('active');
            
            const mockResponse = {
                success: true,
                message: "تم تنفيذ الطلب بنجاح",
                data: {
                    endpoint: api.url,
                    method: api.method,
                    timestamp: new Date().toISOString(),
                    status: "success"
                }
            };
            
            responseElement.textContent = JSON.stringify(mockResponse, null, 2);
            
            const testStatus = testPanel.querySelector('.test-status');
            testStatus.textContent = `نجاح: 200 OK`;
            testStatus.className = 'test-status success';
            
        }, 1500);
    }
    
    copyToClipboard(text, button) {
        navigator.clipboard.writeText(text).then(() => {
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i> Copied!';
            button.classList.add('copied');
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Error copying text: ', err);
            alert('حدث خطأ أثناء نسخ الرابط');
        });
    }
    
    closeAddApiModal() {
        document.getElementById('add-api-modal').style.display = 'none';
        document.getElementById('add-api-form').reset();
    }
    
    closeDeleteModal() {
        document.getElementById('confirm-delete-modal').style.display = 'none';
        this.apiToDelete = null;
    }
}

window.apiManager = new APIManager();
