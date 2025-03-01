const table = document.getElementById("numbers");
const numpad = document.getElementById("numpad");
const message = document.getElementById("message");


const num_int = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const numeral_scripts = {
  "international" : ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
  
  "Devanagari"    : ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"],
};

const list_scripts = ["Devanagari"];

function add_Numeral(value){
  
  if(guess.length>=5 || gameover)
    return;
  
  guess += value;
  
  setRow();
}

function remove_Numeral(){
  if(guess.length<=0 || gameover)return;
  
  guess = guess.substring(0, guess.length - 1);
  
  setRow();
}

let list_ans_ind, list_guess_ind, list_nonmatch_ind, list_match_ind;

let cur_nonmatch_pos;

function submitNumber(){
  if ( (row_no>5) || gameover)
    return;
  
  if (guess.length<=4)
    return;
  
  let correctCount = 0;
  
  const tableRow = document.getElementById(`row${row_no}`);
  
    for(let k=0; k<=4; k++) {
      
      tableRow.children[k].innerHTML = `<p>${numeral_scripts[script_type][guess.charAt(k)]}</p>`;
      
      let minimapAdditon = "&#x2B1B;";//add blank;
      
      if (guess.charAt(k)==answer.charAt(k)) {
        
        // Correct numeral in correct position - Set GREEN colour
        
        tableRow.children[k].classList.add("green");
        minimapAdditon = "&#x1F7E9;";//add green
        correctCount++;
      
      } else if(answer.indexOf(guess.charAt(k))!=-1) {
        
        // Correct Numeral in wrong position - Decide whether YELLOW or GREY colour
        
        list_ans_ind = [...answer.matchAll(new RegExp(guess.charAt(k), 'gi'))].map(a => a.index);
        
        list_guess_ind = [...guess.matchAll(new RegExp(guess.charAt(k), 'gi'))].map(a => a.index);
        
        list_nonmatch_ind = list_guess_ind.slice(0);
        
        list_match_ind = [];
        
        list_ans_ind.map(ai => {

          if (list_guess_ind.indexOf(ai) != -1) {

            list_nonmatch_ind.splice(list_nonmatch_ind.indexOf(ai),1);
            
            list_match_ind.push(ai);
            
          } 
        });
          
        cur_nonmatch_pos = list_nonmatch_ind.filter(x => x <= k).length;

        // (n_MI = n_GI-n_NMI) GREEN + (n_AI - n_MI) YELLOW + (n_GI-n_AI) Black
        if (cur_nonmatch_pos > (list_ans_ind.length - (list_guess_ind.length - list_nonmatch_ind.length)) ) {
          
          // Extraneous Correct Numeral in wrong position - Set GREY colour
          
          tableRow.children[k].classList.add("void");

        } else {
          
          // Correct Numeral in wrong position - Set YELLOW colour
          
          minimapAdditon = "&#x1F7E8;";//add yellow
          
          let list_notguessed = list_ans_ind.filter(x => !list_guess_ind.includes(x));
          
          let flag_before = list_notguessed.some(x => x < k);
          let flag_after = list_notguessed.some(x => x > k);

          switch(true) {

            case (flag_before && flag_after):
              tableRow.children[k].classList.add("both");
              break;

            case (flag_before):
              tableRow.children[k].classList.add("left");
              break;

            case (flag_after):
              tableRow.children[k].classList.add("right");
              break;

          }
        } 
        
      } else {
        
        // Incorrect numeral - Set GREY colour
        tableRow.children[k].classList.add("void");
      }
        
      minimap += minimapAdditon;
      
    } // End of For loop
  
  minimap += "<br>";
  row_no++;
  
  if (correctCount>=5) {
    
    message.innerHTML = `Successfully decoded ${script_type} numerals`;
    show_result(1); // you win!
  
  } else if (row_no==6) {
    
    message.innerHTML = `Try decoding ${script_type} numerals again`;
    show_result(0); // you lose!
  }
  guess="";
}

function setRow(){
  
  if(row_no>5)
    return;
  
  const tableRow = document.getElementById(`row${row_no}`);
  
  for(let k=0; k<=4; k++){
    
    tableRow.children[k].innerHTML = "<p></p>";
    
    if(k<guess.length)      {
      if (hardmode)
        tableRow.children[k].innerHTML = `<p>${numeral_scripts['international'][guess.charAt(k)]}</p>`;
      else
        tableRow.children[k].innerHTML = `<p>${numeral_scripts[script_type][guess.charAt(k)]}</p>`;
    }
    
  }
}

let script_type, script_num, script_rnd_no=-1;

