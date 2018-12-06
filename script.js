window.onload = function() {

	/*** music ***/
		var clicked = false
		document.addEventListener("click", function() {
			if (!clicked) {
				clicked = true
				document.getElementsByTagName("audio")[0].play()
			}
		})
	
	/*** onload ***/
		if (location.search.length > 1) {
			var playing = false
			var jumping = false
			startGame()
		}
		
		else {
			makeButtons()
		}

	/*** menu screen ***/
		/* bunny options */
			function makeButtons() {
				var options = [
					{
						name: "shadowBunny",
						image: "shadowbunny.png",
						search: "?start=true"
					},
					{
						name: "Evelyn",
						image: "https://img0.etsystatic.com/197/3/11013998/il_570xN.1445707712_j61z.jpg",
						search: "?start=true&item=bunny&yarn=Lion%20Brand%20Homespun&mc=Barley&cc=Rococo&cc_areas=bunnyprofile_chin,bunnyface_chin,bunnyprofile_stomach&accent_color=Rococo"
					},
					{
						name: "Penelope",
						image: "https://img.etsystatic.com/il/120250/1445688716/il_570xN.1445688716_kxe0.jpg?version=1",
						search: "?start=true&item=bunny&yarn=Bernat%20Pipsqueak&mc=Chocolate&cc=Chocolate&accent_color=none"
					},
					{
						name: "Pedro",
						image: "https://img.etsystatic.com/il/784dbf/1448934102/il_570xN.1448934102_rq6o.jpg?version=0",
						search: "?start=true&item=bunny&yarn=Premier%20Parfait&mc=Toffee&cc=White&cc_areas=bunnyprofile_tail_half,bunnyprofile_chin,bunnyprofile_stomach&accent_color=Toffee"
					},
					{
						name: "Rosie",
						image: "https://img.etsystatic.com/il/3fad2c/1443985874/il_570xN.1443985874_rr4y.jpg?version=0",
						search: "?start=true&item=bunny&yarn=Bernat%20Pipsqueak&mc=Baby%20Pink&cc=White&cc_areas=bunnyprofile_chin,bunnyprofile_stomach&accent_color=Baby%20Pink"
					}
				]

				for (var i in options) {
					document.getElementById("options").innerHTML += "<a href='" + options[i].search + "' id='" + options[i].name + "' style='background-image:url(" + options[i].image + ")'><label>" + options[i].name + "</label></a>"
				}
			}

	/*** gameplay screen ***/
		/* startGame */
			function startGame() {
				// reset stuff for new game
					document.getElementById("options").className = "hidden"
					document.getElementById("scoreNumber").innerText = 0

					createBunny()

					playing = true

					document.getElementById("foreground").style.opacity = 1

				// loops
					rabbitLoop = setInterval(function() {
						var rabbit = document.getElementById("rabbit")
						moveRabbit(rabbit)
					}, 150)

					countdownTimer = 0
					cooldownTimer = 0
					scrollLoop = setInterval(function() {
						// get rabbit
							var rabbit = document.getElementById("rabbit")
							var score = document.getElementById("scoreNumber")

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
							
						// cooldownTimer for obstacles
							if (cooldownTimer == 0) {
								cooldownTimer = 0
							}
							else {
								cooldownTimer = cooldownTimer - 1
							}
					}, 10)
			}

		/* createBunny */
			function createBunny() {
				var url = location.search
				
				if (url && url.length > 22) {
					url = url.replace("?", "")
					url = url.split("&")

					var get = {}
					for (var i = 0; i < url.length; i++) {
						var pair = url[i].split("=")

						var key = pair[0]
						var value = pair[1].replace(/\%20/g, " ")

						if (key == "cc_areas") {
							value = value.split(",")
						}

						get[key] = value
					}

					//step 0: get urls for mc and cc
						var mainColor = stash[ get.yarn ][ get.mc ]
						var contrastingColor = stash[ get.yarn ][ get.cc ]
		
						if (!get.accent_color) {
							var accentColor = stash[ get.yarn ][ get.mc ]
						}
						else if (get.accent_color == "none") {
							var accentColor = stash[ get.yarn ][ get.mc ]
						}
						else {
							var accentColor = stash[ get.yarn ][ get.accent_color]
						}
						var rabbit = "<div id='rabbit' position='legsIn'>"

					//step 1: color the main animal
						rabbit = rabbit + "<div id='bunnyprofile' style='background-image: url(" + mainColor + ")'></div>\
						<div id='bunnyprofile_ear_front' style='background-image: url(" + mainColor + ")'></div>\
						<div id='bunnyprofile_ear_back' style='background-image: url(" + mainColor + ")'></div>\
						<div id='bunnyprofile_ear_line'></div>\
						<div id='bunnyprofile_backleg' style='background-image: url(" + mainColor + ")'></div>\
						<div id='bunnyprofile_backleg_line'></div>\
						<div id='bunnyprofile_frontleg' style='background-image: url(" + mainColor + ")'></div>\
						<div id='bunnyprofile_nose'></div>\
						<div id='bunnyprofile_eye'></div>\
						<div id='bunnyprofile_eye_lightspot'></div>"

					//step 2: color the selected cc areas
						if (location.search.indexOf("cc_areas") > -1) {
							get.cc_areas.forEach(function(area) {
								if(area.indexOf("bunnyprofile") > -1) {
									rabbit = rabbit + "<div id='" + area + "' style='background-image: url(" + contrastingColor + ")'></div>"
								}
							})
						}
					

					//step 3: color the inner ear
						rabbit = rabbit + "<div id='bunnyprofile_ear_inner' style='background-image: url(" + accentColor + ")'></div>"
						
					rabbit = rabbit + "</div>"
					document.getElementById("foreground").innerHTML = rabbit
				}
				else {
					document.getElementById("foreground").innerHTML = "\
					<div id='rabbit' position='legsIn'>\
						<div id='bunnyprofile'></div>\
						<div id='bunnyprofile_ear_front'></div>\
						<div id='bunnyprofile_ear_back'></div>\
						<div id='bunnyprofile_ear_line'></div>\
						<div id='bunnyprofile_backleg'></div>\
						<div id='bunnyprofile_backleg_line'></div>\
						<div id='bunnyprofile_frontleg'></div>\
						<div id='bunnyprofile_nose'></div>\
						<div id='bunnyprofile_eye'></div>\
						<div id='bunnyprofile_eye_lightspot'></div>\
					</div>"
				}
			}
	
	/*** spawn ***/
		/* spawnCarrots */
			function spawnCarrots() {
				if (countdownTimer == 0) {
					var randomCarrot = Math.floor(Math.random() * 300)
					
					var newCarrot = document.createElement("div")
						newCarrot.className = "carrot"
						newCarrot.style.bottom = randomCarrot + "px"
						newCarrot.style.left = window.innerWidth + "px"

						// var carrotBody = document.createElement("div")
						// carrotBody.className = "body"
						// newCarrot.appendChild(carrotBody)

						// var n = 1
						// while (n <= 4) {
						// 	var carrotLeaf = document.createElement("div")
						// 	carrotLeaf.className = "leaf" + n
						// 	newCarrot.appendChild(carrotLeaf)
						// 	n++
						// }

						// var n = 1
						// while (n <= 6) {
						// 	var carrotLine = document.createElement("div")
						// 	carrotLine.className = "line" + n
						// 	newCarrot.appendChild(carrotLine)
						// 	n++
						// }

						
					
					document.getElementById("foreground").appendChild(newCarrot)
				}
			}

		/* spawnObstacles */
			function spawnObstacles() {
				if (countdownTimer == 50 && cooldownTimer == 0) {
					var score = Number(document.getElementById("scoreNumber").innerText)
					
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
						cooldownTimer = 50					
						var newObstacle = document.createElement("div")
						newObstacle.className = "obstacle"
						newObstacle.style.left = window.innerWidth + "px"

						newObstacle.innerHTML = spawnWC()
						
						document.getElementById("foreground").appendChild(newObstacle)
					}
				}
			}			
		/* spawnWC */
			function spawnWC() {
				return "\
				<div class='wc_main'></div>\
				<div class='wc_top'></div>\
				<div class='wc_inside'></div>\
				<div class='wc_spout'></div>\
				<div class='wc_spoutCircle'></div>\
				<div class='wc_tophandle'></div>\
				<div class='wc_sidehandle'></div>"
			}

		/* spawnFlowerBed */
			function spawnFlowerBed() {
				
				if (!Math.floor(Math.random() * 15) && (countdownTimer == 20 || countdownTimer == 60)) {
					
					var flowerBed = document.createElement("div")
						
					var f = Math.floor(Math.random() * 4)

					var flowers = ["besusans", "daisies", "dandelion", "tulips"]

					flowerBed.className = "flowerBed " + flowers[f]

					flowerBed.style.left = window.innerWidth + "px"

					document.getElementById("background").appendChild(flowerBed)
				}
			}

		/* spawnFlower */
			// function spawnFlower(parentDiv, type) {
			// 	var petals = document.createElement("div")
			// 	petals.className = "flower_petals_" + type
			// 	parentDiv.appendChild(petals)

			// 	var stem = document.createElement("div")
			// 	stem.className = "flower_stem_" + type
			// 	parentDiv.appendChild(stem)
				
			// 	var grass = document.createElement("div")
			// 	grass.className = "flower_grass_" + type
			// 	parentDiv.appendChild(grass)	

			// 	// if (type == "daisy1" || type == "daisy2") {
			// 	// 	var center = document.createElement("div")
			// 	// 	center.className = "flower_center_" + type
			// 	// 	parentDiv.appendChild(center)
			// 	// }
			// 	if (type == "daisy2") {
			// 		var center = document.createElement("div")
			// 		center.className = "flower_center_" + type
			// 		parentDiv.appendChild(center)
			// 	}
			// 	else if (type == "daisy1") {
			// 		var center = document.createElement("div")
			// 		center.className = "flower_center_" + type
			// 		parentDiv.appendChild(center)
			// 	}
			// }

		/* spawnBackground */
			function spawnBackground() {
				spawnClouds()
				spawnFlowerBed()
			}

		/* spawnClouds */
			function spawnClouds() {
				if (!Math.floor(Math.random() * 12) && (countdownTimer == 20 || countdownTimer == 40 || countdownTimer == 60)) {
					var randomCloud = Math.floor(Math.random() * 150)
					
					var newCloud = document.createElement("div")
						newCloud.className = "cloud"
						newCloud.style.top = randomCloud + "px"
						newCloud.style.left = window.innerWidth + "px"
					
					document.getElementById("background").appendChild(newCloud)
				}
			}

	/*** move ***/
		/* moveRabbit */
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
				var score = document.getElementById("scoreNumber")

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

		/* moveBackground */
			function moveBackground() {
				moveClouds()
				moveFlowerBed()
				moveGrass("grass1")
				moveGrass("grass2")
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
						var newLeft = cloudLeft - 1
						cloud.style.left = newLeft + "px"
					}
				})
			}

		/* moveFlowerBed */
			function moveFlowerBed() {
				
				var flowerBeds = Array.from(document.getElementsByClassName("flowerBed"))

				flowerBeds.forEach(function(flowerBed) {
					var flowerBedStyle = window.getComputedStyle(flowerBed)
					var flowerBedWidth = Number(flowerBedStyle.width.replace("px", ""))
					var flowerBedLeft  = Number(flowerBedStyle.left.replace("px", ""))
					var flowerBedRight = flowerBedLeft + flowerBedWidth

					if (flowerBedRight < 0) { // off the page
						flowerBed.parentNode.removeChild(flowerBed)
					}
					else { // all others
						var newLeft = flowerBedLeft - 2
						flowerBed.style.left = newLeft + "px"
					}
				})
			}

		/* moveGrass */
			function moveGrass(grassID) {
				var grass = document.getElementById(grassID)
				var grassStyle = window.getComputedStyle(grass)
				var grassLeft = Number(grassStyle.left.replace("px", ""))

				if (grassLeft <= -1 * window.innerWidth) {
					grass.style.left = window.innerWidth - 2 + "px"
				}

				else {
					grassLeft = grassLeft - 2
					grass.style.left = grassLeft + "px"
				}
			}

		/* maybeReset */
			function maybeReset() {
				if (countdownTimer == 33 || countdownTimer == 67) {
					var score = Number(document.getElementById("scoreNumber").innerText)

					if ((score > 15) && !Math.floor(Math.random() * 2)) {
						console.log("reset")
						countdownTimer = 0
					}
				}
			}

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

	/*** player interaction ***/
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
		
		/* jump */
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

	/*** gameover screen ***/
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
						document.getElementById("endGame").className = ""
						document.getElementById("endGame_options").className = ""
					}
				}, 100)
			}

}



/* to do */
		// then put flowers back (in front of grass)

	// other obstacle(s)
	// music
