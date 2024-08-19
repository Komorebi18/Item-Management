<script>
import { componentList } from '@/utils/modal'
import { h } from 'vue'
import ModalWrapper from '@/components/ModalContainer/components/ModalWrapper.vue'

export default {
  setup() {
    return () =>
      componentList.value.map((item) => {
        return h(ModalWrapper, { key: item.id }, () => h(item.component, item.props))
      })
  }
}
</script>
