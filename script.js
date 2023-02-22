console.log("Welcome to ❌⭕, hope  you understand");
let clickX_audio = new Audio("./sound/click.wav");
let turnY_audio = new Audio("./sound/turn.wav");
let winnerpraise_audio = new Audio("./sound/praise.wav");
let drawgame_audio = new Audio('./sound/drawmatch.wav')
let currentturn = "❌";
let isgameover = false;
let cellsFilled = 0;

//function to change the turn
const changeTurn = () => {
    return currentturn === "❌" ? "⭕" : "❌";
};

//function to check for a win
const checkWin = () => {
    //returns a array of span element with class boxtext
    let boxtext = document.getElementsByClassName("boxtext");
    /*
    we know the winning criteria as follows :-
                  0 | 1 | 2
                ----|---|----
                  3 | 4 | 5  
                ----|---|----
                  6 | 7 | 8  

        any row :-       0,1,2     3,4,5     6,7,8
        any column:-     0,3,6     1,4,7     2,5,8
        any diagonal:-   0,4,8     2,4,6

    */
    let wins = [
        //row wise win possiblities
        [0, 1, 2, 1, 9, 0],
        [3, 4, 5, 1, 21, 0],
        [6, 7, 8, 1, 33, 0],
        //column wise win possibilities
        [0, 3, 6, -11, 21, 90],
        [1, 4, 7, 1, 21, 90],
        [2, 5, 8, 13, 21, 90],
        //diagonal wise win possibilities
        [0, 4, 8, 1, 21, 45],
        [2, 4, 6, 1, 21, -45],
    ];
    wins.forEach( win_indices => {
        if (
        (boxtext[win_indices[0]].innerText == boxtext[win_indices[1]].innerText) &&
        (boxtext[win_indices[1]].innerText == boxtext[win_indices[2]].innerText) && //2 checks  enough
        (boxtext[win_indices[2]].innerText != "")  //avoid counting in blank boxes 
        ) {
            //if for any win_indices in wins this if condition is true then the current innerText in comparison i.e either X or O is a winner
            //below returns the first occurence of element with class info and updates innerText
            document.querySelector(".info").innerText = boxtext[win_indices[0]].innerText + " has Won🎉";
            document.querySelector(".info").style.fontSize = "55px";
            isgameover = true;
            //strike the winners move, note to perform translation before rotation
            // JavaScript template literals require backticks, not straight quotation marks.
            // https://stackoverflow.com/questions/37245679/template-literals-like-some-string-or-some-string-are-not-working
            document.querySelector('.line').style.height = "1vw";//show the hidden light
            document.querySelector('.line').style.transform =  `translate(${win_indices[3]}vw, ${win_indices[4]}vw) rotate(${win_indices[5]}deg)`;

            console.log(boxtext[win_indices[0]].innerText + " has Won🎉");

            // intially our bear had 0 width i.e. indirectly we have hidden it😅 but upon winning we simply set size to 200px
            document.querySelector('.imgbox').getElementsByTagName('img')[0].style.width = "200px"; 
            //slow transition
            document.querySelector('.imgbox').getElementsByTagName('img')[0].style.transition = "1s";

            winnerpraise_audio.load();
            winnerpraise_audio.play();
            
        }
    });
    if(!isgameover) {
        console.log("Till now no one has won🙄");
        cellsFilled++;
    }
};

// below returns a html collection of all elements with class name box
let boxes = document.getElementsByClassName("box");
Array.from(boxes).forEach( element => {
    //below variable stores the span element of each element i.e. each div of class box
    let boxtext = element.querySelector(".boxtext");
    //adding event listener to each box text so that its value vcan be altered when clicked
    
    element.addEventListener("click", () => {
        if (boxtext.innerText === "") {
            //blank nothing is displayed then first turn will go to X
            boxtext.innerText = currentturn;
            currentturn = changeTurn();
            //if you want to hear complete audio press a little late
            //everytime its clicked load ensures it starts again rather than completing the old.....so that you hear the sound every time you click
            if(currentturn == "❌"){
                clickX_audio.load();
                clickX_audio.play();
            }
            else{
                turnY_audio.load();
                turnY_audio.play();
            }

            //now check if after the turn has been done has smeone won
            checkWin();

            // update the text showing whose gets the current turn if no one has won already
            if(!isgameover && cellsFilled < 9){
                document.getElementsByClassName("info")[0].innerText = "Turn for " + currentturn;
            }
            else if(!isgameover && cellsFilled == 9){
                document.querySelector(".info").innerText = " Both seem to be tough players eh!😯.\nPlease Reset, you have filled the grid already.";
                document.querySelector(".info").style.fontSize = "50px";
                //reset cells filled 
                cellsFilled = 0;

                drawgame_audio.load();
                drawgame_audio.play();
            }
            else if(isgameover){
                //someone has won
                cellsFilled = 0;
            }
        }
    });
});


//adding on click event listener to reset button so that it can act as refresh button at any time of the match instead of reloading the entire page
reset.addEventListener('click', ()=>{
    let boxtexts =  document.querySelectorAll('.boxtext');
    Array.from(boxtexts).forEach(element => {
        // reset each inner text to blank
        element.innerText = "";
    })
    //now we need to set new game
    isgameover = false;
    // we provide the loser i.e. the last move player the chance to start first.
    document.querySelector(".info").innerText = currentturn + " get's the first chance to play now.";
    document.querySelector(".info").style.fontSize = "35px";
    //hide our bear now
    document.querySelector('.imgbox').getElementsByTagName('img')[0].style.width = "0px";
    //immediate transition
    document.querySelector('.imgbox').getElementsByTagName('img')[0].style.transition = "0s";
    // hide the line
    document.querySelector('.line').style.height = "0vw";
    console.log("Reset was used to repaint the sheet!!!");
    winnerpraise_audio.pause();
})