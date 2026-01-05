const express = require('express');
const router = express.Router();

// بيانات الأقسام (استخدم قاعدة بيانات حقيقية هنا)
let sections = [
    { id: 'islamic', name: 'API إسلامي', description: 'واجهات برمجية إسلامية' },
    { id: 'search', name: 'API بحث و تحميل', description: 'واجهات للبحث والتحميل' },
    { id: 'games', name: 'API العاب', description: 'واجهات للألعاب' },
    { id: 'news', name: 'API اخبار', description: 'واجهات للأخبار' },
    { id: 'anime', name: 'API انمي', description: 'واجهات للأنمي' },
    { id: 'ai', name: 'API الذكاء الاصطناعي', description: 'واجهات للذكاء الاصطناعي' }
];

// APIs لكل قسم (استخدم قاعدة بيانات حقيقية)
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
    },
    {
        id: '2',
        sectionId: 'search',
        name: 'بحث في اليوتيوب',
        url: 'https://www.googleapis.com/youtube/v3/search',
        method: 'GET',
        description: 'بحث عن مقاطع فيديو في اليوتيوب',
        status: 'online',
        createdBy: '1',
        createdAt: new Date().toISOString()
    }
];

// الحصول على جميع الأقسام مع عدد APIs
router.get('/', (req, res) => {
    const sectionsWithCount = sections.map(section => {
        const sectionApis = apis.filter(api => api.sectionId === section.id);
        return {
            ...section,
            apis: sectionApis,
            apiCount: sectionApis.length
        };
    });
    
    res.json(sectionsWithCount);
});

// الحصول على APIs قسم معين
router.get('/:sectionId/apis', (req, res) => {
    const { sectionId } = req.params;
    const sectionApis = apis.filter(api => api.sectionId === sectionId);
    res.json(sectionApis);
});

module.exports = router;
