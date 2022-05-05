import './main.css'
import popup from './components/popup/popup'
import video from './components/video/video'
let listItem = document.querySelectorAll('#list li')
for (let i = 0; i < listItem.length; i++) {
  listItem[i].addEventListener('click', function(){
    let url = this.dataset.url
    let title = this.dataset.title
    console.log(url,title)
    // 对象中是弹层的配置对象
    popup({
      width:'880px',
      height:'556px',
      title:title,
      mask:false,
      content(ele){
        console.log(ele, '是否是碳层显示区域')
        video({
          url,
          elem:ele,
          autoplay:true,
          muted:true
        })
      }
    })
  })
}