function QEMSimplification(){

}

QEMSimplification.prototype = {
    //根据到相邻三角面的距离和
    findSuitablePoint2: function (mesh) {

        var geometry=mesh.geometry;
        var index = geometry.index;

        var pos0=[index.array[0],index.array[1]];
        var distance0=this.computeError(mesh,pos0[0],pos0[1]);
        for (var i = 1; i < index.count / 3; i = i + 3){
            var myDistance=this.computeError(mesh,index.array[i],index.array[i+1]);
            if(myDistance<distance0){
                distance0=myDistance;
                pos0=[index.array[i],index.array[i+1]];
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
    deleteMeshPoint: function (mesh, p1, p2) {//将mesh中的p1点删除，对应为p2点
        mesh.geometry.attributes.position.array[3 * p2]
            = (mesh.geometry.attributes.position.array[3 * p1] + mesh.geometry.attributes.position.array[3 * p2]) / 2;
        mesh.geometry.attributes.position.array[3 * p2 + 1]
            = (mesh.geometry.attributes.position.array[3 * p1 + 1] + mesh.geometry.attributes.position.array[3 * p2 + 1]) / 2;
        mesh.geometry.attributes.position.array[3 * p2 + 2]
            = (mesh.geometry.attributes.position.array[3 * p1 + 2] + mesh.geometry.attributes.position.array[3 * p2 + 2]) / 2;


        var index = mesh.geometry.index;
        for (var i = 0; i < index.count; i++)
            if (index.array[i] === p1) index.array[i] = p2;

        var needDeleteTriangle = 0;
        for (var i = 0; i < index.count / 3; i = i + 3) {
            if (index.array[i] === index.array[i + 1] ||
                index.array[i] === index.array[i + 2] ||
                index.array[i + 1] === index.array[i + 2])
                needDeleteTriangle++;
        }
        //console.log(needDeleteTriangle);//有两个三角形需要删除
        //如果一个三角形点有重合，则删除这个三角形
        var index2 = new THREE.InstancedBufferAttribute(new Uint16Array(index.count - needDeleteTriangle * 3), 1);//头部、上衣、裤子、动作
        var j = 0;
        for (var i = 0; i < index.count; i = i + 3)
            if (!(index.array[i] === index.array[i + 1] ||
                index.array[i] === index.array[i + 2] ||
                index.array[i + 1] === index.array[i + 2])) {
                index2.array[j] = index.array[i];
                index2.array[j + 1] = index.array[i + 1];
                index2.array[j + 2] = index.array[i + 2];
                j = j + 3;
            }
        mesh.geometry.index = index2;

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
        for (var i = 1; i < index.count / 3; i = i + 3){
            if(index[i]===p||index[i+1]===p||index[i+2]===p){
                var i0=index[i],i1=index[i+1],i2=index[i+2];
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

                errorMatrix=[
                    errorMatrix[ 0]+A*A,errorMatrix[ 1]+A*B,errorMatrix[ 2]+A*C,errorMatrix[ 3]+A*D,
                    errorMatrix[ 4]+B*A,errorMatrix[ 5]+B*B,errorMatrix[ 6]+B*C,errorMatrix[ 7]+B*D,
                    errorMatrix[ 8]+C*A,errorMatrix[ 9]+C*B,errorMatrix[10]+C*C,errorMatrix[11]+C*D,
                    errorMatrix[12]+D*A,errorMatrix[13]+D*B,errorMatrix[14]+D*C,errorMatrix[15]+D*D,
                ];
            }
        }
        return errorMatrix;
    }
}