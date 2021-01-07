function Test() {

}
Test.prototype={
    init:function(){
        var scene=this.initScene();
        var camera=this.initCamere();
        this.render(scene, camera);
        return [scene, camera];
    },
    initScene:function(){
        var scene= new THREE.Scene();
        light = new THREE.AmbientLight(0xffffff,1.0)
        scene.add(light);
        return scene;
    },
    initCamere:function(){
        return new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 10000);
    },
    render:function (scene, camera) {
        var renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0xff00ff);
        document.body.appendChild( renderer.domElement );
        renderer.domElement.id="myCanvas"
        renderer.domElement.renderer=renderer;
        renderer.domElement.scene=scene;
        renderer.domElement.camera=camera;
        console.log(renderer.domElement);

        loop();
        function loop() {
            renderer.render(scene,camera);
            requestAnimationFrame(loop);
        }
    },
}

function Text(str,color,size,parentNode){//文本
    if (typeof(parentNode) == "undefined") parentNode = document.body;
    this.parentNode=parentNode;
    this.str=str;
    this.color=color;
    this.size=size;
    this.oText=h1(str,color,size,parentNode);
    this.reStr=function(str){
        this.oText.innerHTML=str;
    }
    function h1(str,color,size,parentNode){
        var oText=document.createElement('h1');
        oText.innerHTML=str;
        oText.style.cssText=
            //'color:skyblue;'+
            'color:'+color+';'+//文字颜色
            //'background:#aff;'+//背景颜色
            'font-size:'+size+'px;'+//文字大小
            //'width:60px;height:40px;'+//文本大小
            'font-weight:normal;'+
        //+'padding-top:50px;'//距离上一个对象的距离
        'position:fixed;'+//到窗体的位置
        'left:'+0+'px;'+//到部件左边距离
        'top:'+0+'px;'; //到部件右边 距离
        ;
        parentNode.appendChild(oText);
        return oText;
    }
}
//var myTest=new Test();
var  myTestFilePath=[
    //"Template",
    "QEMSimplification",
    //"MyPMLoader"
];
for(var i=0;i<myTestFilePath.length;i++){
    console.log("The file being tested is "+myTestFilePath[i]+".js");
    document.write("<script language=javascript src=test/"+myTestFilePath[i]+".test.js></script>");
}
//var myTest=new Text("TEST","0x00ffff",100);