$(function() {
    //为这两个标签绑定点击事件

    //点击 去注册账号 的链接，做以下操作
    $('#link_reg').on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    //点击了 去登录 的链接，做以下操作
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //从layui 中获取 form对象
    var form = layui.form
    //获取layer对象
    var layer = layui.layer

    // 通过form.verify() 函数自定义校验规则
    form.verify({
        // 自定义一个pwd的校验规则
        pwd: [/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
        repwd: function(value) {
            //通过value拿到确认密码框里面的内容
            //并且拿到密码框的内容
            //进行一次等于判断
            //不相等，返回一个提示信息
            var pwd = $('.reg-box [name = password]').val()

            if(value !== pwd) return '两次密码不一致'
        }
    })

    var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
    //监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        //阻止表单的默认提交行为
        e.preventDefault()
        //发起post请求
        $.post('/api/reguser', data, function(res) {
            if(res.status !== 0) {
                layer.msg(res.message);
            }

            layer.msg('注册成功，请登录');
            //优化用户体验，模拟人的行为点击去登录，实现跳转
            $('#link_login').click()
        })
    })

    //监听登录表单的提交行为_方法1
/*     $('#form_login').on('submit', function(e) {
        e.preventDefault()

        //发起post请求
        $.post('http://127.0.0.1:3007/api/login', { username: $('#form_login [name=username]').val(), password: $('#form_login [name=password]').val() }, function(res) {
            if(res.status !== 0) {
                layer.msg(res.message);
            }

            layer.msg(res.message)
        })
    }) */

    //监听登录表单的提交行为_方法2
    $('#form_login').submit(function(e) {
        e.preventDefault()

        //发起ajax请求
        $.ajax({
            url: '/api/login',
            method: 'POST',
            //快速获取表单数据的方法
            data: $(this).serialize(),
            success:function(res){
                if (res.status !== 0) {
                    return layer.msg('登录失败!')
                }

                layer.msg('登录成功!')

                // console.log(res.token)
                //将登录成功得到的token 字符串，保存到 localStorage中
                localStorage.setItem('token', res.token)

                //跳转到后台主页
                location.href = './index.html'

            }
        })
    })
})