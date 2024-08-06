<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import { useAppStore } from '@/store/modules/app'
import ModalContainer from '@/components/ModalContainer/index.vue'
const appStore = useAppStore()
</script>

<template>
  <el-config-provider :locale="appStore.locale" :size="appStore.size">
    <router-view />
    <ModalContainer />
  </el-config-provider>
</template>
