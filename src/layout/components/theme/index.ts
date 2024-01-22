export interface MenuObject extends Object {
  themeColor: string //主题色

  menuBg?: string // 菜单背景色
  menuText?: string // 菜单文字颜色
  subMenuBg?: string // 子菜单背景色
  menuActiveText?: string // 菜单选中文字颜色
  subMenuActiveBg?: string // 子菜单选中后背景色
  subMenuActiveText?: string // 子菜单选中颜色
  subMenuHover?: string // 子菜单移入背景色
  sidebarLogo?: string // logo背景色

  menuHover?: string // 菜单移入色
  menuTitleHover?: string // 菜单文字移入颜色
  subMenuHoverText?: string // 菜单文字移入颜色
  subActiveText?: string // 选中当前项文字颜色
}

export const themeColorList = ref<MenuObject[]>([
  {
    themeColor: '#2F3367', // 默认主题色

    menuBg: '#001529',
    menuText: 'rgb(254 254 254 / 65%)',
    subMenuBg: '#0f0303',
    subMenuActiveBg: '#409EFF',
    menuActiveText: '#409EFF',
    subMenuActiveText: '#409EFF',
    subMenuHoverText: '#409EFF',
    sidebarLogo: '#002140',
    menuHover: 'transparent',
    menuTitleHover: 'transparent',
    subActiveText: '#fff'
  }
])
