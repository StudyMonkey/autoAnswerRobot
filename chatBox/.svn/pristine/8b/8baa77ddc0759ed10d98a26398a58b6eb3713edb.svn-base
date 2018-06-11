var express = require('express'), //引入express模块
    app = express(),
	server = require('http').createServer(app); 
    IO = require('socket.io'); //引入socket.io模块并绑定到服务器    
var URL = require('url'); 
  
app.use('/', express.static(__dirname + '/www')); //指定静态HTML文件的位置
server.listen(8081)

//console.log('server started');
var mysql = require('mysql'); 

var connection;
function handleError () {
    connection = mysql.createConnection({
	    host: '10.128.18.173',
	    user: 'chatbox',
	    password: 'chatbox173',
	    database:'mooc_qa'
    });

    //连接错误，10秒重试
    connection.connect(function (err) {
        if (err) {
            //console.log('error when connecting to db:', err);
			setTimeout(handleError , 10000);      		
        }
    });

    connection.on('error', function (err) {
        //console.log('db error', err);
        // 如果是连接断开，自动重新连接
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleError();
        } else {
            throw err;
        }
    });
}
handleError();
/*var connection = mysql.createConnection({
    host: '10.128.18.173',
    user: 'chatbox',
    password: 'chatbox173',
    database:'mooc_qa'
});*/
//connection.connect();

//force MySQL to keep the connection alive
setInterval(function () {
    connection.query('SELECT 1');
}, 5000);

// 创建socket服务
var socketIO = IO(server, {path:'/chatbotapp'});
var obj = {};
var channelid = '';


app.get('/recommand', function (req, res) {
	//console.log(req.query.eid);
    //console.log(req.query.msg);
  	//res.send('Hello World!');
  	var eID = req.query.eid;
  	var data = req.query.msg;
	//console.log('server send to :'+ eID +". MSG IS " +data);
	var socketId = obj[eID];
	socketId.emit('SERVER_MSG', data); 
	res.send('true');
});
app.get('/onlineusers', function (req, res) {
	var key_lst = [];
	for(var key in obj){
		key_lst.push(key);
	}
	res.send("{\"LIST\":\""+key_lst.join(",")+"\"}");
});

function getCurrentTimestamp()
{
	var d = new Date();
	var year = d.getFullYear();
	var month = d.getMonth() + 1;
	var day = d.getDate();
	var hour = d.getHours();
	var min = d.getMinutes();
	var sec = d.getSeconds();
	if(month <=9)
		month = '0' + month;
	if(day <=9)
		day = '0' + day;
	if(hour <=9)
		hour = '0' + hour;	
	if(min <=9)
		min = '0' + min;	
	if(sec <=9)
		sec = '0' + sec;	
	return year+'-'+month+'-'+day+' '+hour+'-'+min+'-'+sec;
}	

