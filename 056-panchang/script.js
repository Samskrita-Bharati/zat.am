// Handle of menu inspired by https://codepen.io/rajanchaudhari08/pen/KKGjmQG
var mainMenuHeight;
const nbButtonsInMainMenu = 6;

var panchang_data;

function showLoadingPopup() {
    document.getElementById("loadingPopup").style.display = "block";
}

function hideLoadingPopup() {
    document.getElementById("loadingPopup").style.display = "none";
}

async function fetchPanchang(dateInput, callback) {
  // var dateInput = document.getElementById("dateToSolve").value;
  	// let validDate = dateInput.toISOString().split('T')[0];

    try {
      showLoadingPopup(); // Show loading popup
      
        const apiUrl = `https://panchang.glitch.me/panchang?date=${dateInput}`;
        console.log(apiUrl);
        const response = await fetch(apiUrl);
      
        panchang_data = await response.json();
      
        // document.getElementById('date').textContent = `Date: ${panchang_data.date}`;
//        document.getElementById('nakshatra').textContent = `Nakshatra: ${panchang_data.nakshatra}`;
//        document.getElementById('raashi').textContent = `Raashi: ${panchang_data.rashi}`;
//        document.getElementById('maasa').textContent = `Maasa: ${panchang_data.maasa}`;
        // document.getElementById('nakshatra_no').textContent = `Nakshatra no: ${panchang_data.nakshatra_num}`;
        // document.getElementById('raashi_no').textContent = `Raashi no: ${panchang_data.raashi_num}`;
        // document.getElementById('maasa_no').textContent = `Maasa no: ${panchang_data.maasa_num}`;
        document.getElementById('nakshatra').innerHTML = `नक्षत्रम् = ${panchang_data.नक्षत्र} &nbsp;&nbsp;&nbsp;&nbsp; Asterism: ${panchang_data.nakshatra}`;
        document.getElementById('raashi').innerHTML = `चंद्र राशि: = ${panchang_data.राशि} &nbsp;&nbsp;&nbsp;&nbsp; Lunar Zodiac: ${panchang_data.rashi}`;
        document.getElementById('maasa').innerHTML = `सूर्य मास: = ${panchang_data.मासा} &nbsp;&nbsp;&nbsp;&nbsp; Solar month: ${panchang_data.maasa}`;
    
        // Call the provided callback function with the fetched data
        if (callback && typeof callback === "function") {
            callback();
        }
      
    } catch (error) {
      
        console.error("Error fetching Panchang:", error);
    } finally {
        hideLoadingPopup(); // Always hide popup after fetch
    }
}

// fetchPanchang(onSvgLoad);

const handleDropdownClicked = (event) => {
	const menuOverlay = document.getElementById("menuOverlay");
	menuOverlay.style.display = menuOverlay.style.display === "block" ? "none" : "block" ;
	event.stopPropagation();
	closeSubMenus();
	const dropdownMenu = document.getElementById("dropdown-menu");
	const mainMenu = document.getElementById("main-menu");
	mainMenu.classList.remove("open"); // oddly, opening the main menu require to remove the open class
	if ( dropdownMenu.classList.contains("open") ) {
		const navigationMenu = document.getElementById("navigation-menu");
		const usedSideBtn = document.getElementById("usedSide");
		const helpBtn = document.getElementById("helpButton");
		const btnHeight = Math.max(helpBtn.getBoundingClientRect().height,usedSideBtn.getBoundingClientRect().height);
		navigationMenu.style.height = Math.trunc(btnHeight * nbButtonsInMainMenu) + "px";
		console.log("update navigation-menu height to " + navigationMenu.style.height)
	}
	toggleDropdownMenu(!dropdownMenu?.classList?.contains("open"));
};

function closeSubMenus() {
	const secondaryMenuLabels = document.getElementsByClassName("secondary-menu");
	for (let l of secondaryMenuLabels) {
		l.classList.remove("open");
	}
}

const handleMenuLabelClicked = (label) => {
	const navigationMenu = document.getElementById("navigation-menu");
	const mainMenu = document.getElementById("main-menu");
	const secondaryMenuLabels = document.getElementsByClassName("secondary-menu");
	if (label) {
		for (let l of secondaryMenuLabels) {
			l.classList.remove("open");
		}
		const secondaryMenu = document.getElementById(label);
		secondaryMenu.classList.add("open");
		navigationMenu.style.height = secondaryMenu.clientHeight + "px";
		if ( label == "share-menu") {
			// init shareUrlInput field
			$("#shareUrlInput").val(getPageUrl);
		}
	} else {
		const helpBtn = document.getElementById("helpButton");
		navigationMenu.style.height = helpBtn.getBoundingClientRect().height * nbButtonsInMainMenu;
		for (let l of secondaryMenuLabels) {
			l.classList.remove("open");
		}
	}
	mainMenu.classList.toggle("open");
};

const toggleDropdownMenu = () => {
	const dropdownMenu = document.getElementById("dropdown-menu");
	dropdownMenu.classList.toggle("open");
};

$(document).ready(function() {
	// init navigation menu height from css value
	mainMenuHeight = getComputedStyle(document.getElementById("navigation-menu")).height;

	// initialize menu opening status
	var isMenuOpen = false;
	// init click display
	resetClock();

	$("#clockButton").click(function() {
		var buttonImg = document.getElementById("clockButtonImg");
		if ( buttonImg.src == playImgSrc ) {
			startClock();
		} else {
			pauseClock();
		}
	});

	$("#dateToSolve").click(function() {
		// restore their color when they still are placed
		restoreAllPlacedPcsColor();
	});

	$("#usedSide").click(function() {
		// restore their color when they still are placed
		restoreAllPlacedPcsColor();
	});


});/* document ready func */

function showMessage(message) {
	var messageDiv = $("#shareMessage");
	messageDiv.text(message);
	messageDiv.show();
	setTimeout(function() {
	  messageDiv.hide();
	}, 2000);
};


function copyUrl() {
	var urlInput = document.getElementById("shareUrlInput");
	urlInput.select();
	document.execCommand("copy");
	showMessage("URL copied to clipboard!");
}

// start of clock managment code
const playImgSrc = "https://olivierrt.pythonanywhere.com/dailycalendarpuzzle/play_blueicon_160.png";
const pauseImgSrc = "https://olivierrt.pythonanywhere.com/dailycalendarpuzzle/pause_blueicon_160.png";

function startClock() {
	var buttonImg = document.getElementById("clockButtonImg");
	buttonImg.src = pauseImgSrc;
	clearInterval(clockInterval);
	clockInterval = setInterval(updateClockTime, 1000);
};

const clock0ChNb = 130032;

