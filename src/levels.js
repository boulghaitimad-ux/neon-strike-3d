import * as THREE from 'three';
const neon=(color)=>new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:1.5,roughness:.35});
const solid=(color)=>new THREE.MeshStandardMaterial({color,metalness:.55,roughness:.5});
export function buildLevel(scene,index){
 const colliders=[],decor=[],enemies=[],checkpoints=[];
 const addBox=(x,y,z,w,h,d,mat,collision=true)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);if(collision)colliders.push({minX:x-w/2,maxX:x+w/2,minY:y-h/2,maxY:y+h/2,minZ:z-d/2,maxZ:z+d/2,mesh:m});return m};
 const floor=solid(index===1?0x101d36:0x10182b), trim=neon(index===2?0xff7b45:0x39dff5), dark=solid(0x0a1020);
 addBox(0,-.5,-15,34,1,100,floor);
 // edge rails and city silhouettes
 for(let z=-55;z<30;z+=8){for(const x of [-17,17]){addBox(x,2,z,.35,4,7,dark,false);addBox(x,1.3,z,.38,.08,7,trim,false)}}
 for(let i=0;i<18;i++){const x=(i%2?1:-1)*(19+(i%4)*3),z=-i*5-4,h=5+(i*7%11);addBox(x,h/2-.2,z,4,h,4,dark,false);addBox(x,h-.3,z,4,.08,4,trim,false)}
 const platforms=index===0?[
  [0,.1,-5,7,.3,5],[-5,1.3,-11,3,.35,3],[1,2.7,-17,3,.35,3],[6,1.2,-23,4,.35,4],[0,.1,-30,8,.3,5],[0,1.6,-38,4,.35,4]
 ]:index===1?[
  [0,.1,-5,7,.3,5],[-5,1.5,-11,3,.35,3],[1,3,-17,3,.35,3],[7,2,-23,4,.35,4],[1,3.6,-29,3,.35,3],[-5,2,-35,4,.35,4],[0,.1,-43,8,.3,5],[0,2,-51,4,.35,4]
 ]:[
  [0,.1,-5,7,.3,5],[-5,1.5,-11,3,.35,3],[1,3,-17,3,.35,3],[7,2,-23,4,.35,4],[1,3.6,-29,3,.35,3],[-5,2,-35,4,.35,4],[0,.1,-43,8,.3,5],[0,2,-51,4,.35,4],[5,3.5,-58,3,.35,3],[0,.1,-66,9,.3,7]
 ];
 for(const p of platforms){addBox(...p,floor);const [x,y,z,w,h,d]=p;addBox(x,y+h/2+.025,z,w,.05,d,trim,false)}
 // ramps built as visible angled blocks with collision bounds
 for(let i=0;i<(index===0?2:4);i++){const x=i%2?4:-4,z=-8-i*11;const ramp=addBox(x,.7,z,2.5,.22,5,solid(0x263451));ramp.rotation.x=-.12;addBox(x, .84,z,2.45,.04,4.9,trim,false)}
 const count=index===0?3:index===1?6:7;
 for(let i=0;i<count;i++){const z=-12-i*(index===0?8:7.5),x=[-5,4,0,7,-3,2,-7][i%7];enemies.push({x,y:1,z,kind:index===2&&i===count-1?'boss':i%3===0?'defender':i%2?'hunter':'guard',hp:index===2&&i===count-1?180:(i%3===0?70:40),maxHp:index===2&&i===count-1?180:(i%3===0?70:40),speed:i%2?.9:.45,phase:i*.9,attack:1.2+i*.25,alive:true})}
 // landmark at end
 addBox(0,2,-73,5,4,.7,dark,false);addBox(0,3.9,-73,4,.1,.1,trim,false);
 for(let i=0;i<8;i++){const a=i*Math.PI/4;const orb=new THREE.Mesh(new THREE.SphereGeometry(.09,8,6),trim);orb.position.set(Math.cos(a)*2,2+Math.sin(a)*2,-72.4);scene.add(orb);decor.push(orb)}
 checkpoints.push({x:0,z:-30,y:1});
 return {colliders,enemies,decor,checkpoints,spawn:{x:0,y:0,z:8},goalZ:-70,objective:index===2?'Neutraliza al comandante del núcleo':index===1?'Asegura la Ciudad Neón':'Elimina a los hostiles y alcanza la extracción'};
}