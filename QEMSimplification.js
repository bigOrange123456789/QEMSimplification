function QEMSimplification(){
    this.errors=null;//长度为三角形的个数
}
QEMSimplification.prototype = {
    //判断一个点是否为边缘点//Skirt
    isEdgePoint:function (mesh,p){//p的邻接边存在非共用边
        var geometry = mesh.geometry;
        var attributes = geometry.attributes;
        var position = attributes.position;
        var index = mesh.geometry.index;
        for (var i = 0; i < index.count ; i = i + 3) {
            var array=containPos(index.array[i], index.array[i + 1], index.array[i + 2],p);
            if(array.length>0){
                //console.log(array,this.isCommonEdge2(mesh,array[0],p),this.isCommonEdge2(mesh,array[1],p));
                if(!this.isCommonEdge2(mesh,array[0],p))return true;
                if(!this.isCommonEdge2(mesh,array[1],p))return true;
            }
        }
        return false;

        function containPos(a,b,c,p){//三角形中包含点p
            if(positionSimilar(a,p))return [b,c];
            else if(positionSimilar(b,p))return [a,c];
            else if(positionSimilar(c,p))return [a,b];
            else return [];
        }
        function positionSimilar(v1, v2) {
            if (
                position.array[3 * v1] === position.array[3 * v2] &&
                position.array[3 * v1 + 1] === position.array[3 * v2 + 1] &&
                position.array[3 * v1 + 2] === position.array[3 * v2 + 2]
            ) return true;
            else return false;
        }
    },
    //判断一个三角形是否为边缘三角形
    isEdgeTriangle:function (mesh,p1,p2,p3){//判断三条边是否都是公有边//p1,p2,p3是index的值
        var geometry=mesh.geometry;//console.log(p1,p2,p3);//11 12 22//不是边缘三角形，应该返回false
        var attributes=geometry.attributes;
        var position=attributes.position;
        var index = mesh.geometry.index;

        if(this.isCommonEdge2(mesh,p1,p2)&&
            this.isCommonEdge2(mesh,p1,p3)&&
            this.isCommonEdge2(mesh,p2,p3))
            return false;//全是公共边
        else return true;//至少一条不是公共边


    },
    //判断一个边是否为共用边
    isCommonEdge2: function (mesh, pa, pb) {
        var geometry = mesh.geometry;
        var attributes = geometry.attributes;
        var position = attributes.position;
        var index = mesh.geometry.index;
        /*console.log(index, pa, pb);
        console.log(246,247,248,
            index.array[246], index.array[246 + 1], index.array[246 + 2],
            equalDouble(index.array[246], index.array[246 + 1], index.array[246 + 2], pa, pb)
            );*/
        var n = 0;
        for (var i = 0; i < index.count ; i = i + 3)
            if (equalDouble(index.array[i], index.array[i + 1], index.array[i + 2], pa, pb)) {
                //console.log(index.array[i], index.array[i + 1], index.array[i + 2], pa, pb);
                n++;
                if (n > 1) return true;
            }
        return false;

        function equalDouble(v1, v2, v3, a, b) {//三角形中有边ab//三角形中有点a和点b
            if (equal(v1, v2, v3, a) && equal(v1, v2, v3, b)) return true;
            else return false;
        }

        function equal(v1, v2, v3, a) {//三角形中有一个顶点和a位置相同
            if (positionSimilar(v1, a) || positionSimilar(v2, a) || positionSimilar(v3, a)) return true;
            else return false;
        }

        function positionSimilar(v1, v2) {
            if (
                position.array[3 * v1] === position.array[3 * v2] &&
                position.array[3 * v1 + 1] === position.array[3 * v2 + 1] &&
                position.array[3 * v1 + 2] === position.array[3 * v2 + 2]
            ) return true;
            else return false;
        }
    },
    //根据到相邻三角面的距离和
    findSuitablePoint2: function (mesh) {

        var geometry=mesh.geometry;
        var index = geometry.index;

        var pos0=[]//[index.array[0],index.array[1]];
        var distance0=99999999999;//this.computeError(mesh,pos0[0],pos0[1]);
        for (var i = 0; i < index.count / 3; i = i + 3){
            if(!this.isEdgePoint(mesh,index.array[i])&&!this.isEdgePoint(mesh,index.array[i+1])) {
                var myDistance=this.computeError(mesh,index.array[i],index.array[i+1]);
                //console.log(index.array[i]+","+index.array[i+1],myDistance);
                if(myDistance<distance0){
                    distance0=myDistance;
                    pos0=[index.array[i],index.array[i+1]];
                }

            }

        }
        return pos0;
    },
    //根据到相邻三角面的距离和--采用了更为快捷的算法
    findSuitablePoint3: function (mesh) {

        var geometry=mesh.geometry;
        var index = geometry.index;

        if(this.errors===null){//初始化errors
            for (var i = 0; i < index.count / 3; i = i + 3){
                var myDistance=this.computeError(mesh,index.array[i],index.array[i+1]);
                this.errors.push(myDistance);
            }
        }


        var pos0=[]//[index.array[0],index.array[1]];
        var distance0=99999999999;//this.computeError(mesh,pos0[0],pos0[1]);

        for (var i = 0; i < index.count / 3; i = i + 3){
            if(!this.isEdgePoint(mesh,index.array[i])&&!this.isEdgePoint(mesh,index.array[i+1])) {
                //if(this.errors)
                myDistance=this.errors[i/3];//this.computeError(mesh,index.array[i],index.array[i+1]);
                //console.log(index.array[i]+","+index.array[i+1],myDistance);
                if(myDistance<distance0){
                    distance0=myDistance;
                    pos0=[index.array[i],index.array[i+1]];
                }

            }

        }


        return pos0;

    },
    //根据两点之间的距离
    findSuitablePoint: function (mesh) {
        function getDistance(p1,p2){//获取两个点的距离//p1,p2都是position的下标，即index的值
            return (
                Math.pow(mesh.geometry.attributes.position.array[3 * p1] - mesh.geometry.attributes.position.array[3 * p2], 2) +
                Math.pow(mesh.geometry.attributes.position.array[3 * p1 + 1] - mesh.geometry.attributes.position.array[3 * p2 + 1], 2) +
                Math.pow(mesh.geometry.attributes.position.array[3 * p1 + 2] - mesh.geometry.attributes.position.array[3 * p2 + 2], 2)
            )
        }
        var geometry=mesh.geometry;
        var index = geometry.index;

        var pos0=[index.array[0],index.array[1]];
        var distance0=getDistance(pos0[0],pos0[1]);
        for (var i = 1; i < index.count / 3; i = i + 3){
            var myDistance=getDistance(index.array[i],index.array[i+1]);
            if(myDistance<distance0){
                distance0=myDistance;
                pos0=[index.array[i],index.array[i+1]];
            }
        }
        return pos0;
    },


    deleteMeshPoint: function (mesh, p1, p2,p3) {//将mesh中的p1点删除，对应为p2点
        var geometry=mesh.geometry;
        var attributes=geometry.attributes;
        var position=attributes.position;
        var index = mesh.geometry.index;

        //if(this.isSkirt(mesh, p1, p2,p3))return ;//如果该边位于网格边缘，不进行collapse
        //for(var )
        var mid=[
            (position.array[3 * p1    ] + position.array[3 * p2]) / 2,
            (position.array[3 * p1 + 1] + position.array[3 * p2 + 1]) / 2,
            (position.array[3 * p1 + 2] + position.array[3 * p2 + 2]) / 2
        ];
        var _p1=[
            position.array[3 * p1],
            position.array[3 * p1+1],
            position.array[3 * p1+2]
        ];
        var _p2=[
            position.array[3 * p2],
            position.array[3 * p2+1],
            position.array[3 * p2+2]
        ];
        for(var i=0;i<position.count;i++)
            if(
                isSameLocation(
                    _p1,
                    _p2,
                    [position.array[3 * i],position.array[3 * i+1],position.array[3 * i+2]]
                )
            ){
                position.array[3 * i] = mid[0];
                position.array[3 * i + 1] = mid[1];
                position.array[3 * i + 2] = mid[2];
            }

        function notTriangle(a, b, c) {//判断a,b两点是否至少有一个和n位置相同
            if (position.array[3 * a] === position.array[3 * b]
                && position.array[3 * a + 1] === position.array[3 * b + 1]
                && position.array[3 * a + 2] === position.array[3 * b + 2])
                return true;
            if (position.array[3 * a] === position.array[3 * c]
                && position.array[3 * a + 1] === position.array[3 * c + 1]
                && position.array[3 * a + 2] === position.array[3 * c + 2])
                return true;
            if (position.array[3 * b] === position.array[3 * c]
                && position.array[3 * b + 1] === position.array[3 * c + 1]
                && position.array[3 * b + 2] === position.array[3 * c + 2])
                return true
            return false;
        }
        function isSameLocation(a, b, n) {//判断a,b两点是否至少有一个和n位置相同
            if (a[0] === n[0]
                && a[1] === n[1]
                && a[2] === n[2])
                return true;
            else if (b[0] === n[0]
                && b[1] === n[1]
                && b[2] === n[2])
                return true
            else return false;
        }


        /*for (var i = 0; i < index.count; i++)
            if (index.array[i] === p1) {
                //index.array[i]
                index.array[i] = p2;
                //position.array[3 * index.array[i]    ]=mid[0];
                //position.array[3 * index.array[i]+1  ]=mid[1];
                //position.array[3 * index.array[i]+2  ]=mid[2];
            }//index.array[i] = p2*/

        var needDeleteTriangle = 0;
        for (var i = 0; i < index.count / 3; i = i + 3) {
            if (
                notTriangle(index.array[i], index.array[i+1], index.array[i+2])
            )
            {
                if(this.errors)this.errors.splice(i/3-needDeleteTriangle,1);//删除this.errors
                else console.log("this.errors is null!");
                needDeleteTriangle++;
            }
        }
        //console.log(needDeleteTriangle);//有两个三角形需要删除
        //如果一个三角形点有重合，则删除这个三角形
        var index2 = new THREE.InstancedBufferAttribute(new Uint16Array(index.count - needDeleteTriangle * 3), 1);//头部、上衣、裤子、动作
        var j = 0;
        for (var i = 0; i < index.count; i = i + 3)
            if (
                !notTriangle(index.array[i], index.array[i+1], index.array[i+2])
            ) {
                index2.array[j] = index.array[i];
                index2.array[j + 1] = index.array[i + 1];
                index2.array[j + 2] = index.array[i + 2];
                j = j + 3;
            }
        mesh.geometry.index = index2;

        for (i = 0; i < index.count / 3; i = i + 3)
            if(
                positionSimilar(index2.array[i]   , p1)||
                positionSimilar(index2.array[i+1] , p1)||
                positionSimilar(index2.array[i+2] , p1)||
                positionSimilar(index2.array[i]   , p2)||
                positionSimilar(index2.array[i+1] , p2)||
                positionSimilar(index2.array[i+2] , p2)
            ){
            var myDistance=this.computeError(mesh,index.array[i],index.array[i+1]);
            this.errors[i/3](myDistance);
        }
        function positionSimilar(v1, v2) {
            if (
                position.array[3 * v1] === position.array[3 * v2] &&
                position.array[3 * v1 + 1] === position.array[3 * v2 + 1] &&
                position.array[3 * v1 + 2] === position.array[3 * v2 + 2]
            ) return true;
            else return false;
        }
        return true;
    },
    deleteMeshPoint_: function (mesh, p1, p2,p3) {//将mesh中的p1点删除，对应为p2点
        var geometry=mesh.geometry;
        var attributes=geometry.attributes;
        var position=attributes.position;
        var index = mesh.geometry.index;

        if(position.array[3 * p1+2]>0.5)return;
        //if(this.isSkirt(mesh, p1, p2,p3))return ;//如果该边位于网格边缘，不进行collapse
        //for(var )
        var mid=[
            (position.array[3 * p1    ] + position.array[3 * p2]) / 2,
            (position.array[3 * p1 + 1] + position.array[3 * p2 + 1]) / 2,
            (position.array[3 * p1 + 2] + position.array[3 * p2 + 2]) / 2
        ];
        var _p1=[
            position.array[3 * p1],
            position.array[3 * p1+1],
            position.array[3 * p1+2]
        ];
        var _p2=[
            position.array[3 * p2],
            position.array[3 * p2+1],
            position.array[3 * p2+2]
        ];
        for(var i=0;i<position.count;i++)
            if(
                isSameLocation(
                    _p1,
                    _p2,
                    [position.array[3 * i],position.array[3 * i+1],position.array[3 * i+2]]
                )
            ){
                position.array[3 * i] = mid[0];
                position.array[3 * i + 1] = mid[1];
                position.array[3 * i + 2] = mid[2];
            }

        function notTriangle(a, b, c) {//判断a,b两点是否至少有一个和n位置相同
            if (position.array[3 * a] === position.array[3 * b]
                && position.array[3 * a + 1] === position.array[3 * b + 1]
                && position.array[3 * a + 2] === position.array[3 * b + 2])
                return true;
            if (position.array[3 * a] === position.array[3 * c]
                && position.array[3 * a + 1] === position.array[3 * c + 1]
                && position.array[3 * a + 2] === position.array[3 * c + 2])
                return true;
            if (position.array[3 * b] === position.array[3 * c]
                && position.array[3 * b + 1] === position.array[3 * c + 1]
                && position.array[3 * b + 2] === position.array[3 * c + 2])
                return true
            return false;
        }
        function isSameLocation(a, b, n) {//判断a,b两点是否至少有一个和n位置相同
            if (a[0] === n[0]
                && a[1] === n[1]
                && a[2] === n[2])
                return true;
            else if (b[0] === n[0]
                && b[1] === n[1]
                && b[2] === n[2])
                return true
            else return false;
        }


        /*for (var i = 0; i < index.count; i++)
            if (index.array[i] === p1) {
                //index.array[i]
                index.array[i] = p2;
                //position.array[3 * index.array[i]    ]=mid[0];
                //position.array[3 * index.array[i]+1  ]=mid[1];
                //position.array[3 * index.array[i]+2  ]=mid[2];
            }//index.array[i] = p2*/

        var needDeleteTriangle = 0;
        for (var i = 0; i < index.count / 3; i = i + 3) {
            if (
                notTriangle(index.array[i], index.array[i+1], index.array[i+2])
            )
                needDeleteTriangle++;
        }
        //console.log(needDeleteTriangle);//有两个三角形需要删除
        //如果一个三角形点有重合，则删除这个三角形
        var index2 = new THREE.InstancedBufferAttribute(new Uint16Array(index.count - needDeleteTriangle * 3), 1);//头部、上衣、裤子、动作
        var j = 0;
        for (var i = 0; i < index.count; i = i + 3)
            if (
                !notTriangle(index.array[i], index.array[i+1], index.array[i+2])
            ) {
                index2.array[j] = index.array[i];
                index2.array[j + 1] = index.array[i + 1];
                index2.array[j + 2] = index.array[i + 2];
                j = j + 3;
            }
        mesh.geometry.index = index2;

        return true;
    },
    deleteMeshPoint_Test1: function (mesh) {//将mesh中的p1点删除，对应为p2点//var p1=2;var p2=3;
        var geometry=mesh.geometry;
        var attributes=geometry.attributes;
        var position=attributes.position;//对于可视化操作似乎：只修改了index,而没有修改position
        var index = mesh.geometry.index;

        //if(this.isSkirt(mesh, p1, p2,p3))return ;//如果该边位于网格边缘，不进行collapse
        //for(var )
        var mid=[
            -10, -5, 0
        ];
        var _p1=[
            -10, -6, 0
        ];
        var _p2=[
            -10, -4, 0
        ];
        for(var is=[2,3,102,103],i=0;i<4;i++)
            {
                mesh.geometry.attributes.position.array[3 * is[i]] = mid[0];
                mesh.geometry.attributes.position.array[3 * is[i] + 1] = mid[1];
                mesh.geometry.attributes.position.array[3 * is[i] + 2] = mid[2];
            }

        /*console.log(//2
            mesh.geometry.attributes.position.array[3 * 2+1],
            mesh.geometry.attributes.position.array[3 * 3+1],
            mesh.geometry.attributes.position.array[3 * 102+1],
            mesh.geometry.attributes.position.array[3 * 103+1],
        );*/

        /*for (var i = 0; i < index.count; i++)
            if (index.array[i] === 2) {
                //index.array[i] = 3;//这里似乎对过程不可见的无影响，可见的有影响
            }//index.array[i] = p2*/

        //如果一个三角形点有重合，则删除这个三角形
        var index2 = new THREE.InstancedBufferAttribute(new Uint16Array(index.count - 3), 1);//头部、上衣、裤子、动作
        var position2 = new THREE.InstancedBufferAttribute(new Float32Array(position.count*3),3);//头部、上衣、裤子、动作

        var j = 0;
        for (var i = 0; i < index.count; i = i + 3)
            if (
                i!==6
            ) {
                index2.array[j] = index.array[i];
                index2.array[j + 1] = index.array[i + 1];
                index2.array[j + 2] = index.array[i + 2];
                j = j + 3;
            }//
        mesh.geometry.index = index2;


        //mesh.geometry.attributes.position=position2;
        return true;
    },
    updateIndex: function (mesh) {
        var index = mesh.geometry.index;
        var needDeleteTriangle = 0;
        //如果一个三角形3点有重合，则删除这个三角形
        var index2 = new THREE.InstancedBufferAttribute(new Uint16Array(index.count), 1);//头部、上衣、裤子、动作
        var j = 0;
        for (var i = 0; i < index2.count; i = i + 3) {
            index2.array[j] = index.array[i];
            index2.array[j + 1] = index.array[i + 1];
            index2.array[j + 2] = index.array[i + 2];
            j += 3;
        }
        mesh.geometry.index = index2;/**/
    },
    deleteMeshTriangle: function (mesh) {//将mesh中的p1点删除，对应为p2点
        var index = mesh.geometry.index;
        /*for(var i=0;i<index.count;i++)
                if(index.array[i]===p1)index.array[i]=p2;*/
        var needDeleteTriangle = 0;
        /*for(var i=0;i<index.count/3;i=i+3){
                if(index.array[i]===index.array[i+1]||
                    index.array[i]===index.array[i+2]||
                    index.array[i+1]===index.array[i+2])
                        needDeleteTriangle++;
        }*/
        //如果一个三角形3点有重合，则删除这个三角形
        var index2 = new THREE.InstancedBufferAttribute(new Uint16Array(index.count / 2 - needDeleteTriangle * 3), 1);//头部、上衣、裤子、动作
        var j = 0;
        for (var i = 0; i < index2.count; i = i + 6) {
            index2.array[j] = index.array[i];
            index2.array[j + 1] = index.array[i + 1];
            index2.array[j + 2] = index.array[i + 2];
            j += 3;
        }
        mesh.geometry.index = index2;/**/
    },

    //根据误差矩阵计算误差
    computeError:function(mesh,p1,p2){//p是position的下标，即index的值
        var errorMatrix=this.computeErrorMatrix(mesh,p1);
        var geometry=mesh.geometry;
        //var index = geometry.index;
        var pos1=[
            geometry.attributes.position.array[3 * p1],
            geometry.attributes.position.array[3 * p1+1],
            geometry.attributes.position.array[3 * p1+2]
        ];
        var pos2=[
            geometry.attributes.position.array[3 * p2],
            geometry.attributes.position.array[3 * p2+1],
            geometry.attributes.position.array[3 * p2+2]
        ];

        var x= (pos1[0]+pos2[0])/2;
        var y= (pos1[1]+pos2[1])/2;
        var z= (pos1[2]+pos2[2])/2;
        return (
            x*x*errorMatrix[0]+x*y*errorMatrix[4]+x*z*errorMatrix[8]+x*errorMatrix[12]+
            y*x*errorMatrix[1]+y*y*errorMatrix[5]+y*z*errorMatrix[9]+y*errorMatrix[13]+
            z*x*errorMatrix[2]+z*y*errorMatrix[6]+z*z*errorMatrix[10]+z*errorMatrix[14]+
            x  *errorMatrix[3]+y  *errorMatrix[7]+z  *errorMatrix[11]+1*errorMatrix[15]
        );
        //];
        /*var m = new THREE.Matrix4();
        m.elements =errorMatrix;
        var m2=m.clone();
        m2.transpose ();*/

    },
    //计算某个点的误差矩阵
    computeErrorMatrix:function (mesh,p) {//p是position的下标，即index的值
        var errorMatrix=[
            0,0,0,0,
            0,0,0,0,
            0,0,0,0,
            0,0,0,0
        ];
        /*
        0   4   8   12
        1   5   9   13
        2   6   10  14
        3   7   11  15
        */
        var geometry=mesh.geometry;
        var index = geometry.index;
        var attributes=geometry.attributes;
        var position=attributes.position;
        /*console.log(index,p);
        for (var i = 0; i < index.count ; i = i + 3){
            if(index.array[i]===p||index.array[i+1]===p||index.array[i+2]===p){
                console.log("*");
            }
        }*/
        for (var i = 0; i < index.count ; i = i + 3){
            if(
                positionSimilar(index.array[i], p)||
                positionSimilar(index.array[i+1], p)||
                positionSimilar(index.array[i+2], p)
            ){
                var i0=index.array[i],i1=index.array[i+1],i2=index.array[i+2];
                var pos0=[
                    geometry.attributes.position.array[3 * i0],
                    geometry.attributes.position.array[3 * i0+1],
                    geometry.attributes.position.array[3 * i0+2],
                ];
                var pos1=[
                    geometry.attributes.position.array[3 * i1],
                    geometry.attributes.position.array[3 * i1+1],
                    geometry.attributes.position.array[3 * i1+2],
                ];
                var pos2=[
                    geometry.attributes.position.array[3 * i2],
                    geometry.attributes.position.array[3 * i2+1],
                    geometry.attributes.position.array[3 * i2+2],
                ];
                /*console.log(pos1,pos2);
                var A=pos1[1]*pos2[2]-pos1[2]*pos2[1];
                var B=pos1[2]*pos2[0]-pos1[0]*pos2[2];
                var C=pos1[0]*pos2[1]-pos1[1]*pos2[0];
                var x=Math.pow((
                    Math.pow(A,2)+Math.pow(B,2)+Math.pow(C,2)
                ),0.5);
                A/=x;
                B/=x;
                C/=x;
                var D=-A*pos0[0]-B*pos0[1]-C*pos0[2];
                console.log(A,B,C,D);
                console.log(A*pos1[0]+B*pos1[1]+C*pos1[2]+D);
                console.log(A*pos2[0]+B*pos2[1]+C*pos2[2]+D);*/
                var A,B,C,D;
                [A,B,C,D]=computePlane(pos0,pos1,pos2);
                /*console.log(A,B,C,D);
                console.log(A*pos0[0]+B*pos0[1]+C*pos0[2]+D);
                console.log(A*pos1[0]+B*pos1[1]+C*pos1[2]+D);
                console.log(A*pos2[0]+B*pos2[1]+C*pos2[2]+D);*/

                errorMatrix=[
                    errorMatrix[ 0]+A*A,errorMatrix[ 1]+A*B,errorMatrix[ 2]+A*C,errorMatrix[ 3]+A*D,
                    errorMatrix[ 4]+B*A,errorMatrix[ 5]+B*B,errorMatrix[ 6]+B*C,errorMatrix[ 7]+B*D,
                    errorMatrix[ 8]+C*A,errorMatrix[ 9]+C*B,errorMatrix[10]+C*C,errorMatrix[11]+C*D,
                    errorMatrix[12]+D*A,errorMatrix[13]+D*B,errorMatrix[14]+D*C,errorMatrix[15]+D*D,
                ];
            }
        }
        return errorMatrix;

        function computePlane(p0,p1,p2){
            var a=(p1[1]-p0[1])*(p2[2]-p0[2])-(p1[2]-p0[2])*(p2[1]-p0[1]);
            var b=(p1[2]-p0[2])*(p2[0]-p0[0])-(p1[0]-p0[0])*(p2[2]-p0[2]);
            var c=(p1[0]-p0[0])*(p2[1]-p0[1])-(p1[1]-p0[1])*(p2[0]-p0[0]);
            var x=Math.pow((
                Math.pow(a,2)+Math.pow(b,2)+Math.pow(c,2)
            ),0.5);
            a/=x;
            b/=x;
            c/=x;
            var d=-a*p0[0]-b*p0[1]-c*p0[2];
            return [a,b,c,d];
        }
        function positionSimilar(v1, v2) {
            if (
                position.array[3 * v1] === position.array[3 * v2] &&
                position.array[3 * v1 + 1] === position.array[3 * v2 + 1] &&
                position.array[3 * v1 + 2] === position.array[3 * v2 + 2]
            ) return true;
            else return false;
        }
    },


    //简化索引index
    simplifyIndex:function (mesh) {
        var geometry=mesh.geometry;
        var attributes=geometry.attributes;
        var position=attributes.position;
        var index=geometry.index;
        for(var i=0;i<index.count;i++){
            var pos=index.array[i];
            for(j=0;j<position.count;j++)
                if(
                    position.array[3*j  ]===position.array[3*pos  ]&&
                    position.array[3*j+1]===position.array[3*pos+1]&&
                    position.array[3*j+2]===position.array[3*pos+2]
                ){
                    index.array[i]=j;//修改index
                    break;//使得index指向第一个
                }
        }
    },
}