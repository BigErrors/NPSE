<template>
  <div class="npse">
    <go-top></go-top>
    <div class="header">
      <i>Natural Language Processing and Analysis Platform</i>
    </div>
    <div class="content">
      <div class="textInput">
        <p class="title">请输入演示文本：</p>
        <el-input
          type="textarea"
          :autosize="{ minRows: 3, maxRows: 6}"
          :placeholder="placeholder"
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
            <div class="resContent"
              v-loading="npseLoading" element-loading-spinner="el-icon-loading" element-loading-text='Wait a moment...'
            >
              <el-table
                stripe
                :data="npseData"
                :empty-text="npseNoDataText"
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
            <div class="resContent"
              v-loading="keLoading" element-loading-spinner="el-icon-loading" element-loading-text='Wait a moment...'
            >
              <div class="keTable">
                <el-table
                stripe
                :data="keData"
                max-height="400"
                :empty-text="keNoDataText"
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
              <div class="noData keNoData" v-if="keData.length === 0">{{keNoDataText}}</div>
              <div class="keTags">
                <div class="tag" :class="tagClass(value.weight)" v-for="(value, index) in keData" :key = index>{{value.word}}</div>
              </div>
            </div>
          </div>
          <div class="resultContent sa">
            <div class="title">语义联想</div>
            <div class="resContent" v-loading="saLoading" element-loading-spinner="el-icon-loading" element-loading-text='Wait a moment...'>
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
                    label="相似度"
                    width="180">
                  </el-table-column>
                </el-table>
              </div>
              <div class="noData saNodata" v-if="saData.length === 0">{{saNoDataText}}</div>
            </div>
          </div>
          <div class="resultContent wc">
            <div class="title">词云</div>
            <div class="resContent"
              v-loading="wcLoading" element-loading-spinner="el-icon-loading" element-loading-text='Wait a moment...'
            >
              <div class="noData wcNodata" v-if="wcData.length === 0">{{wcNoDataText}}</div>
              <word-cloud :data="wcData" v-else> </word-cloud>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="copyRight">
        <span><span class="ss">Copyright</span> © {{new Date().getFullYear()}} 攻城狮</span>
      </div>
      <div class="contact">
        <div class="icon github" @click="toGithub"></div>
        <div class="icon wechat" @click="getWechat">
        </div>
          <el-dialog
            title="扫描二维码添加微信"
            :visible.sync="dialogVisible"
            width="30%">
            <div class="wechatClass">
            </div>
          </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { getNPSEData, getKEData, getSAData, getWCData } from '@/api/api.js'
export default {
  name: 'npse',
  data () {
    return {
      placeholder: `    台湾工业总会是岛内最具影响力的工商团体之一，2008年以来，该团体连续12年发表对台当局政策的建言白皮书，集中反映岛内产业界的呼声。
    台湾工业总会指出，2015年的白皮书就特别提到台湾面临“五缺”（缺水、缺电、缺工、缺地、缺人才）困境，使台湾整体投资环境走向崩坏。然而四年过去，“五缺”未见改善，反而劳动法规日益僵化、两岸关系陷入紧张、对外关系更加孤立。该团体质疑，台当局面对每年的建言，“到底听进去多少，又真正改善了几多”？
    围绕当局两岸政策，工总认为，由数据来看，当前大陆不仅是台湾第一大出口市场，亦是第一大进口来源及首位对外投资地，建议台湾当局摒弃两岸对抗思维，在“求同存异”的现实基础上，以“合作”取代“对立”，为台湾多数民众谋福创利。`,
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
      wcData: [],
      npseNoDataText: '暂无数据',
      keNoDataText: '暂无数据',
      saNoDataText: '暂无数据',
      wcNoDataText: '暂无数据',
      npseLoading: false,
      keLoading: false,
      saLoading: false,
      wcLoading: false,
      dialogVisible: false
    }
  },
  methods: {
    commit () {
      if (this.textarea === '') {
        this.getNPSEData(this.placeholder)
        this.getKEData(this.placeholder)
        this.getSAData(this.placeholder)
        this.getWCData(this.placeholder)
      } else {
        this.getNPSEData(this.textarea)
        this.getKEData(this.textarea)
        this.getSAData(this.textarea)
        this.getWCData(this.textarea)
      }
      this.npseLoading = true
      this.saLoading = true
      this.keLoading = true
      this.wcLoading = true
    },
    async getNPSEData (prefix) {
      let res = await getNPSEData({ prefix: prefix })
      this.npseData = res.data
      this.npseLoading = false
      this.npseNoDataText = this.npseData.length === 0 ? '暂无新闻言论提取结果' : this.npseNoDataText
    },
    async getKEData (prefix) {
      let res = await getKEData({ prefix: prefix })
      this.keData = res.data
      this.keLoading = false
      this.keNoDataText = this.keData.length === 0 ? '暂无关键词提取结果' : this.keNoDataText
    },
    async getSAData (prefix) {
      let res = await getSAData({ prefix: prefix })
      this.saData = res.data
      this.saLoading = false
      this.saNoDataText = this.saData.length === 0 ? '暂无语义联想分析结果' : this.nsaNoDataText
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
      this.wcLoading = false
      this.wcNoDataText = this.wcData.length === 0 ? '暂无词云生成结果' : this.wcNoDataText
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
    },
    toGithub () {
      window.open('https://github.com/WenNicholas/nlp_assignment/tree/master/Project01', '_blank')
    },
    getWechat () {
      this.dialogVisible = true
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