function resetClock() {
	clockSecondsElm.innerHTML = "&#" + clock0ChNb + ";&#" + clock0ChNb + ";" ;
	clockMinutesElm.innerHTML = "&#" + clock0ChNb + ";&#" + clock0ChNb + ";" ;
	clockHoursElm.innerHTML = "&#" + clock0ChNb + ";&#" + clock0ChNb + ";" ;
	clockSeconds = 0;
	clockMinutes = 0;
	clockHours = 0;
};

function pauseClock() {
	var buttonImg = document.getElementById("clockButtonImg");
	buttonImg.src = playImgSrc;
	clearInterval(clockInterval);
};

function updateClockTime () {
	clockSeconds++;
	var tens;

	if (clockSeconds >= 60) {
	  clockMinutes++;
	  clockSeconds = 0;
	}

	if (clockMinutes >= 60) {
	  clockHours++;
	  clockMinutes = 0;
	}

	if (clockHours > 99 ) {
		clockHours=0;
	}

	if(clockSeconds <= 9){
	  clockSecondsElm.innerHTML = "&#" + clock0ChNb + ";&#" +  (clockSeconds + clock0ChNb) + ";";
	}

	if (clockSeconds > 9){
		tens = Math.trunc(clockSeconds/10)
	  clockSecondsElm.innerHTML = "&#" +  (tens + clock0ChNb) + ";&#" +  (clockSeconds - (tens*10)+ clock0ChNb) + ";";

	}

	if(clockMinutes <= 9){
	  clockMinutesElm.innerHTML = "&#" + clock0ChNb + ";&#" +  (clockMinutes + clock0ChNb) + ";";
	}

	if (clockMinutes > 9){
	  tens = Math.trunc(clockMinutes/10)
	  clockMinutesElm.innerHTML = "&#" +  (tens + clock0ChNb) + ";&#" +  (clockMinutes - (tens*10)+ clock0ChNb) + ";";
	}

	if(clockHours <= 9){
	  clockHoursElm.innerHTML = "&#" + clock0ChNb + ";&#" + (clockHours + clock0ChNb) + ";";
	}

	if (clockHours > 9){
	  tens = Math.trunc(clockHours/10)
	  clockHoursElm.innerHTML = "&#" +  (tens + clock0ChNb) + ";&#" +  (clockHours - (tens*10)+ clock0ChNb) + ";";
	}

};
// end of clock management code

function resetBtnAction() {
	var pcs;
	const mySvg = document.getElementById("puzzle");
	const side = document.getElementById("usedSide");
	// restore their color when they still are placed
	restoreAllPlacedPcsColor();
	// reset pieces position the let initPcsPos move them back to default position
	for (var i = 0; i < pcsList.length; i++) {
	   pcs = mySvg.getElementById(pcsList[i]);
	   setPcsProp(pcs.id,"x", null);
	   setPcsProp(pcs.id,"y",null);
	}
	if (  side.value  == "smooth" ) {
		initPcsPos(true);
	} else {
		initPcsPos(false);
	}
	// Reset and start clock
	resetClock();
	startClock();
	// Clear solution message
	updateSolutionMessage();
};

const mySvg = document.getElementById("puzzle");
const labelColorNoSol = "crimson";
var labelColorEmpty;// initialize from html property at startup
const labelTextNoSol = "No solution exists";
const labelColorSol = "lightgreen";
const textColorSol = "black";
const textColorNoSol = "white";
const labelTextSol = "A solution exists";
const labelSolFound = "Solution found";
const pcsList = ["sSpcs","sLpcs","Qpcs","bSpcs","lSpcs","bLpcs","Ipcs","Cpcs","eLpcs","Tpcs"];
const solutionsServerURI = "//olivierrt.pythonanywhere.com/dailycalendarpuzzlesolver";
const gridStep = 100;
const alignFactor = 3;
const constViewBoxHeight = 1100;
var boundaryXmin = 10;
var boundaryXmax = 1090;
const boundaryLeftMargin = 10;
const boundaryRightMargin = 30;
const boundaryYmin = 10;
const boundaryYmax = 1090;
const boardXcoord = 100;
const boardYcoord = 100;
const boardCellWidth = 100;
const boardCellHeight = 100;
const nbASymPcs = 7;
const nbPcs = 10;
const hexPcsPosLen = 22;
var frontColor = "#6495ED"; // cornflowerblue
var backColor = "#0000FF"; // blue
var solution = null;
var hexPcsPos;
var formAction;
var httpReqDate;
var httpReqSide;
var xmlHttpReq = new XMLHttpRequest();
var isHttpReqForEnd = false;
var checkButtonCaption;
// Variable for clock management
var clockSeconds = 0;
var clockMinutes = 0;
var clockHours = 0;
var clockHoursElm = document.getElementById("clockHours");
var clockMinutesElm = document.getElementById("clockMinutes");
var clockSecondsElm = document.getElementById("clockSeconds");
var clockInterval ;

// Dictionary of puzzle pieces properties with piece Id as key
var pcsProp = {};

function createPcsProps(pcsId) {
	var newprop = {
		x : null, // X position in puzzle, from 0 to 6
		y : null, // Y position in puzzel, from 0 to 7
		mirrored : false, // if the piece has been returned
		rotation : 0, // current angle of rotation in [0,90,180,270]
		back : false, // visible side of piece, symetrical pieces are not mirrored but can show their back side
		placed : false // boolean to know if the piece is placed in the puzzle on a valid position
	};
	pcsProp[pcsId] = newprop;
}

function getPcsProp(pcsId,prop) {

	if ( ! pcsProp[pcsId] ) {
		createPcsProps(pcsId);
	}
	props = pcsProp[pcsId];
	var retVal;
	switch(prop) {
		case 'x':
			retVal = props.x;
			break;
		case 'y':
			retVal = props.y;
			break;
		case 'mirrored':
			retVal = props.mirrored;
			break;
		case 'rotation':
			retVal = props.rotation;
			break;
		case 'back':
			retVal = props.back;
			break;
		case 'placed':
			retVal = props.placed;
			break;
		default:
			console.error("[getPcsProp] Piece property " + prop + " does not exist in piece of id " + pcsId);
	}
	return retVal;
}

function setPcsProp(pcsId,prop,value) {

	if ( ! pcsProp[pcsId] ) {
		createPcsProps(pcsId);
	}
	switch(prop) {
		case 'x':
			pcsProp[pcsId].x = value;
			break;
		case 'y':
			pcsProp[pcsId].y = value;
			break;
		case 'mirrored':
			pcsProp[pcsId].mirrored = value;
			// only asymetrical pieces are mirrored
			pcsProp[pcsId].back= value;
			break;
		case 'rotation':
			pcsProp[pcsId].rotation = value;
			break;
		case 'back':
			pcsProp[pcsId].back= value;
			break;
		case 'placed':
			pcsProp[pcsId].placed= value;
			break;
		default:
			console.error("[setPcsProp] Piece property " + prop + " does not exist in piece of id " + pcsId);
	}
}

