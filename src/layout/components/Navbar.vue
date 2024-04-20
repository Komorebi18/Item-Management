<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/modules/app'
import { useUserStore } from '@/store/modules/user'
import { useSettingsStore } from '@/store/modules/settings'
import RightPanel from '@/components/RightPanel/index.vue'
import Setting from '@/layout/components/Settings/index.vue'
import { ref, onMounted, reactive } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { SwitchButton } from '@element-plus/icons-vue'

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

//表单数据
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: ''
})

//个人日志数据
const gridData = [
  {
    date: '2024.0.01 12:01',
    device: '华为mate60',
    operate:
      '发布了很长的信息，发布了很长的信息,发布了很长的信息，发布了很长的信息，发布了很长的信息，发布了很长的信息，发布了很长的信息，发布了很长的信息'
  },
  {
    date: '2024.0.01 12:01',
    device: '华为mate60',
    operate: '发布了很长的信息，发布了很长的信息'
  },
  {
    date: '2024.0.01 12:01',
    device: '华为mate60',
    operate: '发布了很长的信息，发布了很长的信息'
  },
  {
    date: '2024.0.01 12:01',
    device: '华为mate60',
    operate: '发布了很长的信息，发布了很长的信息'
  }
]
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
            <img src="https://pic3.zhimg.com/80/v2-738a80bf6bfd7adc2a30afc1b3937f34_r.jpg" />
            <p class="out">admin</p>
          </span>
          <template #dropdown>
            <div class="my-dropdown">
              <div class="front_part">
                <div class="front_part_img">
                  <div class="front_part_title">peter</div>
                </div>
              </div>
              <div class="end_part">
                <div class="person">
                  <a href="javascript:void(0);" @click="dialogTableVisible = true">查看个人日志</a>
                </div>
                <div class="logout_btn">
                  <el-button @click="userStore.outLogin(false)"> 退出登录 </el-button>
                </div>
              </div>
              <!-- <el-dropdown-menu class="logout">
                <el-dropdown-item>
                  <div class="test">99ba</div>
                </el-dropdown-item>
                <el-dropdown-item @click="userStore.outLogin(false)">
                  <el-icon>
                    <SwitchButton />
                  </el-icon>
                  退出系统
                </el-dropdown-item>
              </el-dropdown-menu> -->
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
  <el-dialog v-model="dialogTableVisible" title="个人日志" :center="true">
    <el-table :data="gridData">
      <el-table-column property="device" label="登录设备" width="150" align="center" />
      <el-table-column property="date" label="登录时间" width="200" align="center" />
      <el-table-column property="operate" label="操作" align="center" />
    </el-table>
  </el-dialog>
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
      background: url(https://pic3.zhimg.com/80/v2-738a80bf6bfd7adc2a30afc1b3937f34_r.jpg);
      // lightgray 50% / cover no-repeat;
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
</style>
