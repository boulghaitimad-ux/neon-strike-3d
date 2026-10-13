export function overlaps(a,b,pad=0){return a.minX < b.maxX-pad && a.maxX > b.minX+pad && a.minZ < b.maxZ-pad && a.maxZ > b.minZ+pad;}
export function boxBounds(x,y,z,w,h,d){return {minX:x-w/2,maxX:x+w/2,minY:y-h/2,maxY:y+h/2,minZ:z-d/2,maxZ:z+d/2};}
export function resolveHorizontal(pos, radius, colliders, axis, delta){
  pos[axis]+=delta;
  for(const c of colliders){
    if(pos.y < c.minY-0.1 || pos.y > c.maxY+1.5) continue;
    const px=pos.x, pz=pos.z;
    const nearestX=Math.max(c.minX,Math.min(px,c.maxX)), nearestZ=Math.max(c.minZ,Math.min(pz,c.maxZ));
    const dx=px-nearestX,dz=pz-nearestZ;
    if(dx*dx+dz*dz<radius*radius){
      if(axis==='x')pos.x=delta>0?c.minX-radius:c.maxX+radius;
      else pos.z=delta>0?c.minZ-radius:c.maxZ+radius;
    }
  }
}