function setInitialColor(pcs) {
	if (  getPcsProp(pcs.id,"back") ) {
	  pcs.style.fill = backColor;
	} else {
	  pcs.style.fill = frontColor;
	}
}

function createInitialTransfromations(pcs) {
	if ( pcs.transform.baseVal.length == 0 ) {
		// Create the necessary tranformations
		var newtranslate = mySvg.createSVGTransform();
		newtranslate.setTranslate(0, 0);
		pcs.transform.baseVal.appendItem(newtranslate);
		var newmirror = mySvg.createSVGTransform();
		newmirror.setScale(1,1);
		pcs.transform.baseVal.appendItem(newmirror);
		var newrotation = mySvg.createSVGTransform();
		newrotation.setRotate(0,0,0);
		pcs.transform.baseVal.appendItem(newrotation);
	}
}

function formClicked(button) {
  if( button.name == "action") {
	  formAction = button.value;
  } else {
	  formAction = button.name;
  }
}

// Update the color of all pieces which are in a valid position of the puzzle
// restore all pueces to their normal color (frontColor of backColor)
function restoreAllPlacedPcsColor() {
	for (var i = 0; i < pcsList.length; i++) {
		pcs = mySvg.getElementById(pcsList[i]);
		if ( getPcsProp(pcs.id,"placed") == true ) {
			if (  getPcsProp(pcs.id,"back") ) {
			  pcs.style.fill = backColor;
			} else {
			  pcs.style.fill = frontColor;
			}
		}
	}
}

function updatePcbcolor() {
	// Update the color of all pieces with their front or back color
	for (var i = 0; i < pcsList.length; i++) {
		pcs = mySvg.getElementById(pcsList[i]);
		if (  getPcsProp(pcs.id,"back") ) {
		  pcs.style.fill = backColor;
		} else {
		  pcs.style.fill = frontColor;
		}
	}
	// Update color choose button with the defined front and back colors
	const fInputColor = document.getElementById("frostedColor");
	const sInputColor = document.getElementById("smoothColor");
	fInputColor.value = frontColor;
	sInputColor.value = backColor;
}

function dateChanged(date){
	let newDate = new Date(date);
  let validDate = newDate.toISOString().split('T')[0];
	// updSquaresPos(newDate);
  fetchPanchang(validDate, updSquaresPos);
}

function updSquaresPos(){
  
	var rNum = panchang_data.raashi_num;
	var nNum = panchang_data.nakshatra_num;
	var mNum = panchang_data.maasa_num;

	const rSqr = document.getElementById("weekdaySquare");
	const nSqr = document.getElementById("daySquare");
	const mSqr = document.getElementById("monthSquare");

	if ( ! isNaN(rNum) && ! isNaN(nNum) && ! isNaN(mNum) ) {
		rSqr.setAttribute( 'x', ( (rNum % 6) * 100 ) + 100);
		rSqr.setAttribute( 'y', ( Math.trunc( rNum / 6  ) * 100 ) + 700);
		nSqr.setAttribute( 'x', ( ( nNum % 7  ) * 100 ) + 100);
		nSqr.setAttribute( 'y',( Math.trunc( nNum / 7 ) * 100 ) + 300);
		mSqr.setAttribute('x', ( (mNum % 6 ) * 100 ) + 100);
		mSqr.setAttribute('y', ( Math.trunc( mNum / 6  ) * 100 ) + 100);
	}
}

function changeFrontColor(evt) {
	// Give back to the piece their initial color, to cancel checkSol coloration
	restoreAllPlacedPcsColor();
	frontColor =  document.getElementById("frostedColor").value;
	updatePcbcolor();
}

function changeBackColor(evt) {
	// Give back to the piece their initial color, to cancel checkSol coloration
	restoreAllPlacedPcsColor();
	backColor =  document.getElementById("smoothColor").value;
	updatePcbcolor();
}

function initPcsPos(back) {
	var pcs,x,y, pcsIsBack;
	for (var i = 0; i < pcsList.length; i++) {
		pcs = mySvg.getElementById(pcsList[i]);
		x= getPcsProp(pcs.id,"x");
		y= getPcsProp(pcs.id,"y");
		if ( (x==null) && (y==null) ) {
			if (  getPcsProp(pcs.id,"back") != back ) {
				transformPcs(pcs,"mirror",null,null);
			}
			while(getPcsProp(pcs.id,"rotation") != 0 ) {
				transformPcs(pcs,"rotation",null,null);
			}
			if ( pcs.id == "lSpcs" ) {
				if ( back == false ) {
					transformPcs(pcs, "translation", 680,0);
				} else {
					transformPcs(pcs, "translation", 1070,0);
				}
			}
			if ( pcs.id == "bLpcs" ) {
				if ( back == false ) {
					transformPcs(pcs, "translation", 680,100);
				} else {
					transformPcs(pcs, "translation", 1070,100);
				}
			}
			if ( pcs.id == "Qpcs" ) {
				if ( back == false ) {
					transformPcs(pcs, "translation", 300,800);
				} else {
					transformPcs(pcs, "translation", 500,800);
				}
			}
			if ( pcs.id == "sSpcs" ) {
				if ( back == false ) {
					transformPcs(pcs, "translation", 800,500);
				} else {
					transformPcs(pcs, "translation", 1070,500);
				}
			}
			if ( pcs.id == "Tpcs" ) {
				transformPcs(pcs, "translation", 780,800);
			}
			if ( pcs.id == "sLpcs" ) {
				if ( back == false ) {
					transformPcs(pcs, "translation", 600,900);
				} else {
					transformPcs(pcs, "translation", 800,900);
				}
			}
			if ( pcs.id == "bSpcs" ) {
				if ( back == false ) {
					transformPcs(pcs, "translation", 780,300);
				} else {
					transformPcs(pcs, "translation", 1080,300);
				}
			}
			if ( pcs.id == "Cpcs" ) {
				transformPcs(pcs, "translation", 0,900);
			}
			if ( pcs.id == "eLpcs" ) {
				transformPcs(pcs, "translation", 0,600);
			}
			if ( pcs.id == "Ipcs" ) {
				transformPcs(pcs, "translation", 0,200);
			}
			// align on grid to trigger position update in puzzle
			gridAlign(pcs);
		}
	}
}

function getValidColor(strColor){
	var intColor = null;
	if ( strColor != null ) {
		if( strColor.substring(0,1) == "#" ) {
			intColor = Number("0x" + strColor.substring(1,7));
		} else {
			intColor = Number("0x" + strColor.substring(0,6));
		}
	}
	if ( ( ! isNaN(intColor) ) && ( intColor != null) ) {
		return "#" +  intColor.toString(16).padStart(6,"0");
	} else {
		return null;
	}
}

