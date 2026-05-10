// ==================
// GAME STATE
// ==================
let playerHealth = 100;
let sanity = 100;
let fear = 0;
let fearLevel = 0;
let isGameOver = false;
let ghostSighted = false;
let location = "outside";
let doorLocked = true;
let inventory = [];
let gameState = "outside";
let visitedOffice = false;
let visitedBedroom = false;
let visitedBasement = false;
let foundCombination1 = false;
let foundCombination2 = false;
let foundJournalPages = false;
let safeUnlocked = false;

// ==================
// FEAR SYSTEM
// ==================
function increaseFear() {
  fear += 15;
}

// ==================
// SANITY SYSTEM
// ==================
function loseSanity() {
  if (sanity > 0) {
    sanity -= 10;
  }
}

function checkSanity() {
  if (sanity > 75) {
    return "You feel at ease, nothing has bothered you since entering.";
  } else if (sanity > 50) {
    return "You can feel something creeping in on you. The hairs on the back of your neck stand on end.";
  } else if (sanity > 25) {
    return "The air is heavy now, you sense something just out of your view. You begin feeling paranoid and anxious.";
  } else {
    return "It's maddening, the echoes of the house are nails on a chalkboard. You swear you heard someone talking to you...was that you?";
  }
}

// ==================
// HEALTH SYSTEM
// ==================
function takeDamage(damage) {
  playerHealth -= damage;
  if (playerHealth <= 0) {
    isGameOver = true;
    gameState = "gameover";
    updateButtons();
    return "You fought hard but the supernatural fought harder and they didn't need a break. And now...you are dead and get to join them.";
  } else {
    return "Health remaining: " + playerHealth;
  }
}

// ==================
// DOOR SYSTEM
// ==================
function unlockDoor() {
  doorLocked = false;
}

function checkDoor() {
  if (doorLocked) {
    return "locked";
  } else {
    return "unlocked";
  }
}

// ==================
// GHOST SYSTEM
// ==================
function sightGhost() {
  ghostSighted = true;
  fearLevel += 25;
  return "You feel the temperature drop, and from the corner of your eye you see the ghost. As your fear begins to ring in your ears, you can only pray it didn't see you too.";
}

function getStatus() {
  if (ghostSighted) {
    return "In Danger";
  } else {
    return "Safe";
  }
}

function createGhost(name, threatLevel) {
  return {
    name: name,
    threatLevel: threatLevel,
    isVisible: false
  };
}

// ==================
// INVENTORY SYSTEM
// ==================
function pickUpItem(item) {
  inventory.push(item);
}

function checkInventory() {
  return inventory.length;
}

function collectEvidence(evidenceList) {
  for (let i = 0; i < evidenceList.length; i++) {
    pickUpItem(evidenceList[i]);
  }
  return "Collected " + evidenceList.length + " pieces of evidence";
}

// ==================
// LOCATION SYSTEM
// ==================
function describeLocation(place) {
  if (place === "outside") {
    return "The night sky casts a creeping shadow over the building. It has an odd feeling about it though it appears normal, there is something not quite right.";
  } else if (place === "inside") {
    return "The feeling of wrongness seems to permeate the inside of the halls. Every step echoes loudly, as if the house itself had a heart beat.";
  } else if (place === "basement") {
    return "The room is pitch black, the air is stale and hard to breathe. But you're not the only thing breathing down here.";
  } else {
    return "Unknown location";
  }
}

// ==================
// INVESTIGATION
// ==================
function investigateRoom() {
  loseSanity();
  increaseFear();
  if (ghostSighted === true) {
    takeDamage(20);
  }
  return getStatus();
}

function startInvestigation() {
  location = "inside";
  ghostSighted = true;
  investigateRoom();
  investigateRoom();
  investigateRoom();
  if (isGameOver === true) {
    return "You tried to solve this nightmare, you looked for everything. But you failed, the last thing you remember were cold hands on your neck as it is snapped.";
  } else {
    return "Despite all odds, and every trick the house and its occupant sent at you, you solved the riddles. You managed to beat the odds and have survived...but at what cost?";
  }
}

function searchBuilding(rooms) {
  for (let i = 0; i < rooms; i++) {
    investigateRoom();
  }
  if (isGameOver === true) {
    return "Your investigation didn't turn up any answers. And that was your downfall, you didn't make it out to try again.";
  } else {
    return "You completed your search unraveling the mysteries a little more than before... hopefully it won't be too late.";
  }
}

