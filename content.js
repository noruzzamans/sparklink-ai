// configuration
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.0-flash:generateContent";

let apiKey = null;

// Initialize
chrome.storage.sync.get(['geminiApiKey'], (result) => {
    if (result.geminiApiKey) {
        apiKey = result.geminiApiKey;
        console.log("AI Reply: API Key loaded.");
        initObserver();
    } else {
        console.log("AI Reply: No API Key found.");
    }
});

// Watch for DOM changes to find comment boxes
function initObserver() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    processNode(node);
                    // Also check children
                    const editors = node.querySelectorAll && node.querySelectorAll('.ql-editor, div[contenteditable="true"]');
                    if (editors && editors.length > 0) {
                        editors.forEach(injectUI);
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
    
    // Initial check
    document.querySelectorAll('.ql-editor, div[contenteditable="true"]').forEach(injectUI);
}

function processNode(node) {
    if (node.matches && (node.matches('.ql-editor') || node.matches('div[contenteditable="true"]'))) {
        injectUI(node);
    }
}

function injectUI(editor) {
    if (editor.dataset.aiReplyInjected) return;
    editor.dataset.aiReplyInjected = "true";

    // Find a suitable parent to attach the absolute container
    // LinkedIn structure: .comments-comment-box__form-container or similar
    const container = editor.closest('.comments-comment-box__form-container') || editor.parentElement;
    if (!container) return;
    
    container.style.position = 'relative'; // Ensure positioning context

    const wrapper = document.createElement('div');
    wrapper.className = 'ai-reply-sparkle-container';
    
    wrapper.innerHTML = `
        <div class="ai-reply-menu">
            <div class="ai-reply-option" data-tone="positive"><span>👍</span> Positive</div>
            <div class="ai-reply-option" data-tone="thoughtful"><span>🤔</span> Thoughtful</div>
            <div class="ai-reply-option" data-tone="question"><span>❓</span> Question</div>
            <div class="ai-reply-option" data-tone="disagree"><span>🔥</span> Controversial</div>
        </div>
        <button class="ai-reply-sparkle-btn" title="Generate AI Reply"></button>
    `;

    container.appendChild(wrapper);

    // Event Listeners
    const btn = wrapper.querySelector('.ai-reply-sparkle-btn');
    const menu = wrapper.querySelector('.ai-reply-menu');

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        menu.classList.toggle('visible');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            menu.classList.remove('visible');
        }
    });

    menu.querySelectorAll('.ai-reply-option').forEach(option => {
        option.addEventListener('click', async (e) => {
            e.stopPropagation();
            menu.classList.remove('visible');
            const tone = option.dataset.tone;
            await generateReply(editor, tone, btn);
        });
    });
}

function getPostContent(editor) {
    // Traverse up to find the full post container
    const feedItem = editor.closest('.feed-shared-update-v2') || 
                     editor.closest('.comments-comment-box').closest('.feed-shared-update-v2'); // Fallback logic
    
    if (feedItem) {
        // Try getting the main text
        const textNode = feedItem.querySelector('.feed-shared-update-v2__description') || 
                         feedItem.querySelector('.update-components-text');
        if (textNode) return textNode.innerText;
    }
    return "";
}

async function generateReply(editor, tone, btn) {
    const postText = getPostContent(editor);
    if (!postText) {
        alert("Could not find post content to reply to.");
        return;
    }

    if (!apiKey) {
        alert("Please set your Gemini API Key in the extension settings.");
        return;
    }

    btn.classList.add('loading');

    try {
        const prompt = `
            Context: I am replying to a LinkedIn post.
            Post Content: "${postText.substring(0, 1000)}"
            
            Task: Write a short, engaging, and professional reply.
            Tone: ${tone}.
            
            Keep it under 30 words. Do not use hashtags. Do not use quotes.
        `;

        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error.message);
        }

        const reply = data.candidates[0].content.parts[0].text.trim();
        insertText(editor, reply);

    } catch (err) {
        console.error(err);
        alert("Error generating reply: " + err.message);
    } finally {
        btn.classList.remove('loading');
    }
}

function insertText(editor, text) {
    editor.focus();
    
    // Simulate typing (best effort for React apps)
    // 1. Clear existing if needed (optional, keeping append for now or replace?)
    // Let's replace content for a fresh start or append? Usually append is safer but user wants a reply.
    // Let's clear first if empty, or just append.
    
    // Using execCommand is deprecated but still widely supported for contenteditable
    // It handles the undo stack and React events better than innerHTML manipulation
    document.execCommand('insertText', false, text);
    
    // Dispatch input events to trigger LinkedIn's validation
    editor.dispatchEvent(new Event('input', { bubbles: true }));
    editor.dispatchEvent(new Event('change', { bubbles: true }));
}
