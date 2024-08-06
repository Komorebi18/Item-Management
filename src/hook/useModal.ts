import { ref, shallowRef } from 'vue'

// 定义弹窗组件对象的结构
interface IModalItem {
  Component: any // 这里是一个组件
  props: object // 传递给组件的props，类型可以根据需要定义为更具体的类型
  id: symbol // 组件专属标识
}

// 存储组件列表
const componentList = ref<IModalItem[]>([])

// 弹窗管理器
export const useModal = () => {
  // showModal函数，用于展示弹窗
  const showModal = (Component: any, props: any) => {
    // 对传入的组件参数进行处理
    const tempComponent = shallowRef(Component)
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
    componentList.value.push({ Component: tempComponent, props, id })
  }

  // 清空componentList列表
  const clearComponentList = () => {
    componentList.value = []
  }

  // 组件列表和相关操作函数
  return { showModal, clearComponentList, componentList }
}
