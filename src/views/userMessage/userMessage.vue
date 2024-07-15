<template>
  <div>
    <div class="userInfo">
      <div class="rough-userInfo">
        <el-card class="user-count">
          <div class="user-totalCount"></div>
          <div class="user-onlineC"></div>
        </el-card>
        <el-card class="user-time"> osooc </el-card>
        <el-card class="user-online"> osooc </el-card>
      </div>
      <div class="detail-userInfo">
        <el-card class="userInfo-body">
          <div class="body-above">
            <div class="change-btn" @click="OnChangeDetail">
              <el-icon style="transform: rotate(90deg); color: white"><Sort /></el-icon>
            </div>
            <div class="search">
              <el-input
                v-model="inputValue"
                style="width: 240px"
                placeholder="请输入内容"
                @change="searchUser"
              />
              <div class="search-icon">
                <el-icon style="color: white"><Search /></el-icon>
              </div>
            </div>
          </div>
          <div class="body-below">
            <TableData
              v-show="!tableChange"
              :tableData="userDetail"
              @view-Log="OnViewLog"
              @viewFriend="OnViewFriend"
            ></TableData>
            <LogData v-show="tableChange" :logData="userDetail" @view-Log="OnViewLog" />
          </div>
        </el-card>
      </div>
    </div>
    <!-- 查看日志对话框 -->
    <LogDialog ref="logDialogRef" :logUserId="logUserId" :isRefresh="isRefresh" />
    <!-- 查看好友信息对话框 -->
    <FriendDialog ref="FriendDialogRef" :groupLabel="groupLabel" :friendGroup="friendGroup" />
    <!-- 分页 -->
    <Pagination
      :total="userMessage?.total"
      :page="userMessage?.current"
      :limit="userMessage?.size"
      @pagination="clickToChange"
      class="pagination_message"
    />
  </div>
</template>
<script setup lang="ts">
import { Sort, Search } from '@element-plus/icons-vue'
import { ref, onMounted, watch } from 'vue'
import TableData from './components/TableData.vue'
import LogData from './components/LogData.vue'
import LogDialog from './components/LogDialog.vue'
import FriendDialog from './components/FriendDialog.vue'
import { userMessageStore } from '@/store/modules/userMessage'
import { IPageInfo } from '@/types/pageMessage'
import { storeToRefs } from 'pinia'
// 默认参数
const DEFAULT_PARAMETER = {
  offset: 0,
  limit: 10,
  content: ''
}

// 获取用户信息
const Store = userMessageStore()
const { userMessage, userDetail, friendGroup, groupLabel } = storeToRefs(Store)
const { getUserInfo, getUserLogById, getUserFriendById } = Store

// 列表切换
const tableChange = ref(false)

// 获取 logDialog 实例
const logDialogRef = ref<InstanceType<typeof LogDialog>>()

// 获取 FriendDialog 实例
const FriendDialogRef = ref<InstanceType<typeof FriendDialog>>()

// 保存用户id
const logUserId = ref<number>()

// 是否刷新
const isRefresh = ref<boolean>(true)

// 搜索框
const inputValue = ref<string>('')

// 搜索逻辑
const searchUser = async (query: string) => {
  // 去除空格
  if (!query.trim()) return
  getUserInfo(DEFAULT_PARAMETER.offset, DEFAULT_PARAMETER.limit, query)
}

// 点击切换列表
const OnChangeDetail = () => {
  tableChange.value = !tableChange.value
}

// 点击查看日志
const OnViewLog = (userId: number) => {
  // 保存id ，触底刷新使用
  logUserId.value = userId
  getUserLogById(userId, {
    offset: 1,
    limit: 10
  })
  // 打开弹窗
  logDialogRef.value!.openDialog()
  // 刷新标志
  isRefresh.value = true
}

// 点击查看好友信息
const OnViewFriend = (userId: number) => {
  // 打开弹窗
  FriendDialogRef.value?.openDialog()
  getUserFriendById(userId)
}

// 分页逻辑
const clickToChange = async (pageMessage: IPageInfo) => {
  getUserInfo(pageMessage.currentPage, pageMessage.pageLimit)
}

// 监听输入框
watch(inputValue, (newValue) => {
  // 为空，请求数据
  if (newValue === '') {
    getUserInfo(0, 5)
  }
})

onMounted(() => {
  // 获取信息
  getUserInfo(0, 5)
})
</script>
<style lang="scss" scoped>
body {
  position: absolute;
}
.rough-userInfo {
  box-sizing: border-box;
  display: flex;
  margin: 10px 20px 10px 20px;
  .user-count {
    width: 257px;
    height: 240px;
    margin-right: 40px;
    border-radius: 5%;
  }
  .user-time {
    width: 257px;
    height: 240px;
    margin-right: 40px;
    border-radius: 5%;
  }
  .user-online {
    flex: 1;
    border-radius: 25px;
  }
}
.detail-userInfo {
  box-sizing: border-box;
  margin: 0px 20px 10px 20px;
  .userInfo-body {
    .body-above {
      display: flex;
      justify-content: space-between;
      .change-btn {
        width: 33px;
        height: 33px;
        cursor: pointer;
        background-color: #2f3367;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .search {
        display: flex;
        cursor: pointer;
        justify-content: center;
        align-items: center;
        .search-icon {
          width: 33px;
          height: 33px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #2f3367;
          border-top-right-radius: 10px; /* 右上角的圆角半径 */
          border-bottom-right-radius: 10px; /* 左下角的圆角半径 */
        }
      }
    }
    .body-below {
      margin-top: 10px;
      .detail {
        display: flex;
        justify-content: center;
        align-items: center;
        text-decoration: underline;
        gap: 20px;
      }
    }
  }
}

.dataPicker {
  display: flex;
}
.datePick_header {
  margin-right: 45px;
}
.dialog-friend {
  display: flex;
  flex-direction: column;
  align-items: center;
  .dialog-friend-title {
    margin-bottom: 40px;
    margin-left: 20px;

    font-size: 20px;
  }
}
.pagination_message {
  display: flex;
  justify-content: center;
  align-items: center;
}
.date-picker {
  display: flex;
  justify-content: center;
}
</style>
