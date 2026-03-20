// ===== 主题管理 =====
class ThemeManager {
    constructor() {
        this.isDark = true; // 默认黑夜模式
        this.init();
    }

    init() {
        // 从 localStorage 读取保存的主题
        const savedTheme = localStorage.getItem('theme');

        // 如果有保存的主题，使用保存的；否则默认黑夜模式
        if (savedTheme) {
            this.isDark = savedTheme === 'dark';
        } else {
            this.isDark = true;
        }

        this.updateTheme();
        this.bindEvents();
    }

    toggleTheme() {
        this.isDark = !this.isDark;
        this.updateTheme();
        localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
    }

    updateTheme() {
        const html = document.documentElement;

        if (this.isDark) {
            html.classList.add('dark');
            html.classList.remove('light');
            document.body.classList.add('dark');
            document.body.classList.remove('light');
        } else {
            html.classList.remove('dark');
            html.classList.add('light');
            document.body.classList.remove('dark');
            document.body.classList.add('light');
        }
    }

    bindEvents() {
        // 主题切换按钮
        const themeToggles = document.querySelectorAll('.theme-toggle');
        themeToggles.forEach(toggle => {
            toggle.addEventListener('click', () => this.toggleTheme());
        });
    }
}

// ===== 导航栏滚动效果 =====
class NavbarManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.lastScrollTop = 0;
        this.init();
    }

    init() {
        if (!this.navbar) return;

        this.bindEvents();
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // 向下滚动：隐藏导航栏
        // 向上滚动：显示导航栏
        // 在顶部时：始终显示导航栏
        if (scrollTop > this.lastScrollTop && scrollTop > 100) {
            // 向下滚动
            this.navbar.classList.add('hidden');
        } else if (scrollTop < this.lastScrollTop) {
            // 向上滚动
            this.navbar.classList.remove('hidden');
        }

        // 在顶部时始终显示
        if (scrollTop <= 50) {
            this.navbar.classList.remove('hidden');
        }

        // 更新滚动背景
        if (scrollTop > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        this.lastScrollTop = scrollTop;
    }

    bindEvents() {
        window.addEventListener('scroll', () => this.handleScroll());
    }
}

// ===== 移动端菜单管理 =====
class MobileMenuManager {
    constructor() {
        this.toggle = document.getElementById('mobile-menu-toggle');
        this.menu = document.getElementById('mobile-nav');
        this.init();
    }

    init() {
        if (!this.toggle || !this.menu) return;

        this.bindEvents();
    }

    toggleMenu() {
        this.toggle.classList.toggle('open');
        this.menu.classList.toggle('show');
    }

    closeMenu() {
        this.toggle.classList.remove('open');
        this.menu.classList.remove('show');
    }

    bindEvents() {
        this.toggle.addEventListener('click', () => this.toggleMenu());

        // 点击菜单链接后关闭菜单
        const mobileLinks = this.menu.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });
    }
}

// ===== 页面活动导航状态管理 =====
class ActiveNavManager {
    constructor() {
        this.init();
    }

    init() {
        this.updateActiveNav();
        this.bindEvents();
    }

    updateActiveNav() {
        const currentPage = this.getCurrentPage();

        // 更新桌面导航
        const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');
        desktopLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === currentPage) {
                link.classList.add('active');
            }
        });

        // 更新移动端导航
        const mobileLinks = document.querySelectorAll('.mobile-nav-link');
        mobileLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === currentPage) {
                link.classList.add('active');
            }
        });
    }

    getCurrentPage() {
        const path = window.location.pathname;

        // 根据路径判断当前页面
        if (path === '/' || path === '/index.html' || path === '') {
            return 'home';
        } else if (path.includes('/blog') || path.includes('blog.html') || path.includes('/article/')) {
            // /blog 目录、blog.html 文件、以及/article/目录下的文章都属于"文章"分类
            return 'blog';
        } else if (path.includes('/guestbook') || path.includes('guestbook.html')) {
            return 'guestbook';
        } else if (path.includes('/about') || path.includes('about.html')) {
            return 'about';
        } else {
            return 'home';
        }
    }

    bindEvents() {
        // 不需要额外的事件绑定
    }
}

// ===== 返回顶部按钮 =====
class BackToTopManager {
    constructor() {
        this.button = document.getElementById('backToTop');
        this.init();
    }

    init() {
        if (!this.button) return;

        this.bindEvents();
    }

