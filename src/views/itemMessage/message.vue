<template>
  <div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="expand">
        <template #default="props">
          <el-form label-position="left" inline style="padding-left: 50px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="State:">
                  <span>{{ props.row.state }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="City:">
                  <span>{{ props.row.city }}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Address:">
                  <span>{{ props.row.address }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Zip:">
                  <span>{{ props.row.zip }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="Date" prop="date" />
      <el-table-column label="Name" prop="name" />
      <el-table-column fixed="right" label="Operations" width="120">
        <template #default="props">
          <el-button
            link
            type="primary"
            size="small"
            @click="viewItemLogo(props.$index)"
          >
            <!-- props.$index: 序号, props.row：当前行的信息 -->
            查看日志
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="100" :page="1" :limit="20" />
    <!-- 日志弹出框 -->
    <el-dialog v-model="visible" :show-close="false">
      <div class="my-header">
        <h4>日志弹窗</h4>
        <el-button type="danger" @click="visible = false">
          <el-icon></el-icon>
          Close
        </el-button>
      </div>
      <div>日志具体内容</div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import pagination from "@/components/Pagination/index.vue";
// 控制日志弹窗
let visible = ref(false);
const tableData = [
  {
    date: "2016-05-03",
    name: "Tom",
    state: "California",
    city: "San Francisco",
    address: "3650 21st St, San Francisco",
    zip: "CA 94114",
    family: [
      {
        name: "Jerry",
        state: "California",
        city: "San Francisco",
        address: "3650 21st St, San Francisco",
        zip: "CA 94114"
      },
      {
        name: "Spike",
        state: "California",
        city: "San Francisco",
        address: "3650 21st St, San Francisco",
        zip: "CA 94114"
      }
    ]
  }
];
const viewItemLogo = (index: number) => {
  // 打开日志弹窗
  visible.value = true;
  // 拿到对应物品的id
  console.log(index);
  // 利用物品id发送请求获取对应日志
};
</script>

<style lang="scss" scoped>
.my-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
</style>
