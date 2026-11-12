const fs=require('fs'),z=require('zlib');
const dir=process.argv[2],src=fs.readFileSync(dir+'/source-generated.png');
const w=src.readUInt32BE(16),h=src.readUInt32BE(20),chunks=[];
if(src[24]!==8||src[25]!==6||src[28]!==0)throw Error('Expected noninterlaced RGBA8');
for(let p=8;p<src.length;){const n=src.readUInt32BE(p),type=src.toString('ascii',p+4,p+8);if(type==='IDAT')chunks.push(src.subarray(p+8,p+8+n));p+=n+12;}
const raw=z.inflateSync(Buffer.concat(chunks)),pixels=Buffer.alloc(w*h*4),stride=w*4;
function paeth(a,b,c){let p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);return pa<=pb&&pa<=pc?a:pb<=pc?b:c;}
for(let y=0;y<h;y++){let f=raw[y*(stride+1)];for(let x=0;x<stride;x++){let i=y*stride+x,a=x>=4?pixels[i-4]:0,b=y?pixels[i-stride]:0,c=y&&x>=4?pixels[i-stride-4]:0;let pred=[0,a,b,Math.floor((a+b)/2),paeth(a,b,c)][f];if(pred===undefined)throw Error('Bad filter');pixels[i]=(raw[y*(stride+1)+1+x]+pred)&255;}}
function resize(p,sw,sh,dw,dh){let d=Buffer.alloc(dw*dh*4);for(let y=0;y<dh;y++)for(let x=0;x<dw;x++){let si=(Math.min(sh-1,Math.floor((y+.5)*sh/dh))*sw+Math.min(sw-1,Math.floor((x+.5)*sw/dw)))*4;p.copy(d,(y*dw+x)*4,si,si+4);}return d;}
function crc32(b){let c=0xffffffff;for(let v of b){c^=v;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^0xffffffff)>>>0;}
function chunk(type,data){let t=Buffer.from(type),b=Buffer.alloc(data.length+12);b.writeUInt32BE(data.length);t.copy(b,4);data.copy(b,8);b.writeUInt32BE(crc32(Buffer.concat([t,data])),data.length+8);return b;}
function save(name,p,width,height){let header=Buffer.alloc(13);header.writeUInt32BE(width);header.writeUInt32BE(height,4);header[8]=8;header[9]=6;let scan=Buffer.alloc(height*(width*4+1));for(let y=0;y<height;y++)p.copy(scan,y*(width*4+1)+1,y*width*4,(y+1)*width*4);fs.writeFileSync(dir+'/'+name,Buffer.concat([src.subarray(0,8),chunk('IHDR',header),chunk('IDAT',z.deflateSync(scan)),chunk('IEND',Buffer.alloc(0))]));}
const native=resize(pixels,w,h,56,60);
const hex={navy:'171C35',slate:'303750',grey:'526078',teal:'3E7775',khaki:'D3B78D',khakiShadow:'A88B70',cream:'FFF0CF',creamShadow:'F2D7A1',russet:'874C3B',red:'C45C4B',orange:'EF9347',skin:'E5A995',hair:'B97A58',brown:'70402F'};
const pal=Object.fromEntries(Object.entries(hex).map(([k,v])=>[k,Buffer.from(v,'hex')]));
const materials={};
for(let y=0;y<60;y++)for(let x=0;x<56;x++){
 let i=(y*56+x)*4,r=native[i],g=native[i+1],b=native[i+2];
 if(native[i+3]<128){native.fill(0,i,i+4);continue;}
 let family,material;
 if(g>r*1.25&&b>r*1.25&&g>65){family=['teal'];material='pens';}
 else if(b>=r-12 && r<170){family=r<65?['navy']:['grey'];material='outline-or-grey';}
 else if(g>185&&r-g<65&&y<43){family=['cream','creamShadow'];material='shirt-or-lens';}
 else if(y<22 && r<200 && g<150){family=['hair','brown'];material='hair';}
 else if((y>=14&&y<=29)||(y>=31&&y<=44&&((x<12)||(x>=18&&x<=20)||(x>=36)))){family=['skin','khakiShadow'];material='skin';}
 else if(x>=11&&x<=18&&y>=31&&y<=40){family=['orange','brown'];material='mug';}
 else if(x>=24&&x<=33&&y>=31&&y<=44&&r>g*1.25){family=['red','russet'];material='tie';}
 else if(y>=51){family=r>200&&g>180?['cream']:['russet','brown'];material='loafers';}
 else if(y>=42){family=['khaki','khakiShadow'];material='slacks';}
 else if(y>=39&&y<=42&&r<180){family=['brown'];material='belt';}
 else if(y<22){family=['hair','brown'];material='hair';}
 else{family=['cream','creamShadow','khakiShadow'];material='shirt';}
 let selected=family[0],distance=Infinity;
 for(let k of family){let p=pal[k],d=(r-p[0])**2+(g-p[1])**2+(b-p[2])**2;if(d<distance){selected=k;distance=d;}}
 pal[selected].copy(native,i);native[i+3]=255;materials[material]=(materials[material]||0)+1;
}
// Rami's three approved detail edits, Nov 11. All coordinates are native pixels.
// Restrict edits to the pocket, two under-nose pixels and a one-pixel handle.
function put(x,y,color){let i=(y*56+x)*4;Buffer.from(color,'hex').copy(native,i);native[i+3]=255;}
for(let [x,y] of [[30,32],[31,32],[30,35],[30,36],[30,37],[31,37],[32,37],[33,37]])put(x,y,hex.cream);
for(let x of [31,33])for(let y of [32,33,34])put(x,y,hex.teal);
for(let x of [25,26])put(x,26,hex.skin);
for(let [x,y] of [[9,33],[10,33],[8,34],[8,35],[8,36],[9,37],[10,37]])put(x,y,hex.orange);
save('office-worker-native-pose-v2.png',native,56,60);save('office-worker-native-pose-v2-8x.png',resize(native,56,60,448,480),448,480);
const board=Buffer.alloc(720*560*4);for(let i=0;i<board.length;i+=4){board[i]=48;board[i+1]=55;board[i+2]=80;board[i+3]=255;}
for(let [ox,oy,s] of [[24,250,1],[110,220,2],[248,40,8]]){let p=resize(native,56,60,56*s,60*s);for(let y=0;y<60*s;y++)for(let x=0;x<56*s;x++){let si=(y*56*s+x)*4,di=((oy+y)*720+ox+x)*4,a=p[si+3]/255;for(let c=0;c<3;c++)board[di+c]=Math.round(p[si+c]*a+board[di+c]*(1-a));}}
save('office-worker-native-pose-v2-review.png',board,720,560);
let colors=new Set(),alphas=new Set(),occupied=0;for(let i=0;i<native.length;i+=4){alphas.add(native[i+3]);if(native[i+3]){occupied++;colors.add(native.subarray(i,i+3).toString('hex'));}}
let allowed=new Set(Object.values(hex).map(v=>v.toLowerCase()));
let r={width:56,height:60,sourceWidth:w,sourceHeight:h,export:'nearest neighbor; explicit spatial/color material families, then nearest shade within each family; alpha threshold 128',visibleColors:colors.size,alphaValues:[...alphas].sort((a,b)=>a-b),occupiedPixels:occupied,offPalette:[...colors].filter(c=>!allowed.has(c)),materials,status:'single review pose, not integrated'};if(r.offPalette.length||[...alphas].some(a=>a!==0&&a!==255))throw Error('Palette/alpha validation failed');fs.writeFileSync(dir+'/native-export-checks.json',JSON.stringify(r,null,2));console.log(r);
