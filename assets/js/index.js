var layer = layui.layer

$(function() {
    getUserInfo()

    //用户点击了退出，需要先弹出询问框，让用户做选择
    $('#btnLogout').on('click', function() {
        layer.confirm('退出登录？', {icon: 3, title:'提示'}, function(index){
            //1、先清除掉token
            localStorage.removeItem('token')
            //2、跳转到登录页
            location.href = './login.html'
            
            //关闭询问框
            layer.close(index);
        });
    })
})

//获取用户信息的函数
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        method: 'GET',
        // headers就是请求头配置对象
        /* headers: {
            Authorization: localStorage.getItem('token') || ''
        }, */
        success: function(res) {
            if (res.status !== 0) {
                return layer.msg('获取用户信息失败')
            }
            //渲染界面
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        },
        //在jQuery的ajax请求中，无论成功失败，都会调用complete回调函数
        /* complete: function(res) {
            //在complete回调函数中，可以使用res.responseJSON拿到服务器响应回来的数据
            if(res.responseJSON.status ===1 && res.responseJSON.message === '身份认证失败！') {
                //清空token
                localStorage.removeItem('token')
                //强制跳转到登录页面
                location.href = './login.html'

            }

        } */
    }) 

}

function renderAvatar(user) {
    //判断用户是否有nickname，如果有，显示nickname,否则显示username
    //1、获取用户名称
    var name = user.nickname || user.username
    //2、渲染
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    //3、按需渲染用户头像，没有头像，显示名称的第一个大写字
    if(user.user_pic !== null) {
        //3.1有图片，渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    }else {
        //3.2没有图片，渲染文字头像
        $('.layui-nav-img').hide()
        //获得第一个文字信息
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}