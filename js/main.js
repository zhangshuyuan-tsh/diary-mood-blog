/*
软件名称：治愈心情日记管理系统
版本号：V1.0
开发完成日期：2026年07月
著作权人：张树源                                                                       
开发语言：HTML / CSS / JavaScript
*/
// 一、访问密码锁定功能
// 首次访问密码锁定（仅第一次打开网站弹窗，跳转首页不再重复弹出）
const pwdModal = document.getElementById("pwdModal");
const pwdInput = document.getElementById("pwdInput");
const pwdSubmit = document.getElementById("pwdSubmit");
// 预设固定密码
const CORRECT_PWD = "123456";
// 读取本地标记：是否已经完成首次密码验证
const isFirstPass = localStorage.getItem("systemFirstPass");

// 已经验证过：直接隐藏弹窗
if(isFirstPass) {
    pwdModal.style.display = "none";
} else {
    // 首次打开：显示密码框
    pwdModal.style.display = "flex";
}

// 密码提交逻辑
if(pwdSubmit){
    pwdSubmit.onclick = function(){
        let inputPwd = pwdInput.value.trim();
        if(inputPwd === CORRECT_PWD){
            // 验证成功，写入标记，永久免密
            localStorage.setItem("systemFirstPass", "ok");
            pwdModal.style.display = "none";
        }else{
            alert("密码错误，请重新输入");
            pwdInput.value = "";
        }
    }
}
//二、用户昵称模块
let userName = localStorage.getItem("diaryUserName");
const userModal = document.getElementById("userModal");
const userNameInput = document.getElementById("userNameInput");
const saveUserBtn = document.getElementById("saveUserBtn");
const userShow = document.getElementById("userShow");

// 没有昵称则弹出弹窗，已有昵称直接展示
if(userModal){
   if(userName){
    userModal.style.display = "none";
    userShow.innerText = "当前用户：" + userName;
   }else{
    userModal.style.display = "flex";
  }
  // 保存昵称到本地存储
    if(saveUserBtn){
       saveUserBtn.onclick = function(){
          let name = userNameInput.value.trim();
           if(name===""){
            alert("昵称不能为空");
            return;
            }
            localStorage.setItem("diaryUserName", name);
             userName = name;
             userModal.style.display = "none";
              userShow.innerText = "当前用户：" + userName;
       }
    }
}
//三、语录轮播数据
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

//四、心情打卡-本地存储 localStorage
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

//五、渲染日记 + 筛选日记
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

//六、心情统计计算（mood页面表格）
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

//七、留言板功能
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
// 导出日记为TXT文件
const exportDiaryBtn = document.getElementById("exportDiaryBtn");
if(exportDiaryBtn){
    exportDiaryBtn.onclick = function(){
        if(diaryList.length === 0){
            alert("暂无日记可以导出");
            return;
        }
        let textContent = "===== 治愈心情日记记录 =====\n";
        textContent += "导出用户：" + userName + "\n";
        textContent += "导出时间：" + new Date().toLocaleString() + "\n\n";

        diaryList.forEach((item, index)=>{
            textContent += `【第${index+1}条】\n日期：${item.time}\n心情：${item.mood}\n内容：${item.content}\n-------------------------\n`;
        });

        // 生成文件并下载
        let blob = new Blob([textContent], {type: "text/plain;charset=utf-8"});
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "心情日记记录.txt";
        a.click();
        URL.revokeObjectURL(a.href);
    }
}
// 清空日记
const clearDiaryBtn = document.getElementById("clearDiaryBtn");
if(clearDiaryBtn){
    clearDiaryBtn.onclick = function(){
        if(window.confirm("确定要永久删除所有日记吗？删除后无法恢复！")){
            diaryList = [];
            localStorage.setItem("diaryData", JSON.stringify(diaryList));
            renderDiary();
            countMood();
            alert("日记已全部清空");
        }
    }
}

// 清空留言
const clearMsgBtn = document.getElementById("clearMsgBtn");
if(clearMsgBtn){
    clearMsgBtn.onclick = function(){
        if(window.confirm("确定要清空所有留言吗？")){
            msgList = [];
            localStorage.setItem("msgData", JSON.stringify(msgList));
            renderMsg();
            alert("留言已全部清空");
        }
    }
}
//八、导航无历史跳转函数
function goPage(url){
    location.replace(url);
}
//优化手机返回逻辑
const path = location.href;
//首页预先压一条历史，方便一键退出
if(path.includes("index.html")){
    history.pushState({},'',path);
}else{
    //子页面替换历史，返回一次就回首页
    history.replaceState({},'','index.html');
    history.pushState({},'',path);
}
//监听物理返回键
window.addEventListener('popstate',()=>{
    //在首页触发返回，关闭页面
    if(location.href.includes('index.html')){
        history.go(-(history.length-1));
    }
})