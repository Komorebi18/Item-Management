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
              <el-input style="width: 240px" placeholder="请输入内容" />
              <div class="search-icon">
                <el-icon style="color: white"><Search /></el-icon>
              </div>
            </div>
          </div>
          <div class="body-below">
            <TableData
              v-show="!isShow"
              :tableData="userDetail"
              @view-Log="OnViewLog()"
              @viewFriend="OnViewFriend()"
            ></TableData>
            <LogData v-show="isShow" :logData="userDetail" @view-Log="OnViewLog()" />
          </div>
        </el-card>
      </div>
    </div>
    <!-- 查看好友信息对话框 -->
    <el-dialog v-model="dialogTableVisibleToLog" width="800">
      <el-table :data="userDetail" style="width: 100%">
        <el-table-column prop="ip" label="登录ip" width="180" align="center" />
        <el-table-column prop="loginTime" label="操作时间" align="center">
          <template #header>
            <p class="datePick_header">操作时间</p>
            <div class="datePick">
              <div class="dataPicker">
                <el-date-picker
                  v-model="value1"
                  style="width: 100px"
                  prefix-icon="pre"
                  type="date"
                  size="small"
                />
                <p>至</p>
                <el-date-picker
                  v-model="value2"
                  style="width: 100px"
                  prefix-icon="pre"
                  type="date"
                  size="small"
                />
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="operation" label="操作" align="center" />
      </el-table>
    </el-dialog>
    <!-- 查看日志对话框 -->
    <el-dialog v-model="dialogTableVisibleToFriend" width="800">
      <div class="dialog-friend">
        <el-table :data="friedDate" style="width: 100%">
          <el-table-column prop="time" label="操作时间" width="180" align="center" />
          <el-table-column
            prop="group"
            label="全部分组"
            align="center"
            :filters="[
              { text: '未分组', value: '未分组' },
              { text: '好友', value: '好友' },
              { text: '亲人', value: '亲人' },
              { text: '全部', value: '全部' }
            ]"
            :filter-method="filterHandler"
          />
          <el-table-column prop="friend" label="好友" align="center" />
        </el-table>
      </div>
    </el-dialog>
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
import { TableColumnCtx } from 'element-plus'
import { ref } from 'vue'
import TableData from './components/TableData.vue'
import LogData from './components/LogData.vue'
import { getUserMessageAPI } from '@/api/userMessage/userMessage'
import { userMessageStore } from '@/store/modules/userMessage'
import { pageInfo } from '@/types/pageMessage'
import { storeToRefs } from 'pinia'
// 纪录某列状态
const isShow = ref(false)

// log对话框状态
const dialogTableVisibleToLog = ref(false)

// friend对话框状态
const dialogTableVisibleToFriend = ref(false)
// 时间选择器

// 开始时间
const value1 = ref('')
// 结束时间
const value2 = ref('')

// 获取用户信息
const Store = userMessageStore()
const { userMessage, userDetail } = storeToRefs(Store)
const { getUserMessage } = Store
// 点击切换
const OnChangeDetail = () => {
  isShow.value = !isShow.value
}

// 点击查看日志
const OnViewLog = () => {
  dialogTableVisibleToLog.value = true
}

// 点击查看好友信息
const OnViewFriend = () => {
  dialogTableVisibleToFriend.value = true
}

// 好友信息筛选
const filterHandler = (value: string, row: FriendData, column: TableColumnCtx<FriendData>) => {
  // 将 property 强行定义未 FriendData
  const property = column['property'] as keyof FriendData
  return row[property] === (value as string)
}

// 好友信息
interface FriendData {
  time: string
  group: string
  friend: string
}
const friedDate = [
  {
    time: '2024.01.01 12:00:00',
    group: '亲人',
    friend: '好友1'
  },
  {
    time: '2024.01.01 12:00:00',
    group: '亲人',
    friend: '好友2'
  },
  {
    time: '2024.01.01 12:00:00',
    group: '未分组',
    friend: '好友3'
  },
  {
    time: '2024.01.01 12:00:00',
    group: '朋友',
    friend: '好友4'
  },
  {
    time: '2024.01.01 12:00:00',
    group: '朋友',
    friend: '好友4'
  },
  {
    time: '2024.01.01 12:00:00',
    group: '朋友',
    friend: '好友4'
  },
  {
    time: '2024.01.01 12:00:00',
    group: '朋友',
    friend: '好友4'
  },
  {
    time: '2024.01.01 12:00:00',
    group: '朋友',
    friend: '好友4'
  },
  {
    time: '2024.01.01 12:00:00',
    group: '朋友',
    friend: '好友4'
  },
  {
    time: '2024.01.01 12:00:00',
    group: '朋友',
    friend: '好友4'
  },
  {
    time: '2024.01.01 12:00:00',
    group: '朋友',
    friend: '好友4'
  },
  {
    time: '2024.01.01 12:00:00',
    group: '朋友',
    friend: '好友4'
  },
  {
    time: '2024.01.01 12:00:00',
    group: '朋友',
    friend: '好友4'
  },
  {
    time: '2024.01.01 12:00:00',
    group: '朋友',
    friend: '好友4'
  }
]
// 获取信息
getUserMessage(0, 5)

// 分页逻辑
const clickToChange = async (pageMessage: pageInfo) => {
  //更改页面信息
  userMessage.value!.current = pageMessage.currentPage
  userMessage.value!.size = pageMessage.pageLimit
  // 请求数据
  await getUserMessage(pageMessage.currentPage, pageMessage.pageLimit)
}
</script>
<style lang="scss" scoped>
.rough-userInfo {
  box-sizing: border-box;
  display: flex;
  margin: 1cap 20px 10px 20px;
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
    width: 680px;
    height: 240px;
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
</style>
