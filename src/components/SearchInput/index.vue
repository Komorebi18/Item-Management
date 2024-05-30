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
import { ref } from 'vue'
import { Search } from '@element-plus/icons-vue'

const emit = defineEmits<{
  search: [keyword: string]
}>()

const searchKeyword = ref('')

const searchNotice = () => {
  emit('search', searchKeyword.value)
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
