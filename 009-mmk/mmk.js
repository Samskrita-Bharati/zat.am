var secs=0;
var numberOfWrongTries=0;
matchesdone=0;
var timer;
triesElement=document.getElementById("nowt");
const urlParams = new URLSearchParams(window.location.search);
var o = urlParams.get('o');
if (!o) // open mode - 1 is true - not flipped
	o=0;
var set = urlParams.get('s');
if (!set || isNaN(set) || (set>=wlist.length))
	set=0;
var l = urlParams.get('l'); // learn mode - 1 is true
if (!l)
	l=0;
var t = urlParams.get('t'); // transliterate mode - 1 is true
if (!t)
	t=0;
if (l==1)
{
	document.getElementById("ss").style.display="inline-block";
	document.getElementById("pr").style.display="none";
	document.getElementById("wm").style.display="none";
	}
function countSecs(elem) {
	//console.log(secs);
	var element = document.getElementById(elem);
	element.innerHTML = "Time: " + Sanscript.t(String(secs),'iast', 'devanagari') + " seconds";
	secs++;

}
     // end of timer code
      function restart()
      {
      location.reload();
      }


       var rowLength = 4;//prompt("Please enter number of rows (must not exceed 6) \n NOTE THAT : the multiplier of row and columns must be even number for the game to work");
       var colLength = 6;//prompt("Please enter number of columns (must not exceed 6) \n NOTE THAT : the multiplier of row and columns must be even number for the game to work");
       var gamesize = rowLength*colLength;
       var height= 570/rowLength;
       var width = 900/colLength;
	   width = document.documentElement.offsetWidth/6; //8;
	   height = document.documentElement.offsetHeight/2; //3;
	   width=150;
	   height=120;
	   if (l!=1)
	 	timer = setInterval('countSecs("timer")',1000); //1000ms to wait before executing the code =1 second  
       //countSecs("timer");

