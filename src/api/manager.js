import axios from "~/axios";

// 连接xshell
export function connect_xshell(host, port, user, password) {
    return axios.post("/xshell/connect", {
        host,
        port,
        user,
        password
    })
}

// 通过track_id查询日志
export function select_log(host, port, user, password, track_id, log_path) {
    return axios({
        method:'post',
        url:'/xshell/selectLog',
        data:{
            host,
             port,
              user,
               password,
                track_id,
                 log_path
        }
    })
}

// 通过时间绝对值查询日志
export function select_error_log(host, port, user, password, log_path, start_time, end_time) {
    return axios({
        method:'post',
        url:'/xshell/selectErrorLog',
        data:{
            host, port, user, password, log_path, start_time, end_time
        }
    })
}

// 连接数据库
export function connect_clickhouse(host, port, user, password) {
    return axios({
        method:'POST',
        url:'/clickhouse/connect',
        data:{
            host, port, user, password
        }
    })
}

// 查询数据库信息
export function clickhouse_query_log(host, port, user, password,start_time,end_time,databases,model,tables,like=null) {
    return axios({
        method:'POST',
        url:'/clickhouse/queryLog',
        data:{
            host, port, user, password,start_time,end_time,databases,model,tables,like
        }
    })

}

// 查询数据库相对时间信息
export function clickhouse_query_absolute_log(host, port, user, password,time_num,databases,model,tables,like=null) {
    return axios({
        method:'POST',
        url:'/clickhouse/queryAbsoluteLlog',
        data:{
            host, port, user, password,time_num,databases,model,tables,like
        }
    })
}