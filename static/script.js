const  app = document.querySelector('.app'),
       mode = document.querySelector('#mode'),

       chats = document.querySelector('.chats'),
       add_chat = document.querySelector('#add-chat'),

       clear = document.querySelector('#delete'),

       qna = document. querySelector('.qna'),
       
       input = document.querySelector('.request input'),
       send = document.querySelector('#send');


//clear conversation     

clear. addEventListener('click', ()=> chats.innerHTML = '');




//create tab for new chat
add_chat. addEventListener('click', addNewChat);


function addNewChat(){
    chats.innerHTML += `
    <li>
                    <div>
                        <iconify-icon icon="bi:chat-left" class="icon"></iconify-icon>
                        <span class="chat=title" contenteditable>New Chat</span>
                    </div>                
                    <div>
                        <iconify-icon icon="bi:trash3" class="icon" onclick="removeChat(this)"></iconify-icon>
                        <iconify-icon icon="fluent:pen-28-regular" class="icon" onclick="updateChatTitle(this)"></iconify-icon>
                    </div>                
    </li>`;

   }



const removeChat = (el) => el.parentElement.parentElement.remove() ;
const updateChatTitle = (el) => el.parentElement.previousElementSibling.lastElementChild.focus;














mode. addEventListener('click', toggleMode);

//update light mode & dark mode         
function toggleMode(){
// console.log( 'slicked' );
const light_mode = app.classList.contains('light');
app.classList.toggle('light', !light_mode) ;

mode.innerHTML= `<iconify-icon icon="bi:${light_mode ? 'brightness-high' : 'moon'}" class="icon"></iconify-icon> ${light_mode ?'light Mode' : 'dark mode'}`       
}






//TypeWriter Effects
function typeWriter(el, ans) {
    let i=0,
    interval = setInterval(() => {
        qna.scrollTop= qna.scrollHeight;
        if(i< ans.length){
            el.innerHTML += ans.charAt(i);
            i++;
        }else{
            clearInterval(interval)
        }
    }, 13);
}











var typed = new Typed(".auto-input", {
    strings: ["ChatGPT Vs Bard...","!!..Integrated AI Dashboard..!!"],
    typeSpeed: 100,
    backSpeed: 100,
    loop: false
})

















send.addEventListener( 'click' , getAnswer) ;
input.addEventListener('keyup',  (e)=>{
        
    if(e.key ==='Enter') {
        getAnswer()
        
    }
});




function getAnswer() {
    $(document).ready(function () {
        var question = $("#chat-input").val();
        let html_data = '';

        html_data += `
        <div href="#" id ="que" class="question">
            <iconify-icon icon="bxs:user" class="icon blue"></iconify-icon>
            <h3>${question}</h3>
        </div>
        `;
        $("#chat-input").val('');
        $(".result").append(html_data);

        // Show loading message
        $(".result").append('<img src="/static/images/loading.svg" class="loading" alt="Loading...">');

        // AJAX CALL TO SERVER
        $.ajax({
            type: "POST",
            url: "/",
            data: { 'prompt': question },
            success: function (data) {
                // Hide loading message
                $(".loading").remove();

                let gpt_data = '';
                gpt_data += `
                <div class="output-container">
                    <div class="answer1">
                        <img src="/static/images/gpt.png" alt="" class="logo">
                        <p class="response1">${data.response1}</p> 
                        
                        
                    </div>
                    <div class="answer2">
                        <img src="/static/images/bard_logo.svg" alt="" class="logo">
                        <p class="response2">${data.response2}</p> 


                    </div>
                </div>
                `;
                $(".result").append(gpt_data);

            }
        });
    });
}






















let chart = null; // Declare a variable to hold the chart instance

document.getElementById("chatgptButton").addEventListener("click", function() {
    recordResponse("ChatGPT");
});

document.getElementById("bardButton").addEventListener("click", function() {
    recordResponse("Bard");
});

function recordResponse(model) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/record_response", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
               showChart();
            fetchAndPlotSurveyData();
        }
    };
    xhr.send("model=" + model);
}

function fetchAndPlotSurveyData() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "/get_survey_data", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const surveyData = JSON.parse(xhr.responseText);
            updateChart(surveyData);
        }
    };
    xhr.send();
}


function updateChart(surveyData) {
    if (chart) {
        chart.destroy(); // Destroy the previous chart instance
    }

    const ctx = document.getElementById("surveyChart").getContext("2d");
    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: surveyData.models,
            datasets: [{
                label: "Votes",
                data: surveyData.votes,
                backgroundColor: ["#00ad81", "#fff"],
                borderColor: ["#004d3e", "#ccc"],
                borderWidth: 1,
            }],
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    stepSize: 1,
                    grid: {
                        color: "#fff1", 
                    },
                },
                x: {
                    grid: {
                        color: "#fff1", 
                    },
                },
            },
     
        },
        
    });
}

// Initial chart creation
updateChart({ models: [], votes: [] });

function showChart() {
    const chartContainer = document.querySelector(".chart-container");
    chartContainer.style.display = "block"; // Show the chart container
}

