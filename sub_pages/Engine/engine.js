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
	  var hashmapWebpage = simact.getOpenWebpageHashMap();
	  var keys_inhashmap = [], i = 0;
	  for (keys_inhashmap[i++] in hashmapWebpage) {};
	  
	  for(var p =0;p<lines.length;p++){
		  tmp = lines[p];
		  tmp = tmp.replace(/ /g,''); //delete white spaces!
		  if(!listcontains(tmp,["//","#"])&&tmp.length!==0){ // for comments ignore whole
												// line.
			  if(listcontains(tmp, fnclist) || listcontains(tmp, keys_inhashmap) ){ // simact function
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
					  if(listcontains(tmp, keys_inhashmap)){ // for help ect. commands open a website!
						  window.open(hashmapWebpage[tmp], '_blank');
						  return;
					  }
					  var str = "simact."+(tmp); // TODO war vorher: +repldefinedsymbols(tmp)
					  console.log("simact_no=: "+str);
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




// AA  = [[1,1]]; -> prints just AA
//gets the symbol of a line before =!
function getsymbolOflineleft(tmp){
	tmp = tmp.replace(/ /g,'');
	return tmp.substring(0,tmp.indexOf("="));
}

//checkHautusB(A,"[[1,2]]") -> checkHautusB("[[1,2],[2,3]]","[[1,2]]")
//what for multiple inputs? checkHautusB(A,A)?
// TODO rewrite this function: in order to work for 
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


/**
 * the area to be played! used in engine_help page!
 * @param id
 * @returns
 */
function play(id){
	execute_text_area(id);
}

/**
 * 
 * @returns
 */
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


/**
 * get_most_inwards_method
 * @param {string} input_line - "plot(“x*x”, linspace(1,xend, 10))"
 * @return {string} ["arguments_as_str", "method_name", "arguments"] - ["(1,xend, 10)", "linspace", ["1", "xend", "10"]]
 */
function get_most_inwards_method(input_line){
	var pos_bracket_start = get_most_inwards_character(input_line);
	
	//dot(dot(A,B),dot(A,B),[[28,49],[16,28]]) 	backstring: (A,B),[[28,49],[16,28]])
	var back_string = input_line.substring(pos_bracket_start, input_line.length);
	var index = 0;
	var pos_bracket_end =0;
	for(var i =0;i<back_string.length;i++){
		if(back_string[i]=="(")
			index++;
		if(back_string[i]==")")
			index--;
		if(index==0 && back_string[i]==")"){
			pos_bracket_end=pos_bracket_start+i;
			break;
		}	
	}
	
	var arguments_innerst_method = input_line.substring(pos_bracket_start, pos_bracket_end+1);
	var arguments = get_arguments_of_method(arguments_innerst_method);

	var tmp = input_line.substring(0, pos_bracket_start);
	
	var pos_method_start_comma= get_most_inwards_character(tmp, ",");
	var pos_method_start_bracket = get_most_inwards_character(tmp, "(");
	var pos_method_start = 0;
	
	if(pos_method_start_bracket>pos_method_start_comma){
		pos_method_start = pos_method_start_bracket+1;
	}
	else if(pos_method_start_bracket<pos_method_start_comma){
		pos_method_start = pos_method_start_comma+1;
	}
	if(input_line.split("(").length==2 && (input_line.includes("=")) ){
		pos_method_start = get_most_inwards_character(tmp,"=")+1;
	}
	
	var method_name = tmp.substring(pos_method_start, tmp.length);
	method_name = method_name.replace(/ /g,''); // delete white spaces!
	method_name = method_name.replace("=",'');

	return [arguments_innerst_method, method_name, arguments]
}

/**
 * get_most_inwards_character
 * @param {string} input_line - "plot(“x*x”, linspace(1,xend, 10))"
 * @param {char} character -"("
 * @param {string} param - "last" or "first"
 * @returns {int} first or last index of found character
 */
function get_most_inwards_character(input_line, character="(", param="last"){
	var index = 0;
	var num_of_gaens = 0; // count number of " bzw. ' and ignore all ( within!
	for(var i = 0;i<input_line.length;i++){
		if(input_line[i]=="'" || input_line[i] =="\""){
			num_of_gaens=num_of_gaens+1
		}
		if(input_line[i]==character && param == "last" && (num_of_gaens%2==0)){
			index = i;
		}
		if(input_line[i]==character && param == "first"){
			index = i;
			return index;
		}
	}
	return index; // if not found remains 0	
}

/**
 * Get arguments of a string
 * Caution: if given: "([[1,1]], [[25 + b c,5 b + b d],[5 c + c d,b c + d^2]])"
 * @param {string} input_arg_str - "(1,xend, 10)"
 * @returns {array} arguments - ["1","xend", "10"]
 */
function get_arguments_of_method(input_arg_str){
	var input_arg_str = input_arg_str.substring(1,input_arg_str.length-1); // remove brackets!
	//
	if(input_arg_str.includes("[")){
	var pos_comma = 0;
	var index_open = 0;
	var res =[];
	var index = 0;
	for(var j = 0;j<input_arg_str.length; j++){
		if(input_arg_str[j]=="["){
			index_open=index_open+1;
		}
		if(input_arg_str[j]=="]"){
			index_open=index_open-1;
		}
		
		else if(input_arg_str[j]==","){
			pos_comma=j;
		}
		if(index_open==0 && input_arg_str[j]==","){
		 res[index]=input_arg_str.substring(0, pos_comma);
		 input_arg_str=input_arg_str.substring(pos_comma+1, input_arg_str.length);
		 pos_comma = 0;
		 j=-1;
		 index=index+1;
		}
	}
	res[index]=input_arg_str;
	return res;
	}
	else{
		return input_arg_str.split(',');
	}
}

/**
 * Replace an array of arguments with symbols list stored in Algebrite! 
 * @param {array} arg_arr - Array [ "A", "xend", " 10" ]
 * @returns {string} replaced argument - Array [ "[[1,0]]", "10", " 10" ]
 */
function replace_argument_with_local_storage(arg_array){
	var result_arr = arg_array;
	for(var l=0;l<arg_array.length; l++){
		argi_str = arg_array[l];
		var symbols_list = simact.Algebrite.symbolsinfo().str;
	    for (var i in symbols_list){
	    	if(i==argi_str && symbols_list[i]!=i){
	    		result_arr[l] = ""+symbols_list[i];
	    		break;
	    	}
	    }
	}
	return result_arr;
}

/**
 * Check if string is in array list 
 * @param tmp
 * @param fnclist
 * @returns
 */
function listcontains(tmp, fnclist){
	for(var p=0;p<fnclist.length;p++){
		if(tmp.indexOf(fnclist[p])!==-1){
			return true;
		}
	}
	return false;
}

/**
 * execute_method
 * @param {string} method_name - "linspace"
 * @param {array} arguments_list - Array ["1", "2", "0.001"]
 * @returns result of executed method as string
 */
function execute_method(method_name, arguments_list){
	// convert arguments list to (arg1, arg2,...) required for eval
	var arguments_str ="";
	for(var j in arguments_list){
		arguments_str=arguments_str+arguments_list[j]+",";
	}
	// delete last ,
	arguments_str = arguments_str.substring(0, arguments_str.length-1); 
	arguments_str = "("+arguments_str+")";
	
	var simact_fnc_list = simact.getfnclist();
	var algebrite_fnc_list = simact.get_algebrite_functionlist();
	
	var eval_str = method_name+arguments_str;
	
	// simact
	if(listcontains(method_name, simact_fnc_list)){
		console.log("execute simact function: "+eval_str);
		var string_tobe_executed="simact."+eval_str;
		return (eval(string_tobe_executed));
	}
	// algebrite method!
	else if (listcontains(method_name, algebrite_fnc_list)){
		console.log("execute algebrite function: "+eval_str);
		return simact.Algebrite.run(eval_str);
	}
	else{
		console.log("method "+method_name+" not known!");
		return "error";
	}
}

/**
 * Analyse input line
 * @param {string} input_str - "u=dot(dot(A,B),dot(A,B),dot(F,A));"
 * @param {int} param - this is just in case of errors that programm gets not stuck!
 * @returns {string} result of line: u=[[7,14],[4,8]];
 */
function analyse_input_line(input_str, param=10){
	
	// handle help call websites:
	var hashmapWebpage = simact.getOpenWebpageHashMap();
	var keys_inhashmap = [], i = 0;
	for (keys_inhashmap[i++] in hashmapWebpage) {};
	if(listcontains(input_str, keys_inhashmap)){
		 window.open(hashmapWebpage[input_str], '_blank');
		 return "\\text{open webpage}";
	}
	
	if(!input_str.includes("(")){ // no method handles lines like: A=[[2,3],[1,2]]
		return input_str;
	}
	
	var result=(get_most_inwards_method(input_str));
	var args_before = result[0];
	var method_name = result[1];
	var arguments = result[2];
	var arguments_replaced = replace_argument_with_local_storage(arguments);
	console.log(arguments_replaced);
	console.log(method_name);
	
	var method_result = execute_method(method_name, arguments_replaced);
	console.log(method_result);
	
	var to_be_replaced_str = method_name+args_before;
	input_str = input_str.replace(to_be_replaced_str, method_result);
	
	if(input_str.includes("(") && param>0){
		param=param-1
		return analyse_input_line(input_str,param);
	}
	else{
		return input_str;
	}
}

/**
 * 
 * @param input_line_str
 * @returns
 */
function parse_result_line(input_line_str){
   var contains_exclamation_point = false;
   var tmp = {};
   if(input_line_str.includes(";")){
	   contains_exclamation_point=true;
	   input_line_str=input_line_str.replace(";","");
   }
   
   if(input_line_str.includes("=")){
	   // store value in algebrite's storage:
	   tmp = input_line_str.split("=");
	   simact.Algebrite.run(tmp[0]+"="+tmp[1]);
   }
   else{
	   tmp[0]="ans";
	   tmp[1]=input_line_str;
	   simact.Algebrite.run(tmp[0]+"="+tmp[1]);
   }
   filloutputarea();//print whole local storage!
   
   if(!contains_exclamation_point){
	   console.log("print to latex")
	   console.log(tmp);
	   latex_output(tmp);
   }
}

/**
 * 
 * @param res
 * @returns
 */
function latex_output(res){
	var p = 0;
	output_latex="";
	if(res[1].includes(",") &&! res[1].includes("[")){ // e.g. method eigenvalue("[[1.789,0,0],[0,0,0],[0,0,1]]")
		arr_of_outputs = res[1].split(",");
		for(var i in arr_of_outputs){
			output_latex=output_latex+simact.Algebrite.run('printlatex('+arr_of_outputs[i].toString()+')')+"\\quad";
		}
	}
	else{
	output_latex = (simact.Algebrite.run('printlatex('+res[1].toString()+')'));
	}
	
	if(output_latex.length>1000){
		output_latex = "\\text{sry. output to huge parsing would cost too much time.}";
	}
	var div = document.createElement("div");
	div.setAttribute('class', 'equation_small'); 
	div.setAttribute('id', p);
	div.setAttribute('data-expr', res[0]+"="+output_latex); 
	document.getElementById("output").appendChild(div);
	p=p+1;
	myRenderer();
}

/**
 * 
 * @param id_of_area
 * @returns
 */
function execute_text_area(id_of_area){
	  var textToBeExecuted = document.getElementById(id_of_area.id).value;
	  var all_lines = textToBeExecuted.split("\n");
	  
	  for(var p =0;p<all_lines.length;p++){
		  one_line = all_lines[p];
		  one_line = one_line.replace(/ /g,''); //delete white spaces!
		  // for comments ignore whole
		  if(!listcontains(one_line, ["//","#"])&&one_line.length!==0){
			  parse_result_line(analyse_input_line(one_line))
		  }
	  }
}





function test(){
//	str = "(A,B,[[1, 2],1,165)"
//	console.log(get_arguments_of_method(str));
//	
//	var str = "u=dot(A,dot(a,b))";
//	console.log(get_most_inwards_method(str));
//	
	
//	var str = "u=dot(B,dot(A,B))";
//	var str1 = "u=dot(B,dot(A,dot(C,D)),dot(E,F))";
//	var str2 = "u=dot(A,B)";
//	var str3 = "u=dot(dot(A,B),dot(A,B))";
//	var str4 = "dot(dot(A,B),dot(A,B),[[28,49],[16,28]])"
//	console.log(get_most_inwards_method(str));
//	console.log(get_most_inwards_method(str1));
//	console.log(get_most_inwards_method(str2));
//	console.log(get_most_inwards_method(str3));
//	console.log(get_most_inwards_method(str4))
	
	simact.Algebrite.run("a=5");
	simact.Algebrite.run("xend=12");
	simact.Algebrite.run("a*b");
	simact.Algebrite.run("A=[[2,3],[1,2]]");
	simact.Algebrite.run("B=[[2,4],[1,2]]");
	simact.Algebrite.run("F=dot(A,B)");
	var str = "A=[[2,3],[1,2]]" // works NOT!
	var str1 = "u=dot(dot(A,B),dot(A,B),dot(F,A))" // works
	var str2 = "f=dot(A,B)" // works
	var str3 = "linspace(1,2,0.001)";
	var str4 = "plot('sin(x)')";
	console.log(parse_result_line(analyse_input_line(str4)));
//	console.log(parse_result_line(analyse_input_line(str2)));
//	console.log(parse_result_line(analyse_input_line(str3)));
//	console.log(parse_result_line(analyse_input_line(str2)));
	//TODO:
	// help functions clearall etc. work also?
	// 5*45+78 works yes.
	// clearall works
	// plot("x*x") works
	
}

