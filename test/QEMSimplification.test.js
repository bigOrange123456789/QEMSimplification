//InstancedGroup.test
function InstancedGroupTest(myTest){
        this.scene;
        this.camera;
        this.myTest=myTest;

        this.myQEMSimplification;
        this.tag;
}
InstancedGroupTest.prototype={
        setContext:function () {
                this.myQEMSimplification=new QEMSimplification();

                var nameContext="";
                console.log('set context:'+nameContext);
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
        //调整相机
        setContext2:function () {
                this.myQEMSimplification=new QEMSimplification();

                var nameContext="";
                console.log('set context:'+nameContext);

                [this.scene, this.camera]=this.myTest.init();

                this.camera.position.z = 20;
                this.camera.position.y = 8;

                new PlayerControl(this.camera);
                this.tag=new Text("","green",25);
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
                        console.log(mesh.geometry.index.array.length/3)
                        for(var k=0;k<60;k++){//1830//1731
                                flag=false;
                                while(!flag){
                                        var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                        flag=deleteMeshPoint(mesh,mesh.geometry.index.array[rand*3],mesh.geometry.index.array[rand*3+1]);
                                        console.log(mesh);
                                        console.log(geometry);
                                        console.log(attributes);
                                }

                        }/**/

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
                                var distance=
                                    Math.pow(mesh.geometry.attributes.position.array[3*p1]-mesh.geometry.attributes.position.array[3*p2],2)+
                                    Math.pow(mesh.geometry.attributes.position.array[3*p1+1]-mesh.geometry.attributes.position.array[3*p2+1],2)+
                                    Math.pow(mesh.geometry.attributes.position.array[3*p1+2]-mesh.geometry.attributes.position.array[3*p2+2],2);
                                if(distance>0.005)return false;
                                console.log(distance);


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
                                if(geometry.index.count/3<8000)return;
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
        //过程不可见
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

                        for(var k=0;k<5000;k++){//1830//1731//
                                var rand=Math.floor(Math.random()*mesh.geometry.index.array.length/3);
                                this.myQEMSimplification.deleteMeshPoint(mesh,mesh.geometry.index.array[rand*3],mesh.geometry.index.array[rand*3+1]);
                                //deleteMeshPoint(mesh,mesh.geometry.index.array[rand*3],mesh.geometry.index.array[rand*3+1]);
                                console.log("三角面的个数为："+geometry.index.count/3);
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

        //制作了一个三角网格平面
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
        //对自制的三角网格平面使用了网格简化算法
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

                        //flag=false;
                        window.setInterval((function(){
                                //if(flag)return;
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
}
var myTest=new Test();
var myInstancedGroupTest=new InstancedGroupTest(myTest);
myInstancedGroupTest.test6();