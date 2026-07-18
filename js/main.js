/*
软件名称：治愈心情日记管理系统
版本号：V1.0
开发完成日期：2026年07月
著作权人：张树源
开发语言：HTML / CSS / JavaScript
*/
// 全局统一数据读写封装（所有页面、所有软著功能必须调用这套方法）
// 日记数据
function getLatestDiaryData() {
  const str = localStorage.getItem('diaryData');
  return str ? JSON.parse(str) : [];
}
function saveDiaryData(list) {
  localStorage.setItem('diaryData', JSON.stringify(list));
}
// 留言数据
function getLatestMsgData() {
  const str = localStorage.getItem('msgData');
  return str ? JSON.parse(str) : [];
}
function saveMsgData(list) {
  localStorage.setItem('msgData', JSON.stringify(list));
}
// 软著新增：用户昵称读写
function getUserName() {
  return localStorage.getItem("diaryUserName") || "";
}
function saveUserName(name) {
  localStorage.setItem("diaryUserName", name.trim());
}

// 所有逻辑等待DOM完全加载完毕再执行，解决元素获取不到、渲染空白

    // 一、访问密码锁定功能
    const pwdModal = document.getElementById("pwdModal");
    const pwdInput = document.getElementById("pwdInput");
    const pwdSubmit = document.getElementById("pwdSubmit");
    const CORRECT_PWD = "123456";
    const isFirstPass = localStorage.getItem("systemFirstPass");

    if(pwdModal) {
        if(isFirstPass) {
            pwdModal.style.display = "none";
        } else {
            pwdModal.style.display = "flex";
        }

        if(pwdSubmit){
            pwdSubmit.onclick = function(){
                let inputPwd = pwdInput.value.trim();
                if(inputPwd === CORRECT_PWD){
                    localStorage.setItem("systemFirstPass", "ok");
                    pwdModal.style.display = "none";
                }else{
                    alert("密码错误，请重新输入");
                    pwdInput.value = "";
                }
            }
        }
    }

    // 二、用户昵称模块
    let userName = getUserName();
    const userModal = document.getElementById("userModal");
    const userNameInput = document.getElementById("userNameInput");
    const saveUserBtn = document.getElementById("saveUserBtn");
    const userShow = document.getElementById("userShow");

    if(userModal && userShow){
       if(userName){
        userModal.style.display = "none";
        userShow.innerText = "当前用户：" + userName;
       }else{
        userModal.style.display = "flex";
      }
      if(saveUserBtn){
         saveUserBtn.onclick = function(){
            let name = userNameInput.value.trim();
             if(name===""){
              alert("昵称不能为空");
              return;
            }
            saveUserName(name);
            userName = name;
            userModal.style.display = "none";
            userShow.innerText = "当前用户：" + userName;
         }
      }
    }

    // 三、语录轮播数据
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

    // 四、心情打卡提交
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
            let diaryList = getLatestDiaryData();
            diaryList.unshift(data);
            saveDiaryData(diaryList);
            alert("打卡保存成功！");
            moodForm.reset();
            renderDiary();
            countMood();
        })
    }

    // 五、渲染日记 + 筛选日记
    const diaryWrap = document.getElementById("diaryWrap");
    const filterSel = document.getElementById("filterMood");
    function renderDiary(sel="all"){
        if(!diaryWrap) return;
        diaryWrap.innerHTML = "";
        const diaryList = getLatestDiaryData();
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
    if(filterSel){
        filterSel.onchange = function(){
            renderDiary(this.value);
        }
    }
    renderDiary();

    // 六、心情统计计算
    function countMood(){
        const diaryList = getLatestDiaryData();
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

    // 七、留言板功能
    const msgForm = document.getElementById("msgForm");
    const msgWrap = document.getElementById("msgWrap");
    function renderMsg(){
        if(!msgWrap)return;
        msgWrap.innerHTML="";
        const msgList = getLatestMsgData();
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
    window.delMsg = function(idx){
        const msgList = getLatestMsgData();
        msgList.splice(idx,1);
        saveMsgData(msgList);
        renderMsg();
    }
    if(msgForm){
        msgForm.addEventListener("submit",e=>{
            e.preventDefault();
            let n = document.getElementById("msgName").value.trim();
            let t = document.getElementById("msgText").value.trim();
            if(!n||!t){
                alert("昵称和内容不能为空！");
                return;
            }
            const msgList = getLatestMsgData();
            msgList.unshift({name:n,content:t});
            saveMsgData(msgList);
            msgForm.reset();
            renderMsg();
        })
    }
    renderMsg();

    // 导出日记
    const exportDiaryBtn = document.getElementById("exportDiaryBtn");
    if(exportDiaryBtn){
        exportDiaryBtn.onclick = function(){
            const diaryList = getLatestDiaryData();
            const userName = getUserName();
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
                saveDiaryData([]);
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
                saveMsgData([]);
                renderMsg();
                alert("留言已全部清空");
            }
        }
    }

    // 页面跳转
    function goPage(url){
        location.replace(url);
    }

    // 手机返回逻辑
    const path = location.href;
    if(path.includes("index.html")){
        history.pushState({},'',path);
    }else{
        history.replaceState({},'','index.html');
        history.pushState({},'',path);
    }
    window.addEventListener('popstate',()=>{
        if(location.href.includes('index.html')){
            history.go(-(history.length-1));
        }
    })

    // 跨页面storage同步
    window.addEventListener('storage', function (event) {
        if (event.key === 'diaryData') {
            renderDiary();
            countMood();
        }
        if (event.key === 'msgData') {
            renderMsg();
        }
        if (event.key === 'diaryUserName') {
            const userShowDom = document.getElementById('userShow');
            if (userShowDom) {
                userShowDom.innerText = "当前用户：" + getUserName();
            }
        }
    });

    // 页面加载兜底刷新
    window.addEventListener('load', function () {
        renderDiary();
        countMood();
        renderMsg();
        const userShowDom = document.getElementById('userShow');
        if (userShowDom) {
            userShowDom.innerText = "当前用户：" + getUserName();
        }
    });
