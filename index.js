/**
 * Control Theory index.js file of Markus Lamprecht
 * 2017.09.27 Copyright Markus Lamprecht 
 * 
 * Rules:
 * 1. Use this Documentation style: http://usejsdoc.org/
 */


var myWorker = new Worker('worker.js');
myWorker.onmessage = function(e) { // function is called when calc is done
	  sys = e.data;
	  console.log("Calculation finished!");

	  str2div("systemgleichung_werte1","{   \\underbrace{\\dot{{x}}(t)}_{"+sys['nA']+
			  " \\times 1}=\\underbrace{{"+str2latex(sys['A'])+"}}_{"+sys['nA']+" \\times "+sys['nB']+"} {x}(t) +\\underbrace{{"
			  +str2latex(sys['B'])+"}}_{"+sys['nB']+" \\times "+sys['mB']+"}  {u}(t) }");
	  str2div("systemgleichung_werte2"," {   \\underbrace{{y}(t)}_{"
			  +sys['nC']+" \\times 1}=\\underbrace{{"+str2latex(sys['C'])+"}}_{"
			  +sys['nC']+" \\times "+sys['nA']+"} {x}(t) \\textbf{ "+sys['som']+" SYSTEM} }");

	  str2div("stablility1","\\text{char. Poly.:}\\; \\; P(s)="
			  +str2latex(sys['charPoly']));
	  
	  str2div("stablility2","\\text{Eigenvalues:}\\; \\; \\lambda_i="+sys['eigA']);

	  str2div("stablility3","\\text{s-Sys is:}\\; \\; \\;"+sys['stability']);

	  // str2div("",);
	  
	  str2div("controlability","\\text{Controllability:}\\; \\; \\text{Sys is Kalman} \\;"+sys['isKS']+"");
	  
	  str2div("observability","\\text{Observability:}\\; \\; \\; \\text{Sys is Kalman} \\;"+sys['isBS']+"");

	  str2div("transfereopen1","G_O(s)="+str2latex(sys['transo']));

	  str2div("transfereopen2","G_O(s)="+str2latex(sys['transo'])
			  +"="+str2latex(sys['transoex']));
	  
	  str2div("controlability_tilde","Q_S="+str2latex(sys['Q_SK'])+"\\; Q_S^{-1}="
			  +str2latex(sys['iQ_SK'])+"\\; \\mathbf{\\tilde{q}}_S="+str2latex(sys['q_SK']));

	  str2div("observability_tilde","Q_B="+str2latex(sys['Q_BK'])+"\\; Q_B^{-1}="+str2latex(sys['iQ_BK'])
			  +"\\; \\mathbf{\\tilde{q}}_B="+str2latex(sys['q_BK']));
	  
	  str2div("trans3","T_{JNF}="+str2latex(sys['T_JNF'])
			  +"\\; \\; \\; T_{JNF}^{-1}="+str2latex(sys['iT_JNF']));
	  
	  str2div("trans4","\\dot{\\tilde{\\mathbf{x}}}_{JNF}(t)="+str2latex(sys['A_JNF'])+"\\mathbf{\\tilde{x}}_{JNF}(t) +"+str2latex(sys['B_JNF'])+"\\mathbf{u}(t)");

	  str2div("trans5","\\mathbf{y}(t)="+str2latex(sys['C_JNF'])+"\\mathbf{\\tilde{x}}_{JNF}(t)");

	  str2div("trans6","T_{SNF}="+str2latex(sys['T_SNF'])+"\\; \\; \\; T_{SNF}^{-1}="+str2latex(sys['iT_SNF']));

	  str2div("trans7","\\dot{\\tilde{\\mathbf{x}}}_{SNF}(t)="
			  +str2latex(sys['A_SNF'])+"\\mathbf{\\tilde{x}}_{SNF}(t) +"+str2latex(sys['B_SNF'])+"\\mathbf{u}(t)");

	  str2div("trans8","\\mathbf{y}(t)="+str2latex(sys['C_SNF'])+"\\mathbf{\\tilde{x}}_{SNF}(t)");

	  str2div("trans9","T_{BNF}="+str2latex(sys['T_BNF'])+"\\; \\; \\; T_{BNF}^{-1}="+str2latex(sys['iT_BNF']));
	  
	  str2div("trans10","\\dot{\\tilde{\\mathbf{x}}}_{BNF}(t)="+str2latex(sys['A_BNF'])
			  +"\\mathbf{\\tilde{x}}_{BNF}(t) +"+str2latex(sys['B_BNF'])+"\\mathbf{u}(t)");
	  
	  str2div("trans11","\\mathbf{y}(t)="+str2latex(sys['C_BNF'])+"\\mathbf{\\tilde{x}}_{BNF}(t)");

	  str2div("cont_gilbert1","\\mathbf{\\tilde{b}_{JNF}}="+str2latex(sys['B_JNF']));
	  
	  str2div("cont_gilbert2","\\rightarrow \\text{not controllable eigenvalues:} \\; \\;"+sys["gnc"]);

	  str2div("observ_gilbert2","\\rightarrow \\text{not observable eigenvalues:} \\; \\;"+sys["gno"])
	  
	  str2div("observ_gilbert1","\\mathbf{\\tilde{C}_{JNF}}="+str2latex(sys['C_JNF']));

	  //Hautus:
	  str2div("cont_hautus1","M_{SH}="+str2latex(sys['M_SH']));
	  str2div("cont_hautus2","\\text{not controllable eigenvalues:} \\; \\;"+sys['hnc']);
	  str2div("observ_hautus1","M_{BH}="+str2latex(sys['M_BH']));
	  str2div("observ_hautus2","\\text{not observable eigenvalues:} \\; \\;"+sys['hno']);
	  
	  //Results of Drawing:	  
	  str2div("time1","\\textbf{y}(t)=\\underbrace{\\textbf{C} e^{\\textbf{A} t} x_0}_{y_{E(t)}}+\\underbrace{\\int_0^t{\\textbf{C} e^{\\textbf{A}(t-\\tau)} \\textbf{Bu}(\\tau) d \\tau}}_{y_{E,A(t)}}");
	  str2div("time2","\\textbf{x}(t)="+str2latex(sys["eigensol"])+"+"+str2latex(sys["inoutsol"]));
	  str2div("time3","\\textbf{x}_1(x)="+str2latex(sys["states"][0])+"\\; \\; x_2(x)="+str2latex(sys["states"][1]));
	  str2div("transition1","e^{A*t}="+str2latex(sys["transitionA"]));
	  
	  draw2states(sys["states"]);
	  
	  
	  myRenderer();
}

