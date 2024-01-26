<template>
  <div>
    <div class="feedback">
      <el-card class="box-card">
        <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
          <el-tab-pane :label="`全部(${feedBackStore.allFeedBack.total})`" name="first">
            <el-table :data="feedBackStore.userFeedBack" style="width: 100%">
              <el-table-column prop="username" label="用户名" align="center" />
              <el-table-column prop="uuid" label="用户id" align="center" />
              <el-table-column
                :formatter="chooseContent"
                prop="type"
                label="用户反馈"
                align="center"
              />
              <el-table-column prop="version" label="用户版本" align="center" />
              <el-table-column prop="state" label="状态" align="center" />
              <el-table-column class="btn_operation" label="操作" align="center" v-slot="scope">
                <div class="details">
                  <el-button @click="btn_show = !btn_show">{{
                    btn_show && scope.row.id ? '快捷回复' : '已回复'
                  }}</el-button>

                  <a
                    href="javascript:void(0);"
                    class="details_title"
                    @click="viewDetail(scope.row.uuid)"
                    >查看详情</a
                  >
                </div>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane :label="`已查看(${feedBackStore.allFeedBack.total})`" name="second"
            >Config</el-tab-pane
          >
          <el-tab-pane label="未查看(20)" name="third">Role</el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <el-dialog v-model="dialogTableVisible">
      <text class="dialogTableVisible_title">反馈内容</text>
      <el-card class="box-card">
        <!-- <template #header>
        <div class="card-header">
          <span>反馈内容</span>
        </div>
      </template> -->
        <div class="demo-image__preview">
          <el-image
            style="width: 150px; height: 150px"
            :src="url"
            :zoom-rate="1.2"
            :max-scale="7"
            :min-scale="0.2"
            :preview-src-list="srcList"
            :initial-index="4"
            fit="cover"
            title="点击预览哦"
          />
        </div>
        <div class="card_title">
          <span>{{ feedBackContent }}</span>
        </div>
        <template #footer>
          <el-input v-model="textarea" :rows="7" type="textarea" placeholder="Please input" />
          <div class="card_btn">
            <el-button>取消</el-button>
            <el-button type="primary">发送</el-button>
          </div>
        </template>
      </el-card>
    </el-dialog>
    <pagination
      :total="feedBackStore.allFeedBack.total"
      :page="feedBackStore.allFeedBack.current"
      :limit="feedBackStore.allFeedBack.size"
      @pagination="clickToChange"
      class="pagination_feedBack"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, toRefs } from 'vue'
import type { TabsPaneContext } from 'element-plus'
import { useFeedBackStore } from '@/store/modules/feedback'
import { chooseContent } from '@/utils/chooseFeedBack'
import { changeStateAPI } from '@/api/feedback'
import { pageInfo } from '@/types/pageMessage'
//获取数据
const feedBackStore = useFeedBackStore()
const activeName = ref('first')
//打开反馈
const dialogTableVisible = ref(false)

//照片地址
const url = ref()

//预览照片地址
const srcList = ref<string[]>([])

//收到的反馈内容
const feedBackContent = ref('')
//文本框内容
const textarea = ref('回复')

//控制btn 按钮
const btn_show = ref(true)

//切换tab 栏
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
  feedBackStore.readInfo(0, 10)
}

//点击打开详情
const viewDetail = async (id: number) => {
  dialogTableVisible.value = true

  //通过 id 筛选出对应反馈信息
  let feedBacks = feedBackStore.userFeedBack.filter((item) => item.uuid === id)

  //赋值操作
  url.value = feedBacks[0].imageUrl[0]
  srcList.value = feedBacks[0].imageUrl

  // 赋值内容
  feedBackContent.value = feedBacks[0].content

  //判断 已读还是未读
  if (feedBacks[0].state === '未读') {
    //将未读改为已读
    await changeStateAPI(feedBacks[0].feedbackId, 0)
    //将状态改变
    feedBacks[0].state = '已读'
  }
}

// pagination 逻辑
const clickToChange = async (pageMessage: pageInfo) => {
  //更改页面信息
  feedBackStore.allFeedBack.current = pageMessage.currentPage
  feedBackStore.allFeedBack.size = pageMessage.pageLimit
  // 发送请求
  await feedBackStore.getAllFeedBack(pageMessage.currentPage, pageMessage.pageLimit)
}
feedBackStore.readInfo(0, 10, 1)
//获取数据
feedBackStore.getAllFeedBack(0, 10)
</script>

<style scoped lang="scss">
.text {
  font-size: 14px;
}

.el-card {
  margin: 14px 14px 14px 14px;
}
// .el-button {
//   padding-right: 20px;
// }
.details {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  .details_title {
    text-decoration: underline;
  }
}
.el-button {
  margin-right: 20px;
}
.card_img {
  width: 234px;
  height: 114px;
  background-color: bisque;
}
.card_title {
  margin-top: 25px;
}
.demo-image__error .image-slot {
  font-size: 30px;
}
.demo-image__error .image-slot .el-icon {
  font-size: 30px;
}
.demo-image__error .el-image {
  width: 100%;
  height: 200px;
}
.card_btn {
  margin-top: 10px;
  margin-left: 450px;
}
.card-header {
  color: #000;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.card_title {
  color: #9d9d9d;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.box-card {
  padding-top: 0px;
  box-shadow: none;
}
.dialogTableVisible_title {
  color: #000;
  margin-left: 14px;
  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}
.pagination_feedBack {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
