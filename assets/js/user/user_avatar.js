$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比 裁剪区域长/宽
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)

    //为上传按钮绑定点击事件
    //点击上传按钮时，实际触发的是这个input-file
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })

    //更换成用户选择的图片
    //为文件选择绑定change事件
    $('#file').on('change', function (e) {
        //e里面有个属性能获取到用户选择的图片
        var filelist = e.target.files
        if (filelist.length === 0) {
            return layui.layer.msg('请选择图片!')
        }

        //将图片渲染在页面
        //1、拿到用户选择的文件
        var file = e.target.files[0]
        //2、将文件转化为路径
        var imgURL = URL.createObjectURL(file)
        //3、重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

        //为确认按钮绑定点击事件
        $('#btnUpload').on('click', function (e) {
            //1、拿到用户裁剪过后的头像
            var dataURL = $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 100,
                    height: 100
                })
                .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串

                //2、调用ajax接口，把头像上传到服务器
                $.ajax({
                    method: 'POST',
                    url: '/my/update/avatar',
                    data: {
                        avatar: dataURL
                    },
                    success: function(res) {
                        if(res.status !== 0) {
                            return layui.layer.msg('更换头像失败!')
                        }
                        layui.layer.msg('更换头像成功!')
                        window.parent.getUserInfo()
                    }
                })
        })

    })
})