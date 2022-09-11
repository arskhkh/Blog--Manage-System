$(function () {
    var layer = layui.layer
    var form = layui.form
    //获取文章分类
    initCate()

    //定义获取文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败!')
                }
                //调用模板引擎，渲染
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //一定要记得调用form.render()方法
                form.render()
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()

    // 头像裁剪
    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    //为选择头像按钮绑定点击事件
    $('#imageChooseBtn').on('click', function () {
        $('#imageIpt').click()
    })

    //监听input,file的change事件，获取用户选择的文件列表
    $('#imageIpt').on('change', function (e) {
        //获取文件列表
        var files = e.target.files
        //判断用户是否选择了文件
        if (e.length === 0) {
            return
        }

        //根据文件，创建对应的url地址
        var newImgURL = URL.createObjectURL(files[0])

        //渲染图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    //设置文章状态，默认是已发布
    var art_state = '已发布'

    //为存为草稿按钮绑定点击事件
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    //监听表单的submit事件
    $('#form-pub').on('submit', function (e) {
        //1、阻止表单默认提交行为
        e.preventDefault()

        //2、基于form表单，快速创建一个formdata对象
        var fd = new FormData($(this)[0])

        //3、将文章发布状态存到formData中
        fd.append('state', art_state)

        //循环打印键值对
        // fd.forEach(function(v, k) {
        //     console.log(k, v);
        // })

        // 4、将裁剪后的图片输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { 
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5、将文件对象存储到fd
                fd.append('cover_img', blob)

                // 6、发起ajax请求
                publishArticle(fd)
            })
    })

    //定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //注意，如果向服务器提交的是FormData数据
            //必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('发布文章失败!')
                }
                layer.msg('发布文章成功!')
                //返回文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }

})