let footballTeam = {
  team: "巴塞罗那",
  year: 2025,
  headCoach: "哈维·埃尔南德斯",
  players: [

    {
      name: "莱万多夫斯基",
      position: "forward",
      isCaptain: false,
    },
    {
      name: "拉菲尼亚",
      position: "forward",
      isCaptain: false,
    },
    {
      name: "费兰·托雷斯",
      position: "forward",
      isCaptain: false,
    },
    {
      name: "佩德里",
      position: "midfielder",
      isCaptain: false,
    },
    {
      name: "加维",
      position: "midfielder",
      isCaptain: false,
    },
    {
      name: "德容",
      position: "midfielder",
      isCaptain: true,
    },
    {
      name: "阿劳霍",
      position: "defender",
      isCaptain: false,
    },
    {
      name: "孔德",
      position: "defender",
      isCaptain: false,
    },
    {
      name: "特尔施特根",
      position: "goalkeeper",
      isCaptain: false,
    },
    {
      name: "伊尼亚基·佩尼亚",
      position: "goalkeeper",
      isCaptain: false,
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
  console.log("." + playerSelect.value + ".");
  const selectedPosition = playerSelect.value;
  displayPlayerCards(selectedPosition);
});

// 显示符合位置的球员卡片
function displayPlayerCards(position) {
  playerCards.innerHTML = ""; // 清空之前的内容
  footballTeam.players.forEach(player => {

    if (position === "all" || player.position === position) {
      const card = document.createElement("div");
      card.classList.add("player-card");
      card.classList.add(player.position); // 添加位置类名用于样式区分
      
      // 使用徽章显示队长信息
      const captainBadge = player.isCaptain ? '<span class="captain-badge">队长</span>' : '';
      card.innerHTML = `<h2>${player.name}${captainBadge}</h2><p>位置: ${player.position}</p>`;
      playerCards.appendChild(card);
    }
  });
}

