// 打字机效果
document.addEventListener('DOMContentLoaded', function() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const text = typingElement.getAttribute('data-text') || "Welcome to 小夏的个人空间";
    let index = 0;

    function typeText() {
        if (index < text.length) {
            typingElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeText, 100);
        }
    }

    // 延迟开始打字
    setTimeout(typeText, 500);
});
