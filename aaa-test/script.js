function spinalCase(arr){
  return arr.replace(/\s/g,"-").replace(/([A-Z])/g,"-$1");
}

console.log(spinalCase("thisIsSpinalTap"));