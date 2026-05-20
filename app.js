const boardElement = document.querySelector("#board");
const mascot = document.querySelector("#mascot");
const dice = document.querySelector("#dice");
const rollBtn = document.querySelector("#rollBtn");
const shuffleBtn = document.querySelector("#shuffleBtn");
const resultTitle = document.querySelector("#resultTitle");
const resultText = document.querySelector("#resultText");
const weatherText = document.querySelector("#weatherText");
const fortuneText = document.querySelector("#fortuneText");
const mysticText = document.querySelector("#mysticText");
const stepText = document.querySelector("#stepText");
const moveLog = document.querySelector("#moveLog");
const centerCharacter = document.querySelector("#centerCharacter");
const characterOptions = document.querySelector("#characterOptions");
const characterName = document.querySelector("#characterName");
const characterMood = document.querySelector("#characterMood");
const centerFoodName = document.querySelector("#centerFoodName");
const foodPhoto = document.querySelector("#foodPhoto");
const foodImage = document.querySelector("#foodImage");
const foodEmoji = document.querySelector("#foodEmoji");
const boardDice = document.querySelector("#boardDice");
const diceRenderers = new Map();

const state = {
  board: [],
  position: 0,
  rolling: false,
  weather: null,
  fortune: null,
  mystic: null,
  character: "corgi",
};

const characters = {
  corgi: {
    name: "胖柯基",
    idle: "胖柯基正在乖乖坐着等开饭",
    walking: "胖柯基短腿加速中，耳朵已经飞起来了",
    landed: "胖柯基确认落点，尾巴开始疯狂营业",
  },
  bluecat: {
    name: "蓝猫",
    idle: "蓝猫假装冷静，其实已经盯着饭碗",
    walking: "蓝猫优雅巡逻中，步伐里带着一点小骄傲",
    landed: "蓝猫点头批准：这口可以吃",
  },
};