function clickOnFrostedColorPicker() {
   document.getElementById("frostedColor").click();
}

function clickOnSmoothColorPicker() {
   document.getElementById("smoothColor").click();
}

visualViewport.onresize = () => {
	updateSvgBoundaries();
}

function updateSvgBoundaries() {
	puzzle = document.getElementById("puzzle");
	const {x, y, width, height} = puzzle.viewBox.baseVal;
	const aspectRatio = window.innerWidth / window.innerHeight;
	if ( aspectRatio > 1.0 ) {
		newViewboxWidth = constViewBoxHeight * aspectRatio;
		newBoundaryXmin = -( ( newViewboxWidth - constViewBoxHeight ) / 2 ) + boundaryLeftMargin;
		newBoundaryXmax = newBoundaryXmin + newViewboxWidth - boundaryRightMargin;
		newViewboxX = newBoundaryXmin - boundaryLeftMargin;
	} else {
		newViewboxWidth = constViewBoxHeight;
		newBoundaryXmin = boundaryLeftMargin;
		newBoundaryXmax = constViewBoxHeight - boundaryRightMargin;
		newViewboxX = newBoundaryXmin - boundaryLeftMargin;
	}
	// first check if pieces shall be moved to fit in new window
	if ( (newBoundaryXmin > boundaryXmin) || (newBoundaryXmax < boundaryXmax) ) {
		var pcs,pcsX,pcsY,translation;
		for (var i = 0; i < pcsList.length; i++) {
			pcs = mySvg.getElementById(pcsList[i]);
			var transforms = pcs.transform.baseVal
			// check if the 3 transfom of the piece have been created
			if ( transforms.length === 0 ) {
				createInitialTransfromations(pcs);
			}
			translation = transforms.getItem(0);
			pcsX = translation.matrix.e;
			pcsY = translation.matrix.f;
			transformPcs(pcs, "translation", pcsX,pcsY);
		}
	}
	// then resize svg usable area and limits
	if ( (newBoundaryXmin != boundaryXmin) || (newBoundaryXmax != boundaryXmax) ) {
		boundaryXmin = newBoundaryXmin;
		boundaryXmax = newBoundaryXmax;
		// viewbox parameter are min-x min-y width height
		puzzle.setAttribute("viewBox", newViewboxX + " 0 " + newViewboxWidth + " 1100");
	}
}


function onSvgLoad() {
	var pcs;
	for (var i = 0; i < pcsList.length; i++) {
		pcs = mySvg.getElementById(pcsList[i]);
		createInitialTransfromations(pcs);
	}

   // add listener to capture color change
   const fInputColor = document.getElementById("frostedColor");
   const sInputColor = document.getElementById("smoothColor");
   fInputColor.addEventListener("input",changeFrontColor);
   sInputColor.addEventListener("input",changeBackColor);

	// Set current date as date to solve in form
	const dateInput = document.getElementById("dateToSolve");
	const sideInput = document.getElementById("usedSide");

	// read params from URL to support puzzle share feature
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const date= urlParams.get('date');
	var cnvDate = new Date(date);
	var validDate;
	if ( (date != null ) && (! isNaN(cnvDate.getTime() ) ) ) {
		validDate = date;
	} else {
		// Using UTC (universal coordinated time)
		validDate = new Date().toISOString().split('T')[0];
	}
	// Place the grey squares in puzzle corresponding to selected date
	dateInput.value = validDate;
  fetchPanchang(validDate, updSquaresPos);
	// updSquaresPos(validDate);
	// read pieces colors from URL
	var newColor;
	const frontSideColor = urlParams.get("fcolor");
	if( frontSideColor != null ) {
		newColor = getValidColor(frontSideColor);
		if( newColor != null ) {
			frontColor = newColor;
		} else {
			 console.error("Invalid fcolor: " + frontSideColor);
		}
	}
	const backSideColor = urlParams.get("bcolor");
	if( backSideColor != null ) {
		newColor = getValidColor(backSideColor);
		if( newColor != null ) {
			backColor = newColor;
		} else {
			 console.error("Invalid bcolor: " + frontSideColor);
		}
	}
	updatePcbcolor();

	// take into accound "side" of URL
	const side = urlParams.get("side");
	if ( side == "frosted") {
		sideInput.value = "frosted";
	}
	if ( side == "smooth") {
		sideInput.value = "smooth";
		turnPcs(true);
	}
	if ( side == "both") {
		sideInput.value = "both";
	}
	const pcsPos = urlParams.get("pcspos");
	// init property from html
	labelColorEmpty = document.getElementById("chkResult").style.backgroundcolor;

	// place the pieces specified in URL param if any
	placePieces(pcsPos);
	// for not placed pieces,  put them around the board
	if ( side == "smooth" ) {
		initPcsPos(true);
	} else {
		initPcsPos(false);
	}

	// Start stop clock
	startClock();

	// Compute the boundary of pieces drag with the initial window size
	updateSvgBoundaries();
}

function turnPcs(mirrored) {
	var pcs;
	var back;
	for (var i = 0; i < pcsList.length; i++) {
		pcs = mySvg.getElementById(pcsList[i]);
		back = getPcsProp(pcs.id,"back");
		if ( back != mirrored ) {
			transformPcs(pcs, "mirror", null, null);
		}
	}
}

// It's important to add an load event listener to the object,
// as it will load the svg doc asynchronously
 mySvg.addEventListener("load",onSvgLoad, false);
// mySvg.addEventListener("load",fetchPanchang(onSvgLoad), false);

