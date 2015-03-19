$(function () {

    function updateCart(data)
    {
        $(".cart-total").html(data.total);
        if (data.discount_numeric) {
            $(".cart-discount").closest('div.row').show();
        }
        $(".cart-discount").html('&minus; ' + data.discount);
        
        if (data.add_affiliate_bonus) {
            $(".affiliate").show().html(data.add_affiliate_bonus);
        } else {
            $(".affiliate").hide();
        }
        
    }

   $(".cart a.delete").click(function () {
      id_p = $(this).attr('data');
      $.post('/cart/delete/', {id: id_p}, function (response) {
            if (response.data.count == 0) 
            {
                location.reload();
            }
            $('.product_cart_'+id_p).animate({
        	  opacity: 0,
      		}, 500, function(){
              $('.product_cart_'+id_p+' .img').css("display","none");
              $('.product_cart_'+id_p+' .name').css("display","none");
              $('.product_cart_'+id_p+' .first_price').css("display","none");
              $('.product_cart_'+id_p+' .count').css("display","none");
              $('.product_cart_'+id_p+' .item-total').css("display","none");
              $('.product_cart_'+id_p+' .delete').css("display","none");
              $('.product_cart_'+id_p).slideUp(500);
            
            });
        
            updateCart(response.data);
             $('.cart-total').html('Итого: '+response.data.total);
                    $('.cart_total_top').html(response.data.total);
                    $('.cart_count').html(response.data.count);
    }, "json");
  return false;
	
    });

    $(".qty").change(function () {
      var that = $(this);
      id_p = that.attr("data");
        if (that.val() > 0) {
           
            if (that.val()) {
                if (that.val()>10000) alert("Мы надеемся, что вы не шутите.");
              
                $.post('/cart/save/', {id: id_p, quantity: that.val()}, function (response) {
                    $('.item-total_'+id_p).html(response.data.item_total);
                    
                    discount = $(".discount").html();
                    total_price = response.data.total;
                    if (discount > 0)
                    {
                       
                        total_price = total_price/100*discount;
                    }
                     
                     
                     $('.cart-total').html('Итого: '+total_price);
                    $('.cart_total_top').html(response.data.total);
                    $('.cart_count').html(response.data.count);
                    
                    if (response.data.q) {
                        that.val(response.data.q);
                    }
                    if (response.data.error) {
                        alert(response.data.error);
                    } else {
                        that.removeClass('error');
                    }
                    updateCart(response.data);
                }, "json");
            }
        } else {
            that.val(1);
          $.post('/cart/save/', {id: id_p, quantity: that.val()}, function (response) {
                    $('.item-total_'+id_p).html(response.data.item_total);
                    discount = $(".discount").html();
                    total_price = response.data.total;
                    if (discount > 0)
                    {
                       
                        total_price = total_price/100*discount;
                    }
                     alert(discount);
                    $('.cart-total').html('Итого: '+total_price);
                    $('.cart_total_top').html(response.total_price);
                    $('.cart_count').html(response.data.count);
                    if (response.data.q) {
                        that.val(response.data.q);
                    }
                    if (response.data.error) {
                        alert(response.data.error);
                    } else {
                        that.removeClass('error');
                    }
                    updateCart(response.data);
                }, "json");
        }
    });
  

    $(".cart .services input:checkbox").change(function () {
        var obj = $('select[name="service_variant[' + $(this).closest('div.row').data('id') + '][' + $(this).val() + ']"]');
        if (obj.length) {
            if ($(this).is(':checked')) {
                obj.removeAttr('disabled');
            } else {
                obj.attr('disabled', 'disabled');
            }
        }

        var div = $(this).closest('div');
        var row = $(this).closest('div.row');
        if ($(this).is(':checked')) {
           var parent_id = row.data('id')
           var data = {html: 1, parent_id: parent_id, service_id: $(this).val()};
           var variants = $('select[name="service_variant[' + parent_id + '][' + $(this).val() + ']"]');
           if (variants.length) {
               data['service_variant_id'] = variants.val();
           }
           $.post('add/', data, function(response) {
               div.data('id', response.data.id);
               row.find('.item-total').html(response.data.item_total);
               updateCart(response.data);
           }, "json");
        } else {
           $.post('delete/', {html: 1, id: div.data('id')}, function (response) {
               div.data('id', null);
               row.find('.item-total').html(response.data.item_total);
               updateCart(response.data);
           }, "json");
        }
    });

    $(".cart .services select").change(function () {
        var row = $(this).closest('div.row');
        $.post('save/', {html: 1, id: $(this).closest('div').data('id'), 'service_variant_id': $(this).val()}, function (response) {
            row.find('.item-total').html(response.data.item_total);
            updateCart(response.data);
        }, "json");
    });

    $("#cancel-affiliate").click(function () {
        $(this).closest('form').append('<input type="hidden" name="use_affiliate" value="0">').submit();
        return false;
    });

    $("div.addtocart input:button").click(function () {
        var f = $(this).closest('div.addtocart');
        if (f.data('url')) {
            var d = $('#dialog');
            var c = d.find('.cart');
            c.load(f.data('url'), function () {
                c.prepend('<a href="#" class="dialog-close">&times;</a>');
                c.find('form').data('cart', 1);
                d.show();
                if ((c.height() > c.find('form').height())) {
                    c.css('bottom', 'auto');
                } else {
                    c.css('bottom', '15%');
                }
            });
            return false;
        }
        $.post($(this).data('url'), {html: 1, product_id: $(this).data('product_id')}, function (response) {
            if (response.status == 'ok') {
                var cart_total = $(".cart-total");
                $(".container > .content").load(location.href, function () {
                    cart_total.closest('#cart').removeClass('empty');
                    cart_total.html(response.data.total);
                });
            }
        }, 'json');
       return false;
    });

});