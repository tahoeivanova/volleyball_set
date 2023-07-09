const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

if (window.innerWidth >= 768) {
	canvas.width = 500;
	canvas.height = 1000;
} else {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	}


// const rotation = document.getElementById("rotation");
// rotation.addEventListener('change', function(e){
// 	court.rotate();
// });



var playingCourtScale = 0.78;
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

function rotatePlayers() {
	rotateProcess = true;
	// court.rotate();


}

function drawRotationPosition() {

	// ctx.strokeStyle = 'green';
 //    ctx.strokeRect(court.courtWidth/2 + court.x - 12, court.outHeight/2 - 12, 33, 33);
	ctx.textAlign = 'center';
	ctx.fillStyle = 'black';
	ctx.font = '18pt Times';
	ctx.fillText("R " + rotationPosition, court.courtWidth/2 + court.x + 3, court.outHeight/2 + 10);
	ctx.fillStyle = 'white';
	ctx.fillText("R " + rotationPosition, court.courtWidth/2 + court.x + 2 + 3, court.outHeight/2 + 2 + 10);

}


let mouse_in_rotation_button = function(x, y, coords) {
	if (x >= coords.x && x <= (coords.x + coords.width) && y >= coords.y && y <= (coords.y + coords.height))
		{return true}
	return false
}
let is_mouse_in_shape = function(x, y, shape) {
	let centerX = shape.centerX;
	let centerY = shape.centerY;
	let radius = shape.radius;
	// console.log(shape.zone, shape.x, shape.y);
	// console.log(x, y);
	// let radius = shape.width * playerScale;

	const dx = centerX - x;
	const dy = centerY - y;
	const distance = Math.sqrt(dx*dx+dy*dy);
	// if (distance < enemy.width/3 + this.width/3){
	// 	gameOver = true;
	// }

	// console.log(distance);

	// let d = Math.sqrt(x, y, centerX, centerY);
	if (distance < radius) {
		console.log(shape);
		console.log("Clicked");
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
		this.width = parseInt(width);
		this.height = parseInt(height);

		this.courtWidth =  parseInt(this.width * outWidthScale);
		this.x = this.outWidth = parseInt((this.width - this.courtWidth)/2);

		this.courtHeight = this.courtWidth*2;
		this.y = this.outHeight = parseInt((this.height - this.courtHeight)/2);

		this.side1 = {x:this.x, y:this.y, width: this.courtHeight/2, height: this.courtHeight/2};
		this.side2 = {x:this.x, y:this.y + this.courtHeight/2, width: this.courtWidth, height: this.courtHeight/2};

		this.zoneArray = [
				{zone: 1, side: 1, x:this.x, y:this.y, width: this.courtWidth/3, height: this.courtHeight/4, color: "#ff3377", playerColor: "#00ff80"},
				{zone: 6, side: 1, x:parseInt(this.x + this.courtWidth/3), y:this.y, width: this.courtHeight/6, height: this.courtHeight/4, color: "#ff4d88", playerColor: "#0088cc"},
				{zone: 5, side: 1, x:this.x + (this.courtWidth/3)*2, y:this.y, width: this.courtHeight/6, height: this.courtHeight/4, color: "#ff6699", playerColor: "#ff0000"},//#ff1a1a #ff4d4d
				{zone: 4, side: 1, x:this.x + (this.courtWidth/3)*2, y:this.y + this.courtHeight/4, width: this.courtWidth/3, height: this.courtHeight/4, color: "#ff6699", playerColor: "#ff6633"},
				{zone: 3, side: 1, x:this.x + this.courtWidth/3, y:this.y  + this.courtHeight/4, width: this.courtWidth/3, height: this.courtHeight/4, color: "#ff99bb", playerColor: "#4dc3ff"},
				{zone: 2, side: 1, x:this.x, y:this.y  + this.courtHeight/4, width: this.courtWidth/3, height: this.courtHeight/4, color: "#ffb3cc", playerColor: "#ff1a1a"}//#cc0000
		];


	}
	init() {
	    for (let i = 0; i < this.zoneArray.length; i++){
		
			let centerX = parseInt(this.zoneArray[i].x + this.zoneArray[i].width/2);
			let centerY = parseInt(this.zoneArray[i].y + this.zoneArray[i].height/2);
			let radius = parseInt(this.zoneArray[i].width* playerScale /2);
			this.zoneArray[i].centerX = centerX;
			this.zoneArray[i].centerY = centerY;
			this.zoneArray[i].radius = radius;

    	}
    	zoneArrayProtocol = JSON.parse(JSON.stringify(this.zoneArray));;

    	console.log("zoneArrayProtocol", zoneArrayProtocol);
	}

	// rotate() {
	// 	console.log("Rotate");
	// 	this.zoneArray = this.zoneArray.splice(-1).concat(this.zoneArray);
	// 	console.log(this.zoneArray);
	// 	}

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


class Player {
	constructor(x, y, radius, player_index, playerColor) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.player_index = player_index;
		this.playerColor = playerColor;
		this.speed = 1.5;
		this.isRotating = false;
	}
	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = this.playerColor;
		ctx.fill();
		ctx.lineWidth = 3;
		ctx.strokeStyle = 'black';
		ctx.stroke();
	}
	update() {
		if (is_dragging && this.player_index === current_zone_index) {

			this.x = court.zoneArray[current_zone_index].centerX;
			this.y = court.zoneArray[current_zone_index].centerY;

		}
		if (rotateProcess) {

			this.isRotating = true;
			rotatingStatus[this.player_index] = this.isRotating;
			console.log("zoneArrayProtocol from rot",zoneArrayProtocol);
			// Rotation from zone 1, 6

			let next_player_index;
			if (this.player_index == court.zoneArray.length - 1) {
				next_player_index = 0;
			}
			else {
				next_player_index = this.player_index + 1
			}
			console.log("player index", this.player_index);
			console.log("player_index.centerX", court.zoneArray[this.player_index].centerX);
			console.log("next_player_index.centerX", zoneArrayProtocol[next_player_index].centerX);
			console.log("player_index.centerY", court.zoneArray[this.player_index].centerY);
			console.log("next_player_index.centerY", zoneArrayProtocol[next_player_index].centerY);
			console.log("this.x", this.x);
			console.log("this.y", this.y);

			const dx = this.x - zoneArrayProtocol[next_player_index].centerX;

			const dy = this.y - zoneArrayProtocol[next_player_index].centerY;
			console.log("dx", dx);
			console.log("dy", dy)
			const distance = Math.sqrt(dx*dx+dy*dy);
			console.log("distance", distance);

			let moves = distance/this.speed;

			let xunits = dx/moves; 
			let yunits = dy/moves; 

			if (distance > xunits) {
				this.x-=xunits;
			}
			else {
				this.x = zoneArrayProtocol[next_player_index].centerX;

			}

// 3 3 3 3 111
// 3 3 3 3 9
// 3 3 3 3 1		

			if (distance > yunits) {
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
			console.log("rotatingStatus", rotatingStatus);
			if (rotatingStatus.length === zoneArrayProtocol.length) {
				if (rotatingStatus.every(elem => elem === false)) {
					rotateProcess = false;
					rotatingStatus = [];

				if (!rotateProcess) {
					if (rotationPosition === 6) {
						rotationPosition = 1;
					}
					else {rotationPosition +=1;}
					console.log("ROTATION END", rotateProcess);
					console.log(players);
					for (let one_player of players) {
						console.log(one_player);
						if (one_player.player_index === 5) {
							one_player.player_index = 0;
						} 
						else {one_player.player_index+=1}
					}
					let tmp_n = court.zoneArray.length;
					let tmp_shape = court.zoneArray[tmp_n - 1];
					console.log("tmp_shape 1", tmp_shape);
					for (let i = tmp_n - 2; i >= 0; i--) {
						court.zoneArray[i+1] = court.zoneArray[i]
					}
					court.zoneArray[0] = tmp_shape;

					// console.log("tmp_shape 2", tmp_shape);

	    // 			console.log("ZONE ARRAY AFTER ROTATION ", court.zoneArray)

	    // 			console.log("ZONE ARRAY AFTER INIT ", court.zoneArray)
	    			zoneArrayProtocol = JSON.parse(JSON.stringify(court.zoneArray));;
					console.log("rotate_process", rotateProcess);
					console.log("rotatingStatus", rotatingStatus);
					console.log("this.x", this.x);
					console.log("this.y", this.y);
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
	// console.log(startX, startY)
	// else if (event.touches) {
	// 	console.log("Touch")
	// 	startX = parseInt(event.touches[0].clientX - canvas.getBoundingClientRect().left);
	// 	startY = parseInt(event.touches[0].clientY - canvas.getBoundingClientRect().top);

	// }
	//rotation button
	if (mouse_in_rotation_button(startX, startY, rotationButtonCoords)) rotatePlayers();

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
 	// console.log(court.zoneArray[0])
 	console.log("TOUCH");
    // let canvasRect = canvas.getBoundingClientRect();
    let touch = event.touches[0];
   	// console.log(event.touches[0]);
	startX = parseInt(event.touches[0].clientX - canvas.getBoundingClientRect().left);
	startY = parseInt(event.touches[0].clientY - canvas.getBoundingClientRect().top)
    // startX = touch.pageX - document.documentElement.scrollLeft - canvas.getBoundingClientRect().left;
    // startY = touch.pageY - document.documentElement.scrollTop - canvas.getBoundingClientRect().top;
    // console.log(startX, startY);
	if (mouse_in_rotation_button(startX, startY, rotationButtonCoords)) rotatePlayers();

    let index = 0;
	for (let zone of court.zoneArray) {
		if (is_mouse_in_shape(startX, startY, zone)) {
			current_zone_index = index;
			is_dragging = true;
			// console.log("PLAYER")
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
   		// console.log(event.touches[0]);
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
		// console.log("current_zone_index", current_zone_index)
		if ([3, 4].includes(current_zone_index)) {
			if (court.zoneArray[current_zone_index].centerX <= court.zoneArray[current_zone_index + 1].centerX) {

			court.zoneArray[current_zone_index].centerX = court.zoneArray[current_zone_index + 1].centerX + 5;
		} }
		
		if ([4, 5].includes(current_zone_index)) {
			if (court.zoneArray[current_zone_index].centerX >= court.zoneArray[current_zone_index - 1].centerX) {

			court.zoneArray[current_zone_index].centerX = court.zoneArray[current_zone_index - 1].centerX - 5;
		} }
		if ([1, 2].includes(current_zone_index)) {
			// console.log("zone", current_zone_index);
			if (court.zoneArray[current_zone_index].centerX <= court.zoneArray[current_zone_index - 1].centerX) {

			court.zoneArray[current_zone_index].centerX = court.zoneArray[current_zone_index - 1].centerX + 5;
		} }
		
		if ([0, 1].includes(current_zone_index)) {
			if (court.zoneArray[current_zone_index].centerX >= court.zoneArray[current_zone_index + 1].centerX) {

			court.zoneArray[current_zone_index].centerX = court.zoneArray[current_zone_index + 1].centerX - 5;
		} }
		// vertical
		if ([0, 1, 2].includes(current_zone_index)) {
			// console.log(1, court.zoneArray[current_zone_index]);
			const reversed_array = [...court.zoneArray].reverse();
			// reversed_array = reversed_array.reverse();
			// console.log(2, reversed_array[current_zone_index]);

			if (court.zoneArray[current_zone_index].centerY >= reversed_array[current_zone_index].centerY) {
				// console.log("Ouch");
				court.zoneArray[current_zone_index].centerY = reversed_array[current_zone_index].centerY - 5;
		} }
		if ([3, 4, 5].includes(current_zone_index)) {
			// console.log(1, court.zoneArray[current_zone_index]);
			const reversed_array = [...court.zoneArray].reverse();
			// reversed_array = reversed_array.reverse();
			// console.log(2, reversed_array[current_zone_index]);

			if (court.zoneArray[current_zone_index].centerY <= reversed_array[current_zone_index].centerY) {
				// console.log("Ouch");
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
		// console.log(event);
		// if (event.clientX) {
		// 	console.log("CLIENT X");

		// 	let mouseX = parseInt(event.clientX - canvas.getBoundingClientRect().left);
		// 	let mouseY = parseInt(event.clientY - canvas.getBoundingClientRect().top);
		// }
		// else if (event.touches) {
		// 	let mouseX = parseInt(event.touches[0].clientX - canvas.getBoundingClientRect().left);
		// 	let mouseY = parseInt(event.touches[0].clientY - canvas.getBoundingClientRect().top);

		// }



		let mouseX = parseInt(event.clientX - canvas.getBoundingClientRect().left);
		let mouseY = parseInt(event.clientY - canvas.getBoundingClientRect().top);

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
		// console.log("current_zone_index", current_zone_index)
		if ([4, 3].includes(current_zone_index)) {
			// console.log("zone", current_zone_index);
			if (court.zoneArray[current_zone_index].centerX <= court.zoneArray[current_zone_index + 1].centerX) {

			court.zoneArray[current_zone_index].centerX = court.zoneArray[current_zone_index + 1].centerX + 5;
		} }
		// horizontal
		if ([4, 5].includes(current_zone_index)) {
			if (court.zoneArray[current_zone_index].centerX >= court.zoneArray[current_zone_index - 1].centerX) {

			court.zoneArray[current_zone_index].centerX = court.zoneArray[current_zone_index - 1].centerX - 5;
		} }
		if ([1, 2].includes(current_zone_index)) {
			// console.log("zone", current_zone_index);
			if (court.zoneArray[current_zone_index].centerX <= court.zoneArray[current_zone_index - 1].centerX) {

			court.zoneArray[current_zone_index].centerX = court.zoneArray[current_zone_index - 1].centerX + 5;
		} }
		
		if ([0, 1].includes(current_zone_index)) {
			if (court.zoneArray[current_zone_index].centerX >= court.zoneArray[current_zone_index + 1].centerX) {

			court.zoneArray[current_zone_index].centerX = court.zoneArray[current_zone_index + 1].centerX - 5;
		} }
		// vertical
		if ([0, 1, 2].includes(current_zone_index)) {
			// console.log(1, court.zoneArray[current_zone_index]);
			const reversed_array = [...court.zoneArray].reverse();
			// reversed_array = reversed_array.reverse();
			// console.log(2, reversed_array[current_zone_index]);

			if (court.zoneArray[current_zone_index].centerY >= reversed_array[current_zone_index].centerY) {
				// console.log("Ouch");
				court.zoneArray[current_zone_index].centerY = reversed_array[current_zone_index].centerY - 5;
		} }
		if ([3, 4, 5].includes(current_zone_index)) {
			// console.log(1, court.zoneArray[current_zone_index]);
			const reversed_array = [...court.zoneArray].reverse();
			// reversed_array = reversed_array.reverse();
			// console.log(2, reversed_array[current_zone_index]);

			if (court.zoneArray[current_zone_index].centerY <= reversed_array[current_zone_index].centerY) {
				// console.log("Ouch");
				court.zoneArray[current_zone_index].centerY = reversed_array[current_zone_index].centerY + 5;
		} }
		// PLAYER RESTRICTIONS>>>>>>>



		startX = mouseX;
		startY = mouseY;
		// for (let zone of court.zoneArray) {

		// }

	}

}
out = new Out(canvas.width, canvas.height);
court = new playingCourt(canvas.width, canvas.height, playingCourtScale);
court.init();
// console.log(court.zoneArray);
// console.log(court.zoneArray[0].centerX);

let shape_index = 0;
for (shape of court.zoneArray) {
	players.push(new Player(shape.centerX, shape.centerY, shape.radius, shape_index, shape.playerColor));
	shape_index++;
}

let rotationButtonCoords = {x: court.courtWidth/2 + court.x - 12, y: court.outHeight/2 - 12, width: 33, height: 33};


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
	drawRotationPosition();
	requestAnimationFrame(animate);
}
animate(0);