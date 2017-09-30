/**
 * TODO: -read out symbolsinfo list and ersetze each symbol von simact
 * -get fnclist of simact!
 * funktionen mit dem inhalt des symbols!
 */

// possible input:
// checkHautusB("[[1,2],[2,3]]","[[1,2]]")
// A=[[1,2],[2,3]]
// A
function run(id){
	  delete_storage();
	  var textToBeExecuted = document.getElementById(id.id).value;
	  var lines = textToBeExecuted.split("\n");
	  var res = {};
	  var fnclist = simact.getfnclist();
	  for(var p =0;p<lines.length;p++){
		  tmp = lines[p];
		  tmp = tmp.replace(/ /g,''); //delete white spaces!
		  if(!listcontains(tmp,["//","#"])&&tmp.length!==0){ // for comments ignore whole
												// line.
			  if(listcontains(tmp,fnclist)){ // simact function
				  if(listcontains(tmp,["="])){
					  //z.B: B=setMatValue("[[1,2],[2,3]]",1,0,12.232)
					  var justfnc=tmp.substring(tmp.indexOf("=")+1,tmp.length);
					  var str = "simact."+repldefinedsymbols(justfnc);
					  console.log(str);
					  res[tmp]=(eval(str));
					  //console.log(getsymbolOflineleft(tmp)+"="+ res[tmp]);
					  simact.Algebrite.run(getsymbolOflineleft(tmp)+"="+ res[tmp]);
					  simact.Algebrite.run(getsymbolOflineleft(tmp)); // <- print it! to last
				  }
				  else{
					  var str = "simact."+repldefinedsymbols(tmp);
					  console.log("simact "+str);
					  res[tmp]=(eval(str));  
				  }
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

//id: the area to be played!
function play(id){
	run(id);
}

// AA  = [[1,1]]; -> prints just AA
//gets the symbol of a line before =!
function getsymbolOflineleft(tmp){
	tmp = tmp.replace(/ /g,'');
	return tmp.substring(0,tmp.indexOf("="));
}

//checkHautusB(A,"[[1,2]]") -> checkHautusB("[[1,2],[2,3]]","[[1,2]]")
//what for multiple inputs? checkHautusB(A,A)?
function repldefinedsymbols(tmp){
	var a = simact.Algebrite.symbolsinfo().str;
	tmp = tmp.replace(/ /g,'');
	var tmp2 = tmp.substring(tmp.indexOf("(")+1,tmp.indexOf(")"));
	var tt = tmp2;
	var tmp3=tmp2;
    for (var i in a){
   	  if(tmp3.indexOf(i)!==-1){
   		  tmp3=tmp2.replace(i,"\""+a[i]+"\"");
   		  tmp2=tmp3;
   		  }
    }
  return tmp.replace(tt,tmp2);
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
		if(typeof(res[i])=="object" &&!listcontains(res[i].toString(),["[["])){//for arrays e.g: eigenvalue("[[1.789,0,0],[0,0,0],[0,0,1]]")
			var arr=res[i];
			var tmp ="";
			for(var u=0;u<arr.length;u++){
				if(u<arr.length-1){
					tmp+=arr[u].toString()+" ,";
				}
				else{
					tmp+=arr[u].toString();
				}
			}
			div.setAttribute('data-expr', i+"="+tmp); 
		}
		else{
			div.setAttribute('data-expr', i+"="+simact.Algebrite.run('printlatex('+res[i].toString()+')')); 
		}
		//console.log(div); important if you want to copy that to engine.html
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
            aa = aa.replace(/−/g, '-'); //damit latex - zu richtigem minus wird!
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