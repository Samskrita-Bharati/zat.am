const urlParams = new URLSearchParams(window.location.search);
var set = urlParams.get('s');
if (!set || isNaN(set) || set>=wlist.length)
	set=0;
var t = urlParams.get('t');
if (!t || isNaN(t))
	t=1;
var h = urlParams.get('h');
if (!h || isNaN(h))
	h=1;
var imgs = ilist[parseInt(set)];
var words=wlist[parseInt(set)];

$(function(){
	
	$('#btn-top-next').click( topNext );
	$('#btn-top-prev').click( topPrev );
	$('#btn-mid-next').click( midNext );
	$('#btn-mid-prev').click( midPrev );
	$('#btn-bottom-next').click( bottomNext );
	$('#btn-bottom-prev').click( bottomPrev );
	$('#random-button').click( randomEC );
	
	$('#btn-1').click( function(){ selectEC(1, this) } );
	$('#btn-2').click( function(){ selectEC(2, this) } );
	$('#btn-3').click( function(){ selectEC(3, this) } );
	$('#btn-4').click( function(){ selectEC(4, this) } );
	$('#btn-5').click( function(){ selectEC(5, this) } );
	$('#btn-6').click( function(){ selectEC(6, this) } );
	$('#btn-7').click( function(){ selectEC(7, this) } );
	$('#btn-8').click( function(){ selectEC(8, this) } );
	$('#btn-9').click( function(){ selectEC(9, this) } );
	$('#btn-10').click( function(){ selectEC(10, this) } );
		$('#btn-11').click( function(){ selectEC(11, this) } );
			$('#btn-12').click( function(){ selectEC(12, this) } );

	$('.pres-btn').hover( function(){ btnOn(this) }, function(){ btnOff(this) } );
	$('.arrow-btn').hover( function(){ btnOn(this) }, function(){ btnOff(this) } );
	$('#random-button').hover( function(){ btnOn(this) }, function(){ btnOff(this) } );
		
	// stack images
	// for(var i = 1; i <= 10; i++){
	// 	var section = $('#top-section-' + i);
	// 	section.css({'z-index': i});
	// }
	
	var curTop = 0;
	var curMid = 0;
	var curBottom = 0;
	var nextTop = 0;
	var nextMid = 0;
	var nextBottom = 0;

	var lastSection = 12;

	setTimeout(randomEC, 1000);

	function randomEC(){
		while(nextTop == curTop) nextTop = Math.floor(Math.random() * 10) + 1;
		while(nextMid == curMid) nextMid = Math.floor(Math.random() * 10) + 1;
		while(nextBottom == curBottom) nextBottom = Math.floor(Math.random() * 10) + 1;
		
		var t = curTop;
		var m = curMid;
		var b = curBottom;
	
		animateSection('top', t, nextTop, -1);
		var t1 = setTimeout(function(){ animateSection('mid', m, nextMid, -1) }, 250);
		var t2 = setTimeout(function(){ animateSection('bottom', b, nextBottom, -1) }, 500);
	
		curTop = nextTop;
		curMid = nextMid;
		curBottom = nextBottom;

		clearActiveEC();
	}
	
	function selectEC( id, btnElement ){
		if($(btnElement).hasClass("active") == false){
			nextTop = nextMid = nextBottom = id;
			var t = curTop;
			var m = curMid;
			var b = curBottom;
		
			var delay = 0;
		
			if(nextTop != curTop){ 
				animateSection('top', t, nextTop, -1);
				delay += 250;
			}

			if(nextMid != curMid){
				var t1 = setTimeout(function(){ animateSection('mid', m, nextMid, -1) }, delay);
				delay += 250;
			}
		
			if(nextBottom != curBottom) var t2 = setTimeout(function(){ animateSection('bottom', b, nextBottom, -1) }, delay);
	
			curTop = nextTop;
			curMid = nextMid;
			curBottom = nextBottom;
		
			clearActiveEC();
			$(btnElement).addClass("active");
		}
	}
	
	function clearActiveEC(){
		if ((curTop == curMid) && (curMid== curBottom)) 
			document.getElementById("wrd").innerHTML=words[curMid-1];
		else
			document.getElementById("wrd").innerHTML="?";

		//document.getElementById("wrd").title =Sanscript.t(document.getElementById("wrd").innerHTML,'itrans', 'devanagari');
if (t==1)
	document.getElementById("wrd").innerHTML +=  " - " + Sanscript.t(document.getElementById("wrd").innerHTML, 'devanagari','itrans');
		var activeBtn = $(".active");
		if(activeBtn.length){
			$(activeBtn).removeClass("active");
			btnOff(activeBtn[0]);
		}

	}
	function animateSection(section, curID, nextID, dir){
		if(curID != 0){ $('#' + section + '-section-' + curID).animate( {left: (731 * dir)}, 500, function(){} ); }
		$('#' + section + '-section-' + nextID).css( {left: (-731 * dir)} );
		$('#' + section + '-section-' + nextID).animate( {left: 0}, 500, function(){} );
	}

	function topNext($evt){
		nextTop = (curTop >= lastSection) ? 1 : curTop + 1;
		animateSection('top', curTop, nextTop, -1);
		curTop = nextTop;
		clearActiveEC();
	}
	
	function topPrev($evt){
		nextTop = (curTop <= 1) ? lastSection : curTop - 1;
		animateSection('top', curTop, nextTop, 1);
		curTop = nextTop;
		clearActiveEC();
	}

	function midNext($evt){
		nextMid = (curMid >= lastSection) ? 1 : curMid + 1;
		animateSection('mid', curMid, nextMid, -1);
		curMid = nextMid;
		clearActiveEC();
	}
	
	function midPrev($evt){
		nextMid = (curMid <= 1) ? lastSection : curMid - 1;
		animateSection('mid', curMid, nextMid, 1);
		curMid = nextMid;
		clearActiveEC();
	}

	function bottomNext($evt){
		nextBottom = (curBottom >= lastSection) ? 1 : curBottom + 1;
		animateSection('bottom', curBottom, nextBottom, -1);
		curBottom = nextBottom;
		clearActiveEC();
	}
	
	function bottomPrev($evt){
		nextBottom = (curBottom <= 1) ? lastSection : curBottom - 1;
		animateSection('bottom', curBottom, nextBottom, 1);
		curBottom = nextBottom;
		clearActiveEC();
	}
	
	function btnOn(element){
		if (element.tagName == "P")
		  element.style.fontWeight = "bold";
	    else
		{
 		element.src = element.src.replace("_off", "_on");
		}
	}
	
	function btnOff(element){
		if (element.tagName == "P")
		 element.style.fontWeight = "";
	    else
		{
		if($(element).hasClass("active") == false){
			element.src = element.src.replace("_on", "_off");
		}
		}
	}
	
for (i=1;i<=12;i++)
{
cid="top"+i;
document.getElementsByClassName(cid)[0].style.backgroundImage="url('"+imgs[i-1]+"')";
cid="mid"+i;
document.getElementsByClassName(cid)[0].style.backgroundImage="url('"+imgs[i-1]+"')";
cid="bottom"+i;
document.getElementsByClassName(cid)[0].style.backgroundImage="url('"+imgs[i-1]+"')";
pid="btn-"+i;
document.getElementById(pid).innerHTML=words[i-1];
}
  if (h==1)
	$("#pres-btns").hide();
});