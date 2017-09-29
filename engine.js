/**
 * TODO: -read out symbolsinfo list and ersetze each symbol von simact
 * -get fnclist of simact!
 * funktionen mit dem inhalt des symbols!
 */

// possible input:
// checkHautusB("[[1,2],[2,3]]","[[1,2]]")
// A=[[1,2],[2,3]]
// A
function run(){
	  delete_storage();
	  var textToBeExecuted = document.getElementById("engine_area").value;
	  var lines = textToBeExecuted.split("\n");
	  var res = {};
	  var fnclist = simact.getfnclist();
	  for(var p =0;p<lines.length;p++){
		  tmp = lines[p];
		  if(!listcontains(tmp,["//","#"])){ // for comments ignore whole
												// line.
			  if(listcontains(tmp,fnclist)){ // simact function
				  console.log("simact "+tmp);
				  var str = "simact."+tmp;
				  res[tmp]=(eval(str));
			  }
			  else{ // algebrite
				  console.log("algebrite "+tmp);
				  res[tmp]=(simact.Algebrite.run(tmp));
				  if(listcontains(tmp,["="])){ // if line contains = add to
												// result!
					  simact.Algebrite.run(getsymbolOflineleft(tmp));
					  var a = simact.Algebrite.symbolsinfo().str;
					  res[tmp]=(a['last'].toString());
				  }
			  }
		  }

	  }
	  console.log(res);
	  printoutput(res);
	  filloutputarea();
}

// AA  = [[1,1]]; -> prints just AA
//gets the symbol of a line before =!
function getsymbolOflineleft(tmp){
	tmp = tmp.replace(/ /g,'');
	return tmp.substring(0,tmp.indexOf("="));
}

function listcontains(tmp,fnclist){
	for(var p=0;p<fnclist.length;p++){
		if(tmp.indexOf(fnclist[p])!==-1){
			return true;
		}
	}
	return false;
}

function filloutputarea(){
	var outputstr ="";
	  var a = simact.Algebrite.symbolsinfo().str;
	 // console.log(a);
	  var notoprintlist = ["autoexpand","trace","assumeRealVariables","version","i","trange","xrange","yrange","cross","curl","ln"];
	  for (var i in a){
		  if(i!=a[i] &&!listcontains(i,notoprintlist)){
			  outputstr+=i+": "+a[i].toString()+"\n";
		  }
	  }
	  document.getElementById('variables_area').value=outputstr;
}

// Res is a hashmap
function printoutput(res){
	deleteoldDivs();
	var p = 0;
	for (var i in res){
		var div = document.createElement("div");
		div.setAttribute('class', 'equation_small'); 
		div.setAttribute('id', p); 
		div.setAttribute('data-expr', i+"="+simact.Algebrite.run('printlatex('+res[i].toString()+')')); 
		//console.log(div);
		document.getElementById("output").appendChild(div);
		p++;
	  }
	myRenderer();
}

// delete the storage of Algebrite.
// print the result to the id
function delete_storage(){
	simact.Algebrite.run("clearall");
	filloutputarea();
}

function deleteoldDivs(){
	var element = document.getElementById("output");
	element.innerHTML = "";
	delete element;
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