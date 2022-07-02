
document.querySelector(".control-buttons span").onclick = function () {
    (async () => {
    await Swal.fire({
        title: "Enter Your Name",
        html: '<input id="swal-input1" class="swal2-input">',
        focusConfirm: false,
        preConfirm: () => {
        return [
            document.getElementById("swal-input1").value,
            localStorage.setItem(
            "username",
            document.getElementById("swal-input1").value
            ),
        ];
        },
        allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
        if (result.isConfirmed) {
        document.querySelector(".name span").innerHTML =
            localStorage.getItem("username");
        }
    });
    })();
    document.querySelector(".control-buttons").remove();
    
};

let duration = 1000;
let blocksContainer = document.querySelector(".memory-game-blocks");
let blocks = Array.from(blocksContainer.children);
let orderRange = [...Array(blocks.length).keys()];
orderRange = shuffle(orderRange);
blocksContainer.classList.add('no-clicking')
blocks.forEach((block, index) => {
    block.style.order = orderRange[index];
    block.children[0].style.cssText = 'transform:rotateY(360deg);'
    block.children[1].style.cssText = 'transform:rotateY(360deg);'

    setTimeout(() => {
        block.children[0].style.cssText = 'transform:rotateY(-360deg);'
        block.children[1].style.cssText = 'transform:rotateY(-180deg);'
        blocksContainer.classList.remove('no-clicking')
    },10000)

    //block.classList.remove('front')
    block.addEventListener("click", () => {
    flipBlock(block);
    });
});


function flipBlock(selectedBlock) {
    selectedBlock.classList.add("is-flipped");

    let allFlippedBlock = blocks.filter((flippedBlock) =>
    flippedBlock.classList.contains("is-flipped")
    );

    if (allFlippedBlock.length === 2) {
    noClicking();
    checkMatchedBlock(allFlippedBlock[0], allFlippedBlock[1]);
    }

    if(diditWon()===true) {
        Swal.fire({
            position: 'center-center',
            icon: 'success',
            title: 'Congratulations',
            showConfirmButton: false,
            timer: 2500
            })
    }
    
}

function noClicking() {
    blocksContainer.classList.add("no-clicking");
    setTimeout(() => {
    blocksContainer.classList.remove("no-clicking");
    }, duration);
}

function checkMatchedBlock(firstBlock, secondBlock) {
    let triesElement = document.querySelector(".tries span");

    if (firstBlock.dataset.technology === secondBlock.dataset.technology) {
    firstBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");

    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");
    document.getElementById("success").play();
    } else {
    triesElement.innerHTML = parseInt(triesElement.innerHTML) + 1;
    if(triesElement.innerHTML > 5){
        JSalert()
    }
    setTimeout(() => {
        firstBlock.classList.remove("is-flipped");
        secondBlock.classList.remove("is-flipped");
    }, duration);
    document.getElementById("fail").play();
    }
}


function shuffle(array) {
    let current = array.length,
    temp,
    random;
    while (current > 0) {
    random = Math.floor(Math.random() * current);
    current--;
    //[1] Save Current element in stach
    temp = array[current];
    //[2] current element = random element
    array[current] = array[random];
    //[3] random element = get element from stach
    array[random] = temp;
    }
    return array;
}

function diditWon() {
    didHeWon = true;
    blocks.forEach((block)=>{
        if(! block.classList.contains('has-match')){
            didHeWon = false;
        }
    })
    return didHeWon;
}

function JSalert(){
    (async () => {
        await Swal.fire({
        title: 'Do you want to try again!?',
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
        }).then((result) => {
        if (result.isConfirmed) {
            window.location.reload();
        } else if (result.isDenied) {
            window.opener = self;
            window.close();
        }
    })})()
}