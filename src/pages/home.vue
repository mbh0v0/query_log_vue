<template>
    <div class="common-layout" style="height: 100%;">
        <el-container style="height: 100%;">
            <el-aside style="height: 100%;width=200px">
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
                    <el-space direction="vertical">
                        <el-image src="../../public/prothentic_logo.jpeg"></el-image>
                    </el-space>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
    
<script>

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