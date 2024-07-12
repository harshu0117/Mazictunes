console.log("let's write the code...");
let currentSong = new Audio();
let songs;
let currFolder;

function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}






async function getSongs(folder) { 
    try {
        // Fetch songs data from the server
        currFolder = folder;
        let response = await fetch(`/songs/${folder}/`);
        let html = await response.text();
        console.log(html);

        // Create a temporary div element to parse the response HTML
        let div = document.createElement("div");
        div.innerHTML = html;

        // Extract all <a> elements from the response HTML
        let as = div.getElementsByTagName("a");
        songs = [];

        // Iterate through each <a> element
        for (let index = 0; index < as.length; index++) {
            const element = as[index];
            // If the href attribute of the <a> element ends with ".mp3", push it to the songs array
            if (element.href.endsWith(".mp3")) {
                // songs.push(element.href.split(`/${folder}/`)[1]);
                songs.push(decodeURIComponent(element.href.split(`${folder}/`)[1]));

            }

            
        }

        let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
        songUL.innerHTML = ""
        for (const song of songs) {
            songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div> ${song.replace(/%20/g, " ")}</div>
                                <div>Harsh</div>
                            </div>
                            <img  class="invert" src="img/play.svg" alt="">
                            <div class="playnow">
                                
                                Play Now 
                            </div></li>`;
        }


        //attach event listner to each song
        Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", element=> {
                console.log(e.querySelector(".info").firstElementChild.innerHTML)
                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            })
        })

        return songs
         // Return the list of song URLs
    } catch (error) {
        console.error("Error fetching songs:", error);
        return []; // Return an empty array in case of error
    }

    
}




    const playMusic = (track, pause = false) => {
        // let audio = new Audio()
        if (!pause) {
            currentSong.src = `/songs/${currFolder}/`+ track
            currentSong.play()
        }

        play.src = "/img/pause.svg"
        document.querySelector(".songinfo").innerHTML = decodeURI(track)
        document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

    }

    

        // Load the playlist whenever card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e => { 
            e.addEventListener("click", async item => {
                console.log("Fetching Songs")
                songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
                playMusic(songs[0])
    
            })
        })
  

    async function main() {

        await getSongs("ncs"); // Wait for getSongs to complete and get the result
        playMusic(songs[0], true)


        

        //add event listner
        play.addEventListener("click", () => {
            if (currentSong.paused) {
                currentSong.play();
                play.src = "/img/pause.svg"; // Change the source of the play button to pause.svg
            } else {
                currentSong.pause();
                play.src = "/img/play.svg"; // Change the source of the play button to play.svg
            }
        });

        //update time event
        currentSong.addEventListener("timeupdate", () => {
            console.log(currentSong.currentTime, currentSong.duration);
            document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        })

        //seekbar event listner
        document.querySelector(".seekbar").addEventListener("click", e => {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
            document.querySelector(".circle").style
        })

        //event listner hamberger
        document.querySelector(".seekbar").addEventListener("click", e => {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            document.querySelector(".circle").style.left = percent + "%";
            currentSong.currentTime = ((currentSong.duration) * percent) / 100
        })

        // Add an event listener for hamburger
        document.querySelector(".hamburger").addEventListener("click", () => {
            document.querySelector(".left").style.left = "0"
        })

        // Add an event listener for close button
        document.querySelector(".close").addEventListener("click", () => {
            document.querySelector(".left").style.left = "-120%"
        })

        // //add event listner preveious
        // previous.addEventListener("click", () => {
        //     let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        //     console.log("previous clicked")
        //     if ((index - 1) >= 0) {
        //         playMusic(songs[index - 1])
        //     }

        // })

        // //add event listner next
        // next.addEventListener("click", () => {
        //     let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        //     console.log("next clicked")
        //     if ((index ) <= songs.length) {
        //         playMusic(songs[index + 1])
        //     }

        // })

        //add event listner volume
        document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
            console.log(e, e.value, e.target.value)
            currentSong.volume = parseInt(e.target.value) / 100
        })

        //load playlist by data attribute
        Array.from(document.getElementsByClassName("card")).forEach(e=>{
            console.log(e)
            console.log("hiii")
            e.addEventListener("click", async item=>{
                songs = await getSongs(`/${item.currentTarget.dataset.folder}`)
                
            })
        })


        // Add event listener to mute the track
        document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })

    }



    main(); // Call the main function
