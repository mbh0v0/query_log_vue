<template>
  <div class="common-layout" style="height: 100%;">
    <el-container style="height: 100%;">
      <el-aside style="height: 100%;width=200px">
        <!-- <el-image style="width: 200px; height: 10%" :src="url" ></el-image> -->
        <el-menu class="el-menu-vertical-demo" router :default-active="this.$route.path">
          <el-menu-item index="/home">
            <i class="el-icon-menu"></i>
            <template #title>首页</template>
          </el-menu-item>
          <el-menu-item index="/query_log">
            <i class="el-icon-menu"></i>
            <template #title>查询日志</template>
          </el-menu-item>
          <el-menu-item index="/db_conn">
            <i class="el-icon-menu"></i>
            <template #title>数据库查询</template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container style="height: 100%;">
        <!-- <el-header style="height: 10%;">头部</el-header> -->
        <el-main style="height: 100%;">
          <el-space direction="vertical" alignment="flex-start">

            <el-form :label-position="labelPosition">
              <el-form-item label="主机：">
                <el-input v-model="host" placeholder="请输入主机">主机：</el-input>
              </el-form-item>
              <el-form-item label="端口：">
                <el-input v-model="port" placeholder="请输入端口">端口：</el-input>
              </el-form-item>
              <el-form-item label="用户名称：">
                <el-input v-model="username" placeholder="请输入用户名称">用户名称：</el-input>
              </el-form-item>
              <el-form-item label="用户密码：">
                <el-input v-model="password" show-password placeholder="请输入密码">密码：</el-input>
              </el-form-item>
            </el-form>


            <el-space>
              <el-space direction="vertical">
                <el-form :label-position="labelPosition">
                  <el-form-item label="请求ID：">
                    <el-input v-model="request_id" placeholder="请输入请求id">请求id</el-input>
                  </el-form-item>
                  <el-form-item label="日志地址：">
                    <el-input v-model="log_address" placeholder="请输入日志地址">请输入日志地址 日志格式为/xx/logs/</el-input>
                  </el-form-item>
                </el-form>
                <el-button v-loading.fullscreen.lock="fullscreenLoading" @click="select_log">根据请求id查询日志</el-button>

              </el-space>
              <el-space direction="vertical">
                <el-form :label-position="labelPosition">
                  <el-form-item label="开始时间：">
                    <el-date-picker v-model="start_time" type="datetime" placeholder="请选择开始时间"></el-date-picker>
                  </el-form-item>
                  <el-form-item label="结束时间：">
                    <el-date-picker v-model="end_time" type="datetime" placeholder="请选择结束时间"></el-date-picker>
                  </el-form-item>
                </el-form>
                <el-button v-loading.fullscreen.lock="fullscreenLoading" @click="select_error_log">根据时间段查询日志</el-button>
              </el-space>
            </el-space>

            <el-space direction="vertical" alignment="center">
              <el-table :data="this.tableData.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe
                style="height:600px;width: 100%">
                <el-table-column prop="time" label="时间" show-overflow-tooltip="true" width="200"> </el-table-column>
                <el-table-column prop="server" label="服务" show-overflow-tooltip="true" width="200"> </el-table-column>
                <el-table-column prop="type" label="错误类型" show-overflow-tooltip="true" width="150"> </el-table-column>
                <el-table-column prop="info" label="详情" width="400" show-overflow-tooltip="true"> </el-table-column>
                <el-pagination layout="prev, pager, next" :total="20"> </el-pagination>
              </el-table>

              <el-pagination :align='center' @current-change="handleCurrentChange" :page-size="pageSize"
                layout="prev, pager, next" :total="totalCount" :current-page="currentPage">
              </el-pagination>
            </el-space>

          </el-space>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
    
<script>
import { defineComponent, ref, reactive } from 'vue'
import { select_log, select_error_log } from '~/api/manager'
import { toast } from '~/composables/util'



export default defineComponent({
  data: function () {
    return {
      input: ref(''),
      port: ref(''),
      host: ref(''),
      username: ref(''),
      password: ref(''),
      request_id: ref(''),
      log_address: ref(''),
      start_time: ref(''),
      end_time: ref(''),
      tableData: [],
      fullscreenLoading: false,
      labelPosition: 'top',
      currentPage: 1,
      pageSize: 20,
      totalCount: ref(''),
    }
  },
  methods: {

    handleCurrentChange(val) {
      this.currentPage = val;
    },

    select_log() {
      this.fullscreenLoading = true
      select_log(this.host, this.port, this.username, this.password, this.request_id, this.log_address)
        .then(res => {
          if (res.data.status === "ok") {
            this.tableData = res.data.content
            this.fullscreenLoading = false
            this.totalCount = res.data.content.length
            toast("查询成功", "success")
          } else {
            this.fullscreenLoading = false
            toast(res.data.content, "warning")
          }
        })
        .catch(err => {
          this.fullscreenLoading = false
          toast(err.content, "error")
        })
    },
    select_error_log() {
      this.fullscreenLoading = true
      select_error_log(this.host, this.port, this.username, this.password, this.log_address, this.start_time, this.end_time)
        .then(res => {
          if (res.data.status === "ok") {
            this.tableData = res.data.content
            this.totalCount = res.data.content.length
            this.fullscreenLoading = false
            toast("查询成功", "success")
          } else {
            this.fullscreenLoading = false
            toast(res.data.content, "warning")
          }
        })
        .catch(err => {
          this.fullscreenLoading = false
          toast(err.content, "error")
        })
    }
  }
})
</script>
    
<style>
.el-col {
  border-radius: 4px;
}

.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: var(--el-text-color-primary);
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: var(--el-text-color-primary);
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: var(--el-text-color-primary);
  line-height: 160px;
}

body>.el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>