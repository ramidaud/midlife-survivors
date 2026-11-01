// Native pixel geometry for the approved Clocking Out brand direction.
// Offline asset export, no build step or runtime dependency for the game.
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let root=CommandLine.arguments[1]
let colors:[String:[UInt8]]=["n":[23,28,53],"t":[62,119,117],"s":[131,168,154],"c":[242,215,161],"w":[255,240,207],"k":[211,183,141],"o":[239,147,71]]
var grid=Array(repeating:Array(repeating:"",count:16),count:16)
func span(_ y:Int,_ a:Int,_ b:Int,_ color:String){for x in a...b{grid[y][x]=color}}
let outer=[5,3,2,1,0,0,0,0,0,0,0,0,1,2,3,5]
for y in 0..<16{span(y,outer[y],15-outer[y],"n")}
for y in 1...14{let left=[5,3,2,1,1,1,1,1,1,1,1,2,3,5][y-1];span(y,left,15-left,"t")}
for y in 3...12{let left=[5,3,3,2,2,2,2,3,3,5][y-3];span(y,left,15-left,"c")}
span(3,5,10,"w");span(4,3,9,"w")
span(11,10,11,"k");span(12,8,10,"k")
span(2,5,9,"s");grid[3][3]="s";grid[4][2]="s"
// Four hour markers and two distinct hands, with a single orange accent.
grid[4][7]="n";grid[5][7]="n"
grid[11][7]="n";grid[11][8]="n"
grid[7][3]="n";grid[8][3]="n"
grid[7][12]="o";grid[8][12]="o"
for (x,y) in [(5,5),(5,6),(6,6),(6,7),(7,7),(7,8),(8,8),(8,7),(9,7),(9,6),(10,6),(10,5)]{grid[y][x]="n"}

var svg="<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 16 16\" width=\"32\" height=\"32\" shape-rendering=\"crispEdges\"><title>Clocking Out</title>"
for y in 0..<16{var x=0;while x<16{let c=grid[y][x];if c.isEmpty{x+=1;continue};var end=x+1;while end<16 && grid[y][end]==c{end+=1};let rgb=colors[c]!;let hex=rgb.map{String(format:"%02X",$0)}.joined();svg+="<path fill=\"#\(hex)\" d=\"M\(x) \(y)h\(end-x)v1H\(x)z\"/>";x=end}}
svg+="</svg>\n"
try svg.write(toFile:root+"/clock-mark-v1.svg",atomically:true,encoding:.utf8)
func export(_ size:Int,_ name:String,_ touch:Bool=false){
 var bytes=[UInt8](repeating:0,count:size*size*4)
 let scale=touch ? 8 : size/16,offset=touch ? (size-16*scale)/2 : 0
 for y in 0..<size{for x in 0..<size{
  let i=(y*size+x)*4
  if touch{bytes[i]=23;bytes[i+1]=28;bytes[i+2]=53;bytes[i+3]=255}
  let gx=(x-offset)/scale,gy=(y-offset)/scale
  if x<offset || y<offset || gx<0 || gy<0 || gx>=16 || gy>=16{continue}
  let color=grid[gy][gx];if color.isEmpty{continue}
  for k in 0..<3{bytes[i+k]=colors[color]![k]};bytes[i+3]=255
 }}
 let data=Data(bytes) as CFData
 let info=CGBitmapInfo.byteOrder32Big.rawValue|CGImageAlphaInfo.premultipliedLast.rawValue
 let image=CGImage(width:size,height:size,bitsPerComponent:8,bitsPerPixel:32,bytesPerRow:size*4,space:CGColorSpaceCreateDeviceRGB(),bitmapInfo:CGBitmapInfo(rawValue:info),provider:CGDataProvider(data:data)!,decode:nil,shouldInterpolate:false,intent:.defaultIntent)!
 let out=CGImageDestinationCreateWithURL(URL(fileURLWithPath:root+"/"+name) as CFURL,UTType.png.identifier as CFString,1,nil)!
 CGImageDestinationAddImage(out,image,nil);precondition(CGImageDestinationFinalize(out))
 print("Exported \(name): \(size)x\(size)")
}
export(16,"clock-16-v1.png");export(32,"clock-32-v1.png");export(64,"clock-64-v1.png");export(180,"clock-touch-180-v1.png",true)
