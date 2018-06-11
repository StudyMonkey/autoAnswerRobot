$(document).ready(function(){
	
	var chat = {
		//与服务器进行连接
		imgUrl : '',
		init : function(){
			chat.click.init();	
			chat.event.setCookie('logineId',chat.event.uuidv4()); 		
		},
		click : {
			init: function(){
				$('.edui-container textarea').on('focus',function(){
					chat.event.hide($('span.please_input'));
				});
				$('.edui-container textarea').on('blur',function(){
					if($(this).val()== ''){
						chat.event.show($('span.please_input'));
					}					
				});
				$('span.please_input').on('click',function(){
					chat.event.hide($('span.please_input'));
					$('.edui-container textarea').focus();
				});	
				$('.pc-hide').on('click',function(){
					chat.event.hide($('.chatBox_content'));
					chat.event.show($('.chatBox_mini'));
					
					chat.socket.disconnect();
					chat.event.iframeminHeight();
				});
				$('.chatBox_mini').on('click',function(){
					chat.event.iframemaxHeight();
					chat.event.hide($('.chatBox_mini'));
					chat.event.show($('.chatBox_content'));
					//建立到服务器的socket连接
					this.socket = io.connect();
					var server_host_url = 'http://www.mooc.mtn';					
					//var server_host_url = 'http://192.168.1.117';
					chat.socket = io(server_host_url, {path:'/chatbotapp'});
					//监听socket的connect事件，此事件表示连接已经建立					
					chat.socket.on('connect', function() {
						chat.socket.emit('CLIENT_MSG', 'eid:'+chat.event.getCookie('logineId'));
						console.log('connect'+'eid:'+chat.event.getCookie('logineId'));
					});
					chat.socket.on('SERVER_MSG', function(data) {
						//将消息输出到控制台
						console.log(data);
						chat.event.mesAppend(data);
						$('.service').scrollTop( $('.service')[0].scrollHeight );
					});	 
					chat.socket.on('SERVER_ALLSEND_MSG', function(data) {
						//将消息输出到控制台
						console.log(data);
						chat.event.mesAppend(data);
						$('.service').scrollTop( $('.service')[0].scrollHeight );
					});	
					chat.socket.on('USER_IMG', function(data) {
						//将消息输出到控制台
						console.log(data);
						chat.imgUrl = data;
					});						
				});
				$('.submit-btn-wrap').on('click',function(){
					$('.edui-container textarea').val();
				});
				$('#sendBtn').on('click',function(){
					chat.event.sendMes();			
				});
			    $('.edui-container textarea').keypress(function(e) {   
			        if(e.which == 13) { 
						chat.event.sendMes();			        	
			        }
			    }); 
			}		
		},
		event : {
			str : '',
			str1 : '',
			hide : function(a){
				a.hide();
			},
			show : function(b){
				b.show();
			},
			sendMes : function(){
				var areaVal = $('.edui-container textarea').val();
				if(areaVal.trim() !== ''){
					this.mymesAppend(areaVal,chat.imgUrl);
					$('.edui-container textarea').val('');
					chat.socket.emit('CLIENT_MSG', 'msg:'+areaVal);//发送一个名为CLIENT_MSG的事件，并且传递一个字符串数据					
				}else{
					$('.warning_input').show();
					setTimeout(function(){
						$('.warning_input').fadeOut();	
					},2000)
					
				}
				
			},			
			mesAppend : function(c){
				this.str = '<div class="pc-talk"><div class="pc-service"><div class="pc-service-left">' +
						   '<img src="./timg1.png" alt="头像">' +
						   '</div><div class="pc-service-right"><p><label>小助手</label><span>'+ chat.event.getTime() +'</span></p>' +
						   '<div class="pc-service-info"><div><div style="top: 0px;">' +
						   '<span style="font-family:Arial;">' + c +'</span></div>' + 
						   '</div></div></div></div></div>';																					
				$('.service').append(this.str);
			},
			mymesAppend : function(f,g){
				this.str1 = '<div class="pc-talk"><div class="pc-service"><div class="pc-service-left pc-service-left-my">' +
						   '<img src="'+ g +'" alt="头像">' +
						   '</div><div class="pc-service-right pc-service-right-my"><p><label>我</label><span>'+ chat.event.getTime() +'</span></p>' +
						   '<div class="pc-service-info"><div><div style="top: 0px;">' +
						   '<span style="font-family:Arial;">' + f +'</span></div>' + 
						   '</div></div></div></div></div>';																					
				$('.service').append(this.str1);
			},			
			setCookie : function(name,value){
				document.cookie = name + "="+ escape (value) + ";path=/";
			},
			getCookie : function(d){
				var arrStr = document.cookie.split("; "); 
				for(var i = 0;i < arrStr.length;i ++){ 
					var temp = arrStr[i].split("="); 
					if(temp[0] == d) return unescape(temp[1]);					
				} 				
			},
			getTime : function(){
			   var mydate = new Date();
			   var str = ""; 
			   str += this.buLing(mydate.getHours()) + ":";
			   str += this.buLing(mydate.getMinutes()) + ":";
			   str += this.buLing(mydate.getSeconds());
			   return str;				
			},
			buLing : function(e){
				return e < 10 ? e = '0'+e : e;
			},
			iframemaxHeight : function(){
				$(window.parent.document).find("#assistantIfm").css('height','500px');				
			},
			iframeminHeight: function(){
				$(window.parent.document).find("#assistantIfm").css('height','42px');
			},
			uuidv4 : function(){
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
					var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
					return v.toString(16);
				});					
			}
			
		}
	};
	chat.init();
	
	
	
});
