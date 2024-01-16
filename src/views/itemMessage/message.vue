<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column type="expand">
      <template #default="props">
        <el-form label-position="left" inline>
          <el-form-item label="State">
            <span>{{ props.row.state }}</span>
          </el-form-item>
          <el-form-item label="State">
            <span>{{ props.row.state }}</span>
          </el-form-item>
          <el-form-item label="State">
            <span>{{ props.row.state }}</span>
          </el-form-item>
          <el-form-item label="State">
            <span>{{ props.row.state }}</span>
          </el-form-item>
          <el-form-item label="State">
            <span>{{ props.row.state }}</span>
          </el-form-item>
          <el-form-item label="State">
            <span>{{ props.row.state }}</span>
          </el-form-item>
          <el-form-item label="State">
            <span>{{ props.row.state }}</span>
          </el-form-item>
          <el-form-item label="State">
            <span>{{ props.row.state }}</span>
          </el-form-item>
          <el-form-item label="State">
            <span>{{ props.row.state }}</span>
          </el-form-item>
          <el-form-item label="State">
            <span>{{ props.row.state }}</span>
          </el-form-item>
        </el-form>
    </template>
    </el-table-column>
    <el-table-column label="Date" prop="date" />
    <el-table-column label="Name" prop="name" />
  </el-table>
</template>

<!-- <p>State: {{ scope.row.state }}</p>
            <p>City: {{ scope.row.city }}</p>
            <p>Address: {{ scope.row.address }}</p>
            <p>Zip: {{ scope.row.zip }}</p> -->
<script lang="ts" setup>
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
</script>

<style lang="scss" scoped></style>
