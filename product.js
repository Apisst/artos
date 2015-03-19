function currency_format(number, no_html) {
    // Format a number with grouped thousands
    //
    // +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +	 bugfix by: Michael White (http://crestidg.com)

    var i, j, kw, kd, km;
    var decimals = currency.frac_digits;
    var dec_point = currency.decimal_point;
    var thousands_sep = currency.thousands_sep;

    // input sanitation & defaults
    if( isNaN(decimals = Math.abs(decimals)) ){
        decimals = 2;
    }
    if( dec_point == undefined ){
        dec_point = ",";
    }
    if( thousands_sep == undefined ){
        thousands_sep = ".";
    }

    i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

    if( (j = i.length) > 3 ){
        j = j % 3;
    } else{
        j = 0;
    }

    km = (j ? i.substr(0, j) + thousands_sep : "");
    kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
    //kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).slice(2) : "");
    kd = (decimals && (number - i) ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");


    var number = km + kw + kd;
    var s = no_html ? currency.sign : currency.sign_html;
    if (!currency.sign_position) {
        return s + currency.sign_delim + number;
    } else {
        return number + currency.sign_delim + s;
    }
}

$(function () {

    var service_variant_html = function (id, name, price) {
        return '<option data-price="' + price + '" id="service-variant-' + id + '" value="' + id + '">' + name + ' (+' + currency_format(price, 1) + ')</option>';
    }

    var update_sku_services = function (sku_id) {
        $("div.stocks div").hide();
        $("#sku-" + sku_id + "-stock").show();
        for (var service_id in sku_services[sku_id]) {
            var v = sku_services[sku_id][service_id];
            if (v === false) {
                $("#service-" + service_id).hide().find('input,select').attr('disabled', 'disabled').removeAttr('checked');
            } else {
                $("#service-" + service_id).show().find('input').removeAttr('disabled');
                if (typeof (v) == 'string') {
                    $("#service-" + service_id + ' .service-price').html(currency_format(v));
                    $("#service-" + service_id + ' input').data('price', v);
                } else {
                    var selected_variant_id = $("#service-" + service_id + ' .service-variants').data('variant-id');
                    for (var variant_id in v) {
                        var obj = $("#service-variant-" + variant_id);
                        if (v[variant_id] === false) {
                            obj.hide();
                        } else {
                            if (!selected_variant_id) {
                                selected_variant_id = variant_id;
                            }
                            obj.replaceWith(service_variant_html(variant_id, v[variant_id][0], v[variant_id][1]));
                        }
                    }
                    $("#service-" + service_id + ' .service-variants').val(selected_variant_id);
                }
            }
        }
    }

    function cart_button_visibility(visible)
    {
        //toggles "Add to cart" / "%s is now in your shopping cart" visibility status
        if (visible)
        {
            $('.add2cart .compare-at-price').show();
            $('.add2cart input[type="submit"]').show();
            $('.add2cart .price').show();
            $('.add2cart .qty').show();
            $('.add2cart span.added2cart').hide();
        }
        else
        {
            //$('.add2cart .compare-at-price').hide();
            //$('.add2cart input[type="submit"]').hide();
            //$('.add2cart .price').hide();
            //$('.add2cart .qty').hide();
            //$('.add2cart span.added2cart').show();
        }
    }

    $("#product-skus input[type=radio]").click(function () {
        if ($(this).data('image-id')) {
            $("#product-image-" + $(this).data('image-id')).click();
        }
        if ($(this).data('disabled')) {
            $(".add2cart input[type=submit]").attr('disabled', 'disabled');
        } else {
            $(".add2cart input[type=submit]").removeAttr('disabled');
        }
        var sku_id = $(this).val();
        update_sku_services(sku_id);
        cart_button_visibility(true);
        update_price();
    });
    $("#product-skus input[type=radio]:checked").click();

    $("select.sku-feature").change(function () {
        var key = "";
        $("select.sku-feature").each(function () {
            key += $(this).data('feature-id') + ':' + $(this).val() + ';';
        });
        var sku = sku_features[key];
        if (sku) {
            if (sku.image_id) {
                $("#product-image-" + sku.image_id).click();
            }
            update_sku_services(sku.id);
            if (sku.available) {
                $(".add2cart input[type=submit]").removeAttr('disabled');
            } else {
                $(".add2cart input[type=submit]").attr('disabled', 'disabled');
            }
            $(".add2cart .price").data('price', sku.price);
            update_price(sku.price, sku.compare_price);
        } else {
            $("div.stocks div").hide();
            $("#sku-no-stock").show();
            $(".add2cart input[type=submit]").attr('disabled', 'disabled');
            $(".add2cart .compare-at-price").hide();
            $(".add2cart .price").empty();
        }
        cart_button_visibility(true);
    });
    $("select.sku-feature:first").change();

    function update_price(price, compare_price)
    {
        if (price === undefined) {
            if ($("#product-skus input:radio:checked").length) {
                var price = parseFloat($("#product-skus input:radio:checked").data('price'));
                var compare_price = parseFloat($("#product-skus input:radio:checked").data('compare-price'));
            } else {
                var price = parseFloat($(".add2cart .price").data('price'));
            }
        }
        if (compare_price) {
            if (!$(".add2cart .compare-at-price").length) {
                $(".add2cart").prepend('<span class="compare-at-price nowrap"></span>');
            }
            $(".add2cart .compare-at-price").html(currency_format(compare_price)).show();
        } else {
            $(".add2cart .compare-at-price").empty().hide();
        }
        $("#cart-form .services input:checked").each(function () {
            var s = $(this).val();
            if ($('#service-' + s + '  .service-variants').length) {
                price += parseFloat($('#service-' + s + '  .service-variants :selected').data('price'));
            } else {
                price += parseFloat($(this).data('price'));
            }
        });
        $(".add2cart .price").html(currency_format(price));
    }

    if (!$("#product-skus input:radio:checked").length) {
        $("#product-skus input:radio:enabled:first").attr('checked', 'checked');
    }

    if ($("a.easyzoom").length) {
        $("a.easyzoom").easyZoom({parent: '#product-core-image'});
    }

    // product images
    $("#product-gallery a").click(function () {
        $('.gallery .image').removeClass('selected');
        $(this).parent().addClass('selected');

        $("#product-core-image div.loading").remove();
        $("#product-core-image").append('<div class="loading" style="position: absolute; left: 192px; top: ' + (($("#bigpic").height() - 16)/2) + 'px"><i class="icon16 loading"></i></div>');
        
        var img = $(this).find('img');
        var size = $("#bigpic").attr('src').replace(/^.*\/[0-9]+\.(.*)\..*$/, '$1');
        var src = img.attr('src').replace(/^(.*\/[0-9]+\.)(.*)(\..*)$/, '$1' + size + '$3');
        $('<img>').attr('src', src).load(function () {
            $("#mousetrap_img").attr('src', src);
            $("#bigpic").attr('src', src);
            $("#product-core-image div.loading").remove();
        }).each(function() {
            //ensure image load is fired. Fixes opera loading bug
            if (this.complete) { $(this).trigger("load"); }
        });
        var size = $("#bigpic").parent().attr('href').replace(/^.*\/[0-9]+\.(.*)\..*$/, '$1');
        var href = img.attr('src').replace(/^(.*\/[0-9]+\.)(.*)(\..*)$/, '$1' + size + '$3');
        $("#mousetrap_img").parent().attr('href', href);
        $("a.easyzoom").easyZoom({parent: '#product-core-image'});
        return false;
    });

    // add to cart block: services
    $(".cart .services input[type=checkbox]").click(function () {
    
        var obj = $('select[name="service_variant[' + $(this).val() + ']"]');
        if (obj.length) {
            if ($(this).is(':checked')) {
                obj.removeAttr('disabled');
            } else {
                obj.attr('disabled', 'disabled');
            }
        }
        cart_button_visibility(true);
        update_price();
    });

    $(".cart .services .service-variants").on('change', function () {
        cart_button_visibility(true);
        update_price();
    });

    // compare block
    $("a.compare-add").click(function () {
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
        $("a.compare-remove").show();
        return false;
    });
    $("a.compare-remove").click(function () {
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
        $("a.compare-add").show();
        return false;
    });

    $("#cart-form").submit(function () {
        var f = $(this);
        $.post(f.attr('action') + '?html=1', f.serialize(), function (response) {
            if (response.status == 'ok') {
                var cart_total = $(".cart-total");
                var cart_div = f.closest('.cart');
                
                cart_total.closest('#cart').removeClass('empty');
                cart_total.html(response.data.total);

                cart_button_visibility(false);

                if (f.data('cart')) {
                    $(".container > .content").load(location.href, function () {
                        $("#dialog").hide().find('.cart').empty();
                    });
                }
                if (response.data.error) {
                    alert(response.data.error);
                }
            } else if (response.status == 'fail') {
                alert(response.errors);
            }
        }, "json");
        return false;
    });
    
  
});

function add_cart(product_id,tmp_inp){
    $(".top_bar2").css("display","block");
    var quantity = 0;
    var count = $("#shopping_cart .ajax_cart_quantity").html();
    if (count!=0) $(".cart_box").css("background-image","url(/images/cart_on.png)");
    
    var services = $(".opt").val();
    var service_variant = $(".service-variants").val();
    var razmer = $(".sku-feature-"+product_id).val();
    
    
    item_count=0;
    $count_size_on = 0;
    for(i=0;i<=tmp_inp;i++)
    {
        
		if (Number($("#product_tocart_"+i).val())>=1)
        {
            
            tmp_size = $(".size_count_"+i+" span ").html();
            
            if (tmp_size != "")
            {
                string = '<i class="icon16 color" style="background:#FFFFFF;"></i>';
                tmp_size = tmp_size.replace(string,'');
                
                tmp_size = tmp_size.replace(' ','');
                string = '<i class="icon16 color" style="background: rgb(255, 255, 255);"></i>';
                tmp_size = tmp_size.replace(string,'');
                 string = '<i style="background: rgb(255, 255, 255);" class="icon16 color"></i>';
                tmp_size = tmp_size.replace(string,'');
                
                $(".size_count_"+i+" span").attr("size_pr",tmp_size);
                tmp_size = tmp_size.replace(",",".");
                
            }
             
            if (tmp_size != "")
            {
                /*vstavka = $(".Vstavka").val().trim();*/
                product_now = tmp_size;
            }
            else
            {
            
                product_now = $(".metall").html()+", "+$(".Vstavka").val();
               
            }
           
            
           if ($(".Vstavka").val()=='Цепи'){
           product_now = $(".metall").html()+", "+tmp_size;
           }
            
            
            
            val_scu = $(".sku-feature-my").find("option:contains('"+product_now+"')").val();
            
            if (val_scu)
            {
                
            }
            else
            {
                val_scu = $(".sku-feature-my").val();
            }
            
            quantity = $("#product_tocart_"+i).val();
            dataCart = 'product_id='+ product_id + '&quantity=' + quantity + '&service_variant[1]=1'+'&service_variant[2]=2';
            $.ajax({
				type: "POST",
				data: dataCart,
				url: "/cart/add/",
				dataType: "json",
		  
					complete: function () {
						$(".btn_"+product_id).css("color","#fff");
				  
					},
					success: function(response){
				
				
						$("#shopping_cart .ajax_cart_quantity").html(response.data.count);
						$(".to_cart_"+product_id).html(item_count);
						$(".to_cart2.to_cart_"+product_id).html(item_count);
						$(".to_cart2.to_cart_"+product_id).css("visibility","visible");
						$(".to_cart_"+product_id).css("visibility","visible");
						var image = $(".image_b_"+product_id+" .t_image").offset();
						var cart  = $('#shopping_cart').offset();
						ttop = image.top+140;
						tleft = image.left+40;
						$("#page").before('<img src="' + $(".image_b_"+product_id+" .t_image").attr('src') + '" id="temp" style="position: absolute; z-index:1000000; top: ' + ttop + 'px; left: ' + tleft + 'px; width:70px; height:73px" />');
						params = {
									top : cart.top+'px',
									left : cart.left+'px',
									opacity : 0.0,
									width : $(".image_b_"+product_id+" .t_image").width()/2,  
									height : $(".image_b_"+product_id+" .t_image").height()/2
								};		
						
									$('#temp').animate(params, 900, false, function () {
									$('#temp').remove();
									$('.link_order').css("display","block");
								});		
					}

			});
			$('#temp').remove();
			$count_size_on = 1;
        }
		
    }
    
    if ($count_size_on == 0) alert('Напротив интересуещего вас размера укажите количество которое необходимо положить в корзину.')
}