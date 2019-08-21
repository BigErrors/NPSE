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
          v-for="(value, key) in resultType"
          :key="key"
          :class="catalogClass(key)"
          @click="clickCatalog(key)"
          >{{value}}</div>
        </div>
        <div class="right">
          <div class="resultContent npse">
            <div class="title">新闻言论提取</div>
            <div class="resContent">
              <el-table
                :data="npseData"
                max-height="400"
                border
                style="width: 100%">
                <el-table-column
                  prop="name"
                  label="人/机构"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="trigger"
                  label="触发词"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="content"
                  label="内容">
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="resultContent ke">
            <div class="title">关键词提取</div>
            <div class="resContent">
              <div class="nodata" v-if="keData === ''">暂无数据</div>
            </div>
          </div>
          <div class="resultContent sa">
            <div class="title">语义联想</div>
            <div class="resContent">
              <div class="nodata" v-if="saData === ''">暂无数据</div>
            </div>
          </div>
          <div class="resultContent wc">
            <div class="title">词云</div>
            <div class="resContent">
              <div class="nodata" v-if="wcData === ''">暂无数据</div>
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
import { getNPSEData, getKEData } from '@/api/api.js'
export default {
  name: 'npse',
  data () {
    return {
      textarea: '',
      resultType: {
        news_person_speech_extraction: '新闻言论提取',
        keywords_extraction: '关键词提取',
        semantic_association: '语义联想',
        word_cloud: '词云'
      },
      checked: 'news_person_speech_extraction',
      npseData: [],
      keData: '',
      saData: '',
      wcData: ''
    }
  },
  methods: {
    test (value) {
      if (value === 'news_person_speech_extraction') {
        return this.npseData
      }
    },
    commit () {
      if (this.textarea === '') {
        this.$message({
          type: 'warning',
          message: '输入的演示文本不可为空'
        })
      } else {
        this.getNPSEData(this.textarea)
        this.getKEData(this.textarea)
      }
    },
    async getNPSEData (prefix) {
      let res = await getNPSEData({ prefix: prefix })
      this.npseData = res.data
    },
    async getKEData (prefix) {
      let res = await getKEData({ prefix: prefix })
      this.keData = res.data
    },
    catalogClass (value) {
      if (this.checked === value) {
        return 'checked ' + value
      } else {
        return value
      }
    },
    clickCatalog (value) {
      this.checked = value
    }
  }
}
</script>

<style lang="less" >
@import url('../assets/css/npse.less');
</style>
