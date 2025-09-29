let lunches = [];

function addLunchToEnd(arr, string) {
    arr.push(string);
    console.log(`${string} added to the end of the lunch menu.`);
    return arr;
}

function addLunchToStart(arr, string) {
    arr.unshift(string);
    console.log(`${string} added to the start of the lunch menu.`);
    return arr;
}

function removeLastLunch(arr) {
    if(arr==""){
        console.log("No lunches to remove.")
    }
    else{
        let string=arr[arr.length-1];
        arr.pop();
        console.log(`${string} removed from the end of the lunch menu.`);
    
    }
    return arr;
    
}

function removeFirstLunch(arr) {
    if(arr==""){
        console.log("No lunches to remove.")
    }
    else{
        let string=arr[0];
        arr.shift();
        console.log(`${string} removed from the start of the lunch menu.`);
    
    }
    return arr;
    
}

function getRandomLunch(arr) {
    if(arr==""){
        console.log("No lunches available.")
    }
    else{
        let string=arr[Math.floor(Math.random() * arr.length)];
        console.log(`Randomly selected lunch: ${string}`);
    
    }
    
}

function showLunchMenu(arr) {
    if(arr==""){
        console.log("The menu is empty.")
    }
    else{
        let string="";
        for(let i=0;i<arr.length;i++){
            string+=arr[i];
            if(i<arr.length-1){
                string+=", ";
            }
        }

        console.log(`Menu items: ${string}`);
    
    }
    
}


