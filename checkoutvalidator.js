$(document).ready(function(){

	onlyIntRegexp = /[^0-9 -+]/g;

	$("input[name$='customer[phone]']").keyup(function(){
		validatePhone();
	});

	$("input[name$='customer[phone]']").change(function(){
		validatePhone();
	});

    $(".order_btn").click(function(event){
		email = $("input[name$='customer[email]']").val();
		phone = $("input[name$='customer[phone]']").val();
		phone = phone.replace(onlyIntRegexp, '');
		$("input[name$='customer[phone]']").val(phone);
		//validateEmail(email);
		validateForm(email, phone, event);
		
	    f=$("input:radio:checked").val();
	    postamat = $(".wa-value #address").html();
	    
		if(postamat == ""){
		    
          postamat = $(".wa-value #address").html();
          if (postamat == "" || postamat == " ") {
          event.preventDefault();
          alert("Укажите постамат"); 
          $(".PickPointOpen").html("Выбрать ближайший постамат PickPoint"); 
          $(".PickPointOpen").css("color","#ff0000");}
        }
	});







		function validatePhone(){
			phone = $("input[name$='customer[phone]']").val();
			phone = phone.replace(onlyIntRegexp, '');
			phone = phone.replace('  ', '-');
			phone = phone.replace(' ',  '-');
			phone = phone.replace('++',  '+');
			phone = phone.replace('--', '-');
			$("input[name$='customer[phone]']").val(phone);
		}

		function validateForm(email, phone, event){
			$(".error_text").remove();
			$("input[name$='customer[phone]']").removeClass('error');
			$("input[name$='customer[email]']").removeClass('error');

				if(email.length > 0 && !validateEmail(email)){
					event.preventDefault();
					$("input[name$='customer[email]']").addClass('error');
					$("input[name$='customer[email]']").after('<em class="errormsg error_text">Email введен не корректно</em>');
				} else if (email.length == 0){
					event.preventDefault();
					$("input[name$='customer[email]']").addClass('error');
					$("input[name$='customer[email]']").after('<em class="errormsg error_text">Необходимо ввести Email</em>');
				}

				if(phone.length > 0 && phone.length < 7){
					event.preventDefault();
					$("input[name$='customer[phone]']").addClass('error');
					$("input[name$='customer[phone]']").after('<em class="errormsg error_text">Телефон введен не корректно</em>');
				} else if (phone.length == 0){
					event.preventDefault();
					$("input[name$='customer[phone]']").addClass('error');
					$("input[name$='customer[phone]']").after('<em class="errormsg error_text">Необходимо указать номер телефона</em>');
				}
		}

		function validateEmail(email){
			if(email !== ''){
				var strLength	= email.length;
				var emailSign	= email.indexOf("@");
				var lastDotSign = email.lastIndexOf(".");
				var test1		= lastDotSign - emailSign;
				var test2		= parseInt(strLength - lastDotSign);

				if(emailSign < lastDotSign
					&& emailSign >= 2
					&& test1 > 2
					&& test2 > 2){
						$ok = 1;
						return $ok;
				}
			}
		}
});