<template>
  <div class="box">
    <!-- 头部内容 -->
    <div class="header">
      <el-button
        type="primary"
        :icon="Plus"
        class="button-deliver"
        color="#2F3367"
        @click="isBlackList = !isBlackList"
      >
        {{ isBlackList ? '添加黑名单' : '取消' }}
      </el-button>
      <div class="search-box">
        <el-input v-model="searchInput" placeholder="请输入关键词" />
        <el-button class="search-button" color="#2F3367" @click="searchUser">
          <el-icon>
            <Search style="color: #fff" />
          </el-icon>
        </el-button>
      </div>
    </div>
    <!-- 数据展示行 -->
    <!-- 已拉入黑名单的页面展示 -->
    <el-table
      v-show="isBlackList"
      :data="tableData"
      :default-sort="{ prop: 'date', order: 'descending' }"
      style="width: 100%; padding-left: 10px"
    >
      <el-table-column prop="name" label="用户名" width="150" />
      <el-table-column prop="id" label="用户id" width="180" align="center" />
      <el-table-column prop="phone" label="用户注册手机号" width="260" align="center" />
      <el-table-column prop="date" label="拉入黑名单的时间" sortable width="260" align="center" />
      <el-table-column label="操作" width="330" align="center">
        <template #default>
          <el-button size="small" @click="isOpenBasisDialog = true" style="margin-right: 20px"
            >移出黑名单</el-button
          >
          <el-button link size="small" class="button-view-detail">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 未拉入黑名单的页面展示 -->
    <el-table
      v-show="!isBlackList"
      :data="tableData"
      :default-sort="{ prop: 'date', order: 'descending' }"
      style="width: 100%; padding-left: 10px"
    >
      <el-table-column prop="name" label="用户名" width="150" />
      <el-table-column prop="id" label="用户id" width="180" align="center" />
      <el-table-column prop="phone" label="用户注册手机号" width="260" align="center" />
      <el-table-column prop="date" label="用户注册时间" sortable width="260" align="center" />
      <el-table-column label="操作" width="330" align="center">
        <template #default>
          <el-button size="small" @click="isOpenBasisDialog = true">移入黑名单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页按钮 -->
    <pagination :total="20" :page="1" :limit="10" @pagination="handlePageChange" />
    <!-- 对话框 -->
    <!-- 打回通知依据对话框 -->
    <el-dialog v-model="isOpenBasisDialog" width="30%" :title="basisBoxTitle" class="basis-box">
      <div class="line"></div>
      <div class="basis">
        <p>移入依据:</p>
        <el-input
          v-model="textualBasis"
          type="textarea"
          :resize="'none'"
          :rows="4"
          style="width: 92%; height: 100px; margin: 5px 0 10px"
        />
        <p>图片依据：</p>
        <el-upload
          v-model:file-list="fileList"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          ><el-icon><Plus /></el-icon
        ></el-upload>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="isOpenBasisDialog = false">取消</el-button>
          <el-button type="primary" @click="showConfirmBox = true"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 确定对话框 -->
    <div class="confirm-box">
      <el-dialog v-model="showConfirmBox" width="30%" center>
        <div>
          <div class="deleteWaing-icon">
            <img src="../../assets/icons/delete-waring.svg" alt="" />
            <span
              >{{ isBlackList ? '是否将此用户移出黑名单？' : '是否将此用户拉入黑名单？' }}
            </span>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="showConfirmBox = false">取消</el-button>
            <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
          </span>
        </template>
      </el-dialog>
    </div>

    <div class="alert-box" v-show="showAlertBox">
      <div class="content">
        <p>{{ isBlackList ? '移出成功' : '拉入成功' }}</p>
        <img src="../../assets/icons/delete-confirm.svg" alt="" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Search, Plus } from '@element-plus/icons-vue'
import { ref, onMounted, computed } from 'vue'

// 表示当前所处状态：查看黑名单/待拉入黑名单
let isBlackList = ref(true)

// 当前搜素框内容
let searchInput = ref('')

// 控制填写依据的对话框打开与否
let isOpenBasisDialog = ref(false)

// 控制确认对话框展示
let showConfirmBox = ref(false)

// 拉入/移除黑名单的文字依据
let textualBasis = ref('')

// 控制提示信息的展示与否
let showAlertBox = ref(false)

// 依据弹窗标题
let basisBoxTitle = computed(() => {
  if (isBlackList.value) {
    return '移出依据'
  } else {
    return '拉入依据'
  }
})

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    id: 111,
    phone: 19868715436
  },
  {
    date: '2016-05-04',
    name: 'bom',
    id: 112,
    phone: 19868715436
  }
]

// 搜索逻辑
const searchUser = () => {}

// 拉入/移出黑名单逻辑
const handleConfirm = () => {
  // 关闭确认对话框
  showConfirmBox.value = false
  // 关闭依据对话框
  isOpenBasisDialog.value = false
  // 根据isBlackList判断是拉入/移除黑名单操作
  if (isBlackList.value) {
    // 如果当前处于查看名单状态，则为拉出黑名单
  } else {
    // 如果当前处于待拉入黑名单状态，则为拉出黑名单
  }
  // 展示提示信息
  showAlertBox.value = true
  // 3s后关闭提示窗
  setTimeout(() => {
    showAlertBox.value = false
  }, 1500)
}
</script>
<style lang="scss" scoped>
.box {
  margin: 10px 0 0 10px;
  background-color: #fff;
}

// 页面头部样式
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
  padding: 10px 40px;
  justify-content: space-between;
  align-self: center;
}

.search-box {
  display: flex;
  width: 378px;
  height: 38px;
}

.search-button {
  height: 38px;
  color: #2f3367;
}

// 页面主体内容样式
.button-view-detail {
  text-decoration: underline;
}

:deep(.el-table__header tr) {
  background-color: #f2f3f7;
}

// 对话框样式修改
:deep(.confirm-box .el-dialog) {
  --el-dialog-margin-top: 30vh;
}

:deep(.confirm-box .el-dialog__body) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--2F3367, #2f3367);
  text-align: center;
  font-family: Inter;
  font-size: 1.2rem;
  font-style: normal;
  font-weight: 500;
  line-height: 122%; /* 29.28px */
}

:deep(.confirm-box .dialog-footer .el-button) {
  background-color: #fff;
  color: #8a8ea8;
  border-color: #8a8ea8;
}
:deep(.confirm-box .dialog-footer .el-button--primary) {
  margin-left: 64px;
  color: #ff7676;
  border-color: #ff7676;
}

:deep(.basis-box .dialog-footer .el-button--primary) {
  margin-left: 20px;
  color: #fff;
  background-color: #8a8ea8;
  border-color: #8a8ea8;
}

// 消息提示框
.alert-box {
  position: absolute;
  top: 30%;
  left: 30%;
  width: 140px;
  height: 140px;
  border-radius: 8px;
  background: var(--2F3367, #2f3367);
  box-shadow: 0px 2px 8.1px 6px rgba(161, 166, 201, 0.35);
  background-color: #2f3367;
}
.alert-box .content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.alert-box p {
  margin: 16px;
  color: #fff;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: 1.28px;
}

.activeClass {
  background-color: #fafafa;
}

:deep(.basis-box .el-dialog__header) {
  margin-right: 0px;
  text-align: center;
  border-bottom: 1px solid #e3e3e3;
}

:deep(.basis-box .el-dialog__body) {
  padding: 30px 40px 10px;
  border-bottom: 1px solid #e3e3e3;
}
</style>