function placePieces(pcsPos) {
	// restore their color
	restoreAllPlacedPcsColor();
	// place all the pieces which have a define place in the given hexadecimal string
	var xPos, yPos, xOfs, yOfs, pcs, pcsAngle, oldAngle;
	var  rtry, mirrored, sideByte, posByte, posByteStr, pcsMirrored;
	if( pcsPos && pcsPos.length ==  hexPcsPosLen) {
		sideByte = Number( "0x"+pcsPos.substring(hexPcsPosLen-2,hexPcsPosLen) );
		if ( sideByte == (2**(nbASymPcs) - 1) ) {
			// turn all pieces if all asymetrical ones are turned
			turnPcs(true);
		} else {
			if ( sideByte == 0 ) {
				turnPcs(false);
			} else {
				for ( var j = 0; j < nbASymPcs ; j ++ ) {
					pcs = mySvg.getElementById(pcsList[j]);
					if ( (Math.trunc(sideByte/(2**j)) % 2) ) {
						mirrored = true;
					} else {
						mirrored = false;
					}
					pcsMirrored = getPcsProp(pcs.id,"mirrored");
					if ( pcsMirrored != mirrored ) {
						transformPcs(pcs, "mirror", null, null);
					}
				}
			}
		}
		for (var i = 0; i < pcsList.length; i++) {
			pcs = mySvg.getElementById(pcsList[i]);
			posByteStr = pcsPos.substring(2*i,(2*i)+2);
			posByte = Number("0x"+posByteStr);
			// only place the piece which have a specified position
			if( posByte != 255 ) {
				pcsAngle = (( 4 - ( Math.trunc(posByte/64)%4 ) ) * 90 ) % 360;
				xPos = posByte % 8;
				yPos = Math.trunc(posByte / 8) % 8;
				if ( ( getPcsProp(pcs.id,"mirrored") == true) && ( ! pcs.classList.contains('front') ) )  {
					pcsAngle = ( 360 - pcsAngle ) % 360;
				}
				// apply rotation
				oldAngle = getPcsProp(pcs.id,"rotation");
				rtry = 0;
				while ( (oldAngle != pcsAngle) && ( rtry < 4) ) {
					transformPcs(pcs,"rotation",null,null);
					rtry += 1; // prevent infinite loop in case of 180 deg rotation for symetrical pieces
					oldAngle = getPcsProp(pcs.id,"rotation");
				}
				if ( rtry > 3 ) {
					console.error("Not reachable rotation angle of " + pcsAngle + " in posByte: " + posByteStr + " at position " + i + " for piece " + pcs.id);
				}
				// compute translation to apply
				//  coordinates corrections
				xOfs = 0;
				yOfs = 0;
				if ( pcsAngle == 90 ) {
					xOfs -= 1;
				}
				if ( pcsAngle == 180 ) {
					xOfs -= 1;
					yOfs -= 1;
				}
				if ( pcsAngle == 270 ) {
					yOfs -= 1;
				}
				if ( ( getPcsProp(pcs.id,"mirrored") == true ) && ( ! pcs.classList.contains('front') ) )  {
					if ( (pcsAngle != 90) && (pcsAngle != 180) ) {
						xOfs -= 1;
					} else {
						xOfs += 1;
					}
				}
				if( (! isNaN(xPos) ) && ( ! isNaN(yPos) ) ) {
					x = ((xPos-xOfs)*boardCellWidth)+boardXcoord;
					y = ((yPos-yOfs)*boardCellHeight)+boardYcoord;
					transformPcs(pcs,"translation",x,y);
					// Align piece on grid
					gridAlign(pcs);
				} else {
					console.error("Piece positions x=" + xPos + " and y=" + yPos + " are not both valid numbers once decoded from posByte: " + posByteStr + " at positon " + i + " for piece " + pcs.id);
				}
			}// posByte != 255
		}// loop placing all the pieces
	}// pcsPos valid
}

function getHexPcsPos() {
	var hexPcsPos = "";
	var xPos, yPos, pcs, pcsAngle;
	var mirrored;
	var sideByte = 0;

	for (var i = 0; i < pcsList.length; i++) {
		pcs = mySvg.getElementById(pcsList[i]);
		// compute pieces position on board
		xPos = getPcsProp(pcs.id,"x");
		yPos = getPcsProp(pcs.id,"y");
		pcsAngle = getPcsProp(pcs.id,"rotation");
		if ( ( xPos != null ) && ( yPos != null ) ) {
			if ( ( getPcsProp(pcs.id,"mirrored") == true) && ( ! pcs.classList.contains('front') ) )  {
				if( pcs.classList.contains('sym') ) {
					// symetrical pieces angle cannot be 180
					pcsAngle = ( 360 - pcsAngle ) % 360;
				} else {
					pcsAngle = ( 360 - pcsAngle ) % 360;
				}
			}
			// rotation coding is 0=up, 1=right (x->y and y->-x), 2=down and 3=left
			pcsPos = xPos + ( yPos * 8 ) + ( ( ( 4 - Math.trunc(  pcsAngle  / 90 ) ) % 4 )* 64 );
			hexPcsPos += pcsPos.toString(16).padStart(2,"0");
		} else {
			hexPcsPos += "ff";
		}
	}
	// compute the byte containing the side of the 6 not front only pieces
	for ( var j = 0; j < nbASymPcs ; j ++ ) {
		pcs = mySvg.getElementById(pcsList[j]);
		mirrored = getPcsProp(pcs.id,"mirrored");
		if ( mirrored == true ) {
			sideByte += 2 ** j;
		}
	}
	hexPcsPos += sideByte.toString(16).padStart(2,"0");

	return hexPcsPos;
}

function getPageUrl() {
	var date =document.getElementById("dateToSolve").value;
	var side = document.getElementById("usedSide").value;
	var pcsPos = getHexPcsPos();
	return  window.location.href.split('?')[0] + "?date=" + date + "&side=" + side + "&pcspos=" + pcsPos + "&fcolor=" + frontColor.substring(1) + "&bcolor=" + backColor.substring(1);
}

function shareBoard(evt) {
	var textLink =  getPageUrl();
	// unicode char 003C is less than character starting html tags
	const ltchar = String("\u003C");
	var hyperlinkTag = ltchar  + "a href='" + textLink + "'>" + textLink + ltchar + "/a>";
	var chkLabel = document.getElementById("link");
	link.innerHTML = hyperlinkTag;
}

function showSolution() {
	if( solution ) {
		placePieces(solution);
	}
}

var chkLabel = document.getElementById("chkrep");
var chkArea = document.getElementById("chkResult");
var solveBtn = document.getElementById("solve");

// Update solution message for solution exists, not existing or clear the message
function updateSolutionMessage(msg,displaySolBtn = true) {
	if ( msg == labelTextNoSol ) {
		chkArea.style.backgroundColor = labelColorNoSol;
	   chkLabel.textContent = labelTextNoSol;
	   chkLabel.style.color = textColorNoSol;
	   solveBtn.style.display = "none";
	} else {
	   if ( msg ) {
		   chkArea.style.backgroundColor = labelColorSol;
	   chkLabel.textContent = msg;
	   chkLabel.style.color = textColorSol;
	   if ( displaySolBtn == true ) {
		   solveBtn.style.display = "block";
	   }
	   } else {
		   chkArea.style = labelColorEmpty;
		   chkLabel.textContent = "";
		   solveBtn.style.display = "none";
	   }
	}
}

chkBtn = document.getElementById("check");
chkBtn.style.display = 'none';

function startChkBtnAnimation() {
	// unicode char 003C is less than character starting html tags
	const ltchar = String("\u003C");
	// chkBtn = document.getElementById("check");
	checkButtonCaption = chkBtn.innerHTML; // backup for later restore
	chkBtn.innerHTML = ltchar + "i class='bx bx-loader bx-spin  bx-md' >" + ltchar + "/i>";
}

function stopChkBtnAnimation() {
	chkBtn.innerHTML = checkButtonCaption;
}

