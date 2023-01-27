const state = {
    phone:'',
    code:''
}
const getters = {
    getPhone:state => {
        return state.phone
    },
    getCode:state => {
        return state.code
    }
}
const mutations = {
    setPhone(status,newVal){
        status.phone = newVal
    }
}
const actions = {

}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
