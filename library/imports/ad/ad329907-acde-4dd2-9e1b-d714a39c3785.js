"use strict";
cc._RF.push(module, 'ad329kHrN5N0p4b1xSjnDeF', 'Star');
// scripts/Star.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        //星星与主角之间的距离小于这个值，就完成搜集
        pickRadius: 0
    },
    getPlayerDistance: function getPlayerDistance() {
        //根据player节点位置判断距离
        var playerPos = this.game.player.getPosition();
        //根据两点位置计算距离
        var dist = this.node.position.sub(playerPos).mag();

        return dist;
    },
    onPicked: function onPicked() {
        //当星星被摘取，调用Game脚本中的spawnNewStar()方法生成新的星星
        this.game.spawnNewStar();
        //调用Game脚本中的gainScore(),计算得分
        this.game.gainScore();
        //销毁当前获取的星星
        this.node.destroy();
    },
    //  onLoad () {

    //  },
    update: function update(dt) {
        //根据 Game 脚本中的计时器更新星星的透明度
        var opacityRatio = 1 - this.game.timer / this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
        //每帧判断主角与星星之间的距离如果小于pickRadius值，调用onPicked()
        if (this.getPlayerDistance() < this.pickRadius) {
            //调用onPicked()
            this.onPicked();
        }
    }
});

cc._RF.pop();