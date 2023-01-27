<template>
  <div class="lost-pwd-window">

  </div>
</template>

<script>

export default {
  name: "LostPwd",
  data() {
    return {

    }
  },
  methods:{
    showVerify(){
      this.$refs['lostPwdForm'].validate(valid => {
        if(valid){
          this.verifyWindowShow = true
        }
      })
    },
    verifySuccess(){
      this.$message.success('验证码已发送')
    },
    verifyError(){
      this.$message.error('滑动验证失败')
    }

  }
}
</script>

<style scoped>
.lost-pwd-window{
  width: 95%;
}
</style>