const pathCells = [
  [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6],
  [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
  [0, 5], [0, 4], [0, 3], [0, 2], [0, 1], [0, 0],
  [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
];

const foods = [
  { name: "牛肉面", emoji: "🍜", kind: "warm", tag: "热汤", image: "beef-noodle-soup", vibe: "一口汤下去，今天的电量先回到 72%。" },
  { name: "麻辣烫", emoji: "🌶️", kind: "spicy", tag: "开胃", image: "spicy-hot-pot", vibe: "万物皆可烫，选择困难也被煮熟了。" },
  { name: "砂锅粥", emoji: "🥣", kind: "light", tag: "养胃", image: "congee-bowl", vibe: "适合让胃坐上软沙发，安静充一会儿电。" },
  { name: "炸鸡汉堡", emoji: "🍔", kind: "fun", tag: "快乐", image: "fried-chicken-burger", vibe: "今天不讲武德，先把快乐安排到位。" },
  { name: "咖喱饭", emoji: "🍛", kind: "warm", tag: "浓郁", image: "japanese-curry-rice", vibe: "浓、稳、直接，像一个不拐弯的好决定。" },
  { name: "寿司饭团", emoji: "🍣", kind: "light", tag: "清爽", image: "sushi-platter", vibe: "吃完还像个清醒的人，甚至想整理桌面。" },
  { name: "火锅冒菜", emoji: "🍲", kind: "spicy", tag: "热闹", image: "chinese-hot-pot", vibe: "适合把食欲开到最大档，顺手驱散低气压。" },
  { name: "煎饺馄饨", emoji: "🥟", kind: "warm", tag: "踏实", image: "dumplings-wonton", vibe: "一半脆一半软，专治今天的摇摆不定。" },
  { name: "螺蛳粉", emoji: "🍜", kind: "spicy", tag: "上头", image: "spicy-rice-noodles", vibe: "需要一点鲜明态度时，它会很有存在感。" },
  { name: "烤肉拌饭", emoji: "🍚", kind: "fun", tag: "饱足", image: "korean-bibimbap", vibe: "米饭负责兜底，烤肉负责把人哄好。" },
  { name: "轻食沙拉", emoji: "🥗", kind: "light", tag: "清净", image: "fresh-salad-bowl", vibe: "不是委屈，是给身体一个体面的台阶。" },
  { name: "烧鸟串串", emoji: "🍢", kind: "warm", tag: "慢吃", image: "yakitori-skewers", vibe: "适合慢慢咬，把今天的小烦恼一串串放下。" },
  { name: "酸菜鱼", emoji: "🐟", kind: "spicy", tag: "醒神", image: "sichuan-fish-soup", vibe: "酸负责开路，辣负责催你重新做人。" },
  { name: "茶餐厅", emoji: "🥪", kind: "fun", tag: "全能", image: "hong-kong-cafe-food", vibe: "想不清楚时，交给一个菜单很厚的地方。" },
  { name: "越南粉", emoji: "🍲", kind: "light", tag: "清香", image: "vietnamese-pho", vibe: "热汤里带点清爽，像给脑袋开了窗。" },
  { name: "披萨", emoji: "🍕", kind: "fun", tag: "分享", image: "pizza-slices", vibe: "适合把今天切成几块，一块一块解决。" },
  { name: "生煎包", emoji: "🥟", kind: "warm", tag: "爆汁", image: "pan-fried-dumplings", vibe: "小心烫，也小心突然开心。" },
  { name: "泰式炒粉", emoji: "🍝", kind: "spicy", tag: "酸辣", image: "pad-thai-noodles", vibe: "酸甜辣一起来，专门对付没精神。" },
  { name: "甜品刨冰", emoji: "🍧", kind: "sweet", tag: "降温", image: "shaved-ice-dessert", vibe: "不是正餐，但有时候灵魂就需要先吃甜的。" },
  { name: "卤肉饭", emoji: "🍚", kind: "warm", tag: "香气", image: "braised-pork-rice", vibe: "朴素但很会安慰人，像厨房里的拥抱。" },
  { name: "烤鱼", emoji: "🐟", kind: "spicy", tag: "聚气", image: "grilled-fish-dish", vibe: "一整锅热闹，适合把饭点变成事件。" },
  { name: "日式拉面", emoji: "🍜", kind: "warm", tag: "治愈", image: "ramen-bowl", vibe: "汤、面、蛋都到位，人生暂时不需要太复杂。" },
  { name: "豆花米线", emoji: "🥣", kind: "light", tag: "柔软", image: "rice-noodle-soup", vibe: "软软热热，像给今天按了静音键。" },
  { name: "小龙虾", emoji: "🦞", kind: "fun", tag: "仪式", image: "crayfish-dish", vibe: "适合把袖子卷起来，认真快乐一场。" },
  { name: "海南鸡饭", emoji: "🍗", kind: "light", tag: "清香", image: "hainanese-chicken-rice", vibe: "鸡肉和米饭都很稳，像一份不吵闹的照顾。" },
  { name: "韩式部队锅", emoji: "🥘", kind: "spicy", tag: "热闹", image: "korean-army-stew", vibe: "咕嘟咕嘟一锅，专治饭点冷场。" },
  { name: "墨西哥卷饼", emoji: "🌯", kind: "fun", tag: "满足", image: "burrito-wrap", vibe: "把肉、菜、酱都卷起来，也把犹豫卷走。" },
  { name: "法式可颂", emoji: "🥐", kind: "sweet", tag: "松弛", image: "croissant-coffee", vibe: "不一定正餐，但能让今天变得很会生活。" },
  { name: "羊肉串", emoji: "🍖", kind: "warm", tag: "烟火", image: "lamb-skewers", vibe: "炭火一来，饭运就有了街边的灵魂。" },
  { name: "海鲜意面", emoji: "🍝", kind: "fun", tag: "鲜香", image: "seafood-pasta", vibe: "有点精致，也有点任性，适合认真奖励自己。" },
  { name: "广式早茶", emoji: "🥟", kind: "light", tag: "从容", image: "dim-sum-table", vibe: "点心慢慢上，心情慢慢顺。" },
  { name: "芝士焗饭", emoji: "🧀", kind: "warm", tag: "拉丝", image: "cheese-baked-rice", vibe: "拉丝就是今天的安全感证明。" },
  { name: "烤冷面", emoji: "🥞", kind: "fun", tag: "街头", image: "street-food-noodles", vibe: "有点随性，有点香，适合临时起意的快乐。" },
  { name: "椰子鸡", emoji: "🥥", kind: "light", tag: "鲜甜", image: "coconut-chicken-hotpot", vibe: "清甜热汤，像把疲惫温柔地泡开。" },
  { name: "椒麻鸡", emoji: "🍗", kind: "spicy", tag: "麻香", image: "spicy-chicken-dish", vibe: "麻香一上来，整个人会精神一点。" },
  { name: "蛋包饭", emoji: "🍳", kind: "fun", tag: "可爱", image: "omurice", vibe: "软乎乎盖住米饭，也盖住今天的一点小烦。" },
  { name: "韩式烤肉", emoji: "🥩", kind: "fun", tag: "滋滋", image: "korean-bbq", vibe: "滋滋作响的时候，人很难继续不开心。" },
  { name: "烤鸭卷", emoji: "🫓", kind: "fun", tag: "酥香", image: "peking-duck-wrap", vibe: "一卷下去，仪式感和满足感同时到场。" },
  { name: "番茄牛腩饭", emoji: "🍅", kind: "warm", tag: "酸甜", image: "tomato-beef-rice", vibe: "酸甜热乎，很适合把今天从皱巴巴里熨平。" },
  { name: "抹茶蛋糕", emoji: "🍰", kind: "sweet", tag: "治愈", image: "matcha-cake", vibe: "甜得不吵，像给心情盖了一条小毯子。" },
];

const fortunes = [
  { name: "锅气上上签", boost: "热乎", shift: 2, line: "今天适合吃会冒热气的东西，运气也跟着往上飘。" },
  { name: "清爽转运签", boost: "清淡", shift: 1, line: "今天不宜太硬扛，清爽一点反而更容易赢。" },
  { name: "辣味破局签", boost: "辣", shift: 3, line: "有点堵的日子，适合用辣味把局面打开。" },
  { name: "快乐加餐签", boost: "快乐", shift: 4, line: "今天的正事已经够正了，吃饭可以荒唐一点。" },
  { name: "稳稳落袋签", boost: "踏实", shift: 0, line: "别追奇招，吃一个踏实的，胃会给你好评。" },
];

const mystics = [
  "筷子方向指向东南，主打一个先吃再说",
  "今日锅铲指数 87%，适合有香气的决定",
  "米饭星进入食欲宫，碳水发言权上升",
  "辣椒守护神上线，犹豫会被自动翻炒",
  "汤勺发出微弱信号：需要一点热乎的安慰",
  "甜口能量偏高，允许饭后追加一点快乐",
];

const fallbackWeather = [
  { text: "多云，适合出门觅食", mood: "mild" },
  { text: "小雨，适合热汤护体", mood: "rain" },
  { text: "有点热，清爽选项加分", mood: "hot" },
  { text: "微凉，锅气正在召唤", mood: "cool" },
];

function init() {
  state.fortune = fortunes[new Date().getDate() % fortunes.length];
  state.mystic = mystics[(new Date().getMonth() + new Date().getDate()) % mystics.length];
  state.weather = fallbackWeather[new Date().getHours() % fallbackWeather.length];

  fortuneText.textContent = state.fortune.name;
  mysticText.textContent = state.mystic;
  weatherText.textContent = state.weather.text;

  shuffleBoard();
  setDiceFace(dice, null);
  setDiceFace(boardDice, null);
  applyCharacter("corgi");
  updateCenterStage(getCurrentFood(), "idle");
  positionMascot(false);
  fetchWeatherByIp();

  rollBtn.addEventListener("click", rollDice);
  boardDice.addEventListener("click", rollDice);
  characterOptions.addEventListener("click", handleCharacterChoice);
  shuffleBtn.addEventListener("click", () => {
    if (state.rolling) return;
    shuffleBoard();
    state.position = 0;
    setDiceFace(dice, null);
    setDiceFace(boardDice, null);
    stepText.textContent = "棋盘已洗牌";
    resultTitle.textContent = "新棋盘到位";
    resultText.textContent = "这一局的美食顺序已经重新打乱，命运假装很公平。";
    moveLog.innerHTML = "";
    updateCenterStage(getCurrentFood(), "idle");
    positionMascot(false);
  });
}

function handleCharacterChoice(event) {
  const button = event.target.closest(".character-option");
  if (!button || state.rolling) return;

  characterOptions.querySelectorAll(".character-option").forEach((option) => option.classList.remove("active"));
  button.classList.add("active");
  applyCharacter(button.dataset.character);
  updateCenterStage(getCurrentFood(), "idle");
}

function applyCharacter(characterKey) {
  state.character = characterKey;
  const character = characters[characterKey];
  characterName.textContent = character.name;

  [mascot, centerCharacter].forEach((element) => {
    element.classList.remove("corgi", "bluecat");
    element.classList.add(characterKey);
  });
}

function shuffleBoard() {
  state.board = shuffle([...foods]).slice(0, pathCells.length - 1);
  renderBoard();
}

function renderBoard() {
  boardElement.innerHTML = "";
  const tileMap = new Map(pathCells.map((cell, index) => [`${cell[0]}-${cell[1]}`, index]));

  for (let row = 0; row < 7; row += 1) {
    for (let col = 0; col < 7; col += 1) {
      const pathIndex = tileMap.get(`${row}-${col}`);
      const tile = document.createElement("article");
      tile.className = "tile";

      if (pathIndex === undefined) {
        tile.classList.add("empty");
        boardElement.append(tile);
        continue;
      }

      if (pathIndex === 0) {
        tile.classList.add("start");
        tile.dataset.index = pathIndex;
        tile.innerHTML = `
          <span class="index">GO</span>
          <span class="thumb">🏁</span>
          <strong>起点</strong>
          <small>饭运出发</small>
        `;
        boardElement.append(tile);
        continue;
      }

      const food = state.board[pathIndex - 1];
      tile.classList.add(`kind-${food.kind}`);
      tile.dataset.index = pathIndex;
      tile.style.setProperty("--tile-image", `url("${getFoodImage(food, 240, 180)}")`);
      tile.innerHTML = `
        <span class="index">${String(pathIndex).padStart(2, "0")}</span>
        <span class="thumb">${food.emoji}</span>
        <strong>${food.name}</strong>
        <small>${food.tag}</small>
      `;
      boardElement.append(tile);
    }
  }

  markActiveTile();
}

async function rollDice() {
  if (state.rolling) return;
  state.rolling = true;
  rollBtn.disabled = true;
  updateCenterStage(getCurrentFood(), "walking");

  const roll = Math.floor(Math.random() * 6) + 1;
  await tumbleDice(roll);

  const fortuneSteps = state.fortune.shift;
  const totalSteps = roll + fortuneSteps;
  stepText.textContent = `骰子 ${roll} + 运势 ${fortuneSteps} = ${totalSteps} 步`;

  appendLog(`掷出 <strong>${roll}</strong> 点，${state.fortune.name} 追加 <strong>${fortuneSteps}</strong> 步。`);

  for (let step = 0; step < totalSteps; step += 1) {
    state.position = (state.position + 1) % pathCells.length;
    markActiveTile();
    positionMascot(true);
    updateCenterStage(getCurrentFood(), "walking");
    await wait(310);
  }

  const food = getCurrentFood() || getStartRewardFood(roll);
  const reason = buildReason(food, roll, fortuneSteps);
  resultTitle.textContent = food.name;
  resultText.textContent = reason;
  updateCenterStage(food, "landed");
  appendLog(state.position === 0
    ? `回到 <strong>起点</strong>：触发 <strong>${food.name}</strong>。`
    : `落在第 <strong>${String(state.position).padStart(2, "0")}</strong> 格：<strong>${food.name}</strong>。`);

  rollBtn.disabled = false;
  state.rolling = false;
}

function getCurrentFood() {
  if (state.position === 0) return null;
  return state.board[state.position - 1];
}

function getStartRewardFood(roll) {
  const fallback = state.board[roll % state.board.length];
  return {
    name: "起点补给",
    emoji: "🍱",
    kind: "fun",
    tag: "再开饭",
    image: fallback.image,
    vibe: "你绕回了起点，说明饭运正在重启。今天适合加一份小吃，或者把刚刚最心动的那格直接收入菜单。",
  };
}

function setDiceFace(element, value) {
  element.classList.toggle("unknown", !value);
  element.dataset.value = value || "";
  const renderer = getDiceRenderer(element);
  renderer.setValue(value);
}

async function tumbleDice(finalValue) {
  dice.classList.remove("rolling");
  boardDice.classList.remove("rolling");
  dice.offsetHeight;
  boardDice.offsetHeight;
  getDiceRenderer(dice).roll(finalValue, 1320);
  getDiceRenderer(boardDice).roll(finalValue, 1320);
  dice.classList.add("rolling");
  boardDice.classList.add("rolling");

  const duration = 1320;
  await wait(duration);
  setDiceFace(dice, finalValue);
  setDiceFace(boardDice, finalValue);
  dice.classList.remove("rolling");
  boardDice.classList.remove("rolling");
}

function getDiceRenderer(element) {
  if (!diceRenderers.has(element)) {
    diceRenderers.set(element, createDiceRenderer(element));
  }
  return diceRenderers.get(element);
}

function createDiceRenderer(element) {
  element.innerHTML = `<canvas class="dice-canvas" aria-hidden="true"></canvas><span class="dice-mark">?</span>`;
  const canvas = element.querySelector("canvas");
  const mark = element.querySelector(".dice-mark");
  const context = canvas.getContext("2d");
  const renderer = {
    value: null,
    frame: null,
    setValue(value) {
      this.value = value;
      mark.hidden = Boolean(value);
      drawDiceCanvas(canvas, context, getDiceAngles(value || 1));
    },
    roll(finalValue, duration) {
      window.cancelAnimationFrame(this.frame);
      mark.hidden = true;
      const start = performance.now();
      const animate = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const ease = 1 - Math.pow(1 - progress, 3);
        const settle = progress > 0.76 ? (progress - 0.76) / 0.24 : 0;
        const target = getDiceAngles(finalValue);
        const spin = {
          x: 0.7 + ease * Math.PI * 5.2,
          y: -0.5 + ease * Math.PI * 6.4,
          z: Math.sin(progress * Math.PI * 5) * 0.45,
        };
        const angles = {
          x: lerp(spin.x, target.x, settle),
          y: lerp(spin.y, target.y, settle),
          z: lerp(spin.z, target.z, settle),
        };
        drawDiceCanvas(canvas, context, angles, progress);
        if (progress < 1) {
          this.frame = window.requestAnimationFrame(animate);
        } else {
          this.value = finalValue;
          element.dataset.value = finalValue;
          drawDiceCanvas(canvas, context, target, 1);
        }
      };
      this.frame = window.requestAnimationFrame(animate);
    },
  };
  renderer.setValue(null);
  return renderer;
}

function getDiceAngles(value) {
  const angles = {
    1: { x: -0.42, y: 0.48, z: -0.08 },
    2: { x: -0.38, y: -1.1, z: 0.08 },
    3: { x: 1.05, y: 0.36, z: -0.04 },
    4: { x: -1.08, y: 0.34, z: 0.08 },
    5: { x: -0.36, y: 1.08, z: -0.08 },
    6: { x: -0.36, y: 2.68, z: 0.05 },
  };
  return angles[value] || angles[1];
}

function drawDiceCanvas(canvas, context, angles, progress = 1) {
  const rect = canvas.getBoundingClientRect();
  const size = Math.max(72, Math.round(rect.width || 120));
  const ratio = window.devicePixelRatio || 1;
  if (canvas.width !== size * ratio || canvas.height !== size * ratio) {
    canvas.width = size * ratio;
    canvas.height = size * ratio;
  }
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, size, size);

  const bounce = Math.sin(progress * Math.PI) * (1 - progress) * size * 0.14;
  const squash = progress > 0.62 && progress < 0.78 ? 1 - Math.sin((progress - 0.62) / 0.16 * Math.PI) * 0.08 : 1;
  const center = { x: size / 2, y: size / 2 - bounce };
  const scale = size * 0.28;
  const camera = 4.6;

  const shadowWidth = size * (0.46 + (1 - progress) * 0.12);
  context.save();
  context.fillStyle = `rgba(34, 28, 23, ${0.24 + progress * 0.08})`;
  context.filter = `blur(${size * 0.035}px)`;
  context.beginPath();
  context.ellipse(size / 2, size * 0.77, shadowWidth, size * 0.105, 0, 0, Math.PI * 2);
  context.fill();
  context.restore();

  const faces = buildDiceFaces().map((face) => {
    const corners = face.corners.map((point) => rotatePoint(point, angles, squash));
    const normal = rotatePoint(face.normal, angles, 1, true);
    return { ...face, corners, normal, depth: average(corners.map((point) => point.z)) };
  }).sort((a, b) => a.depth - b.depth);

  faces.forEach((face) => {
    if (face.normal.z <= -0.08) return;
    drawDiceFace(context, face, center, scale, camera);
  });
}

