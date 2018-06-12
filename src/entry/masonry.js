import 'jquery'
import 'common'
import 'sass/layout.scss'

$(function () {
    let count = 1,
        pageSize = 3
    const
        option = {
            data: {
                categoryId: 80,
                pageSize: pageSize,
                pageIndex: count,
            },
            timeout: 500,
            fixPath: 'img_url'
        },
        loading = $('.loadMore')

    //加载初始第一页数据
    yfd.api.getRows(option).then((res) => {
        res.total > res.data.length ?
            loading.show() :
            loading.hide();
        const data = {
            list: yfd.getLists(res)
        }
        yfd.render('infinite-loading', '.brand_info_box', data)
        animation('.proBox img', 'fade-in')
    })

    //滚动加载更多
    $(window).scroll(function () {
        if (isBottom()) {
            loadMore()
        }
    });

    function loadMore() {
        const option = {
            data: {
                categoryId: 80,
                pageSize: pageSize,
                pageIndex: ++count, //加载下一页数据
            },
            timeout: 500,
            fixPath: 'img_url'
        }
        //加载下一页数据，判断请求加载的总数据条数已经大于实际数据中的总数时，不再渲染html
        yfd.api.getRows(option).then(res => {
            const over = option.data.pageSize * option.data.pageIndex > res.total
            let data
            if (!!over) {
                data = {
                    list: []
                }
            } else {
                data = {
                    list: yfd.getLists(res)
                }
                loading.show()
            }

            if (option.data.pageSize * option.data.pageIndex >= res.total) {
                $('.loadMore')[0].innerHTML = '没有更多'
            }

            yfd.append('infinite-loading', '.brand_info_box', data)
            animation('.proBox img', 'fade-in')
        })
    }

    //加载完成时添加的动画
    function animation(className, animationName) {
        Array.from($(className)).forEach(v => {
            v.onload = function () {
                $(this).addClass(animationName)
            }
        })
    }

    //判断是否滚动到loading
    function isBottom() {
        var scrollTop = $(document).scrollTop(),
            docH = $(document).height(),
            winH = $(window).height();
        return scrollTop < docH - winH ? false : true;
    }
})