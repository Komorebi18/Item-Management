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
    // {
    //   path: '/demo',
    //   component: 'Layout',
    //   meta: {
    //     title: '组件封装',
    //     icon: 'menu',
    //     roles: ['ROOT'],
    //     hidden: false,
    //     keepAlive: true
    //   },

    //   children: [
    //     {
    //       path: 'emoji',
    //       component: 'demo/emoji/index',
    //       name: 'Emoji',
    //       meta: { title: '聊天框', icon: '', hidden: false, keepAlive: true, roles: ['ROOT'] }
    //     },
    //     {
    //       path: 'waterfall',
    //       component: 'demo/waterfall/index',
    //       name: 'Waterfall',
    //       meta: { title: '瀑布流', icon: '', hidden: false, keepAlive: true, roles: ['ROOT'] }
    //     },
    //     {
    //       path: 'upload',
    //       component: 'demo/upload/index',
    //       name: 'Upload',
    //       meta: { title: '文件上传', icon: '', roles: ['ROOT'], hidden: false, keepAlive: true }
    //     },
    //     {
    //       path: 'test',
    //       component: 'demo/test',
    //       name: 'Test',
    //       meta: { title: '测试', icon: '', roles: ['ROOT'], hidden: false, keepAlive: true }
    //     },
    //   ]
    // },
    {
      path: '/item',
      component: 'Layout',
      name: 'itemMessage',
      meta: {
        title: '物品管理',
        icon: 'menu',
        roles: ['ROOT','ITEM'],
        hidden: false,
        keepAlive: true
      },
      children: [
        {
          path: 'item1',
          name: 'item1',
          component: 'itemMessage/message',
          meta: {  title: '物品信息', icon: '', hidden: false, keepAlive: true, roles: ['ROOT','ITEM1']  }
        },
        {
          path: 'item2',
          name: 'item2',
          component: 'itemMessage/relationships',
          meta: {  title: '层级关系', icon: '', hidden: false, keepAlive: true, roles: ['ROOT','ITEM2']  }
        }
      ]
    },
    {
      path: '/user',
      component: 'Layout',
      name: 'userMessage',
      meta: {
        title: '用户管理',
        icon: 'menu',
        roles: ['ROOT'],
        hidden: false,
        keepAlive: true
      },
      children: [
        {
          path: 'user1',
          name: 'user1',
          component: 'userMessage/userMessage',
          meta: {  title: '用户信息', icon: '', hidden: false, keepAlive: true, roles: ['ROOT']  }
        },
        {
          path: 'user2',
          name: 'user2',
          component: 'userMessage/blacklist',
          meta: {  title: '用户黑名单', icon: '', hidden: false, keepAlive: true, roles: ['ROOT']  }
        }
      ]
    },
    {
      path: '/acl',
      component: 'Layout',
      name: 'acl',
      meta: {
        title: '权限管理',
        icon: 'menu',
        roles: ['ROOT'],
        hidden: false,
        keepAlive: true
      },
      children: [
        {
          path: 'acl1',
          name: 'acl1',
          component: 'acl/adminMessage',
          meta: {  title: '管理员信息', icon: '', hidden: false, keepAlive: true, roles: ['ROOT']  }
        },
        {
          path: 'acl2',
          name: 'acl2',
          component: 'acl/powerManagement',
          meta: {  title: '权限分配', icon: '', hidden: false, keepAlive: true, roles: ['ROOT']  }
        }
      ]
    },
    {
      path: '/system',
      component: 'Layout',
      name: 'system',
      meta: {
        title: '系统通知',
        icon: 'menu',
        roles: ['ROOT'],
        hidden: false,
        keepAlive: true
      },
      children: [
        {
          path: 'system1',
          name: 'system1',
          component: 'systemMessage/deliverMessage',
          meta: {  title: '发布通知', icon: '', hidden: false, keepAlive: true, roles: ['ROOT']  }
        },
        {
          path: 'system2',
          name: 'system2',
          component: 'systemMessage/viewMessage',
          meta: {  title: '所有通知', icon: '', hidden: false, keepAlive: true, roles: ['ROOT']  }
        }
      ]
    },
    {
      path: '/feedback',
      component: 'Layout',
      name: 'feedback',
      meta: {
        roles: ['ROOT'],
        hidden: false,
        keepAlive: true
      },
      children: [
        {
          path: '',
          component: 'feedback/feedback',
          meta: {  title: '用户反馈', icon: 'menu', hidden: false, keepAlive: true, roles: ['ROOT']  }
        },
      ]
    },
  ]
})
