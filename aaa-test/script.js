function reverseString(string){
  let arr="";
    for(let i=0;i<string.length;i++){
    arr+=string[string.length-1-i];
  }
  return arr;
}