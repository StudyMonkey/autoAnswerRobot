$(document).ready(function(){

	function uuidv4()
	{
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});		
	}
		
	var chat = {
		//socket : io.connect(),//与服务器进行连接
		init : function(){
			chat.click.init();
			chat.event.setCookie('logineId',uuidv4());	 	          
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
				});
				$('.chatBox_mini').on('click',function(){
					chat.event.hide($('.chatBox_mini'));
					chat.event.show($('.chatBox_content'));
					
					//建立到服务器的socket连接
					//this.socket = io.connect();
					//var server_host_url = '10.128.18.79:8081';
					var server_host_url = 'http://www.mooc.mtn';
					chat.socket = io(server_host_url, {path:'/chatbotapp'});
					//监听socket的connect事件，此事件表示连接已经建立
					chat.socket.on('connect', function() {
						chat.socket.emit('CLIENT_MSG', 'eid:'+chat.event.getCookie('logineId'));
						console.log('admin connect');
					});	
					chat.socket.on('SERVER_MSG', function(data) {
						//将消息输出到控制台
						console.log(data);
						chat.event.mesAppend(data);
						$('.service').scrollTop( $('.service')[0].scrollHeight );
					});	 
					chat.socket.on('SERVER_RESPONSE_ADMIN_MSG', function(data) {
						//将消息输出到控制台
						console.log(data);
						var users = data.split(':')[1].split('.');
						$('#users').html('');
						$('#users').append('<tr><th>ID</th><th>加入时间</th></tr>');
						for(var i = 0;i< users.length;i++){
							var v = users[i].split(',');
							$('#users').append('<tr><td>'+ v[0] +'</td><td>'+v[1]+'</td></tr>');
						}
						//chat.event.mesAppend(data);
						//$('.service').scrollTop( $('.service')[0].scrollHeight );
					});	
				});
				$('.submit-btn-wrap').on('click',function(){
					$('.edui-container textarea').val();
				});
				$('#sendBtn').on('click',function(){
					chat.event.sendMes();
					$('.service').scrollTop( $('.service')[0].scrollHeight );
				});
			    $('.edui-container textarea').keypress(function(e) {   
			        if(e.which == 13) { 
			        	chat.event.sendMes();
			        }
			        $('.service').scrollTop( $('.service')[0].scrollHeight );
			    }); 
			    $('#listUser').on('click',function(){			    	
			    	chat.socket.emit('ADMIN_MSG', "SYSCOMMAND:list");
			    })
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
				this.mymesAppend(areaVal);
				$('.edui-container textarea').val('');
				//chat.socket.emit('CLIENT_MSG', 'msg:'+areaVal);//发送一个名为CLIENT_MSG的事件，并且传递一个字符串数据				
				chat.socket.emit('ADMIN_MSG', areaVal);//发送一个名为CLIENT_MSG的事件，并且传递一个字符串数据
			},
			mesAppend : function(c){
				this.str = '<div class="pc-talk"><div class="pc-service"><div class="pc-service-left">' +
						   '<img src="http://www2.53kf.com/style/chat/new2017/image/png/logo.png" alt="头像">' +
						   '</div><div class="pc-service-right"><p><label>小助手</label><span>'+ chat.event.getTime() +'</span></p>' +
						   '<div class="pc-service-info"><div><div style="top: 0px;">' +
						   '<span style="font-family:Arial;">' + c +'</span></div>' + 
						   '</div></div></div></div></div>';																					
				$('.service').append(this.str);
			},
			mymesAppend : function(f){
				this.str1 = '<div class="pc-talk"><div class="pc-service"><div class="pc-service-left">' +
						   '<img src="./01.jpg" alt="头像">' +
						   '</div><div class="pc-service-right"><p><label>我</label><span>'+ chat.event.getTime() +'</span></p>' +
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
			}
		}
	};
	chat.init();
	
	
	
});
