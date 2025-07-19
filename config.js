// 配置文件 - 请妥善保管此文件，不要提交到代码仓库

// AI服务配置
window.appConfig = {
  // 豆包API配置
  ai: {
    apiKey: '138fe2aa-31fa-4255-9276-8548d138e121', // 豆包API密钥
    apiBaseUrl: 'https://api.302.ai/v1/chat/completions', // 豆包API官方端点
    model: 'doubao-1.5-pro-32k', // 使用的模型名称
    timeout: 5000 // API请求超时时间（毫秒）
  },
  
  // 学校信息
  school: {
    name: '祁阳市第七中学',
    address: '祁阳市XX路XX号',
    phone: '17873943784',
    website: 'https://www.qiyang7z.com',
    wechatArticle: 'https://mp.weixin.qq.com/s/C_RKEnup_QpCVFYiw6z7rg' // 志愿填报流程文章
  }
};

// 安全提示
console.log('警告: 包含敏感配置信息的文件。请勿在生产环境中直接使用此文件，建议通过后端服务获取配置。');