<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { useSettingsStore } from '@/store/modules/settings'
import RightPanel from '@/components/RightPanel/index.vue'
import Setting from '@/layout/components/Settings/index.vue'
import { ref, onMounted, reactive } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { ArrowDown } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { timeFormatting } from '@/utils/timeFormatting'
import { throttle } from 'lodash'
const Store = useUserStore()
const { userInfo_Local, personalLogDetail, personalLog } = storeToRefs(Store)
const { getMyLog, getMyLogByScroll } = Store
const { width } = useWindowSize()
onMounted(() => {
  window.addEventListener('resize', function handleResize() {
    width.value = window.innerWidth
  })
})

const settingsStore = useSettingsStore()
const appStore = useAppStore()
const userStore = useUserStore()

const { device } = storeToRefs(appStore) // 设备类型：desktop-宽屏设备 || mobile-窄屏设备

//打开个人日志
const dialogTableVisible = ref(false)

// 日期选择器实例
const timePickRef = ref()

const dataValue = ref()

// 是否触底刷新
const isRefresh = ref<boolean>(false)

// 图标点击
const onIconShowPicker = () => {
  if (timePickRef.value) {
    timePickRef.value.handleOpen() // 直接显示日期选择面板
  }
}

// 点击打开个人日志
const onOpenPersonalLog = async () => {
  isRefresh.value = true
  dialogTableVisible.value = true
  await getMyLog({
    offset: 0,
    limit: 10
  })
}

// 格式化时间
const formatterTime = (value: any) => {
  const { regTime } = value
  return dayjs(regTime).format('YYYY-MM-DD HH:mm:ss')
}

// 触底加载更多
const loadMore = throttle(() => {
  if (isRefresh.value && personalLog.value.current < personalLog.value.pages) {
    getMyLogByScroll()
  } else {
    return
  }
}, 2000)

// 获取用户选择日期
const getDateValue = (time: string) => {
  // 格式化日期
  const { newStartTime, newEndTime } = timeFormatting(time[0], time[1])
  getMyLog(
    {
      offset: 0,
      limit: 50
    },
    {
      startTime: newStartTime,
      endTime: newEndTime
    }
  )
}

// 设置面板
const show = ref(false)
</script>

<template>
  <div class="navbar" :class="{ isTop: settingsStore.layout !== 'left' }">
    <slot name="logo"></slot>
    <div class="flex items-center zzh">
      <slot name="layout"></slot>
    </div>
    <div class="flex items-center">
      <div v-if="device !== 'mobile'" class="flex items-center">
        <screenfull class="navbar-setting-item screenfull" />
        <!-- <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select class="navbar-setting-item" />
        </el-tooltip> -->

        <lang-select class="navbar-setting-item" />
        <el-dropdown trigger="click" class="dropdown">
          <span class="el-dropdown-link navbar-bg-hover select-none">
            <img :src="userInfo_Local.avatar" />
            <p class="out">{{ userInfo_Local.username }}</p>
          </span>
          <template #dropdown>
            <div class="my-dropdown">
              <div class="front_part">
                <div class="front_part_img">
                  <el-image :src="userInfo_Local.avatar" fit="cover" class="avatar-img"> </el-image>
                  <div class="front_part_title">{{ userInfo_Local.username }}</div>
                </div>
              </div>
              <div class="end_part">
                <div class="person">
                  <a href="javascript:void(0);" @click="onOpenPersonalLog">查看个人日志</a>
                </div>
                <div class="logout_btn">
                  <el-button @click="userStore.outLogin(false)"> 退出登录 </el-button>
                </div>
              </div>
            </div>
          </template>
        </el-dropdown>
      </div>
      <div class="setting" @click.stop="show = true">
        <i-ep-setting />
      </div>
    </div>
  </div>
  <RightPanel v-model:show="show">
    <Setting></Setting>
  </RightPanel>
  <!-- 查看日志对话框 -->
  <el-dialog v-model="dialogTableVisible" width="800">
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="false" class="infinite-list">
      <el-table :data="personalLogDetail" style="width: 100%">
        <el-table-column prop="address" label="登录ip" width="180" align="center" />
        <el-table-column
          :formatter="formatterTime"
          prop="modifyTime"
          label="操作时间"
          align="center"
        >
          <template #header>
            操作时间
            <el-icon @click="onIconShowPicker"><ArrowDown /></el-icon>
            <div class="date-picker">
              <el-date-picker
                v-model="dataValue"
                size="small"
                @change="getDateValue"
                type="datetimerange"
                ref="timePickRef"
                style="visibility: hidden"
              >
              </el-date-picker>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="操作" align="center" />
      </el-table>
    </div>
  </el-dialog>
  <!-- <el-dialog v-model="dialogTableVisible" title="个人日志" :center="true">
    <el-table :data="gridData">
      <el-table-column property="device" label="登录设备" width="150" align="center" />
      <el-table-column property="date" label="登录时间" width="200" align="center" />
      <el-table-column property="operate" label="操作" align="center" />
    </el-table>
  </el-dialog> -->
