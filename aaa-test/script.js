function spinalCase(arr) {
    return arr.replace(/([a-z]\s)/,'$1-').replace(/[\s|_]/g, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
console.log(spinalCase("This Is Spinal Tap"));
console.log(spinalCase("thisIsSpinalTap"));
console.log(spinalCase("The_Andy_Griffith_Show"));
console.log(spinalCase("Teletubbies say Eh-oh"));

