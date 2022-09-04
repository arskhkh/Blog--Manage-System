//layui校验用户的输入
var form = layui.form
$(function() {

    form.verify({
        nickname : function(value) {
            if(value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })

    //先获取到用户信息显示
    initUserInfo()

    //监听表单提交事件
    $('#form_revise').on('submit', function(e) {
        e.preventDefault()
        //发起post请求
        $.ajax({
            url: '/my/userinfo',
            method: 'POST',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('更新用户信息失败！')

                }
                layer.msg('更新用户信息成功！')
                //调用父页面的方法，重新渲染用户头像和用户信息
                window.parent.getUserInfo()
            }
        })
    })

    //重置表单数据
    $('#btnRest').on('click', function(e) {
        //阻止表单默认提交行为
        e.preventDefault()
        //数据又回到了存储在数据库里的信息状态
        initUserInfo()
    })
})

//获取用户信息函数
function initUserInfo() {
    var layer = layui.layer
    
    //发起get请求
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function(res) {
            if(res.status !== 0) {
                return layer.msg('获取用户信息失败')
            }
            // console.log(res);
            //将用户信息渲染到页面,layui表单快速赋值
            form.val('formUserInfo', res.data)
        }
    })
}