function buildDiceFaces() {
  const h = 1;
  return [
    makeDiceFace(1, [[-h, -h, h], [h, -h, h], [h, h, h], [-h, h, h]], [0, 0, 1]),
    makeDiceFace(6, [[h, -h, -h], [-h, -h, -h], [-h, h, -h], [h, h, -h]], [0, 0, -1]),
    makeDiceFace(2, [[h, -h, h], [h, -h, -h], [h, h, -h], [h, h, h]], [1, 0, 0]),
    makeDiceFace(5, [[-h, -h, -h], [-h, -h, h], [-h, h, h], [-h, h, -h]], [-1, 0, 0]),
    makeDiceFace(3, [[-h, -h, -h], [h, -h, -h], [h, -h, h], [-h, -h, h]], [0, -1, 0]),
    makeDiceFace(4, [[-h, h, h], [h, h, h], [h, h, -h], [-h, h, -h]], [0, 1, 0]),
  ];
}

function makeDiceFace(value, corners, normal) {
  return {
    value,
    corners: corners.map(([x, y, z]) => ({ x, y, z })),
    normal: { x: normal[0], y: normal[1], z: normal[2] },
  };
}

function drawDiceFace(context, face, center, scale, camera) {
  const points = face.corners.map((point) => projectPoint(point, center, scale, camera));
  const light = Math.max(0, face.normal.x * -0.28 + face.normal.y * -0.48 + face.normal.z * 0.86);
  const shade = Math.round(188 + light * 58);
  const warm = Math.round(152 + light * 74);

  context.save();
  roundedPolygonPath(context, points, scale * 0.22);

  const gradient = context.createLinearGradient(points[0].x, points[0].y, points[2].x, points[2].y);
  gradient.addColorStop(0, `rgb(255, 252, 244)`);
  gradient.addColorStop(0.52, `rgb(248, ${Math.min(242, warm + 16)}, ${shade})`);
  gradient.addColorStop(1, `rgb(${Math.max(176, shade - 20)}, ${Math.max(132, warm - 36)}, 96)`);
  context.fillStyle = gradient;
  context.shadowColor = "rgba(34, 28, 23, 0.18)";
  context.shadowBlur = scale * 0.08;
  context.shadowOffsetY = scale * 0.04;
  context.fill();
  context.clip();

  context.lineWidth = scale * 0.16;
  context.lineJoin = "round";
  context.strokeStyle = "rgba(255, 255, 255, 0.46)";
  roundedPolygonPath(context, points, scale * 0.22);
  context.stroke();
  context.lineWidth = scale * 0.055;
  context.strokeStyle = "rgba(74, 45, 25, 0.16)";
  roundedPolygonPath(context, points, scale * 0.22);
  context.stroke();

  drawFaceHighlight(context, points, scale);
  drawPips(context, face.value, face.corners, center, scale, camera);
  context.restore();
}

