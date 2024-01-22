<template>
  <div :class="'pagination ' + { hidden: hidden }">
    <el-pagination
      class="custom-pagination"
      :background="background"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'
import { scrollTo } from '@/utils/scroll-to'

const props = defineProps({
  total: {
    required: true,
    type: Number as PropType<number>,
    default: 0
  },
  page: {
    type: Number,
    default: 1
  },
  limit: {
    type: Number,
    default: 20
  },
  pageSizes: {
    type: Array as PropType<number[]>,
    default() {
      return [10, 20, 30, 50]
    }
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  background: {
    type: Boolean,
    default: true
  },
  autoScroll: {
    type: Boolean,
    default: true
  },
  hidden: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['updatePage', 'updateLimit', 'pagination'])

const currentPage = computed<number | undefined>({
  get: () => props.page,
  set: (value) => {
    emit('updatePage', value)
  }
})

const pageSize = computed<number | undefined>({
  get() {
    return props.limit
  },
  set(val) {
    emit('updateLimit', val)
  }
})

function handleSizeChange(val: number) {
  emit('pagination', { currentPage: props.page, pageLimit: val })
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}

function handleCurrentChange(val: number) {
  currentPage.value = val
  emit('pagination', { currentPage: val, pageLimit: props.limit })
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  padding: 12px;
  &.hidden {
    display: none;
  }
}

.custom-pagination {
  color: #2f3367;
}
</style>
