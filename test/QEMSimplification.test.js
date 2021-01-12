//QEMSimplification.test
function QEMSimplificationTest(myTest){
        this.scene;
        this.camera;
        this.myTest=myTest;

        this.myQEMSimplification;
        this.tag;
        this.button_flag;
        this.referee;
}
QEMSimplificationTest.prototype={
        setContext:function () {
                var nameContext="";
                console.log('set context:'+nameContext)
                this.myQEMSimplification=new QEMSimplification();
                this.referee=new Referee();
                this.tag=new Text("","green",25);
                this.button_flag=true;
                var button=new Button("test","green",25);
                button.addEvent(function () {
                        scope.button_flag=!scope.button_flag;
                });
                var camera, scene, renderer;
                var light;
                init();
                loop();
                function init() {
                        camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 10000);
                        camera.position.z = 20;

                        scene = new THREE.Scene();

                        renderer = new THREE.WebGLRenderer();
                        renderer.setPixelRatio(window.devicePixelRatio);
                        renderer.setSize(window.innerWidth, window.innerHeight);
                        renderer.setClearColor(0xff00ff);
                        document.body.appendChild( renderer.domElement );
                        //container.appendChild(renderer.domElement);

                        if (renderer.capabilities.isWebGL2 === false && renderer.extensions.has('ANGLE_instanced_arrays') === false) {
                                document.getElementById('notSupported').style.display = '';
                                return;
                        }
                        light = new THREE.AmbientLight(0xffffff,1.0)
                        scene.add(light);
                        new PlayerControl(camera);
                }
                function loop(){
                        renderer.render( scene, camera );
                        requestAnimationFrame(loop);
                }
                this.scene=scene;
                this.camera=camera;
        },
        //新环境设置
        setContext2:function () {
                var nameContext="";
                console.log('set context:'+nameContext)
                var scope=this;
                this.myQEMSimplification=new QEMSimplification();
                this.referee=new Referee();
                this.tag=new Text("","green",25);
                this.button_flag=true;
                var button=new Button("test","green",25);
                button.reStr("暂停");
                button.addEvent(function () {
                        scope.button_flag=!scope.button_flag;
                        if(scope.button_flag)button.reStr("暂停");
                        else button.reStr("继续");
                });

                [this.scene, this.camera]=this.myTest.initContext();

                this.camera.position.z = 20;
                this.camera.position.y = 8;

                new PlayerControl(this.camera);
        },
        //无按钮
        setContext3:function () {
                var nameContext="";
                console.log('set context:'+nameContext)
                var scope=this;
                this.myQEMSimplification=new QEMSimplification();
                this.referee=new Referee();
                this.tag=new Text("","green",25);


                [this.scene, this.camera]=this.myTest.initContext();

                this.camera.position.z = 20;
                this.camera.position.y = 8;

                //new PlayerControl(this.camera);
                controls=new OrbitControls(this.camera ,document.getElementById("myCanvas"));
                //这里开始调控摄像头
                controls.reset();
                //this.camera.position.copy(new THREE.Vector3(-30, 0.5, 25));
                var targetPosition = new THREE.Vector3(0,8,0);
                this.camera.lookAt(targetPosition);
                controls.target.copy(targetPosition);
        },
        //每个点与自己的初始位置相差为判断条件--似乎没啥效果
        test1_1:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="每个点与自己的初始位置相差为判断条件--似乎没啥效果";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        console.log(glb)
                        //console.log(glb.scene.children[0]);//scene.children[1].children[3]
                        //scene.children[1].children[2].children[0]
                        //scene.children[1].children[3]
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var geometryClone=geometry.clone();
                        var attributes=geometry.attributes;
                        console.log(mesh);
                        console.log(geometry.index);//index 48612
                        //console.log(attributes);
                        //console.log(mesh.geometry.index.array.length/3)
                        /*for(var k=0;k<1500;k++){//1830//1731//
                                //flag=false;
                                //while(!flag){//index 34077//14525//14046//4446
                                var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                flag=deleteMeshPoint(geometry,geometryClone,geometry.index.array[rand*3],geometry.index.array[rand*3+1]);
                                console.log(mesh);
                                console.log(geometry);
                                console.log(attributes);
                                //}

                        }*/

                        window.setInterval((function(){
                                var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                deleteMeshPoint(geometry,
                                    geometryClone,
                                    geometry.index.array[rand*3],
                                    geometry.index.array[rand*3+1]);
                                console.log(mesh);
                                console.log(geometry);
                                console.log(attributes);
                        }),10);/**/

                        mesh.scale.set(4,4,4);
                        //deleteMeshTriangle(mesh);


                        /*var index=mesh.geometry.index;
                         //for(var i=0;i<index.count;i++)
                                 //console.log(index.array[i]);
                         var index2=new THREE.InstancedBufferAttribute(new Uint16Array(804), 1);//头部、上衣、裤子、动作
                         for(var i=0;i<804;i++)
                                 index2.array[i]=index.array[i];
                         mesh.geometry.index=index2;*/

                        scope.scene.add(glb.scene.children[1]);
                        function deleteMeshPoint(geometry,geometryClone,p1,p2){//将mesh中的p1点删除，对应为p2点
                                var distance=
                                    Math.pow(geometry.attributes.position.array[3*p1]-geometryClone.attributes.position.array[3*p1],2)+
                                    Math.pow(geometry.attributes.position.array[3*p1+1]-geometryClone.attributes.position.array[3*p1+1],2)+
                                    Math.pow(geometry.attributes.position.array[3*p1+2]-geometryClone.attributes.position.array[3*p1+2],2);
                                console.log(distance);
                                if(distance>0.007)return false;



                                geometry.attributes.position.array[3*p2]
                                    =(geometry.attributes.position.array[3*p1]+geometry.attributes.position.array[3*p2])/2;
                                geometry.attributes.position.array[3*p2+1]
                                    =(geometry.attributes.position.array[3*p1+1]+geometry.attributes.position.array[3*p2+1])/2;
                                geometry.attributes.position.array[3*p2+2]
                                    =(geometry.attributes.position.array[3*p1+2]+geometry.attributes.position.array[3*p2+2])/2;


                                var index=geometry.index;
                                var indexClone=geometryClone.index;
                                for(var i=0;i<index.count;i++)
                                        if(index.array[i]===p1){
                                                index.array[i]=p2;
                                                indexClone.array[i]=p2;
                                        }

                                var needDeleteTriangle=0;
                                for(var i=0;i<index.count/3;i=i+3){
                                        if(index.array[i]===index.array[i+1]||
                                            index.array[i]===index.array[i+2]||
                                            index.array[i+1]===index.array[i+2])
                                                needDeleteTriangle++;
                                }
                                //console.log(needDeleteTriangle);//有两个三角形需要删除
                                //如果一个三角形点有重合，则删除这个三角形
                                var index2=new THREE.InstancedBufferAttribute(new Uint16Array(index.count-needDeleteTriangle*3), 1);//头部、上衣、裤子、动作
                                var index2Clone=new THREE.InstancedBufferAttribute(new Uint16Array(index.count-needDeleteTriangle*3), 1);//头部、上衣、裤子、动作
                                var j=0;
                                for(var i=0;i<index2.count;i=i+3)
                                        if(!(index.array[i]===index.array[i+1]||
                                            index.array[i+1]===index.array[i+2]||
                                            index.array[i+1]===index.array[i+2])){
                                                index2.array[j]=index.array[i];
                                                index2.array[j+1]=index.array[i+1];
                                                index2.array[j+2]=index.array[i+2];
                                                index2Clone.array[j]=indexClone.array[i];
                                                index2Clone.array[j+1]=indexClone.array[i+1];
                                                index2Clone.array[j+2]=indexClone.array[i+2];
                                                j=j+3;
                                        }
                                geometry.index=index2;

                                return true;
                        }
                        function deleteMeshTriangle(mesh){//将mesh中的p1点删除，对应为p2点
                                var index=mesh.geometry.index;
                                /*for(var i=0;i<index.count;i++)
                                        if(index.array[i]===p1)index.array[i]=p2;*/
                                var needDeleteTriangle=0;
                                /*for(var i=0;i<index.count/3;i=i+3){
                                        if(index.array[i]===index.array[i+1]||
                                            index.array[i]===index.array[i+2]||
                                            index.array[i+1]===index.array[i+2])
                                                needDeleteTriangle++;
                                }*/
                                //如果一个三角形3点有重合，则删除这个三角形
                                var index2=new THREE.InstancedBufferAttribute(new Uint16Array(index.count/2-needDeleteTriangle*3), 1);//头部、上衣、裤子、动作
                                var j=0;
                                for(var i=0;i<index2.count;i=i+6){
                                        index2.array[j]=index.array[i];
                                        index2.array[j+1]=index.array[i+1];
                                        index2.array[j+2]=index.array[i+2];
                                        j+=3;
                                }
                                mesh.geometry.index=index2;/**/
                        }
                        function updateIndex(mesh){
                                var index=mesh.geometry.index;
                                var needDeleteTriangle=0;
                                //如果一个三角形3点有重合，则删除这个三角形
                                var index2=new THREE.InstancedBufferAttribute(new Uint16Array(index.count), 1);//头部、上衣、裤子、动作
                                var j=0;
                                for(var i=0;i<index2.count;i=i+3){
                                        index2.array[j]=index.array[i];
                                        index2.array[j+1]=index.array[i+1];
                                        index2.array[j+2]=index.array[i+2];
                                        j+=3;
                                }
                                mesh.geometry.index=index2;/**/
                        }
                });//

                //完成测试
        },
        //每次选取距离最近的两个点进行collapse--似乎没啥效果
        test1_2:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="每次选取距离最近的两个点进行collapse";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                var myQEMSimplification=new QEMSimplification();
                loader.load("zhao.glb", (glb) => {
                        console.log(glb)
                        //console.log(glb.scene.children[0]);//scene.children[1].children[3]
                        //scene.children[1].children[2].children[0]
                        //scene.children[1].children[3]
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        console.log(mesh);
                        console.log(geometry);//index 48612
                        console.log(attributes);
                        //console.log(mesh.geometry.index.array.length/3)
                        /*for(var k=0;k<500;k++){//1830//1731//
                                //flag=false;
                                //while(!flag){//index 34077//14525//14046//4446
                                var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                var pos=myQEMSimplification.findSuitablePoint(mesh);
                                //flag=
                                    myQEMSimplification.deleteMeshPoint(mesh,pos[0],pos[1]);
                                console.log(mesh);
                                console.log(geometry);
                                console.log(attributes);
                                //}

                        }*/

                        window.setInterval((function(){
                                var pos=myQEMSimplification.findSuitablePoint(mesh);
                                myQEMSimplification.deleteMeshPoint(mesh,pos[0],pos[1]);
                                console.log(mesh);
                                console.log(geometry);
                                console.log(attributes);
                        }),10);/**/

                        mesh.scale.set(4,4,4);
                        //deleteMeshTriangle(mesh);


                        /*var index=mesh.geometry.index;
                         //for(var i=0;i<index.count;i++)
                                 //console.log(index.array[i]);
                         var index2=new THREE.InstancedBufferAttribute(new Uint16Array(804), 1);//头部、上衣、裤子、动作
                         for(var i=0;i<804;i++)
                                 index2.array[i]=index.array[i];
                         mesh.geometry.index=index2;*/

                        scope.scene.add(glb.scene.children[1]);
                });//

                //完成测试
        },
        //每次选取到相邻三角面距离和最小的点进行collapse
        test1_3:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="每次选取距离最近的两个点进行collapse";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                var myQEMSimplification=new QEMSimplification();
                loader.load("zhao.glb", (glb) => {
                        console.log(glb)
                        //console.log(glb.scene.children[0]);//scene.children[1].children[3]
                        //scene.children[1].children[2].children[0]
                        //scene.children[1].children[3]
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        console.log(mesh);
                        console.log(geometry);//index 48612
                        console.log(attributes);
                        //console.log(mesh.geometry.index.array.length/3)
                        /*for(var k=0;k<500;k++){//1830//1731//
                                //flag=false;
                                //while(!flag){//index 34077//14525//14046//4446
                                var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                var pos=myQEMSimplification.findSuitablePoint(mesh);
                                //flag=
                                    myQEMSimplification.deleteMeshPoint(mesh,pos[0],pos[1]);
                                console.log(mesh);
                                console.log(geometry);
                                console.log(attributes);
                                //}

                        }*/

                        window.setInterval((function(){
                                var pos=myQEMSimplification.findSuitablePoint2(mesh);
                                myQEMSimplification.deleteMeshPoint(mesh,pos[0],pos[1]);
                                //console.log(mesh);
                                console.log(geometry.index.count);
                                //console.log(attributes);
                        }),5);/**/

                        mesh.scale.set(4,4,4);
                        //deleteMeshTriangle(mesh);


                        /*var index=mesh.geometry.index;
                         //for(var i=0;i<index.count;i++)
                                 //console.log(index.array[i]);
                         var index2=new THREE.InstancedBufferAttribute(new Uint16Array(804), 1);//头部、上衣、裤子、动作
                         for(var i=0;i<804;i++)
                                 index2.array[i]=index.array[i];
                         mesh.geometry.index=index2;*/

                        scope.scene.add(glb.scene.children[1]);
                });//

                //完成测试
        },

        //进行模型坍塌:可以压缩为原来的86.3%
        test3:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext();
                var nameTest="非单元测试，测试能否删除网格上的点，以此来进行模型坍塌:可以压缩为原来的86.3%";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("Female02.glb", (glb) => {
                        //console.log(glb.scene.children[0]);
                        var mesh=glb.scene.children[0];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        console.log(geometry.index.count/3)
                        window.setInterval((function(){
                                if(geometry.index.count/3<300)return;
                                        var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                        flag=deleteMeshPoint(mesh,mesh.geometry.index.array[rand*3],mesh.geometry.index.array[rand*3+1]);
                                        //console.log(mesh);
                                        scope.tag.reStr(geometry.index.count/3);
                                        //console.log(attributes);

                        }),100);

                        mesh.scale.set(10,10,10);
                        //deleteMeshTriangle(mesh);


                       /*var index=mesh.geometry.index;
                        //for(var i=0;i<index.count;i++)
                                //console.log(index.array[i]);
                        var index2=new THREE.InstancedBufferAttribute(new Uint16Array(804), 1);//头部、上衣、裤子、动作
                        for(var i=0;i<804;i++)
                                index2.array[i]=index.array[i];
                        mesh.geometry.index=index2;*/

                        scope.scene.add(mesh);
                        function deleteMeshPoint(mesh,p1,p2){//将mesh中的p1点删除，对应为p2点
                                /*var distance=
                                    Math.pow(mesh.geometry.attributes.position.array[3*p1]-mesh.geometry.attributes.position.array[3*p2],2)+
                                    Math.pow(mesh.geometry.attributes.position.array[3*p1+1]-mesh.geometry.attributes.position.array[3*p2+1],2)+
                                    Math.pow(mesh.geometry.attributes.position.array[3*p1+2]-mesh.geometry.attributes.position.array[3*p2+2],2);
                                if(distance>0.005)return false;*/
                                //console.log(distance);


                                mesh.geometry.attributes.position.array[3*p2]
                                =(mesh.geometry.attributes.position.array[3*p1]+mesh.geometry.attributes.position.array[3*p2])/2;
                                mesh.geometry.attributes.position.array[3*p2+1]
                                    =(mesh.geometry.attributes.position.array[3*p1+1]+mesh.geometry.attributes.position.array[3*p2+1])/2;
                                mesh.geometry.attributes.position.array[3*p2+2]
                                    =(mesh.geometry.attributes.position.array[3*p1+2]+mesh.geometry.attributes.position.array[3*p2+2])/2;


                                var index=mesh.geometry.index;
                                for(var i=0;i<index.count;i++)
                                        if(index.array[i]===p1)index.array[i]=p2;

                                var needDeleteTriangle=0;
                                for(var i=0;i<index.count/3;i=i+3){
                                        if(index.array[i]===index.array[i+1]||
                                            index.array[i]===index.array[i+2]||
                                            index.array[i+1]===index.array[i+2])
                                                needDeleteTriangle++;
                                }
                                //console.log(needDeleteTriangle);//有两个三角形需要删除
                                //如果一个三角形点有重合，则删除这个三角形
                                var index2=new THREE.InstancedBufferAttribute(new Uint16Array(index.count-needDeleteTriangle*3), 1);//头部、上衣、裤子、动作
                                var j=0;
                                for(var i=0;i<index2.count;i=i+3)
                                        if(!(index.array[i]===index.array[i+1]||
                                            index.array[i+1]===index.array[i+2]||
                                            index.array[i+1]===index.array[i+2])){
                                                index2.array[j]=index.array[i];
                                                index2.array[j+1]=index.array[i+1];
                                                index2.array[j+2]=index.array[i+2];
                                                j=j+3;
                                }
                                mesh.geometry.index=index2;

                                return true;
                        }
                        function deleteMeshTriangle(mesh){//将mesh中的p1点删除，对应为p2点
                                var index=mesh.geometry.index;
                                /*for(var i=0;i<index.count;i++)
                                        if(index.array[i]===p1)index.array[i]=p2;*/
                                var needDeleteTriangle=0;
                                /*for(var i=0;i<index.count/3;i=i+3){
                                        if(index.array[i]===index.array[i+1]||
                                            index.array[i]===index.array[i+2]||
                                            index.array[i+1]===index.array[i+2])
                                                needDeleteTriangle++;
                                }*/
                                //如果一个三角形3点有重合，则删除这个三角形
                                var index2=new THREE.InstancedBufferAttribute(new Uint16Array(index.count/2-needDeleteTriangle*3), 1);//头部、上衣、裤子、动作
                                var j=0;
                                for(var i=0;i<index2.count;i=i+6){
                                        index2.array[j]=index.array[i];
                                        index2.array[j+1]=index.array[i+1];
                                        index2.array[j+2]=index.array[i+2];
                                        j+=3;
                                }
                                mesh.geometry.index=index2;/**/
                        }
                        function updateIndex(mesh){
                                var index=mesh.geometry.index;
                                var needDeleteTriangle=0;
                                //如果一个三角形3点有重合，则删除这个三角形
                                var index2=new THREE.InstancedBufferAttribute(new Uint16Array(index.count), 1);//头部、上衣、裤子、动作
                                var j=0;
                                for(var i=0;i<index2.count;i=i+3){
                                        index2.array[j]=index.array[i];
                                        index2.array[j+1]=index.array[i+1];
                                        index2.array[j+2]=index.array[i+2];
                                        j+=3;
                                }
                                mesh.geometry.index=index2;/**/
                        }
                });//

                //完成测试
        },
        //直接坍塌的效果//index 48612//坍塌到中间点
        //32169时丢失一个手
        test4:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="直接坍塌的效果";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        console.log(glb)
                        //console.log(glb.scene.children[0]);//scene.children[1].children[3]
                        //scene.children[1].children[2].children[0]
                        //scene.children[1].children[3]
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        console.log(mesh);
                        console.log(geometry);//index 48612
                        console.log(attributes);
                        scope.myQEMSimplification.simplifyIndex(mesh);
                        //console.log(mesh.geometry.index.array.length/3)
                        //for(var k=0;k<900;k++){//1830//1731//
                        /*while(geometry.index.count>20000){//40%
                                //flag=false;
                                //while(!flag){//index 34077//14525//14046//4446
                                        var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                        flag=deleteMeshPoint(mesh,mesh.geometry.index.array[rand*3],mesh.geometry.index.array[rand*3+1]);
                                        console.log(mesh);
                                        console.log(geometry);
                                        console.log(attributes);
                                //}

                        }*/

                        mesh.scale.set(4,4,4);
                        //mesh.position.set(-3500,0,0);
                        window.setInterval((function(){
                                //if(geometry.index.count/3<3000)return;
                                var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                deleteMeshPoint(mesh,mesh.geometry.index.array[rand*3],mesh.geometry.index.array[rand*3+1]);
                                console.log("三角面的个数为："+geometry.index.count/3);
                                //console.log(mesh);
                                //console.log(geometry);
                                //console.log(attributes);
                        }),10);/**/


                        //deleteMeshTriangle(mesh);


                        /*var index=mesh.geometry.index;
                         //for(var i=0;i<index.count;i++)
                                 //console.log(index.array[i]);
                         var index2=new THREE.InstancedBufferAttribute(new Uint16Array(804), 1);//头部、上衣、裤子、动作
                         for(var i=0;i<804;i++)
                                 index2.array[i]=index.array[i];
                         mesh.geometry.index=index2;*/

                        scope.scene.add(glb.scene.children[1]);
                        function deleteMeshPoint(mesh,p1,p2){//将mesh中的p1点删除，对应为p2点



                                mesh.geometry.attributes.position.array[3*p2]
                                    =(mesh.geometry.attributes.position.array[3*p1]+mesh.geometry.attributes.position.array[3*p2])/2;
                                mesh.geometry.attributes.position.array[3*p2+1]
                                    =(mesh.geometry.attributes.position.array[3*p1+1]+mesh.geometry.attributes.position.array[3*p2+1])/2;
                                mesh.geometry.attributes.position.array[3*p2+2]
                                    =(mesh.geometry.attributes.position.array[3*p1+2]+mesh.geometry.attributes.position.array[3*p2+2])/2;


                                var index=mesh.geometry.index;
                                for(var i=0;i<index.count;i++)
                                        if(index.array[i]===p1)index.array[i]=p2;

                                var needDeleteTriangle=0;
                                for(var i=0;i<index.count/3;i=i+3){
                                        if(index.array[i]===index.array[i+1]||
                                            index.array[i]===index.array[i+2]||
                                            index.array[i+1]===index.array[i+2])
                                                needDeleteTriangle++;
                                }
                                //console.log(needDeleteTriangle);//有两个三角形需要删除
                                //如果一个三角形点有重合，则删除这个三角形
                                var index2=new THREE.InstancedBufferAttribute(new Uint16Array(index.count-needDeleteTriangle*3), 1);//头部、上衣、裤子、动作
                                var j=0;
                                for(var i=0;i<index2.count;i=i+3)
                                        if(!(index.array[i]===index.array[i+1]||
                                            index.array[i+1]===index.array[i+2]||
                                            index.array[i+1]===index.array[i+2])){
                                                index2.array[j]=index.array[i];
                                                index2.array[j+1]=index.array[i+1];
                                                index2.array[j+2]=index.array[i+2];
                                                j=j+3;
                                        }
                                mesh.geometry.index=index2;

                                return true;
                        }
                        function deleteMeshTriangle(mesh){//将mesh中的p1点删除，对应为p2点
                                var index=mesh.geometry.index;
                                /*for(var i=0;i<index.count;i++)
                                        if(index.array[i]===p1)index.array[i]=p2;*/
                                var needDeleteTriangle=0;
                                /*for(var i=0;i<index.count/3;i=i+3){
                                        if(index.array[i]===index.array[i+1]||
                                            index.array[i]===index.array[i+2]||
                                            index.array[i+1]===index.array[i+2])
                                                needDeleteTriangle++;
                                }*/
                                //如果一个三角形3点有重合，则删除这个三角形
                                var index2=new THREE.InstancedBufferAttribute(new Uint16Array(index.count/2-needDeleteTriangle*3), 1);//头部、上衣、裤子、动作
                                var j=0;
                                for(var i=0;i<index2.count;i=i+6){
                                        index2.array[j]=index.array[i];
                                        index2.array[j+1]=index.array[i+1];
                                        index2.array[j+2]=index.array[i+2];
                                        j+=3;
                                }
                                mesh.geometry.index=index2;/**/
                        }
                        function updateIndex(mesh){
                                var index=mesh.geometry.index;
                                var needDeleteTriangle=0;
                                //如果一个三角形3点有重合，则删除这个三角形
                                var index2=new THREE.InstancedBufferAttribute(new Uint16Array(index.count), 1);//头部、上衣、裤子、动作
                                var j=0;
                                for(var i=0;i<index2.count;i=i+3){
                                        index2.array[j]=index.array[i];
                                        index2.array[j+1]=index.array[i+1];
                                        index2.array[j+2]=index.array[i+2];
                                        j+=3;
                                }
                                mesh.geometry.index=index2;/**/
                        }
                });//

                //完成测试
        },
        //赵院士模型collapse,过程不可见//随机删除
        test4_1:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="直接坍塌的效果";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        console.log(glb)
                        //console.log(glb.scene.children[0]);//scene.children[1].children[3]
                        //scene.children[1].children[2].children[0]
                        //scene.children[1].children[3]
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        console.log(mesh);
                        console.log(geometry);//index 48612
                        console.log(attributes);
                        //console.log(mesh.geometry.index.array.length/3)
                        console.log("初始三角面的个数为："+geometry.index.count/3);//16204

                        mesh.scale.set(4,4,4);
                        scope.scene.add(glb.scene.children[1]);

                        //for(var k=0;k<5000;k++){//1830//1731//
                        while(geometry.index.count/3>10000){
                                var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                this.myQEMSimplification.deleteMeshPoint(mesh,mesh.geometry.index.array[rand*3],mesh.geometry.index.array[rand*3+1]);
                                //deleteMeshPoint(mesh,mesh.geometry.index.array[rand*3],mesh.geometry.index.array[rand*3+1]);
                                scope.tag.reStr("三角面的个数为："+geometry.index.count/3);
                        }//15598//13306
                });//

                //完成测试
        },
        //赵院士模型collapse,过程不可见//QEM删除
        test4_1_0:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="直接坍塌的效果";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        console.log(glb)
                        //console.log(glb.scene.children[0]);//scene.children[1].children[3]
                        //scene.children[1].children[2].children[0]
                        //scene.children[1].children[3]
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        console.log(mesh);
                        console.log(geometry);//index 48612
                        console.log(attributes);
                        //console.log(mesh.geometry.index.array.length/3)
                        console.log("初始三角面的个数为："+geometry.index.count/3);//16204

                        mesh.scale.set(4,4,4);
                        scope.scene.add(glb.scene.children[1]);

                        for(var k=0;k<1;k++){//1830//1731//
                        //while(geometry.index.count/3>10000){
                                var arrays=scope.myQEMSimplification.findSuitablePoint2(mesh);
                                console.log(arrays);
                                scope.myQEMSimplification.deleteMeshPoint(mesh,arrays[0],arrays[1]);
                                //deleteMeshPoint(mesh,mesh.geometry.index.array[rand*3],mesh.geometry.index.array[rand*3+1]);
                                scope.tag.reStr("三角面的个数为："+geometry.index.count/3);
                                console.log("三角面的个数为："+geometry.index.count/3);
                        }//15598//13306
                });//

                //完成测试
        },
        //赵院士模型collapse,过程不可见//QEM删除,更快捷的算法
        test4_1_00:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="直接坍塌的效果";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        console.log(glb)
                        //console.log(glb.scene.children[0]);//scene.children[1].children[3]
                        //scene.children[1].children[2].children[0]
                        //scene.children[1].children[3]
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        console.log(mesh);
                        console.log(geometry);//index 48612
                        console.log(attributes);
                        //console.log(mesh.geometry.index.array.length/3)
                        console.log("初始三角面的个数为："+geometry.index.count/3);//16204

                        mesh.scale.set(4,4,4);
                        scope.scene.add(glb.scene.children[1]);

                        //for(var k=0;k<100;k++){//1830//1731//
                        while(geometry.index.count/3>5000){
                                var arrays=scope.myQEMSimplification.findSuitablePoint3(mesh);
                                console.log(arrays);
                                scope.myQEMSimplification.deleteMeshPoint(mesh,arrays[0],arrays[1]);
                                //deleteMeshPoint(mesh,mesh.geometry.index.array[rand*3],mesh.geometry.index.array[rand*3+1]);
                                scope.tag.reStr("三角面的个数为："+geometry.index.count/3);
                                console.log("三角面的个数为："+geometry.index.count/3);
                        }//15598//13306
                });//

                //完成测试
        },
        //赵院士模型collapse,尝试使得过程可见--未成功
        test4_1_1:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext3();
                var nameTest="直接坍塌的效果";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                scope.tag.reStr("正在处理，请稍等...");
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        console.log("初始三角面的个数为："+geometry.index.count/3);//16204

                        mesh.scale.set(4,4,4);
                        scope.scene.add(glb.scene.children[1]);

                        var target=prompt("目标三角面个数(0-15000)):",14000);
                        //var myFlag=prompt("是否只简化背面(yes/no):","yes");

                        //for(var k=0;k<15000;k++){//1830//1731//
                        while(geometry.index.count/3>target){
                                var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                if(urlType==="0")this.myQEMSimplification.deleteMeshPoint_(mesh,mesh.geometry.index.array[rand*3],mesh.geometry.index.array[rand*3+1]);
                                else this.myQEMSimplification.deleteMeshPoint(mesh,mesh.geometry.index.array[rand*3],mesh.geometry.index.array[rand*3+1]);
                                //deleteMeshPoint(mesh,mesh.geometry.index.array[rand*3],mesh.geometry.index.array[rand*3+1]);
                        }//15598//13306
                        scope.tag.reStr("三角面的个数为："+geometry.index.count/3);
                });//

                //完成测试
        },
        //赵院士模型collapse,过程不可见,指定坍塌区域
        test4_1_2:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="直接坍塌的效果";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        console.log(glb)
                        //console.log(glb.scene.children[0]);//scene.children[1].children[3]
                        //scene.children[1].children[2].children[0]
                        //scene.children[1].children[3]
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        console.log(mesh);
                        console.log(geometry);//index 48612
                        console.log(attributes);
                        //console.log(mesh.geometry.index.array.length/3)
                        console.log("初始三角面的个数为："+geometry.index.count/3);//16204

                        mesh.scale.set(4,4,4);
                        scope.scene.add(glb.scene.children[1]);

                        //for(var k=0;k<5000;k++){//1830//1731//
                        while(geometry.index.count/3>10000){
                                var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                this.myQEMSimplification.deleteMeshPoint(mesh,mesh.geometry.index.array[rand*3],mesh.geometry.index.array[rand*3+1]);
                                //deleteMeshPoint(mesh,mesh.geometry.index.array[rand*3],mesh.geometry.index.array[rand*3+1]);
                                scope.tag.reStr("三角面的个数为："+geometry.index.count/3);
                        }//15598//13306
                });//

                //完成测试
        },
        //过程可见，间隔0  //使用了简化索引simplifyIndex
        test4_2:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="直接坍塌的效果";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        scope.myQEMSimplification.simplifyIndex(mesh);
                        console.log(glb.scene.children[1]);//children[2].children[0]
                        for(var i=0;i<2;i++)//移除其它mesh//主要是移除牙齿网格
                                glb.scene.children[1].children[2].children[0].parent.remove(glb.scene.children[1].children[2].children[0]);
                        console.log(mesh);
                        console.log(geometry);//index 48612
                        console.log(attributes);
                        console.log("初始三角面的个数:"+geometry.index.count/3);

                        mesh.scale.set(4,4,4);
                        window.setInterval((function(){
                                //if(geometry.index.count/3<8000)return;
                                var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                scope.myQEMSimplification.deleteMeshPoint(mesh,mesh.geometry.index.array[rand*3],mesh.geometry.index.array[rand*3+1]);
                                scope.tag.reStr("三角面的个数:"+geometry.index.count/3);
                        }),0);

                        scope.scene.add(glb.scene.children[1]);
                });//

                //完成测试
        },
        //计算重复结点的个数//似乎有大量重复结点
        test4_3:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="直接坍塌的效果";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        var position=attributes.position;
                        var index=geometry.index;
                        console.log(mesh);
                        console.log(geometry);
                        console.log(attributes);
                        console.log(position);
                        flag=0;
                        for(i=0;i<position.count;i++)
                                for(j=i+1;j<position.count;j++){
                                        if(
                                            position.array[3*i]===position.array[3*j]&&
                                            position.array[3*i+1]===position.array[3*j+1]&&
                                            position.array[3*i+2]===position.array[3*j+2]
                                        ){
                                                flag++;
                                                scope.tag.reStr(flag);
                                        }
                                }
                        console.log(flag+"/"+position.count);//8314/
                });//

                //完成测试
        },
        //过程可见，间隔0  //希望解决索引问题--失败
        test4_4:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="直接坍塌的效果";
                console.log('start test:'+nameTest);
                //开始测试
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        //scope.myQEMSimplification.simplifyIndex(mesh);
                        console.log(glb.scene.children[1]);//children[2].children[0]
                        for(var i=0;i<2;i++)//移除其它mesh//主要是移除牙齿网格
                                glb.scene.children[1].children[2].children[0].parent.remove(glb.scene.children[1].children[2].children[0]);
                        console.log(mesh);
                        console.log(geometry);//index 48612
                        console.log(attributes);
                        console.log("初始三角面的个数:"+geometry.index.count/3);

                        mesh.scale.set(4,4,4);
                        window.setInterval((function(){
                                if(geometry.index.count/3<10000)return;
                                var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                scope.myQEMSimplification.deleteMeshPoint(mesh,mesh.geometry.index.array[rand*3],mesh.geometry.index.array[rand*3+1]);
                                scope.tag.reStr("三角面的个数:"+geometry.index.count/3);
                        }),0);

                        scope.scene.add(glb.scene.children[1]);
                });//

                //完成测试
        },

        //制作了一个无重点的三角网格平面
        test5:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="直接坍塌的效果";
                console.log('start test:'+nameTest);
                //开始测试
                this.camera.position.set(-0.9704513248250748,2.0665495844811432,28.947142621027023);
                this.camera.rotation.set( -0.12261591349495268,-0.029774896077528493,-0.003668724751822147);
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        var position=attributes.position;
                        var index=geometry.index;
                        //scope.myQEMSimplification.simplifyIndex(mesh);
                        for(var i=0;i<2;i++)//移除其它mesh//主要是移除牙齿网格
                                glb.scene.children[1].children[2].children[0].parent.remove(glb.scene.children[1].children[2].children[0]);
                        //console.log("position",position);
                        //console.log("index",index);
                        //console.log("初始三角面的个数:"+geometry.index.count/3);

                        mesh.scale.set(4,4,4);

                        //设置position
                        var k=0;//生成100个点
                        for(var i=-5.0;i<5.0;i+=1)
                                for(var j=-5.0;j<5.0;j+=1){
                                        position.array[3*k]=2*i;
                                        position.array[3*k+1]=2*j;
                                        position.array[3*k+2]=0.0;
                                        k++;
                                }
                        //alert(k)
                        //设置index

                        var index2;
                        my9_9_2();
                        console.log("position",position);
                        console.log("index2",index2);
                        console.log("初始三角面的个数:"+geometry.index.count/3);
                        function my1_9(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(9*9), 1);
                                k=0;
                                for(i=0;i<1;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k+1]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                geometry.index=index2;
                        }
                        function my9_9(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(81*3), 1);
                                k=0;
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                console.log([
                                                    k,
                                                        index2.array[3*k  ],
                                                        index2.array[3*k+1],
                                                        index2.array[3*k+2]
                                                ]);
                                                k++;
                                        }
                                geometry.index=index2;
                         }
                        function my9_9_2(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(2*9*9*3), 1);
                                k=0;
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                console.log([
                                                        k,
                                                        index2.array[3*k  ],
                                                        index2.array[3*k+1],
                                                        index2.array[3*k+2]
                                                ]);
                                                k++;
                                        }
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*(i+1)+j;
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                console.log([
                                                        k,
                                                        index2.array[3*k  ],
                                                        index2.array[3*k+1],
                                                        index2.array[3*k+2]
                                                ]);
                                                k++;
                                        }
                                geometry.index=index2;
                        }
                        /*window.setInterval((function(){
                                if(geometry.index.count/3<10000)return;
                                var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                scope.myQEMSimplification.deleteMeshPoint(mesh,mesh.geometry.index.array[rand*3],mesh.geometry.index.array[rand*3+1]);
                                scope.tag.reStr("三角面的个数:"+geometry.index.count/3);
                        }),0);*/

                        scope.scene.add(glb.scene.children[1]);
                });//

                //完成测试
        },
        //对自制的三角网格平面使用了网格简化算法//无重点、过程可视、有贴图
        test6:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="直接坍塌的效果";
                console.log('start test:'+nameTest);
                //开始测试
                this.camera.position.set(-0.9704513248250748,2.0665495844811432,28.947142621027023);
                this.camera.rotation.set( -0.12261591349495268,-0.029774896077528493,-0.003668724751822147);
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        var position=attributes.position;
                        var index=geometry.index;
                        //scope.myQEMSimplification.simplifyIndex(mesh);
                        for(var i=0;i<2;i++)//移除其它mesh//主要是移除牙齿网格
                                glb.scene.children[1].children[2].children[0].parent.remove(glb.scene.children[1].children[2].children[0]);
                        //console.log("position",position);
                        //console.log("index",index);
                        //console.log("初始三角面的个数:"+geometry.index.count/3);

                        mesh.scale.set(4,4,4);

                        //设置position
                        var k=0;//生成100个点
                        for(var i=-5.0;i<5.0;i+=1)
                                for(var j=-5.0;j<5.0;j+=1){
                                        position.array[3*k]=2*i;
                                        position.array[3*k+1]=2*j;
                                        position.array[3*k+2]=0.0;
                                        k++;
                                }
                        //alert(k)
                        //设置index

                        var index2;
                        my9_9_2();
                        console.log("position",position);
                        console.log("index2",index2);
                        console.log("初始三角面的个数:"+geometry.index.count/3);
                        function my1_9(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(9*9), 1);
                                k=0;
                                for(i=0;i<1;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k+1]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                geometry.index=index2;
                        }
                        function my9_9(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(81*3), 1);
                                k=0;
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                console.log([
                                                        k,
                                                        index2.array[3*k  ],
                                                        index2.array[3*k+1],
                                                        index2.array[3*k+2]
                                                ]);
                                                k++;
                                        }
                                geometry.index=index2;
                        }
                        function my9_9_2(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(2*9*9*3), 1);
                                k=0;
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*(i+1)+j;
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                geometry.index=index2;
                        }


                        scope.scene.add(glb.scene.children[1]);

                        //flag=false;window.setInterval((function(){}),100);
                        window.setInterval((function(){
                                if(!scope.button_flag)return;
                                //if(!scope.myQEMSimplification.isSkirt(mesh,0,1,2))return;
                                //if(mesh.geometry.index.array[0]=)
                                //if(geometry.index.count/3<10000)return;
                                console.log(mesh.geometry.index);
                                var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                scope.myQEMSimplification.deleteMeshPoint(mesh,
                                    mesh.geometry.index.array[rand*3],
                                    mesh.geometry.index.array[rand*3+1],
                                    mesh.geometry.index.array[rand*3+2]);
                                scope.tag.reStr("三角面的个数:"+geometry.index.count/3);

                        }),100);/**/
                });//

                //完成测试
        },
        //测试isCommonEdge函数
        test6_1:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="直接坍塌的效果";
                console.log('start test:'+nameTest);
                //开始测试
                this.camera.position.set(-0.9704513248250748,2.0665495844811432,28.947142621027023);
                this.camera.rotation.set( -0.12261591349495268,-0.029774896077528493,-0.003668724751822147);
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        var position=attributes.position;
                        var index=geometry.index;
                        //scope.myQEMSimplification.simplifyIndex(mesh);
                        for(var i=0;i<2;i++)//移除其它mesh//主要是移除牙齿网格
                                glb.scene.children[1].children[2].children[0].parent.remove(glb.scene.children[1].children[2].children[0]);
                        //console.log("position",position);
                        //console.log("index",index);
                        //console.log("初始三角面的个数:"+geometry.index.count/3);

                        mesh.scale.set(4,4,4);

                        //设置position
                        var k=0;//生成100个点
                        for(var i=-5.0;i<5.0;i+=1)
                                for(var j=-5.0;j<5.0;j+=1){
                                        position.array[3*k]=2*i;
                                        position.array[3*k+1]=2*j;
                                        position.array[3*k+2]=0.0;
                                        k++;
                                }
                        //alert(k)
                        //设置index

                        var index2;
                        my9_9_2();
                        console.log("position",position);
                        console.log("index2",index2);
                        console.log("初始三角面的个数:"+geometry.index.count/3);
                        function my9_9_2(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(2*9*9*3), 1);
                                k=0;
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*(i+1)+j;
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                geometry.index=index2;
                        }


                        scope.scene.add(glb.scene.children[1]);

                        var referee=new Referee();//正确
                        referee.assertion(
                            scope.myQEMSimplification.isCommonEdge(mesh,10,11),false
                        );
                        referee.assertion(
                            scope.myQEMSimplification.isCommonEdge(mesh,10,20),true
                        );

                });//

                //完成测试
        },
        //测试isSkirt函数
        test6_2:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="直接坍塌的效果";
                console.log('start test:'+nameTest);
                //开始测试
                this.camera.position.set(-0.9704513248250748,2.0665495844811432,28.947142621027023);
                this.camera.rotation.set( -0.12261591349495268,-0.029774896077528493,-0.003668724751822147);
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        var position=attributes.position;
                        var index=geometry.index;
                        //scope.myQEMSimplification.simplifyIndex(mesh);
                        for(var i=0;i<2;i++)//移除其它mesh//主要是移除牙齿网格
                                glb.scene.children[1].children[2].children[0].parent.remove(glb.scene.children[1].children[2].children[0]);
                        //console.log("position",position);
                        //console.log("index",index);
                        //console.log("初始三角面的个数:"+geometry.index.count/3);

                        mesh.scale.set(4,4,4);

                        //设置position
                        var k=0;//生成100个点
                        for(var i=-5.0;i<5.0;i+=1)
                                for(var j=-5.0;j<5.0;j+=1){
                                        position.array[3*k]=2*i;
                                        position.array[3*k+1]=2*j;
                                        position.array[3*k+2]=0.0;
                                        k++;
                                }
                        //alert(k)
                        //设置index

                        var index2;
                        my9_9_2();
                        console.log("position",position);
                        console.log("index2",index2);
                        console.log("初始三角面的个数:"+geometry.index.count/3);
                        function my9_9_2(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(2*9*9*3), 1);
                                k=0;
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*(i+1)+j;
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                geometry.index=index2;
                        }


                        scope.scene.add(glb.scene.children[1]);

                        var referee=new Referee();//正确
                        //在边界的三角形
                        referee.assertion(
                            scope.myQEMSimplification.isSkirt(mesh,0,10,11),true
                        );
                        referee.assertion(
                            scope.myQEMSimplification.isSkirt(mesh,10,0,11),true
                        );
                        referee.assertion(
                            scope.myQEMSimplification.isSkirt(mesh,10,11,0),true
                        );

                        //在内部的三角形
                        referee.assertion(
                            scope.myQEMSimplification.isSkirt(mesh,1,11,12),false
                        );
                        referee.assertion(
                            scope.myQEMSimplification.isSkirt(mesh,22,11,12),false
                        );

                });
        },
        //测试deleteMeshPoint函数,使用了线框图材质
        test6_3:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="直接坍塌的效果";
                console.log('start test:'+nameTest);
                //开始测试
                this.camera.position.set(-10.737996622084946,8.164451805696736,-0.3249246182617435);
                this.camera.rotation.set(-1.799047718201149,-1.552220604283645,-1.7990857496759487);
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        mesh.material = new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, transparent: true } );
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        var position=attributes.position;
                        var index=geometry.index;
                        //scope.myQEMSimplification.simplifyIndex(mesh);
                        for(var i=0;i<2;i++)//移除其它mesh//主要是移除牙齿网格
                                glb.scene.children[1].children[2].children[0].parent.remove(glb.scene.children[1].children[2].children[0]);
                        mesh.scale.set(20,20,20);

                        //设置position
                        var k=0;//生成100个点
                        for(var i=-5.0;i<5.0;i+=1)
                                for(var j=-5.0;j<5.0;j+=1){
                                        position.array[3*k]=2*i;
                                        position.array[3*k+1]=2*j;
                                        position.array[3*k+2]=0.0;
                                        k++;
                                }
                        //alert(k)
                        //设置index

                        var index2;
                        my9_9_2();
                        console.log("position",position);
                        console.log("index2",index2);
                        console.log("初始三角面的个数:"+geometry.index.count/3);
                        function my9_9_2(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(2*9*9*3), 1);
                                k=0;
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*(i+1)+j;
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                geometry.index=index2;
                        }


                        scope.scene.add(glb.scene.children[1]);

                        //flag=false;
                        //window.setInterval((function(){
                                //if(flag)return;
                                //if(!scope.myQEMSimplification.isSkirt(mesh,0,1,2))return;
                                //if(mesh.geometry.index.array[0]=)
                                //if(geometry.index.count/3<10000)return;
                        console.log(mesh.geometry.index);
                        scope.myQEMSimplification.deleteMeshPoint(mesh,
                            mesh.geometry.index.array[0],
                            mesh.geometry.index.array[1],
                            mesh.geometry.index.array[2]);
                        /*scope.myQEMSimplification.deleteMeshPoint(mesh,
                            mesh.geometry.index.array[11],
                            mesh.geometry.index.array[12],
                            mesh.geometry.index.array[22]);*/
                        scope.tag.reStr("三角面的个数:" + geometry.index.count / 3);

                        //}),100);/**/
                });//

                //完成测试
        },
        //对自制的三角网格平面使用了网格简化算法--线框图失败了
        test6_4:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="直接坍塌的效果";
                console.log('start test:'+nameTest);
                //开始测试
                this.camera.position.set(-10.737996622084946,8.164451805696736,-0.3249246182617435);
                this.camera.rotation.set(-1.799047718201149,-1.552220604283645,-1.7990857496759487);
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        //var material0=mesh.material;
                        //mesh.material=new THREE.MeshBasicMaterial();
                        //mesh.material = new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, transparent: true } );
                        //mesh.material = new THREE.MeshStandardMaterial( { color: 0x00ffff, wireframe: true } );
                        console.log(mesh.material);

                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        var position=attributes.position;
                        var index=geometry.index;
                        //scope.myQEMSimplification.simplifyIndex(mesh);
                        for(var i=0;i<2;i++)//移除其它mesh//主要是移除牙齿网格
                                glb.scene.children[1].children[2].children[0].parent.remove(glb.scene.children[1].children[2].children[0]);
                        //console.log("position",position);
                        //console.log("index",index);
                        //console.log("初始三角面的个数:"+geometry.index.count/3);

                        mesh.scale.set(20,20,20);

                        //设置position
                        var k=0;//生成100个点
                        for(var i=-5.0;i<5.0;i+=1)
                                for(var j=-5.0;j<5.0;j+=1){
                                        position.array[3*k]=2*i;
                                        position.array[3*k+1]=2*j;
                                        position.array[3*k+2]=0.0;
                                        k++;
                                }
                        //alert(k)
                        //设置index

                        var index2;
                        my9_9_2();
                        console.log("position",position);
                        console.log("index2",index2);
                        console.log("初始三角面的个数:"+geometry.index.count/3);
                        function my9_9_2(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(2*9*9*3), 1);
                                k=0;
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k+2]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k  ]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*(i+1)+j;
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                geometry.index=index2;
                        }


                        scope.scene.add(glb.scene.children[1]);

                        //flag=false;
                        var mesh2=mesh.clone();
                        //scope.scene.add(mesh2);
                        window.setInterval((function(){
                                //if(flag)return;
                                //if(!scope.myQEMSimplification.isSkirt(mesh,0,1,2))return;
                                //if(mesh.geometry.index.array[0]=)
                                //if(geometry.index.count/3<10000)return;
                                //console.log(mesh.geometry.index);
                                var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                scope.myQEMSimplification.deleteMeshPoint(mesh,
                                    mesh.geometry.index.array[rand*3],
                                    mesh.geometry.index.array[rand*3+1],
                                    mesh.geometry.index.array[rand*3+2]);
                                scope.tag.reStr("三角面的个数:"+geometry.index.count/3);
                                //mesh.material.visible=false;
                                //mesh.material.visible=true;

                                scope.scene.remove(mesh2);
                                mesh2=mesh.clone();
                                //mesh.material = new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, transparent: true } );
                                scope.scene.add(mesh2);
                                //mesh.material=material0;
                                mesh.material=new THREE.MeshBasicMaterial({ color: 0x00ffff});
                                //mesh.material = new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, transparent: true } );

                        }),100);/**/
                });//

                //完成测试
        },
        //线框图、断言
        test6_5:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="  test6_5  ";
                console.log('start test:'+nameTest);
                //开始测试
                this.camera.position.set(-10.737996622084946,8.164451805696736,-0.3249246182617435);
                this.camera.rotation.set(-1.799047718201149,-1.552220604283645,-1.7990857496759487);
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        //var material0=mesh.material;
                        //mesh.material=new THREE.MeshBasicMaterial();
                        //mesh.material = new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, transparent: true } );
                        //mesh.material = new THREE.MeshStandardMaterial( { color: 0x00ffff, wireframe: true } );
                        console.log(mesh.material);

                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        var position=attributes.position;
                        var index=geometry.index;
                        //scope.myQEMSimplification.simplifyIndex(mesh);
                        for(var i=0;i<2;i++)//移除其它mesh//主要是移除牙齿网格
                                glb.scene.children[1].children[2].children[0].parent.remove(glb.scene.children[1].children[2].children[0]);
                        //console.log("position",position);
                        //console.log("index",index);
                        //console.log("初始三角面的个数:"+geometry.index.count/3);

                        mesh.scale.set(20,20,20);

                        //设置position
                        var k=0;//生成100个点
                        for(var i=-5.0;i<5.0;i+=1)
                                for(var j=-5.0;j<5.0;j+=1){
                                        position.array[3*k]=2*i;
                                        position.array[3*k+1]=2*j;
                                        position.array[3*k+2]=0.0;
                                        k++;
                                }
                        //alert(k)
                        //设置index

                        var index2;
                        my9_9_2();
                        console.log("position",position);
                        console.log("index2",index2);
                        console.log("初始三角面的个数:"+geometry.index.count/3);
                        function my9_9_2(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(2*9*9*3), 1);
                                k=0;
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k+2]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k  ]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*(i+1)+j;
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                geometry.index=index2;
                        }


                        scope.scene.add(glb.scene.children[1]);

                        //flag=false;
                        //var mesh2=mesh.clone();

                        scope.myQEMSimplification.deleteMeshPoint(mesh,
                            55,
                            56,
                            66);
                        scope.myQEMSimplification.deleteMeshPoint(mesh,
                            0,
                            1,
                            11);/**/
                        scope.tag.reStr("三角面的个数:" + geometry.index.count / 3);


                        mesh.material = new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true});
                        //mesh.material = new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, transparent: true } );


                        //0、1两个点位置相同
                        i=[0 ];
                        j=[1 ];
                        for(var k=0;k<i.length;k++)
                                scope.referee.assertion(
                                    [position.array[3*i[k]],position.array[3*i[k]+1],position.array[3*i[k]+2]],
                                    [position.array[3*j[k]],position.array[3*j[k]+1],position.array[3*j[k]+2]],
                                    nameTest+i[k]+"和"+j[k]+"两个点的坐标应该一致"
                                );

                });//

                //完成测试
        },
        test6_5_1:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="  test6_5  ";
                console.log('start test:'+nameTest);
                //开始测试
                this.camera.position.set(-10.737996622084946,8.164451805696736,-0.3249246182617435);
                this.camera.rotation.set(-1.799047718201149,-1.552220604283645,-1.7990857496759487);
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        //var material0=mesh.material;
                        //mesh.material=new THREE.MeshBasicMaterial();
                        //mesh.material = new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, transparent: true } );
                        //mesh.material = new THREE.MeshStandardMaterial( { color: 0x00ffff, wireframe: true } );
                        console.log(mesh.material);

                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        var position=attributes.position;
                        var index=geometry.index;
                        //scope.myQEMSimplification.simplifyIndex(mesh);
                        for(var i=0;i<2;i++)//移除其它mesh//主要是移除牙齿网格
                                glb.scene.children[1].children[2].children[0].parent.remove(glb.scene.children[1].children[2].children[0]);
                        //console.log("position",position);
                        //console.log("index",index);
                        //console.log("初始三角面的个数:"+geometry.index.count/3);

                        mesh.scale.set(20,20,20);

                        //设置position
                        var k=0;//生成100个点
                        for(var i=-5.0;i<5.0;i+=1)
                                for(var j=-5.0;j<5.0;j+=1){
                                        position.array[3*k]=2*i;
                                        position.array[3*k+1]=2*j;
                                        position.array[3*k+2]=0.0;
                                        k++;
                                }
                        //alert(k)
                        //设置index

                        var index2;
                        my9_9_2();
                        console.log("position",position);
                        console.log("index2",index2);
                        console.log("初始三角面的个数:"+geometry.index.count/3);
                        function my9_9_2(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(2*9*9*3), 1);
                                k=0;
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k+2]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k  ]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*(i+1)+j;
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                geometry.index=index2;
                        }


                        scope.scene.add(glb.scene.children[1]);

                        //flag=false;
                        //var mesh2=mesh.clone();

                        scope.myQEMSimplification.deleteMeshPoint(mesh,
                            0,
                            1,
                            11);
                        /*scope.myQEMSimplification.deleteMeshPoint(mesh,
                            0,
                            1,
                            11);*/
                        scope.tag.reStr("三角面的个数:" + geometry.index.count / 3);


                        mesh.material = new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true});
                        //mesh.material = new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, transparent: true } );




                });//

                //完成测试
        },
        test6_5_2:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="  test6_5  ";
                console.log('start test:'+nameTest);
                //开始测试
                this.camera.position.set(-10.737996622084946,8.164451805696736,-0.3249246182617435);
                this.camera.rotation.set(-1.799047718201149,-1.552220604283645,-1.7990857496759487);
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        //var material0=mesh.material;
                        //mesh.material=new THREE.MeshBasicMaterial();
                        //mesh.material = new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, transparent: true } );
                        //mesh.material = new THREE.MeshStandardMaterial( { color: 0x00ffff, wireframe: true } );
                        console.log(mesh.material);

                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        var position=attributes.position;
                        var index=geometry.index;
                        //scope.myQEMSimplification.simplifyIndex(mesh);
                        for(var i=0;i<2;i++)//移除其它mesh//主要是移除牙齿网格
                                glb.scene.children[1].children[2].children[0].parent.remove(glb.scene.children[1].children[2].children[0]);
                        //console.log("position",position);
                        //console.log("index",index);
                        //console.log("初始三角面的个数:"+geometry.index.count/3);

                        mesh.scale.set(20,20,20);

                        //设置position
                        var k=0;//生成100个点
                        for(var i=-5.0;i<5.0;i+=1)
                                for(var j=-5.0;j<5.0;j+=1){
                                        position.array[3*k]=2*i;
                                        position.array[3*k+1]=2*j;
                                        position.array[3*k+2]=0.0;
                                        k++;
                                }
                        //alert(k)
                        //设置index

                        var index2;
                        my9_9_2();
                        console.log("position",position);
                        console.log("index2",index2);
                        console.log("初始三角面的个数:"+geometry.index.count/3);
                        function my9_9_2(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(2*9*9*3), 1);
                                k=0;
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k+2]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k  ]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*(i+1)+j;
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                geometry.index=index2;
                        }


                        scope.scene.add(glb.scene.children[1]);

                        //flag=false;
                        //var mesh2=mesh.clone();

                        scope.myQEMSimplification.deleteMeshPoint(mesh,
                            55,
                            56,
                            66);
                        /*scope.myQEMSimplification.deleteMeshPoint(mesh,
                            0,
                            1,
                            11);*/
                        scope.tag.reStr("三角面的个数:" + geometry.index.count / 3);


                        mesh.material = new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true});
                        //mesh.material = new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, transparent: true } );




                });//

                //完成测试
        },

        //制作了一个有重点的三角网格平面
        test7:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="直接坍塌的效果";
                console.log('start test:'+nameTest);
                //开始测试
                this.camera.position.set(-0.9704513248250748,2.0665495844811432,28.947142621027023);
                this.camera.rotation.set( -0.12261591349495268,-0.029774896077528493,-0.003668724751822147);
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        var position=attributes.position;
                        var index=geometry.index;
                        //scope.myQEMSimplification.simplifyIndex(mesh);
                        for(var i=0;i<2;i++)//移除其它mesh//主要是移除牙齿网格
                                glb.scene.children[1].children[2].children[0].parent.remove(glb.scene.children[1].children[2].children[0]);
                        //console.log("position",position);
                        //console.log("index",index);
                        //console.log("初始三角面的个数:"+geometry.index.count/3);

                        mesh.scale.set(4,4,4);

                        //设置position
                        var k=0;
                        for(var n=0;n<2;n++)
                        //生成两遍//每一遍生成100个点//共生成200个点
                        for(var i=-5.0;i<5.0;i+=1)
                                for(var j=-5.0;j<5.0;j+=1){
                                        position.array[3*k]=2*i;
                                        position.array[3*k+1]=2*j;
                                        position.array[3*k+2]=0.0;
                                        k++;
                                }
                        //alert(k)

                        //设置index
                        var index2;
                        my9_9_2();
                        console.log("position",position);
                        console.log("index2",index2);
                        console.log("初始三角面的个数:"+geometry.index.count/3);
                        function my9_9_2(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(2*9*9*3), 1);
                                k=0;
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                console.log([
                                                        k,
                                                        index2.array[3*k  ],
                                                        index2.array[3*k+1],
                                                        index2.array[3*k+2]
                                                ]);
                                                k++;
                                        }
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=100+10*i+j;
                                                index2.array[3*k+1]=100+10*(i+1)+j;
                                                index2.array[3*k+2]=100+10*(i+1)+(j+1);
                                                console.log([
                                                        k,
                                                        index2.array[3*k  ],
                                                        index2.array[3*k+1],
                                                        index2.array[3*k+2]
                                                ]);
                                                k++;
                                        }
                                geometry.index=index2;
                        }
                        /*window.setInterval((function(){
                                if(geometry.index.count/3<10000)return;
                                var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                scope.myQEMSimplification.deleteMeshPoint(mesh,mesh.geometry.index.array[rand*3],mesh.geometry.index.array[rand*3+1]);
                                scope.tag.reStr("三角面的个数:"+geometry.index.count/3);
                        }),0);*/

                        scope.scene.add(glb.scene.children[1]);
                });//

                //完成测试
        },
        //对自制的有重点三角网格平面使用了网格简化算法
        test8:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="直接坍塌的效果";
                console.log('start test:'+nameTest);
                //开始测试
                this.camera.position.set(-0.9704513248250748,2.0665495844811432,28.947142621027023);
                this.camera.rotation.set( -0.12261591349495268,-0.029774896077528493,-0.003668724751822147);
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        var position=attributes.position;
                        var index=geometry.index;
                        //scope.myQEMSimplification.simplifyIndex(mesh);
                        for(var i=0;i<2;i++)//移除其它mesh//主要是移除牙齿网格
                                glb.scene.children[1].children[2].children[0].parent.remove(glb.scene.children[1].children[2].children[0]);
                        //console.log("position",position);
                        //console.log("index",index);
                        //console.log("初始三角面的个数:"+geometry.index.count/3);

                        mesh.scale.set(4,4,4);

                        //设置position
                        var k=0;
                        for(var n=0;n<2;n++)
                            //生成两遍//每一遍生成100个点//共生成200个点
                                for(var i=-5.0;i<5.0;i+=1)
                                        for(var j=-5.0;j<5.0;j+=1){
                                                position.array[3*k]=2*i;
                                                position.array[3*k+1]=2*j;
                                                position.array[3*k+2]=0.0;
                                                k++;
                                        }
                        //alert(k)

                        //设置index
                        var index2;
                        my9_9_2();
                        console.log("position",position);
                        console.log("index2",index2);
                        console.log("初始三角面的个数:"+geometry.index.count/3);
                        function my9_9_2(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(2*9*9*3), 1);
                                k=0;
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=100+10*i+j;
                                                index2.array[3*k+1]=100+10*(i+1)+j;
                                                index2.array[3*k+2]=100+10*(i+1)+(j+1);
                                                k++;
                                        }
                                geometry.index=index2;
                        }


                        scope.scene.add(glb.scene.children[1]);

                        //flag=false;
                        window.setInterval((function(){
                                //if(flag)return;
                                //if(!scope.myQEMSimplification.isSkirt(mesh,0,1,2))return;
                                //if(mesh.geometry.index.array[0]=)
                                //if(geometry.index.count/3<10000)return;
                                //console.log(mesh.geometry.index);
                                var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                scope.myQEMSimplification.deleteMeshPoint(mesh,
                                    mesh.geometry.index.array[rand*3],
                                    mesh.geometry.index.array[rand*3+1],
                                    mesh.geometry.index.array[rand*3+2]);
                                scope.tag.reStr("三角面的个数:"+geometry.index.count/3);

                        }),100);/**/
                });//glb文件读取结束
        },
        //测试isSameLocation函数
        test8_1:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="直接坍塌的效果";
                console.log('start test:'+nameTest);
                //开始测试
                this.camera.position.set(-0.9704513248250748,2.0665495844811432,28.947142621027023);
                this.camera.rotation.set( -0.12261591349495268,-0.029774896077528493,-0.003668724751822147);
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        var position=attributes.position;
                        var index=geometry.index;
                        //scope.myQEMSimplification.simplifyIndex(mesh);
                        for(var i=0;i<2;i++)//移除其它mesh//主要是移除牙齿网格
                                glb.scene.children[1].children[2].children[0].parent.remove(glb.scene.children[1].children[2].children[0]);
                        //console.log("position",position);
                        //console.log("index",index);
                        //console.log("初始三角面的个数:"+geometry.index.count/3);

                        mesh.scale.set(4,4,4);

                        //设置position
                        var k=0;
                        for(var n=0;n<2;n++)
                            //生成两遍//每一遍生成100个点//共生成200个点
                                for(var i=-5.0;i<5.0;i+=1)
                                        for(var j=-5.0;j<5.0;j+=1){
                                                position.array[3*k]=2*i;
                                                position.array[3*k+1]=2*j;
                                                position.array[3*k+2]=0.0;
                                                k++;
                                        }
                        //alert(k)

                        //设置index
                        var index2;
                        my9_9_2();
                        console.log("position",position);
                        console.log("index2",index2);
                        console.log("初始三角面的个数:"+geometry.index.count/3);
                        function my9_9_2(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(2*9*9*3), 1);
                                k=0;
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=100+10*i+j;
                                                index2.array[3*k+1]=100+10*(i+1)+j;
                                                index2.array[3*k+2]=100+10*(i+1)+(j+1);
                                                k++;
                                        }
                                geometry.index=index2;
                        }


                        scope.scene.add(glb.scene.children[1]);
                        function isSameLocation(a, b, n) {//判断a,b两点是否至少有一个和n位置相同
                                if (position.array[3 * a] === position.array[3 * n]
                                    && position.array[3 * a + 1] === position.array[3 * n + 1]
                                    && position.array[3 * a + 2] === position.array[3 * n + 2])
                                        return true;
                                if (position.array[3 * b] === position.array[3 * n]
                                    && position.array[3 * b + 1] === position.array[3 * n + 1]
                                    && position.array[3 * b + 2] === position.array[3 * n + 2])
                                        return true
                                return false;
                        }
                        //位置相同
                        scope.referee.assertion(
                            isSameLocation(0,1,100),true
                        );
                        scope.referee.assertion(
                            isSameLocation(0,1,101),true
                        );
                        //位置不同
                        scope.referee.assertion(
                            isSameLocation(0,2,101),false
                        );
                });//glb文件读取结束
        },
        //测试deleteMeshPoint函数//有纹理、断言
        test8_2:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="直接坍塌的效果";
                console.log('start test:'+nameTest);
                //开始测试
                this.camera.position.set(-0.9704513248250748,2.0665495844811432,28.947142621027023);
                this.camera.rotation.set( -0.12261591349495268,-0.029774896077528493,-0.003668724751822147);
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        var position=attributes.position;
                        var index=geometry.index;
                        //scope.myQEMSimplification.simplifyIndex(mesh);
                        for(var i=0;i<2;i++)//移除其它mesh//主要是移除牙齿网格
                                glb.scene.children[1].children[2].children[0].parent.remove(glb.scene.children[1].children[2].children[0]);
                        //console.log("position",position);
                        //console.log("index",index);
                        //console.log("初始三角面的个数:"+geometry.index.count/3);

                        mesh.scale.set(4,4,4);

                        //设置position
                        var k=0;
                        for(var n=0;n<2;n++)
                            //生成两遍//每一遍生成100个点//共生成200个点
                                for(var i=-5.0;i<5.0;i+=1)
                                        for(var j=-5.0;j<5.0;j+=1){
                                                position.array[3*k]=2*i;
                                                position.array[3*k+1]=2*j;
                                                position.array[3*k+2]=0.0;
                                                k++;
                                        }
                        //alert(k)

                        //设置index
                        var index2;
                        my9_9_2();
                        console.log("position",position);
                        console.log("index2",index2);
                        console.log("初始三角面的个数:"+geometry.index.count/3);
                        function my9_9_2(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(2*9*9*3), 1);
                                k=0;
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=100+10*i+j;
                                                index2.array[3*k+1]=100+10*(i+1)+j;
                                                index2.array[3*k+2]=100+10*(i+1)+(j+1);
                                                k++;
                                        }
                                geometry.index=index2;
                        }


                        scope.scene.add(glb.scene.children[1]);

                        //collapse三角面
                        i=[55,0 ,1 ,2 ,3];
                        j=[56,1 ,2 ,3 ,4];
                        l=[66,11,12,13,14];
                        for(k=0;k<i.length;k++)
                                scope.myQEMSimplification.deleteMeshPoint(mesh,
                                    i[k], j[k], l[k]);
                        scope.tag.reStr("三角面的个数:" + geometry.index.count / 3);


                        //断言测试
                        i=[0  ,0,55,155];
                        j=[100,1,56, 56];
                        for(k=0;k<i.length;k++)
                                scope.referee.assertion(
                                    [position.array[3*i[k]],position.array[3*i[k]+1],position.array[3*i[k]+2]],
                                    [position.array[3*j[k]],position.array[3*j[k]+1],position.array[3*j[k]+2]]
                                );
                });//glb文件读取结束
        },
        //测试deleteMeshPoint函数//线框图、断言
        test8_3:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="  test8_3  ";
                console.log('start test:'+nameTest);
                //开始测试
                this.camera.position.set(-10.737996622084946,8.164451805696736,-0.3249246182617435);
                this.camera.rotation.set(-1.799047718201149,-1.552220604283645,-1.7990857496759487);
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        var position=attributes.position;
                        var index=geometry.index;
                        //scope.myQEMSimplification.simplifyIndex(mesh);
                        for(var i=0;i<2;i++)//移除其它mesh//主要是移除牙齿网格
                                glb.scene.children[1].children[2].children[0].parent.remove(glb.scene.children[1].children[2].children[0]);
                        //console.log("position",position);
                        //console.log("index",index);
                        //console.log("初始三角面的个数:"+geometry.index.count/3);

                        mesh.scale.set(20,20,20);

                        //设置position
                        var k=0;
                        for(var n=0;n<2;n++)
                            //生成两遍//每一遍生成100个点//共生成200个点
                                for(var i=-5.0;i<5.0;i+=1)
                                        for(var j=-5.0;j<5.0;j+=1){
                                                position.array[3*k]=2*i;
                                                position.array[3*k+1]=2*j;
                                                position.array[3*k+2]=0.0;
                                                k++;
                                        }
                        //alert(k)

                        //设置index
                        var index2;
                        my9_9_2();
                        console.log("position",position);
                        console.log("index2",index2);
                        console.log("初始三角面的个数:"+geometry.index.count/3);
                        function my9_9_2(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(2*9*9*3), 1);
                                k=0;
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=100+10*i+j;
                                                index2.array[3*k+1]=100+10*(i+1)+j;
                                                index2.array[3*k+2]=100+10*(i+1)+(j+1);
                                                k++;
                                        }
                                geometry.index=index2;
                        }


                        scope.scene.add(glb.scene.children[1]);

                        i=[55,0 ,1 ,2 ,3];
                        j=[56,1 ,2 ,3 ,4];
                        l=[66,11,12,13,14];
                        for(k=0;k<i.length;k++)
                        scope.myQEMSimplification.deleteMeshPoint(mesh,
                            i[k], j[k], l[k]);
                        scope.tag.reStr("三角面的个数:" + geometry.index.count / 3);


                        mesh.material = new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true});
                        //mesh.material = new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, transparent: true } );

                        console.log(position);

                        //0、100两个点位置相同
                        //0、1两个点位置相同
                        i=[0  ,0,55,155];
                        j=[100,1,56, 56];
                        for(var k=0;k<i.length;k++)
                        scope.referee.assertion(
                            [position.array[3*i[k]],position.array[3*i[k]+1],position.array[3*i[k]+2]],
                            [position.array[3*j[k]],position.array[3*j[k]+1],position.array[3*j[k]+2]],
                            nameTest+i[k]+"和"+j[k]+"两个点的坐标应该一致"
                        );

                });//glb文件读取结束
        },
        //测试findSuitablePoint2--(根据到相邻三角面的距离和)函数//线框图--大致成功了
        test8_3_1:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="  test8_3  ";
                console.log('start test:'+nameTest);
                //开始测试
                this.camera.position.set(-10.737996622084946,8.164451805696736,-0.3249246182617435);
                this.camera.rotation.set(-1.799047718201149,-1.552220604283645,-1.7990857496759487);
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        var position=attributes.position;
                        var index=geometry.index;
                        //scope.myQEMSimplification.simplifyIndex(mesh);
                        for(var i=0;i<2;i++)//移除其它mesh//主要是移除牙齿网格
                                glb.scene.children[1].children[2].children[0].parent.remove(glb.scene.children[1].children[2].children[0]);
                        //console.log("position",position);
                        //console.log("index",index);
                        //console.log("初始三角面的个数:"+geometry.index.count/3);

                        mesh.scale.set(20,20,20);

                        //设置position
                        var k=0;
                        for(var n=0;n<2;n++)
                            //生成两遍//每一遍生成100个点//共生成200个点
                                for(var i=-5.0;i<5.0;i+=1)
                                        for(var j=-5.0;j<5.0;j+=1){
                                                position.array[3*k]=2*i;
                                                position.array[3*k+1]=2*j;
                                                position.array[3*k+2]=0.0;
                                                if(j===-4.0)position.array[3*k+2]=0.5;
                                                //if(i===-5.0)position.array[3*k+2]=2.5;
                                                k++;
                                        }
                        //alert(k)

                        //设置index
                        var index2;
                        my9_9_2();
                        console.log("position",position);
                        console.log("index2",index2);
                        console.log("初始三角面的个数:"+geometry.index.count/3);
                        function my9_9_2(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(2*9*9*3), 1);
                                k=0;
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=100+10*i+j;
                                                index2.array[3*k+1]=100+10*(i+1)+j;
                                                index2.array[3*k+2]=100+10*(i+1)+(j+1);
                                                k++;
                                        }
                                geometry.index=index2;
                        }


                        scope.scene.add(glb.scene.children[1]);

                        for(i=0;i<1;i++){
                                var pos0=scope.myQEMSimplification.findSuitablePoint2(mesh);
                                console.log(pos0);
                                scope.myQEMSimplification.deleteMeshPoint(mesh, pos0[0],pos0[1], 10);
                        }

                        /*i=[55,0 ,1 ,2 ,3];
                        j=[56,1 ,2 ,3 ,4];
                        l=[66,11,12,13,14];
                        for(k=0;k<i.length;k++)
                                scope.myQEMSimplification.deleteMeshPoint(mesh,
                                    i[k], j[k], l[k]);*/
                        scope.tag.reStr("三角面的个数:" + geometry.index.count / 3);


                        mesh.material = new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true});
                        //mesh.material = new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, transparent: true } );

                        console.log(position);

                        /*//0、100两个点位置相同
                        //0、1两个点位置相同
                        i=[0  ,0,55,155];
                        j=[100,1,56, 56];
                        for(var k=0;k<i.length;k++)
                                scope.referee.assertion(
                                    [position.array[3*i[k]],position.array[3*i[k]+1],position.array[3*i[k]+2]],
                                    [position.array[3*j[k]],position.array[3*j[k]+1],position.array[3*j[k]+2]],
                                    nameTest+i[k]+"和"+j[k]+"两个点的坐标应该一致"
                                );*/

                });//glb文件读取结束
        },
        //测试isEdgeTriangle函数//线框图、断言
        test8_3_1_1:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="  test8_3  ";
                console.log('start test:'+nameTest);
                //开始测试
                this.camera.position.set(-10.737996622084946,8.164451805696736,-0.3249246182617435);
                this.camera.rotation.set(-1.799047718201149,-1.552220604283645,-1.7990857496759487);
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        var position=attributes.position;
                        var index=geometry.index;
                        //scope.myQEMSimplification.simplifyIndex(mesh);
                        for(var i=0;i<2;i++)//移除其它mesh//主要是移除牙齿网格
                                glb.scene.children[1].children[2].children[0].parent.remove(glb.scene.children[1].children[2].children[0]);
                        //console.log("position",position);
                        //console.log("index",index);
                        //console.log("初始三角面的个数:"+geometry.index.count/3);

                        mesh.scale.set(20,20,20);

                        //设置position
                        var k=0;
                        for(var n=0;n<2;n++)
                            //生成两遍//每一遍生成100个点//共生成200个点
                                for(var i=-5.0;i<5.0;i+=1)
                                        for(var j=-5.0;j<5.0;j+=1){
                                                position.array[3*k]=2*i;
                                                position.array[3*k+1]=2*j;
                                                position.array[3*k+2]=0.0;
                                                if(i===-5.0)position.array[3*k+2]=4.5;
                                                k++;
                                        }
                        //alert(k)

                        //设置index
                        var index2;
                        my9_9_2();
                        console.log("position",position);
                        console.log("index2",index2);
                        console.log("初始三角面的个数:"+geometry.index.count/3);
                        function my9_9_2(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(2*9*9*3), 1);
                                k=0;
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=100+10*i+j;
                                                index2.array[3*k+1]=100+10*(i+1)+j;
                                                index2.array[3*k+2]=100+10*(i+1)+(j+1);
                                                k++;
                                        }
                                geometry.index=index2;
                        }


                        scope.scene.add(glb.scene.children[1]);

                        /*console.log(
                            scope.myQEMSimplification.isEdgeTriangle(mesh,11,12,22)
                        );*/


                        /*i=[55,0 ,1 ,2 ,3];
                        j=[56,1 ,2 ,3 ,4];
                        l=[66,11,12,13,14];
                        for(k=0;k<i.length;k++)
                                scope.myQEMSimplification.deleteMeshPoint(mesh,
                                    i[k], j[k], l[k]);*/
                        scope.tag.reStr("三角面的个数:" + geometry.index.count / 3);


                        mesh.material = new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true});
                        //mesh.material = new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, transparent: true } );

                        console.log(position);

                        //断言
                        i=[11,22];
                        j=[12,23];
                        l=[22,33];
                        for(var k=0;k<i.length;k++)
                                scope.referee.assertion(
                                    scope.myQEMSimplification.isEdgeTriangle(mesh,i[k],j[k],l[k]),
                                    false,
                                    nameTest+i[k]+","+j[k]+","+l[k]+"不是边缘三角形"
                                );
                        i=[1,2];
                        j=[2,3];
                        l=[12,13];
                        for(var k=0;k<i.length;k++)
                                scope.referee.assertion(
                                    scope.myQEMSimplification.isEdgeTriangle(mesh,i[k],j[k],l[k]),
                                    true,
                                    nameTest+i[k]+","+j[k]+","+l[k]+"是边缘三角形"
                                );/**/

                });//glb文件读取结束
        },
        //测试isCommonEdge2函数//线框图、断言
        test8_3_1_1_0:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="  test8_3  ";
                console.log('start test:'+nameTest);
                //开始测试
                this.camera.position.set(-10.737996622084946,8.164451805696736,-0.3249246182617435);
                this.camera.rotation.set(-1.799047718201149,-1.552220604283645,-1.7990857496759487);
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        var position=attributes.position;
                        var index=geometry.index;
                        //scope.myQEMSimplification.simplifyIndex(mesh);
                        for(var i=0;i<2;i++)//移除其它mesh//主要是移除牙齿网格
                                glb.scene.children[1].children[2].children[0].parent.remove(glb.scene.children[1].children[2].children[0]);
                        //console.log("position",position);
                        //console.log("index",index);
                        //console.log("初始三角面的个数:"+geometry.index.count/3);

                        mesh.scale.set(20,20,20);

                        //设置position
                        var k=0;
                        for(var n=0;n<2;n++)
                            //生成两遍//每一遍生成100个点//共生成200个点
                                for(var i=-5.0;i<5.0;i+=1)
                                        for(var j=-5.0;j<5.0;j+=1){
                                                position.array[3*k]=2*i;
                                                position.array[3*k+1]=2*j;
                                                position.array[3*k+2]=0.0;
                                                if(i===-5.0)position.array[3*k+2]=4.5;
                                                k++;
                                        }
                        //alert(k)

                        //设置index
                        var index2;
                        my9_9_2();
                        console.log("position",position);
                        console.log("index2",index2);
                        console.log("初始三角面的个数:"+geometry.index.count/3);
                        function my9_9_2(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(2*9*9*3), 1);
                                k=0;
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=100+10*i+j;
                                                index2.array[3*k+1]=100+10*(i+1)+j;
                                                index2.array[3*k+2]=100+10*(i+1)+(j+1);
                                                k++;
                                        }
                                geometry.index=index2;
                        }


                        scope.scene.add(glb.scene.children[1]);

                        /*console.log(//11 12 22
                            22,33,"common is true",scope.myQEMSimplification.isCommonEdge2(mesh,111,112)
                        );
                        console.log(
                            0,1,"common is false",scope.myQEMSimplification.isCommonEdge2(mesh,11,12)
                        );*/



                        /*i=[55,0 ,1 ,2 ,3];
                        j=[56,1 ,2 ,3 ,4];
                        l=[66,11,12,13,14];
                        for(k=0;k<i.length;k++)
                                scope.myQEMSimplification.deleteMeshPoint(mesh,
                                    i[k], j[k], l[k]);*/
                        scope.tag.reStr("三角面的个数:" + geometry.index.count / 3);


                        mesh.material = new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true});
                        //mesh.material = new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, transparent: true } );

                        console.log(position);

                        //断言
                        i=[0,1];
                        j=[1,2];
                        for(var k=0;k<i.length;k++)
                                scope.referee.assertion(
                                    scope.myQEMSimplification.isCommonEdge2(mesh,i[k],j[k]),
                                    false,
                                    nameTest+i[k]+","+j[k]+"不是公共边"
                                );
                        i=[22,33];
                        j=[33,44];
                        for(var k=0;k<i.length;k++)
                                scope.referee.assertion(
                                    scope.myQEMSimplification.isCommonEdge2(mesh,i[k],j[k]),
                                    true,
                                    nameTest+i[k]+","+j[k]+"是边缘公共边"
                                );/**/

                });//glb文件读取结束
        },
        //测试isEdgePoint函数//线框图、断言
        test8_3_1_1_1:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="  test8_3  ";
                console.log('start test:'+nameTest);
                //开始测试
                this.camera.position.set(-10.737996622084946,8.164451805696736,-0.3249246182617435);
                this.camera.rotation.set(-1.799047718201149,-1.552220604283645,-1.7990857496759487);
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        var position=attributes.position;
                        var index=geometry.index;
                        //scope.myQEMSimplification.simplifyIndex(mesh);
                        for(var i=0;i<2;i++)//移除其它mesh//主要是移除牙齿网格
                                glb.scene.children[1].children[2].children[0].parent.remove(glb.scene.children[1].children[2].children[0]);
                        //console.log("position",position);
                        //console.log("index",index);
                        //console.log("初始三角面的个数:"+geometry.index.count/3);

                        mesh.scale.set(20,20,20);

                        //设置position
                        var k=0;
                        for(var n=0;n<2;n++)
                            //生成两遍//每一遍生成100个点//共生成200个点
                                for(var i=-5.0;i<5.0;i+=1)
                                        for(var j=-5.0;j<5.0;j+=1){
                                                position.array[3*k]=2*i;
                                                position.array[3*k+1]=2*j;
                                                position.array[3*k+2]=0.0;
                                                if(i===-5.0)position.array[3*k+2]=4.5;
                                                k++;
                                        }
                        //alert(k)

                        //设置index
                        var index2;
                        my9_9_2();
                        console.log("position",position);
                        console.log("index2",index2);
                        console.log("初始三角面的个数:"+geometry.index.count/3);
                        function my9_9_2(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(2*9*9*3), 1);
                                k=0;
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=100+10*i+j;
                                                index2.array[3*k+1]=100+10*(i+1)+j;
                                                index2.array[3*k+2]=100+10*(i+1)+(j+1);
                                                k++;
                                        }
                                geometry.index=index2;
                        }


                        scope.scene.add(glb.scene.children[1]);

                        /*console.log(//11 12 22
                            22,33,"common is true",scope.myQEMSimplification.isCommonEdge2(mesh,111,112)
                        );
                        console.log(
                            0,1,"common is false",scope.myQEMSimplification.isCommonEdge2(mesh,11,12)
                        );*/



                        /*i=[55,0 ,1 ,2 ,3];
                        j=[56,1 ,2 ,3 ,4];
                        l=[66,11,12,13,14];
                        for(k=0;k<i.length;k++)
                                scope.myQEMSimplification.deleteMeshPoint(mesh,
                                    i[k], j[k], l[k]);*/
                        scope.tag.reStr("三角面的个数:" + geometry.index.count / 3);


                        mesh.material = new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true});
                        //mesh.material = new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, transparent: true } );

                        console.log(position);

                        //断言
                        i=[0,1];
                        for(var k=0;k<i.length;k++)
                                scope.referee.assertion(
                                    scope.myQEMSimplification.isEdgePoint(mesh,i[k]),
                                    true,
                                    nameTest+i[k]+"是边缘点"
                                );
                        i=[22,33];
                        for(var k=0;k<i.length;k++)
                                scope.referee.assertion(
                                    scope.myQEMSimplification.isEdgePoint(mesh,i[k]),
                                    false,
                                    nameTest+i[k]+","+j[k]+"不是边缘点"
                                );/**/

                });//glb文件读取结束
        },
        //测试computeError函数//线框图、断言--大致成功了
        test8_3_1_1_2:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="  test8_3  ";
                console.log('start test:'+nameTest);
                //开始测试
                this.camera.position.set(-10.737996622084946,8.164451805696736,-0.3249246182617435);
                this.camera.rotation.set(-1.799047718201149,-1.552220604283645,-1.7990857496759487);
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        var position=attributes.position;
                        var index=geometry.index;
                        //scope.myQEMSimplification.simplifyIndex(mesh);
                        for(var i=0;i<2;i++)//移除其它mesh//主要是移除牙齿网格
                                glb.scene.children[1].children[2].children[0].parent.remove(glb.scene.children[1].children[2].children[0]);
                        //console.log("position",position);
                        //console.log("index",index);
                        //console.log("初始三角面的个数:"+geometry.index.count/3);

                        mesh.scale.set(20,20,20);

                        //设置position
                        var k=0;
                        for(var n=0;n<2;n++)
                            //生成两遍//每一遍生成100个点//共生成200个点
                                for(var i=-5.0;i<5.0;i+=1)
                                        for(var j=-5.0;j<5.0;j+=1){
                                                position.array[3*k]=2*i;
                                                position.array[3*k+1]=2*j;
                                                position.array[3*k+2]=0.0;
                                                if(i===-5.0)position.array[3*k+2]=4.5;
                                                k++;
                                        }
                        //alert(k)

                        //设置index
                        var index2;
                        my9_9_2();
                        console.log("初始三角面的个数:"+geometry.index.count/3);
                        function my9_9_2(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(2*9*9*3), 1);
                                k=0;
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=100+10*i+j;
                                                index2.array[3*k+1]=100+10*(i+1)+j;
                                                index2.array[3*k+2]=100+10*(i+1)+(j+1);
                                                k++;
                                        }
                                geometry.index=index2;
                        }


                        scope.scene.add(glb.scene.children[1]);


                        /*console.log(
                            0,10,"isCommonEdge is false",scope.myQEMSimplification.isCommonEdge2(mesh,0,10)
                        );*/



                        /*i=[55,0 ,1 ,2 ,3];
                        j=[56,1 ,2 ,3 ,4];
                        l=[66,11,12,13,14];
                        for(k=0;k<i.length;k++)
                                scope.myQEMSimplification.deleteMeshPoint(mesh,
                                    i[k], j[k], l[k]);*/
                        scope.tag.reStr("三角面的个数:" + geometry.index.count / 3);


                        mesh.material = new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true});
                        //mesh.material = new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, transparent: true } );


                        //断言
                        console.log(//11 12 22
                            0,1,"should is 0",scope.myQEMSimplification.computeError(mesh,0,1)
                        );/**/
                        console.log(
                            0,10,"should is not 0",scope.myQEMSimplification.computeError(mesh,0,10)
                        );
                        i=[0,33];
                        j=[1,22];
                        for(var k=0;k<i.length;k++)
                                scope.referee.assertion(
                                    scope.myQEMSimplification.computeError(mesh,i[k],j[k])===0,
                                    true,
                                    nameTest+i[k]+","+j[k]+"误差应该是0"
                                );
                        i=[0 ,0,10];
                        j=[10,11,20];
                        for(var k=0;k<i.length;k++)
                                scope.referee.assertion(
                                    scope.myQEMSimplification.computeError(mesh,i[k],j[k])===0,
                                    false,
                                    nameTest+i[k]+","+j[k]+"误差应该不是0"
                                );
                        i=[22,33];

                });//glb文件读取结束
        },
        //测试findSuitablePoint3--(根据到相邻三角面的距离和)函数//线框图--大致成功了
        test8_3_2:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="  test8_3  ";
                console.log('start test:'+nameTest);
                //开始测试
                this.camera.position.set(-10.737996622084946,8.164451805696736,-0.3249246182617435);
                this.camera.rotation.set(-1.799047718201149,-1.552220604283645,-1.7990857496759487);
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        var position=attributes.position;
                        var index=geometry.index;
                        //scope.myQEMSimplification.simplifyIndex(mesh);
                        for(var i=0;i<2;i++)//移除其它mesh//主要是移除牙齿网格
                                glb.scene.children[1].children[2].children[0].parent.remove(glb.scene.children[1].children[2].children[0]);
                        //console.log("position",position);
                        //console.log("index",index);
                        //console.log("初始三角面的个数:"+geometry.index.count/3);

                        mesh.scale.set(20,20,20);

                        //设置position
                        var k=0;
                        for(var n=0;n<2;n++)
                            //生成两遍//每一遍生成100个点//共生成200个点
                                for(var i=-5.0;i<5.0;i+=1)
                                        for(var j=-5.0;j<5.0;j+=1){
                                                position.array[3*k]=2*i;
                                                position.array[3*k+1]=2*j;
                                                position.array[3*k+2]=0.0;
                                                if(j===-4.0)position.array[3*k+2]=0.5;
                                                //if(i===-5.0)position.array[3*k+2]=2.5;
                                                k++;
                                        }
                        //alert(k)

                        //设置index
                        var index2;
                        my9_9_2();
                        console.log("position",position);
                        console.log("index2",index2);
                        console.log("初始三角面的个数:"+geometry.index.count/3);
                        function my9_9_2(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(2*9*9*3), 1);
                                k=0;
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=100+10*i+j;
                                                index2.array[3*k+1]=100+10*(i+1)+j;
                                                index2.array[3*k+2]=100+10*(i+1)+(j+1);
                                                k++;
                                        }
                                geometry.index=index2;
                        }


                        scope.scene.add(glb.scene.children[1]);

                        for(i=0;i<2;i++){
                                var pos0=scope.myQEMSimplification.findSuitablePoint3(mesh);
                                console.log(pos0);
                                scope.myQEMSimplification.deleteMeshPoint(mesh, pos0[0],pos0[1], 10);
                        }

                        /*i=[55,0 ,1 ,2 ,3];
                        j=[56,1 ,2 ,3 ,4];
                        l=[66,11,12,13,14];
                        for(k=0;k<i.length;k++)
                                scope.myQEMSimplification.deleteMeshPoint(mesh,
                                    i[k], j[k], l[k]);*/
                        scope.tag.reStr("三角面的个数:" + geometry.index.count / 3);


                        mesh.material = new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true});
                        //mesh.material = new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, transparent: true } );

                        console.log(position);

                        /*//0、100两个点位置相同
                        //0、1两个点位置相同
                        i=[0  ,0,55,155];
                        j=[100,1,56, 56];
                        for(var k=0;k<i.length;k++)
                                scope.referee.assertion(
                                    [position.array[3*i[k]],position.array[3*i[k]+1],position.array[3*i[k]+2]],
                                    [position.array[3*j[k]],position.array[3*j[k]+1],position.array[3*j[k]+2]],
                                    nameTest+i[k]+"和"+j[k]+"两个点的坐标应该一致"
                                );*/

                });//glb文件读取结束
        },
        //测试deleteMeshPoint函数,过程可视
        test9:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="直接坍塌的效果";
                console.log('start test:'+nameTest);
                //开始测试
                this.camera.position.set(-0.9704513248250748,2.0665495844811432,28.947142621027023);
                this.camera.rotation.set( -0.12261591349495268,-0.029774896077528493,-0.003668724751822147);
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var obj=glb.scene.children[1];
                        var mesh=obj.children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        var position=attributes.position;
                        var index=geometry.index;
                        //scope.myQEMSimplification.simplifyIndex(mesh);
                        for(var i=0;i<2;i++)//移除其它mesh//主要是移除牙齿网格
                                glb.scene.children[1].children[2].children[0].parent.remove(glb.scene.children[1].children[2].children[0]);

                        mesh.scale.set(4,4,4);

                        //设置position
                        var k=0;
                        for(var n=0;n<2;n++)
                            //生成两遍//每一遍生成100个点//共生成200个点
                                for(var i=-5.0;i<5.0;i+=1)
                                        for(var j=-5.0;j<5.0;j+=1){
                                                position.array[3*k]=2*i;
                                                position.array[3*k+1]=2*j;
                                                position.array[3*k+2]=0.0;
                                                k++;
                                        }
                        //alert(k)

                        //设置index
                        var index2;
                        my9_9_2();
                        console.log("position",position);
                        console.log("index2",index2);
                        console.log("初始三角面的个数:"+geometry.index.count/3);
                        //scope.tag.reStr("三角面的个数:"+geometry.index.count/3);

                        function my9_9_2(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(2*9*9*3), 1);
                                k=0;
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=100+10*i+j;
                                                index2.array[3*k+1]=100+10*(i+1)+j;
                                                index2.array[3*k+2]=100+10*(i+1)+(j+1);
                                                k++;
                                        }
                                geometry.index=index2;
                        }




                        function myTest0(myMesh){
                                scope.myQEMSimplification.deleteMeshPoint_Test1(
                                    myMesh
                                );
                        }
                        function myTest(){
                                scope.myQEMSimplification.deleteMeshPoint_Test1(
                                    mesh
                                );
                        }
                        function wireFrame0(myMesh){
                                myMesh.material = new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true});//mesh.material = new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, transparent: true } );
                                //scope.camera.position.set(-10.737996622084946,8.164451805696736,-0.3249246182617435);
                                //scope.camera.rotation.set(-1.799047718201149,-1.552220604283645,-1.7990857496759487);
                                //mesh.scale.set(1,1,1);
                        }
                        function wireFrame(){
                                mesh.material = new THREE.MeshBasicMaterial({color: 0x00ffff, wireframe: true});//mesh.material = new THREE.MeshBasicMaterial( { color: 0x00ffff, wireframe: true, transparent: true } );
                                //scope.camera.position.set(-10.737996622084946,8.164451805696736,-0.3249246182617435);
                                //scope.camera.rotation.set(-1.799047718201149,-1.552220604283645,-1.7990857496759487);
                                mesh.scale.set(1,1,1);
                        }
                        function myTest1(rand) {
                                scope.myQEMSimplification.deleteMeshPoint(
                                    mesh,
                                    mesh.geometry.index.array[rand * 3],
                                    mesh.geometry.index.array[rand * 3 + 1],
                                    mesh.geometry.index.array[rand * 3 + 2]
                                );
                        }
                        function myTest2(myMesh) {
                                var rand = Math.floor(Math.random() * mesh.geometry.index.array.length / 3);
                                scope.myQEMSimplification.deleteMeshPoint(myMesh,
                                    myMesh.geometry.index.array[rand * 3],
                                    myMesh.geometry.index.array[rand * 3 + 1],
                                    myMesh.geometry.index.array[rand * 3 + 2]
                                );
                        }
                        //for(i=0;i<30;i++)myTest(i);

                        console.log(//2
                            mesh.geometry.attributes.position.array[3 * 2+1],
                            mesh.geometry.attributes.position.array[3 * 3+1],
                            mesh.geometry.attributes.position.array[3 * 102+1],
                            mesh.geometry.attributes.position.array[3 * 103+1],
                        );

                        mesh.geometry.attributes.position.array[3 * 103]=-11

                        console.log(mesh.geometry.attributes.position.array[3 * 102])
                        //myTest();wireFrame();


                        scope.scene.add(mesh.clone());//
                        wireFrame();
                        window.setTimeout((function () {
                                mesh2=mesh.clone();
                                mesh2.geomotry=mesh.geometry.clone();
                                //mesh2.geomotry.attributes=mesh.geometry.attributes.clone();
                                mesh2.position.x+=20;
                                myTest0(mesh2);
                                wireFrame0(mesh2);
                                scope.scene.add(mesh2);

                        }), 0);
                        window.setTimeout((function () {
                                console.log(//2
                                    mesh.geometry.attributes.position.array[3 * 2+1],
                                    mesh.geometry.attributes.position.array[3 * 3+1],
                                    mesh.geometry.attributes.position.array[3 * 102+1],
                                    mesh.geometry.attributes.position.array[3 * 103+1],
                                )
                                //mesh.position.x+=1.15;

                        }), 1000);/**/
                });//glb文件读取结束
        },
        //测试deleteMeshPoint函数,过程不可视
        test9_1:function (contextType){
                if(typeof(contextType)==="undefined")this.setContext2();
                var nameTest="直接坍塌的效果";
                console.log('start test:'+nameTest);
                //开始测试
                this.camera.position.set(-0.9704513248250748,2.0665495844811432,28.947142621027023);
                this.camera.rotation.set( -0.12261591349495268,-0.029774896077528493,-0.003668724751822147);
                var scope=this;
                var loader= new THREE.GLTFLoader();
                loader.load("zhao.glb", (glb) => {
                        var mesh=glb.scene.children[1].children[3];//index 顶点个数2004//前三个点为：0，1，2
                        var geometry=mesh.geometry;
                        var attributes=geometry.attributes;
                        var position=attributes.position;
                        var index=geometry.index;
                        //scope.myQEMSimplification.simplifyIndex(mesh);
                        for(var i=0;i<2;i++)//移除其它mesh//主要是移除牙齿网格
                                glb.scene.children[1].children[2].children[0].parent.remove(glb.scene.children[1].children[2].children[0]);
                        //console.log("position",position);
                        //console.log("index",index);
                        //console.log("初始三角面的个数:"+geometry.index.count/3);

                        mesh.scale.set(4,4,4);

                        //设置position
                        var k=0;
                        for(var n=0;n<2;n++)
                            //生成两遍//每一遍生成100个点//共生成200个点
                                for(var i=-5.0;i<5.0;i+=1)
                                        for(var j=-5.0;j<5.0;j+=1){
                                                position.array[3*k]=2*i;
                                                position.array[3*k+1]=2*j;
                                                position.array[3*k+2]=0.0;
                                                k++;
                                        }
                        //alert(k)

                        //设置index
                        var index2;
                        my9_9_2();
                        console.log("position",position);
                        console.log("index2",index2);
                        console.log("初始三角面的个数:"+geometry.index.count/3);
                        function my9_9_2(){
                                index2 = new THREE.InstancedBufferAttribute(new Uint16Array(2*9*9*3), 1);
                                k=0;
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=10*i+j;
                                                index2.array[3*k+1]=10*i+(j+1);
                                                index2.array[3*k+2]=10*(i+1)+(j+1);
                                                k++;
                                        }
                                for(i=0;i<9;i++)
                                        for(j=0;j<9;j++){
                                                index2.array[3*k  ]=100+10*i+j;
                                                index2.array[3*k+1]=100+10*(i+1)+j;
                                                index2.array[3*k+2]=100+10*(i+1)+(j+1);
                                                k++;
                                        }
                                geometry.index=index2;
                        }


                        scope.scene.add(glb.scene.children[1]);


                        for (var i = 0; i < 40; i++) {
                                var rand = Math.floor(Math.random() * mesh.geometry.index.array.length / 3);
                                console.log(mesh.geometry.index.array[rand * 3 + 1] - mesh.geometry.index.array[rand * 3]);
                                scope.myQEMSimplification.deleteMeshPoint(mesh,
                                    mesh.geometry.index.array[rand * 3],
                                    mesh.geometry.index.array[rand * 3 + 1],
                                    mesh.geometry.index.array[rand * 3 + 2]);
                                scope.tag.reStr("三角面的个数:" + geometry.index.count / 3);
                        }

                });//glb文件读取结束
        },

        main:function () {
                //this.test4();
                //赵院士模型collapse,过程不可见
                //this.test4_1();
                //赵院士模型collapse,过程不可见,指定坍塌区域+不指定坍塌区域
                if(typeof(urlType)!== "undefined")
                if(urlType==="0"||urlType==="1")this.test4_1_1();
                //if(urlType==="4")this.test4();
                //赵院士模型collapse,过程不可见,指定坍塌区域
                //this.test4_2();

                //无重点、过程可视、有贴图
                //this.test6();
                //无重点、线框图、断言
                //this.test6_5();
                if(typeof(urlType)!== "undefined")
                if(urlType==="2")this.test6_5_1();
                else if(urlType==="3")this.test6_5_2();

                //重点、线框图、断言
                //this.test8_3();

                //测试deleteMeshPoint函数//线框图、断言//尝试找出过程可视化中的错误//模型一旦添加到场景中position就不可变了
                //this.test9();
                //测试deleteMeshPoint函数,过程不可视
                //this.test9_1();


                //重点、线框图、断言
                //if(typeof(urlType)=== "undefined")this.test8();
                //测试findSuitablePoint2函数//线框图、断言
                if(typeof(urlType)=== "undefined")this.test4_1_00();
        },
}
var myQEMSimplificationTest=new QEMSimplificationTest(myTest);
myQEMSimplificationTest.main();