import { ElMessage } from 'element-plus'

export function toast(message, type = "success") {
    ElMessage({
        message: message,
        type
    })
}