   
    /*----------------Выбор сортировки---------------*/
    
    $(function(){
        var cb=0;
		$('.list_button .button_arr').click(function(){
          if (cb == 0){
			 $('.list_button').css("height","135px");
			cb = 1;
		}
		else{
			 $('.list_button').css("height","32px");
			 cb = 0;
		}
    });
      /*-------------------show full_text-------------------*/
    $('.read_all_text').click(function(){
        	$(".description_text").css("overflow","visible");
        	$(".description_text").css("height","auto");
         	$('.read_all_text').css("display","none");
            $('.read_all_text_off').css("display","block");
        });
    $('.read_all_text_off').click(function(){
        	$(".description_text").css("overflow","hidden");
        	$(".description_text").css("height","229px");
         	$('.read_all_text').css("display","block");
            $('.read_all_text_off').css("display","none");
        });
    });

    
   
    /*-----------------------------------------------*/
   
    /*-----------Внешний вид и работа левых чекбоксов-----------*/
    $(function () {
    
    $(".opt_on_left").click(function(){
    
    IdCheckbox = $(this).attr("idch");
    checked = $("#h_"+IdCheckbox).attr("checked");
      
      if(checked){
 		$('#'+IdCheckbox).css("background-image","url(/images/ch_b_off.jpg)");
      	$("#h_"+IdCheckbox).attr("checked",false);
        
      }
      else
      {
        $('#'+IdCheckbox).css("background-image","url(/images/ch_b_on.jpg)");
      	$("#h_"+IdCheckbox).attr("checked","checked");
        
      }
     
    });
    });
    
    $(document).ready(function(){
      if (document.getElementById('filters_ch')){
      var mass_ch = document.getElementById('filters_ch').getElementsByTagName('input');
      for (var i = 1; i < mass_ch.length; i++) {
		if (mass_ch[i].type == 'checkbox' && mass_ch[i].checked) {
          IdCheckbox = mass_ch[i].id; /*h_chbo*/
          clCheckbox=IdCheckbox.replace(/[^0-9]+/ig," ");
          data = $("#"+IdCheckbox).attr("data");
          $("#chbox_"+Number(clCheckbox)).css("background-image","url(/images/ch_b_on.jpg)");
          $(".fp_"+data).css("display","block");
          $("#fpb_"+Number(data)).css("background-image","url(/images/minus_off.png)");
          
 		}
	  }
    }
        
    });
    /*----------------------------------------------*/
    
    /*-----------Аккордеон левых фильтров-----------*/
    $(function () {
    
    $(".fpb").click(function(){
        
        show = $(this).attr("show");
    j = $(this).attr("data");
      if(show == "hide"){
 		$('.fp_'+j).show();
      	$('#fpb_'+j).css("background-image","url(/images/minus_off.png)");
        $(this).attr("show","show");
      }
      else
      {
        $('.fp_'+j).hide();
      	$('#fpb_'+j).css("background-image","url(/images/plus_off.png)");
        $(this).attr("show","hide");
      }
     
    });
    });
    
   
    
    
    /*----------------------------------------------*/
    