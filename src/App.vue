<template>
  <div id="app">
    <home-header @icon-click="iconClick"></home-header>
    <transition :name="transitionName">
      <keep-alive>
        <router-view ref="component"/>
      </keep-alive>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import HomeHeader from '@/components/home/header'
import { getVersion } from '@/api/store'
import { saveShowLog } from '@/assets/js/localStorage'

// 禁止鼠标右击事件
window.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

export default {
  components: {
    HomeHeader
  },
  data () {
    return {
      version: '',
      transitionName: ''
    }
  },
  methods: {
    iconClick () {
      this.$refs.component.$refs.menu.menuShow()
    },
    downWgt () {
      /* eslint-disable */
      var wgtUrl = 'https://www.feizhouxianyu.cn/mood/update/update.wgt'
      plus.downloader.createDownload( wgtUrl, {filename:'_doc/update/'}, (d, status) => {
          if (status == 200) {
            // console.log('下载wgt成功：' + d.filename)
            this.installWgt(d.filename)
          } else {
            // console.log('下载wgt失败！')
          }
      }).start()
      /* eslint-enable */
    },
    installWgt (path) {
      /* eslint-disable */
      plus.runtime.install(path, {}, () => {
          // console.log('安装wgt文件成功！')
          saveShowLog(true)
          // plus.nativeUI.toast('<span>重启应用以完成更新</span>', {
          //   type: 'richtext'
          // })
          plus.io.resolveLocalFileSystemURL( path, (entry) => {
            entry.remove(() => {
              // console.log('删除成功')
              // 重启应用
              plus.runtime.restart()
            })
          })
      }, (e) => {
          // console.log('安装wgt文件失败[' + e.code + ']：' + e.message)
      })
      /* eslint-enable */
    }
  },
  watch: {
    $route (to, from) {
      if (to.name === 'detail' && from.name === 'index') {
        this.transitionName = 'slide-left'
      } else if (from.name === 'detail' && to.name === 'index') {
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = ''
      }
    }
  },
  created () {
    /* eslint-disable */
    document.addEventListener('plusready', () => {
      plus.runtime.getProperty(plus.runtime.appid, (inf) => {
        this.version = inf.version
        console.log('当前应用版本：' + this.version)
        getVersion().then((res) => {
          console.log('最新版本' + res.data)
          if (res.data > this.version) {
            this.$createDialog({
              type: 'confirm',
              title: '发现新版本，是否更新',
              confirmBtn: {
                text: '立刻更新',
                active: true,
                disabled: false,
                href: 'javascript:;'
              },
              cancelBtn: {
                text: '算了',
                active: false,
                disabled: false,
              },
              onConfirm: () => {
                this.downWgt()
                this.$createToast({
                  type: 'loading',
                  time: 0,
                  txt: '正在更新',
                  mask: true
                }).show()
              }
            }).show()
          }
        })
      })
    },false)
    /* eslint-enable */
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" sccped>
body
  background #ddd
</style>
