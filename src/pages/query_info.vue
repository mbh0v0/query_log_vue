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

                        <el-space>
                            <el-space direction="vertical">
                                <el-form :label-position="labelPosition">
                                    <el-form-item label="请选择额外的筛选条件：">
                                        <el-select v-model="select" placeholder="请选择额外的筛选条件">
                                            <el-option label="数据库名称" value="db_name"></el-option>
                                            <el-option label="表单名称" value="tb_name"></el-option>
                                            <el-option label="模型名称" value="md_name"></el-option>
                                            <el-option label="关键字(,)" value="like"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="开始时间：">
                                        <el-date-picker v-model="start_time" type="datetime"
                                            placeholder="选择开始时间"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="结束时间：">
                                        <el-date-picker v-model="end_time" type="datetime"
                                            placeholder="选择结束时间"></el-date-picker>
                                    </el-form-item>
                                </el-form>
                                <el-button @click="clickhouse_query_log1">根据绝对时间查询</el-button>
                            </el-space>
                            <el-space direction="vertical">
                                <el-form :label-position="labelPosition">
                                    <el-form-item label="&nbsp;">
                                        <el-input placeholder="请输入具体筛选条件" v-model="filter_cond"
                                            class="input-with-select"></el-input>
                                    </el-form-item>
                                    <el-form-item label="相对时间：(相当于当前时间之前的，单位(秒))">
                                        <el-input v-model="relative_time" type="number" placeholder="请输入相对时间"></el-input>
                                    </el-form-item>
                                    <el-form-item><br><br></el-form-item>
                                </el-form>
                                <el-button v-loading.fullscreen.lock="fullscreenLoading"
                                    @click="clickhouse_query_absolute_log1">根据相对时间查询</el-button>
                            </el-space>
                        </el-space>
                        <el-space direction="vertical" alignment="center">
                            <el-table :data="this.query_info.slice((currentPage - 1) * pageSize, currentPage * pageSize)" stripe
                                style="height:600px;width: 100%">
                                <el-table-column prop="initial_query_id" show-overflow-tooltip="true" label="查询ID"
                                    width="80"></el-table-column>
                                <el-table-column prop="query" label="查询SQL" show-overflow-tooltip="true" width="80">
                                </el-table-column>
                                <el-table-column prop="query_start_time" label="查询开始时间" show-overflow-tooltip="true"
                                    width="120">
                                </el-table-column>
                                <el-table-column prop="query_duration_ms" show-overflow-tooltip="true" label="消耗时间"
                                    width="80">
                                </el-table-column>
                                <el-table-column prop="event_time_microseconds" show-overflow-tooltip="true" label="查询精确时间"
                                    width="120"> </el-table-column>
                                <el-table-column prop="memory_useage" show-overflow-tooltip="true" label="消耗内存" width="80">
                                </el-table-column>
                                <el-table-column prop="formatReadableSize(memory_usage)" show-overflow-tooltip="true"
                                    label="消耗内存" width="80"> </el-table-column>
                                <el-table-column prop="databases" label="涉及数据库" show-overflow-tooltip="true" width="100">
                                </el-table-column>
                                <el-table-column prop="tables" label="涉及表" show-overflow-tooltip="true" width="80">
                                </el-table-column>
                                <el-table-column prop="read_rows" show-overflow-tooltip="true" label="读取行数" width="80">
                                </el-table-column>
                                <el-table-column prop="written_rows" show-overflow-tooltip="true" label="写入行数" width="80">
                                </el-table-column>
                                <el-table-column prop="exception" label="错误异常" show-overflow-tooltip="true" width="80">
                                </el-table-column>
                                <el-table-column prop="stack_trace" label="出错时详细执行信息" width="120"
                                    show-overflow-tooltip="true">
                                </el-table-column>
                                <el-table-column prop="type" label="QueryStart或者QueryFinsh" width="160"
                                    show-overflow-tooltip="true">
                                </el-table-column>
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
import { clickhouse_query_log, clickhouse_query_absolute_log } from '~/api/manager'
import { toast } from '~/composables/util'


export default defineComponent({


    data: function () {
        return {
            db_name: ref(''),
            tb_name: ref(''),
            md_name: ref(''),
            like: ref(''),
            start_time: ref(''),
            end_time: ref(''),
            relative_time: ref(''),
            query_info: [],
            currentPage: 1,
            fullscreenLoading: false,
            labelPosition: 'top',
            filter_cond: ref(''),
            select: ref(''),
            pageSize: 20,
            totalCount: ref(''),

        }
    },
    methods: {

        handleCurrentChange(val) {
            this.currentPage = val;
        },

        clickhouse_query_log1() {
            this.fullscreenLoading = true
            this.getQuery = this.$route.query;

            if (this.select === "db_name") {
                this.db_name = this.filter_cond
            }
            else if (this.select === "md_name") {
                this.md_name = this.filter_cond
            }
            else if (this.select === "tb_name") {
                this.tb_name = this.filter_cond
            }
            else if (this.select === "like") {
                this.like = this.filter_cond
            }

            clickhouse_query_log(this.getQuery.host, this.getQuery.port, this.getQuery.username, this.getQuery.password, this.start_time, this.end_time, this.db_name, this.md_name, this.tb_name, this.like.split(','))
                .then(res => {
                    if (res.data.status === "ok") {
                        this.query_info = res.data.content
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
        },

        clickhouse_query_absolute_log1() {
            this.fullscreenLoading = true
            this.getQuery = this.$route.query;
            if (this.select === "db_name") {
                this.db_name = this.select
            }
            else if (this.select === "md_name") {
                this.md_name = this.select
            }
            else if (this.select === "tb_name") {
                this.tb_name = this.select
            }
            else if (this.select === "like") {
                this.like = this.select
            }

            clickhouse_query_absolute_log(this.getQuery.host, this.getQuery.port, this.getQuery.username, this.getQuery.password, this.relative_time, this.db_name, this.md_name, this.tb_name, this.like.split(','))
                .then(res => {
                    if (res.data.status === "ok") {
                        this.query_info = res.data.content
                        this.totalCount = res.data.content.length
                        this.fullscreenLoading = false
                        this.$forceUpdate()
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


    }
})
</script>
    
<style>
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