import Mock from 'mockjs'

// 注册
const USERS_KEY = 'users'
// 从本地存储中加载注册数据
const users: { username: string; password: string }[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')

Mock.mock('/register', 'post', (options: any) => {
  const body = JSON.parse(options.body)
  const { username, password } = body
  const user = users.find((item) => item.username === username)
  if (user) {
    const response = {
      code: 201,
      message: '该用户名已被注册'
    }
    return response
  } else {
    users.push({ username, password })
    // 将注册数据保存到本地存储中
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    const response = {
      code: 200,
      message: '注册成功'
    }
    return response
  }
})

// 登录
Mock.mock('/login', 'post', (options: any) => {
  const body = JSON.parse(options.body)
  const { username, password } = body
  const user = users.find((item) => item.username === username && item.password === password)
  if (user) {
    const response = {
      code: 200,
      message: '登录成功',
      data: {
        token: 'shkmzzhisveryhandsomeloveqq'
      }
    }
    return response
  } else {
    const response = {
      code: 201,
      message: '用户名或密码错误',
      data: null
    }
    return response
  }
})

// 菜单
Mock.mock('/test', 'get', {
  code: 200,
  message: '操作成功',
  data: [
    {
      path: '/item',
      component: 'Layout',
      name: 'itemMessage',
      meta: {
        title: '物品管理',
        icon: 'menu',
        roles: ['ITEM_INFO','ITEM_RELATIONSHIPS'],
        hidden: false,
        keepAlive: true
      },
      children: [
        {
          path: 'item-info',
          name: 'item-info',
          component: 'itemMessage/message',
          meta: {  title: '物品信息', icon: '', hidden: false, keepAlive: true, roles: ['ITEM_INFO']  }
        },
        {
          path: 'relationships',
          name: 'relationships',
          component: 'itemMessage/relationships',
          meta: {  title: '层级关系', icon: '', hidden: false, keepAlive: true, roles: ['ITEM_RELATIONSHIPS']  }
        }
      ]
    },
    {
      path: '/user',
      component: 'Layout',
      name: 'userMessage',
      meta: {
        title: '用户管理',
        icon: 'user',
        roles: ['USER_INFO','USER_BLACKLIST'],
        hidden: false,
        keepAlive: true
      },
      children: [
        {
          path: 'user-info',
          name: 'user-info',
          component: 'userMessage/userMessage',
          meta: {  title: '用户信息', icon: '', hidden: false, keepAlive: true, roles: ['USER_INFO']  }
        },
        {
          path: 'blacklist',
          name: 'blacklist',
          component: 'userMessage/blacklist',
          meta: {  title: '用户黑名单', icon: '', hidden: false, keepAlive: true, roles: ['USER_BLACKLIST']  }
        }
      ]
    },
    {
      path: '/acl',
      component: 'Layout',
      name: 'acl',
      meta: {
        title: '权限管理',
        icon: 'acl',
        roles: ['ADMIN_INFO','ADMIN_MANAGEMENT'],
        hidden: false,
        keepAlive: true
      },
      children: [
        {
          path: 'admin-info',
          name: 'admin-info',
          component: 'acl/adminMessage',
          meta: {  title: '管理员信息', icon: '', hidden: false, keepAlive: true, roles: ['ADMIN_INFO']  }
        },
        {
          path: 'management',
          name: 'management',
          component: 'acl/powerManagement',
          meta: {  title: '权限分配', icon: '', hidden: false, keepAlive: true, roles: ['ADMIN_MANAGEMENT']  }
        }
      ]
    },
    {
      path: '/system',
      component: 'Layout',
      name: 'system',
      meta: {
        title: '系统通知',
        icon: 'message',
        roles: ['SYSTEM_DELIVER','SYSTEM_DELIVER'],
        hidden: false,
        keepAlive: true
      },
      children: [
        {
          path: 'deliver-info',
          name: 'deliver-info',
          component: 'systemMessage/deliverMessage',
          meta: {  title: '发布通知', icon: '', hidden: false, keepAlive: true, roles: ['SYSTEM_DELIVER']  }
        },
        {
          path: 'view-info',
          name: 'view-info',
          component: 'systemMessage/viewMessage',
          meta: {  title: '所有通知', icon: '', hidden: false, keepAlive: true, roles: ['SYSTEM_DELIVER']  }
        }
      ]
    },
    {
      path: '/feedback',
      component: 'Layout',
      name: 'feedback',
      meta: {
        title: '用户反馈',
        roles: ['FEEDBACK'],
        hidden: false,
        keepAlive: true
      },
      children: [
        {
          path: '',
          component: 'feedback/feedback',
          meta: {  title: '用户反馈', icon: 'feedback', hidden: false, keepAlive: true, roles: ['FEEDBACK']  }
        },
      ]
    },
  ]
})
