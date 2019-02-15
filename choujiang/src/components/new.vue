<template>
  <div class="PageTwo">
    <div class="threeview" ref="threeview">
      <div class="showWon" v-if="showWon">
        <img v-for="(item, index) in wonArr" :src="item.src" >
      </div>
    </div>
  </div>
</template>

<script>
  import MathUtils from '../lib/js/MathUtils'
  import laipao8 from '../../static/js/laipao8'
  import head from '../../static/js/head'

  const WORLD_HEIGHT = 900;
  const WORLD_WIDTH = 1600;
  const CAMERA_Z = 450;
  var bg;
  var THREE = require('three');
  var TWEEN = require('@tweenjs/tween.js');
  
  THREE.ImageUtils.loadTexture("static/assets/bg.jpg", null, function (t) {
    bg = new THREE.MeshBasicMaterial({map: t});
  });

  //存储预计算的位置
  var targets = {
    head: [],
    text: []
  };

  function initThree(self, view) {
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(90, WORLD_WIDTH / WORLD_HEIGHT, 1, 3000);
    camera.position.z = CAMERA_Z;

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    view.appendChild(renderer.domElement);

//    var light = new THREE.PointLight(0xFF0000, 1.0, 200);
//    light.position.set(50, 5, 50);
//    scene.add(light);


//    var light = new THREE.DirectionalLight(0xFF0000, 1);
//    // 位置不同，方向光作用于物体的面也不同，看到的物体各个面的颜色也不一样
//    light.position.set(0, 0, 1);
//    scene.add(light);

//    var geometry = new THREE.CubeGeometry(100, 100, 100);
//    var material = new THREE.MeshLambertMaterial({color: 0xFFffFF}); // 这是兰伯特材质，材质中的一种
//    var cube = new THREE.Mesh(geometry, material);
//    cube.position.z = 10
//    scene.add(cube);


    function render() {
//      cube.rotation.x += 0.01;
//      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    }

    self.m_scene = scene;
    self.m_camera = camera;
    self.m_renderer = renderer;
    self.render = render;
  }


  //创建一个精灵
  function createSprite(material, width, height) {
    width = width ? width : 9;
    height = height ? height : 9;
    //创建一个平面
    var geometry = new THREE.PlaneGeometry(width, height, 1, 1);
    //设置uv坐标
    geometry.vertices[0].uv = new THREE.Vector2(0, 0);
    geometry.vertices[1].uv = new THREE.Vector2(2, 0);
    geometry.vertices[2].uv = new THREE.Vector2(2, 2);
    geometry.vertices[3].uv = new THREE.Vector2(0, 2);

    //生成网格对象
    var mesh = new THREE.Mesh(geometry, material);
    //返回模型
    return mesh;
  }

  //******各个不同的状态

  var STATE_STARTEFFECT_1 = 1; //开始的特效 第一阶段
  var STATE_STARTEFFECT_2 = 2; //开始特效第二阶段
  var STATE_STARTEFFECT_3 = 3; //开始特效第二阶段
  var STATE_LUCKDRAW = 4; // 开始抽奖循环图片
  var STATE_DRAWING = 5;  //  开始抽奖
  var STATE_SHOWWON = 6; // 显示中獎的人
  var STATE_DRAWOVER = 7;  // 显示结束开始另一轮抽奖循环
  var START_CHOUJIANG = 3;


  export default {
    name: 'HelloWorld',
    created: function () {
    },
    mounted: function () {
      TWEEN.removeAll();

      var self = this;
      //初始化3d世界
      initThree(this, this.$refs.threeview)

      //背景图

      var spritebg = createSprite(bg, WORLD_WIDTH, WORLD_HEIGHT);
      this.m_scene.add(spritebg);

      //所有缓存精灵都存放在这个数组里
      this.m_tempsprites = [];
      //一次性创建足够的图片
      for (var i = 0; i < 1300; i++) {
        var sprite = this.createRandowSprite();
        this.m_tempsprites.push(sprite);
      }
      //创建那些预计算的点
      targets.text = [];
      for (var i = 0, l = laipao8.length; i < l; i++) {
        var pos = laipao8[i];
        var object = new THREE.Object3D();
        object.position.x = pos.x * 9 - 500;
        object.position.y = pos.y * 9 - 150;
        object.position.z = 1;
        targets.text.splice(MathUtils.random(0,targets.text.length),0,object);
      }

      //另外一个形状
      targets.head = [];
      for (var i = 0, l = head.length; i < l; i++) {
        var pos = head[i];
        var object = new THREE.Object3D();
        object.position.x = pos.x * 9 - 350;
        object.position.y = pos.y * 9 - 300;
        object.position.z = 1;
        targets.head.splice(MathUtils.random(0,targets.head.length),0,object);
      }

      //变化到文字形态
//      this.transformto(targets.text, 1500)
      this.m_lasttime = new Date().getTime();
      this.m_timer = 0;


      //主程循环函数
      function animate() {
        requestAnimationFrame(animate);
        self.mainloop();
        TWEEN.update();
        self.render();
      }

      animate();


      this.setState(STATE_STARTEFFECT_1);


      window.onkeydown = function (e) {
        // Q 键  开始抽奖  81
        if (e.keyCode == 81) {
          if(self.showWon) {return}
          if(self.m_state == STATE_DRAWING) {return}
          switch (self.m_state) {
            case STATE_STARTEFFECT_1:
              self.setState(STATE_STARTEFFECT_2);
              break;
            case STATE_STARTEFFECT_2:
              self.setState(STATE_STARTEFFECT_3);
              break;
            case STATE_STARTEFFECT_3: 
              self.setState(STATE_LUCKDRAW);
              break;
            case STATE_LUCKDRAW: 
              self.setState(STATE_DRAWING);
              break;
            case STATE_DRAWING:
              self.setState(STATE_SHOWWON);
              break;
            case STATE_SHOWWON:
              self.setState(STATE_DRAWOVER);
            case STATE_DRAWOVER:  
              self.setState(STATE_LUCKDRAW);
              break;
          }
        }
        //  W 键  显示 抽中奖的人
        if(e.keyCode == 87) {
          self.showWon = !self.showWon;
        }
        //   R 键  清空 中奖 的人
        if(e.keyCode == 82) {
          self.wonArr = [];
          self.$datacenter.clearTextures();
          for (var key in members) {
            let name = members[key];
            let url = "static/assets/images/" + members[key] + ".jpg";
            THREE.ImageUtils.loadTexture(url, null, function (t) {
              self.$datacenter.addTexture(t, name);
            });
          }
        }
      }

//      //移动相机
//      new TWEEN.Tween(this.m_camera.position)
//        .to({
//          x: 5000,
//        }, 50000).onUpdate(function () {
//         self.m_camera.lookAt(0,0,0);
//        })
//        .start();

    },
    data() {
      return {
        showmsg: null,
        images: [],
        m_showingobj: [], // 在屏幕中的obj
        wonArr: [],  // 已经中奖的人
        showWon: false,  // 是否显示中奖的人
        name: "",
        m_state: 0
      }
    }
    ,
    methods:
      {
        successLoadImg() {
          this.loaded++;
          this.percent = Math.floor(this.loaded * 100 / members.length)
          this.$refs.jiancai.style.width = 522 * this.percent / 100 + 'px';
          if (this.loaded >= members.length) {
            // this.$router.replace("/pagetwo");
          }
        },
        setState(state) {
          var self = this;
          if (this.m_state == state) {
            return;
          }
          this.m_state = state;

          switch (this.m_state) {
            case  STATE_STARTEFFECT_1:
              {
                this.alltime = 0;
                break;
              }

            case STATE_STARTEFFECT_2:
              {
                TWEEN.removeAll()
                this.curindex = 0;
                var duration = 700;
                for (var i in this.m_showingobj) {
                  var object = this.m_showingobj[i];
                  this.curindex++;
                  var target = targets.text[i];
                  new TWEEN.Tween(object.position)
                    .to({
                      x: target.position.x,
                      y: target.position.y,
                      z: target.position.z
                    }, Math.random() * duration + duration)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();
                }
                break;
              }

            case  STATE_STARTEFFECT_3:
              {
                this.alltime = 0;
                this.m_next = targets.text;
                this.transformto(targets.head, 1500)
                break;
              }
            
            case STATE_LUCKDRAW:
              {
                this.m_timer = 0;
                TWEEN.removeAll();
                for(var i = 0; i < this.m_showingobj.length; i++) {
                  let object = this.m_showingobj[i];
                  let x_ = MathUtils.random(-4000, 4000);
                  let y_ = MathUtils.random(-4000, 4000);
                  new TWEEN.Tween(object.position)
                    .to({
                      x: x_,
                      y: y_,
                      z: 6000
                    }, 4000)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start()
                    .onComplete(function () {
                      self.pushToTemp(object);
                    });
                }
                break;
              }

            case STATE_DRAWING:   //抽中奖的人
              {
                TWEEN.removeAll();
                // 清空 场景
                for(var i = 0; i < this.m_showingobj.length; i++) {
                  let object = self.m_showingobj[i];
                  let x_ = MathUtils.random(-4000, 4000);
                  let y_ = MathUtils.random(-4000, 4000);
                  new TWEEN.Tween(object.position)
                    .to({
                      x: x_,
                      y: y_,
                      z: 6000
                    }, 2000)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start()
                    .onComplete(function () {
                      self.pushToTemp(object);
                    });
                }

                //  展示中奖的人
                var sprite = self.createRandowSprite();
                sprite.position.x = 0;
                sprite.position.y = 0;
                sprite.position.z = -300;
            
                new TWEEN.Tween(sprite.position)
                  .to({
                    x: 0,
                    y: -2.3,
                    z: 440
                  }, 2000)
                  .easing(TWEEN.Easing.Exponential.InOut)
                  .start()
                  .onComplete(function () {
                    self.m_showingobj.push(sprite);
                    var objects = self.$datacenter.getMaterials();
                    var wonSrc = sprite.material.map.image.currentSrc;
                    for(var i = 0; i < objects.length; i++) {
                      let object = objects[i];
                      if(wonSrc == object.map.image.currentSrc) {
                        self.wonArr.push({
                          src: object.map.image.currentSrc
                        });
                        objects.splice(i, 1);
                      }
                    }
                    //  展示成功之后 将状态改成  STATE_SHOWWON
                    self.setState(STATE_SHOWWON); // 显示抽奖的人状态
                  });
                break;
              }
            case STATE_DRAWOVER:
              {
                console.log(self.wonArr);
                break;
              }
          }
        },

        //弹出一个暂存图片
        popTempSprite() {
          //不够了 创建个新的
          if (this.m_tempsprites.length == 0) {
            var s = this.createRandowSprite();
            this.m_showingobj.push(s);
            return s;
          }

          //要不就随机来一个
          var index = MathUtils.random(0, this.m_tempsprites.length)
          var a = this.m_tempsprites[index];
          this.m_tempsprites.splice(index, 1);
          this.m_showingobj.push(a);
          return a;
        },
        pushToTemp(sprite) {
          //返还给暂存的库
          for (var i = 0; i < this.m_showingobj.length; i++) {
            if (this.m_showingobj[i] == sprite) {
              this.m_showingobj.splice(i, 1)
              break;
            }
          }
          sprite.position.x = -9999;
          sprite.position.y = -9999;
          this.m_tempsprites.push(sprite)
        },
        //主循环
        mainloop() {
          var self = this;
          var nowtime = new Date().getTime();
          var dt = (nowtime - this.m_lasttime) / 1000;
          this.m_lasttime = nowtime;
          switch (this.m_state) {
            case  STATE_STARTEFFECT_1: {
              this.m_timer += dt;
              if (this.m_timer < 0.5) {
                return;
              }
              this.m_timer = 0;
              var juli = 30;
              var X = juli * 1.6 + 20;
              var duration = 3000;

              {
                let sprite = this.popTempSprite();
                sprite.position.z = CAMERA_Z - juli;
                sprite.position.y = 2;
                sprite.position.x = -X;
                new TWEEN.Tween(sprite.position)
                  .to({
                    x: X,
                  }, duration)
                  .start().onComplete(function () {
                  self.pushToTemp(sprite);
                });
              }
              {
                let sprite = this.popTempSprite();
                sprite.position.z = CAMERA_Z - juli;
                sprite.position.y = -15;
                sprite.position.x = X;
                new TWEEN.Tween(sprite.position)
                  .to({
                    x: -X,
                  }, duration)
                  .start().onComplete(function () {
                  self.pushToTemp(sprite);
                });
              }
              break;
            }
            case  STATE_STARTEFFECT_2: {

              for (var k = 0; k < 10; k++) {
                var duration = 1200;
                this.curindex++;
                let i = this.curindex;
                if (i >= targets.text.length) {
                  return;
                }
                let object = this.popTempSprite();
                var number = Math.random() * Math.PI * 2;
                object.position.x = Math.sin(number) * 100;
                object.position.y = Math.cos(number) * 100;
                object.position.z = CAMERA_Z + 20;
                var target = targets.text[i];
                new TWEEN.Tween(object.position)
                  .to({
                    x: target.position.x,
                    y: target.position.y,
                    z: target.position.z
                  }, Math.random() * duration + duration)
                  .easing(TWEEN.Easing.Exponential.InOut)
                  .start();
              }

              break;
            }

            case  STATE_STARTEFFECT_3: {

              this.m_timer += dt;
              if (this.m_timer > 10) {
                this.m_timer = 0;
                this.transformto(this.m_next, 1500)
                if (this.m_next == targets.head) {
                  this.m_next = targets.text;
                }
                else {
                  this.m_next = targets.head;
                }
              }
              break;
            }
            
            case STATE_LUCKDRAW: {
              var self = this;

              this.m_timer += dt;
              // if (this.m_timer > 0.03) {
                this.m_timer = 0;
                let object = this.popTempSprite();
                object.position.x = MathUtils.random(-100, 100);
                object.position.y = MathUtils.random(-100, 100);
                object.position.z = Math.random() * - 40 + 20;

                var duration = 400;
                new TWEEN.Tween(object.position)
                  .to({
                    z: 500
                  }, Math.random() * duration + duration)
                  .start()
                  .onComplete(function ()
                  {
                    self.pushToTemp(object);
                  })
              // }

              break;
            }
            
          }


        },
        createRandowSprite() {
          var Materials = this.$datacenter.getMaterials();
          var index = MathUtils.random(0, Materials.length);
          var sprite = createSprite(Materials[index]);
          sprite.position.x = -9999;
          sprite.position.y = -9999;
          this.m_scene.add(sprite);
          return sprite;
        },
        getStyle(item) {
          StyleUtil.ObjDataToStyle(item.objdata, item.style);
          return item.style;
        },
        transformto(targets, duration) {
          var self = this;
//          TWEEN.removeAll();
          //把组成图形需要的图片 挨个tween到目标位置
          for (var i = 0; i < targets.length; i++) {
            var object;
            //如果屏幕里的够用 就用屏幕里的
            if (this.m_showingobj.length > i) {
              object = this.m_showingobj[i];
            }
            else {
              //不够就从暂存的里面拿一个出来
              object = this.popTempSprite();
              object.position.x = MathUtils.random(-1000, 1000)
              object.position.y = MathUtils.random(-1000, 1000)
              object.position.z = 0;
            }
            var target = targets[i];
            new TWEEN.Tween(object.position)
              .to({
                x: target.position.x,
                y: target.position.y,
                z: target.position.z
              }, Math.random() * duration + duration)
              .easing(TWEEN.Easing.Exponential.InOut)
              .start();
//            new TWEEN.Tween(object.rotation)
//              .to({
//                x: target.rotation.x,
//                y: target.rotation.y,
//                z: target.rotation.z
//              }, Math.random() * duration + duration)
//              .easing(TWEEN.Easing.Exponential.InOut)
//              .start();
          }

          //多 的 飞出屏幕，还给暂存空间
          for (var i = targets.length; i < this.m_showingobj.length; i++) {
            var object = this.m_showingobj[i];

            var number = Math.random() * Math.PI * 2;
            new TWEEN.Tween(object.position)
              .to({
                x: Math.sin(number) * MathUtils.random(5000, 10000),
                y: Math.cos(number) * MathUtils.random(5000, 10000),
                z: MathUtils.random(0, 1000)
              }, Math.random() * duration + duration)
              .easing(TWEEN.Easing.Exponential.InOut)
              .start().onComplete(function () {
              self.pushToTemp(object);
            });
//            new TWEEN.Tween(object.rotation)
//              .to({
//                x: target.rotation.x,
//                y: target.rotation.y,
//                z: target.rotation.z
//              }, Math.random() * duration + duration)
//              .easing(TWEEN.Easing.Exponential.InOut)
//              .start();
          }
        }
      }
    ,
    components: {}
  }
</script>
<style scoped>
  .PageTwo {
    position: fixed;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
    background-color: #FFFFFF;
  }

  .PageTwo .threeview {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .PageTwo .showWon {padding: 5%;width: 90%;height: 90%;position: absolute;top: 0;left: 0;z-index: 5;background-color: rgba(0,0,0,1);}
  .PageTwo .showWon img {display: inline-block;width: 150px;margin: 10px;}

</style>
