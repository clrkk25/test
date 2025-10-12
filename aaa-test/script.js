let footballTeam={
  team:"巴塞罗那",
  year:1991,
  headCoach:"约翰·克鲁伊夫",
  players:[
    {
      name:"瓜迪奥拉",
      position:"midfielder",
      isCaptain:true,
    },
    {
      name:"科曼",
      position:"defender",
      isCaptain:false,
    },
    {
      name:"斯托伊奇科夫",
      position:"forward",
      isCaptain:false,
    },
    {
      name:"罗马里奥",
      position:"forward",
      isCaptain:false,
    },
    {
      name:"劳德鲁普",
      position:"midfielder",
      isCaptain:false,
    },
  ],
};

// 在 HTML 元素中显示 footballTeam 对象中的 headCoach、team 和 year 值
document.getElementById("head-coach").textContent = footballTeam.headCoach;
document.getElementById("team").textContent = footballTeam.team;
document.getElementById("year").textContent = footballTeam.year;

// 页面加载时默认显示全体球员
document.addEventListener('DOMContentLoaded', () => {
    displayPlayerCards("all");
});


const playerSelect = document.getElementById("players");
const playerCards = document.getElementById("player-cards");

// 监听选择框变化
playerSelect.addEventListener("change", () => {
    console.log("."+playerSelect.value+".");
    const selectedPosition = playerSelect.value;
    displayPlayerCards(selectedPosition);
});

// 显示符合位置的球员卡片
function displayPlayerCards(position) {
    playerCards.innerHTML = ""; // 清空之前的内容
    footballTeam.players.forEach(player => {
        if (player.position === position || position === "all") {
            const card = document.createElement("div");
            card.classList.add("player-card");
            card.innerHTML = `<p>${player.name}</p><p>Position: ${player.position}</p>`;
            playerCards.appendChild(card);
        }
    });
}

