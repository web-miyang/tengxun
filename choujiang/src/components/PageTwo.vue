<template>
  <div class="PageTwo">
    <div class="threeview" ref="threeview">
      <div class="showWon" v-if="showWon">
        <img v-for="(item, index) in wonArr" :src="item.src">
      </div>
    </div>
  </div>
</template>

<script>
import members from "../../static/js/members";
import MathUtils from "../lib/js/MathUtils";
import laipao8 from "../../static/js/laipao8";
import data2018 from "../../static/js/data2019";

const WORLD_HEIGHT = 900;
const WORLD_WIDTH = 1600;
const CAMERA_Z = 450;

//******各个不同的状态
var STATE_LOADING = 0; //  加载图片状态
var STATE_STARTEFFECT_1 = 1; //开始的特效 第一阶段
var STATE_STARTEFFECT_2 = 2; //开始特效第二阶段
var STATE_STARTEFFECT_3 = 3; //开始特效第二阶段
var STATE_LUCKDRAW = 4; // 开始抽奖循环图片
var STATE_DRAWING = 5; //  开始抽奖
var STATE_SHOWWON = 6; // 显示中獎的人
var STATE_FLYOUT = 7; //  中奖的人移除
var STATE_DRAWOVER = 8; // 显示结束开始另一轮抽奖循环
var START_CHOUJIANG = 3;

var THREE = require("three");
var TWEEN = require("@tweenjs/tween.js");

//存储预计算的位置
var targets = {
  data2018: [],
  text: []
};