// Function call upon response from server about the request sent by checkSol
function httpRequestEnded() {
	if ( isHttpReqForEnd == false ) {
		// Stop check button animation
		stopChkBtnAnimation();
	}

	// count the number of placed pcs in returned hex string
	var nbPcsPlaced = nbPcs;
	requestResponse = xmlHttpReq.responseText;
	if ( hexPcsPos.match(/ff/g) ) {
		nbPcsPlaced = pcsList.length -  (hexPcsPos.match(/ff/g)).length;
	}

	//console.log("http request with PcsPos=" + hexPcsPos  + " date: " + httpReqDate + " side: " + httpReqSide + " get response : " + requestResponse);

	// null is not more a possible answer from the server since it has been updated
	if ( requestResponse == "null" ){
		if ( isHttpReqForEnd == false ) {
			updateSolutionMessage(labelTextNoSol);
			solution = null;
		}
	} else {

		var solutionExist = false;
		if ( hexPcsPos == requestResponse) {
			// the puzzle has been solved!
			var prettyDate = new Date(httpReqDate).toDateString()
			updateSolutionMessage(labelSolFound + " for " + prettyDate  +  " using " + httpReqSide + " sides",false);
			solutionExist = true;
			pauseClock();
		} else {
			if ( isHttpReqForEnd == false ) {
			// check if all placed pieces are correctly placed
			var sideByteResp = Number( "0x" + requestResponse.substring( hexPcsPosLen-2, hexPcsPosLen ) );
			var sideBytePcs = Number( "0x" + hexPcsPos.substring( hexPcsPosLen-2, hexPcsPosLen ) );
			var nbPcsCorrect = 0;
			for ( var pcsIdx=0; pcsIdx < nbPcs; pcsIdx++ ) {
				if( hexPcsPos.substring(2*pcsIdx, (2*pcsIdx)+2)  != "ff" ) {
					pcs = mySvg.getElementById(pcsList[pcsIdx]);
					if ( ( requestResponse.substring(2*pcsIdx, (2*pcsIdx)+2) == hexPcsPos.substring(2*pcsIdx, (2*pcsIdx)+2) ) && ( (Math.trunc(sideByteResp / (2**pcsIdx)) % 2 ) == (Math.trunc(sideBytePcs / (2**pcsIdx)) % 2) ) ) {
						pcs.style.fill = labelColorSol;
						nbPcsCorrect++;
					} else {
						pcs.style.fill = labelColorNoSol;
					}
				}
			}
			if ( nbPcsCorrect == nbPcsPlaced ) {
				solutionExist = true;
			}
			if ( solutionExist == true ) {
				updateSolutionMessage(labelTextSol);
			} else {
				updateSolutionMessage(labelTextNoSol);
				solution = null;
			}
			}
		}
		solution = requestResponse;
	}
	isHttpReqForEnd = false;
}

function checkIfPuzzleSolved() {
	var nbPlacedPcs=0;
	var pcs;
	for (var i = 0; i < pcsList.length; i++) {
		pcs = mySvg.getElementById(pcsList[i]);
		if( getPcsProp(pcs.id,"placed") == true ) {
			nbPlacedPcs +=1;
		}
	}
	if ( nbPlacedPcs == nbPcs ) {
		isHttpReqForEnd = true;
		checkSol();
	}
}

function checkSol() {
	var dateInput = document.getElementById("dateToSolve");
	var sideSelect = document.getElementById("usedSide");
	var date = dateInput.value;
	var side = sideSelect.value;
	httpReqDate = date;
	httpReqSide = side;
	hexPcsPos = "";

	if ( httpReqSide == "frosted" ) {
		turnPcs(false);
	}
	if ( httpReqSide == "smooth" ) {
		turnPcs(true);
	}

	hexPcsPos = getHexPcsPos();

	var requestResponse = null;
	// manage the protocol because http request are blocked on https pages and vice-versa
	var theUrl = location.protocol + solutionsServerURI + "?date=" + httpReqDate + "&side=" + httpReqSide + "&pcspos=" + hexPcsPos + "&action=check";
	xmlHttpReq.open( "GET", theUrl, true); // false for synchronous request
	xmlHttpReq.onload = httpRequestEnded;
	// xmlHttpReq.send( null );
	if ( isHttpReqForEnd == false ) {
		// start animation of "check" button to show that the request has been taken into account
		// startChkBtnAnimation();
	}
}

function roundToGrid(value) {
	var rounded;
	if ( value < 0 ) {
		rounded = Math.floor( value / gridStep ) * gridStep;
	} else {
		rounded = Math.ceil( value / gridStep ) * gridStep;
	}
	return rounded;
}

// return how much the piece would exceed its bounding limit if x,y translation is applied to it
// add the returned values to keep the piece in bounding zone
function getBoundExceeding(pcs,tx,ty,keepAlignment) {
	// translation is the first tranform
	var translation = pcs.transform.baseVal.getItem(0);
	var x = 0;
	var y = 0;

	if ( pcs.classList.contains('confine') ) {
		// Check the piece regarding the allowed limit to correct the translation
		var bb = pcs.getBBox();
		var mirrored = getPcsProp(pcs.id,"mirrored");
		var angle = getPcsProp(pcs.id,"rotation");
		var dxmax,dxmin,dymax,dymin;
		if ( angle == 0 ) {
			dxmax = bb.width;
			dxmin = 0;
			dymin = 0;
			dymax = bb.height;
		}
	   if ( angle == 90 ) {
		   dxmax = 0
			dxmin = -bb.height;
			dymin = 0;
			dymax = bb.width;
		}
		if ( angle == 180 ) {
			dxmax = 0;
			dxmin = -bb.width;
			dymin = -bb.height;
			dymax = 0;
		}
		if ( angle == 270) {
			dxmax = bb.height;
			dxmin = 0;
			dymin = -bb.width;
			dymax = 0;
		}
		if ( mirrored == true ) {
			// swap dxmax and dxmin
			if ( ( angle == 180 ) || ( angle == 90 )) {
				dxmax = dxmax+dxmin;
				dxmin = dxmax-dxmin;
				dxmax = -dxmax+dxmin;
			} else {
				dxmax = dxmax+dxmin;
				dxmin = dxmax-dxmin;
				dxmax = dxmax-dxmin;
				dxmin = -dxmin;
			}
		}
		var xLeft = ( tx + dxmin ) - boundaryXmin;
		if ( xLeft < 0 ) {
			x =  -xLeft;
		}
		var xRight = ( tx + dxmax ) - boundaryXmax;
		if ( xRight > 0 ) {
			x = -xRight;
		}
		var yTop = ( ty + dymin ) - boundaryYmin;
		if ( yTop < 0 ) {
			y = -yTop;
		}
		var yBottom = ( ty + dymax ) - boundaryYmax;
		if ( yBottom > 0 ) {
			y = -yBottom;
		}
	}
	if ( keepAlignment == true ) {
		x = roundToGrid(x);
		y = roundToGrid(y);
	}

	// return bound excess translation
	return { x ,y };
}

