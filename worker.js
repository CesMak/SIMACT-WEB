/**
 * Worker! 
 */

importScripts('libs/simact.bundle.js');

//worker.js
onmessage = function(matrices) { // calculation function
	var A = matrices.data[0];
	var B = matrices.data[1];
	var C = matrices.data[2];
	var sys = simact.calcSSys(A,B,C);
  postMessage(sys);
}