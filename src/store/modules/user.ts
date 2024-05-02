import router from '@/router'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { getLoginAPI, fetchTokenAPI } from '@/api/login'
import { getUserGroupList, getUserPartialInformation } from '@/api/user'
import type { userInformation } from '@/types/login'
import type { UserGroup, UserInformation, Data } from '@/types/user'
import { ref, reactive } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 初始化用户数据
  const userInfo = ref<userInformation>({
    adminId: 0,
    roles: [],
    route: '',
    accessToken: '',
    refreshToken: '',
    expiredTime: '',
    username: ''
  })

  // 用户信息--用来渲染发送通知给单个用户，展示可选用户的列表
  const userPartialInformation = reactive<Data>({
    current: 1,
    size: 10,
    total: 0,
    pages: 0,
    records: <UserInformation[]>[]
  })

  // 所有分组类型
  const userGroupList = ref<UserGroup[]>([])

  // 初始化accessToken
  const token = useStorage<string>('token', '')
  // 初始化refreshToken
  const refreshToken = useStorage<string>('refreshToken', '')
  // 初始化accessToken过期时间
  const refreshTime = useStorage<string>('refreshTime', '')
  // 初始化accessToken状态，1表示未过期，0表示已过期
  const accessTokenState = useStorage<number>('accessTokenState', 0)
  // 初始化用户权限
  const roles = useStorage<string[]>('roles', [])

  // 登录，初始化信息
  const setLogin = async (data: object) => {
    const res = await getLoginAPI(data)
    // 储存接口响应信息
    userInfo.value.adminId = res.data.adminId
    userInfo.value.roles = res.data.roles
    userInfo.value.route = res.data.route
    userInfo.value.username = res.data.username
    userInfo.value.accessToken = res.data.accessToken
    userInfo.value.refreshToken = res.data.refreshToken
    userInfo.value.expiredTime = res.data.expiredTime
    // 本地存储赋值
    accessTokenState.value = 1
    token.value = res.data.accessToken
    refreshToken.value = res.data.refreshToken
    refreshTime.value = res.data.expiredTime
    roles.value = res.data.roles
  }

  // 退出登录
  const outLogin = async (isTokenExpired: boolean) => {
    if (isTokenExpired) {
      // token过期导致的退出
      ElMessage({
        message: '登录信息过期,请重新登录',
        type: 'error'
      })
    } else {
      // 正常退出需要发送请求告知后台
      // await outLoginAPI()
    }

    // 移除本地存储相关用户信息
    roles.value = null
    token.value = null
    accessTokenState.value = null
    refreshToken.value = null
    refreshTime.value = null
    // 重置路由
    router.replace({ path: '/login' })
  }

  // 更新token
  const updateToken = async () => {
    // 获取新token
    const res = await fetchTokenAPI()
    // 存储新token
    // 更新userInfo内的token
    userInfo.value.accessToken = res.data.accessToken
    userInfo.value.refreshToken = res.data.refreshToken
    userInfo.value.expiredTime = res.data.expiredTime
    // 更新本地存储的token
    accessTokenState.value = 1
    token.value = res.data.accessToken
    refreshToken.value = res.data.refreshToken
    refreshTime.value = res.data.expiredTime
  }

  // 获取所有用户分组
  const getUserGroup = async () => {
    const res = await getUserGroupList()
    userGroupList.value = res.data
  }

  // 获取用户ID和昵称
  const getPartialUserinfo = async () => {
    const res = await getUserPartialInformation(userPartialInformation.current as number, 20)
    // 页码递增
    userPartialInformation.current = (res.data.current as number) + 1
    // 更新其他数据
    userPartialInformation.size = res.data.size
    userPartialInformation.total = res.data.total
    userPartialInformation.pages = res.data.pages
    if (userPartialInformation.records) {
      userPartialInformation.records.push(...(res.data.records as UserInformation[]))
    }
  }
  return {
    userInfo,
    token,
    userGroupList,
    userPartialInformation,
    setLogin,
    outLogin,
    updateToken,
    getUserGroupList: getUserGroup,
    getUserPartialInformation: getPartialUserinfo
  }
})
