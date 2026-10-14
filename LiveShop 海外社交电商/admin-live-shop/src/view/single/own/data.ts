import {reactive} from "vue"

const compData = reactive({
    formItem: {
        username: "",
        rePassword: "",
        nickname: "",
        oldPassword: "",
        password: "",
    }
})

export {
    compData
}
