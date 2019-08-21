<template>
  <div class="npse">
    <div class="header">
      <i>NEWS PERSON SPEECH EXTRACTION</i>
    </div>
    <div class="content">
      <div class="textInput">
        <p class="title">请输入演示文本：</p>
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 6}"
          placeholder="请输入内容"
          v-model="textarea">
        </el-input>
        <div class="commit">
          <el-button type="primary" @click="commit">提交</el-button>
        </div>
      </div>
      <div class="line">
        <el-divider content-position="left">分析结果</el-divider>
      </div>

      <div class="result">
        <div class="left">
          <div class="catalog"
          v-for="(item, index) in resultType"
          :key="index"
          :class="catalogClass(index)"
          @click="clickCatalog(index)"
          >{{item}}</div>
        </div>
        <div class="right">
          <div class="resultContent NSE_Res">
            <div class="title">新闻言论提取</div>
            <div class="resContent">
              {{resultContent}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <span>© 攻城狮 </span><span>1344294218@qq.com</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'npse',
  data () {
    return {
      textarea: '',
      resultType: ['新闻言论提取', '关键词提取', '词云', '分词'],
      checked: 0,
      resultContent: ''
    }
  },
  methods: {
    commit () {
      this.resultContent = 'this is test result'
    },
    catalogClass (index) {
      if (this.checked === index) {
        return 'checked catalog' + index
      } else {
        return 'catalog' + index
      }
    },
    clickCatalog (index) {
      this.checked = index
    }
  }
}
</script>

<style lang="less" >
@import url('../assets/css/npse.less');
</style>