function code(){
		  
var temp = []
var waiting = {value: false};
var image = ilist[parseInt(set)];
var words=wlist[parseInt(set)];
var D1Data = [];          // D1Data has duplicated image objects.
var D2Data = [];
var count=0;
for(var x = 0; x < gamesize/2; x++){
  D1Data.push( {src: image[x], clicked: false} );
  D1Data.push( {src: image[x], clicked: false, wrd: words[x]} );
}

for(var x = 0; x < D1Data.length; x++){
  //console.log('index: ' + x + ' ' + D1Data[x].src)
}
 var rand=0;
// fill D2Data 2D array. (2D array is a group 1D arrays)
    for(var y = 0; y<rowLength; y++){ 
        var temp = [];
        var x = 0;

        while(x < colLength)  
        {
		if (l!=1){	
           rand = Math.floor(Math.random() * D1Data.length );
			
          temp.push(D1Data[rand]);
          temp[x].y = x;
          temp[x].x = y;
		        D1Data.splice(rand, 1)
		}
		else
		{

			temp.push(D1Data[rand]);
			rand+=1;
		}
          //console.log('iteration: ' + y +' removed at index: ' + rand);

          x++;
        }
        D2Data.push(temp);

      }

// functions and variables
var faceUp = 0;
var clickedCards = [];
var bg = '../शत.म्.png'

function genTable(rowLength, colLength, imageData2D)
{
	
    var table = document.createElement("TABLE");
    table.id = 'tbl';
    var myTableDiv = document.getElementById("mytable");

    for (var i = 0; i < rowLength; i++)
        {
            var tr = document.createElement("TR");
            table.appendChild(tr);
    for (var j = 0; j < colLength; j++)
        {
            var td = document.createElement("TD");
            tr.appendChild(td);
			if (!imageData2D[i][j].wrd)
			{
            var img = document.createElement("img");
            if (o!=1) 
				img.src = '../शत.म्.png';
			else
				img.src = imageData2D[i][j].src;
            img.height=height;
            img.width=width;
            td.appendChild(img);
			}
			else
			{
var p = document.createElement("p");

			p.className="myp";
			p.innerHTML=imageData2D[i][j].wrd;
			if (t==1) p.innerHTML+= " - " + Sanscript.t(imageData2D[i][j].wrd, 'devanagari','itrans');
            td.appendChild(p);
			}
        }
        }
        myTableDiv.appendChild(table);
}

genTable(rowLength, colLength, D2Data); // generate table..
	
	var clkfn = function(){    // THE ONCLICK EVENT FOR ALL IMAGES.

    var row = this.parentElement.parentElement.rowIndex;
    var column = this.parentElement.cellIndex;
          if(!D2Data[row][column].clicked && !waiting.value) {
          if(clickedCards.length == 0){            // if it is the only card, add it to clickedCards, set clicked to true, set background
            this.src = D2Data[row][column].src;
              this.height=height;
              this.width=width;
            D2Data[row][column].clicked = true;
            clickedCards.push(D2Data[row][column]);
			d=document.getElementsByTagName("tr")[clickedCards[0].x];
			r=d.getElementsByTagName("td")[clickedCards[0].y];
			r.style.border="2px dashed red";
          }
          else{        // compare card to one in the list..
            //console.log('comparing to one in the lisst')
            if(D2Data[row][column].src === clickedCards[0].src){    // if it matches..
			d=document.getElementsByTagName("tr")[clickedCards[0].x];
			r=d.getElementsByTagName("td")[clickedCards[0].y];
			r.style.border="3px solid blue";
			r.style.cursor="no-drop";
			r.style.color="blue";
			r.innerHTML+="✔️";
			matchesdone++;
			document.getElementById("pr").value=matchesdone;
            //console.log('match')
			this.parentElement.style.border="3px solid blue";
			this.parentElement.style.cursor="no-drop";
			this.style.color="blue";
			this.innerHTML+="✔️";
            this.src = D2Data[row][column].src
            D2Data[row][column].clicked = true;
            clickedCards = [];  // empty the matrix.
                count+=2;
                //console.log(count);
                if(count==gamesize)
                    {
                        window.alert("उत्तमम् ! You Won in "+ Sanscript.t(String(secs),'iast', 'devanagari') + " seconds while making " + Sanscript.t(String(numberOfWrongTries),'iast', 'devanagari') + " wrong moves");
						clearTimeout(timer); //stop timer function
                        var ask=confirm("पुनः ? Press 'ok' to play again");
                        if (ask){
                        restart();
                        }
                     }
            }
            else{             // not a match.
            numberOfWrongTries+=1;
			triesElement.innerHTML = Sanscript.t(String(numberOfWrongTries),'iast', 'devanagari');
            //this.src = bg;
            this.src = D2Data[row][column].src; // show picture of card u just clicked
            D2Data[row][column].clicked = true; // new
            waiting.value = true; //
			d=document.getElementsByTagName("tr")[clickedCards[0].x];
			r=d.getElementsByTagName("td")[clickedCards[0].y];
			r.style.border="1px solid blue";
            setTimeout(flipback , 700, row, column, this, clickedCards,waiting, D2Data)
            }
          }
      }
    }	;
	if (l!=1){
  var list = document.getElementsByTagName("img");
  for(var i =0; i< list.length; i++){
    list[i].onclick= clkfn;
	}
	var plist = document.getElementsByClassName("myp");
  for(var i =0; i< plist.length; i++){
    plist[i].onclick= clkfn;
	}
	}
  function flipback(row, column, This, clickedCards,waiting, D2Data){  // flip both cards back to facedown

  This.src = bg;   // flip this to bg
  document.getElementById('tbl').rows[clickedCards[0].x].cells[clickedCards[0].y].firstElementChild.src = bg;   // flip the one in clickedCards

  // clicked is false in both.
  clickedCards[0].clicked = false;
  D2Data[row][column].clicked = false;

  waiting.value = false;
  clickedCards.splice(0,1);
}
}
code();