</template>

<style lang="scss" scoped>
.zzh {
  width: 25%;
  flex: 1;
}
.navbar {
  background-color: #fff;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 0 1px #0003;

  .navbar-setting-item,
  .setting {
    height: 50px;
    line-height: 50px;
    width: 32px;
    display: inline-block;
    cursor: pointer;
    text-align: center;
    color: #1e1e1f;

    &:hover {
      background: rgb(244, 245, 246);
    }
  }
  .screenfull {
    font-size: 19px;
  }

  .setting {
    width: 45px;
    line-height: 60px;
    font-size: 15px;
  }
  .el-dropdown-link {
    display: flex;
    align-items: center;
    justify-content: space-around;
    height: 50px;
    padding: 10px;

    cursor: pointer;

    &:hover {
      background: rgb(244, 245, 246);
    }

    p {
      font-size: 14px;
      margin-left: 7px;
      color: #000000d9;
    }

    img {
      width: 22px;
      height: 22px;
      border-radius: 50%;
    }
  }
}
.isTop {
  background-color: var(--menuBg);
  color: #fff;
  overflow: hidden;

  .screenfull,
  .navbar-setting-item,
  .setting {
    min-width: 45px;
    color: #fff;
    &:hover {
      background: var(--el-color-primary-light-1);
    }
  }
  .el-dropdown-link {
    &:hover {
      background: var(--el-color-primary-light-1);
    }

    p {
      color: #fff;
    }
  }
}
.test {
  width: 212px;
  height: 293px;
  flex-shrink: 0;
  background-color: red;
}
.my-dropdown {
  display: flex;
  position: relative;
  box-sizing: border-box;
  flex-direction: column;
  width: 212px;
  height: 293px;
  // background-color: red;
  .front_part {
    // flex: 1;
    width: 212px;
    height: 56px;
    flex-shrink: 0;
    background: rgba(52, 55, 100, 0.52);
    .front_part_img {
      position: absolute;
      top: 27px;
      left: 89px;
      width: 40px;
      height: 40px;
      flex-shrink: 0;
      border-radius: 40px;
      .avatar-img {
        border-radius: 40px;
      }
      .front_part_title {
        position: absolute;
        width: 43px;
        height: 21px;
        flex-direction: column;
        justify-content: center;
        flex-shrink: 0;
        margin-top: 15px;
        top: 28px;
        left: 2px;
        color: #3b3f70;
        font-family: Poppins;
        font-size: 16px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
      }
    }
  }
  .end_part {
    .person {
      position: absolute;
      top: 137px;
      left: 61px;
      color: var(--2F3367, #2f3367);
      border-bottom: 1px solid #2f3367;
      font-family: Poppins;
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }
    .el-button {
      position: absolute;
      bottom: 46px;
      left: 68px;
      display: inline-flex;
      padding: 10px 16px;
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      border-radius: 4px;
      border: 1px solid var(--2F3367, #2f3367);
    }
  }
}
.el-dialog {
  width: 1077px;
  height: 926px;
  flex-shrink: 0;
}
.infinite-list {
  height: 400px;
  overflow: auto;
}
</style>