    handleScroll() {
        if (window.scrollY > 300) {
            this.button.classList.add('show');
        } else {
            this.button.classList.remove('show');
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    bindEvents() {
        window.addEventListener('scroll', () => this.handleScroll());
        this.button.addEventListener('click', () => this.scrollToTop());
    }
}

// ===== 平滑滚动 =====
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // 监听所有锚点链接
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');

                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault();
                    const offsetTop = targetElement.offsetTop - 80; // 减去导航栏高度

                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ===== 卡片滚动动画 =====
class ScrollAnimation {
    constructor() {
        this.animatedElements = new Set();
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkScroll();
    }

    checkScroll() {
        const elements = document.querySelectorAll('.card, .message-card, .section, .page-header');

        elements.forEach((element) => {
            // 跳过已动画的元素
            if (this.animatedElements.has(element)) return;

            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (rect.top < windowHeight * 0.85) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';

                // 使用 requestAnimationFrame 确保样式应用后再触发动画
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        element.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                        this.animatedElements.add(element);
                    });
                });
            }
        });
    }

    bindEvents() {
        window.addEventListener('scroll', () => this.checkScroll());
        window.addEventListener('load', () => this.checkScroll());
    }
}

// ===== 分类筛选管理 =====
class CategoryFilter {
    constructor() {
        this.buttons = document.querySelectorAll('.category-btn');
        this.cards = document.querySelectorAll('.card-grid .card');
        this.searchInput = document.getElementById('searchInput');
        this.currentCategory = 'all';
        this.currentSearch = '';
        this.init();
    }

    init() {
        if (this.buttons.length === 0) return;

        // 计算每个分类的文章数量
        this.updateCategoryCounts();

        // 绑定事件
        this.bindEvents();
    }

    updateCategoryCounts() {
        const counts = { all: 0, tech: 0, life: 0, study: 0 };

        this.cards.forEach(card => {
            const category = card.dataset.category || 'uncategorized';
            if (counts.hasOwnProperty(category)) {
                counts[category]++;
            }
            counts.all++;
        });

        // 更新显示的计数
        this.buttons.forEach(btn => {
            const category = btn.dataset.category;
            const countElement = btn.querySelector('.count');
            if (countElement && counts.hasOwnProperty(category)) {
                countElement.textContent = `(${counts[category]})`;
            }
        });
    }

    filterArticles() {
        this.cards.forEach((card, index) => {
            const cardCategory = card.dataset.category || 'uncategorized';
            const cardTitle = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const cardText = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
            const cardTags = card.dataset.tags?.toLowerCase() || '';

            // 检查分类匹配
            const categoryMatch = this.currentCategory === 'all' || cardCategory === this.currentCategory;

            // 检查搜索匹配
            const searchMatch = !this.currentSearch ||
                cardTitle.includes(this.currentSearch) ||
                cardText.includes(this.currentSearch) ||
                cardTags.includes(this.currentSearch);

            if (categoryMatch && searchMatch) {
                card.classList.remove('hidden');
                card.classList.add('fade-in');
                card.style.animationDelay = `${index * 0.1}s`;
            } else {
                card.classList.add('hidden');
                card.classList.remove('fade-in');
            }
        });

        // 动画结束后移除fade-in类
        setTimeout(() => {
            this.cards.forEach(card => {
                card.classList.remove('fade-in');
                card.style.animationDelay = '0s';
            });
        }, 1000);
    }

    bindEvents() {
        // 分类按钮点击事件
        this.buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentCategory = btn.dataset.category;
                this.filterArticles();
            });
        });

        // 搜索输入事件
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => {
                this.currentSearch = e.target.value.toLowerCase().trim();
                this.filterArticles();
            });
        }
    }
}

// ===== 初始化所有模块 =====
document.addEventListener('DOMContentLoaded', () => {
    // 初始化主题管理器
    new ThemeManager();

    // 初始化导航栏管理器
    new NavbarManager();

    // 初始化移动端菜单管理器
    new MobileMenuManager();

    // 初始化活动导航状态管理器
    new ActiveNavManager();

    // 初始化返回顶部按钮（如果存在）
    if (document.getElementById('back-to-top')) {
        new BackToTopManager();
    }

    // 初始化平滑滚动
    new SmoothScroll();

    // 初始化滚动动画
    new ScrollAnimation();

    // 初始化分类筛选（如果存在）
    if (document.querySelector('.category-filter')) {
        new CategoryFilter();
    }
});

// ===== 页面标题管理 =====
function updatePageTitle() {
    const titles = {
        'index.html': '主页- 小夏的个人空间',
        'blog.html': '文章- 小夏的个人空间',
        'guestbook.html': '留言- 小夏的个人空间',
        'about.html': '关于- 小夏的个人空间'
    };

    const path = window.location.pathname;
    const filename = path.split('/').pop();

    if (titles[filename]) {
        document.title = titles[filename];
    }
}

// 页面加载完成后更新标题
window.addEventListener('load', updatePageTitle);