// ==================
// NIGHT SYSTEM
// ==================
function nightFalls() {
  fearLevel += 20;
  loseSanity();
  loseSanity();
  loseSanity();
  if (doorLocked === true) {
    return "As the night falls the door to the only safe room is locked, you're safe for another night. But there is another day lying ahead.";
  } else {
    return "As the night fell the door was left open and the ghost knows it. You should run, and hope that it isn't faster than you.";
  }
}

// ==================
// PLAYER ACTIONS
// ==================
function playerAction(action) {
  if (action === "investigate") {
    return investigateRoom();
  } else if (action === "unlock") {
    unlockDoor();
    return "Door unlocked";
  } else if (action === "stats") {
    return getGameStats();
  } else {
    return "Unknown action";
  }
}

function escapeBuilding() {
  if (doorLocked === true) {
    return "The door is locked? How did it get locked you wonder as you try so hard to find a way to open the door. There is nothing that can be done, you can't escape now.";
  } else if (isGameOver === true) {
    return "It's a lost cause, you failed. You place your back on the door, sliding down it as you accept your fate. Where did you go wrong?";
  } else {
    location = "outside";
    return "You grab the doorknob, and with a small and simple twist of the wrist you open the door and peer to the outside.";
  }
}

// ==================
// STATUS CHECKS
// ==================
function quickStatus() {
  return playerHealth > 0 ? "Alive" : "Dead";
}

function doorStatus() {
  return ghostSighted ? "Hide quickly" : "Continue carefully";
}

function canEscape() {
  if (doorLocked === false && isGameOver === false) {
    return "You got all the information you need and have a route planned to get out, you can escape but only if you hurry.";
  } else {
    return "You find yourself trapped, there is no where to go. No exit that lets you out of this nightmare, you can't escape and you never will.";
  }
}

function isInDanger() {
  if (ghostSighted === true || playerHealth < 50 || sanity < 25) {
    return "You're in grave danger!!";
  } else {
    return "You're safe for now...but for how long";
  }
}

function criticalState() {
  if ((playerHealth < 30 && ghostSighted === true) || (sanity < 20 && fearLevel > 50)) {
    return "Danger: Threat imminent. Run...fast.";
  } else {
    return "All systems go. Continue forward.";
  }
}

// ==================
// REPORTING
// ==================
function generateReport() {
  return "Location: " + location + " | Health: " + playerHealth + " | Sanity: " + sanity + " | Fear: " + fearLevel + " | Door: " + checkDoor() + " | Status: " + getStatus();
}

function getGameStats() {
  return {
    health: playerHealth,
    sanity: sanity,
    fear: fearLevel,
    status: getStatus()
  };
}

// ==================
// FULL GAME LOOP
// ==================
function fullGameLoop() {
  let ghost = createGhost("Reaper", "Lethal");
  startInvestigation();
  nightFalls();
  let threat = criticalState();
  let report = generateReport();
  return {
    ghost: ghost,
    threat: threat,
    report: report
  };
}

// ==================
// ROOM HANDLERS
// ==================
function handleOffice() {
  visitedOffice = true;
  gameState = "office";
  showMessage("As you open the door, you see an office in disarray. Papers are scattered everywhere around the office, the computer monitor flickers in the darkness. Its light shining on the bay window over looking the lake. It definitely looks like someone was frantic to find something...");
  updateButtons();
}

function handleBedroom() {
  visitedBedroom = true;
  gameState = "bedroom";
  showMessage("As you open the door you can see this is Ronald's bedroom, if it weren't for the situation you'd leave immediately to not invade this sanctity. The room is massive, you think it's larger than your entire front room and kitchen combined. The massive California king is situated in the back of the room the covers tossed aside. The blinds in the entire room are shut. You see a cross above the bed, a Buddha on the nightstand. The lamp is on and the nightstand has many drawers. Across the room there is a TV mounted on the wall next to the master bathroom. This room doesn't seem to be as big of a disaster as the office, but you still get an odd feeling.");
  updateButtons();
}

function handleBasement() {
  visitedBasement = true;
  gameState = "basement";
  showMessage("As you open the door all you see is the descending stairs. You begin making your way down the stairs, each one creaks under your footsteps. You have an unnerving feeling wash over you as you descend.\n\nThe dim light of the basement still doesn't hide what it is shining by the drain. It's definitely James's ring. He hasn't taken that off since freshman year of high school when he won the MVP in the championship game. Your heart sinks a bit as you collect the ring.");
  pickUpItem("James' Championship Ring");
  updateButtons();
}

