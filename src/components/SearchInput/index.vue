<template>
  <div class="search-box">
    <el-input v-model="searchKeyword" placeholder="请输入关键词" @keydown.enter="searchNotice()" />
    <el-button class="search-btn" color="#2F3367" @click="searchNotice()">
      <el-icon>
        <Search />
      </el-icon>
    </el-button>
  </div>
</template>
<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'

const emit = defineEmits<{
  search: []
}>()

// 搜索关键词
const searchKeyword = defineModel({ default: '' })

// 触发搜索逻辑
const searchNotice = () => {
  emit('search')
}
</script>
<style lang="scss" scoped>
.search-box {
  display: flex;
  height: 32px;
}

.search-btn {
  border-radius: 0 4px 4px 0;
}
</style>
