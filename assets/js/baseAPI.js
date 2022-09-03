//注意：每次调用$.get()或$.post()或$.ajax()的时候
//会先调用ajaxPrefilter这个函数
//在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    //在发起真正的ajax请求之前，统一拼接请求的根路径
    options.url = 'http://127.0.0.1:3007' + options.url

    //  统一为有权限的接口设置headers请求头
    if(options.url.indexOf('/my') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
        console.log('/my');
    }

    //全局挂载complete
    options.complete = function(res) {
        //在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
        if(res.responseJSON.status ===1 && res.responseJSON.message === '身份认证失败！') {
            //清空token
            localStorage.removeItem('token')
            //强制跳转到登录页面
            location.href = './login.html'

        }

    }

})