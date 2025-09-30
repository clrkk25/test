const names = ["Hole-in-one!", "Eagle", "Birdie", "Par", "Bogey", "Double Bogey", "Go Home!"];
function golfScore(par,strokes){
  let arr="";
  if(par===1)
  {
    arr="Hole-in-one!";
  }
  else if(strokes<=par-2){
    arr="Eagle";
  }
  else if(strokes===par-1){
    arr="Birdie";
  }
  else if(strokes===par){
    arr="Par";
  }
  else if(strokes===par+1){
    arr="Bogey";
  }
  else if(strokes===par+2){ 
    arr="Double Bogey";
  }
  else{
    arr="Go Home!";
  }

  return arr;
}