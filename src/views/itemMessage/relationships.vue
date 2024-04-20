<template>
  <div>
    <el-table
      :data="tableData"
      :border="true"
      :header-cell-style="headerCellStyle"
      :cell-style="cellStyle"
    >
      <!-- 表格列定义 -->
    </el-table>
    <el-pagination
      :current-page="currentPage"
      :total="tableData.length"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [], // 表格数据源
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示条数
      headerCellStyle: {
        backgroundColor: '#f5f7fa',
        color: '#333',
        fontWeight: 'bold'
      },
      cellStyle: {
        backgroundColor: '#fff',
        color: '#666'
      }
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val
    }
  }
}
</script>

<!-- <template>
  <div class="">层级关系
  </div>
</template>
<script setup lang="ts">

</script>
<style lang="scss" scoped>

</style>
 -->
