<template>
  <el-select
    v-model="typeLimit"
    placeholder="所有类型"
    class="select-type"
    @change="onChangeTypeLimit()"
  >
    <el-option label="所有类型" :value="0" />
    <el-option
      v-for="tag in noticeTypeList"
      :key="tag.typeId"
      :label="tag.typeName"
      :value="tag.typeId"
    />
  </el-select>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useNoticeStore } from '@/store/modules/notice/index'

const noticeStore = useNoticeStore()
const { noticeTypeList } = storeToRefs(noticeStore)

onMounted(() => {
  noticeStore.getAllNoticeType()
})

const emit = defineEmits<{
  updateTypeLimit: [typeLimit: number]
}>()

const typeLimit = ref(0)

// 更新通知类型限制
const onChangeTypeLimit = () => {
  emit('updateTypeLimit', typeLimit.value)
}
</script>
<style lang="scss" scoped>
.select-type {
  width: 130px;
  margin: 5px 0 0;
}
</style>
