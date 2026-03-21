// ==================== 图片放大功能 ====================
class ImageViewer {
    constructor() {
        this.viewer = null;
        this.createViewer();
    }

    createViewer() {
        // 创建图片查看器容器
        this.viewer = document.createElement('div');
        this.viewer.className = 'image-viewer';
        this.viewer.innerHTML = `
            <div class="image-viewer-content">
                <img class="image-viewer-img" src="" alt="">
                <button class="image-viewer-close">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>
        `;
        document.body.appendChild(this.viewer);

        // 点击关闭按钮或背景关闭
        this.viewer.querySelector('.image-viewer-close').addEventListener('click', () => this.close());
        this.viewer.addEventListener('click', (e) => {
            if (e.target === this.viewer || e.target.classList.contains('image-viewer-content')) {
                this.close();
            }
        });

        // ESC 键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });
    }

    open(src, alt) {
        const img = this.viewer.querySelector('.image-viewer-img');
        img.src = src;
        img.alt = alt || '';
        this.viewer.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.viewer.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function initImageViewer() {
    const viewer = new ImageViewer();

    // 为文章中的所有图片添加点击事件
    const images = document.querySelectorAll('.article-content figure img');
    images.forEach(img => {
        img.style.cursor = 'pointer';
        img.addEventListener('click', (e) => {
            e.preventDefault();
            viewer.open(img.src, img.alt);
        });
    });
}

// ==================== 目录功能 ====================
class ArticleTOC {
    constructor() {
        this.tocContent = document.getElementById('tocContent');
        this.headings = [];
        this.tocLinks = [];
    }

    generateTOC() {
        const articleContent = document.getElementById('articleContent');
        const headings = articleContent.querySelectorAll('h1, h2, h3, h4');

        if (headings.length === 0) {
            document.getElementById('articleToc').style.display = 'none';
            return;
        }

        // 找出实际存在的最高级标题
        const minLevel = Math.min(...Array.from(headings).map(h => parseInt(h.tagName[1])));

        const counters = { h1: 0, h2: 0, h3: 0, h4: 0 };

        headings.forEach((heading, index) => {
            const id = `heading-${index}`;
            heading.id = id;
            const level = parseInt(heading.tagName[1]);

            if (level === 1) {
                counters.h1++;
                counters.h2 = 0;
                counters.h3 = 0;
                counters.h4 = 0;
            } else if (level === 2) {
                counters.h2++;
                counters.h3 = 0;
                counters.h4 = 0;
            } else if (level === 3) {
                counters.h3++;
                counters.h4 = 0;
            } else if (level === 4) {
                counters.h4++;
            }

            let number = '';
            if (minLevel === 2) {
                // 从 h2 开始
                if (level === 2) {
                    number = `${counters.h2}`;
                } else if (level === 3) {
                    number = `${counters.h2}.${counters.h3}`;
                } else if (level === 4) {
                    number = `${counters.h2}.${counters.h3}.${counters.h4}`;
                }
            } else if (minLevel === 3) {
                // 从 h3 开始
                if (level === 3) {
                    number = `${counters.h3}`;
                } else if (level === 4) {
                    number = `${counters.h3}.${counters.h4}`;
                }
            } else {
                // 从 h1 开始（默认情况）
                if (level === 1) {
                    number = `${counters.h1}`;
                } else if (level === 2) {
                    number = `${counters.h1}.${counters.h2}`;
                } else if (level === 3) {
                    number = `${counters.h1}.${counters.h2}.${counters.h3}`;
                } else if (level === 4) {
                    number = `${counters.h1}.${counters.h2}.${counters.h3}.${counters.h4}`;
                }
            }

            this.headings.push({ element: heading, id: id, level: level, number: number });
        });

        let tocHTML = '<ul class="toc-list">';
        this.headings.forEach((heading, index) => {
            const levelClass = `toc-level-${heading.level}`;
            tocHTML += `<li class="toc-item ${levelClass}"><a href="#${heading.id}" class="toc-link" data-index="${index}"><span class="toc-number">${heading.number}</span>${heading.element.textContent}</a></li>`;
        });
        tocHTML += '</ul>';

        this.tocContent.innerHTML = tocHTML;

        this.tocLinks = this.tocContent.querySelectorAll('.toc-link');
        this.tocLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').slice(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const offset = 100;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            });
        });
    }

    highlightActiveTOC() {
        const scrollPosition = window.pageYOffset;

        for (let i = this.headings.length - 1; i >= 0; i--) {
            const heading = this.headings[i].element;
            const headingPosition = heading.getBoundingClientRect().top + window.pageYOffset;

            if (headingPosition <= scrollPosition + 200) {
                this.tocLinks.forEach(link => link.classList.remove('active'));
                const activeLink = this.tocLinks[i];
                if (activeLink) {
                    activeLink.classList.add('active');
                    this.scrollTOCToActive(activeLink);
                }
                break;
            }
        }
    }

    scrollTOCToActive(activeLink) {
        const tocContent = this.tocContent;
        if (!tocContent || !activeLink) return;

        const containerRect = tocContent.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();

        const relativeTop = linkRect.top - containerRect.top;
        const centerOffset = (containerRect.height / 2) - (linkRect.height / 2);
        const targetScroll = tocContent.scrollTop + relativeTop - centerOffset;

        tocContent.scrollTo({
            top: Math.max(0, Math.min(targetScroll, tocContent.scrollHeight - containerRect.height)),
            behavior: 'smooth'
        });
    }
}

function initArticle() {
    const toc = new ArticleTOC();

    if (typeof hljs !== 'undefined') {
        document.querySelectorAll('.article-content pre code').forEach((block) => {
            hljs.highlightElement(block);

            const language = block.className.match(/language-(\w+)/);
            const langName = language ? language[1] : 'plaintext';

            const pre = block.parentElement;
            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper';
            pre.parentNode.insertBefore(wrapper, pre);
            wrapper.appendChild(pre);

            const toolbar = document.createElement('div');
            toolbar.className = 'code-block-toolbar';

            const langLabel = document.createElement('span');
            langLabel.className = 'code-block-language';
            langLabel.textContent = langName;
            toolbar.appendChild(langLabel);

            const copyBtn = document.createElement('button');
            copyBtn.className = 'code-block-copy-btn';
            copyBtn.innerHTML = `<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-width="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke-width="2"/></svg>`;
            toolbar.appendChild(copyBtn);
            wrapper.insertBefore(toolbar, pre);

            copyBtn.addEventListener('click', async () => {
                const code = block.textContent;
                try {
                    await navigator.clipboard.writeText(code);
                    copyBtn.innerHTML = `<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
                    setTimeout(() => {
                        copyBtn.innerHTML = `<svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" stroke-width="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke-width="2"/></svg>`;
                    }, 2000);
                } catch (err) {
                    console.error('复制失败:', err);
                    alert('复制失败，请手动复制');
                }
            });
        });
    }

    document.getElementById('currentYear').textContent = new Date().getFullYear();

    window.addEventListener('scroll', () => {
        toc.highlightActiveTOC();
    });

    toc.highlightActiveTOC();
    toc.generateTOC();

    const articleTitle = document.querySelector('.article-title');
    const tocArticleTitle = document.querySelector('.toc-article-title');
    if (articleTitle && tocArticleTitle) {
        tocArticleTitle.textContent = articleTitle.textContent;
    }
}

function waitForLibraries() {
    if (typeof hljs !== 'undefined') {
        initArticle();
    } else {
        setTimeout(waitForLibraries, 100);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    waitForLibraries();
    initImageViewer();
});
