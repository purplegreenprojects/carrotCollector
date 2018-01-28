window.onload = function() {
	/* getDistance */
		function getDistance(a, b) {
			/* a */
				var aStyle   = window.getComputedStyle(a)
				var aWidth   = Number(aStyle.width.replace("px", ""))
				var aHeight  = Number(aStyle.height.replace("px", ""))

				var aBottom  = Number(aStyle.bottom.replace("px", ""))
				var aTop     = aBottom + aHeight
				var aLeft    = Number(aStyle.left.replace("px", ""))
				var aRight   = aLeft + aWidth

				var aCenterX = (aLeft + aRight) / 2
				var aCenterY = (aTop + aBottom) / 2

			/* b */
				var bStyle   = window.getComputedStyle(b)
				var bWidth   = Number(bStyle.width.replace("px", ""))
				var bHeight  = Number(bStyle.height.replace("px", ""))

				var bBottom  = Number(bStyle.bottom.replace("px", ""))
				var bTop     = bBottom + bHeight
				var bLeft    = Number(bStyle.left.replace("px", ""))
				var bRight   = bLeft + bWidth

				var bCenterX = (bLeft + bRight) / 2
				var bCenterY = (bTop + bBottom) / 2

			/* x and y */
				var x = bCenterX - aCenterX
				var y = bCenterY - aCenterY

			/* distance */
				var distance = Math.pow( (Math.pow(x, 2) + Math.pow(y, 2)) , 0.5)

			return distance
		}

	/* listeners */
		document.onmousedown = function(event){
			jump()
		}

		document.ontouchstart = function(event){
			jump()
		}

		document.onkeydown = function(event){
			if (event.which == 32) {
				jump()
			}
		}

		document.getElementById("start").onclick = function() {
			startGame()
		}

	/* jump */
		var jumping = false
		function jump() {
			if (!jumping && playing) {
				jumping = true
				
				var rabbit = document.getElementById("rabbit")
				rabbit.setAttribute("JUMP", true)
				
				var time = 0
				var jumpLoop = setInterval(function() {
					time = time + 10
					
					var bottom = Number(window.getComputedStyle(rabbit).bottom.replace("px", ""))
					var newY = (-0.0008 * Math.pow(time, 2)) + (0.8 * time) - 60
					rabbit.style.bottom = newY + "px"

					if (newY <= -60) {
						clearInterval(jumpLoop)
						jumping = false

						rabbit.removeAttribute("JUMP")
					}

				}, 10)
			}
		}

	/* startGame */
		var playing = false
		function startGame() {
			// reset stuff for new game
				document.getElementById("start").className = "hidden"
				document.getElementById("score").innerText = 0

				document.getElementById("foreground").innerHTML = "<div id='rabbit' position='legsIn'>\
					<div id='bunnyprofile'></div>\
					<div id='bunnyprofile_ear_front'></div>\
					<div id='bunnyprofile_ear_back'></div>\
					<div id='bunnyprofile_ear_line'></div>\
					<div id='bunnyprofile_backleg'></div>\
					<div id='bunnyprofile_backleg_line'></div>\
					<div id='bunnyprofile_frontleg'></div>\
				</div>"

				playing = true

				document.getElementById("foreground").style.opacity = 1

			// loops
				rabbitLoop = setInterval(function() {
					var rabbit = document.getElementById("rabbit")
					moveRabbit(rabbit)
				}, 150)

				countdownTimer = 0
				scrollLoop = setInterval(function() {
					// get rabbit
						var rabbit = document.getElementById("rabbit")
						var score = document.getElementById("score")

					// do stuff
						moveCarrots(rabbit)
						moveObstacles(rabbit)
						moveBackground()
						
						spawnCarrots()
						spawnObstacles()
						spawnBackground()

						maybeReset()

					// countdown
						if (countdownTimer == 0) {
							countdownTimer = 100
						}
						else {
							countdownTimer = countdownTimer - 1
						}
				}, 10)
		}

	/*moveRabbit */
		function moveRabbit(rabbit) {
			var position = rabbit.getAttribute("position")

			if (position == "legsOut") {
				rabbit.setAttribute("position", "legsIn")
			}
			
			else if (position == "legsIn") {
				rabbit.setAttribute("position", "legsOut")
			}

		}	

	/* moveCarrots */
		function moveCarrots(rabbit) {

			var rabbitStyle = window.getComputedStyle(rabbit)
			var rabbitWidth = Number(rabbitStyle.width.replace("px", "")) - 100

			var carrots = Array.from(document.getElementsByClassName("carrot"))

			carrots.forEach(function(carrot) {
				var carrotStyle = window.getComputedStyle(carrot)
				var carrotWidth = Number(carrotStyle.width.replace("px", ""))
				var carrotLeft  = Number(carrotStyle.left.replace("px", ""))
				var carrotRight = carrotLeft + carrotWidth

				if (carrotRight < 0) { // off the page
					carrot.parentNode.removeChild(carrot)
				}
				else if (getDistance(rabbit, carrot) < (rabbitWidth / 2) + (carrotWidth / 2) ) { // inside the rabbit
					carrot.parentNode.removeChild(carrot)
					var newScore = Number(score.innerText) + 1
					score.innerText = newScore
				}
				else { // all others
					var newLeft = carrotLeft - 7
					carrot.style.left = newLeft + "px"
				}
			})
		}

	/* moveObstacles */
		function moveObstacles(rabbit) {
			var rabbitStyle = window.getComputedStyle(rabbit)
			var rabbitWidth = Number(rabbitStyle.width.replace("px", "")) - 100

			var obstacles = Array.from(document.getElementsByClassName("obstacle"))

			obstacles.forEach(function(obstacle) {
				var obstacleStyle = window.getComputedStyle(obstacle)
				var obstacleWidth = Number(obstacleStyle.width.replace("px", ""))
				var obstacleLeft  = Number(obstacleStyle.left.replace("px", ""))
				var obstacleRight = obstacleLeft + obstacleWidth

				if (obstacleRight < 0) { // off the page
					obstacle.parentNode.removeChild(obstacle)
				}
				else if (getDistance(rabbit, obstacle) < (rabbitWidth / 2) + (obstacleWidth / 2) ) { // inside the rabbit
					endGame()
				}
				else { // all others
					var newLeft = obstacleLeft - 7
					obstacle.style.left = newLeft + "px"
				}
			})
		}

	/* spawnCarrots */
		function spawnCarrots() {
			if (countdownTimer == 0) {
				var randomCarrot = Math.floor(Math.random() * 300)
				
				var newCarrot = document.createElement("div")
					newCarrot.className = "carrot"
					newCarrot.style.bottom = randomCarrot + "px"
					newCarrot.style.left = window.innerWidth + "px"

					var carrotBody = document.createElement("div")
					carrotBody.className = "body"
					newCarrot.appendChild(carrotBody)

					var n = 1
					while (n <= 4) {
						var carrotLeaf = document.createElement("div")
						carrotLeaf.className = "leaf" + n
						newCarrot.appendChild(carrotLeaf)
						n++
					}

					var n = 1
					while (n <= 6) {
						var carrotLine = document.createElement("div")
						carrotLine.className = "line" + n
						newCarrot.appendChild(carrotLine)
						n++
					}

					
				
				document.getElementById("foreground").appendChild(newCarrot)
			}
		}

	/* spawnObstacles */
		function spawnObstacles() {
			if (countdownTimer == 50) {
				var score = Number(document.getElementById("score").innerText)
				
				if (score < 15) {
					var probability = 5
				}
				else if (score < 30) {
					var probability = 4
				}
				else if (score < 45) {
					var probability = 3
				}
				else if (score < 60) {
					var probability = 2
				}
				else {
					var probability = 1
				}

				if ( !Math.floor(Math.random() * probability) ) {					
					var newObstacle = document.createElement("div")
					newObstacle.className = "obstacle"
					newObstacle.style.left = window.innerWidth + "px"

					spawnFlower(newObstacle, "tulip1")
					spawnFlower(newObstacle, "tulip2")
					spawnFlower(newObstacle, "daisy1")
					spawnFlower(newObstacle, "daisy2")
					spawnFlower(newObstacle, "dandelion1")
					spawnFlower(newObstacle, "dandelion2")
					spawnFlower(newObstacle, "dandelion3")
					
					document.getElementById("foreground").appendChild(newObstacle)
				}
			}
		}

	/* spawnFlower */
		function spawnFlower(parentDiv, type) {
			var petals = document.createElement("div")
			petals.className = "flower_petals_" + type
			parentDiv.appendChild(petals)

			var stem = document.createElement("div")
			stem.className = "flower_stem_" + type
			parentDiv.appendChild(stem)
			
			if (type == "daisy1" || type == "daisy2") {
				var center = document.createElement("div")
				center.className = "flower_center_" + type
				parentDiv.appendChild(center)
			}
		}

	/* spawnBackground */
		function spawnBackground() {
			spawnClouds()
			// spawnTrees()
		}

	/* spawnClouds */
		function spawnClouds() {
			if (!Math.floor(Math.random() * 7) && (countdownTimer == 20 || countdownTimer == 40 || countdownTimer == 60)) {
				var randomCloud = Math.floor(Math.random() * 150)
				
				var newCloud = document.createElement("div")
					newCloud.className = "cloud"
					newCloud.style.top = randomCloud + "px"
					newCloud.style.left = window.innerWidth + "px"
				
				document.getElementById("background").appendChild(newCloud)
			}
		}

	/* moveBackground */
		function moveBackground() {
			moveClouds()
			// moveTrees()
		}

	/* moveClouds */
		function moveClouds() {
			var clouds = Array.from(document.getElementsByClassName("cloud"))

			clouds.forEach(function(cloud) {
				var cloudStyle = window.getComputedStyle(cloud)
				var cloudWidth = Number(cloudStyle.width.replace("px", ""))
				var cloudLeft  = Number(cloudStyle.left.replace("px", ""))
				var cloudRight = cloudLeft + cloudWidth

				if (cloudRight < 0) { // off the page
					cloud.parentNode.removeChild(cloud)
				}
				else { // all others
					var newLeft = cloudLeft - 0.5
					cloud.style.left = newLeft + "px"
				}
			})
		}

	/* maybeReset */
		function maybeReset() {
			if (countdownTimer == 33 || countdownTimer == 67) {
				var score = Number(document.getElementById("score").innerText)

				if ((score > 15) && !Math.floor(Math.random() * 2)) {
					console.log("reset")
					countdownTimer = 0
				}
			}
		}

	/* endGame */
		function endGame() {
			playing = false
			clearInterval(scrollLoop)
			clearInterval(rabbitLoop)

			var foreground = document.getElementById("foreground")
			
			var fadeLoop = setInterval(function () {
				var foregroundStyle = window.getComputedStyle(foreground)
				var foregroundOpacity = Number(foregroundStyle.opacity)

				if (foregroundOpacity > 0) {
					foreground.style.opacity = foregroundOpacity - 0.05
				}
				else {
					clearInterval(fadeLoop)
					document.getElementById("restart").className = ""
				}
			}, 100)
		}
	
}
