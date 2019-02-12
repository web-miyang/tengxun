import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import home from '@/components/home'
import contents from '@/components/contents'
/*项目列表*/
import projectList from '@/components/project/projectList'
import create from '@/components/project/create'
import productList from '@/components/project/product'
import userImport from '@/components/project/userImport'
/*用户管理*/
import userData from '@/components/user/userData'
import common from '@/components/user/common'
import work from '@/components/user/work'
import repeat from '@/components/user/repeat'
/*数据报表*/
import pandect from '@/components/table/pandect'
import product from '@/components/table/product'
import behavior from '@/components/table/behavior'
import portrait from '@/components/table/portrait'
import analysis from '@/components/table/analysis'
/*消息触达*/
import sms from '@/components/sms/sms'
import send from '@/components/sms/send'
/*系统管理*/
import dynamic from '@/components/system/dynamic'
import userNumber from '@/components/system/userNumber'
import role from '@/components/system/role'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: login
    },
    {
      path: '/login',
      component: login
    },
    {
    	path: '/home',
    	name:'home',
    	component: home
    },
    {
      path: '/contents',
      name:'/contents',
      component: contents,
      children: [
      	{
          path: '/project/product',//项目管理 产品列表
          name: '/project/product',
          component: productList
        },
        {
          path: '/project/userImport',//项目管理 产品列表
          name: '/project/userImport',
          component: userImport
        },
        {
        	path: '/project/projectList',//项目管理 项目列表
          name: '/project/projectList',
          component: projectList
        },
        {
          path: '/project/create',//项目创建修改
          name: '/project/create',
          component: create
        },
        {
          path: '/user/userData',//用户管理 基础信息
          name: '/user/userData',
          component: userData
        },
        {
          path: '/user/common',//用户通用信息
          name: '/user/common',
          component: common
        },
        {
          path: '/user/work',//用户业务信息
          name: '/user/work',
          component: work
        },
        {
          path: '/user/repeat',//用户重复信息
          name: '/user/repeat',
          component: repeat
        },
        {
          path: '/table/pandect',//数据总览
          name: '/table/pandect',
          component: pandect
        },
        {
          path: '/table/product',//产品报名分析
          name: '/table/product',
          component: product
        },
        {
          path: '/table/behavior',//用户参与行为
          name: '/table/behavior',
          component: behavior
        },
        {
          path: '/table/portrait',//用户画像
          name: '/table/portrait',
          component: portrait
        },
        {
          path: '/table/analysis',//项目分析
          name: '/table/analysis',
          component: analysis
        },
        {
          path: '/sms/sms',//消息触达
          name: '/sms/sms',
          component: sms
        },
        {
          path: '/sms/send',//短信发送记录
          name: '/sms/send',
          component: send
        },
        {
          path: '/system/dynamic',//系统管理  操作动态
          name: '/system/dynamic',
          component: dynamic
        },
        {
          path: '/system/userNumber',//账号管理
          name: '/system/userNumber',
          component: userNumber
        },
        {
          path: '/system/role',//角色管理
          name: '/system/role',
          component: role
        }
      ]
    }
  ]
})
