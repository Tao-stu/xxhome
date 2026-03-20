// Waline 评论系统配置
document.addEventListener('DOMContentLoaded', function() {
    const walineContainer = document.getElementById('waline');
    if (!walineContainer) return;

    // 动态加载 Waline
    import('https://unpkg.com/@waline/client@v3/dist/waline.js').then(module => {
        const { init } = module;

        // 初始化 Waline
        init({
            el: '#waline',
            serverURL: 'https://waline-plum-beta.vercel.app',
            lang: 'zh-CN',
            dark: 'html.dark',
            emoji: [
                '//unpkg.com/@waline/emojis@1.2.0/weibo',
                '//unpkg.com/@waline/emojis@1.2.0/alus',
                '//unpkg.com/@waline/emojis@1.2.0/bilibili',
                '//unpkg.com/@waline/emojis@1.2.0/qq',
                '//unpkg.com/@waline/emojis@1.2.0/tieba',
            ],
            imageUploader: false,
            highlighter: false,
            mathTagSupport: false,
            search: false,
            reaction: true,
            recaptchaV3Key: false,
            wordLimit: 500,
            requiredMeta: ['nick', 'mail'],
            avatar: 'identicon',
            login: 'enable',
            pageSize: 10,
        });
    }).catch(error => {
        console.error('Waline 加载失败:', error);
    });
});
