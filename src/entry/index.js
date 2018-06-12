import 'jquery'
import 'sass/layout.scss'
import './common.js'

$(function () {
    /* 渲染首页轮播图 */
    {
        const ids = [146, 147]
        Promise.all(proms(ids)).then(res => {
            const data = {
                list: yfd.getListArr(res)
            }
            yfd.render('swiper-list', '.swiper-wrapper', data)
            const swiper = new Swiper('.arrival_banner', {
                pagination: {
                    el: '.swiper-pagination',
                },
                autoplay: true,
                loop: true,
                paginationClickable: true,
                autoplayDisableOnInteraction: false
            })

            // $('.banner').each(function () {
            //     this.onload = function () {
            //         document.querySelector('.loading_wrap').style.display = 'none'
            //     }
            // })

            $('.loading_wrap').hide()
        })
    }

    /* 渲染滑动模块  */
    {
        const ids = [146, 147]
        Promise.all(proms(ids)).then(res => {
            const data = {
                list: yfd.getListArr(res)
            }
            yfd.render('swiper-list1', '.swiper-wrapper1', data)
            const swiper = new Swiper('.arrival_slide', {
                slidesPerView: 'auto'
            })
        })
    }

    /* 渲染主体内容 */
    {
        const ids = [1813, 1809, 1812, 1808]
        Promise.all(proms(ids)).then(res => {
            const data = {
                list: yfd.getListArr(res),
            }
            yfd.render('common', '.common_box', data)
        })
    }

    function proms(arr) {
        return arr.map(v => {
            return yfd.api.getRow(v)
        })
    }
})