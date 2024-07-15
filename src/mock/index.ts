import Mock from 'mockjs'

// 注册
const USERS_KEY = 'users'
// 从本地存储中加载注册数据
const users: { username: string; password: string }[] = JSON.parse(
  localStorage.getItem(USERS_KEY) || '[]'
)

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
        roles: ['ITEM'],
        hidden: false,
        keepAlive: true
      },
      children: [
        {
          path: 'item-info',
          name: 'item-info',
          component: 'itemMessage/message',
          meta: { title: '物品信息', icon: '', hidden: false, keepAlive: true, roles: ['ITEM'] }
        },
        {
          path: 'relationships',
          name: 'relationships',
          component: 'itemMessage/relationships',
          meta: { title: '层级关系', icon: '', hidden: false, keepAlive: true, roles: ['ITEM'] }
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
        roles: ['USER'],
        hidden: false,
        keepAlive: true
      },
      children: [
        {
          path: 'user-info',
          name: 'user-info',
          component: 'userMessage/userMessage',
          meta: { title: '用户信息', icon: '', hidden: false, keepAlive: true, roles: ['USER'] }
        },
        {
          path: 'blacklist',
          name: 'blacklist',
          component: 'userMessage/blacklist',
          meta: { title: '用户黑名单', icon: '', hidden: false, keepAlive: true, roles: ['USER'] }
        }
      ]
    },
    {
      path: '/acl',
      component: 'Layout',
      name: 'acl',
      meta: {
        roles: ['ROOT'],
        hidden: false,
        keepAlive: true
      },
      children: [
        {
          path: '',
          name: 'management',
          component: 'acl/powerManagement',
          meta: { title: '权限管理', icon: 'acl', hidden: false, keepAlive: true, roles: ['ROOT'] }
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
        roles: ['NOTICE'],
        hidden: false,
        keepAlive: true
      },
      children: [
        {
          path: 'deliver-info',
          name: 'deliver-info',
          component: 'systemMessage/deliverMessage',
          meta: { title: '发布通知', icon: '', hidden: false, keepAlive: true, roles: ['NOTICE'] }
        },
        {
          path: 'view-info',
          name: 'view-info',
          component: 'systemMessage/viewMessage',
          meta: { title: '所有通知', icon: '', hidden: false, keepAlive: true, roles: ['NOTICE'] }
        },
        {
          path: 'audit-info',
          name: 'audit-info',
          component: 'systemMessage/auditMessage',
          meta: { title: '审核通知', icon: '', hidden: false, keepAlive: true, roles: ['NOTICE'] }
        },
        {
          path: 'edit',
          name: 'edit-info',
          component: 'systemMessage/editMessage',
          meta: { title: '编辑通知', icon: '', hidden: true, keepAlive: false, roles: ['NOTICE'] }
        }
      ]
    },
    {
      path: '/feedback',
      component: 'Layout',
      name: 'feedback',
      meta: {
        roles: ['FEEDBACK'],
        hidden: false,
        keepAlive: true
      },
      children: [
        {
          path: '',
          name: ' childFeedback',
          component: 'feedback/feedback',
          meta: {
            title: '用户反馈',
            icon: 'feedback',
            hidden: false,
            keepAlive: true,
            roles: ['FEEDBACK']
          }
        }
      ]
    }
  ]
})