function computePcsPos(pcs) {
	// compute piece position in puzzle
	var xOfs, yOfs, pcsAngle;
	var translation = pcs.transform.baseVal.getItem(0);
	var x = translation.matrix.e;
	var y = translation.matrix.f;
	if ( ( ( x % gridStep ) == 0 ) && ( ( y % gridStep ) == 0 ) ) {
		// compute coordinates corrections
		xOfs = 0;
		yOfs = 0;
		pcsAngle = getPcsProp(pcs.id,"rotation")
		if ( pcsAngle == 90 ) {
			xOfs -= 1;
		}
		if ( pcsAngle == 180 ) {
			xOfs -= 1;
			yOfs -= 1;
		}
		if ( pcsAngle == 270 ) {
			yOfs -= 1;
		}
		if ( ( getPcsProp(pcs.id,"mirrored") == true ) && ( ! pcs.classList.contains('front') ) )  {
			if ( (pcsAngle != 90) && (pcsAngle != 180) ) {
				xOfs -= 1;
			} else {
				xOfs += 1;
			}
		}

		x = Math.trunc((x-boardXcoord)/boardCellWidth)+xOfs;
		y = Math.trunc((y-boardYcoord)/boardCellHeight)+yOfs;

		// check if the piece is in the puzzle
		if ( ( x>=0 && y>=0 && x<6 && y < 8 ) || ( x== 6 && y > 1 && y < 6) ) {
			setPcsProp(pcs.id,"x",x);
			setPcsProp(pcs.id,"y",y);
			setPcsProp(pcs.id,"placed",true);
			pcs.style.stroke = "white";
			checkIfPuzzleSolved();
		} else {
			setPcsProp(pcs.id,"x",null);
			setPcsProp(pcs.id,"y",null);
			setPcsProp(pcs.id,"placed",false);
			pcs.style.stroke = "black";
		}
	} else {
		setPcsProp(pcs.id,"x",null);
		setPcsProp(pcs.id,"y",null);
		setPcsProp(pcs.id,"placed",false);
		pcs.style.stroke = "black";
	}
}

function gridAlign(pcs) {
	// translation is the first tranform
	var translation = pcs.transform.baseVal.getItem(0);
	var x = translation.matrix.e;
	var y = translation.matrix.f;

	// align the piece on the grid
	var gXofs = x%gridStep;
	var gYofs = y%gridStep;
	var xAlign = 0;
	var yAlign = 0;
	if ( gXofs < (gridStep/alignFactor) ) {
		xAlign = -gXofs;
	}
	if  ( gXofs > (gridStep - (gridStep/alignFactor) ) ) {
		xAlign = ( gridStep - gXofs );
	}
	if ( gYofs < (gridStep/alignFactor) ) {
		yAlign = -gYofs;
	}
	if  ( gYofs > (gridStep - (gridStep/alignFactor) ) ) {
		yAlign = ( gridStep - gYofs );
	}
	if ( ( yAlign != 0 ) && ( xAlign != 0 ) ) {

		// check if grid alignment doesn't make piece go out of bound
		correction = getBoundExceeding(pcs,x+xAlign,y+yAlign,false);
		if ( (correction.x == 0 ) && (correction.y == 0 ) ) {
			// apply translation
			translation.setTranslate(x+xAlign,y+yAlign);
		}
	}
	computePcsPos(pcs);
}

function transformPcs(pcs, transf, x, y) {
	// apply a transformation to piece pcs and ensure that it stay with max coordinates
	// transf = "translation" or "mirror" or "rotation"

	// Make sure the SVG puzzle piece contains 3 transforms : 1 translation, 1 scale and 1 rotation
	var transforms = pcs.transform.baseVal;
	// translation is the first tranform
	var translation = transforms.getItem(0);
	var correction;

	if (transforms.length === 0 ) {
		createInitialTransfromations(pcs);
	}

	// Apply the translation given by x and y (be careful to take into account current piece translation to compute these x and y)
	if (transf == "translation") {
		correction = getBoundExceeding(pcs,x,y,false);
		translation.setTranslate( x+correction.x, y+correction.y);
	}

	// Flip the piece like in a mirror
	if (transf == "mirror") {
		// Get piece size to translate after scale
		var pcsCoord = pcs.getBBox();
		var angle = getPcsProp(pcs.id,"rotation");
		var xTrans;
		var yTsym = 0;
		var xTsym = 0;
		if ( angle == 90 ) {
			xTrans = -pcsCoord.height;
		}
		if ( angle == 0 ) {
			xTrans = pcsCoord.width;
		}
		if ( angle == 180 ) {
			xTrans = -pcsCoord.width;
		}
		if ( angle == 270 ) {
			xTrans = pcsCoord.height;
		}
		// actually mirror not symetrical pieces only
		if ( ! pcs.classList.contains('front') ) {
			mirror = pcs.transform.baseVal.getItem(1);
			if ( getPcsProp(pcs.id,"mirrored") == true ) {
				pcs.style.fill = frontColor;
				setPcsProp(pcs.id,"mirrored",false);
				mirror.setScale(1,1);
				// In case of setScale(1,1), translation to apply is the opposite of the one for setScale(-1,1)
				xTrans = - xTrans;
			} else {
				mirror.setScale(-1,1);
				pcs.style.fill = backColor;
				setPcsProp(pcs.id,"mirrored",true);
			}
			// symetrical pieces can only have 2 rotation angle, but mirroring them created inverted angle which need to be fixed
			if (  pcs.classList.contains('sym') && ( angle != 0 ) ) {
				// rotation is the third tranform
				var rotation = pcs.transform.baseVal.getItem(2);
				var newAngle = ( angle + 180 ) % 360;
				rotation.setRotate(newAngle,0,0);
				setPcsProp(pcs.id,"rotation",newAngle);
				// add translation to put back the piece at its original place
				if ( newAngle == 90 ) {
					xTsym -= pcsCoord.height;
					yTsym -= pcsCoord.width;
				} else {
					xTsym -= pcsCoord.height;
					yTsym += pcsCoord.width;
				}
			}
			// Translate the piece to put it back at the same place after the scale (translate minus its X width)
			// don't take yTsym and xTsym into account because they don't actually move the piece
			correction = getBoundExceeding(pcs,translation.matrix.e + xTrans + xTsym,translation.matrix.f + yTsym,true);
			translation.setTranslate(translation.matrix.e + xTrans + correction.x + xTsym, translation.matrix.f + yTsym);
			computePcsPos(pcs);
		} else {
			// front pieces are not returned, but only repainted in alternate color
			if (  getPcsProp(pcs.id,"back") ) {
				pcs.style.fill = frontColor;
				setPcsProp(pcs.id,"back",false);
			} else {
				pcs.style.fill = backColor;
				setPcsProp(pcs.id,"back",true);
			}
		}
	}

	// Rotate the piece by 90 more
	if (transf == "rotation") {
		// rotation is the third tranform
		rotation = pcs.transform.baseVal.getItem(2);
		var oldAngle = getPcsProp(pcs.id,"rotation");
		var mirrored = getPcsProp(pcs.id,"mirrored")
		var coord = pcs.getBBox();
		var angle;

		// manage the symetrical pieces which are still the same upon 180 rotation
		if ( ! pcs.classList.contains('sym') ) {
			angle = ( oldAngle + 90 ) % 360;
		} else {
			if ( mirrored == true ) {
				if ( oldAngle == 0 ) {
					angle = 90;
				} else {
					angle = 0;
				}
			} else {
				if ( oldAngle == 0 ) {
					angle = 270;
				} else {
				   angle = 0;
			   }
			}
		}
		rotation.setRotate(angle, 0, 0); // rotation center not used to be able to compute piece position from matrix.e and matrix.f'
		setPcsProp(pcs.id,"rotation",angle);

		// perfom translation to put back piece position at its previous position
		var xTrans = 0;
		var xTrans = 0;
		var bb = pcs.getBBox();
		if ( angle == 0 ) {
			if ( ! pcs.classList.contains('sym') ) {
				xTrans = 0;
				yTrans = -bb.height;
			} else {
				// rotation to 0 from 90 or 270 degrees
				if ( mirrored == true ) {
					 if ( oldAngle == 270 ) {
						 xTrans = 0;
						yTrans = -bb.width;
					 } else {
						xTrans = bb.height;
						yTrans = 0;
					}
				} else {
					if ( oldAngle == 90 ) {
						xTrans = -bb.height;
						yTrans = 0;
					} else {
						xTrans = 0;
						yTrans = -bb.width;
				   }
				}
			}
		}
		if ( angle == 90 ) {
			if ( mirrored == true ) {
				xTrans = -bb.height;
			} else {
				xTrans = bb.height;
			}
			yTrans = 0;
		}
		if ( angle == 180 ) {
			xTrans = 0;
			yTrans = bb.height;
		}
		if ( angle == 270 ) {
			if ( ! pcs.classList.contains('sym') ) {
				if ( mirrored == true ) {
					xTrans = bb.height;
				} else {
					xTrans = -bb.height;
				}
				yTrans = 0;
			} else {
				if ( mirrored == true ) {
					xTrans = bb.height;
					yTrans = bb.width;
				} else {
					xTrans = 0;
					yTrans = bb.width;
				}
			}
		}
		correction = getBoundExceeding(pcs,translation.matrix.e + xTrans, translation.matrix.f+yTrans, true);

		translation.setTranslate(translation.matrix.e+xTrans+correction.x,translation.matrix.f+yTrans+correction.y);
		computePcsPos(pcs);
	}
}