//socket部分
socketIO.on('connection', function(socket) {	  
    var url = socket.request.headers.referer;
    //console.log(url);
    //console.log('这是query='+URL.parse(url).query);
    
	var myeid = "";
	var imgUrl = "";
	var urlLink = "";
	var ip = "";
	var user_eid = "";
	var urlArray = "";
		
    //obj[eID] = socket;
    //socket.emit('join',function)
    //接收并处理客户端发送的CLIENT_MSG事件
    socket.on('CLIENT_MSG', function(data) {
		//console.log('当前客户端IP'+ get_client_ip());
		//console.log('当前页面'+ url);
		//取channelid
		if(URL.parse(url).query != null){
			urlArray = URL.parse(url).query.split('&');	    
			//console.log('urlArray='+urlArray);
			
			for(var i = 0; i < urlArray.length;i++){
				if(urlArray[i].indexOf('cid') >= 0){
					//console.log('urlArray[i]='+ urlArray[i]);
					channelid = urlArray[i].split('=')[urlArray[i].split('=').length-1];
				}else if(urlArray[i].indexOf('imgUrl') >= 0){
					imgUrl = urlArray[i].split('=')[urlArray[i].split('=').length-1];
					//console.log('imgUrl='+imgUrl);
					socket.emit('USER_IMG', imgUrl);
				}else if(urlArray[i].indexOf('ip') >= 0){
					ip = urlArray[i].split('=')[urlArray[i].split('=').length-1];
					//console.log('ip='+ip);
				}else if(urlArray[i].indexOf('eid') >= 0){
					user_eid = urlArray[i].split('=')[urlArray[i].split('=').length-1];
					//console.log('eid='+ user_eid);
				}				
			}   	
		}else{
			channelid = '0';
		}
		if(channelid == '' || channelid == undefined || channelid == 'null')
			channelid = '0';
		var splited = data.split(':');
		var cmd = splited[0];   // 获取用户ID
		var cmd_option = splited[1];   // 获取用户ID		
		if(cmd == 'eid'){
			var title = '';
			var content = '';
			//建立EID与socket的映射关系
			obj[cmd_option] = [socket, getCurrentTimestamp()];
			
			//记录当前用户的EID
			myeid = cmd_option;
			
			//console.log('User login : ', cmd_option);
			//查询
			if(channelid!=null && channelid != ''&& channelid != 'undefined'){
				var sql = "SELECT qa_welcome.TITLE, qa_welcome.CONTENT FROM qa_welcome WHERE channelid = "+connection.escape(channelid)+"";
				connection.query(sql, function(err, rows, fields) {
					//console.log('The solution is: ', rows);
					if (err) throw err;
					if(rows.length != 0){
						title = rows[0].TITLE;
						content = rows[0].CONTENT;
						socket.emit('SERVER_MSG', title+ '<br/>' +content);
					}else{
						//如果课程内容不存在，则直接返回平台级type=0并且channelid=0内容
						var sql = "SELECT qa_welcome.TITLE, qa_welcome.CONTENT FROM qa_welcome WHERE type = 0";
						connection.query(sql, function(err, rows, fields) {
							//console.log('The solution is: ', rows);
							if (err) throw err;
							if(rows.length != 0){
								title = rows[0].TITLE;
								content = rows[0].CONTENT;
								socket.emit('SERVER_MSG', title+ '<br/>' +content);
							}
							else{						    
								socket.emit('SERVER_MSG', '课程不存在！');
							}
						});
					}
				});    			
			}

		}else if(cmd == 'msg'){
			var addsql = "insert into qa_questions_record(id,eid,url,context,ip,addtime)values(UUID(),?,?,?,?,NOW());"
			var addSqlParams = [user_eid,urlArray[4].split('urlLink=')[1],cmd_option,ip];
			connection.query(addsql,addSqlParams, function(err, rows, fields) {
				if (err) throw err;
				//console.log('The query DB SQL results: ', rows, rows.length);				
			});
			//检查课程是否在数据库中
			var title = '';
			var content = '';
			var is_course_exist_in_db = 0;			
			var sql = ''
			if(channelid == '0'||channelid == 'null')
				sql = "SELECT qa_welcome.TITLE, qa_welcome.CONTENT FROM qa_welcome WHERE type = 0";
			else			
				sql = "SELECT qa_welcome.TITLE, qa_welcome.CONTENT FROM qa_welcome WHERE type = 1 AND channelid ="+connection.escape(channelid)+"";
			//console.log('The query DB SQL is: ', sql);
			connection.query(sql, function(err, rows, fields) {
				//console.log('The query DB SQL results: ', rows, rows.length);
				if (err) throw err;
				if(rows.length != 0){
					title = rows[0].TITLE;
					content = rows[0].CONTENT;
					is_course_exist_in_db = 1;
				}
				
				//检查课程是否在Solr中
				var is_course_exist_in_solr = 0;			
				var solr = require('solr-client');
				var client = solr.createClient();
				var solr_channelID = channelid == '0' ? '1' : channelid;
				var query = client.createQuery()
							.q({'CHANNELID':solr_channelID})
							.start(0)
							.rows(1)
							.fl('ACONTENT');
				//console.log('搜solr CHANNELID:'+solr_channelID);
				client.search(query, function(err, obj){
					if(err){
						//记录错误
						//console.log(err);					
					}else{
						if(obj.response.docs.length != 0)
							is_course_exist_in_solr = 1;								
					}
					
					//console.log('course in DB: '+is_course_exist_in_db +'　course in solr: '+is_course_exist_in_solr);
					
					if(is_course_exist_in_db == 0 && is_course_exist_in_solr == 0)
					{						
						//查平台级课程
						var db_channelID = (channelid == 'null') ? '0' : channelid;
						var sql = "SELECT ANSWER FROM qa_questions " +
						   " WHERE CHANNELID = "+connection.escape(db_channelID)+" AND TITLE = "+connection.escape(cmd_option.trim())+"";	
						//console.log("搜数据库查询问题的答案: " + sql);             
						connection.query(sql, function(err, rows, fields) {
							//console.log('The solution is: ', rows);
							if (err) throw err;
							if(rows.length != 0){
								var answer = rows[0].ANSWER;
								
								//将这个问题的提问次数加1
								var sql = "UPDATE qa_questions SET hits=hits+1 WHERE channelid='"+db_channelID+"' AND title='"+cmd_option.trim()+"'";
								connection.query(sql,function(err, result) {
									if (err) throw err;					
									//console.log('updated '+channelid+','+cmd_option.trim());
								});				   				 
								is_db_search_hit = 1;
								socket.emit('SERVER_MSG', answer);
							}
							else
							{
								//查solr
								//数据库中没找到答案，搜solr
								var solr = require('solr-client');
								var client = solr.createClient();
								var solr_channelID = (channelid == '0' || channelid == 'null') ? '1' : channelid;
								var query = client.createQuery()
											.q({'CHANNELID':solr_channelID,'QTITLE':client.escapeSpecialChars(cmd_option.trim())})
											.start(0)
											.rows(1)
											.fl('ACONTENT');
								//console.log('搜solr CHANNELID:'+solr_channelID+' QTITLE:'+cmd_option.trim());
								client.search(query, function(err, obj){
									if(err){
										//记录错误
										//console.log(err);
									}else{
										//console.log('Solr return number: '+obj.response.docs.length);
										if(obj.response.docs.length != 0){
											is_solr_search_hit = 1;
											socket.emit('SERVER_MSG', obj.response.docs[0].ACONTENT);
										}
										else
										{
											socket.emit('SERVER_MSG', '超出我的回答范围，暂时无法回答');
										}
									}
								});
							}
						});						
					}
					else
					{
						//查数据库
						var is_db_search_hit = 0;
						if(is_course_exist_in_db != 0)
						{
							var db_channelID = (channelid == 'null') ? '0' : channelid;
							var sql = "SELECT ANSWER FROM qa_questions " +
							   " WHERE CHANNELID = "+connection.escape(db_channelID)+" AND TITLE = "+connection.escape(cmd_option.trim())+"";	
							//console.log("搜数据库查询问题的答案: " + sql);             
							connection.query(sql, function(err, rows, fields) {
								//console.log('The solution is: ', rows);
								if (err) throw err;
								if(rows.length != 0){
									var answer = rows[0].ANSWER;
									
									//将这个问题的提问次数加1
									var sql = "UPDATE qa_questions SET hits=hits+1 WHERE channelid='"+db_channelID+"' AND title='"+cmd_option.trim()+"'";
									connection.query(sql,function(err, result) {
										if (err) throw err;					
										//console.log('updated '+channelid+','+cmd_option.trim());
									});				   				 
									is_db_search_hit = 1;
									socket.emit('SERVER_MSG', answer);
								}
								else
								{
									//查solr
									//数据库中没找到答案，搜solr
									var solr = require('solr-client');
									var client = solr.createClient();
									var solr_channelID = (channelid == '0' || channelid == 'null') ? '1' : channelid;
									var query = client.createQuery()
												.q({'CHANNELID':solr_channelID,'QTITLE':client.escapeSpecialChars(cmd_option.trim())})
												.start(0)
												.rows(1)
												.fl('ACONTENT');
									//console.log('搜solr CHANNELID:'+solr_channelID+' QTITLE:'+cmd_option.trim());
									client.search(query, function(err, obj){
										if(err){
											//记录错误
											console.log(err);
										}else{
											//console.log('Solr return number: '+obj.response.docs.length);
											if(obj.response.docs.length != 0){
												is_solr_search_hit = 1;
												socket.emit('SERVER_MSG', obj.response.docs[0].ACONTENT);
											}
											else
											{
												socket.emit('SERVER_MSG', '超出我的回答范围，暂时无法回答');
											}
										}
									});
								}
							});						
						}
						else
						{
							//查solr
							//数据库中没找到答案，搜solr
							var solr = require('solr-client');
							var client = solr.createClient();
							var solr_channelID = channelid == '0' ? '1' : channelid;
							var query = client.createQuery()
										.q({'CHANNELID':solr_channelID,'QTITLE':client.escapeSpecialChars(cmd_option.trim())})
										.start(0)
										.rows(1)
										.fl('ACONTENT');
							//console.log('搜solr CHANNELID:'+solr_channelID+' QTITLE:'+cmd_option.trim());
							client.search(query, function(err, obj){
								if(err){
									//记录错误
									//console.log(err);
								}else{
									//console.log('Solr return number: '+obj.response.docs.length);
									if(obj.response.docs.length != 0){
										is_solr_search_hit = 1;
										socket.emit('SERVER_MSG', obj.response.docs[0].ACONTENT);
									}
									else
									{
										socket.emit('SERVER_MSG', '超出我的回答范围，暂时无法回答');
									}
								}
							});
						}
					}												
				});
			});
		}
	});	
    
    //管理员发送消息逻辑
    socket.on('ADMIN_MSG', function(data) {
    	if(data.indexOf(':') == -1){
    		socket.emit('SERVER_MSG', '管理员消息必须指定用户！<br>格式是：<用户名>:<消息内容>');
    	}else{
		    var splited = data.trim().split(':');	    
		    var eID = splited[0];   // 获取用户ID
		    if(eID == "SYSCOMMAND"){
		    	var cmd = splited[1];
		    	switch(cmd){
		    		case "list":
		    			var key_lst = [];
		    			for(var key in obj){
		    				key_lst.push([key, obj[key][1]]);
		    			}
		    			socket.emit('SERVER_RESPONSE_ADMIN_MSG', "LIST:"+key_lst.join("."));
		    			break;
		    	}
		    }else if(eID == "ALL"){
		    	//console.log('进入all消息');
		    	socketIO.emit('SERVER_ALLSEND_MSG',splited[1]);
		    }else{		    	
		    	if(obj.hasOwnProperty(eID)){
			    	//console.log('server send to :'+ eID +". MSG IS " +data);
			    	var socketId = obj[eID][0];
			    	socketId.emit('SERVER_MSG', splited[1]);
		    	}else{
		    		socket.emit('SERVER_MSG', '用户名'+eID+'不存在！');
		    	}
	    	}	
	    }
    });
    socket.on('disconnect', function (data) {				
		if(myeid in obj)
		{
			delete(obj[myeid][0]);
			//console.log('User exit : ', myeid);	
		}
	})
});

