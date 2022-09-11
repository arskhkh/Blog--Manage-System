$(function () {
    var layer = layui.layer
    var form = layui.form

    initArtCateList()

    //获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                // 调用template(),把定义好的模板和要渲染的数据传进去
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    var indexAdd = null

    //为添加分类按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px','250px'],
            title: '添加分类',
            // 拿到script定义的样式
            content: $('#dialog-add').html()
        });
    })

    //通过代理的方式为弹出层的表单添加submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('添加文章分类失败!' + res.message)
                }

                initArtCateList()
                layer.msg('添加文章分类成功!')

                //关闭弹出层
                layer.close(indexAdd)
            }
        })

    }) 

    var indexEdit = null
    //通过代理的方式为btn-edit绑定点击事件
    $('tbody').on('click', '#btn-edit', function(e) {
        indexEdit = layer.open({
            type: 1,
            area: ['500px','250px'],
            title: '修改文章分类',
            // 拿到script定义的样式
            content: $('#dialog-edit').html()
        });

        var id = $(this).attr('data-id')
        console.log(id);
        var edit_id = document.getElementById("edit_id")
        edit_id.value = id
        // console.log(edit_id.value);
        //发起请求获取数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res.data);
                form.val('form-edit', res.data)
            }
        })
    })

    //通过代理的形式，为form-edit的表单绑定submit事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()

        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                console.log(res);
                if(res.status !== 0) {
                    return layer.msg('更新文章分类失败!')
                }
                layer.msg('更新文章分类成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 因为表格是动态创建的，
    //通过代理的方式为btn-delete绑定点击事件
    $('tbody').on('click', '#btn-delete', function() {
        var id = $(this).attr('data-id')
        console.log(id);
        //提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method:'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if(res.status !== 0) {
                        return layer.msg('删除分类失败!')
                    }
                    layer.msg('删除分类成功!')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })

    
})