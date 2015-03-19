function categoryReload(){
    function openBranch(jQueryElement,noAnimation){
        jQueryElement.addClass('icon-minus-sign').removeClass('icon-plus-sign');
        if(noAnimation) 
        jQueryElement.parent().find('ul:first').show();
        else
        jQueryElement.parent().find('ul:first').slideDown();
    }
    function closeBranch(jQueryElement,noAnimation)
    {
        jQueryElement.addClass('icon-plus-sign').removeClass('icon-minus-sign');
        if(noAnimation)
        jQueryElement.parent().find('ul:first').hide();
        else
        jQueryElement.parent().find('ul:first').slideUp();
    }
    function toggleBranch(jQueryElement,noAnimation){
        if(jQueryElement.hasClass('icon-minus-sign'))
            closeBranch(jQueryElement,noAnimation);
        else
            openBranch(jQueryElement,noAnimation);
    }
    $('.column ul.tree.dhtml ul').parent().find("i.icon-plus-sign").remove();
    $('.column ul.tree.dhtml ul').prev().before("<i class='grower icon-minus-sign'></i>");
    $('.column ul.tree.dhtml ul li:last-child, .column ul.tree.dhtml li:last-child').addClass('last');
    $('.column ul.tree.dhtml i.grower.icon-minus-sign').addClass('icon-plus-sign').removeClass('icon-minus-sign').parent().find('ul:first').hide();
    $('.column ul.tree.dhtml').show();
    $('.column ul.tree.dhtml .selected').parents().each(function(){
        if($(this).is('ul'))
            toggleBranch($(this).prev().prev(),true);
    });
    toggleBranch($('.column ul.tree.dhtml .selected').prev(),true);
    $('.column ul.tree.dhtml i.grower').click(function(){
        toggleBranch($(this));
    });
};
$(document).ready(function(){
    $('#footer ul.tree ul').hide();
});







var responsiveflagMenu=false;
function menuChange(status){
    if(status=='enable')
    {
        $('#menu-wrap').removeClass('desktop').addClass('mobile').find('#menu-trigger').show();
        $(' #menu-custom').removeAttr('style');
        $('#menu-trigger i').removeClass('icon-minus-sign-alt').addClass('icon-plus-sign-alt');
    
        $('.mobile #menu-trigger').on('click touchstart',function(){
            var catUl=$(this).next('ul#menu-custom');
            var anotherFirst=$('.header-button').find('ul');
            var anotherSecond=$('#header').find('#cart_block');
            if(anotherFirst.is(':visible')){
                anotherFirst.slideUp();
                $('.header-button').find('.icon_wrapp').removeClass('active');
            }
            if(anotherSecond.is(':visible')){
                anotherSecond.slideUp();
                $('#header_user').removeClass('close-cart')
            }
            if(catUl.is(':hidden')){
                catUl.slideDown();
                $(this).find('i').removeClass('icon-plus-sign-alt').addClass('icon-minus-sign-alt');
            }
            else
            {
                catUl.slideUp(),$(this).find('i').removeClass('icon-minus-sign-alt').addClass('icon-plus-sign-alt');
            }
            return false;
        });
    
        $('#menu-wrap.mobile #menu-custom').on('click touchstart',function(e){e.stopPropagation();});
        $('.main-mobile-menu ul ul').addClass('menu-mobile-2');
        $('#menu-custom ul').addClass('menu-mobile-2');
        $('#menu-custom  li').has('.menu-mobile-2').prepend('<i class="open-mobile-2 icon-plus"></i>');
        $("#menu-custom .open-mobile-2").on('click touchstart',function(){
            var catSubUl=$(this).next().next('.menu-mobile-2');
            if(catSubUl.is(':hidden'))
            {
                catSubUl.slideDown();
                $(this).removeClass('icon-plus').addClass('icon-minus')
            }
            else
            {
                catSubUl.slideUp();
                $(this).removeClass('icon-minus').addClass('icon-plus');
            }
            return false;
        });
        $(document).on('click  touchstart',function(){
            $('.mobile #menu-trigger').find('i').removeClass('icon-minus-sign-alt').addClass('icon-plus-sign-alt');
            $('.mobile #menu-trigger').next('ul#menu-custom').slideUp();
        });
        return false;
    }
    else
    {
        $('#menu-wrap').removeClass('mobile').addClass('desktop'),$('#menu-custom  li').has('.menu-mobile-2').children('i').remove(),$('#menu-custom  li .menu-mobile-2, #menu-custom').removeAttr('style');
        $("#menu-custom   .open-mobile-2").off();
        $('#menu-wrap').find('#menu-trigger').off().hide();
    }
}
function menuChangeDo(){container_width=$('body').find('.container').width();if(container_width<=940&&responsiveflagMenu==false){menuChange('enable');responsiveflagMenu=true;}
else if(container_width>940){menuChange('disable');responsiveflagMenu=false;}}
$(document).ready(menuChangeDo);$(window).resize(menuChangeDo);;


    $(".compare-add").click(function () {
        var compare = $.cookie('shop_compare');
        
        if (compare) {
            compare += ',' + $(this).data('product');
        } else {
            compare = '' + $(this).data('product');
        }
        if (compare.split(',').length > 1) {
            var url = $("#compare-link").attr('href').replace(/compare\/.*$/, 'compare/' + compare + '/');
            $("#compare-link").attr('href', url).show().find('span.count').html(compare.split(',').length);
        }
        $.cookie('shop_compare', compare, { expires: 30, path: '/'});
        $(this).hide();
        $(".compare-remove").show();
        return false;
    });
    $(".compare-remove").click(function () {
        var compare = $.cookie('shop_compare');
        if (compare) {
            compare = compare.split(',');
        } else {
            compare = [];
        }
        var i = $.inArray($(this).data('product') + '', compare);
        if (i != -1) {
            compare.splice(i, 1)
        }
        $("#compare-link").hide();
        if (compare) {
            $.cookie('shop_compare', compare.join(','), { expires: 30, path: '/'});
        } else {
            $.cookie('shop_compare', null);
        }
        $(this).hide();
        $("compare-add").show();
        return false;
    });