function roundedPolygonPath(context, points, radius) {
  const count = points.length;
  const clampedRadius = Math.max(4, radius);
  context.beginPath();

  points.forEach((point, index) => {
    const previous = points[(index - 1 + count) % count];
    const next = points[(index + 1) % count];
    const distanceToPrevious = Math.hypot(point.x - previous.x, point.y - previous.y);
    const distanceToNext = Math.hypot(point.x - next.x, point.y - next.y);
    const cornerRadius = Math.min(clampedRadius, distanceToPrevious * 0.38, distanceToNext * 0.38);
    const from = {
      x: point.x + (previous.x - point.x) / distanceToPrevious * cornerRadius,
      y: point.y + (previous.y - point.y) / distanceToPrevious * cornerRadius,
    };
    const to = {
      x: point.x + (next.x - point.x) / distanceToNext * cornerRadius,
      y: point.y + (next.y - point.y) / distanceToNext * cornerRadius,
    };

    if (index === 0) context.moveTo(from.x, from.y);
    else context.lineTo(from.x, from.y);
    context.quadraticCurveTo(point.x, point.y, to.x, to.y);
  });

  context.closePath();
}

function drawFaceHighlight(context, points, scale) {
  const x = points.reduce((sum, point) => sum + point.x, 0) / points.length;
  const y = points.reduce((sum, point) => sum + point.y, 0) / points.length;
  const gradient = context.createRadialGradient(x - scale * 0.28, y - scale * 0.24, 0, x, y, scale * 1.15);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.42)");
  gradient.addColorStop(0.44, "rgba(255, 255, 255, 0.08)");
  gradient.addColorStop(1, "rgba(105, 61, 30, 0.16)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);

  context.save();
  context.globalCompositeOperation = "screen";
  context.lineWidth = scale * 0.075;
  context.lineCap = "round";
  context.strokeStyle = "rgba(255, 255, 255, 0.34)";
  context.beginPath();
  context.moveTo(lerp(points[0].x, points[1].x, 0.22), lerp(points[0].y, points[1].y, 0.22));
  context.quadraticCurveTo(
    lerp(points[0].x, points[2].x, 0.3),
    lerp(points[0].y, points[2].y, 0.18),
    lerp(points[1].x, points[2].x, 0.28),
    lerp(points[1].y, points[2].y, 0.28)
  );
  context.stroke();
  context.restore();
}

