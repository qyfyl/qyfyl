// 智能招生咨询系统 - JavaScript模块

// 等待配置加载完成
document.addEventListener('DOMContentLoaded', function() {
  // 检查配置是否已加载
  if (!window.appConfig) {
    console.error('配置文件未加载，请确保在app.js之前加载config.js');
    return;
  }

  // 知识库定义
  const knowledgeBase = `
  ${window.appConfig.school.name}招生知识库：
  1. 领取录取通知书时间：8月底时间暂定。
  2. 志愿填报流程：见链接${window.appConfig.school.wechatArticle}。
  3. 分班考试时间：8月27日8:30-10:30，语数英三科。
  4. 分班考号查询：分班当天在公众号里面扫码查询。
  5. 生活费等费用咨询：1800元左右，以具体通知为准。
  6. 学校地址：${window.appConfig.school.address}
  7. 招生电话：${window.appConfig.school.phone}
  8. 学校官网：${window.appConfig.school.website}
  `;

  // 常见问题及回答
  const faqAnswers = {
    "领取录取通知书时间": "8月底时间暂定；",
    "志愿填报流程": `见链接<a href='${window.appConfig.school.wechatArticle}' target='_blank' class='text-primary hover:underline'>${window.appConfig.school.wechatArticle}</a>；`,
    "分班考试时间": "8月27日8:30-10:30，语数英三科；",
    "分班考号查询": "分班当天在公众号里面扫码查询；",
    "生活费等费用咨询": "1800元左右，以具体通知为准；"
  };

  // 其他问题回答
  const defaultAnswers = [
    "感谢您的提问，我们会尽快核实相关信息并回复您。",
    `您的问题非常重要，建议您拨打招生咨询电话${window.appConfig.school.phone}获取更准确的信息。`,
    "关于这个问题，我们的招生老师会给您详细解答，请您耐心等待。",
    "您可以关注我们学校的微信公众号，获取最新的招生动态和信息。"
  ];

  // DOM元素缓存
  const dom = {
    chatContainer: document.getElementById('chat-container'),
    userInput: document.getElementById('user-input'),
    sendBtn: document.getElementById('send-btn'),
    wechatModal: document.getElementById('wechat-modal'),
    showWechatBtn: document.getElementById('show-wechat'),
    closeWechatBtn: document.getElementById('close-wechat')
  };

  // 初始化函数
  function init() {
    // 绑定事件处理程序
    bindEvents();
  }

  // 绑定事件处理程序
  function bindEvents() {
    // 发送按钮点击事件
    dom.sendBtn.addEventListener('click', handleUserInput);

    // 回车键发送消息
    dom.userInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleUserInput();
      }
    });

    // 显示/隐藏微信二维码
    dom.showWechatBtn.addEventListener('click', () => {
      dom.wechatModal.style.display = 'flex';
    });

    dom.closeWechatBtn.addEventListener('click', () => {
      dom.wechatModal.style.display = 'none';
    });

    // 点击模态框外部关闭
    dom.wechatModal.addEventListener('click', (e) => {
      if (e.target === dom.wechatModal) {
        dom.wechatModal.style.display = 'none';
      }
    });

    // 使用事件委托优化FAQ按钮事件监听
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('faq-btn')) {
        const question = e.target.getAttribute('data-question');
        dom.userInput.value = question;
        handleUserInput();
      }
    });

    // 导航栏滚动效果
    window.addEventListener('scroll', () => {
      const header = document.querySelector('header');
      if (window.scrollY > 10) {
        header.classList.add('py-2');
        header.classList.remove('py-4');
      } else {
        header.classList.add('py-4');
        header.classList.remove('py-2');
      }
    });
  }

  // 添加消息到聊天窗口
  function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex items-start mb-4 animate-slide-up ${isUser ? 'justify-end' : ''}`;

    if (isUser) {
      messageDiv.innerHTML = `
        <div class="bg-primary text-white p-4 rounded-lg rounded-tr-none shadow-sm max-w-[80%]">
          <p>${text}</p>
        </div>
        <div class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center ml-3 flex-shrink-0">
          <i class="fa fa-user text-gray-600"></i>
        </div>
      `;
    } else {
      messageDiv.innerHTML = `
        <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-3 flex-shrink-0">
          <i class="fa fa-robot text-white"></i>
        </div>
        <div class="bg-white p-4 rounded-lg rounded-tl-none shadow-sm max-w-[80%]">
          <p>${text}</p>
        </div>
      `;
    }

    dom.chatContainer.appendChild(messageDiv);
    // 使用requestAnimationFrame优化滚动性能
    requestAnimationFrame(() => {
      dom.chatContainer.scrollTop = dom.chatContainer.scrollHeight;
    });
  }

  // 获取随机默认回答
  function getRandomDefaultAnswer() {
    const randomIndex = Math.floor(Math.random() * defaultAnswers.length);
    return defaultAnswers[randomIndex];
  }

  // 从本地知识库获取回答
  function getAnswerFromKnowledgeBase(question) {
    // 简单关键词匹配实现
    const lowerQuestion = question.toLowerCase();
    
    // 先检查知识库全文
    if (knowledgeBase.toLowerCase().includes(lowerQuestion)) {
      // 提取知识库中相关段落
      const lines = knowledgeBase.split('\n');
      for (let line of lines) {
        if (line.toLowerCase().includes(lowerQuestion)) {
          return line.replace(/^\s*\d+\.\s*/, '').trim() + '；';
        }
      }
    }

    // 关键词未匹配时的常见问题查找
    if (lowerQuestion.includes('录取通知书')) return '8月底时间暂定；';
    if (lowerQuestion.includes('志愿填报')) return `见链接<a href="${window.appConfig.school.wechatArticle}" target="_blank" class="text-primary hover:underline">${window.appConfig.school.wechatArticle}</a>；`;
    if (lowerQuestion.includes('分班考试')) return '8月27日8:30-10:30，语数英三科；';
    if (lowerQuestion.includes('考号查询')) return '分班当天在公众号里面扫码查询；';
    if (lowerQuestion.includes('费用')) return '1800元左右，以具体通知为准；';
    return null;
  }

  // 处理用户输入
  function handleUserInput() {
    const userText = dom.userInput.value.trim();
    if (!userText) return;

    // 添加用户消息
    addMessage(userText, true);

    // 清空输入框
    dom.userInput.value = '';

    // 显示"正在输入"状态
    const typingDiv = document.createElement('div');
    typingDiv.className = 'flex items-start mb-4 animate-slide-up';
    typingDiv.innerHTML = `
      <div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-3 flex-shrink-0">
        <i class="fa fa-robot text-white"></i>
      </div>
      <div class="bg-white p-4 rounded-lg rounded-tl-none shadow-sm max-w-[80%]">
        <div class="flex space-x-1">
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.2s"></div>
          <div class="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
        </div>
      </div>
    `;

    dom.chatContainer.appendChild(typingDiv);
    dom.chatContainer.scrollTop = dom.chatContainer.scrollHeight;

    // 调用AI API获取回答
    // 设置fetch超时
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), window.appConfig.ai.timeout);

    fetch(window.appConfig.ai.apiBaseUrl, {
      signal: controller.signal,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + window.appConfig.ai.apiKey
      },
      body: JSON.stringify({
        model: window.appConfig.ai.model, // 使用配置中的模型名称
        messages: [
          {
            role: 'system',
            content: [
              {
                text: `你是${window.appConfig.school.name}的智能小七助手。使用以下知识库回答招生相关问题，若知识库中没有相关信息，可礼貌告知无法回答并建议联系招生办公室。知识库内容：${knowledgeBase}`,
                type: 'text'
              }
            ]
          },
          {
            role: 'user',
            content: [
              {
                text: userText,
                type: 'text'
              }
            ]
          }
        ]
      })
    })
    .then(response => {
      clearTimeout(timeoutId); // 清除超时计时器
      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      // 移除"正在输入"状态
      typingDiv.remove();
      const answer = data.choices[0].message.content;
      // 添加AI回答
      addMessage(answer.replace(/\n/g, '<br>'));
    })
    .catch(error => {
      console.error('AI API调用错误:', error);
      // 移除"正在输入"状态
      typingDiv.remove();
      // API调用失败时使用本地知识库回答
      let answer = getAnswerFromKnowledgeBase(userText);
      addMessage(answer || '抱歉，暂时无法获取回答，请稍后再试或联系招生办公室。');
    });
  }

  // 初始化应用
  init();
});