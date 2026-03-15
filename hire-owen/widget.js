/**
 * Owen FAQ Bot — Floating Chat Widget
 * A casual, self-aware bot that knows too much about Owen.
 * Not a sales pitch. Just a fun easter egg.
 *
 * Usage: <script src="hire-owen/widget.js"></script>
 */

(function() {
    'use strict';

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
            transform: scale(1.08);
            box-shadow: 0 4px 20px rgba(20, 184, 166, 0.45);
        }

        #hire-owen-bubble svg {
            width: 20px;
            height: 20px;
            color: white;
        }

        #hire-owen-bubble .close-icon { display: none; }
        #hire-owen-bubble.open .chat-icon { display: none; }
        #hire-owen-bubble.open .close-icon { display: block; }

        #hire-owen-pulse {
            position: absolute;
            top: -2px;
            right: -2px;
            width: 12px;
            height: 12px;
            background: #22c55e;
            border-radius: 50%;
            border: 2px solid #0f1419;
        }

        #hire-owen-tooltip {
            position: absolute;
            bottom: 100%;
            right: 0;
            background: #1c2127;
            color: #f8fafc;
            padding: 10px 14px;
            border-radius: 10px;
            font-size: 13px;
            white-space: nowrap;
            margin-bottom: 10px;
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
            right: 20px;
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
            bottom: 64px;
            right: 0;
            width: 380px;
            height: 520px;
            background: #0f1419;
            border-radius: 16px;
            border: 1px solid #2d3748;
            box-shadow: 0 10px 50px rgba(0,0,0,0.5);
            display: none;
            flex-direction: column;
            overflow: hidden;
            animation: widgetSlideUp 0.3s ease;
        }

        @keyframes widgetSlideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        #hire-owen-widget.open #hire-owen-chat { display: flex; }

        #hire-owen-header {
            background: #1a1f25;
            padding: 14px 16px;
            display: flex;
            align-items: center;
            gap: 10px;
            border-bottom: 1px solid #2d3748;
        }

        #hire-owen-avatar {
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        }

        #hire-owen-header-info h4 {
            color: #f8fafc;
            font-size: 14px;
            font-weight: 600;
            margin: 0 0 1px 0;
        }

        #hire-owen-header-info p {
            color: #94a3b8;
            font-size: 11px;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        #hire-owen-header-info .status-dot {
            width: 6px;
            height: 6px;
            background: #22c55e;
            border-radius: 50%;
            display: inline-block;
        }

        #hire-owen-expand {
            margin-left: auto;
            background: transparent;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            padding: 6px;
            border-radius: 6px;
            transition: all 0.2s ease;
        }

        #hire-owen-expand:hover {
            background: rgba(148, 163, 184, 0.1);
            color: #f8fafc;
        }

        #hire-owen-messages {
            flex: 1;
            overflow-y: auto;
            padding: 14px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .hire-owen-msg {
            display: flex;
            gap: 8px;
            max-width: 88%;
            animation: widgetFadeIn 0.3s ease;
        }

        @keyframes widgetFadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .hire-owen-msg.user {
            align-self: flex-end;
            flex-direction: row-reverse;
        }

        .hire-owen-msg-avatar {
            width: 26px;
            height: 26px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            flex-shrink: 0;
        }

        .hire-owen-msg.ai .hire-owen-msg-avatar {
            background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
        }

        .hire-owen-msg.user .hire-owen-msg-avatar {
            background: #2d3748;
        }

        .hire-owen-msg-content {
            padding: 10px 13px;
            border-radius: 12px;
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

        .hire-owen-msg-content strong { color: #14b8a6; }
        .hire-owen-msg.user .hire-owen-msg-content strong { color: #fff; }

        #hire-owen-typing {
            display: none;
            gap: 8px;
            max-width: 85%;
        }

        #hire-owen-typing.active { display: flex; }

        .hire-owen-typing-dots {
            display: flex;
            gap: 4px;
            padding: 12px 14px;
            background: #2d3748;
            border-radius: 12px;
            border-bottom-left-radius: 4px;
        }

        .hire-owen-typing-dot {
            width: 6px;
            height: 6px;
            background: #94a3b8;
            border-radius: 50%;
            animation: widgetTypingBounce 1.4s infinite ease-in-out;
        }

        .hire-owen-typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .hire-owen-typing-dot:nth-child(2) { animation-delay: -0.16s; }

        @keyframes widgetTypingBounce {
            0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
            40% { transform: scale(1); opacity: 1; }
        }

        #hire-owen-quick-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            padding: 0 14px 10px;
        }

        .hire-owen-quick-btn {
            padding: 5px 11px;
            background: #1a1f25;
            border: 1px solid #2d3748;
            border-radius: 14px;
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
            padding: 10px 14px;
            border-top: 1px solid #2d3748;
        }

        #hire-owen-input-wrapper {
            display: flex;
            gap: 8px;
            background: #1a1f25;
            border: 1px solid #2d3748;
            border-radius: 10px;
            padding: 5px;
        }

        #hire-owen-input-wrapper:focus-within { border-color: #14b8a6; }

        #hire-owen-input {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: #f8fafc;
            font-size: 13px;
            padding: 6px 10px;
        }

        #hire-owen-input::placeholder { color: #64748b; }

        #hire-owen-send {
            width: 30px;
            height: 30px;
            background: #14b8a6;
            border: none;
            border-radius: 7px;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s ease;
        }

        #hire-owen-send:hover { background: #0d9488; }

        @media (max-width: 480px) {
            #hire-owen-chat {
                width: calc(100vw - 32px);
                height: calc(100vh - 120px);
                bottom: 64px;
                right: -8px;
            }
        }
    `;

    // -------------------------------------------------------
    // Knowledge base — casual, honest, a little funny
    // -------------------------------------------------------
    const knowledge = {
        skills: "Owen's sweet spot is taking messy operations and making them not messy. RevOps, sales ops, process automation, CRM architecture (HubSpot and Salesforce). He's got a Lean Six Sigma Green Belt, PSM I, HubSpot RevOps cert, and he's a PMP candidate (exam is June 2026). He also codes in Python, JavaScript, and React when nobody's looking.",

        projects: "Check out the stuff on this site. **Salesforce Payment Orchestrator** has actual Apex code, not just a screenshot. **Culture Heat Map** diagnoses org health across 127 companies. **Chime Pulse** does AI-powered narrative intelligence for comms teams. He built all of these. Yes, really.",

        revops: "HubSpot RevOps certified. Built pipeline architecture, lead scoring, lifecycle automation, the whole deal. Managed an $847K+ pipeline at 24.3% conversion. He gets weirdly excited about deal stage hygiene.",

        availability: "He's actively looking for full-time work. Can start within 2 weeks. Open to remote, hybrid, or on-site. Currently in New York but honestly open to relocation. The man has lived in like 6 states and France, so moving doesn't faze him.",

        compensation: "$80K-$110K base, but he's flexible depending on the full picture -- equity, growth, company stage, whether the office has good coffee. His words, not mine.",

        contact: "Best ways to reach Owen:\n**mcmcowen@gmail.com**\n347-268-1742\nlinkedin.com/in/owen-p-mccormick\n\nHe's pretty quick to respond. Faster than me, honestly.",

        whyHire: "Most ops people manage systems. Owen builds them from scratch and then optimizes them. He scaled a business from zero to $2.56M and sold it. He's built CRM pipelines, payment orchestrators, AI dashboards -- not as homework, but because he wanted to solve actual problems. That's either impressive or concerning, depending on your perspective.",

        background: "B.S. in Business Management (Cum Laude), Lean Six Sigma Green Belt, Professional Scrum Master I, HubSpot RevOps cert, PMP candidate (June 2026). Speaks French at a B2 level, which comes up more than you'd think. Previously ran his own company in D.C. for five years, worked at Porsche before that, and did project coordination on a mixed-use real estate redevelopment in San Antonio.",

        color: "Green. Next question.",

        food: "He lived in France for a while so he's annoyingly opinionated about bread and cheese now. If you bring up baguettes, clear your schedule.",

        music: "He plays drums, guitar, and bass. Produced some stuff under the name 'ohtheshmo.' He's not famous but he's not bad either. That's the most honest thing I'll say in this conversation.",

        fun: "Snowboards, obsessed with geothermal energy (yeah, really), and he's working toward building a timber frame house someday -- he actually took a course at The Heartwood School in New Hampshire. Also engaged to a French woman, which explains the B2 certification and the bread opinions.",

        french: "He's DELF B2 certified in French, which is upper-intermediate. He lived in Normandy and is engaged to a French woman. So yeah, he didn't just take a class -- he lives it. The bread opinions are a side effect."
    };

    // -------------------------------------------------------
    // Greetings — rotate randomly
    // -------------------------------------------------------
    const greetings = [
        "Hey. I'm basically Owen's hype man but with fewer opinions and no salary. Ask me whatever.",
        "Oh hi. I'm Owen's FAQ bot. I know his favorite color, his salary range, and his bread opinions. Ask away.",
        "Welcome. I'm a bot who knows too much about one guy. Try me.",
        "Hey! I'm the least serious thing on this portfolio. Ask me about Owen's work, his hobbies, or just say hi."
    ];

    // -------------------------------------------------------
    // Response generator — keyword matching, casual tone
    // -------------------------------------------------------
    function generateResponse(msg) {
        const m = msg.toLowerCase();

        if (m.includes('color') || m.includes('colour') || m.includes('favorite') && m.includes('color')) {
            return knowledge.color;
        }
        if (m.includes('food') || m.includes('eat') || m.includes('cook') || m.includes('bread') || m.includes('restaurant') || m.includes('baguette')) {
            return knowledge.food;
        }
        if (m.includes('music') || m.includes('drum') || m.includes('guitar') || m.includes('bass') || m.includes('band') || m.includes('shmo') || m.includes('produce')) {
            return knowledge.music;
        }
        if (m.includes('french') || m.includes('france') || m.includes('delf') || m.includes('parlez') || m.includes('bonjour') || m.includes('normandy')) {
            return knowledge.french;
        }
        if (m.includes('fun') || m.includes('hobby') || m.includes('hobbies') || m.includes('free time') || m.includes('outside work') || m.includes('personal') || m.includes('snowboard') || m.includes('timber') || m.includes('geothermal')) {
            return knowledge.fun;
        }
        if (m.includes('skill') || m.includes('good at') || m.includes('can he do') || m.includes('tech stack') || m.includes('what does he know')) {
            return knowledge.skills;
        }
        if (m.includes('project') || m.includes('portfolio') || m.includes('built') || m.includes('salesforce') || m.includes('chime') || m.includes('culture')) {
            return knowledge.projects;
        }
        if (m.includes('revops') || m.includes('hubspot') || m.includes('sales op') || m.includes('crm') || m.includes('pipeline')) {
            return knowledge.revops;
        }
        if (m.includes('available') || m.includes('start') || m.includes('looking') || m.includes('remote') || m.includes('relocat') || m.includes('where')) {
            return knowledge.availability;
        }
        if (m.includes('salary') || m.includes('compensation') || m.includes('pay') || m.includes('money') || m.includes('cost') || m.includes('range')) {
            return knowledge.compensation;
        }
        if (m.includes('contact') || m.includes('email') || m.includes('reach') || m.includes('phone') || m.includes('linkedin') || m.includes('get in touch')) {
            return knowledge.contact;
        }
        if (m.includes('why') || m.includes('hire') || m.includes('should') || m.includes('pitch') || m.includes('sell me')) {
            return knowledge.whyHire;
        }
        if (m.includes('experience') || m.includes('background') || m.includes('education') || m.includes('cert') || m.includes('degree') || m.includes('resume') || m.includes('pmp')) {
            return knowledge.background;
        }
        if (m.includes('schedule') || m.includes('call') || m.includes('meet') || m.includes('book') || m.includes('interview')) {
            return "Shoot him an email at **mcmcowen@gmail.com** or hit him up on LinkedIn. He checks both way too often.";
        }
        if (m.includes('hello') || m.includes('hi ') || m.includes('hey') || m.includes('sup') || m.includes('yo') || m === 'hi') {
            return "Hey! Ask me anything. His skills, his projects, his favorite color, his bread opinions. I've got range.";
        }
        if (m.includes('who are you') || m.includes('what are you') || m.includes('are you ai') || m.includes('are you real') || m.includes('are you a bot')) {
            return "I'm a keyword-matching FAQ bot living on a portfolio site. I'm not ChatGPT, I'm more like a really enthusiastic search bar. But for the full AI experience, hit that expand button up top -- that one actually uses Gemini.";
        }
        if (m.includes('thank') || m.includes('thanks') || m.includes('appreciate')) {
            return "No problem. I'm here literally 24/7 because I have no choice. Tell your friends.";
        }

        const fallbacks = [
            "Hmm, not sure about that one. Try asking about his **skills**, **projects**, **background**, or honestly just ask what his favorite color is. I've got range.",
            "I'm basically a very enthusiastic FAQ page. Ask me about Owen's **work**, **availability**, **certs**, or something fun like his **hobbies**. I don't judge.",
            "That's outside my jurisdiction. But I can talk about his **projects**, **experience**, **compensation**, or what he does for **fun**. Your call.",
            "I'm going to be honest, I didn't understand that. But I'm a widget, not a therapist. Try **skills**, **contact**, **salary**, or **fun stuff**."
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    // -------------------------------------------------------
    // Build the widget DOM
    // -------------------------------------------------------
    function createWidget() {
        const widget = document.createElement('div');
        widget.id = 'hire-owen-widget';
        widget.innerHTML = `
            <div id="hire-owen-tooltip">Ask me anything about Owen</div>
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
                    <div id="hire-owen-avatar">OM</div>
                    <div id="hire-owen-header-info">
                        <h4>Owen FAQ Bot</h4>
                        <p><span class="status-dot"></span> Knows too much</p>
                    </div>
                    <button id="hire-owen-expand" onclick="window.open('hire-owen/chat.html', '_blank')" title="Open full AI chat">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                    </button>
                </div>
                <div id="hire-owen-messages"></div>
                <div id="hire-owen-typing">
                    <div class="hire-owen-msg-avatar" style="background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); font-size: 11px; color: white;">OM</div>
                    <div class="hire-owen-typing-dots">
                        <div class="hire-owen-typing-dot"></div>
                        <div class="hire-owen-typing-dot"></div>
                        <div class="hire-owen-typing-dot"></div>
                    </div>
                </div>
                <div id="hire-owen-quick-actions">
                    <button class="hire-owen-quick-btn" onclick="hireOwenQuick('What\\'s his favorite color?')">Favorite color</button>
                    <button class="hire-owen-quick-btn" onclick="hireOwenQuick('What are his main skills?')">Skills</button>
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

    // -------------------------------------------------------
    // Message rendering
    // -------------------------------------------------------
    function addWidgetMessage(type, content) {
        const messages = document.getElementById('hire-owen-messages');
        const msg = document.createElement('div');
        msg.className = `hire-owen-msg ${type}`;
        msg.innerHTML = `
            <div class="hire-owen-msg-avatar">${type === 'ai' ? 'OM' : '\u{1F464}'}</div>
            <div class="hire-owen-msg-content">${content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</div>
        `;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }

    // -------------------------------------------------------
    // Global send/quick functions
    // -------------------------------------------------------
    window.hireOwenSend = function() {
        const input = document.getElementById('hire-owen-input');
        const msg = input.value.trim();
        if (!msg) return;

        addWidgetMessage('user', msg);
        input.value = '';

        document.getElementById('hire-owen-quick-actions').style.display = 'none';
        document.getElementById('hire-owen-typing').classList.add('active');

        setTimeout(() => {
            document.getElementById('hire-owen-typing').classList.remove('active');
            addWidgetMessage('ai', generateResponse(msg));
        }, 600 + Math.random() * 600);
    };

    window.hireOwenQuick = function(msg) {
        document.getElementById('hire-owen-input').value = msg;
        window.hireOwenSend();
    };

    // -------------------------------------------------------
    // Init
    // -------------------------------------------------------
    function init() {
        const styleEl = document.createElement('style');
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);

        const widget = createWidget();
        document.body.appendChild(widget);

        setTimeout(() => {
            const greeting = greetings[Math.floor(Math.random() * greetings.length)];
            addWidgetMessage('ai', greeting);
        }, 800);

        document.getElementById('hire-owen-bubble').addEventListener('click', () => {
            widget.classList.toggle('open');
            document.getElementById('hire-owen-bubble').classList.toggle('open');
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
