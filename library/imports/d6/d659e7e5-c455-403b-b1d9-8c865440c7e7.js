"use strict";
cc._RF.push(module, 'd659eflxFVAO7HZjIZUQMfn', 'Game');
// scripts/Game.js

'use strict';

cc.Class({
    extends: cc.Component,

    properties: {
        //这个属性引用星星的预制资源
        starPreFab: {
            default: null,
            type: cc.Prefab
        },
        //星星消失后时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,
        //地面节点用于生成星星生成的高度
        ground: {
            default: null,
            type: cc.Node
        },
        //player节点，用于获取主角的高度
        player: {
            default: null,
            type: cc.Node
        },
        //score label引用
        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        //得分音效引用
        scoreAudio: {
            default: null,
            type: cc.AudioClip
        },
        //button 节点引用
        btnNote: {
            default: null,
            type: cc.Node
        },
        //GameOver节点引用
        gameOverNote: {
            default: null,
            type: cc.Node
        }
    },

    onLoad: function onLoad() {
        //获取地平面的的y轴坐标
        this.groundY = this.ground.y + this.ground.height / 2;
        //初始化计时器
        this.timer = 0;
        this.starDuration = 0;
        //初始化score
        this.score = 0;
        //隐藏GameOver节点,禁用Game组件
        this.gameOverNote.active = false;
        this.enabled = false;
    },

    //play按钮被点击后，响应onStartGame()
    onStartGame: function onStartGame() {
        this.enabled = true;
        //将button按钮移出可视区域
        this.btnNote.x = 3000;
        //Player开始运动
        this.player.getComponent('Player').startMoveAt();
        //星星随机显示
        this.spawnNewStar();
    },
    gainScore: function gainScore() {
        //计算得分
        this.score += 1; //每摘到一个星星score加一
        this.scoreDisplay.string = 'Score:' + this.score;
        //播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },
    gameOver: function gameOver() {
        //游戏结束
        //停止Player节点的跳跃动作
        this.player.stopAllActions();
        this.player.getComponent('Player').xSpeed = 0;
        this.player.getComponent('Player').onDestroy();
        this.gameOverNote.active = true;
        //延迟1秒重新加载场景
        this.scheduleOnce(this.reLoad, 1);
    },
    reLoad: function reLoad() {
        cc.director.loadScene('game');
    },
    spawnNewStar: function spawnNewStar() {
        //使用预制资源生成一个新的节点
        var newStar = cc.instantiate(this.starPreFab);
        //将生成的节点添加到Canvas节点下
        this.node.addChild(newStar);
        //为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());
        //在星星组件上暂存Game对象的引用
        newStar.getComponent('Star').game = this;
        //重置计数器，根据消失时间随机一个数
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },
    getNewStarPosition: function getNewStarPosition() {
        var randX = 0;
        //根据地平线的位置和主角高度，随机得到星星的y坐标
        var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        //根据屏幕宽度，随机星星的x轴坐标
        var maxX = this.node.width / 2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        //返回星星坐标
        return cc.v2(randX, randY);
    },
    update: function update(dt) {
        //每帧更新计时器，超过限度还没生成新的星星的就调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
        }
        this.timer += dt;
    }
});

cc._RF.pop();