function makeDraggable(evt) {
	var svg = evt.target;

	svg.addEventListener('mousedown', startDragMouse);
	svg.addEventListener('mousemove', drag);
	svg.addEventListener('mouseup', endDragMouse);
	svg.addEventListener('mouseleave', endDragMouse);
	svg.addEventListener('touchstart', startDragTouch);
	svg.addEventListener('touchmove', drag);
	svg.addEventListener('touchend', endDragTouch);
	svg.addEventListener('touchleave', endDragTouch);
	svg.addEventListener('touchcancel', endDragTouch);

	var selectedElement;
	var offset;
	const clicDragLimit=10; // drag lengh limit to differenciate drag and clic
	const longpressDur = 500; // duration to differenciate click and long press
	var isLongpress = false;
	var longpressTimer = null;
	var isClick;

	var dragStart = {
		x : null,
		y : null,
		type : null
	}

	// cursor position in viewport coordinates
	function getMousePosition(evt) {
		var CTM = svg.getScreenCTM();// matrix to transform evt coordinates into view port coordinates
		if (evt.touches) { evt = evt.touches[0]; }
		return {
			x: (evt.clientX - CTM.e) / CTM.a,
			y: (evt.clientY - CTM.f) / CTM.d
		};
	}

	function startDragMouse(evt) {
		if ( dragStart.type == null ) {
			dragStart.type = "mouse";
		}
		startDrag(evt);
	}

	function startDragTouch(evt) {
		if ( dragStart.type == null ) {
			dragStart.type = "touch";
		}
		startDrag(evt);
	}

	function startDrag(evt) {
		if (evt.target.classList.contains('draggable')) {
			selectedElement = evt.target;
			offset = getMousePosition(evt);
			dragStart.x = offset.x;
			dragStart.y = offset.y;

			// We ensured that first transform on SVG piece is a translate transform
			var transforms = selectedElement.transform.baseVal;
			// ensure that initial transforms has been created
			createInitialTransfromations(selectedElement);

			// Get initial translation
			var transform = transforms.getItem(0);
			offset.x -= transform.matrix.e;
			offset.y -= transform.matrix.f;

			// Give back to the piece their initial color, to cancel checkSol coloration
			restoreAllPlacedPcsColor();
			updateSolutionMessage();

			// Short click and long click detection initialization
			isLongpress = false;
			isClick = true;
			longpressTimer = setTimeout(chkTout,longpressDur);
		}
	}

	function chkTout() {
		if ( isClick == true ) {
			isLongpress=true;
		}
	}

	function drag(evt) {
		if (selectedElement) {
			evt.preventDefault();

			var coord = getMousePosition(evt);
			var dx = coord.x - offset.x;
			var dy = coord.y - offset.y;
			var dxdrag = Math.abs( coord.x - dragStart.x);
			var dydrag = Math.abs( coord.y - dragStart.y);

			if ( ( dxdrag > clicDragLimit ) || ( dydrag > clicDragLimit ) ) {
				isClick = false;
			}

			transformPcs(selectedElement, "translation", dx, dy);
		}
	}

	function endDragMouse(evt) {
		endDrag(evt,"mouse");
	}

	function endDragTouch(evt) {
		endDrag(evt,"touch");
	}

	function endDrag(evt,type) {
		if ( ( selectedElement ) && ( dragStart.type == type) ) {
			if ( isClick == true ) {
				if ( isLongpress == true ) {
					transformPcs(selectedElement, "mirror", null, null);
				} else {
					transformPcs(selectedElement, "rotation", null, null);
				}
			}

			 // Align piece on grid
			 gridAlign(selectedElement);
		}

		selectedElement = null;
		clearTimeout(longpressTimer);
	}

}// makeDraggable
