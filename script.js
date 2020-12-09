window.onload = function(){
    criaPixel()
}

let board = document.querySelector("#pixel-board")

function criaPixel(){
    for(let i = 0; i<25; i++){
        let pixel = document.createElement('div')
        pixel.classList = "pixel"
        pixel.style.border = "black 1px solid"
        board.appendChild(pixel)
    }
    
    
}