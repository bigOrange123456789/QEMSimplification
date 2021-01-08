function Test() {
    this.myTestFilePath=[
        //"Template",
        "QEMSimplification",
        //"MyPMLoader"
    ]
}
Test.prototype={
    launch:function(){
        //this.loadFile(this.myTestFilePath);
        var scope=this;
        window.setTimeout((function(){
            var myQEMSimplificationTest=new QEMSimplificationTest(scope);
            myQEMSimplificationTest.main();
        }),100);
        /*script.onload=function(){
            var myQEMSimplificationTest=new QEMSimplificationTest(scope);
            myQEMSimplificationTest.main();
        }*/

    },
    loadFile:function(){
        var myTestFilePath=this.myTestFilePath;
        document.write("<script language=javascript src=test/tool/UI.js></script>");
        document.write("<script language=javascript src=test/tool/Referee.js></script>");
        for(var i=0;i<myTestFilePath.length;i++){
            console.log("The file being tested is "+myTestFilePath[i]+".js");

            document.write("<script language=javascript src=test/"+myTestFilePath[i]+".test.js></script>");
        }
        //var script=document.createElement('script');
        //   script.setAttribute('type','text/javascript');
        //   script.setAttribute('src','jquery-1.8.3.js');
        //for(var i=0;i<)


    },
    initContext:function(){
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