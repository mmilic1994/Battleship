const view = {
    displayMessage: function (message) {
        let displayMessageNode = document.getElementById("messageArea");
        displayMessageNode.innerHTML = message;
    },
    displayHit: function (location) {
        let cell = document.getElementById(location);
        let missile = new Audio("missile.mp3");
        missile.play();
        window.setTimeout(function () {
            cell.classList.add("hit");
        }, 1000);
    },
    displayMiss: function (location) {
        let cell = document.getElementById(location);
        let missile = new Audio("missile.mp3");
        missile.play();
        window.setTimeout(function () {
            cell.classList.add("miss");
        }, 1000);
    },
    displayMissilesFired: function () {
        let missileScore = document.getElementById("missileScore");
        missileScore.innerHTML = controller.missilesUsed;
    }
}

const model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,

    ships: [{
            locations: ["00", "00", "00"],
            hits: ["", "", ""]
        },
        {
            locations: ["00", "00", "00"],
            hits: ["", "", ""]
        },
        {
            locations: ["00", "00", "00"],
            hits: ["", "", ""]
        }
    ],
    fire: function (guess) {
        for (let i = 0; i < this.numShips; i++) {
            let ship = this.ships[i];
            let index = ship.locations.indexOf(guess);
            if (index >= 0) {
                ship.hits[index] = "hit";
                view.displayHit(guess);
                view.displayMessage("HIT!")
                this.missilesUsed++;
                view.displayMissilesFired();
                if (this.isSunk(ship)) {
                    view.displayMessage("You sank my battleship!");
                    this.shipsSunk++;
                }
                return true;
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed.")
        view.displayMissilesFired();
        return false;
    },
    isSunk: function (ship) {
        for (let i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                this.missilesUsed++;
                return false;
            }
        }
        return true;
    },
    generateShip: function() {
            let firstShip = [];
            let boardSize = 7;
            let randomHorizontalOrVartical = ["horizontal", "vertical"][Math.floor(Math.random() * 2)];
            if(randomHorizontalOrVartical === "horizontal") {
                let randomRowLocation = Math.floor(Math.random() * (boardSize));
                let randomColumnLocation= Math.floor(Math.random() * (boardSize -2));
                let randomFirstLocation = String(randomRowLocation) + String(randomColumnLocation);
                let randomSecondLocation =  String(randomRowLocation) + String(randomColumnLocation + 1);
                let randomThirdLocation =  String(randomRowLocation) + String(randomColumnLocation + 2);
                firstShip.push(randomFirstLocation, randomSecondLocation, randomThirdLocation);
            } else if(randomHorizontalOrVartical === "vertical") {
                let randomRowLocation = Math.floor(Math.random() * (boardSize -2));
                let randomColumnLocation= Math.floor(Math.random() * (boardSize));
                let randomFirstLocation = String(randomRowLocation) + String(randomColumnLocation);
                let randomSecondLocation =  String(randomRowLocation + 1) + String(randomColumnLocation);
                let randomThirdLocation =  String(randomRowLocation + 2) + String(randomColumnLocation);
                firstShip.push(randomFirstLocation, randomSecondLocation, randomThirdLocation);
            } 
            return firstShip;
    },
    collision: function(locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];
            for (var j = 0; j < locations.length; j++) {
            if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
            } 
            }
        }
            return false;
     },
    generateShipLocations: function() {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
        do {
            locations = this.generateShip(); 
        }  while (this.collision(locations)); this.ships[i].locations = locations;
        } 
    },
}

const controller = {
    missilesUsed: 0,
    processGuess: function (guess) {
        this.missilesUsed++;
        let hit = model.fire(guess);
        if (hit && model.shipsSunk === model.numShips) {
            view.displayMessage(`You sank all the battleships, in ${this.missilesUsed} guesses`)
        }
    }
}

function init() {
    let table = document.querySelector("table");
    table.addEventListener("click", function (e) {
        if (e.target.classList !== "coordinate") {
            controller.processGuess(e.target.id);
        }
    });
    model.generateShipLocations();
    view.displayMissilesFired();
    view.displayMessage("Welcome to battleship!")
}

window.onload = init();

    