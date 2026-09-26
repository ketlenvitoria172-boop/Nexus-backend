<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>NEXUS AI</title>

<style>
*{
    box-sizing:border-box;
    margin:0;
    padding:0;
    font-family:Arial,sans-serif;
}

body{
    background:#0b0f14;
    color:#fff;
    height:100vh;
    overflow:hidden;
}

.app{
    display:flex;
    height:100vh;
}

.sidebar{
    width:260px;
    background:#080b0f;
    border-right:1px solid #202630;
    padding:20px;
    display:flex;
    flex-direction:column;
}

.logo{
    font-size:25px;
    font-weight:bold;
    letter-spacing:3px;
    margin-bottom:25px;
}

.new-chat{
    width:100%;
    padding:13px;
    border:1px solid #303844;
    background:#11161d;
    color:white;
    border-radius:10px;
    cursor:pointer;
}

.new-chat:hover{
    background:#181e27;
}

.main{
    flex:1;
    display:flex;
    flex-direction:column;
    min-width:0;
}

.header{
    height:65px;
    border-bottom:1px solid #202630;
    display:flex;
    align-items:center;
    padding:0 20px;
    font-weight:bold;
}

.chat{
    flex:1;
    overflow-y:auto;
    padding:25px;
}

.message{
    max-width:850px;
    margin:0 auto 22px;
    padding:16px 18px;
    border-radius:14px;
    line-height:1.55;
    white-space:pre-wrap;
}

.user{
    background:#18212c;
}

.ai{
    background:#10151c;
    border:1px solid #202630;
}

.label{
    font-size:12px;
    opacity:.55;
    margin-bottom:7px;
    font-weight:bold;
}

.input-area{
    padding:15px;
    border-top:1px solid #202630;
}

.input-box{
    max-width:850px;
    margin:auto;
    display:flex;
    gap:10px;
    background:#11161d;
    border:1px solid #303844;
    border-radius:14px;
    padding:8px;
}

textarea{
    flex:1;
    resize:none;
    background:transparent;
    color:white;
    border:0;
    outline:none;
    padding:10px;
    font-size:15px;
    min-height:44px;
    max-height:150px;
}

.send{
    width:48px;
    height:48px;
    border:0;
    border-radius:10px;
    background:#fff;
    color:#000;
    font-size:20px;
    cursor:pointer;
}

.send:disabled{
    opacity:.5;
}

.typing{
    opacity:.6;
}

@media(max-width:700px){
    .sidebar{
        display:none;
    }

    .chat{
        padding:15px;
    }

    .message{
        font-size:15px;
    }
}
</style>
</head>

<body>

<div class="app">

    <aside class="sidebar">
        <div class="logo">NEXUS</div>

        <button class="new-chat" onclick="newChat()">
            + Nova conversa
        </button>
    </aside>

    <main class="main">

        <header class="header">
            NEXUS AI
        </header>

        <section id="chat" class="chat">
            <div class="message ai">
                <div class="label">NEXUS</div>
                Olá. Eu sou o NEXUS. Como posso ajudar?
            </div>
        </section>

        <div class="input-area">
            <div class="input-box">

                <textarea
                    id="input"
                    placeholder="Digite sua mensagem..."
                    onkeydown="handleKey(event)"
                ></textarea>

                <button
                    id="send"
                    class="send"
                    onclick="sendMessage()"
                >
                    ↑
                </button>

            </div>
        </div>

    </main>

</div>

<script>

let conversation = [];

const input = document.getElementById("input");
const chat = document.getElementById("chat");
const sendButton = document.getElementById("send");

function addMessage(type,text){

    const message = document.createElement("div");

    message.className = "message " + type;

    const label = document.createElement("div");

    label.className = "label";

    label.textContent =
        type === "user" ? "VOCÊ" : "NEXUS";

    const content = document.createElement("div");

    content.textContent = text;

    message.appendChild(label);
    message.appendChild(content);

    chat.appendChild(message);

    chat.scrollTop = chat.scrollHeight;

    return message;
}

function handleKey(event){

    if(event.key === "Enter" && !event.shiftKey){

        event.preventDefault();

        sendMessage();
    }
}

async function sendMessage(){

    const text = input.value.trim();

    if(!text) return;

    addMessage("user",text);

    conversation.push({
        role:"user",
        content:text
    });

    input.value = "";

    sendButton.disabled = true;

    const loading = addMessage(
        "ai",
        "Pensando..."
    );

    loading.classList.add("typing");

    try{

        const response = await fetch("/api/chat",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                messages:conversation
            })

        });

        const data = await response.json();

        if(!response.ok){
            throw new Error(
                data.error || "Erro no servidor."
            );
        }

        loading.remove();

        addMessage("ai",data.reply);

        conversation.push({
            role:"assistant",
            content:data.reply
        });

    }catch(error){

        loading.remove();

        addMessage(
            "ai",
            "Erro: " + error.message
        );

    }finally{

        sendButton.disabled = false;

        input.focus();
    }
}

function newChat(){

    conversation = [];

    chat.innerHTML = `
        <div class="message ai">
            <div class="label">NEXUS</div>
            Nova conversa iniciada. Como posso ajudar?
        </div>
    `;

    input.focus();
}

</script>

</body>
</html>
