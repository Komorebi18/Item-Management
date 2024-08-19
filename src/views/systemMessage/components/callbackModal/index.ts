import { asyncModal } from '@/utils/modal'

const CallBackModal = asyncModal(() => import('./content.vue'))

// 如果弹窗过大，需要预加载，则调用 CallBackModal.preload，进行预加载
// CallBackModal.preload
export default CallBackModal
