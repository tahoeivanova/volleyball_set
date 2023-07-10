document.addEventListener("DOMContentLoaded", function(){



	const canvas = document.getElementById("canvas1");
	const ctx = canvas.getContext("2d");

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	window.addEventListener("resize", function() {
		canvas.width = window.innerWidth
		canvas.height = window.innerHeight
		})

	// const doc = document.documentElement;
	// if (window.innerWidth >= 768) {
	
	// 	// canvas.width = 500;
	// 	// canvas.height = 1000;
	// 	canvas.width = window.innerWidth;
	// 	canvas.height = window.innerHeight;
	// } else {


 //    	// canvas.width = document.body.clientWidth; //document.width is obsolete
 //    	// canvas.height = document.body.clientHeight; //document.height is obsolete		
	// 	canvas.width = window.innerWidth;
	// 	canvas.height = window.innerHeight;
	// 	}

	var playingCourtScale = 0.85;
	let current_zone_index = -1;
	let playerScale = 0.4;
	is_dragging = false;
	let startX;
	let startY;
	let players = [];
	let zoneArrayProtocol = [];
	let rotateProcess = false;
	let rotatingStatus = [];
	let rotationPosition = 1;
	let rotationSymbols = [];
	let animationIcon = false;
	let shakeStart;
	let shakeEnd;




	function rotatePlayers() {
		rotateProcess = true;
		// court.rotate();


	}

	function animateIcon() {
		animationIcon = true;
		shakeStart = window.performance.now();
	}

	function toggleFullScreen(){
		console.log(document.fullscreenElement);
		if (!document.fullscreenElement) {
			  if (canvas.requestFullscreen) {
			    canvas.requestFullscreen().catch(err => {
			alert(`Error, can't enable full-screen mode: ${err.message}`);
			});
			  } 
			  else if (canvas.webkitRequestFullscreen) { /* Safari */
			    canvas.webkitRequestFullscreen().catch(err => {
			alert(`Error, can't enable full-screen mode: ${err.message}`);
			});
			  } else if (canvas.msRequestFullscreen) { /* IE11 */
			    canvas.msRequestFullscreen().catch(err => {
			alert(`Error, can't enable full-screen mode: ${err.message}`);
			});
			  }

			// canvas.requestFullscreen().catch(err => {
			// 	alert(`Error, can't enable full-screen mode: ${err.message}`);
			// });
		} else {
			  if(document.exitFullscreen) {
				    document.exitFullscreen();
				  } else if(document.mozCancelFullScreen) {
				    document.mozCancelFullScreen();
				  } else if(document.webkitExitFullscreen) {
				    document.webkitExitFullscreen();
				  }
		}
	}

	function drawRotationPosition() {

		for (let i = 0; i < rotationPosition; i++) {
			if (i<3){
				ctx.beginPath();
				ctx.arc((rotationSymbolCoords.x - 1 + rotationSymbolCoords.radius*5*i), rotationSymbolCoords.y - 1, rotationSymbolCoords.radius, 0, 2 * Math.PI, false);
				ctx.fillStyle = '#808080';
				ctx.fill();
				ctx.lineWidth = 1;
				ctx.strokeStyle = '#808080';
				ctx.stroke();

				ctx.beginPath();
				ctx.arc((rotationSymbolCoords.x + rotationSymbolCoords.radius*5*i), rotationSymbolCoords.y, rotationSymbolCoords.radius, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'white';
				ctx.fill();
				ctx.lineWidth = 1;
				ctx.strokeStyle = 'white';
				ctx.stroke();
		}
			if (i>=3){
				ctx.beginPath();
				ctx.arc((rotationSymbolCoords.x - 1 + rotationSymbolCoords.radius*5*i), rotationSymbolCoords.y - 1, rotationSymbolCoords.radius, 0, 2 * Math.PI, false);
				ctx.fillStyle = '#808080';
				ctx.fill();
				ctx.lineWidth = 1;
				ctx.strokeStyle = '#808080';
				ctx.stroke();

				ctx.beginPath();
				ctx.arc((rotationSymbolCoords.x + rotationSymbolCoords.radius*5*i), rotationSymbolCoords.y, rotationSymbolCoords.radius, 0, 2 * Math.PI, false);
				ctx.fillStyle = 'white';
				ctx.fill();
				ctx.lineWidth = 1;
				ctx.strokeStyle = '#bfbfbf';
				ctx.stroke();			
			}


		}
		// ctx.strokeStyle = '#808080';
	 //    ctx.strokeRect(rotationButtonCoords.x, rotationButtonCoords.y, rotationButtonCoords.width, rotationButtonCoords.height);
	 //    if (!animationIcon)
	 //    {
	 //    	rotation_icon.draw()
	 //    	ctx.drawImage(rotation_image, 0,0, 50, 50, rotationButtonCoords.x, rotationButtonCoords.y, rotationButtonCoords.width, rotationButtonCoords.height);
		// }
		// ctx.textAlign = 'center';
		// ctx.textBaseline = 'middle';
		// ctx.fillStyle = 'black';
		// ctx.font = '18pt Times';
		// ctx.fillText(rotationPosition, rotationButtonCoords.x + rotationButtonCoords.width/2, rotationButtonCoords.y + rotationButtonCoords.height/2);
		// ctx.fillStyle = 'white';
		// ctx.fillText(rotationPosition, rotationButtonCoords.x + rotationButtonCoords.width/2 + 2, rotationButtonCoords.y + rotationButtonCoords.height/2+ 2);

	}



	let mouse_in_button = function(x, y, coords) {
		if (x >= coords.x && x <= (coords.x + coords.width) && y >= coords.y && y <= (coords.y + coords.height))
			{return true}
		return false
	}
	let is_mouse_in_shape = function(x, y, shape) {
		let centerX = shape.centerX;
		let centerY = shape.centerY;
		let radius = shape.radius;


		const dx = centerX - x;
		const dy = centerY - y;
		const distance = Math.sqrt(dx*dx+dy*dy);

		if (distance < radius) {
			return true;
		}
		return false;
	}




	class Out {
		constructor(width, height) {
			this.x = 0;
			this.y = 0;
			this.width = width;
			this.height = height;

		}	
		draw() {
	    	ctx.fillStyle = '#1a53ff';
	    	ctx.fillRect(0, 0, this.width, this.height);
	}}

	class playingCourt {
		constructor(width, height, outWidthScale) {
			this.width = width;
			this.height = height;
			if(window.innerWidth < 768) {
				this.courtWidth =  this.width * outWidthScale;
				this.x = this.outWidth = (this.width - this.courtWidth)/2;

				this.courtHeight = this.courtWidth*2;
				this.y = this.outHeight = (this.height - this.courtHeight)/2;

			}
			else
			{
				this.courtHeight = this.height * outWidthScale;
				this.y = this.outHeight = (this.height - this.courtHeight)/2;	

				this.courtWidth =  this.courtHeight/2;
				this.x = this.outWidth = (this.width - this.courtWidth)/2;


			}


			this.side1 = {x:this.x, y:this.y, width: this.courtHeight/2, height: this.courtHeight/2};
			this.side2 = {x:this.x, y:this.y + this.courtHeight/2, width: this.courtWidth, height: this.courtHeight/2};

			this.zoneArray = [
					{zone: 1, side: 1, x:this.x, y:this.y, width: this.courtWidth/3, height: this.courtHeight/4, color: "#ff3377", playerColor: "#00ff80", playerLetter: "С"},
					{zone: 6, side: 1, x:this.x + this.courtWidth/3, y:this.y, width: this.courtHeight/6, height: this.courtHeight/4, color: "#ff4d88", playerColor: "#0088cc", playerLetter: "Ц"},
					{zone: 5, side: 1, x:this.x + (this.courtWidth/3)*2, y:this.y, width: this.courtHeight/6, height: this.courtHeight/4, color: "#ff6699", playerColor: "#ff0000", playerLetter: "А"},//#ff1a1a #ff4d4d
					{zone: 4, side: 1, x:this.x + (this.courtWidth/3)*2, y:this.y + this.courtHeight/4, width: this.courtWidth/3, height: this.courtHeight/4, color: "#ff6699", playerColor: "#ff6633", playerLetter: "Д"},
					{zone: 3, side: 1, x:this.x + this.courtWidth/3, y:this.y  + this.courtHeight/4, width: this.courtWidth/3, height: this.courtHeight/4, color: "#ff99bb", playerColor: "#4dc3ff", playerLetter: "Ц"},
					{zone: 2, side: 1, x:this.x, y:this.y  + this.courtHeight/4, width: this.courtWidth/3, height: this.courtHeight/4, color: "#ffb3cc", playerColor: "#ff1a1a", playerLetter: "А"}//#cc0000
			];


		}
		init() {
		    for (let i = 0; i < this.zoneArray.length; i++){
			
				let centerX = this.zoneArray[i].x + this.zoneArray[i].width/2;
				let centerY = this.zoneArray[i].y + this.zoneArray[i].height/2;
				let radius = this.zoneArray[i].width* playerScale /2;
				this.zoneArray[i].centerX = centerX;
				this.zoneArray[i].centerY = centerY;
				this.zoneArray[i].radius = radius;

	    	}
	    	zoneArrayProtocol = JSON.parse(JSON.stringify(this.zoneArray));;

		}
		draw() {
		

	    	ctx.fillStyle = '#ffa64d';
	    	ctx.fillRect(this.x, this.y, this.courtWidth, this.courtHeight);

	    	//sides
	    	ctx.fillStyle = "#99ff99";
	    	ctx.fillRect(this.side1.x, this.side1.y, this.side1.width, this.side1.height);

	    	ctx.fillStyle = "#ffff80";
	    	ctx.fillRect(this.side2.x, this.side2.y, this.side2.width, this.side2.height);

	    	//<<<<<players
	    	for (let i = 0; i < this.zoneArray.length; i++){
	    		ctx.fillStyle = this.zoneArray[i].color;
	    		ctx.fillRect(this.zoneArray[i].x, this.zoneArray[i].y, this.zoneArray[i].width, this.zoneArray[i].height);
	    	}

	    	// attack lines
	   		ctx.strokeStyle = 'white';
	    	ctx.lineWidth = 3;    	
	    	ctx.beginPath();
	    	ctx.moveTo(this.outWidth, this.courtHeight/6*2 + this.outHeight);
	    	ctx.lineTo(this.courtWidth + this.outWidth, this.courtHeight/6*2 + this.outHeight);
	    	ctx.stroke();

	    	ctx.beginPath();
	    	ctx.moveTo(this.outWidth, this.courtHeight/6*4 + this.outHeight);
	    	ctx.lineTo(this.courtWidth + this.outWidth, this.courtHeight/6*4 + this.outHeight);
	    	ctx.stroke();


	    	//>>>>>>players

	    	// out line
	   		ctx.strokeStyle = 'white';
	    	ctx.lineWidth = 4;
	    	ctx.strokeRect(this.x, this.y, this.courtWidth, this.courtHeight);

	    	// center lines
	   		ctx.strokeStyle = 'white';
	    	ctx.lineWidth = 10;

	    	ctx.beginPath();
	    	ctx.moveTo(this.outWidth, this.courtHeight/2 + this.outHeight);
	    	ctx.lineTo(this.courtWidth + this.outWidth, this.courtHeight/2 + this.outHeight);
	    	ctx.stroke();

	}}

	class toggleFullScreenButton {
		constructor(x, y, width, height) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.image = document.getElementById('fullScreenButton');
			this.imageWidth = 32;
			this.imageHeight = 32;

		}
		draw() {
			ctx.drawImage(this.image, 0,0, this.imageWidth, this.imageHeight, this.x, this.y, this.width, this.height);

		}		
	}

	class rotationIcon {
		constructor(x, y, width, height) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.image = document.getElementById('rotationImage');
			this.imageWidth = 50;
			this.imageHeight = 50;
			this.speed = Math.random() * 4 + 1;

		}
		draw() {
			ctx.drawImage(this.image, 0,0, this.imageWidth, this.imageHeight, this.x, this.y, this.width, this.height);

		}

		preShake() {

		  ctx.save();
		  var dx = Math.random()*2;
		  var dy = Math.random()*1;
		  ctx.translate(dx, dy); 
		}
		postShake() {
			ctx.restore();
		}
	}


	class Player {
		constructor(x, y, radius, player_index, playerColor, playerLetter) {
			this.x = x;
			this.y = y;
			this.radius = radius;
			this.player_index = player_index;
			this.playerColor = playerColor;
			this.speed = 1.6;
			this.isRotating = false;
			this.playerLetter = playerLetter;
		}
		draw() {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
			ctx.fillStyle = this.playerColor;
			ctx.fill();
			ctx.lineWidth = 3;
			ctx.strokeStyle = 'black';
			ctx.stroke();

			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillStyle = 'black';
			ctx.font = '12pt Times';
			ctx.fillText(this.playerLetter, this.x, this.y);

		}
		update() {
			if (is_dragging && this.player_index === current_zone_index) {

				this.x = court.zoneArray[current_zone_index].centerX;
				this.y = court.zoneArray[current_zone_index].centerY;

			}
			if (rotateProcess) {
				this.isRotating = true;
				rotatingStatus[this.player_index] = this.isRotating;
				// Rotation from zone 1, 6

				let next_player_index;
				if (this.player_index == court.zoneArray.length - 1) {
					next_player_index = 0;
				}
				else {
					next_player_index = this.player_index + 1
				}

				const dx = this.x - zoneArrayProtocol[next_player_index].centerX;
				const dy = this.y - zoneArrayProtocol[next_player_index].centerY;
				const distance = Math.sqrt(dx*dx+dy*dy);

				let moves = distance/this.speed;

				let xunits = dx/moves; 
				let yunits = dy/moves; 

				if (distance > 1) {
					this.x-=xunits;
				}
				else {
					this.x = zoneArrayProtocol[next_player_index].centerX;

				}

	// 3 3 3 3 111
	// 3 3 3 3 9
	// 3 3 3 3 1		

				if (distance > 1) {
					this.y-=yunits;
				}
				else {
					this.y = zoneArrayProtocol[next_player_index].centerY;

				}
				if (this.x === zoneArrayProtocol[next_player_index].centerX && this.y === zoneArrayProtocol[next_player_index].centerY) {
					this.isRotating = false;
					rotatingStatus[this.player_index] = this.isRotating;
					court.zoneArray[this.player_index].centerX = this.x;
					court.zoneArray[this.player_index].centerY = this.y;



				}
				if (rotatingStatus.length === zoneArrayProtocol.length) {
					if (rotatingStatus.every(elem => elem === false)) {
						rotateProcess = false;
						rotatingStatus = [];

					if (!rotateProcess) {
						if (rotationPosition === 6) {
							rotationPosition = 1;
						}
						else {rotationPosition +=1;}
						for (let one_player of players) {
							if (one_player.player_index === 5) {
								one_player.player_index = 0;
							} 
							else {one_player.player_index+=1}
						}
						let tmp_n = court.zoneArray.length;
						let tmp_shape = court.zoneArray[tmp_n - 1];
						for (let i = tmp_n - 2; i >= 0; i--) {
							court.zoneArray[i+1] = court.zoneArray[i]
						}
						court.zoneArray[0] = tmp_shape;


		    			zoneArrayProtocol = JSON.parse(JSON.stringify(court.zoneArray));;

					}
				}
				}






				// if (this.player_index in [0, 1]) {
				// 	if (this.x < zoneArrayProtocol[this.player_index + 1].centerX) {
				// 		this.x+=this.speed;
				// 	} 
				// 	else if (this.x > zoneArrayProtocol[this.player_index + 1].centerX) {
				// 		this.x--;

				// 	}
				// 	if (this.y < zoneArrayProtocol[this.player_index + 1].centerY) {
				// 		this.y+=this.speed;
				// 	} else if (this.y > zoneArrayProtocol[this.player_index + 1].centerY) {
				// 		this.y-=this.speed
				// 	}
				// }

		
		
				
				// for (let i = 0; i <=1;  i++) {
				// 	while (court.zoneArray[i].centerX !== zoneArrayProtocol[i + 1].centerX) {
				// 			if (court.zoneArray[i].centerX < zoneArrayProtocol[i + 1].centerX) {
				// 				this.x++;	
				// 			} else {
				// 				this.x--;
				// 			}
				// 		}
				// 	while (court.zoneArray[i].centerY !== zoneArrayProtocol[i + 1].centerY) {
				// 			if (court.zoneArray[i].centerY < zoneArrayProtocol[i + 1].centerY) {
				// 				this.y++;	
				// 			} else {
				// 				this.y--;
				// 			}
				// 		}
				// }
				// rotate = false;

			}
		}

	}




	let mouse_down = function(event) {
		event.preventDefault();

		startX = parseInt(event.clientX - canvas.getBoundingClientRect().left);
		startY = parseInt(event.clientY - canvas.getBoundingClientRect().top);

		//rotation button
		if (mouse_in_button(startX, startY, rotationButtonCoords)) 
			{
				animateIcon();
				rotatePlayers()
			};
		// fullscreen button
		if (mouse_in_button(startX, startY, fullscreen_button)) 
			{
				toggleFullScreen();
			};
		// players
		let index = 0;
		for (let zone of court.zoneArray) {
			if (is_mouse_in_shape(startX, startY, zone)) {
				current_zone_index = index;
				is_dragging = true;
				return

			}
			index++;
		}
	}

	 let read_touch = function (event) {
	 	event.preventDefault();
	    let touch = event.touches[0];
		startX = parseInt(event.touches[0].clientX - canvas.getBoundingClientRect().left);
		startY = parseInt(event.touches[0].clientY - canvas.getBoundingClientRect().top)

		//rotation button
		if (mouse_in_button(startX, startY, rotationButtonCoords)) 
			{
				animateIcon();
				rotatePlayers()
			};

		// fullscreen button
		if (mouse_in_button(startX, startY, fullscreen_button)) 
			{
				toggleFullScreen();
			};

		// players
	    let index = 0;
		for (let zone of court.zoneArray) {
			if (is_mouse_in_shape(startX, startY, zone)) {
				current_zone_index = index;
				is_dragging = true;
				return

			}
			index++;
		}
	}

	let mouse_up = function(event) {
		if (!is_dragging) {
			return;
		}
		event.preventDefault();
		is_dragging = false;

	}

	let mouse_out = function(event) {
		if (!is_dragging) {
			return;
		}
		event.preventDefault();
		is_dragging = false;

	}

	let touch_move = function(event) {
		if (!is_dragging) {
			return;
		}
		else {
			event.preventDefault();
			let touch = event.touches[0];
			let mouseX = parseInt(event.touches[0].clientX - canvas.getBoundingClientRect().left);
			let mouseY = parseInt(event.touches[0].clientY - canvas.getBoundingClientRect().top)
			let dx = mouseX - startX;
			let dy = mouseY - startY;
			let current_shape = court.zoneArray[current_zone_index];

			// animate();
			// <<<<BORDER RESTRICTIONS
			if (court.zoneArray[current_zone_index].centerX - court.zoneArray[current_zone_index].radius <= court.x) {

				court.zoneArray[current_zone_index].centerX +=1;
			} 

			else if (court.zoneArray[current_zone_index].centerY - court.zoneArray[current_zone_index].radius <= court.y) {
				court.zoneArray[current_zone_index].centerY +=1;
			}

			else if (court.zoneArray[current_zone_index].centerX + court.zoneArray[current_zone_index].radius >= (court.x + court.courtWidth)) {
				court.zoneArray[current_zone_index].centerX -=1;
			}
			else if (court.zoneArray[current_zone_index].centerY + court.zoneArray[current_zone_index].radius >= (court.y + court.courtHeight/2)) {

				court.zoneArray[current_zone_index].centerY -=1;
			}
			else {
				court.zoneArray[current_zone_index].centerX += dx;
				court.zoneArray[current_zone_index].centerY += dy;
			}
			// BORDER RESTRICTIONS>>>>>>>

			// <<<<PLAYER RESTRICTIONS
			if ([3, 4].includes(current_zone_index)) {
				if (court.zoneArray[current_zone_index].centerX <= court.zoneArray[current_zone_index + 1].centerX) {

				court.zoneArray[current_zone_index].centerX = court.zoneArray[current_zone_index + 1].centerX + 5;
			} }
			
			if ([4, 5].includes(current_zone_index)) {
				if (court.zoneArray[current_zone_index].centerX >= court.zoneArray[current_zone_index - 1].centerX) {

				court.zoneArray[current_zone_index].centerX = court.zoneArray[current_zone_index - 1].centerX - 5;
			} }
			if ([1, 2].includes(current_zone_index)) {
				if (court.zoneArray[current_zone_index].centerX <= court.zoneArray[current_zone_index - 1].centerX) {

				court.zoneArray[current_zone_index].centerX = court.zoneArray[current_zone_index - 1].centerX + 5;
			} }
			
			if ([0, 1].includes(current_zone_index)) {
				if (court.zoneArray[current_zone_index].centerX >= court.zoneArray[current_zone_index + 1].centerX) {

				court.zoneArray[current_zone_index].centerX = court.zoneArray[current_zone_index + 1].centerX - 5;
			} }
			// vertical
			if ([0, 1, 2].includes(current_zone_index)) {
				const reversed_array = [...court.zoneArray].reverse();

				if (court.zoneArray[current_zone_index].centerY >= reversed_array[current_zone_index].centerY) {
					court.zoneArray[current_zone_index].centerY = reversed_array[current_zone_index].centerY - 5;
			} }
			if ([3, 4, 5].includes(current_zone_index)) {
				const reversed_array = [...court.zoneArray].reverse();


				if (court.zoneArray[current_zone_index].centerY <= reversed_array[current_zone_index].centerY) {
					court.zoneArray[current_zone_index].centerY = reversed_array[current_zone_index].centerY + 5;
			} }
			// PLAYER RESTRICTIONS>>>>>>>

			startX = mouseX;
			startY = mouseY;
		}
	}

	let mouse_move = function(event) {
		if (!is_dragging) {
			return;
		}
		else {
			event.preventDefault();

			let mouseX = parseInt(event.clientX - canvas.getBoundingClientRect().left);
			let mouseY = parseInt(event.clientY - canvas.getBoundingClientRect().top);

			let dx = mouseX - startX;
			let dy = mouseY - startY;
			let current_shape = court.zoneArray[current_zone_index];

			// <<<<BORDER RESTRICTIONS
			if (court.zoneArray[current_zone_index].centerX - court.zoneArray[current_zone_index].radius <= court.x) {

				court.zoneArray[current_zone_index].centerX +=1;
			} 

			else if (court.zoneArray[current_zone_index].centerY - court.zoneArray[current_zone_index].radius <= court.y) {
				court.zoneArray[current_zone_index].centerY +=1;
			}

			else if (court.zoneArray[current_zone_index].centerX + court.zoneArray[current_zone_index].radius >= (court.x + court.courtWidth)) {
				court.zoneArray[current_zone_index].centerX -=1;
			}
			else if (court.zoneArray[current_zone_index].centerY + court.zoneArray[current_zone_index].radius >= (court.y + court.courtHeight/2)) {

				court.zoneArray[current_zone_index].centerY -=1;
			}
			else {
				court.zoneArray[current_zone_index].centerX += dx;
				court.zoneArray[current_zone_index].centerY += dy;
			}
			// BORDER RESTRICTIONS>>>>>>>
			// <<<<PLAYER RESTRICTIONS
			if ([4, 3].includes(current_zone_index)) {
				if (court.zoneArray[current_zone_index].centerX <= court.zoneArray[current_zone_index + 1].centerX) {

				court.zoneArray[current_zone_index].centerX = court.zoneArray[current_zone_index + 1].centerX + 5;
			} }
			// horizontal
			if ([4, 5].includes(current_zone_index)) {
				if (court.zoneArray[current_zone_index].centerX >= court.zoneArray[current_zone_index - 1].centerX) {

				court.zoneArray[current_zone_index].centerX = court.zoneArray[current_zone_index - 1].centerX - 5;
			} }
			if ([1, 2].includes(current_zone_index)) {
				if (court.zoneArray[current_zone_index].centerX <= court.zoneArray[current_zone_index - 1].centerX) {

				court.zoneArray[current_zone_index].centerX = court.zoneArray[current_zone_index - 1].centerX + 5;
			} }
			
			if ([0, 1].includes(current_zone_index)) {
				if (court.zoneArray[current_zone_index].centerX >= court.zoneArray[current_zone_index + 1].centerX) {

				court.zoneArray[current_zone_index].centerX = court.zoneArray[current_zone_index + 1].centerX - 5;
			} }
			// vertical
			if ([0, 1, 2].includes(current_zone_index)) {
				const reversed_array = [...court.zoneArray].reverse();

				if (court.zoneArray[current_zone_index].centerY >= reversed_array[current_zone_index].centerY) {
					court.zoneArray[current_zone_index].centerY = reversed_array[current_zone_index].centerY - 5;
			} }
			if ([3, 4, 5].includes(current_zone_index)) {
				const reversed_array = [...court.zoneArray].reverse();


				if (court.zoneArray[current_zone_index].centerY <= reversed_array[current_zone_index].centerY) {
					court.zoneArray[current_zone_index].centerY = reversed_array[current_zone_index].centerY + 5;
			} }
			// PLAYER RESTRICTIONS>>>>>>>



			startX = mouseX;
			startY = mouseY;
		}
	}

	out = new Out(canvas.width, canvas.height);
	court = new playingCourt(canvas.width, canvas.height, playingCourtScale);
	court.init();

	let shape_index = 0;
	for (shape of court.zoneArray) {
		players.push(new Player(shape.centerX, shape.centerY, shape.radius, shape_index, shape.playerColor, shape.playerLetter));
		shape_index++;
	}
	let symbol_size = 27;
	let rotationButtonCoords = {x: canvas.width - court.outWidth - symbol_size*2.7, y: court.outHeight/2 - symbol_size/2, width: symbol_size, height: symbol_size};

	let symbol_circle_size = 7;
	let rotationSymbolCoords = {x: court.x, y: court.outHeight/2, radius: symbol_circle_size/2};

	rotation_icon = new rotationIcon(rotationButtonCoords.x, rotationButtonCoords.y, rotationButtonCoords.width, rotationButtonCoords.height);
	fullscreen_button = new toggleFullScreenButton(rotationButtonCoords.x + rotationButtonCoords.width*2, rotationButtonCoords.y, rotationButtonCoords.width, rotationButtonCoords.height);
	canvas.addEventListener("touchstart", read_touch);
	canvas.addEventListener("touchend", mouse_up);
	canvas.addEventListener("touchcancel", mouse_out);
	canvas.addEventListener("touchmove", touch_move);

	canvas.onmousedown = mouse_down;
	canvas.onmouseup = mouse_up;
	canvas.onmouseout = mouse_out;
	canvas.onmousemove = mouse_move;

	let lastTime = 0;

	function animate(timeStamp){
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;



		out.draw();
		court.draw();
		players.forEach(player =>
			{	
				player.update();
				player.draw();
		 		}
		 	);
	    if (!animationIcon)
	    {
	    	rotation_icon.draw();
		} else {

			rotation_icon.preShake();
	    	rotation_icon.draw();
	    	rotation_icon.postShake();
	    	shakeEnd = window.performance.now();
	    	if (shakeEnd - shakeStart >= 250) {
	    		animationIcon = false;
	    	}

		}
		fullscreen_button.draw()
		drawRotationPosition();
		requestAnimationFrame(animate);
	}
	animate(0);

});