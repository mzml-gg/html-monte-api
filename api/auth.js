const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// بيانات المستخدمين (في بيئة الإنتاج استخدم قاعدة بيانات)
const users = [
    {
        id: '1',
        email: 'montedev@gmail.com',
        password: 'adminmonte', // في الواقع يجب تشفيرها
        type: 'admin',
        name: 'مسؤول النظام'
    },
    {
        id: '2',
        email: 'user@example.com',
        password: 'password',
        type: 'user',
        name: 'مستخدم'
    }
];

// تسجيل الدخول
router.post('/login', (req, res) => {
    const { email, password, isAdmin } = req.body;
    
    // البحث عن المستخدم
    let user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return res.status(401).json({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
    }
    
    // إذا طلب دخول كأدمن وكان المستخدم ليس أدمن
    if (isAdmin && user.type !== 'admin') {
        return res.status(403).json({ message: 'ليس لديك صلاحية الدخول كمسؤول' });
    }
    
    // إنشاء توكن
    const token = jwt.sign(
        { userId: user.id, email: user.email, type: user.type },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
    );
    
    res.json({
        token,
        user: {
            id: user.id,
            email: user.email,
            type: user.type,
            name: user.name
        }
    });
});

// التحقق من حالة تسجيل الدخول
router.get('/me', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'غير مصرح' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        const user = users.find(u => u.id === decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'المستخدم غير موجود' });
        }
        
        res.json({
            id: user.id,
            email: user.email,
            type: user.type,
            name: user.name
        });
    } catch (error) {
        res.status(401).json({ message: 'توكن غير صالح' });
    }
});

module.exports = router;
