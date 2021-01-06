function QEMSimplification(){
    
}
QEMSimplification.prototype={
    deleteMeshPoint:function(mesh,p1,p2){//将mesh中的p1点删除，对应为p2点
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
},
    updateIndex:function(mesh){
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
    },
    deleteMeshTriangle:function(mesh){//将mesh中的p1点删除，对应为p2点
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
},
}