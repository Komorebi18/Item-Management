import { ref, watch, shallowRef, defineAsyncComponent } from 'vue'
import type { Component, AsyncComponentLoader } from 'vue'
import LoadingModal from '@/components/LoadingModal/index.vue'

interface ITempModalItem {
  component: Component // 这里应该是一个组件构造器或函数组件
  props: object // 传递给组件的props，类型可以根据需要定义为更具体的类型
}

interface IModalItem extends ITempModalItem {
  id: symbol // 组件编号，用来标识每个组件
}

// 存储当前渲染组件
export const componentList = ref<IModalItem[]>([])
// 存储待渲染组件
const nextComponentList = ref<ITempModalItem[]>([])

/**
 * 展示弹窗
 * @param component 弹窗组件
 * @param props props参数或者emit事件回调
 */
export const showModal = (component: Component, props: any) => {
  // 对传入的组件参数进行处理
  const tempComponent = shallowRef(component)
  // 为每个弹窗生成唯一标识
  const id = Symbol()
  // 添加一个关闭弹窗事件
  props['onClose'] = () => {
    // 通过id找到改组件在数组中的次序
    const index = componentList.value.findIndex((item) => item.id === id)
    if (index !== -1) {
      // 删除组件列表对应元素
      componentList.value.splice(index, 1)
    }
  }
  componentList.value.push({ component: tempComponent, props, id })
}

/**
 * 当前渲染的弹窗全部关闭时才进行渲染的弹窗
 * @param component 弹窗组件
 * @param props props参数或者emit事件回调
 */
export const showNextModal = (component: Component, props: any) => {
  // 对传入的组件参数进行处理
  const tempComponent = shallowRef(component)
  // 将新增弹窗加入待渲染列表nextComponentList
  nextComponentList.value.push({ component: tempComponent, props })
}

// 监视当前正在渲染的弹窗，若为空，则渲染待渲染弹窗
watch(
  () => componentList.value.length,
  () => {
    if (nextComponentList.value.length && componentList.value.length === 0) {
      // 待渲染弹窗不为空时,且当前正在渲染的弹窗列表为空，则将待渲染的弹窗列表添加到正在渲染的弹窗列表中
      const nextModal = nextComponentList.value.shift()
      if (nextModal) {
        showModal(nextModal.component, nextModal.props)
      }
    }
  }
)

/**
 * 页面切换时，清空所有弹窗
 */
export const clearComponentList = () => {
  componentList.value = []
  nextComponentList.value = []
}

/**
 * 将弹窗包装成异步弹窗
 * @param loader 渲染函数，形如 () => import('./content.vue')
 * @param loadingComponent 弹窗加载前loading状态展示的组件
 * @returns 异步弹窗
 */
export const asyncModal = (loader: AsyncComponentLoader, loadingComponent?: Component) => {
  const temComponent = defineAsyncComponent({
    // 加载函数
    loader,
    // 加载异步组件时使用的组件
    loadingComponent: loadingComponent || LoadingModal,
    // 展示加载组件前的延迟时间，默认为 200ms
    delay: 200
  })
  temComponent['preload'] = loader
  return temComponent
}
