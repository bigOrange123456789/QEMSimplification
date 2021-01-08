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

        loop();
        function loop() {
            renderer.render(scene,camera);
            requestAnimationFrame(loop);
        }
    },
}
function Referee(){
    this.index=0;//记录断言的序号
    this.result=true;
    this.assertion=function (A,B,arrayFlag) {
        if(typeof(arrayFlag)==="undefined")arrayFlag="";
        this.index++;

        if(typeof(A.length)!="undefined"){//为数组
            if(typeof(A.length)==="undefined"){
                this.result=false;
                alert("this assertion is failed!");
                console.log(arrayFlag+"This assertion"+this.index+" is failed!");
            }else{
                if(A.length!==B.length){
                    alert("this assertion is failed!");
                    console.log(arrayFlag+"This assertion"+this.index+" is failed!");
                }else if(A.length===0){
                        console.log(arrayFlag+"This assertion"+this.index+" is successful!");
                }else{
                    for(var i=0;i<A.length;i++)
                        this.assertion(A[i],B[i],i+"/"+A.length+":");
                }
            }
        }else{//不是数组
            if(A!==B){
                this.result=false;
                alert("this assertion is failed!");
                console.log(arrayFlag+"This assertion"+this.index+" is failed!");
            }else console.log(arrayFlag+"This assertion"+this.index+" is successful!");
        }

    }
}


document.write("<script language=javascript src=test/UI.js></script>");
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