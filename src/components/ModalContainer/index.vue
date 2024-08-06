<script>
import { useModal } from '@/hook/useModal'
import { h } from 'vue'
import ModalWrapper from '@/components/ModalContainer/components/ModalWrapper.vue'

export default {
  setup() {
    // 获取组件列表
    const { componentList } = useModal()
    return () =>
      componentList.value.map((item) => {
        return h(ModalWrapper, { key: item.id }, () => h(item.Component, item.props))
      })
  }
}
</script>