function populate_Numerale(){
  gameover = false;
  
  table.innerHTML="";
  numpad.innerHTML="";
  minimap="";
  
  script_num = 0;
  
  if (script_num=="-1") {
    script_rnd_no += 1;
    script_rnd_no = script_rnd_no%list_scripts.length;
    script_num = script_rnd_no; // Math.floor(Math.random() * list_scripts.length);
  }
  
  script_type = list_scripts[script_num];
  
  message.innerHTML = `Decoding ${script_type} numerals`
  
  answer = Math.round(Math.random()*89999)+10000;
  answer = answer.toString();
  guess = "";
  row_no=0;
  for(let k=0; k<6; k++){
    table.innerHTML += `<tr id="row${k}">
                        <td  style="--animation-order: ${k};"></td>
                        <td  style="--animation-order: ${k};"></td>
                        <td  style="--animation-order: ${k};"></td>
                        <td  style="--animation-order: ${k};"></td>
                        <td  style="--animation-order: ${k};"></td>
                        </tr>`;
 
  };

  for(let k=1; k<=10; k++){
    numpad.innerHTML += `<button onclick="add_Numeral(${k%10})"><p>${num_int[k%10]}</p></button>`;
  }
  numpad.innerHTML += `<br/><button onclick="remove_Numeral()"><p class="material-icons">backspace</p></button>`;
  numpad.innerHTML += `<button onclick="submitNumber()"><p class="material-icons">keyboard_return</p></button>`;
  
}

function show_result(res) {
  gameover = true;
  // console.log(minimap);
  let share_data;
  
  if (res==1) {
     share_data = `I decoded Indic #Numerale ${answer} in ${script_type} script ${row_no}/6<br><br>${minimap}`;
  
  } else {
    share_data = `I tried decoding Indic #Numerale ${answer} in ${script_type} script X/6<br><br>${minimap}`;
  }
  document.getElementById("sharedata").innerHTML = share_data;
  togglePanel("winner", "block");
}


function togglePanel(element, display){
  document.getElementById(element).style.display = display;
  if(display=="block")display="flex";
  document.getElementById(element).parentElement.style.display = display;
}

function toggleHardmode(){
  hardmode = !hardmode;
  
  if(hardmode){
    
    buttonText = "warning";
    document.getElementById("wrapper").classList.add("hardmode");
    document.getElementById("hardmodebutton").setAttribute("alt", "Hard mode is on!");
    document.getElementById("hardmodebutton").setAttribute("title", "Hard mode is on!");
    gsap.to("#hardmodenotification", 0, {display:"block", scale:0.5, opacity:1});
    gsap.to("#messages", 0.5, {display:"flex"});
    gsap.to("#hardmodenotification", 0.5, {display:"none", scale:1.5, opacity:0});
    gsap.to("#messages", 0.5, {display:"none"});
    document.getElementById("hardmodenotification").innerHTML = "Hardmode ON!";
    
  // if(display=="block")display="flex";
  // document.getElementById(element).parentElement.style.display = display;
  
  } else {
    
    buttonText = "sentiment_satisfied_alt";
    document.getElementById("wrapper").classList.remove("hardmode");
    document.getElementById("hardmodebutton").setAttribute("alt", "Hard mode is off");
    document.getElementById("hardmodebutton").setAttribute("title", "Hard mode is off");
    document.getElementById("hardmodenotification").innerHTML = "Hardmode OFF!";
    gsap.to("#hardmodenotification", 0, {display:"block", scale:0.5, opacity:1});
    gsap.to("#messages", 0.5, {display:"flex"});
    gsap.to("#hardmodenotification", 0.5, {display:"none", scale:1.5, opacity:0});
    gsap.to("#messages", 0.5, {display:"none"});
    
  }

  document.getElementById("hardmodebutton").firstChild.innerHTML = buttonText;
}

let row_no = 0;
let answer;
let guess = "";
let minimap = "";
let gameover = false;
let hardmode = false;


document.getElementById("sharebutton").addEventListener("click", async () => {
  try {
    
    const regex = /(<br>)+/g;
    
    let shareText = document.getElementById("sharedata").innerHTML.replace(regex, "\n");
    
    let linkURL = window.location.href;
    
    // shareText = `Numble #${answer} ${row}/6\n\n${shareText}`
    
    navigator.clipboard.writeText(shareText + linkURL).then( () => {
      console.log("Copied to clipboard!");
    });
    
   
    if (navigator.canShare) {
      navigator.share({
        title: 'Share results',
        text: shareText + linkURL,
        // url: linkURL,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    }
    
    //await navigator.share({ title: "Numble", text: shareText });
    // console.log("Data was shared successfully");
    
  } catch (err) {
    
    console.error("Share failed:", err.message);
    
  }
});

document.addEventListener("keypress", function onPress(event) {
    if ( (event.key === "N") || (event.key === "n") ) {
      populate_Numerale();
    }
    if ( (event.key === "H") || (event.key === "h") ) {
      toggleHardmode();
    }
    if ( (event.key >= "0") && (event.key <= "9") ) {
      add_Numeral(event.key);
    }
    if (event.key === "Enter") {
      submitNumber();
    }
    if (event.key === "@") {
      answer.split('').map(n => {
        add_Numeral(n);
      });
      // submitNumber();
    }
    if (event.key === "?") {
      togglePanel('about', 'block');
    };
  
});

document.addEventListener("keydown", function onPress(event) {
    if ( (event.key === "Delete") || (event.key === "Backspace") ) {
      remove_Numeral();
    }
    if (event.key === "Escape") {
      
      togglePanel('about', 'none');
      togglePanel("winner", "none");
      
      guess.split('').map(n => {
        remove_Numeral();
      });
      
    };
});

populate_Numerale();


