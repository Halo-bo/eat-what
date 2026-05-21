const boardElement = document.querySelector("#board");
const mascot = document.querySelector("#mascot");
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
const dicePad = document.querySelector(".dice-pad");
const diceRenderers = new Map();
let lastRollInputAt = 0;

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
    idle: "胖柯基端坐如小面包：饭呢？朕的饭呢？",
    walking: "胖柯基短腿启动！地板都被踩出奶油花边了",
    landed: "胖柯基宣布开饭！尾巴已经摇成电风扇三档",
  },
  bluecat: {
    name: "蓝猫",
    idle: "蓝猫表面高冷，内心已经把菜单啃出毛边",
    walking: "蓝猫巡逻中，步伐优雅得像刚继承了猫粮王国",
    landed: "蓝猫批准本格：开吃！不许反驳本喵行政命令",
  },
};

const pathCells = [
  [6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6],
  [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
  [0, 5], [0, 4], [0, 3], [0, 2], [0, 1], [0, 0],
  [1, 0], [2, 0], [3, 0], [4, 0], [5, 0],
];

const foods = [
  { name: "草莓", kind: "sweet", tag: "酸甜", icon: "strawberry", vibe: "红到像偷偷练过魔法，咬一口嘴角自动上扬，烦恼当场原地辞职。" },
  { name: "橙子", kind: "light", tag: "清爽", icon: "orange", vibe: "剥开就是一颗小太阳，汁水啪叽爆开，整个人像被快乐 Wi-Fi 连上了。" },
  { name: "冰激凌", kind: "sweet", tag: "降温", icon: "ice-cream", vibe: "冰冰凉凉从舌尖滑进灵魂，热气退散，脑袋里开始播放度假广告。" },
  { name: "蔓越莓", kind: "sweet", tag: "元气", icon: "cranberry", vibe: "小小一颗酸甜炸弹，咻一下把疲惫炸成彩带，心情开始扭秧歌。" },
  { name: "开心果", kind: "fun", tag: "开口笑", icon: "pistachio", vibe: "它都笑裂开了，你还绷什么？吃它，嘴角直接被快乐遥控器按上去。" },
  { name: "梨", kind: "light", tag: "润润", icon: "pear", vibe: "水润得像给喉咙装了小喷泉，一口下去，火气被温柔叉出去罚站。" },
  { name: "汉堡", kind: "fun", tag: "快乐", icon: "burger", vibe: "上下两片面包夹住宇宙秩序，中间那口肉香负责把理智按进快乐沙发。" },
  { name: "芒果", kind: "sweet", tag: "香甜", icon: "mango", vibe: "香到像夏天本人递来小纸条：别装了，你今天就该甜得离谱。" },
  { name: "牛油果", kind: "light", tag: "绵密", icon: "avocado", vibe: "绵密到像给胃盖小被子，精致感啪一下上线，连筷子都开始端庄。" },
  { name: "核桃", kind: "warm", tag: "补脑", icon: "walnut", vibe: "长得像脑子不是没有原因，吃完智商不一定涨，但气势必须像刚考上饭院士。" },
  { name: "牛奶", kind: "light", tag: "温柔", icon: "milk", vibe: "温温柔柔一口下去，胃里开小夜灯，今天的尖叫被折成小毛巾。" },
  { name: "松子", kind: "warm", tag: "小香", icon: "pine-nut", vibe: "小小一粒香得很嚣张，像饭桌上的隐藏刺客，轻轻一咬就偷走你的注意力。" },
  { name: "披萨", kind: "fun", tag: "分享", icon: "pizza", vibe: "圆形快乐被切成几瓣，每一瓣都在喊：别讲道理，先拉丝！" },
  { name: "夏威夷果", kind: "warm", tag: "脆香", icon: "macadamia", vibe: "圆滚滚出场，咔嚓一声，香气像小礼炮，直接把无聊轰出饭局。" },
  { name: "甜甜圈", kind: "sweet", tag: "圆满", icon: "donut", vibe: "中间有洞但快乐没漏，糖霜一亮相，今日 KPI 改名叫可爱达标。" },
  { name: "吐司", kind: "warm", tag: "松软", icon: "toast", vibe: "松软得像云朵兼职打工，一口咬下去，人生边角料都变成金黄脆脆。" },
  { name: "榛子", kind: "warm", tag: "坚果香", icon: "hazelnut", vibe: "香得很低调，但一出手就是坚果界老戏骨，嘎嘣一下气场坐稳。" },
  { name: "腰果", kind: "fun", tag: "弯弯", icon: "cashew", vibe: "弯成这样还这么香，说明人生不必直线前进，拐一下可能更好吃。" },
  { name: "杏仁", kind: "light", tag: "清香", icon: "almond", vibe: "清清脆脆像给嘴巴敲木鱼，烦躁当场被敲到放下执念。" },
  { name: "奇异果", kind: "sweet", tag: "醒神", icon: "kiwi", vibe: "毛茸茸登场，自带 BGM。酸到眉毛打结，甜到怀疑人生，咬一口天灵盖打开，食欲开始跳科目三。" },
];

const fortunes = [
  { name: "锅气上上签", boost: "热乎", shift: 2, line: "锅气上头，灶王爷把围裙一甩：加步！今天不吃热闹的都算辜负宇宙。" },
  { name: "清爽转运签", boost: "清淡", shift: 1, line: "清爽星发来急电：别硬撑，来点轻的，脑袋立刻从浆糊升级成果冻。" },
  { name: "辣味破局签", boost: "辣", shift: 3, line: "辣味开路，犹豫退退退！今天嘴巴不冒点火花，食欲委员会不同意。" },
  { name: "快乐加餐签", boost: "快乐", shift: 4, line: "快乐部长拍桌：加餐！正经生活先靠边，今天由馋嘴临时接管大脑。" },
  { name: "稳稳落袋签", boost: "踏实", shift: 0, line: "稳稳签一落，胃部董事会全票通过：别整花活，吃它就像给灵魂盖章。" },
];

const mystics = [
  "筷子指向东南，说明嘴巴已经替大脑偷偷报名",
  "今日锅铲指数 87%，再不吃点香的，锅铲要出来主持公道",
  "米饭星冲进食欲宫，碳水发言权突然变得很大声",
  "辣椒守护神已上线，犹豫会被自动翻炒三十秒",
  "汤勺发出神秘滴滴声：需要一点热乎的精神搓澡",
  "甜口能量爆表，允许快乐超标，允许嘴角离家出走",
];

const fallbackWeather = [
  { text: "多云，天空在假装自己是棉花糖", mood: "mild" },
  { text: "小雨，路面在给饭局铺氛围感", mood: "rain" },
  { text: "有点热，太阳像开了外放", mood: "hot" },
  { text: "微凉，锅气正在门口疯狂招手", mood: "cool" },
];

function init() {
  state.fortune = fortunes[new Date().getDate() % fortunes.length];
  state.mystic = mystics[(new Date().getMonth() + new Date().getDate()) % mystics.length];
  state.weather = fallbackWeather[new Date().getHours() % fallbackWeather.length];

  fortuneText.textContent = state.fortune.name;
  mysticText.textContent = state.mystic;
  weatherText.textContent = state.weather.text;

  shuffleBoard();
  setDiceFace(boardDice, null);
  applyCharacter("corgi");
  updateCenterStage(getCurrentFood(), "idle");
  positionMascot(false);
  fetchWeatherByIp();

  rollBtn.addEventListener("click", requestRoll);
  boardDice.addEventListener("click", requestRoll);
  dicePad?.addEventListener("click", requestRoll);
  dicePad?.addEventListener("pointerup", requestRoll);
  characterOptions.addEventListener("click", handleCharacterChoice);
  shuffleBtn.addEventListener("click", () => {
    if (state.rolling) return;
    shuffleBoard();
    state.position = 0;
    boardDice.disabled = false;
    rollBtn.disabled = false;
    setDiceFace(boardDice, null);
    stepText.textContent = "棋盘已重开";
    resultTitle.textContent = "新棋盘闪亮登场";
    resultText.textContent = "美食顺序已被命运抓起来摇匀。上一局作废，饭运重新投胎，准备开癫！";
    moveLog.innerHTML = "";
    updateCenterStage(getCurrentFood(), "idle");
    positionMascot(false);
  });
}

function requestRoll(event) {
  event?.preventDefault();
  const now = performance.now();
  if (now - lastRollInputAt < 220) return;
  lastRollInputAt = now;
  rollDice();
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
  state.board = createBoardFoods();
  renderBoard();
}

function createBoardFoods() {
  const targetCount = pathCells.length - 1;
  const shuffled = shuffle([...foods]);
  const extras = shuffle([...foods]).slice(0, Math.max(0, targetCount - shuffled.length));
  return [...shuffled, ...extras].slice(0, targetCount);
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
      tile.innerHTML = `
        <span class="index">${String(pathIndex).padStart(2, "0")}</span>
        <span class="thumb"><img src="${getFoodIcon(food)}" alt="" /></span>
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
  boardDice.disabled = true;

  try {
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
  } catch (error) {
    console.error(error);
    document.documentElement.dataset.lastRollError = error?.message || String(error);
    resultTitle.textContent = "骰子卡壳了";
    resultText.textContent = "命运刚才脚滑了一下。再戳一次，饭局马上重启，别让宇宙装死。";
    updateCenterStage(getCurrentFood(), "idle");
  } finally {
    rollBtn.disabled = false;
    boardDice.disabled = false;
    state.rolling = false;
  }
}

function getCurrentFood() {
  if (state.position === 0) return null;
  return state.board[state.position - 1];
}

function getStartRewardFood(roll) {
  const fallback = state.board[roll % state.board.length];
  return {
    name: "起点补给",
    kind: "fun",
    tag: "再开饭",
    icon: fallback.icon,
    vibe: "你竟然绕回起点，说明饭运系统重启成功。奖励一份补给，嘴巴原地复活，胃部开始放烟花。",
  };
}

function setDiceFace(element, value) {
  if (!element) return;
  element.classList.toggle("unknown", !value);
  element.dataset.value = value || "";
  const renderer = getDiceRenderer(element);
  renderer.setValue(value);
}

async function tumbleDice(finalValue) {
  boardDice.classList.remove("rolling");
  boardDice.offsetHeight;
  getDiceRenderer(boardDice).roll(finalValue, 1320);
  boardDice.classList.add("rolling");

  const duration = 1320;
  await wait(duration);
  setDiceFace(boardDice, finalValue);
  boardDice.classList.remove("rolling");
}

function getDiceRenderer(element) {
  if (!diceRenderers.has(element)) {
    diceRenderers.set(element, createDiceRenderer(element));
  }
  return diceRenderers.get(element);
}

function createDiceRenderer(element) {
  element.innerHTML = `<img class="dice-image" alt="" draggable="false" /><span class="dice-mark">?</span>`;
  const image = element.querySelector(".dice-image");
  const mark = element.querySelector(".dice-mark");
  const renderer = {
    value: null,
    frame: null,
    setValue(value) {
      this.value = value;
      image.src = getDiceImageSource(value || 1);
      mark.hidden = Boolean(value);
    },
    roll(finalValue, duration) {
      window.cancelAnimationFrame(this.frame);
      mark.hidden = true;
      const start = performance.now();
      const animate = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const ease = 1 - Math.pow(1 - progress, 3);
        const previewValue = progress > 0.78 ? finalValue : (Math.floor(ease * 31) % 6) + 1;
        image.src = getDiceImageSource(previewValue);
        if (progress < 1) {
          this.frame = window.requestAnimationFrame(animate);
        } else {
          this.value = finalValue;
          element.dataset.value = finalValue;
          image.src = getDiceImageSource(finalValue);
        }
      };
      this.frame = window.requestAnimationFrame(animate);
    },
  };
  renderer.setValue(null);
  return renderer;
}

function getDiceImageSource(value) {
  const key = String(value || 1);
  return window.DICE_IMAGES?.[key] || `assets/dice/dice-${key}.png`;
}

function drawReferenceDice(canvas, context, options = {}) {
  const rect = canvas.getBoundingClientRect();
  const size = Math.max(96, Math.round(rect.width || 140));
  const ratio = window.devicePixelRatio || 1;
  if (canvas.width !== size * ratio || canvas.height !== size * ratio) {
    canvas.width = size * ratio;
    canvas.height = size * ratio;
  }

  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, size, size);

  const bounce = Math.sin((options.progress || 1) * Math.PI) * size * 0.08;
  const squash = options.progress > 0.58 && options.progress < 0.75
    ? 1 - Math.sin((options.progress - 0.58) / 0.17 * Math.PI) * 0.08
    : 1;
  const twist = options.rollTwist || 0;

  context.save();
  context.translate(size * 0.5, size * 0.5 - bounce);
  context.rotate(twist);
  context.scale(1 + (1 - squash) * 0.16, squash);
  context.translate(-size * 0.5, -size * 0.5);

  const point = ([x, y]) => ({ x: x * size, y: y * size });
  const top = [[0.205, 0.34], [0.49, 0.17], [0.8, 0.31], [0.5, 0.495]].map(point);
  const left = [[0.205, 0.34], [0.5, 0.495], [0.5, 0.795], [0.225, 0.64]].map(point);
  const right = [[0.5, 0.495], [0.8, 0.31], [0.785, 0.66], [0.5, 0.795]].map(point);
  const radius = size * 0.16;

  drawReferenceShadow(context, size, options.progress || 1);
  drawReferenceBody(context, [top, left, right], size);
  drawReferenceFace(context, top, radius, ["#fffdf5", "#f8ead0", "#e7d1a8"], "top");
  drawReferenceFace(context, left, radius, ["#fff2d8", "#ecd4aa", "#c7aa7e"], "left");
  drawReferenceFace(context, right, radius, ["#f4ead8", "#dfceb3", "#b9ab91"], "right");
  drawReferenceSeams(context, top, left, right, radius, size);

  if (options.question) {
    drawReferenceQuestion(context, top, size);
  } else {
    drawReferencePips(context, top, options.topValue || 1, size, "top");
  }
  drawReferencePips(context, left, 3, size, "left");
  drawReferencePips(context, right, 5, size, "right");

  context.restore();
}

function drawReferenceShadow(context, size, progress) {
  context.save();
  context.fillStyle = `rgba(55, 45, 34, ${0.18 + progress * 0.08})`;
  context.filter = `blur(${size * 0.045}px)`;
  context.beginPath();
  context.ellipse(size * 0.55, size * 0.82, size * 0.34, size * 0.095, -0.08, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawReferenceBody(context, faces, size) {
  context.save();
  context.beginPath();
  faces.forEach((face) => polygonPath(context, face));
  const body = context.createLinearGradient(size * 0.18, size * 0.16, size * 0.84, size * 0.84);
  body.addColorStop(0, "#fffdf4");
  body.addColorStop(0.43, "#f5e5c5");
  body.addColorStop(0.76, "#d4bc92");
  body.addColorStop(1, "#a99572");
  context.fillStyle = body;
  context.shadowColor = "rgba(87, 66, 42, 0.33)";
  context.shadowBlur = size * 0.105;
  context.shadowOffsetY = size * 0.045;
  context.fill();
  context.restore();
}

function drawReferenceFace(context, points, radius, stops, side) {
  context.save();
  roundedPolygonPath(context, points, radius);
  const gradient = context.createLinearGradient(points[0].x, points[0].y, points[2].x, points[2].y);
  gradient.addColorStop(0, stops[0]);
  gradient.addColorStop(0.54, stops[1]);
  gradient.addColorStop(1, stops[2]);
  context.fillStyle = gradient;
  context.fill();
  context.clip();

  const x = points.reduce((sum, item) => sum + item.x, 0) / points.length;
  const y = points.reduce((sum, item) => sum + item.y, 0) / points.length;
  const highlight = context.createRadialGradient(x - radius * 1.8, y - radius * 1.7, 0, x, y, radius * 4.6);
  highlight.addColorStop(0, side === "right" ? "rgba(255, 255, 255, 0.34)" : "rgba(255, 255, 255, 0.78)");
  highlight.addColorStop(0.42, "rgba(255, 255, 255, 0.1)");
  highlight.addColorStop(1, "rgba(129, 100, 62, 0.22)");
  context.fillStyle = highlight;
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);

  const panel = context.createLinearGradient(points[0].x, points[0].y, points[3].x, points[3].y);
  panel.addColorStop(0, "rgba(255, 255, 255, 0.28)");
  panel.addColorStop(0.5, "rgba(255, 255, 255, 0.02)");
  panel.addColorStop(1, "rgba(111, 87, 56, 0.12)");
  context.fillStyle = panel;
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  context.restore();
}

function drawReferenceSeams(context, top, left, right, radius, size) {
  context.save();
  context.lineJoin = "round";
  context.lineCap = "round";
  context.lineWidth = size * 0.034;
  context.strokeStyle = "rgba(255, 255, 255, 0.76)";
  [top, left, right].forEach((face) => {
    roundedPolygonPath(context, face, radius);
    context.stroke();
  });
  context.lineWidth = size * 0.013;
  context.strokeStyle = "rgba(122, 101, 72, 0.22)";
  [top, left, right].forEach((face) => {
    roundedPolygonPath(context, face, radius);
    context.stroke();
  });
  context.restore();
}

function drawReferenceQuestion(context, face, size) {
  const center = faceCenter(face);
  const fontSize = size * 0.25;
  context.save();
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `900 ${fontSize}px ui-rounded, "Arial Rounded MT Bold", "Nunito", system-ui, sans-serif`;
  context.lineJoin = "round";
  context.shadowColor = "rgba(83, 45, 24, 0.22)";
  context.shadowBlur = size * 0.018;
  context.shadowOffsetY = size * 0.012;
  context.strokeStyle = "rgba(255, 255, 255, 0.9)";
  context.lineWidth = size * 0.018;
  context.strokeText("?", center.x, center.y + size * 0.006);
  context.fillStyle = "#e84033";
  context.fillText("?", center.x, center.y + size * 0.006);
  context.restore();
}

function drawReferencePips(context, face, value, size, side) {
  const layouts = {
    1: [[0, 0]],
    2: [[-0.36, -0.34], [0.36, 0.34]],
    3: [[-0.38, -0.36], [0, 0], [0.38, 0.36]],
    4: [[-0.35, -0.35], [0.35, -0.35], [-0.35, 0.35], [0.35, 0.35]],
    5: [[-0.37, -0.37], [0.37, -0.37], [0, 0], [-0.37, 0.37], [0.37, 0.37]],
    6: [[-0.36, -0.42], [0.36, -0.42], [-0.36, 0], [0.36, 0], [-0.36, 0.42], [0.36, 0.42]],
  };
  const radius = side === "top" ? size * 0.045 : size * 0.043;
  layouts[value].forEach(([u, v]) => {
    const point = facePoint(face, 0.5 + u * 0.52, 0.5 + v * 0.52);
    drawReferencePip(context, point, radius, side);
  });
}

function drawReferencePip(context, point, radius, side) {
  const rotation = side === "left" ? 0.78 : side === "right" ? -0.58 : 0;
  const yScale = side === "top" ? 0.72 : 1.08;
  context.save();
  context.translate(point.x, point.y);
  context.rotate(rotation);

  const dent = context.createRadialGradient(-radius * 0.22, -radius * 0.34, radius * 0.12, 0, 0, radius * 1.55);
  dent.addColorStop(0, "rgba(255, 255, 255, 0.86)");
  dent.addColorStop(0.38, "rgba(160, 110, 70, 0.22)");
  dent.addColorStop(1, "rgba(68, 42, 25, 0.3)");
  context.fillStyle = dent;
  context.beginPath();
  context.ellipse(0, radius * 0.06, radius * 1.34, radius * yScale * 1.1, 0, 0, Math.PI * 2);
  context.fill();

  const red = context.createRadialGradient(-radius * 0.28, -radius * 0.32, radius * 0.1, 0, 0, radius * 1.05);
  red.addColorStop(0, "#ff8d75");
  red.addColorStop(0.48, "#ef4033");
  red.addColorStop(1, "#a71912");
  context.fillStyle = red;
  context.beginPath();
  context.ellipse(0, 0, radius, radius * yScale * 0.92, 0, 0, Math.PI * 2);
  context.fill();

  context.strokeStyle = "rgba(112, 36, 26, 0.28)";
  context.lineWidth = Math.max(1, radius * 0.13);
  context.stroke();

  context.fillStyle = "rgba(255, 255, 255, 0.68)";
  context.beginPath();
  context.ellipse(-radius * 0.35, -radius * yScale * 0.34, radius * 0.27, radius * yScale * 0.18, -0.46, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function faceCenter(face) {
  return {
    x: face.reduce((sum, point) => sum + point.x, 0) / face.length,
    y: face.reduce((sum, point) => sum + point.y, 0) / face.length,
  };
}

function facePoint(face, u, v) {
  const [a, b, c, d] = face;
  const top = mixPoint(a, b, u);
  const bottom = mixPoint(d, c, u);
  return mixPoint(top, bottom, v);
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

function drawDiceCanvas(canvas, context, angles, progress = 1, options = {}) {
  const rect = canvas.getBoundingClientRect();
  const size = Math.max(72, Math.round(rect.width || 120));
  const ratio = window.devicePixelRatio || 1;
  if (canvas.width !== size * ratio || canvas.height !== size * ratio) {
    canvas.width = size * ratio;
    canvas.height = size * ratio;
  }
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, size, size);

  if (options.blank) {
    drawBlankDiceCanvas(context, size);
    return;
  }

  const bounce = Math.sin(progress * Math.PI) * (1 - progress) * size * 0.14;
  const squash = progress > 0.62 && progress < 0.78 ? 1 - Math.sin((progress - 0.62) / 0.16 * Math.PI) * 0.08 : 1;
  const center = { x: size / 2, y: size / 2 - bounce };
  const scale = size * 0.3;
  const camera = 4.6;

  const shadowWidth = size * (0.46 + (1 - progress) * 0.12);
  context.save();
  context.fillStyle = `rgba(52, 41, 28, ${0.18 + progress * 0.08})`;
  context.filter = `blur(${size * 0.038}px)`;
  context.beginPath();
  context.ellipse(size / 2, size * 0.78, shadowWidth, size * 0.095, 0, 0, Math.PI * 2);
  context.fill();
  context.restore();

  const faces = buildDiceFaces().map((face) => {
    const corners = face.corners.map((point) => rotatePoint(point, angles, squash));
    const normal = rotatePoint(face.normal, angles, 1, true);
    const projected = corners.map((point) => projectPoint(point, center, scale, camera));
    return {
      ...face,
      corners,
      normal,
      projected,
      area: Math.abs(polygonArea(projected)),
      depth: average(corners.map((point) => point.z)),
    };
  });

  const visibleFaces = faces
    .filter((face) => face.normal.z > -0.08)
    .sort((a, b) => a.depth - b.depth);

  const questionFace = options.blank
    ? visibleFaces.reduce((largest, face) => face.area > largest.area ? face : largest, visibleFaces[0])
    : null;

  drawDiceBodyBase(context, visibleFaces, center, scale);

  visibleFaces.forEach((face) => {
    drawDiceFace(context, face, center, scale, camera, {
      blank: options.blank,
      question: Boolean(questionFace && questionFace.value === face.value),
    });
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

function drawBlankDiceCanvas(context, size) {
  const point = ([x, y]) => ({ x: x * size, y: y * size });
  const top = [[0.22, 0.32], [0.49, 0.17], [0.81, 0.3], [0.5, 0.48]].map(point);
  const left = [[0.22, 0.32], [0.5, 0.48], [0.49, 0.81], [0.23, 0.65]].map(point);
  const front = [[0.5, 0.48], [0.81, 0.3], [0.82, 0.66], [0.49, 0.81]].map(point);
  const center = {
    x: top.reduce((sum, item) => sum + item.x, 0) / top.length,
    y: top.reduce((sum, item) => sum + item.y, 0) / top.length,
  };
  const radius = size * 0.16;

  context.save();
  context.fillStyle = "rgba(72, 56, 36, 0.26)";
  context.filter = `blur(${size * 0.035}px)`;
  context.beginPath();
  context.ellipse(size * 0.54, size * 0.82, size * 0.34, size * 0.085, -0.08, 0, Math.PI * 2);
  context.fill();
  context.restore();

  context.save();
  context.beginPath();
  [top, left, front].forEach((face) => polygonPath(context, face));
  const body = context.createLinearGradient(size * 0.2, size * 0.16, size * 0.84, size * 0.86);
  body.addColorStop(0, "#fffdf2");
  body.addColorStop(0.46, "#f4e2bf");
  body.addColorStop(1, "#bfa57d");
  context.fillStyle = body;
  context.shadowColor = "rgba(82, 62, 38, 0.3)";
  context.shadowBlur = size * 0.08;
  context.shadowOffsetY = size * 0.035;
  context.fill();
  context.restore();

  drawBlankFace(context, top, radius, ["#fffdf7", "#f8e9ca", "#dec59b"]);
  drawBlankFace(context, left, radius, ["#fbefd5", "#ead2aa", "#c4a378"]);
  drawBlankFace(context, front, radius, ["#f9edcf", "#e5c99c", "#b99b73"]);

  context.save();
  context.lineJoin = "round";
  context.lineCap = "round";
  context.lineWidth = size * 0.022;
  context.strokeStyle = "rgba(255, 255, 255, 0.72)";
  [top, left, front].forEach((face) => {
    roundedPolygonPath(context, face, radius);
    context.stroke();
  });
  context.lineWidth = size * 0.012;
  context.strokeStyle = "rgba(116, 89, 58, 0.18)";
  roundedPolygonPath(context, front, radius);
  context.stroke();
  context.restore();

  drawQuestionGlyph(context, center.x, center.y, size * 0.22);
}

function drawBlankFace(context, points, radius, stops) {
  context.save();
  roundedPolygonPath(context, points, radius);
  const gradient = context.createLinearGradient(points[0].x, points[0].y, points[2].x, points[2].y);
  gradient.addColorStop(0, stops[0]);
  gradient.addColorStop(0.54, stops[1]);
  gradient.addColorStop(1, stops[2]);
  context.fillStyle = gradient;
  context.fill();
  context.clip();

  const x = points.reduce((sum, item) => sum + item.x, 0) / points.length;
  const y = points.reduce((sum, item) => sum + item.y, 0) / points.length;
  const highlight = context.createRadialGradient(x - radius * 1.6, y - radius * 1.4, 0, x, y, radius * 4.2);
  highlight.addColorStop(0, "rgba(255, 255, 255, 0.76)");
  highlight.addColorStop(0.44, "rgba(255, 255, 255, 0.1)");
  highlight.addColorStop(1, "rgba(122, 92, 54, 0.18)");
  context.fillStyle = highlight;
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
  context.restore();
}

function drawDiceFace(context, face, center, scale, camera, options = {}) {
  const points = face.projected || face.corners.map((point) => projectPoint(point, center, scale, camera));
  const light = Math.max(0, face.normal.x * -0.18 + face.normal.y * -0.48 + face.normal.z * 0.9);
  const cream = Math.round(239 + light * 14);
  const shade = Math.round(213 + light * 24);

  context.save();
  roundedPolygonPath(context, points, scale * 0.42);

  const gradient = context.createLinearGradient(points[0].x, points[0].y, points[2].x, points[2].y);
  gradient.addColorStop(0, "rgb(255, 252, 241)");
  gradient.addColorStop(0.45, `rgb(${cream}, ${Math.min(250, cream - 4)}, ${Math.min(237, cream - 18)})`);
  gradient.addColorStop(1, `rgb(${shade}, ${Math.max(194, shade - 13)}, ${Math.max(166, shade - 34)})`);
  context.fillStyle = gradient;
  context.shadowColor = "rgba(76, 55, 31, 0.2)";
  context.shadowBlur = scale * 0.14;
  context.shadowOffsetY = scale * 0.04;
  context.fill();
  context.clip();

  context.lineWidth = scale * 0.055;
  context.lineJoin = "round";
  context.strokeStyle = "rgba(171, 147, 109, 0.28)";
  roundedPolygonPath(context, points, scale * 0.42);
  context.stroke();

  drawFaceHighlight(context, points, scale);
  if (!options.blank) {
    drawPips(context, face.value, face.corners, center, scale, camera);
  } else if (options.question) {
    drawQuestionMark(context, face.corners, center, scale, camera);
  }
  context.restore();
}

function drawDiceBodyBase(context, faces, center, scale) {
  if (!faces.length) return;

  context.save();
  context.beginPath();
  faces.forEach((face) => {
    polygonPath(context, face.projected);
  });

  const bodyGradient = context.createLinearGradient(
    center.x - scale * 1.2,
    center.y - scale * 1.25,
    center.x + scale * 1.2,
    center.y + scale * 1.3
  );
  bodyGradient.addColorStop(0, "#fffdf4");
  bodyGradient.addColorStop(0.48, "#f4e7cc");
  bodyGradient.addColorStop(1, "#bfa984");
  context.fillStyle = bodyGradient;
  context.shadowColor = "rgba(77, 58, 37, 0.28)";
  context.shadowBlur = scale * 0.24;
  context.shadowOffsetY = scale * 0.14;
  context.fill();

  context.shadowColor = "transparent";
  context.lineJoin = "round";
  context.lineCap = "round";
  context.lineWidth = scale * 0.12;
  context.strokeStyle = "rgba(255, 252, 242, 0.68)";
  context.stroke();
  context.lineWidth = scale * 0.035;
  context.strokeStyle = "rgba(107, 88, 62, 0.18)";
  context.stroke();
  context.restore();
}

function polygonPath(context, points) {
  points.forEach((point, index) => {
    if (index === 0) context.moveTo(point.x, point.y);
    else context.lineTo(point.x, point.y);
  });
  context.closePath();
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
    const cornerRadius = Math.min(clampedRadius, distanceToPrevious * 0.48, distanceToNext * 0.48);
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
  const gradient = context.createRadialGradient(x - scale * 0.34, y - scale * 0.32, 0, x, y, scale * 1.24);
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.72)");
  gradient.addColorStop(0.35, "rgba(255, 255, 255, 0.18)");
  gradient.addColorStop(1, "rgba(133, 104, 67, 0.2)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);

  const sheen = context.createLinearGradient(points[0].x, points[0].y, points[2].x, points[2].y);
  sheen.addColorStop(0, "rgba(255, 255, 255, 0.54)");
  sheen.addColorStop(0.22, "rgba(255, 255, 255, 0.12)");
  sheen.addColorStop(0.56, "rgba(255, 255, 255, 0)");
  sheen.addColorStop(1, "rgba(126, 93, 52, 0.12)");
  context.fillStyle = sheen;
  context.fillRect(0, 0, context.canvas.width, context.canvas.height);
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
    const radius = Math.max(4.2, projected.scale * scale * 0.12);

    context.save();
    const dent = context.createRadialGradient(projected.x - radius * 0.2, projected.y - radius * 0.28, radius * 0.18, projected.x, projected.y, radius * 1.48);
    dent.addColorStop(0, "rgba(255, 255, 255, 0.82)");
    dent.addColorStop(0.42, "rgba(180, 139, 95, 0.2)");
    dent.addColorStop(1, "rgba(79, 48, 27, 0.24)");
    context.fillStyle = dent;
    context.beginPath();
    context.ellipse(projected.x, projected.y + radius * 0.04, radius * 1.28, radius * 1.08, 0, 0, Math.PI * 2);
    context.fill();

    const pipGradient = context.createRadialGradient(projected.x - radius * 0.32, projected.y - radius * 0.34, radius * 0.1, projected.x, projected.y, radius * 1.08);
    pipGradient.addColorStop(0, "#ff8a72");
    pipGradient.addColorStop(0.45, "#ef3f31");
    pipGradient.addColorStop(1, "#a91812");
    context.fillStyle = pipGradient;
    context.beginPath();
    context.ellipse(projected.x, projected.y, radius, radius * 0.9, 0, 0, Math.PI * 2);
    context.fill();

    context.strokeStyle = "rgba(121, 34, 25, 0.24)";
    context.lineWidth = Math.max(1, radius * 0.14);
    context.stroke();

    context.fillStyle = "rgba(255, 255, 255, 0.72)";
    context.beginPath();
    context.ellipse(projected.x - radius * 0.36, projected.y - radius * 0.34, radius * 0.28, radius * 0.18, -0.52, 0, Math.PI * 2);
    context.fill();
    context.restore();
  });
}

function drawQuestionMark(context, corners, center, scale, camera) {
  const [a, b, c, d] = corners;
  const point = bilinearPoint(a, b, c, d, 0.5, 0.5);
  const projected = projectPoint(point, center, scale, camera);
  const fontSize = Math.max(28, scale * projected.scale * 0.82);
  drawQuestionGlyph(context, projected.x, projected.y + fontSize * 0.02, fontSize);
}

function drawQuestionGlyph(context, x, y, fontSize) {
  context.save();
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = `900 ${fontSize}px ui-rounded, "Arial Rounded MT Bold", "Nunito", system-ui, sans-serif`;
  context.lineJoin = "round";
  context.shadowColor = "rgba(88, 44, 23, 0.22)";
  context.shadowBlur = fontSize * 0.1;
  context.shadowOffsetY = fontSize * 0.055;
  context.strokeStyle = "rgba(255, 255, 255, 0.78)";
  context.lineWidth = Math.max(5, fontSize * 0.16);
  context.strokeText("?", x, y);
  context.fillStyle = "#df3d2f";
  context.fillText("?", x, y);

  context.shadowColor = "transparent";
  context.fillStyle = "rgba(255, 255, 255, 0.66)";
  context.font = `900 ${fontSize * 0.26}px ui-rounded, "Arial Rounded MT Bold", system-ui, sans-serif`;
  context.fillText("?", x - fontSize * 0.13, y - fontSize * 0.27);
  context.restore();
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

function polygonArea(points) {
  return points.reduce((area, point, index) => {
    const next = points[(index + 1) % points.length];
    return area + point.x * next.y - next.x * point.y;
  }, 0) / 2;
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
  foodEmoji.textContent = "";
  foodImage.src = getFoodIcon(food);
  foodImage.alt = food.name;
  foodPhoto.className = `food-photo kind-${food.kind}`;
}

function getFoodIcon(food) {
  return `assets/iconfont-food/${food.icon}.svg`;
}

function buildReason(food, roll, fortuneSteps) {
  const luckyNumber = getLuckyNumber(food, roll);
  const context = {
    food,
    roll,
    fortuneSteps,
    luckyNumber,
    emoji: getFoodEmoji(food),
    weather: getWeatherSetup(food),
    luckyTake: getLuckyTake(luckyNumber),
    tagTake: getTagTake(food, luckyNumber, roll),
    command: getEatCommand(food, luckyNumber),
  };
  const styles = [
    buildDongbeiReason,
    buildStandupReason,
    buildRapReason,
    buildFortuneRadioReason,
    buildOverlordReason,
    buildCustomerServiceReason,
  ];
  const styleIndex = (state.position + roll + food.name.length + new Date().getDate()) % styles.length;
  return styles[styleIndex](context);
}

function buildDongbeiReason({ food, luckyNumber, luckyTake, tagTake, command }) {
  return `哎妈呀，${getWeatherDialect()}整${food.name}！
幸运 ${luckyNumber}：${luckyTake}。
${tagTake}${food.name}今天很会来事儿，${shortVibe(food)}
${command}`;
}

function buildStandupReason({ food, luckyNumber, luckyTake, tagTake, command }) {
  return `${getWeatherStandup()}所以今天吃${food.name}，很合理，甚至有点离谱地合理。
幸运 ${luckyNumber}：${luckyTake}。
${food.tag}值拉满，咬一口，嘴巴先替你鼓掌。
${command}`;
}

function buildRapReason({ food, luckyNumber, tagTake, command, emoji }) {
  return `Yo——${getWeatherRap()}
${food.name}在我手，${food.tag}有节奏。
幸运 ${luckyNumber}，饭运不发愁。
${tagTake}${shortVibe(food)}
${command} ${emoji}`;
}

function buildFortuneRadioReason({ food, luckyNumber, luckyTake, tagTake, command }) {
  return `【饭运电台】${state.weather.text}，检测到嘴巴开始闪灯。
幸运 ${luckyNumber}：${luckyTake}。
本期指定嘉宾：${food.name}。${tagTake}
${command}`;
}

function buildOverlordReason({ food, luckyNumber, tagTake, command }) {
  return `饭桌霸总宣布：今天，${food.name}上位。
${state.fortune.name}已签字，幸运 ${luckyNumber} 当场盖章。
${tagTake}${shortVibe(food)}
${command}`;
}

function buildCustomerServiceReason({ food, luckyNumber, luckyTake, command }) {
  return `您好，食欲已叫号：请到${food.name}窗口办理。
天气「${state.weather.text}」，运势「${state.fortune.name}」，幸运 ${luckyNumber}：${luckyTake}。
${food.tag}服务已开通，拒绝会导致嘴巴投诉。
${command}`;
}

function shortVibe(food) {
  return food.vibe.split(/[，。！？]/)[0];
}

function getWeatherSetup(food) {
  if (state.weather.mood === "rain" && food.kind === "warm") return `雨天把世界泡软了，${food.name}这种热乎选手一上桌，胃当场鼓掌。`;
  if (state.weather.mood === "hot" && (food.kind === "light" || food.kind === "sweet")) return `天热到太阳都想请病假，${food.name}这种清爽路线直接把热气按进回收站。`;
  if (state.weather.mood === "cool" && food.kind === "warm") return `微凉得像风在偷偷叹气，${food.name}一出现，锅气开始咚咚敲门。`;
  if (state.weather.mood === "hot") return `天气热得离谱，路边石头都想点冰饮，但饭运偏偏把${food.name}举到你面前。`;
  if (state.weather.mood === "rain") return `雨天自带懒人滤镜，世界湿漉漉，${food.name}负责把嘴巴哄到开机。`;
  if (state.weather.mood === "cool") return `微凉天气像一只冷手拍你肩膀：别愣着，${food.name}已经在饭运门口排队。`;
  return `${state.weather.text}，气氛已经铺好，${food.name}正在后台疯狂热身。`;
}

function getWeatherDialect() {
  if (state.weather.mood === "hot") return "这天儿热得离谱，影子都想请假。";
  if (state.weather.mood === "rain") return "外头湿哒哒的，鞋底都开始讲感情。";
  if (state.weather.mood === "cool") return "这小风一吹，肚子都开始打报告。";
  return "这天气不整点好吃的，白瞎这张嘴了。";
}

function getWeatherStandup() {
  if (state.weather.mood === "hot") return "天一热，脑子就想罢工。";
  if (state.weather.mood === "rain") return "一下雨，人就像没放盐的豆腐。";
  if (state.weather.mood === "cool") return "天气一凉，外套都说它饿。";
  return "今天天气像老板说『简单聊两句』。";
}

function getWeatherRap() {
  if (state.weather.mood === "hot") return "天热到爆炸，嘴巴要降噪";
  if (state.weather.mood === "rain") return "雨点哒哒哒，饭点别拖拉";
  if (state.weather.mood === "cool") return "小风吹到脸，锅气要上线";
  return "天气刚刚好，食欲别迟到";
}

function getLuckyNumber(food, roll) {
  return ((new Date().getDate() + roll + food.name.length) % 9) + 1;
}

function getLuckyTake(luckyNumber) {
  const takes = {
    1: "筷子站军姿，嘴巴听指挥",
    2: "两只碗排队，一个喊饿一个喊再来",
    3: "嘴角偷偷上扬，快乐漏馅了",
    4: "稳稳落袋，胃很安心",
    5: "饭点哨声响，装不饿很尴尬",
    6: "6 翻身像 9，运气会转弯",
    7: "小勺子拐弯，好吃的往你这舀",
    8: "两个饭碗抱抱，富贵得可疑",
    9: "快乐续杯，能撑到下个饭点",
  };
  return takes[luckyNumber];
}

function getTagTake(food, luckyNumber, roll) {
  const takes = [
    `「${food.tag}」把困意一脚踢飞。`,
    `「${food.tag}」气场强到菜单都回头。`,
    `「${food.tag}」负责撑场面，空气都想蘸酱。`,
    `「${food.tag}」能量飙升，嘴巴请上岗。`,
    `这一口是饭运指定动作，少吃像错过彩蛋。`,
    `「${food.tag}」已贴便签：别犟，快吃。`,
  ];
  return takes[(luckyNumber + roll + food.name.length) % takes.length];
}

function getEatCommand(food, luckyNumber) {
  const commands = [
    `吃它！立刻！${getFoodEmoji(food)}💥`,
    `别问，问就是它！冲！${getFoodEmoji(food)}✨`,
    `批准入口！现在、马上、安排！${getFoodEmoji(food)}🔥`,
    `嘴巴已盖章：今日就它！${getFoodEmoji(food)}🎉`,
    `整！必须整！${getFoodEmoji(food)}`,
    `给它一个入口，给今天一个交代！${getFoodEmoji(food)}⚡`,
  ];
  return commands[(food.name.length + luckyNumber + new Date().getMinutes()) % commands.length];
}

function getFoodEmoji(food) {
  const emojis = {
    草莓: "🍓",
    橙子: "🍊",
    冰激凌: "🍦",
    蔓越莓: "🍒",
    开心果: "🥜",
    梨: "🍐",
    汉堡: "🍔",
    芒果: "🥭",
    牛油果: "🥑",
    核桃: "🌰",
    牛奶: "🥛",
    松子: "🌰",
    披萨: "🍕",
    夏威夷果: "🌰",
    甜甜圈: "🍩",
    吐司: "🍞",
    榛子: "🌰",
    腰果: "🥜",
    杏仁: "🌰",
    奇异果: "🥝",
    起点补给: "🍽️",
  };
  return emojis[food.name] || "🍽️";
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
