jQuery(document).ready(function ($) {
    $(function () {
        function createCookie(name, value, days) {
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                var expires = "; expires=" + date.toGMTString();
            }
            else var expires = "";
            document.cookie = name + "=" + value + expires + "; path=/";
        }

        function readCookie(name) {
            var nameEQ = name + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        }

        function eraseCookie(name) {
            createCookie(name, "", -1);
        }

        $('ul.tabs').each(function () {
            if($(this).find("li.checked").length){
                eraseCookie('tabCookie_' + $(this).attr("id"));
                createCookie('tabCookie_' + $(this).attr("id"), $(this).find("li.checked").index(), 365);
            }
            var cookie = readCookie('tabCookie_' + $(this).attr("id"));
            if (cookie) {
                $(this).find('li').eq(cookie).addClass('current').siblings().removeClass('current')
                    .parents('div.section').find('div.box').hide().eq(cookie).show();
            }
            else{
                var $tab = $(this).children("li").first();
                $tab.addClass('current').siblings().removeClass('current')
                    .parents('div.section').find('div.box').eq(0).fadeIn(350).siblings('div.box').hide();
                eraseCookie('tabCookie_' + $(this).attr("id"));
                createCookie('tabCookie_' + $(this).attr("id"), 0, 365);
            }
        })

        $('ul.tabs').on('click', 'li:not(.current)', function () {
            $(this).addClass('current').siblings().removeClass('current')
                .parents('div.section').find('div.box').eq($(this).index()).fadeIn(350).siblings('div.box').hide();
            var ulIndex = $(this).parent('ul.tabs').attr("id");
            eraseCookie('tabCookie_' + ulIndex);
            createCookie('tabCookie_' + ulIndex, $(this).index(), 365);
        });
    })
})