// ==================
// OFFICE DISCOVERIES
// ==================
function examineOffice() {
  showMessage("When you look closer at the papers on the floor, there are frantic writings, few words can be made out, 'hunts' is one of the recurring ones you could read. They also have this odd symbol you don't recognize at all.");
  updateDisplay();
}

function examineDesk() {
  if (safeUnlocked === true) {
    showMessage("The safe sits open under the desk, its contents already in your possession. The computer screen still flickers with Ronald's desperate research.");
  } else {
    showMessage("When you look at the computer you can see a bunch of pages open. The one on screen speaks of bringing evil home with you. As you go through the other pages you notice they're all relating to supernatural myths and legends. As you look closer at the desk you notice a large safe underneath it. You try to open it but it doesn't budge, it takes a passcode. Most people have them memorized, but they also have them wrote down somewhere. Maybe there's something in there that can help locate Ronald and James. You should keep an eye out for the combination.");
    attemptSafe();
  }
  updateDisplay();
}

function examineBayWindow() {
  showMessage("As you walk over to the bay window you can see an oil spot, as if someone placed their forehead against the pane of glass in defeat. Outside the window you can see the lake, what is beautiful in the day, holds an eerie stillness in the pale moonlight. As you peer out the window something dark flashes in the corner of your vision. Causing you to jump slightly. But then there was nothing...maybe it was your imagination.");
  updateDisplay();
}

function backToLobby() {
  gameState = "inside";
  showMessage("As you leave the office, the lobby feels even more weighted. The sense of dread is growing and the feeling something is watching tickles at the back of your mind.");
  updateButtons();
}

// ==================
// BEDROOM DISCOVERIES
// ==================
function searchDresser() {
  showMessage("Inside the top drawer you find multiple religious books. From all different walks of life, curious as to why he has so many and of different faiths. The second drawer holds a journal, but the pages are all torn out of it in a frantic fashion. One piece of paper catches your eye, it has a number still attached to the journal. '31'");
  foundCombination1 = true;
  updateDisplay();
}

function examineBed() {
  showMessage("The bed is massive, it could fit four well built adults with room to spare. On the floor there is a scuff mark. You look closely at the scuff mark. The bed had been moved forcefully.");
  updateDisplay();
}

function examineLamp() {
  showMessage("The nightstand seems antique, probably older than the house itself by many centuries. The drawer handles are all worn from consistent usage. The lamp buzzes loudly and doesn't seem to have been touched in a long time, as if the light had not been turned off.");
  updateDisplay();
}

function bedroomBackToLobby() {
  gameState = "inside";
  showMessage("As you leave the personal space of Ronald. You should feel relief, but you feel the complete opposite. The sense of dread grows more as you re-enter the lobby.");
  updateDisplay();
  updateButtons();
}

// ==================
// BASEMENT DISCOVERIES
// ==================
function searchToolBench() {
  if (visitedBedroom === true) {
    showMessage("You look around the tool bench, the pages scattered among them are the missing pages from Ronald's journal. As you gather them up you notice one page is still missing.");
    foundJournalPages = true;
  } else {
    showMessage("There are torn pages scattered all over the table, they seem to be hastily torn from their place. It only confuses you even more than you already were.");
  }
}

function inspectWaterHeater() {
  if (visitedBedroom === true) {
    showMessage("You find a torn journal page near the water heater, it looks like it was dropped in a hurry. As you unfold it you can see it is Ronald's handwriting, it's the last of his journal entries, most can be read. 'I figured it out...I can't believe it is true. I never believed in these things...but evil exists and I invited it for dinner. The name on the paper...the back of it. I need to get the....from....safe.....room....under....Jack...' At the bottom of the page scrawled hastily is a number. '13'");
  } else {
    showMessage("You find a folded piece of paper, when you unfold it you can see frantic hurried scribbles. You can make out 'I figured it out...I can't believe it is true. I never believed in these things...but evil exists and I invited it for dinner. The name on the paper...the back of it. I need to get the....from....safe.....room....under....Jack...' At the bottom of the page scrawled hastily is a number. '13'");
 }
  foundCombination2 = true;
}

function examinePlywood() {
  if (visitedOffice === true) {
    showMessage("You look behind the plywood in the corner. Behind it there is a broken phone, scratches on the ground from something being dragged as if fighting, and the same symbol carved into the concrete as you saw in the office. This must be the place that Ronald sent the last message to James...maybe his last message ever...");
  } else {
    showMessage("As you peer behind the plywood you find a broken phone, obviously it is Ronald's, and an odd marking carved into the concrete. It's nothing you have seen before. This is where Ronald sent his last message...the drag marks indicate he didn't leave willingly.");
  }
  updateDisplay();
}

