<template>
  <div class="header">
    <div class="left-header">
      <slot name="button"></slot>
      <div class="select-box">
        <el-select
          v-if="props.isShowTimeSelection"
          v-model="timeLimit"
          placeholder="全部"
          class="select-time"
          @change="onChangeLimit()"
        >
          <el-option label="全部" :value="TIME.ALL" />
          <el-option label="近三天" :value="TIME.THREE_DAYS" />
          <el-option label="近一周" :value="TIME.ONE_WEEK" />
          <el-option label="近一月" :value="TIME.ONE_MONTH" />
        </el-select>
        <el-select
          v-if="props.isShowTypeSelection"
          v-model="typeLimit"
          placeholder="所有类型"
          class="select-type"
          @change="onChangeLimit()"
        >
          <el-option label="所有类型" :value="0" />
          <el-option
            v-for="tag in noticeTypeList"
            :key="tag.typeId"
            :label="tag.typeName"
            :value="tag.typeId"
          />
        </el-select>
      </div>
    </div>
    <div class="search-box">
      <el-input
        v-model="searchKeyword"
        placeholder="请输入关键词"
        @keydown.enter="searchNotice()"
      />
      <el-button class="search-btn" color="#2F3367" @click="searchNotice()">
        <el-icon>
          <Search />
        </el-icon>
      </el-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Search } from '@element-plus/icons-vue'
import { useNoticeStore } from '@/store/modules/notice/index'
import { TIME } from '@/constants/notice'

const noticeStore = useNoticeStore()
const { noticeTypeList } = storeToRefs(noticeStore)

const emit = defineEmits(['search', 'updateLimit'])

const props = defineProps({
  // 是否展示时间筛选下拉框
  isShowTimeSelection: {
    type: Boolean,
    default: false
  },
  // 是否展示类型筛选下拉框
  isShowTypeSelection: {
    type: Boolean,
    default: false
  }
})

// 时间参数
let timeLimit = ref(TIME.ALL)

// 类型参数
let typeLimit = ref(0)

// 搜索框关键词
let searchKeyword = ref('')

// 获取通知类型
onMounted(async () => {
  await noticeStore.getAllNoticeType()
})

// 事件回调

// 搜索通知
const searchNotice = () => {
  emit('search', searchKeyword.value)
}

// 时间or类型参数改变
const onChangeLimit = () => {
  emit('updateLimit', timeLimit.value, typeLimit.value)
}
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  padding: 10px 10px 0 20px;
  justify-content: space-between;
  align-self: center;
}
.search-box {
  display: flex;
  height: 32px;
}

.remove-notice-btn {
  display: flex;
  height: 38px;
  padding: 8px 16px;
  justify-content: center;
  align-items: center;
  gap: 3px;
  color: #fff;
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: 1.44px;
}

.select-box {
  display: flex;
  justify-content: space-between;
  width: 15vw;
  border: none;
}

:deep(.select-box .el-select__placeholder) {
  color: #2f3367;
  font-weight: 600;
}

.select-time {
  width: 120px;
  margin: 5px 0 0;
}

.select-type {
  width: 130px;
  margin: 5px 0 0;
}

:deep(.el-input__wrapper) {
  border-radius: 4px 0 0 4px;
}

.search-btn {
  border-radius: 0 4px 4px 0;
}
</style>
