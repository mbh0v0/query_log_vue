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
                        <el-space wrap>
                            <el-button @click="connect_clickhouse">测试连接</el-button>
                            <el-button @click="jump">确定</el-button>
                        </el-space>
                    </el-space>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
    
<script>

import { defineComponent, ref, reactive } from 'vue'
import { connect_clickhouse } from '~/api/manager'
import { toast } from '~/composables/util'


export default defineComponent({
    setup() {
        return {
            port: ref(''),
            host: ref(''),
            username: ref(''),
            password: ref(''),
            labelPosition:'top',
        }
    },
    methods: {
        connect_clickhouse() {
            connect_clickhouse(this.host, this.port, this.username, this.password)
                .then(res => {
                    if (res.data.status === "ok") {
                        toast("连接成功", "success")
                    } 
                    else {
                        toast(res.data.content, "warning")
                    }
                })
                .catch(err => {
                    toast(err.content, "error")
                })
        },
        jump(){
            connect_clickhouse(this.host, this.port, this.username, this.password)
                .then(res => {
                    if (res.data.status === "ok") {
                        this.$router.push({path:'/query_info', query:{host: this.host, port: this.port, username: this.username, password: this.password}})
                    } 
                    else {
                        toast(res.data.content, "warning")
                    }
                })
                .catch(err => {
                    toast(err.content, "error")
                })
        }
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