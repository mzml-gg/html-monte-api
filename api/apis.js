const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Middleware للتحقق من التوكن
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'غير مصرح' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'توكن غير صالح' });
    }
};

// Middleware للتحقق من صلاحيات الأدمن فقط
const adminOnly = (req, res, next) => {
    if (req.user.type !== 'admin') {
        return res.status(403).json({ message: 'ليس لديك صلاحية للقيام بهذا الإجراء' });
    }
    next();
};

// بيانات APIs (استخدم قاعدة بيانات حقيقية هنا)
let apis = [
    {
        id: '1',
        sectionId: 'islamic',
        name: 'جلب آية قرآنية',
        url: 'https://api.alquran.cloud/v1/ayah/1:1',
        method: 'GET',
        description: 'جلب آية قرآنية برقم السورة والآية',
        status: 'online',
        createdBy: '1',
        createdAt: new Date().toISOString()
    }
];

// الحصول على API بواسطة ID
router.get('/:id', authenticateToken, (req, res) => {
    const api = apis.find(a => a.id === req.params.id);
    
    if (!api) {
        return res.status(404).json({ message: 'API غير موجود' });
    }
    
    res.json(api);
});

// إضافة API جديد
router.post('/', authenticateToken, adminOnly, (req, res) => {
    const { name, url, method, description, sectionId } = req.body;
    
    if (!name || !url || !method || !sectionId) {
        return res.status(400).json({ message: 'جميع الحقول مطلوبة' });
    }
    
    const newApi = {
        id: Date.now().toString(),
        sectionId,
        name,
        url,
        method,
        description: description || '',
        status: 'online',
        createdBy: req.user.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    apis.push(newApi);
    res.status(201).json(newApi);
});

// تحديث API
router.put('/:id', authenticateToken, adminOnly, (req, res) => {
    const { id } = req.params;
    const { name, url, method, description, status } = req.body;
    
    const apiIndex = apis.findIndex(a => a.id === id);
    
    if (apiIndex === -1) {
        return res.status(404).json({ message: 'API غير موجود' });
    }
    
    // التحقق من أن المستخدم هو من أنشأ الـ API أو هو أدمن
    if (apis[apiIndex].createdBy !== req.user.userId && req.user.type !== 'admin') {
        return res.status(403).json({ message: 'ليس لديك صلاحية لتعديل هذا الـ API' });
    }
    
    apis[apiIndex] = {
        ...apis[apiIndex],
        name: name || apis[apiIndex].name,
        url: url || apis[apiIndex].url,
        method: method || apis[apiIndex].method,
        description: description || apis[apiIndex].description,
        status: status || apis[apiIndex].status,
        updatedAt: new Date().toISOString()
    };
    
    res.json(apis[apiIndex]);
});

// حذف API
router.delete('/:id', authenticateToken, adminOnly, (req, res) => {
    const { id } = req.params;
    
    const apiIndex = apis.findIndex(a => a.id === id);
    
    if (apiIndex === -1) {
        return res.status(404).json({ message: 'API غير موجود' });
    }
    
    // التحقق من أن المستخدم هو من أنشأ الـ API أو هو أدمن
    if (apis[apiIndex].createdBy !== req.user.userId && req.user.type !== 'admin') {
        return res.status(403).json({ message: 'ليس لديك صلاحية لحذف هذا الـ API' });
    }
    
    apis.splice(apiIndex, 1);
    res.json({ message: 'تم حذف الـ API بنجاح' });
});

module.exports = router;
