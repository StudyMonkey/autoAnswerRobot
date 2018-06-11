CREATE TABLE `qa_questions` (
  `UUID` varchar(36) NOT NULL COMMENT '主键',
  `ADDTIME` timestamp NULL DEFAULT NULL COMMENT '新增时间',
  `UPDATETIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `CHANNELID` varchar(256) DEFAULT NULL COMMENT '课程ID',
  `EID` varchar(255) DEFAULT NULL COMMENT '用户ID',
  `TITLE` varchar(1000) CHARACTER SET utf8 COLLATE utf8_bin DEFAULT NULL COMMENT '问题标题',
  `ANSWER` text COMMENT '问题答案',
  `HITS` int(11) DEFAULT '0' COMMENT '使用次数',
  PRIMARY KEY (`UUID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8


CREATE TABLE `qa_welcome` (
  `UUID` varchar(36) NOT NULL COMMENT '主键',
  `ADDTIME` timestamp NULL DEFAULT NULL COMMENT '新增时间',
  `UPDATETIME` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `TYPE` int(11) DEFAULT NULL COMMENT '类型:0大平台，1课程',
  `CHANNELID` varchar(256) DEFAULT NULL COMMENT '课程ID',
  `TITLE` varchar(1000) DEFAULT NULL COMMENT '标题',
  `CONTENT` text COMMENT '内容',
  `EID` varchar(255) DEFAULT NULL COMMENT '用户ID',
  PRIMARY KEY (`UUID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8


CREATE TABLE `t_menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `parentid` int(11) DEFAULT NULL COMMENT '父ID',
  `name` varchar(50) DEFAULT NULL COMMENT '菜单名称',
  `url` varchar(200) DEFAULT NULL COMMENT '菜单URL',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COMMENT='菜单表';

INSERT INTO `t_menu` VALUES ('1', '0', '系统菜单', null);
INSERT INTO `t_menu` VALUES ('2', '1', '系统管理', null);
INSERT INTO `t_menu` VALUES ('3', '2', '用户管理', '/User/UserListPre.do');
INSERT INTO `t_menu` VALUES ('4', '2', '角色管理', '/Role/RoleListPre.do');
INSERT INTO `t_menu` VALUES ('5', '2', '菜单管理', '/Menu/MenuPre.do');
INSERT INTO `t_menu` VALUES ('6', '1', '栏目管理', null);
INSERT INTO `t_menu` VALUES ('7', '6', '欢迎页面管理', '/Welcome/WelcomeListPre.do');
INSERT INTO `t_menu` VALUES ('8', '6', '问题答案管理', '/Question/QuestionListPre.do');

CREATE TABLE `t_role` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` varchar(50) DEFAULT NULL COMMENT '角色名称',
  `createTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='角色表';

INSERT INTO `t_role` VALUES ('1', '超级管理员', '2015-04-29 13:02:46');
INSERT INTO `t_role` VALUES ('2', '系统用户', '2015-06-18 16:24:59');

DROP TABLE IF EXISTS `t_role_menu`;
CREATE TABLE `t_role_menu` (
  `roleId` int(11) NOT NULL COMMENT '角色ID',
  `menuId` int(11) NOT NULL COMMENT '菜单ID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='角色菜单关系表';

INSERT INTO `t_role_menu` VALUES ('1', '1');
INSERT INTO `t_role_menu` VALUES ('1', '2');
INSERT INTO `t_role_menu` VALUES ('1', '3');
INSERT INTO `t_role_menu` VALUES ('1', '4');
INSERT INTO `t_role_menu` VALUES ('1', '5');
INSERT INTO `t_role_menu` VALUES ('1', '6');
INSERT INTO `t_role_menu` VALUES ('1', '7');
INSERT INTO `t_role_menu` VALUES ('1', '8');
INSERT INTO `t_role_menu` VALUES ('1', '9');
INSERT INTO `t_role_menu` VALUES ('1', '10');
INSERT INTO `t_role_menu` VALUES ('1', '11');
INSERT INTO `t_role_menu` VALUES ('1', '12');
INSERT INTO `t_role_menu` VALUES ('1', '13');
INSERT INTO `t_role_menu` VALUES ('1', '14');
INSERT INTO `t_role_menu` VALUES ('2', '1');
INSERT INTO `t_role_menu` VALUES ('2', '6');
INSERT INTO `t_role_menu` VALUES ('2', '7');
INSERT INTO `t_role_menu` VALUES ('2', '8');
INSERT INTO `t_role_menu` VALUES ('2', '9');
INSERT INTO `t_role_menu` VALUES ('2', '10');
INSERT INTO `t_role_menu` VALUES ('2', '11');
INSERT INTO `t_role_menu` VALUES ('2', '12');
INSERT INTO `t_role_menu` VALUES ('2', '13');
INSERT INTO `t_role_menu` VALUES ('2', '14');

DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `loginName` varchar(50) DEFAULT NULL COMMENT '登录名',
  `userName` varchar(50) DEFAULT NULL COMMENT '用户姓名',
  `password` varchar(32) DEFAULT NULL COMMENT '密码',
  `status` varchar(1) DEFAULT NULL COMMENT '状态',
  `roleId` int(11) DEFAULT NULL COMMENT '角色ID',
  `lastLoginTime` datetime DEFAULT NULL COMMENT '最后登录时间',
  `createTime` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='用户表';
-- 密码123456
INSERT INTO `t_user` VALUES ('1', 'admin', '超级管理员', 'e10adc3949ba59abbe56e057f20f883e', '1', '1', '2017-12-04 16:33:02', '2015-04-29 13:05:29');

CREATE TABLE `qa_questions_record` (
  `ID` VARCHAR(36) NOT NULL COMMENT '主键ID',
  `EID` VARCHAR(50) NOT NULL COMMENT '用户EID',
  `URL` VARCHAR(1000) DEFAULT NULL COMMENT '访问URL',
  `CONTEXT` VARCHAR(2000) DEFAULT NULL COMMENT '问题内容',
  `IP` VARCHAR(15) NOT NULL COMMENT '用户IP',
  `ADDTIME` DATETIME NOT NULL COMMENT '添加时间',
  PRIMARY KEY (`ID`)
) ENGINE=INNODB DEFAULT CHARSET=utf8 COMMENT='用户提问信息表';