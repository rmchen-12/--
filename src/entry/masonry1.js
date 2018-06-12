import 'jquery'
import 'common'
import 'sass/layout.scss'

 $(function () {
     $(window).load(function () {
         divReload();
         scroll();
     })
     var mas = $('#masonry'),
         str = "";

     //滚到底部模拟加载更多
     function scroll() {
         $(window).scroll(function () {

             if (isBottom()) {
                 simulate();
             }
         });

     }
     
     //判断是否滚动到loading
     function isBottom() {
         var scrollTop = $(document).scrollTop(),
             docH = $(document).height(),
             winH = $(window).height();
         return scrollTop < docH - winH ? false : true;
     }

     //将HTML追加到页面并绑定瀑布流
     function divReload() {
         mas.masonry({
             itemSelector: '.proBox',
             gutter: 0,
             isAnimated: true,
             percentPosition: true
         });
     }

     //模拟数据
     function simulate() {
         for (var i = 2; i < 8; i++) {
             str += ['<li class="proBox"><a href="images/collection_' + i + '@640x960.jpg" data-fancybox="1"><img src="images/collection_' + i + '.jpg" alt=""></a></li>'].join("");
         }
         var html = $(str);
         mas.append(html).masonry("appended", html).masonry("layout");
         str = "";
     }

 })