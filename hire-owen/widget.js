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
            width: 64px;
            height: 64px;
            border-radius: 50%;
            background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 20px rgba(20, 184, 166, 0.4);
            transition: all 0.3s ease;
            position: relative;
        }

        #hire-owen-bubble:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 30px rgba(20, 184, 166, 0.5);
        }

        #hire-owen-bubble svg {
            width: 28px;
            height: 28px;
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
            top: -4px;
            right: -4px;
            width: 16px;
            height: 16px;
            background: #22c55e;
            border-radius: 50%;
            border: 3px solid #0f1419;
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

    // Knowledge base (condensed version for widget)
    const knowledge = {
        skills: "Owen's core skills include RevOps & Sales Operations, Process Automation (Python, JavaScript), AI/ML Integration (Gemini API), Data Analytics & Visualization, CRM Management (HubSpot, Salesforce), and Project Management. He's Lean Six Sigma and Scrum Master certified.",

        projects: "Owen has built several impressive projects: **Chime Pulse** (AI narrative intelligence dashboard), **Brandify AI** (AI brand identity generator), **SpinnerEvolve** (evolutionary animation generator), **Culture Heat Map** (organizational diagnostics), and a **Personal Ops Dashboard** running on Raspberry Pi.",

        aiProjects: "Owen's AI projects showcase his technical abilities:\n\n• **Chime Pulse** - Real-time sentiment tracking and AI analyst chat\n• **Brandify AI** - Generate complete brand identities from a mission statement\n• **SpinnerEvolve** - A/B test AI-generated animations\n\nAll built with React, TypeScript, and Gemini API. Live demos are on his portfolio!",

        revops: "Owen is HubSpot RevOps certified with experience managing $847K+ pipelines at 24.3% conversion rates. He specializes in CRM optimization, process automation, and cross-functional alignment between sales, marketing, and CS teams.",

        availability: "Owen is actively looking for full-time opportunities. He can start immediately or within 2 weeks, and is open to remote, hybrid, or on-site roles in Brooklyn NY, San Antonio TX, or anywhere remote-friendly.",

        compensation: "Owen's target range is $80,000 - $110,000, but he's flexible based on total comp, equity, growth opportunity, and company stage. He says he's more interested in the right fit than maximizing salary.",

        contact: "You can reach Owen at:\n• Email: mcmcowen@gmail.com\n• Phone: 347-268-1742\n• LinkedIn: linkedin.com/in/owenpmccormick\n\nOr click 'Schedule a call' to book time with him directly!",

        whyHire: "Owen isn't just an operator—he's a builder. While most ops people manage existing systems, Owen builds new ones. His portfolio isn't case studies from past jobs—it's tools he built himself. He brings a 'what can I automate?' mindset to everything.",

        background: "Owen has a B.S. in Business, plus Lean Six Sigma, Scrum Master, and HubSpot RevOps certifications. He specializes in helping international startups scale operations in the US market."
    };

    // Response generator
    function generateResponse(msg) {
        const m = msg.toLowerCase();

        if (m.includes('skill') || m.includes('good at') || m.includes('can he do')) {
            return knowledge.skills;
        }
        if (m.includes('ai project') || m.includes('gemini') || m.includes('machine learning')) {
            return knowledge.aiProjects;
        }
        if (m.includes('project') || m.includes('portfolio') || m.includes('built')) {
            return knowledge.projects;
        }
        if (m.includes('revops') || m.includes('hubspot') || m.includes('sales op') || m.includes('crm')) {
            return knowledge.revops;
        }
        if (m.includes('available') || m.includes('start') || m.includes('looking') || m.includes('remote')) {
            return knowledge.availability;
        }
        if (m.includes('salary') || m.includes('compensation') || m.includes('pay') || m.includes('money')) {
            return knowledge.compensation;
        }
        if (m.includes('contact') || m.includes('email') || m.includes('reach') || m.includes('phone')) {
            return knowledge.contact;
        }
        if (m.includes('why') || m.includes('hire') || m.includes('should')) {
            return knowledge.whyHire;
        }
        if (m.includes('experience') || m.includes('background') || m.includes('education')) {
            return knowledge.background;
        }
        if (m.includes('schedule') || m.includes('call') || m.includes('meet') || m.includes('book')) {
            return "I'd love to set that up! Click the button below or visit **omccormick.com/hire-owen/chat.html** for the full booking form. Owen typically responds within 24 hours.";
        }

        return "Great question! I can tell you about Owen's **skills**, **AI projects**, **RevOps experience**, **availability**, or **compensation expectations**. Or ask me anything specific—I know everything about him! 😄";
    }

    // Create widget HTML
    function createWidget() {
        const widget = document.createElement('div');
        widget.id = 'hire-owen-widget';
        widget.innerHTML = `
            <div id="hire-owen-tooltip">💬 Chat with Owen's AI Agent</div>
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
                    <div id="hire-owen-avatar">🤖</div>
                    <div id="hire-owen-header-info">
                        <h4>Owen's AI Agent</h4>
                        <p><span class="status-dot"></span> Online</p>
                    </div>
                    <button id="hire-owen-expand" onclick="window.open('hire-owen/chat.html', '_blank')" title="Open full chat">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                    </button>
                </div>
                <div id="hire-owen-messages"></div>
                <div id="hire-owen-typing">
                    <div class="hire-owen-msg-avatar" style="background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);">🤖</div>
                    <div class="hire-owen-typing-dots">
                        <div class="hire-owen-typing-dot"></div>
                        <div class="hire-owen-typing-dot"></div>
                        <div class="hire-owen-typing-dot"></div>
                    </div>
                </div>
                <div id="hire-owen-quick-actions">
                    <button class="hire-owen-quick-btn" onclick="hireOwenQuick('What are his main skills?')">Skills</button>
                    <button class="hire-owen-quick-btn" onclick="hireOwenQuick('Tell me about his AI projects')">AI Projects</button>
                    <button class="hire-owen-quick-btn" onclick="hireOwenQuick('Is he available?')">Availability</button>
                    <button class="hire-owen-quick-btn" onclick="hireOwenQuick('What salary is he looking for?')">Compensation</button>
                    <button class="hire-owen-quick-btn" onclick="window.open('hire-owen/chat.html', '_blank')">Schedule call</button>
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
            addWidgetMessage('ai', "Hey! 👋 I'm Owen's AI agent. Ask me anything about his skills, projects, or availability—I'm here to help!");
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
            <div class="hire-owen-msg-avatar">${type === 'ai' ? '🤖' : '👤'}</div>
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