function initThree(self, view) {
  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(
    90,
    WORLD_WIDTH / WORLD_HEIGHT,
    1,
    3000
  );
  camera.position.z = CAMERA_Z;

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  view.appendChild(renderer.domElement);

  function render() {
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

export default {
  name: "HelloWorld",
  mounted: function() {
    TWEEN.removeAll();

    var self = this;

    //初始化3d世界
    initThree(this, this.$refs.threeview);

    // var stats = new Stats();
    // stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    // document.body.appendChild(stats.dom);

    //主程循环函数
    function animate() {
      self.mainloop();
      TWEEN.update();
      self.render();
      // stats.update();
      requestAnimationFrame(animate);
    }

    animate();

    this.startStorage();
    console.log('00000');
    this.setState(STATE_LOADING);

    window.onkeydown = function(e) {
      // Q 键  开始抽奖  81
      if (e.keyCode == 81 || e.keyCode == 34) {
        if (self.showWon) {
          return;
        }
        console.log(self.m_state)
        if (self.m_state == STATE_DRAWING) {
          return;
        }
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
            self.setState(STATE_FLYOUT);
            break;
        }
      }
      //  W 键  显示 抽中奖的人
      if (e.keyCode == 87) {
        self.showWon = !self.showWon;
      }
      //   R 键  清空 中奖 的人
      if (e.keyCode == 82) {
        var r = confirm("是否清空?");
        if (r) {
          self.clearAll(self);
        }
      }
    };
  },
  data() {
    return {
      key: "alreadyWon",
      showmsg: null,
      images: [],
      m_showingobj: [], // 在屏幕中的obj
      wonArr: [], // 已经中奖的人
      showWon: false, // 是否显示中奖的人
      name: "",
      m_state: -1,
      loaded: 0,
      objWon: null
    };
  },
  methods: {
    // 初始化杂项
    initGame() {
      var self = this;
      //背景图
      THREE.ImageUtils.loadTexture("static/assets/nhbg.png", null, function(t) {
        var bg = new THREE.MeshBasicMaterial({ map: t });
        var spritebg = createSprite(bg, WORLD_WIDTH, WORLD_HEIGHT);
        self.m_scene.add(spritebg);
      });

      //所有缓存精灵都存放在这个数组里
      this.m_tempsprites = [];
      //一次性创建足够的图片
      for (var i = 0; i < 1510; i++) {
        var sprite = this.createRandowSprite();
        this.m_tempsprites.push(sprite);
      }
      //创建那些预计算的点
      targets.text = [];
      for (var i = 0, l = laipao8.length; i < l; i++) {
        let pos = laipao8[i];
        let object = new THREE.Object3D();
        object.position.x = pos.x * 9 - 500;
        object.position.y = pos.y * 9 - 150;
        object.position.z = 1;
        targets.text.splice(
          MathUtils.random(0, targets.text.length),
          0,
          object
        );
      }

      //另外一个形状
      targets.data2018 = [];
      for (var i = 0, l = data2018.length; i < l; i++) {
        var pos = data2018[i];
        var object = new THREE.Object3D();
        object.position.x = pos.x * 9 - 500;
        object.position.y = pos.y * 9 - 150;
        object.position.z = 1;
        targets.data2018.splice(
          MathUtils.random(0, targets.data2018.length),
          0,
          object
        );
      }

      //变化到文字形态
      //  this.transformto(targets.text, 1500)
      this.m_lasttime = new Date().getTime();
      this.m_timer = 0;
    },
    //载入所有的图片
    loadingImageFun() {
      var self = this;
      for (var key in members) {
        let name = members[key];
        let url = "static/assets/images/" + members[key] + ".jpg";
        THREE.ImageUtils.loadTexture(url, null, function(t) {
          self.$datacenter.addTexture(t, name);
          self.successLoadImg();
        });
      }
    },
    // 加载成功
    successLoadImg() {
      var self = this;
      this.loaded++;
      if (this.loaded >= members.length) {
        this.setState(STATE_STARTEFFECT_1);
      }
    },
    // 设置状态--
    setState(state) {
      console.log(state);
      var self = this;
      if (this.m_state == state) {
        return;
      }
      this.m_state = state;

      switch (this.m_state) {
        case STATE_LOADING: {
          //  加载所有的图片
          this.loadingImageFun();
          break;
        }
        case STATE_STARTEFFECT_1: {
          this.m_test = [];
          this.initGame();
          this.alltime = 0;
          this.m_lasttime = new Date().getTime();
          this.m_timer = 0.5;
          break;

        }
        case STATE_STARTEFFECT_2: {
          TWEEN.removeAll();
          this.curindex = 0;
          var duration = 700;
          for (var i in this.m_showingobj) {
            let object = this.m_showingobj[i];
            this.curindex++;
            var target = targets.text[i];
            new TWEEN.Tween(object.position)
              .to(
                {
                  x: target.position.x,
                  y: target.position.y,
                  z: target.position.z
                },
                Math.random() * duration + duration
              )
              .easing(TWEEN.Easing.Exponential.InOut)
              .start();
          }
          break;
        }
        case STATE_STARTEFFECT_3: {
          this.alltime = 0;
          this.m_next = targets.text;
          this.transformto(targets.data2018, 1500);
          break;
        }
        case STATE_LUCKDRAW: {
          this.m_timer = 0;
          self.flyOut();
          break;
        }
        //抽中奖的人
        case STATE_DRAWING: {
          //  展示中奖的人
          var sprite = self.createRandowSprite();
          sprite.position.x = 0;
          sprite.position.y = -2.3;
          sprite.position.z = -300;

          new TWEEN.Tween(sprite.position)
            .to(
              {
                z: 440
              },
              600
            )
            .easing(TWEEN.Easing.Exponential.InOut)
            .start()
            .onComplete(function() {
              self.HandleWon(sprite);
              //  展示成功之后 将状态改成  STATE_SHOWWON
              self.setState(STATE_SHOWWON); // 显示抽奖的人状态
            });
          break;
        }
        case STATE_FLYOUT: {
          self.wonFlyOut(self.objWon);
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
      var index = MathUtils.random(0, this.m_tempsprites.length);
      var a = this.m_tempsprites[index];
      this.m_tempsprites.splice(index, 1);
      this.m_showingobj.push(a);
      return a;
    },
    //返还给暂存的库
    pushToTemp(sprite) {
      for (var i = 0; i < this.m_showingobj.length; i++) {
        if (this.m_showingobj[i] == sprite) {
          this.m_showingobj.splice(i, 1);
          break;
        }
      }
      sprite.position.x = -9999;
      sprite.position.y = -9999;
      this.m_tempsprites.push(sprite);
    },
    //主循环
    mainloop() {
      var self = this;
      var nowtime = new Date().getTime();
      //var dt = (nowtime - this.m_lasttime) / 1000;
      var dt = 0.02;
      this.m_lasttime = nowtime;
      switch (this.m_state) {
        case STATE_STARTEFFECT_1: {
          /*self.STATE_STARTEFFECT_1_FUN(dt);
          break;*/
          self.STATE_LUCKDRAW(dt);
          break;
        }
        case STATE_STARTEFFECT_2: {
          self.STATE_STARTEFFECT_2_FUN();
          break;
        }
        case STATE_STARTEFFECT_3: {
          self.STATE_STARTEFFECT_3_FUN(dt);
          break;
        }
        case STATE_LUCKDRAW: {
          self.STATE_LUCKDRAW(dt);
          break;
        }
      }
    },
    // 随机抽取obj
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
    // 两种形态的变换
    transformto(targets, duration) {
      TWEEN.removeAll();
      var self = this;
      //把组成图形需要的图片 挨个tween到目标位置
      for (var i = 0; i < targets.length; i++) {
        let object;
        //如果屏幕里的够用 就用屏幕里的
        if (this.m_showingobj.length > i) {
          object = this.m_showingobj[i];
        } else {
          //不够就从暂存的里面拿一个出来
          object = this.popTempSprite();
          object.position.x = MathUtils.random(-1000, 1000);
          object.position.y = MathUtils.random(-1000, 1000);
          object.position.z = 0;
        }
        var target = targets[i];
        new TWEEN.Tween(object.position)
          .to(
            {
              x: target.position.x,
              y: target.position.y,
              z: target.position.z
            },
            Math.random() * duration + duration
          )
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();
        // new TWEEN.Tween(object.rotation)
        //   .to({
        //     x: target.rotation.x,
        //     y: target.rotation.y,
        //     z: target.rotation.z
        //   }, Math.random() * duration + duration)
        //   .easing(TWEEN.Easing.Exponential.InOut)
        //   .start();
      }

      //多 的 飞出屏幕，还给暂存空间
      for (var i = targets.length; i < this.m_showingobj.length; i++) {
        let object = this.m_showingobj[i];

        var number = Math.random() * Math.PI * 2;
        new TWEEN.Tween(object.position)
          .to(
            {
              x: Math.sin(number) * MathUtils.random(5000, 10000),
              y: Math.cos(number) * MathUtils.random(5000, 10000),
              z: MathUtils.random(0, 1000)
            },
            Math.random() * duration + duration
          )
          .easing(TWEEN.Easing.Exponential.InOut)
          .start()
          .onComplete(function() {
            self.pushToTemp(object);
          });
        // new TWEEN.Tween(object.rotation)
        //   .to({
        //     x: target.rotation.x,
        //     y: target.rotation.y,
        //     z: target.rotation.z
        //   }, Math.random() * duration + duration)
        //   .easing(TWEEN.Easing.Exponential.InOut)
        //   .start();
      }
    },
    // 飞出屏幕
    flyOut() {
      var self = this;
      TWEEN.removeAll();
      for (var i = 0; i < this.m_showingobj.length; i++) {
        let object = this.m_showingobj[i];
        let x_ = MathUtils.random(-4000, 4000);
        let y_ = MathUtils.random(-4000, 4000);
        new TWEEN.Tween(object.position)
          .to(
            {
              x: x_,
              y: y_,
              z: 600
            },
            4000
          )
          .easing(TWEEN.Easing.Exponential.InOut)
          .start()
          .onComplete(function() {
            self.pushToTemp(object);
          });
      }
    },
    STATE_STARTEFFECT_1_FUN(dt) {
      var self = this;

      this.m_timer -= dt;
      if (this.m_timer > 0) {
        return;
      }
      this.m_timer = 1;
      var juli = 30;
      var X = juli * 1.5 + 10;
      var duration = 10000;
      {
        let sprite = this.popTempSprite();
        sprite.position.z = CAMERA_Z - juli;
        sprite.position.y = 2;
        sprite.position.x = -X;
        new TWEEN.Tween(sprite.position)
          .to(
            {
              x: X + 50
            },
            duration
          )
          .start()
          .onComplete(function() {
            self.pushToTemp(sprite);
          });
      }
      {
        let sprite = this.popTempSprite();
        sprite.position.z = CAMERA_Z - juli;
        sprite.position.y = -15;
        sprite.position.x = X;
        new TWEEN.Tween(sprite.position)
          .to(
            {
              x: -X - 50
            },
            duration
          )
          .start()
          .onComplete(function() {
            self.pushToTemp(sprite);
          });
      }
    },
    STATE_STARTEFFECT_2_FUN() {
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
          .to(
            {
              x: target.position.x,
              y: target.position.y,
              z: target.position.z
            },
            Math.random() * duration + duration
          )
          .easing(TWEEN.Easing.Exponential.InOut)
          .start();
      }
    },
    STATE_STARTEFFECT_3_FUN(dt) {
      this.m_timer += dt;
      if (this.m_timer > 6) {
        this.m_timer = 0;
        this.transformto(this.m_next, 1500);
        if (this.m_next == targets.data2018) {
          this.m_next = targets.text;
        } else {
          this.m_next = targets.data2018;
        }
      }
    },
    STATE_LUCKDRAW(dt) {
      var self = this;

      this.m_timer += dt;
      //  if (this.m_timer > 1) {
      this.m_timer = 0;
      let object = this.popTempSprite();
      object.position.x = MathUtils.random(-100, 100);
      object.position.y = MathUtils.random(-150, 50);

      // object.position.x =0;
      // object.position.y =0;

      object.position.z = 1;

      var duration = 600;
      new TWEEN.Tween(object.position)
        .to(
          {
            z: 500
          },
          Math.random()*duration + duration
        )
        .start()
        .onComplete(function() {
          self.pushToTemp(object);
        });
      //  }
    },
    wonFlyOut(sprite) {
      var self = this;
      new TWEEN.Tween(sprite.position)
        .to(
          {
            z: 600
          },
          700
        )
        .easing(TWEEN.Easing.Exponential.InOut)
        .start()
        .onComplete(function() {
          self.objWon = null;
          self.setState(STATE_LUCKDRAW);
        });
    },
    // 中奖之后的处理
    HandleWon(sprite) {
      var self = this;
      self.m_showingobj.push(sprite);
      self.objWon = sprite;
      let objects = self.$datacenter.getMaterials();
      console.log('objects')
      console.log(objects)
      var wonSrc = sprite.material.map.image.currentSrc;

      for (var i = objects.length - 1; i >= 0; i--) {
        let object = objects[i];
        if (wonSrc == object.map.image.currentSrc) {
          var srcArr = wonSrc.split("images/");
          self.wonArr.push({
            src: object.map.image.currentSrc
          });
          self.setStorage(self.wonArr);
          objects.splice(i, 1);
        }
      }
      // for (var i = 0; i < objects.length; i++) {
      //   let object = objects[i];
      //   if (wonSrc == object.map.image.currentSrc) {
      //     var srcArr = wonSrc.split("images/");
      //     self.wonArr.push({
      //       src: object.map.image.currentSrc
      //     });
      //     self.setStorage(self.wonArr);
      //     objects.splice(i, 1);
      //   }
      // }


    },
    // 检测是否存在localStorage
    startStorage() {
      var self = this;
      var storageKey = localStorage.getItem(this.key);
      if (storageKey != undefined && storageKey != "" && storageKey != null) {
        // console.log(self.$datacenter.getMaterials());
        self.$datacenter.clearTextures();
        // console.log(self.$datacenter.getMaterials());
        //   有   数据
        storageKey = JSON.parse(storageKey);

        var arr = JSON.parse(localStorage.getItem(this.key));
        var arrHan = [];
        // 已经中奖的人
        for (var i = 0; i < arr.length; i++) {
          self.wonArr.push({ src: arr[i].src });
          var srcArr = arr[i].src.split("images/");
          arrHan.push(srcArr[1]);
        }
        for (var i = 0; i < members.length; i++) {
          var src = members[i] + ".jpg";
          for (var j = arrHan.length - 1; j >= 0; j--) {
            if (src == arrHan[j]) {
              members.splice(i, 1);
            }
          }
        }
        // console.log(self.$datacenter.getMaterials());
      }
    },
    // 设置localStorage
    setStorage(arr) {
      arr = JSON.stringify(arr);
      localStorage.setItem(this.key, arr);
    },
    // 清除localStorage
    clearStorage() {
      localStorage.clear();
    },
    // 清空所有
    clearAll(self) {
      self.wonArr = [];
      self.$datacenter.clearTextures();
      self.clearStorage();
      for (var key in members) {
        let name = members[key];
        let url = "static/assets/images/" + members[key] + ".jpg";
        THREE.ImageUtils.loadTexture(url, null, function(t) {
          self.$datacenter.addTexture(t, name);
        });
      }
    }
  },
  components: {}
};
</script>
<style scoped>
.PageTwo {
  position: fixed;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #ffffff;
}

.PageTwo .threeview {
  width: 100%;
  height: 100%;
  position: relative;
}

.PageTwo .showWon {
  padding: 5%;
  width: 90%;
  height: 90%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  background-image: url("../../static/assets/nhbg.png");
  background-size: 100% 92.8%;
  background-repeat: no-repeat;
}

/* .PageTwo .showWon span {border: 1px solid black;width: 200px;height: 100px;}
  .PageTwo .showWon span:nth-child(odd) {float: left;width: 300px;}
  .PageTwo .showWon span:nth-child(even) {float: right;} */
.PageTwo .showWon img {
  display: inline-block;
  width: 200px;
  margin: 10px;
}

.LoadIng {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #b51e25;
}

.LoadIng .loadbg {
  position: absolute;
  transform: translate(0, -50%);
  left: 114px;
  top: 703px;
}

.LoadIng .jiancai {
  position: absolute;
  transform: translate(0, -50%);
  width: 0px;
  height: 16px;
  overflow-x: hidden;
  left: 114px;
  top: 700px;
  z-index: 10;
}
</style>
