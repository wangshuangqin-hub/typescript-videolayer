let styles = require('./video.css').default
// 定义播放器接口
interface Ivideo {
  url:string;
  elem:string | HTMLElement;
  width?:string;
  height?:string;
  autoplay?:boolean;
  muted?:boolean;//是否静音播放
}
// 约束类
// 用来约束类
interface Icomponent {
  tempContainer: HTMLElement
  init: () => void;//组件必须有初始化函数
  template:() => void;
  handle:() => void
}
function video (options:Ivideo) {
  return new Video(options)
}
class Video implements Icomponent {
  tempContainer;
  constructor (private settings: Ivideo) {
    this.settings = Object.assign({
      width:'100%',
      height:'100%',
      autoplay:false
    },this.settings)
    this.init()
  }
  init(){
    this.template()
    this.handle()
  }
  template(){
    this.tempContainer = document.createElement('div')
    this.tempContainer.className = styles['videocontainer']
    this.tempContainer.style.width = this.settings.width
    this.tempContainer.style.height = this.settings.height
    this.tempContainer.innerHTML = `
      <video class="${styles['video-content']}"
      src="${this.settings.url}"></video>
      <div class="${styles['video-controls']}">
        <div class="${styles['video-progress']}">
          <div class="${styles['video-progress-now']}"></div>
          <div class="${styles['video-progress-suc']}"></div>
          <div class="${styles['video-progress-bar']}"></div>
        </div>
        <div class="${styles['video-play']}">
          <i class="iconfont icon-play"></i>
        </div>
        <div class="${styles['video-time']}">
          <span>00:00</span> / <span>00:00</span>
        </div>
        <div style="float:right">
          <div class="${styles['video-playbackRate']}">
            <div class="${styles['video-playbackRate-btn']}">
              倍速
              <ul class="${styles['video-playbackRate-list']}">
                <li>2X</li>
                <li>1.5X</li>
                <li>1.25X</li>
                <li class="${styles['selected']}">1X</li>
                <li>0.75X</li>
                <li>0.5X</li>
              </ul>
            </div>
          </div>
          <div class="${styles['video-volume']}">
            <i class="iconfont icon-shengyin_shiti"></i>
            <div class="${styles['video-volprogress']}">
              <div class="${styles['video-volprogress-now']}"></div>
              <div class="${styles['video-volprogress-bar']}"></div>
            </div>
          </div>
          <div class="${styles['video-full']}">
            <i class="iconfont icon-quanping_o"></i>
          </div>
        </div>
      </div>
    `
    // 可以直接在页面上给定元素，如果没有给定，使用内部创建的dom结构
    if(typeof this.settings.elem == 'object') {
      this.settings.elem.appendChild(this.tempContainer)
    } else  {
      document.querySelector(`${this.settings.elem}`).appendChild(this.tempContainer)
    }
    
  }
  handle(){
    // 获取video事件
    let videoContent:HTMLVideoElement = this.tempContainer.querySelector(`.${styles['video-content']}`)
    // 获取工具栏按钮dom结构(类名获取，获取的是第一个i,后面的i不会被获取到))
    let videoControls = this.tempContainer.querySelector(`.${styles['video-controls']}`)
    let videoPlay = this.tempContainer.querySelector(`.${styles['video-controls']} i`)
    let videoTimes = this.tempContainer.querySelectorAll(`.${styles['video-time']} span`)
    let videoFull = this.tempContainer.querySelector(`.${styles['video-full']} i`)
    let videoProgress = this.tempContainer.querySelectorAll(`.${styles['video-progress']} div`)
    console.log(videoProgress)
    let videoVolProgress = this.tempContainer.querySelectorAll(`.${styles['video-volprogress']} div`)
    let videoplaybackRateUl = this.tempContainer.querySelector(`.${styles['video-playbackRate-list']}`)
    // 获取控制播放速率的元素
    let videoplaybackRateLi = this.tempContainer.querySelectorAll(`.${styles['video-playbackRate-list']} li`)
    // 获取倍速按钮，控制倍速选项出现
    let videoPlayBackRate = this.tempContainer.querySelector(`.${styles['video-playbackRate']}`)
    // 设置静音
    let videoMuted = this.tempContainer.querySelector(`.${styles['video-volume']} i`)
    // 指定默认音量
    videoContent.volume = 0.5
    // 制定默认播放速率
    videoContent.playbackRate = 1
    // 当前播放事件实时变化
    let timer;
    // 判断视频是否加载完毕
    console.log(videoPlay)
    videoContent.addEventListener('canplay',()=>{
      console.log('canplay,视频是否加载完毕')
      // 等待文佳加载完完毕之后渲染总时长
      videoTimes[1].innerHTML= formatTime(videoContent.duration)
    })
    // 是否静音播放
    if(this.settings.muted){
      videoContent.muted = true
      videoMuted.className ="iconfont icon-jingyin"
    }
    // 是否自动播放
    if(this.settings.autoplay){
      // 说明用户希望自动播放，那么进度条要动起来，
      videoContent.play()
    }
    videoPlayBackRate.addEventListener('mouseover',function(e:MouseEvent){
      videoplaybackRateUl.style.display = 'block'
    })
    videoPlayBackRate.addEventListener('mouseleave',function(e:MouseEvent){
      // setTimeout(() => {
        videoplaybackRateUl.style.display = 'none'
      // }, 2000);
    })
    // videoplaybackRateUl.addEventListener('mousemove',function(e:MouseEvent){
    //   videoplaybackRateUl.style.display = 'block'
    // })
    // 设置静音
    videoMuted.addEventListener('click',function(e:MouseEvent){
      videoContent.muted = !videoContent.muted
      if(videoContent.muted){//此时为静音状态
        videoMuted.className ="iconfont icon-jingyin"
      } else {
        videoMuted.className ="iconfont icon-shengyin_shiti"
      } 
    })
    // 给每个速率绑定事件
    for (let i = 0; i < videoplaybackRateLi.length; i++) {
      videoplaybackRateLi[i].addEventListener('click',function(e:MouseEvent){
        let playbackRate = videoplaybackRateLi[i].innerHTML
        // 每次点击之后，给当前元素设置独有的选中样式
        for (let j = 0; j < videoplaybackRateLi.length; j++) {
          videoplaybackRateLi[j].classList.remove(`${styles['selected']}`)
        }
        videoplaybackRateLi[i].classList.add(`${styles['selected']}`)
        playbackRate = playbackRate.slice(0,playbackRate.length-1)
        console.log(Number(playbackRate))
        videoContent.playbackRate = Number(playbackRate)
      })
    }
    // 控制控件区域消失与隐藏
    this.tempContainer.addEventListener('mouseenter',function(e:MouseEvent){
      videoControls.style.bottom = 0
      // 不是一直出现，当过5秒后，控件自动小时
      // let timer = setTimeout(() => {
      //   videoControls.style.bottom = -60+'px'
      //   // this.mouseleave()
      //   clearTimeout(timer)
      // }, 3000);
    })
    // this.tempContainer.addEventListener('mouseleave',function(e:MouseEvent){
    //   videoControls.style.bottom = -60+'px'
    // })
    // 当控件消失，用户再次操作鼠标时，控件出现
    // this.tempContainer.addEventListener('mousemove',function(e:MouseEvent){
    //   videoControls.style.bottom = 0
    //   let timer = setTimeout(() => {
    //     videoControls.style.bottom = -60+'px'
    //     // this.mouseleave()
    //     clearTimeout(timer)
    //   }, 3000);
    // })
    // 视频播放事件
    videoContent.addEventListener('play',()=>{
      videoPlay.className = "iconfont icon-zanting"
      timer = setInterval(playing,100)
    })
    videoContent.addEventListener('pause',()=>{
      videoPlay.className = "iconfont icon-play"
      clearInterval(timer)
    })
    // 视频的播放与暂定
    videoPlay.addEventListener('click',()=>{
      if(videoContent.paused){
        videoContent.play()
      } else {
        videoContent.pause()
      }
    })
    // 全屏
    videoFull.addEventListener('click',()=>{
      videoContent.requestFullscreen()
    })
    // 进度条拖拽事件
    videoProgress[2].addEventListener('mousedown',function(ev:MouseEvent){
      let downX = ev.pageX;
      let downL = this.offsetLeft;
      console.log(downX,downL,'小球的位置')
      document.onmousemove = (e:MouseEvent)=>{
        let scale = (e.pageX - downX + downL+8) / this.parentNode.offsetWidth;
        if(scale<0){
          scale = 0;
        } else if (scale > 1){
          scale = 1
        }
        videoProgress[0].style.width = scale * 100 +'%'
        // 缓存的进度条不用拖拽
        this.style.left = scale * 100 + '%'
        videoContent.currentTime = scale * videoContent.duration
      }
      // 鼠标弹起的时候解绑事件
      document.onmouseup = () =>{
        document.onmousemove = document.onmouseup = null
      }
      // 阻止默认事件，防止小bug
      ev.preventDefault()
    })
    // 控制视频音量
    videoVolProgress[1].addEventListener('mousedown',function(ev:MouseEvent){
      let downX = ev.pageX;
      let downL = this.offsetLeft;
      document.onmousemove = (e:MouseEvent)=>{
        let scale = (e.pageX - downX + downL+8) / this.parentNode.offsetWidth;
        if(scale<0){
          scale = 0;
        } else if (scale > 1){
          scale = 1
        }
        videoVolProgress[0].style.width = scale * 100 +'%'
        // 缓存的进度条不用拖拽
        this.style.left = scale * 100 + '%'
        videoContent.volume = scale
      }
      // 鼠标弹起的时候解绑事件
      document.onmouseup = () =>{
        document.onmousemove = document.onmouseup = null
      }
      // 阻止默认事件，防止小bug
      ev.preventDefault()
    })
    // 改变视频播放速率的时候会触发
    videoContent.addEventListener('ratechange',function(e:MouseEvent){
      console.log('是否修改了视频播放速率')
    })
    // 播放器进度（正在播放中）
    function playing(){
      let scale = videoContent.currentTime / videoContent.duration
      // 缓存时间
      let scaleSuc = videoContent.buffered.end(0) / videoContent.duration
      videoTimes[0].innerHTML = formatTime(videoContent.currentTime)
      // 设置当前播放进度
      videoProgress[0].style.width = scale * 100 + '%'
      // 设置缓存播放条
      videoProgress[1].style.width = scaleSuc *100 +'%'
      // 设置小球的位置
      videoProgress[2].style.left = scale * 100 +'%'
    }
    function formatTime(number:number):string {
      console.log(number,'当前是多少秒')
      number = Math.round(number)
      let max = Math.floor(number/60/60)
      let min = Math.floor((number-max*3600)/60)
      let sec = Math.floor((number-max*3600)%60)
      return setZero(max)+":"+setZero(min)+":"+setZero(sec)
    }
    // 补0操作
    function setZero(number:number):string {
      if(number<10){
        return '0'+number
      } else {
        return ''+number
      }
    }
  }
}
export default video;