import * as THREE from 'three';
import {resolveHorizontal} from './physics.js';
export class Player{
 constructor(camera,colliders,audio){this.camera=camera;this.colliders=colliders;this.audio=audio;this.pos=new THREE.Vector3(0,1.7,8);this.vel=new THREE.Vector3();this.health=100;this.onGround=false;this.yaw=0;this.pitch=0;this.radius=.34;this.bob=0;this.recoil=0;this.keys={};this.mouseDown=false;this.dead=false}
 reset(spawn){this.pos.set(spawn.x,spawn.y+1.7,spawn.z);this.vel.set(0,0,0);this.health=100;this.dead=false;this.yaw=0;this.pitch=0;this.camera.rotation.set(0,0,0)}
 look(dx,dy){this.yaw-=dx*.0022;this.pitch-=dy*.0022;this.pitch=Math.max(-1.45,Math.min(1.45,this.pitch))}
 update(dt){if(this.dead)return;const k=this.keys,forward=(k.KeyW?1:0)-(k.KeyS?1:0),side=(k.KeyD?1:0)-(k.KeyA?1:0);const sprint=k.ShiftLeft||k.ShiftRight;let speed=sprint?10.5:7;const mag=Math.hypot(forward,side)||1;const dx=(Math.sin(this.yaw)*forward+Math.cos(this.yaw)*side)/mag*speed*dt;const dz=(-Math.cos(this.yaw)*forward+Math.sin(this.yaw)*side)/mag*speed*dt;resolveHorizontal(this.pos,this.radius,this.colliders,'x',dx);resolveHorizontal(this.pos,this.radius,this.colliders,'z',dz);
 this.vel.y-=22*dt;this.pos.y+=this.vel.y*dt;this.onGround=false;
 for(const c of this.colliders){if(this.pos.x+this.radius>c.minX&&this.pos.x-this.radius<c.maxX&&this.pos.z+this.radius>c.minZ&&this.pos.z-this.radius<c.maxZ){const feet=this.pos.y-1.7;if(this.vel.y<=0&&feet>=c.maxY-.3&&feet<=c.maxY+.4){this.pos.y=c.maxY+1.7;this.vel.y=0;this.onGround=true}}}
 if(this.pos.y< -14){this.health-=25;this.pos.set(0,5,8);this.vel.set(0,0,0);window.dispatchEvent(new CustomEvent('neon-toast',{detail:'REPOSICIONAMIENTO DE EMERGENCIA'}));if(this.health<=0)this.dead=true}
 this.bob+=dt*(forward||side? sprint?17:11:2);this.recoil=Math.max(0,this.recoil-dt*3.5);this.camera.position.copy(this.pos);this.camera.rotation.order='YXZ';this.camera.rotation.y=this.yaw;this.camera.rotation.x=this.pitch+this.recoil;this.camera.rotation.z=(forward||side)?Math.sin(this.bob)*.006:0;
 }
 jump(){if(this.onGround&&!this.dead){this.vel.y=8.5;this.onGround=false;this.audio.jump()}}
 damage(n){this.health=Math.max(0,this.health-n);this.audio.hurt();window.dispatchEvent(new Event('neon-hit'));if(this.health<=0)this.dead=true}
}
