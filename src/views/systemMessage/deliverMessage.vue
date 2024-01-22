<template>
  <div class="box">
    <!-- 页面顶部 -->
    <div class="header">
      <el-button
        type="primary"
        :icon="Plus"
        class="button-deliver"
        color="#2F3367"
        @click="deliverMessage"
      >
        发布新的通知
      </el-button>
      <div class="searchBox">
        <el-input v-model="input" placeholder="请输入关键词" />
        <el-button class="searchButton" color="#2F3367">
          <el-icon>
            <Search style="color: #fff" />
          </el-icon>
        </el-button>
      </div>
    </div>
    <!-- 页面主要内容展示 -->
    <el-main style="padding-top: 0; overflow: hidden">
      <!-- 通知展示表格 -->
      <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
        <div class="pane-content">
          <el-tab-pane label="全部" name="first">
            <div v-for="item in items" :key="item.id">
              <el-row :gutter="20" class="singleMessage">
                <el-col :span="9">
                  <div class="title">
                    <img
                      src="../../assets/icons/info-success.svg"
                      alt=""
                      style="width: 1em; height: 1em; margin: 5px"
                    />
                    <h3>这里是标题</h3>
                  </div>
                  <el-text class="w-150px mb-2" truncated style="color: #8a8ea8; margin-left: 2em">
                    Self element set width 100px
                  </el-text>
                </el-col>
                <el-col :span="5">
                  <span class="date">2024-01-11 17:00</span>
                </el-col>
                <el-col :span="3">
                  <span class="deliver">管理员1</span>
                </el-col>
                <el-col :span="3" style="display: flex; justify-content: space-between">
                  <el-icon color="#2F3367"><View /></el-icon>
                  <el-icon color="#2F3367" @click="handleIconClick">
                    <Promotion />
                  </el-icon>
                  <el-icon color="#2F3367">
                    <Delete />
                  </el-icon>
                  <el-icon color="#2F3367">
                    <Delete />
                  </el-icon>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="编辑中" name="second">编辑中</el-tab-pane>
          <el-tab-pane label="审核中" name="third">审核中</el-tab-pane>
          <el-tab-pane label="已审核" name="fourth">已审核</el-tab-pane>
        </div>
      </el-tabs>
    </el-main>
    <!-- 分页按钮 -->
    <pagination :total="100" :page="1" @pagination="handleChange" />
  </div>
</template>
<script setup lang="ts">
// import header from '/components/header.vue'
import { Delete, Search, Promotion, Plus } from '@element-plus/icons-vue'
import pagination from '@/components/Pagination/index.vue'
import router from '@/router'
import { ref } from 'vue'
// 搜索框内容
let input = ref('')
// 当前页签
let activeName = ref('first')

// tab页签点击触发
const handleClick = () => {
  console.log('点击了tab页签')
}

// 点击icon图标
const handleIconClick = () => {
  console.log('点击了icon')
}

// 分页按钮点击触发
const handleChange = () => {
  console.log('点击了页码')
}

// 模拟系统信息数据
const items = [
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' },
  { id: 3, name: 'Item 3' },
  { id: 4, name: 'Item 4' },
  { id: 5, name: 'Item 5' },
  { id: 6, name: 'Item 6' },
  { id: 7, name: 'Item 7' }
]

// 发布通知
const deliverMessage = () => {
  // 跳转到编辑页
  router.replace({ path: '/system/edit' })
}
</script>
<style lang="scss" scoped>
.box {
  margin: 15px 0 0 15px;
  background-color: #fff;
}
.button-deliver {
  height: 38px;
  padding: 8px 16px;
  color: #fff;
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 1.44px;
}
.header {
  display: flex;
  padding: 10px;
  justify-content: space-between;
  align-self: center;
}

.searchBox {
  display: flex;
  width: 378px;
  height: 38px;
}

.searchButton {
  height: 38px;
  color: #2f3367;
}

.tabs {
  position: relative;
  height: 65vh;
}

.pane-content {
  height: 60vh;
  overflow: auto;
}

.singleMessage {
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 8px 20px 8px 8px;
}

.title {
  display: flex;
  align-items: center;

  margin-bottom: 6px;
  color: var(--2F3367, #2f3367);
  font-family: Inter;
  font-size: 1rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 1.6px;
}

.date {
  color: var(--2F3367, #2f3367);
  font-family: Inter;
  font-size: 0.5em;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1.44px;
}

.deliver {
  color: var(--2F3367, #2f3367);
  font-family: Inter;
  font-size: 0.5em;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1.28px;
}
</style>