function basementBackToLobby() {
  gameState = "inside";
  showMessage("You return to the main hall in a hurry. The basement made you feel uneasy, every sound down there felt unnatural. The steps creaking when no one was on the stairs, the dripping water breaking any silence you had. The ring of your lifelong friend in your pocket...the burden weighs on your mind.");
  updateDisplay();
  updateButtons();
}

// ==================
// SAFE MECHANIC
// ==================
function attemptSafe() {
  if (foundCombination1 === true && foundCombination2 === true) {
    showMessage("The numbers fit together giving you the proper combination to the safe, as you put the combination in carefully, you hold your breath. You turn the handle and you hear the satisfying click of the latch opening.\n\nInside the safe you find three things. An old amulet, with the same marking you saw on the papers and in the basement, a key, and a piece of paper. On this piece of paper you see a list of names, and the name of the abandoned asylum on the edge of town, on the back of the list is one name written in blood red. 'Jack'");
    safeUnlocked = true;
    pickUpItem("Worn Key");
    pickUpItem("Patient List");
    pickUpItem("Mysterious Amulet");
  } else {
    showMessage("You try to open the safe. But it doesn't budge, you need to put the combination in first.");
  }
}

// ==================
// DISPLAY FUNCTIONS
// ==================
function updateDisplay() {
  document.getElementById("health-display").innerText = playerHealth;
  document.getElementById("sanity-display").innerText = sanity;
  document.getElementById("fear-display").innerText = fearLevel;
}

function showMessage(message) {
  document.getElementById("game-text").innerText = message;
}

function handleInvestigate() {
  if (gameState === "outside") {
    gameState = "inside";
    showMessage(describeLocation("inside"));
    updateButtons();
  } else if (gameState === "inside") {
    handleOffice();
  } else if (gameState === "office") {
    examineOffice();
  } else if (gameState === "bedroom") {
    searchDresser();
  } else if (gameState === "basement") {
    searchToolBench();
  }
}

function handleStatus() {
  if (gameState === "office") {
    examineDesk();
  } else if (gameState === "bedroom") {
    examineBed();
  } else if (gameState === "basement") {
    inspectWaterHeater();
  } else {
    let result = getGameStats();
    showMessage("Health: " + result.health + "\nSanity: " + result.sanity + "\nFear: " + result.fear + "\nStatus: " + result.status);
    updateDisplay();
    updateButtons();
  }
}

function handleLeave() {
  if (gameState === "office") {
    examineBayWindow();
  } else if (gameState === "bedroom") {
    examineLamp();
  } else if (gameState === "basement") {
    examinePlywood();
  } else {
    let result = escapeBuilding();
    showMessage(result);
    updateDisplay();
    updateButtons();
  }
}

function handleExtra() {
  if (gameState === "office") {
    backToLobby();
  } else if (gameState === "bedroom") {
    bedroomBackToLobby();
  } else if (gameState === "basement") {
    basementBackToLobby();
  }
}

// ==================
// UPDATE BUTTONS
// ==================
function updateButtons() {
  if (gameState === "outside") {
    document.getElementById("investigate").innerText = "Enter Building";
    document.getElementById("status").innerText = "Track Status";
    document.getElementById("leave").innerText = "I'm not ready";
    document.getElementById("extra").style.display = "none";
  } else if (gameState === "inside") {
    document.getElementById("investigate").innerText = "Office";
    document.getElementById("status").innerText = "Bedroom";
    document.getElementById("leave").innerText = "Basement";
    document.getElementById("extra").style.display = "none";
  } else if (gameState === "office") {
    document.getElementById("investigate").innerText = "Examine Papers";
    document.getElementById("status").innerText = "Check Desk";
    document.getElementById("leave").innerText = "Bay Window";
    document.getElementById("extra").innerText = "Back to Lobby";
    document.getElementById("extra").style.display = "block";
  } else if (gameState === "bedroom") {
    document.getElementById("investigate").innerText = "Dresser Drawers";
    document.getElementById("status").innerText = "Examine Bed";
    document.getElementById("leave").innerText = "Examine Lamp";
    document.getElementById("extra").innerText = "Back to Lobby";
    document.getElementById("extra").style.display = "block";
  } else if (gameState === "basement") {
    document.getElementById("investigate").innerText = "Check Tool Bench";
    document.getElementById("status").innerText = "Examine Water Heater";
    document.getElementById("leave").innerText = "Examine Plywood";
    document.getElementById("extra").innerText = "Back to Lobby";
    document.getElementById("e