function read_textarea() {
   var speicher={};

    var textArea = document.getElementById("textarea1");
    var lines = textArea.value.split("\n");

    for (var j = 0; j < (lines.length); j++) {
        var zeile = lines[j];
        if(zeile[0]!=null && zeile.length>1){
        	var left = zeile.substring(0,zeile.indexOf("="));
        	var right = ((zeile.substring(zeile.lastIndexOf("=") + 1, zeile.lastIndexOf(";"))));
           speicher[left] = right; 
        }
       
    }
    return speicher;
}

//run button pressed:
function run(){	
	var input=read_textarea();
	myWorker.postMessage(input); // start calculation
	console.log("Please wait some time this is hard!"); // show alert.
}

//next button pressed:
function next(){
	
}

function str2latex(inpstr){
	//TODO surround this with try catch! print inpstr if catch!
	return simact.Algebrite.run('printlatex('+inpstr+')');
}

function str2div(divname,str){
	try{
		document.getElementById(divname).setAttribute("data-expr", String.raw`${str}`);
	}
	catch(err){
		console.log(err);
		console.log(str);
	}
}


function myRenderer() {
    var x = document.getElementsByClassName('equation');

    // go through each of them in turn
    for (var i = 0; i < x.length; i++) {
        try {
            var aa = x[i].getAttribute("data-expr");
            if (x[i].tagName == "DIV") {
                t = katex.render(String.raw `${aa}`, x[i], {
                                     displayMode: false
                                 });
            }
            /*
			 * else { t= katex.render(x[i].textContent,x[i]); }
			 */
        } catch (err) {
            x[i].style.color = 'red';
            x[i].textContent = err;
        }
    }

    var y = document.getElementsByClassName('equation_small');

    // go through each of them in turn
    for (var i = 0; i < y.length; i++) {
        try {
            var aa = y[i].getAttribute("data-expr");
            if (y[i].tagName == "DIV") {
                t = katex.render(String.raw `${aa}`, y[i], {
                                     displayMode: false
                                 });
            }
            /*
			 * else { t= katex.render(x[i].textContent,x[i]); }
			 */
        } catch (err) {
            y[i].style.color = 'red';
            y[i].textContent = err;
        }
    }
}

// Drawing stuff:
function draw2states(functions){
	draw("#plot","Step response x_i",functions[0],functions[1]);
	//console.log(functions);
}

function draw(tt,title,fn1,fn2){
	try{
		functionPlot({
			  title: title,
			  target: tt,
			  width: 300,
			  height: 200,
			  fontsize:6,
			  disableZoom: false,
			  grid: true,
			  xAxis: {
			    label: 'x - axis',
			    domain: [0, 6]
			  },
			  yAxis: {
			    label: 'y - axis'
			  },
			  data: [
			    {fn: fn1},
			    {fn: fn2},
			  ],
			});
	}
	catch(err){
		console.log(err);
	}
}

