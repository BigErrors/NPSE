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
          @click="setAnchor(key)"
          >{{value}}</div>
        </div>
        <div class="right" id="right">
          <div class="resultContent npse">
            <div class="title">新闻言论提取</div>
            <div class="resContent">
              <el-table
              stripe
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
              <div class="keTable">
                <el-table
                stripe
                :data="keData"
                max-height="400"
                border
                style="width: 100%">
                  <el-table-column
                    prop="word"
                    label="名称"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="weight"
                    label="权重"
                    width="180">
                  </el-table-column>
                </el-table>
              </div>
              <div class="keTags">
                <div class="tag" :class="tagClass(value.weight)" v-for="(value, index) in keData" :key = index>{{value.word}}</div>
              </div>
            </div>
          </div>
          <div class="resultContent sa">
            <div class="title">语义联想</div>
            <div class="resContent">
              <div class="table" v-for="(value, index) in saData" :key="index">
                <div class="tableTitle">关键词： {{value.keyword}}</div>
                <el-table
                stripe
                :data="value.array"
                max-height="400"
                border
                style="width: 100%">
                  <el-table-column
                    prop="word"
                    label="名称"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="weight"
                    label="权重"
                    width="180">
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
          <div class="resultContent wc">
            <div class="title">词云</div>
            <div class="resContent">
              <word-cloud :data="wcData"> </word-cloud>
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
import { getNPSEData, getKEData, getSAData, getWCData } from '@/api/api.js'
import wordCloud from '@/components/WordCloud'
export default {
  name: 'npse',
  components: {
    wordCloud
  },
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
      keData: [],
      saData: [
      ],
      wcData: []
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
        this.getSAData(this.textarea)
        this.getWCData(this.textarea)
      }
    },
    async getNPSEData (prefix) {
      let res = await getNPSEData({ prefix: prefix })
      this.npseData = res.data
      // this.npseData = res
    },
    async getKEData (prefix) {
      let res = await getKEData({ prefix: prefix })
      this.keData = res.data
      // this.keData = res
    },
    async getSAData (prefix) {
      let res = await getSAData({ prefix: prefix })
      this.saData = res.data
    },
    async getWCData (prefix) {
      let res = await getWCData({ prefix: prefix })
      this.wcData = res.data
      this.wcData.forEach(ele => {
        ele.name = ele.word
        ele.value = ele.weight
        delete ele['word']
        delete ele['weight']
      })
      this.$forceUpdate()
    },
    catalogClass (value) {
      if (this.checked === value) {
        return 'checked ' + value
      } else {
        return value
      }
    },
    tagClass (weight) {
      if (weight >= 0.9) {
        return 'level1'
      } else if (weight > 0.8) {
        return 'level2'
      } else if (weight > 0.6) {
        return 'level3'
      } else if (weight > 0.4) {
        return 'level4'
      } else {
        return 'level5'
      }
    },
    setAnchor (position) {
      let heightArr = []
      let sum = 0
      let divRight = document.getElementById('right')
      let divRightChildren = divRight.children

      for (let i = 0; i < divRightChildren.length; i++) {
        sum += (divRightChildren[i].scrollHeight + 20)
        heightArr.push(sum)
      }
      let positionMap = {
        'news_person_speech_extraction': 0,
        'keywords_extraction': heightArr[0],
        'semantic_association': heightArr[1],
        'word_cloud': heightArr[2]
      }
      if (position) {
        divRight.scrollTop = positionMap[position]
        this.checked = 'word_cloud'
      } else {
        if (divRight.scrollTop < heightArr[0] - 100) {
          this.checked = 'news_person_speech_extraction'
        } else if (divRight.scrollTop < heightArr[1] - 100) {
          this.checked = 'keywords_extraction'
        } else if (divRight.scrollTop < heightArr[2] - 100) {
          divRight.scrollHeight - divRight.scrollTop === 500 ? this.checked = 'word_cloud' : this.checked = 'semantic_association'
        } else {
          this.checked = 'word_cloud'
        }
      }
    }
  },
  mounted () {
    let _this = this
    this.$nextTick(() => {
      document.getElementById('right').onscroll = () => {
        _this.setAnchor()
      }
    })
  }
}
</script>

<style lang="less" >
@import url('../assets/css/npse.less');
</style>
