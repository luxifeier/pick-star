cc.Class({
    extends: cc.Component,

    properties: {
        // 主角跳跃高度
        jumpHeight: 0,
        // 主角跳跃持续时间
        jumpDuration: 0,
        // 最大移动速度
        maxMoveSpeed: 0,
        // 加速度
        accel: 0,
        //声明originPos属性
        originPos:{
            default:null,
            type:cc.Node
        },
        //跳跃音效资源引用
        jumpAudio:{
            default:null,
            type:cc.AudioClip
        },
    },
    startMoveAt:function(){
        //开启触屏监听
        this.onMove();
        //启用Player组件
        this.enabled = true;
        //设置Player组件xSpeed属性为0
        this.xSpeed = 0;
        //初始化Player位置
        this.node.setPosition(cc.v2(0,-144));
        //开始跳动
        this.node.runAction(this.JumpAction);
    },
    setJumpAction:function(){
        //向上跳跃
        var jumpUp = cc.moveBy(this.jumpDuration,cc.v2(0,this.jumpHeight)).easing(cc.easeCubicActionIn());
        //向下跳跃
        var jumpDown = cc.moveBy(this.jumpDuration,cc.v2(0,-this.jumpHeight)).easing(cc.easeCubicActionIn());
        //添加一个回调函数，用于在动作结束时回调
        var callback = cc.callFunc(this.playJumpSound,this);
        //不断重复上下跳跃动作
        return cc.repeatForever(cc.sequence(jumpUp,jumpDown,callback));
    },
    playJumpSound:function(){
        //调用cc.audioengine播放音频
        cc.audioEngine.playEffect(this.jumpAudio,false);
    },
     onTouchStart:function(event){//触屏开始
        //获取当前点击点的全局坐标,转化为originPos节点空间坐标系
        this.xTouchPos = this.originPos.convertToNodeSpaceAR(event.getLocation()).x;
        this.xPos = this.node.getPosition().x;
       if(this.xTouchPos<this.xPos){//说明触点在Player节点的左边
            this.accLeft = true;
       }
       else{
           this.accRight = true;
       }
    },
    onTouchEnd:function(event){//触屏结束
        if(this.xTouchPos<this.xPos){
            this.accLeft = false;
        }
        else{
            this.accRight = false;
        }
    },
     onLoad(){//场景加载后执行onLoad()方法
        //初始化Player节点动作
         this.JumpAction = this.setJumpAction();//返回执行的动作
        // this.node.runAction(this.JumpAction);//执行并返回该执行的动作。该节点将会变成动作的目标

         //初始化加速度方向开关
        this.accLeft = false;
        this.accRight = false;

        //主角当前水平方向的速度
        this.xSpeed = 0;
     },
     onMove(){
         //初始化触屏监听
         this.node.parent.on('touchstart',this.onTouchStart,this);
         this.node.parent.on('touchend',this.onTouchEnd,this);
     },
     onDestroy(){
         this.node.parent.off('touchstart',this.onTouchStart,this);
         this.node.parent.off('touchend',this.onTouchEnd,this);
     },
     update (dt) {
         //根据当前加速度方向每帧更新加速度
         if(this.accLeft){
            this.xSpeed -= this.accel * dt;
         }
         else if(this.accRight){
             this.xSpeed += this.accel * dt;
         }
         //限制主角的最大加速度不能超过maxMoveSpeed
         if(Math.abs(this.xSpeed) > this.maxMoveSpeed){
            //如果加速度超过了最大加速度，就设置当前加速度为最大加速度
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
         }
         //根据当前加速度更新Player节点位置
         this.node.x += this.xSpeed * dt;
         //限制主角移动范围不能超出屏幕
         if(this.node.x > this.node.parent.width/2){//player节点已经超出屏幕右边
            this.node.x = this.node.parent.width/2;
            this.xSpeed = 0;
         }
         else if(this.node.x < -this.node.parent.width/2){//player节点已经超出屏幕左边
            this.node.x = -this.node.parent.width/2;
            this.xSpeed = 0;
         }
     },
});
