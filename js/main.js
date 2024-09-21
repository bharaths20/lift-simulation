function generate() {
  const simulation = document.getElementById("simulation");
  const liftsValue = parseInt(document.getElementById("liftsInput").value);
  const floorsValue = parseInt(document.getElementById("floorsInput").value);

  if (!liftsValue || !floorsValue) {
    alert("Please enter the number of lifts and floors required");
    return;
  } else if (liftsValue <= 0 || floorsValue <= 0) {
    alert("Please enter positive values for lifts and floors");
    return;
  } else if (floorsValue == 1 && liftsValue > 1) {
    alert(
      "Number of lifts cannot be greater than one if there is only one floor"
    );
    return;
  }

  simulation.innerHTML = "";
  simulation.style.position = "relative";
  const liftWidth = 80;
  const liftHeight = 120;
  const floorHeight = 156;
  const spacing = 60;

  const liftBusy = Array(liftsValue).fill(false);
  const queue = [];

  for (let i = floorsValue; i >= 1; i--) {
    const floor = document.createElement("div");
    floor.className = "floor";
    floor.id = "floor" + i;
    floor.style.height = `${floorHeight}px`;
    floor.style.width = "100%";
    floor.style.position = "relative";
    floor.style.borderBottom = "2px solid #333";

    const btns = document.createElement("div");
    btns.className = "btns";
    btns.style.position = "absolute";
    btns.style.right = "20px";
    btns.style.top = "50%";
    btns.style.transform = "translateY(-50%)";

    const up = document.createElement("button");
    up.className = "up";
    up.id = "up" + i;
    up.addEventListener("click", () => addToQueue(i, "up", up));

    const down = document.createElement("button");
    down.className = "down";
    down.id = "down" + i;
    down.addEventListener("click", () => addToQueue(i, "down", down));

    const floorLabel = document.createElement("div");
    floorLabel.className = "floor-label";
    floorLabel.textContent = `Floor ${i}`;
    floorLabel.style.position = "absolute";
    floorLabel.style.left = "20px";
    floorLabel.style.top = "50%";
    floorLabel.style.transform = "translateY(-50%)";

    btns.appendChild(up);
    btns.appendChild(down);
    floor.appendChild(btns);
    floor.appendChild(floorLabel);
    simulation.appendChild(floor);
  }

  document.getElementById("up" + floorsValue).disabled = true;
  document.getElementById("down1").disabled = true;

  const totalHeight = floorsValue * (floorHeight + 2);

  for (let i = 1; i <= liftsValue; i++) {
    const lift = document.createElement("div");
    lift.className = "lift";
    lift.id = "lift" + i;

    const door = document.createElement("div");
    door.className = "door";
    door.id = "door" + i;

    const liftImage = document.createElement("img");
    liftImage.className = "lift-image";
    liftImage.src = "assets/liftinside.webp";
    liftImage.alt = "Lift Interior";

    lift.appendChild(liftImage);
    lift.appendChild(door);
    simulation.appendChild(lift);

    lift.style.width = `${liftWidth}px`;
    lift.style.height = `${liftHeight}px`;
    lift.style.position = "absolute";
    lift.style.bottom = "17px";
    lift.style.left = `${(i - 1) * (liftWidth + spacing) + 2 * spacing}px`;
  }

  simulation.style.height = `${totalHeight}px`;

  function addToQueue(targetFloor, direction, button) {
    queue.push({ targetFloor, direction, button });
    button.disabled = true;
    processQueue();
  }

  function processQueue() {
    const lifts = Array.from({ length: liftsValue }, (_, i) =>
      document.getElementById(`lift${i + 1}`)
    );

    for (let i = 0; i < lifts.length; i++) {
      if (!liftBusy[i] && queue.length > 0) {
        const request = queue.shift();
        moveLiftToFloor(
          request.targetFloor,
          request.direction,
          request.button,
          lifts[i]
        );
      }
    }
  }

  function moveLiftToFloor(targetFloor, direction, button, lift) {
    const liftIndex = parseInt(lift.id.replace("lift", "")) - 1;
    const currentFloor =
      Math.round(parseInt(lift.style.bottom) / floorHeight) + 1;
    const targetPosition = (targetFloor - 1) * (floorHeight + 2) + 17;
    const floorsToMove = Math.abs(targetFloor - currentFloor);
    const duration = floorsToMove * 2;

    liftBusy[liftIndex] = true;
    lift.style.transition = `bottom ${duration}s linear`;
    lift.style.bottom = `${targetPosition}px`;

    setTimeout(() => {
      openDoor(lift, button);
    }, duration * 1000);
  }

  function openDoor(lift, button) {
    const door = lift.querySelector(".door");
    door.style.width = "0%";
    setTimeout(() => closeDoor(lift, button), 2500);
  }

  function closeDoor(lift, button) {
    const door = lift.querySelector(".door");
    door.style.width = "100%";
    door.addEventListener("transitionend", function onTransitionEnd() {
      door.removeEventListener("transitionend", onTransitionEnd);
      const liftIndex = parseInt(lift.id.replace("lift", "")) - 1;
      liftBusy[liftIndex] = false;
      if (button) button.disabled = false;
      processQueue();
    });
  }
}
