const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17;
const MONSTER_ATTACK_VALUE = 14;
const HEAL_VALUE = 20;

const LOG_EVENT_PLAYER_ATTACK = "ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

const enteredValue = parseInt(
  prompt("MAXIMUM LIFE FOR YOU AND THE MONSTER", "100")
);

let chosenMaxLife = enteredValue;
let battleLog = [];

if (isNaN(chosenMaxLife) || chosenMaxLife <= 0) {
  chosenMaxLife = 100;
}

let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth) {
  let logEntry = {
    event: event,
    value: value,
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };

  if (event === LOG_EVENT_PLAYER_ATTACK) {
    logEntry.target = "MONSTER";
  } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
    logEntry.target = "MONSTER";
  } else if (event === LOG_EVENT_MONSTER_ATTACK) {
    logEntry.target = "PLAYER";
  } else if (event === LOG_EVENT_PLAYER_HEAL) {
    logEntry.target = "PLAYER";
  }
  battleLog.push(logEntry);
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

function endRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;

  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("BONUS LIFE SAVED YOU");
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("YOU WON");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("YOU LOST");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "MONSTER WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth <= 0) {
    alert("THERE WAS A DRAW");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "DRAW",
      currentMonsterHealth,
      currentPlayerHealth
    );
  }

  if (currentPlayerHealth <= 0 || currentMonsterHealth <= 0) {
    reset();
  }
}

function attackMonster(attackValue, logEvent) {
  const damage = dealMonsterDamage(attackValue);
  currentMonsterHealth -= damage;

  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);

  endRound();
}

function attackHandler() {
  attackMonster(ATTACK_VALUE, LOG_EVENT_PLAYER_ATTACK);
}

function strongAttackHandler() {
  attackMonster(STRONG_ATTACK_VALUE, LOG_EVENT_PLAYER_STRONG_ATTACK);
}

function healPlayerHandler() {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("You can't heal for more than your max initial health");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
}

function printLogHandler() {
  for (const logEntry of battleLog) {
    console.log(logEntry);
  }
  console.log(battleLog);
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