function drawPips(context, value, corners, center, scale, camera) {
  const layouts = {
    1: [[0, 0]],
    2: [[-0.42, -0.42], [0.42, 0.42]],
    3: [[-0.44, -0.44], [0, 0], [0.44, 0.44]],
    4: [[-0.42, -0.42], [0.42, -0.42], [-0.42, 0.42], [0.42, 0.42]],
    5: [[-0.44, -0.44], [0.44, -0.44], [0, 0], [-0.44, 0.44], [0.44, 0.44]],
    6: [[-0.44, -0.48], [0.44, -0.48], [-0.44, 0], [0.44, 0], [-0.44, 0.48], [0.44, 0.48]],
  };
  const [a, b, c, d] = corners;
  layouts[value].forEach(([u, v]) => {
    const point = bilinearPoint(a, b, c, d, 0.5 + u * 0.5, 0.5 + v * 0.5);
    const projected = projectPoint(point, center, scale, camera);
    const radius = Math.max(3.4, projected.scale * scale * 0.105);
    const pipGradient = context.createRadialGradient(projected.x - radius * 0.34, projected.y - radius * 0.38, radius * 0.1, projected.x, projected.y, radius);
    pipGradient.addColorStop(0, "#50423a");
    pipGradient.addColorStop(0.6, "#15110f");
    pipGradient.addColorStop(1, "#020202");
    context.fillStyle = pipGradient;
    context.beginPath();
    context.ellipse(projected.x, projected.y, radius, radius * 0.9, 0, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "rgba(255, 255, 255, 0.22)";
    context.lineWidth = Math.max(1, radius * 0.13);
    context.stroke();
  });
}

function rotatePoint(point, angles, squash = 1, normalOnly = false) {
  let { x, y, z } = point;
  if (!normalOnly) y *= squash;
  const cx = Math.cos(angles.x);
  const sx = Math.sin(angles.x);
  const cy = Math.cos(angles.y);
  const sy = Math.sin(angles.y);
  const cz = Math.cos(angles.z);
  const sz = Math.sin(angles.z);

  [y, z] = [y * cx - z * sx, y * sx + z * cx];
  [x, z] = [x * cy + z * sy, -x * sy + z * cy];
  [x, y] = [x * cz - y * sz, x * sz + y * cz];
  return { x, y, z };
}

function projectPoint(point, center, scale, camera) {
  const perspective = camera / (camera - point.z);
  return {
    x: center.x + point.x * scale * perspective,
    y: center.y + point.y * scale * perspective,
    scale: perspective,
  };
}

function bilinearPoint(a, b, c, d, u, v) {
  const top = mixPoint(a, b, u);
  const bottom = mixPoint(d, c, u);
  return mixPoint(top, bottom, v);
}

function mixPoint(a, b, t) {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    z: lerp(a.z, b.z, t),
  };
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function updateCenterStage(food, status) {
  const character = characters[state.character];
  centerCharacter.classList.remove("sitting", "walking", "celebrate");
  mascot.classList.remove("sitting", "walking", "celebrate");

  if (status === "walking") {
    centerCharacter.classList.add("walking");
    mascot.classList.add("walking");
    characterMood.textContent = character.walking;
  } else if (status === "landed") {
    centerCharacter.classList.add("celebrate");
    mascot.classList.add("celebrate");
    characterMood.textContent = character.landed;
  } else {
    centerCharacter.classList.add("sitting");
    mascot.classList.add("sitting");
    characterMood.textContent = character.idle;
  }

  if (!food) {
    centerFoodName.textContent = "掷骰后揭晓";
    foodEmoji.textContent = "🍽️";
    foodImage.removeAttribute("src");
    foodImage.alt = "";
    foodPhoto.className = "food-photo";
    return;
  }

  centerFoodName.textContent = `${food.name} · ${food.tag}`;
  foodEmoji.textContent = food.emoji;
  foodImage.src = getFoodImage(food, 640, 480);
  foodImage.alt = food.name;
  foodPhoto.className = `food-photo kind-${food.kind}`;
}

function getFoodImage(food, width, height) {
  return `assets/foods/${food.image}.jpg`;
}

function buildReason(food, roll, fortuneSteps) {
  const weatherLine = getWeatherReason(food);
  const mysticLine = getMysticReason(food, roll);
  return `${weatherLine}${state.fortune.line}${mysticLine}所以这格推荐 ${food.name}：${food.vibe}`;
}

function getWeatherReason(food) {
  if (state.weather.mood === "rain" && food.kind === "warm") return `外面带点湿气，${food.name}这种热乎选项直接加命中。`;
  if (state.weather.mood === "hot" && (food.kind === "light" || food.kind === "sweet")) return `天气偏热，${food.name}这种清爽路线很会救场。`;
  if (state.weather.mood === "cool" && (food.kind === "warm" || food.kind === "spicy")) return `微凉天气和${food.name}很合拍，锅气值正在升高。`;
  return `${state.weather.text}，饭运没有阻拦你走向${food.name}。`;
}

function getMysticReason(food, roll) {
  const luckyNumber = ((new Date().getDate() + roll + food.name.length) % 9) + 1;
  return `玄学显示今日幸运数是 ${luckyNumber}，而这格的「${food.tag}」气场刚好接住你的食欲。`;
}

function markActiveTile() {
  document.querySelectorAll(".tile.active").forEach((tile) => tile.classList.remove("active"));
  const active = document.querySelector(`.tile[data-index="${state.position}"]`);
  if (active) active.classList.add("active");
}

function positionMascot(animate) {
  const [row, col] = pathCells[state.position];
  const tileSize = getTileSize();
  const gap = getGap();
  const x = col * (tileSize + gap) + tileSize / 2;
  const y = row * (tileSize + gap) + tileSize / 2;

  mascot.style.left = `${x}px`;
  mascot.style.top = `${y}px`;
  mascot.style.transform = "translate(-50%, -50%)";
  mascot.classList.toggle("walking", animate);
  if (animate) window.setTimeout(() => mascot.classList.remove("walking"), 220);
}

function getTileSize() {
  return document.querySelector(".tile")?.getBoundingClientRect().width || 104;
}

function getGap() {
  return Number.parseFloat(getComputedStyle(boardElement).gap) || 10;
}

async function fetchWeatherByIp() {
  try {
    const ip = await fetchJson("https://ipwho.is/?lang=zh-CN");
    if (ip.success === false) return;

    const weather = await fetchJson(
      `https://api.open-meteo.com/v1/forecast?latitude=${ip.latitude}&longitude=${ip.longitude}&current=temperature_2m,precipitation,rain,weather_code&timezone=auto`
    );
    const current = weather.current;
    if (!current) return;

    const codeText = weatherCodeToText(Number(current.weather_code));
    const temperature = Math.round(Number(current.temperature_2m));
    const rain = Number(current.rain || current.precipitation || 0);
    state.weather = {
      text: `${codeText}，${temperature}°C`,
      mood: rain > 0 ? "rain" : temperature >= 28 ? "hot" : temperature <= 18 ? "cool" : "mild",
    };
    weatherText.textContent = state.weather.text;
  } catch (error) {
    weatherText.textContent = state.weather.text;
  }
}

function weatherCodeToText(code) {
  if (code === 0) return "晴";
  if ([1, 2].includes(code)) return "少云";
  if (code === 3) return "阴";
  if ([45, 48].includes(code)) return "雾";
  if ([51, 53, 55, 56, 57].includes(code)) return "小雨";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "雨";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "雪";
  if ([95, 96, 99].includes(code)) return "雷阵雨";
  return "天气平稳";
}

function appendLog(text) {
  const item = document.createElement("li");
  item.innerHTML = text;
  moveLog.prepend(item);
}

function shuffle(items) {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
}

function fetchJson(url) {
  return fetch(url).then((response) => {
    if (!response.ok) throw new Error("Request failed");
    return response.json();
  });
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

window.addEventListener("resize", () => positionMascot(false));

init();
