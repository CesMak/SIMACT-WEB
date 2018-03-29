/**
 * Worker! 
 */

importScripts('libs/simact.bundle.js');

//worker.js
onmessage = function(matrices) { // calculation function
	var A = matrices.data['A'];
	var B = matrices.data['B'];
	var C = matrices.data['C'];
	var D = matrices.data['D'];
	var x_0 =matrices.data['x_0'];
	var sys = simact.calcSSys(A,B,C,D,x_0);
  postMessage(sys);
}