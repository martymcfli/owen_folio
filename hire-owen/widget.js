/**
 * Hire Owen - AI Chat Widget
 * Embed this script on any page to add the floating chat bubble
 *
 * Usage: <script src="hire-owen/widget.js"></script>
 */

(function() {
    'use strict';

    // Styles
    const styles = `
        #hire-owen-widget {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 9999;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        #hire-owen-bubble {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 14px rgba(20, 184, 166, 0.35);
            transition: all 0.3s ease;
            position: relative;
        }

        #hire-owen-bubble:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 20px rgba(20, 184, 166, 0.45);
        }

        #hire-owen-bubble svg {
            width: 20px;
            height: 20px;
            color: white;
        }

        #hire-owen-bubble .close-icon {
            display: none;
        }

        #hire-owen-bubble.open .chat-icon {
            display: none;
        }

        #hire-owen-bubble.open .close-icon {
            display: block;
        }

        #hire-owen-pulse {
            position: absolute;
            top: -2px;
            right: -2px;
            width: 12px;
            height: 12px;
            background: #22c55e;
            border-radius: 50%;
            border: 2px solid #0f1419;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.8; }
        }

        #hire-owen-tooltip {
            position: absolute;
            bottom: 100%;
            right: 0;
            background: #1c2127;
            color: #f8fafc;
            padding: 12px 16px;
            border-radius: 12px;
            font-size: 14px;
            white-space: nowrap;
            margin-bottom: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
            pointer-events: none;
        }

        #hire-owen-tooltip::after {
            content: '';
            position: absolute;
            bottom: -8px;
            right: 24px;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid #1c2127;
        }

        #hire-owen-widget:not(.open):hover #hire-owen-tooltip {
            opacity: 1;
            transform: translateY(0);
        }

        #hire-owen-chat {
            position: absolute;
            bottom: 80px;
            right: 0;
            width: 400px;
            height: 600px;
            background: #0f1419;
            border-radius: 20px;
            border: 1px solid #2d3748;
            box-shadow: 0 10px 50px rgba(0,0,0,0.5);
            display: none;
            flex-direction: column;
            overflow: hidden;
            animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        #hire-owen-widget.open #hire-owen-chat {
            display: flex;
        }

        #hire-owen-header {
            background: #1a1f25;
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid #2d3748;
        }

        #hire-owen-avatar {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        }

        #hire-owen-header-info h4 {
            color: #f8fafc;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 2px;
        }

        #hire-owen-header-info p {
            color: #94a3b8;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        #hire-owen-header-info .status-dot {
            width: 6px;
            height: 6px;
            background: #22c55e;
            border-radius: 50%;
        }

        #hire-owen-expand {
            margin-left: auto;
            background: transparent;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            padding: 8px;
            border-radius: 8px;
            transition: all 0.2s ease;
        }

        #hire-owen-expand:hover {
            background: rgba(148, 163, 184, 0.1);
            color: #f8fafc;
        }

        #hire-owen-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .hire-owen-msg {
            display: flex;
            gap: 8px;
            max-width: 85%;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .hire-owen-msg.user {
            align-self: flex-end;
            flex-direction: row-reverse;
        }

        .hire-owen-msg-avatar {
            width: 28px;
            height: 28px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            flex-shrink: 0;
        }

        .hire-owen-msg.ai .hire-owen-msg-avatar {
            background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
        }

        .hire-owen-msg.user .hire-owen-msg-avatar {
            background: #2d3748;
        }

        .hire-owen-msg-content {
            padding: 10px 14px;
            border-radius: 14px;
            font-size: 13px;
            line-height: 1.5;
            color: #f8fafc;
        }

        .hire-owen-msg.ai .hire-owen-msg-content {
            background: #2d3748;
            border-bottom-left-radius: 4px;
        }

        .hire-owen-msg.user .hire-owen-msg-content {
            background: #14b8a6;
            border-bottom-right-radius: 4px;
        }

        .hire-owen-msg-content strong {
            color: #14b8a6;
        }

        .hire-owen-msg.user .hire-owen-msg-content strong {
            color: #fff;
        }

        #hire-owen-typing {
            display: none;
            gap: 8px;
            max-width: 85%;
        }

        #hire-owen-typing.active {
            display: flex;
        }

        .hire-owen-typing-dots {
            display: flex;
            gap: 4px;
            padding: 12px 14px;
            background: #2d3748;
            border-radius: 14px;
            border-bottom-left-radius: 4px;
        }

        .hire-owen-typing-dot {
            width: 6px;
            height: 6px;
            background: #94a3b8;
            border-radius: 50%;
            animation: typingBounce 1.4s infinite ease-in-out;
        }

        .hire-owen-typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .hire-owen-typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes typingBounce {
            0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
        }

        #hire-owen-quick-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            padding: 0 16px 12px;
        }

        .hire-owen-quick-btn {
            padding: 6px 12px;
            background: #1a1f25;
            border: 1px solid #2d3748;
            border-radius: 16px;
            color: #f8fafc;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .hire-owen-quick-btn:hover {
            background: #14b8a6;
            border-color: #14b8a6;
        }

        #hire-owen-input-area {
            padding: 12px 16px;
            border-top: 1px solid #2d3748;
        }

        #hire-owen-input-wrapper {
            display: flex;
            gap: 8px;
            background: #1a1f25;
            border: 1px solid #2d3748;
            border-radius: 12px;
            padding: 6px;
        }

        #hire-owen-input-wrapper:focus-within {
            border-color: #14b8a6;
        }

        #hire-owen-input {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: #f8fafc;
            font-size: 13px;
            padding: 6px 10px;
        }

        #hire-owen-input::placeholder {
            color: #64748b;
        }

        #hire-owen-send {
            width: 32px;
            height: 32px;
            background: #14b8a6;
            border: none;
            border-radius: 8px;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s ease;
        }

        #hire-owen-send:hover {
            background: #0d9488;
        }

        @media (max-width: 480px) {
            #hire-owen-chat {
                width: calc(100vw - 32px);
                height: calc(100vh - 120px);
                bottom: 80px;
                right: -8px;
            }
        }
    `;

    // Knowledge base
    const knowledge = {
        skills: "Owen's good at making messy things less messy. RevOps, sales ops, process automation, CRM architecture (HubSpot & Salesforce), project management. He's got a Lean Six Sigma Green Belt, Scrum Master cert, and is taking his PMP in March. He also builds things with Python, JavaScript, and React when nobody's looking.",

        projects: "He's got a few things on this site worth clicking around — a **Salesforce Payment Orchestrator** (the one with actual Apex code, not just a screenshot), a **Culture Heat Map** that tracks org health across 127 companies, and **Chime Pulse** which is an AI-powered narrative intelligence dashboard. All built by him. Yes, really.",

        revops: "HubSpot RevOps certified. Built pipeline architecture, lead scoring, lifecycle automation — the whole thing. He managed an $847K+ pipeline at 24.3% conversion. He gets weirdly excited about deal stage hygiene.",

        availability: "He's actively looking. Can start fast — within 2 weeks. Open to remote, hybrid, or on-site. Currently in New York but relocating is not a problem for him at all.",

        compensation: "He says his range is $80K-$110K base but he's flexible depending on the full picture — equity, growth, company stage, whether the snacks are good. His words, not mine.",

        contact: "Best ways to reach Owen:\n📧 mcmcowen@gmail.com\n📱 347-268-1742\n💼 linkedin.com/in/owen-p-mccormick\n\nHe's pretty quick to respond. Faster than me, honestly.",

        whyHire: "Most ops people manage systems. Owen builds them from scratch and then optimizes them. He scaled a business from zero to $2.5M and sold it. He's built CRM pipelines, payment systems, AI dashboards — not as homework, but because he wanted to. That's either impressive or concerning, depending on your perspective.",

        background: "B.S. in Business (Cum Laude), Lean Six Sigma Green Belt, Scrum Master (PSM I), HubSpot RevOps cert, PMP candidate. He also speaks French (B2 certified) which comes up more than you'd think. Previously ran his own company in D.C. for five years and worked at Porsche before that.",

        color: "Green. Next question.",

        food: "Owen's a big food guy. He lived in France for a while so he's annoyingly opinionated about bread now. His go-to cooking move is a one-pan situation that somehow turns out well.",

        music: "He plays drums, guitar, and bass. Produced some stuff under 'ohtheshmo.' He's not famous but he's not bad either. That's the most honest thing I'll say in this conversation.",

        fun: "He snowboards, he's into sustainability and geothermal energy (yeah, really), and he's building a timber frame house eventually. Also he's engaged to a French woman which explains the B2 certification and the bread opinions."
    };

    // Response generator
    function generateResponse(msg) {
        const m = msg.toLowerCase();

        if (m.includes('color') || m.includes('colour')) {
            return knowledge.color;
        }
        if (m.includes('food') || m.includes('eat') || m.includes('cook') || m.includes('restaurant')) {
            return knowledge.food;
        }
        if (m.includes('music') || m.includes('drum') || m.includes('guitar') || m.includes('band') || m.includes('play')) {
            return knowledge.music;
        }
        if (m.includes('fun') || m.includes('hobby') || m.includes('hobbies') || m.includes('free time') || m.includes('outside work') || m.includes('personal')) {
            return knowledge.fun;
        }
        if (m.includes('skill') || m.includes('good at') || m.includes('can he do') || m.includes('tech stack')) {
            return knowledge.skills;
        }
        if (m.includes('ai project') || m.includes('gemini') || m.includes('machine learning')) {
            return knowledge.projects;
        }
        if (m.includes('project') || m.includes('portfolio') || m.includes('built') || m.includes('salesforce')) {
            return knowledge.projects;
        }
        if (m.includes('revops') || m.includes('hubspot') || m.includes('sales op') || m.includes('crm') || m.includes('pipeline')) {
            return knowledge.revops;
        }
        if (m.includes('available') || m.includes('start') || m.includes('looking') || m.includes('remote') || m.includes('relocat')) {
            return knowledge.availability;
        }
        if (m.includes('salary') || m.includes('compensation') || m.includes('pay') || m.includes('money') || m.includes('cost')) {
            return knowledge.compensation;
        }
        if (m.includes('contact') || m.includes('email') || m.includes('reach') || m.includes('phone') || m.includes('linkedin')) {
            return knowledge.contact;
        }
        if (m.includes('why') || m.includes('hire') || m.includes('should') || m.includes('pitch')) {
            return knowledge.whyHire;
        }
        if (m.includes('experience') || m.includes('background') || m.includes('education') || m.includes('cert') || m.includes('degree')) {
            return knowledge.background;
        }
        if (m.includes('schedule') || m.includes('call') || m.includes('meet') || m.includes('book') || m.includes('interview')) {
            return "Shoot him an email at **mcmcowen@gmail.com** or hit him up on LinkedIn. He checks both way too often.";
        }
        if (m.includes('hello') || m.includes('hi') || m.includes('hey') || m.includes('sup') || m.includes('yo')) {
            return "Hey! Ask me anything about Owen. His skills, his projects, his favorite color — I'm an open book. Well, his open book.";
        }

        const fallbacks = [
            "Hmm, not sure about that one. Try asking about his **skills**, **projects**, **background**, or honestly just ask what his favorite color is. I've got range.",
            "I'm basically a very enthusiastic FAQ page. Ask me about Owen's **work**, **availability**, **certifications**, or something fun like his **hobbies**. I don't judge.",
            "That's outside my jurisdiction. But I can talk about his **projects**, **experience**, **compensation**, or what he does for **fun**. Your call."
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    // Create widget HTML
    function createWidget() {
        const widget = document.createElement('div');
        widget.id = 'hire-owen-widget';
        widget.innerHTML = `
            <div id="hire-owen-tooltip">👋 Ask me anything about Owen</div>
            <button id="hire-owen-bubble">
                <span id="hire-owen-pulse"></span>
                <svg class="chat-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
                <svg class="close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
            <div id="hire-owen-chat">
                <div id="hire-owen-header">
                    <div id="hire-owen-avatar">👋</div>
                    <div id="hire-owen-header-info">
                        <h4>Owen FAQ Bot</h4>
                        <p><span class="status-dot"></span> Knows too much</p>
                    </div>
                    <button id="hire-owen-expand" onclick="window.open('hire-owen/chat.html', '_blank')" title="Open full chat">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                    </button>
                </div>
                <div id="hire-owen-messages"></div>
                <div id="hire-owen-typing">
                    <div class="hire-owen-msg-avatar" style="background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);">👋</div>
                    <div class="hire-owen-typing-dots">
                        <div class="hire-owen-typing-dot"></div>
                        <div class="hire-owen-typing-dot"></div>
                        <div class="hire-owen-typing-dot"></div>
                    </div>
                </div>
                <div id="hire-owen-quick-actions">
                    <button class="hire-owen-quick-btn" onclick="hireOwenQuick('What\'s his favorite color?')">Favorite color</button>
                    <button class="hire-owen-quick-btn" onclick="hireOwenQuick('What are his skills?')">Skills</button>
                    <button class="hire-owen-quick-btn" onclick="hireOwenQuick('What has he built?')">Projects</button>
                    <button class="hire-owen-quick-btn" onclick="hireOwenQuick('What does he do for fun?')">Fun stuff</button>
                    <button class="hire-owen-quick-btn" onclick="hireOwenQuick('How do I reach him?')">Contact</button>
                </div>
                <div id="hire-owen-input-area">
                    <div id="hire-owen-input-wrapper">
                        <input type="text" id="hire-owen-input" placeholder="Ask about Owen..." onkeypress="if(event.key==='Enter')hireOwenSend()">
                        <button id="hire-owen-send" onclick="hireOwenSend()">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
        return widget;
    }

    // Initialize
    function init() {
        // Add styles
        const styleEl = document.createElement('style');
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);

        // Add widget
        const widget = createWidget();
        document.body.appendChild(widget);

        // Add initial message after small delay
        setTimeout(() => {
            addWidgetMessage('ai', "Hey! I'm basically Owen's hype man but with fewer opinions. Ask me about his work, his projects, or honestly just ask what his favorite color is. I won't judge.");
        }, 1000);

        // Toggle chat
        document.getElementById('hire-owen-bubble').addEventListener('click', () => {
            widget.classList.toggle('open');
            document.getElementById('hire-owen-bubble').classList.toggle('open');
        });
    }

    // Add message to widget
    function addWidgetMessage(type, content) {
        const messages = document.getElementById('hire-owen-messages');
        const msg = document.createElement('div');
        msg.className = `hire-owen-msg ${type}`;
        msg.innerHTML = `
            <div class="hire-owen-msg-avatar">${type === 'ai' ? '👋' : '👤'}</div>
            <div class="hire-owen-msg-content">${content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</div>
        `;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }

    // Global functions
    window.hireOwenSend = function() {
        const input = document.getElementById('hire-owen-input');
        const msg = input.value.trim();
        if (!msg) return;

        addWidgetMessage('user', msg);
        input.value = '';

        // Hide quick actions
        document.getElementById('hire-owen-quick-actions').style.display = 'none';

        // Show typing
        document.getElementById('hire-owen-typing').classList.add('active');

        setTimeout(() => {
            document.getElementById('hire-owen-typing').classList.remove('active');
            addWidgetMessage('ai', generateResponse(msg));
        }, 800 + Math.random() * 700);
    };

    window.hireOwenQuick = function(msg) {
        document.getElementById('hire-owen-input').value = msg;
        window.hireOwenSend();
    };

    // Init on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
