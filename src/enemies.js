import * as THREE from 'three';
export class EnemySystem{
 constructor(scene,records,audio){
  this.scene=scene;this.records=records;this.audio=audio;this.ray=new THREE.Raycaster();
  this.materials={
   guard:new THREE.MeshStandardMaterial({color:0x25364f,metalness:.78,roughness:.25,emissive:0x50102b,emissiveIntensity:.65}),
   hunter:new THREE.MeshStandardMaterial({color:0x34284e,metalness:.8,roughness:.22,emissive:0x2812a0,emissiveIntensity:.8}),
   defender:new THREE.MeshStandardMaterial({color:0x503b2c,metalness:.82,roughness:.28,emissive:0x9a3a08,emissiveIntensity:.6}),
   boss:new THREE.MeshStandardMaterial({color:0x252c40,metalness:.9,roughness:.2,emissive:0x8b082d,emissiveIntensity:1.25})};
  this.dark=new THREE.MeshStandardMaterial({color:0x0a1220,metalness:.8,roughness:.3});
  for(const r of records){
   const big=r.kind==='boss',scale=big?1.45:1;
   r.group=new THREE.Group();
   const add=(geo,mat,x,y,z,sx=1,sy=1,sz=1)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=true;m.receiveShadow=true;r.group.add(m);return m};
   const armor=this.materials[r.kind];
   add(new THREE.CylinderGeometry(.24*scale,.3*scale,.22*scale,8),this.dark,0,.18,0);
   add(new THREE.BoxGeometry(.58*scale,.68*scale,.32*scale),armor,0,.78*scale,0);
   add(new THREE.BoxGeometry(.43*scale,.22*scale,.36*scale),this.dark,0,1.13*scale,-.015);
   add(new THREE.SphereGeometry(.2*scale,16,12),armor,0,1.34*scale,0,1,1.1,.9);
   const visorMat=new THREE.MeshBasicMaterial({color:big?0xff164e:r.kind==='hunter'?0x9b65ff:0x36efff});
   add(new THREE.BoxGeometry(.29*scale,.055*scale,.035*scale),visorMat,0,1.36*scale,-.18*scale);
   const glowMat=new THREE.MeshBasicMaterial({color:big?0xff204d:r.kind==='defender'?0xff812e:0x36eaff});
   add(new THREE.BoxGeometry(.13*scale,.13*scale,.035*scale),glowMat,0,.83*scale,-.18*scale);
   for(const side of [-1,1]){
    add(new THREE.BoxGeometry(.2*scale,.34*scale,.25*scale),armor,side*.39*scale,.88*scale,0,1,1,.9);
    add(new THREE.CylinderGeometry(.085*scale,.11*scale,.43*scale,8),this.dark,side*.19*scale,.36*scale,0);
    add(new THREE.BoxGeometry(.18*scale,.22*scale,.22*scale),armor,side*.19*scale,.08*scale,0);
    add(new THREE.BoxGeometry(.12*scale,.1*scale,.12*scale),glowMat,side*.19*scale,.35*scale,-.12*scale);
   }
   // segmented chest plates and shoulder insignia
   add(new THREE.BoxGeometry(.38*scale,.12*scale,.04*scale),glowMat,0,.98*scale,-.18*scale);
   for(const side of [-1,1])add(new THREE.BoxGeometry(.12*scale,.09*scale,.04*scale),this.dark,side*.18*scale,.65*scale,-.18*scale);
   r.body=r.group.children[1];r.group.position.set(r.x,0,r.z);scene.add(r.group);
   r.fireMesh=new THREE.Mesh(new THREE.SphereGeometry(.12,12,8),new THREE.MeshBasicMaterial({color:0xff4c67}));r.fireMesh.visible=false;scene.add(r.fireMesh);
  }
 }
 update(dt,player){for(const e of this.records){if(!e.alive)continue;const dx=player.pos.x-e.group.position.x,dz=player.pos.z-e.group.position.z,dist=Math.hypot(dx,dz);e.phase+=dt;const active=dist<23;if(active&&e.kind==='hunter'&&dist>2.6){e.group.position.x+=dx/(dist||1)*e.speed*dt;e.group.position.z+=dz/(dist||1)*e.speed*dt}else if(active&&e.kind!=='boss'){e.group.position.x+=Math.sin(e.phase*1.1)*e.speed*.25*dt;e.group.position.z+=Math.cos(e.phase*.8)*e.speed*.18*dt}
 e.group.position.y=Math.sin(e.phase*3)*.035;e.group.lookAt(player.pos.x,1,player.pos.z);
 if(active){e.attack-=dt;if(e.attack<=0&&dist<19){e.attack=e.kind==='boss'?1.1:e.kind==='defender'?2.3:1.8;const direction=new THREE.Vector3(dx,0,dz).normalize();const forward=new THREE.Vector3(0,0,-1).applyQuaternion(e.group.quaternion);if(forward.dot(direction)>.35){const damage=e.kind==='boss'?12:e.kind==='defender'?8:5;player.damage(damage);e.fireMesh.position.set(e.group.position.x,.8,e.group.position.z);e.fireMesh.visible=true;setTimeout(()=>{if(e.fireMesh)e.fireMesh.visible=false},100)}}}}
 }
 hit(raycaster){const targets=this.records.filter(e=>e.alive).flatMap(e=>e.group.children);const hits=raycaster.intersectObjects(targets,false);if(!hits.length)return null;const obj=hits[0].object,e=this.records.find(r=>r.group.children.includes(obj));if(!e)return null;e.hp-=e.kind==='boss'?20:35;e.body.material.emissiveIntensity=2.8;setTimeout(()=>{if(e.alive)e.body.material.emissiveIntensity=1.2},80);if(e.hp<=0){e.alive=false;this.scene.remove(e.group);this.scene.remove(e.fireMesh);return {killed:true,enemy:e}}return {killed:false,enemy:e}}
 dispose(){for(const e of this.records){this.scene.remove(e.group);this.scene.remove(e.fireMesh)}}
 get remaining(){return this.records.filter(e=>e.alive).length}
}