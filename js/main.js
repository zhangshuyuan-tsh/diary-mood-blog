//一、语录轮播数据
const quoteArr = [
    "慢慢理解世界，慢慢更新自己",
    "生活细碎，万物可爱，日子温柔",
    "把烦心事丢掉，腾出地方装鲜花",
    "平凡的日子也在闪闪发光",
    "好好生活，所有美好正在路上"
];
let index = 0;
const lunboDom = document.getElementById("lunbo");
if(lunboDom){
    setInterval(()=>{
        index = (index+1)%quoteArr.length;
        lunboDom.innerText = quoteArr[index];
    },3000);
}

//二、心情打卡-本地存储 localStorage
let diaryList = JSON.parse(localStorage.getItem("diaryData")) || [];
const moodForm = document.getElementById("moodForm");
if(moodForm){
    moodForm.addEventListener("submit",function(e){
        e.preventDefault();
        let mood = document.getElementById("moodSelect").value;
        let text = document.getElementById("diaryText").value.trim();
        if(!text){
            alert("请输入日记内容！");
            return;
        }
        let data = {
            mood:mood,
            content:text,
            time:new Date().toLocaleDateString()
        };
        diaryList.unshift(data);
        localStorage.setItem("diaryData",JSON.stringify(diaryList));
        alert("打卡保存成功！");
        moodForm.reset();
        renderDiary();
        countMood();
    })
}

//三、渲染日记 + 筛选日记
const diaryWrap = document.getElementById("diaryWrap");
const filterSel = document.getElementById("filterMood");
//渲染函数
function renderDiary(sel="all"){
    if(!diaryWrap) return;
    diaryWrap.innerHTML = "";
    let arr = sel==="all"?diaryList:diaryList.filter(item=>item.mood===sel);
    if(arr.length===0){
        diaryWrap.innerHTML="<p>暂无日记记录</p >";
        return;
    }
    arr.forEach(item=>{
        let div = document.createElement("div");
        div.className="diary-card";
        div.innerHTML=`
            <h3>${item.mood}</h3>
            <p>${item.content}</p >
            <p style="margin-top:10px;color:#777">${item.time}</p >
        `;
        diaryWrap.appendChild(div);
    })
}
//筛选切换
if(filterSel){
    filterSel.onchange = function(){
        renderDiary(this.value);
    }
}
renderDiary();

//四、心情统计计算（mood页面表格）
function countMood(){
    let happy = diaryList.filter(i=>i.mood==="开心").length;
    let normal = diaryList.filter(i=>i.mood==="平淡").length;
    let sad = diaryList.filter(i=>i.mood==="难过").length;
    let work = diaryList.filter(i=>i.mood==="忙碌").length;
    let heal = diaryList.filter(i=>i.mood==="治愈").length;

    let hp = document.getElementById("happy");
    let nm = document.getElementById("normal");
    let sd = document.getElementById("sad");
    let wk = document.getElementById("work");
    let hl = document.getElementById("heal");
    if(hp)hp.innerText=happy;
    if(nm)nm.innerText=normal;
    if(sd)sd.innerText=sad;
    if(wk)wk.innerText=work;
    if(hl)hl.innerText=heal;
}
countMood();

//五、留言板功能
let msgList = JSON.parse(localStorage.getItem("msgData")) || [];
const msgForm = document.getElementById("msgForm");
const msgWrap = document.getElementById("msgWrap");
//渲染留言
function renderMsg(){
    if(!msgWrap)return;
    msgWrap.innerHTML="";
    if(msgList.length===0){
        msgWrap.innerHTML="<p>暂无留言，快来第一条吧~</p >";
        return;
    }
    msgList.forEach((item,idx)=>{
        let div = document.createElement("div");
        div.className="msg-item";
        div.innerHTML=`
            <div><strong>${item.name}</strong>：${item.content}</div>
            <button onclick="delMsg(${idx})">删除</button>
        `;
        msgWrap.appendChild(div);
    })
}
//删除留言
window.delMsg = function(idx){
    msgList.splice(idx,1);
    localStorage.setItem("msgData",JSON.stringify(msgList));
    renderMsg();
}
//提交留言
if(msgForm){
    msgForm.addEventListener("submit",e=>{
        e.preventDefault();
        let n = document.getElementById("msgName").value.trim();
        let t = document.getElementById("msgText").value.trim();
        if(!n||!t){
            alert("昵称和内容不能为空！");
            return;
        }
        msgList.unshift({name:n,content:t});
        localStorage.setItem("msgData",JSON.stringify(msgList));
        msgForm.reset();
        renderMsg();
    })
}
renderMsg();