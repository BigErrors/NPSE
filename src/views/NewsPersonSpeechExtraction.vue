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
        <span>攻城狮 ©{{new Date().getFullYear()}}</span>
      </div>
      <div class="contact">
        <div class="icon github" @click="toGithub"></div>
        <div class="icon wechat" @click="getWechat">
          <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <span>这是一段信息</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
          </el-dialog>
        </div>
        <div class="icon email" @click="getEmail"></div>
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
      window.open('https://www.baidu.com/', '_blank')
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
