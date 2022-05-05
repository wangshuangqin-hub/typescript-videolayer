// import './popup.css'  全局css操作，导致污染,ts的操作模式，ts文件不识别css后缀的名称，那么就无法使用
// 用模块化的方式引入，webpack的方式到入的，和ts无关(方式一)
// let styles = require('./popup.css').default //（方式二，ts的声明文件）
import styles from './popup.css'
interface Ipopup {
  width?:string;
  height?:string;
  title?:string;
  pos?:string;
  mask?:boolean;
  content?: (ele:HTMLElement) => void;
}
// 用来约束类
interface Icomponent {
  tempContainer: HTMLElement
  init: () => void;//组件必须有初始化函数
  template:() => void;
  handle:() => void
}
// 属性都是可选，都是默认值
function popup (options:Ipopup){
  return new Popup(options)
}
class Popup implements Icomponent{
  tempContainer;
  mask;
  constructor ( private settings: Ipopup) {
    // 让形参变成类型的属性,加上修饰符就可以直接调用settings
    // 前面是默认值，用户不传则使用默认值
    this.settings = Object.assign({
      width:'100%',
      height:'100%',
      title:'',
      pos:'center',
      mask:true,
      content:function(){}
    },this.settings)
    this.init()
  }
  // 初始化
  init(){
    this.template()
    this.settings.mask && this.createMask()
    this.handle()
    this.contentCallback()
  }
  // 创建模板
  template(){
    this.tempContainer = document.createElement('div')
    this.tempContainer.style.width = this.settings.width
    this.tempContainer.style.height = this.settings.height
    this.tempContainer.className = styles.popup
    this.tempContainer.innerHTML = `
      <div class="${styles['popup-title']}">
        <h3>${this.settings.title}</h3>
        <i class="iconfont icon-close"></i>
      </div>
      <div class="${styles['popup-content']}"></div>
    `
    document.body.appendChild(this.tempContainer)
    switch(this.settings.pos){
      case 'left':
        this.tempContainer.style.left = 0
        this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) + 'px';
        break;
      case 'right':
        this.tempContainer.style.right = 0
        this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) + 'px';
        break;
      default:
        // 不传或传错，默认就是居中
        this.tempContainer.style.left = (window.innerWidth - this.tempContainer.offsetWidth) / 2 +'px'
        this.tempContainer.style.top = (window.innerHeight - this.tempContainer.offsetHeight) / 2 + 'px'
        break;
    }
  }
  // 事件操作
  handle(){
    let popupClose = this.tempContainer.querySelector(`.${styles['popup-title']} .icon-close`)
    popupClose.addEventListener('click',()=>{
      document.body.removeChild(this.tempContainer)
      this.settings.mask && document.body.removeChild(this.mask)
    })
  }
  // 创建碳=弹层
  createMask () {
    this.mask = document.createElement('div')
    this.mask.className = styles.mask
    document.body.appendChild(this.mask)
  }
  contentCallback(){
    let popupContent = this.tempContainer.querySelector(`.${styles['popup-content']}`)
    this.settings.content(popupContent)
  }
}
export default popup