const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

console.log("innerWidth ", window.innerWidth)
if (window.innerWidth >= 768) {
	canvas.width = 500;
	canvas.height = 1000;
} else {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	}
console.log("canvas.width ", canvas.width)

var playingCourtScale = 0.85;
let current_zone_index = -1;
let playerScale = 0.4;
is_dragging = false;
let startX;
let startY;
let players = [];
let zoneArrayGlobal;



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
		this.courtWidth =  width * outWidthScale;
		this.x = this.outWidth = (width - this.courtWidth)/2;

		this.courtHeight = this.courtWidth*2;
		this.y = this.outHeight = (height - this.courtHeight)/2;

		this.side1 = {x:this.x, y:this.y, width: this.courtHeight/2, height: this.courtHeight/2};
		this.side2 = {x:this.x, y:this.y + this.courtHeight/2, width: this.courtWidth, height: this.courtHeight/2};

		this.zoneArray = [
				{zone: 1, side: 1, x:this.x, y:this.y, width: this.courtWidth/3, height: this.courtHeight/4, color: "#ff3377"},
				{zone: 6, side: 1, x:this.x + this.courtWidth/3, y:this.y, width: this.courtHeight/6, height: this.courtHeight/4, color: "#ff4d88"},
				{zone: 5, side: 1, x:this.x + (this.courtWidth/3)*2, y:this.y, width: this.courtHeight/6, height: this.courtHeight/4, color: "#ff6699"},
				{zone: 4, side: 1, x:this.x + (this.courtWidth/3)*2, y:this.y + this.courtHeight/4, width: this.courtWidth/3, height: this.courtHeight/4, color: "#ff6699"},
				{zone: 3, side: 1, x:this.x + this.courtWidth/3, y:this.y  + this.courtHeight/4, width: this.courtWidth/3, height: this.courtHeight/4, color: "#ff99bb"},
				{zone: 2, side: 1, x:this.x, y:this.y  + this.courtHeight/4, width: this.courtWidth/3, height: this.courtHeight/4, color: "#ffb3cc"}
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


class Player {
	constructor(x, y, radius, player_index) {
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.player_index = player_index;
	}
	draw() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
		ctx.fillStyle = 'green';
		ctx.fill();
		ctx.lineWidth = 5;
		ctx.strokeStyle = 'green';
		ctx.stroke();
	}
	update() {
		if (is_dragging && this.player_index === current_zone_index) {

			this.x = court.zoneArray[current_zone_index].centerX;
			this.y = court.zoneArray[current_zone_index].centerY;

		}
	}

}




let mouse_down = function(event) {
	event.preventDefault();

	startX = parseInt(event.clientX - canvas.getBoundingClientRect().left);
	startY = parseInt(event.clientY - canvas.getBoundingClientRect().top);
	console.log(startX, startY)
	// else if (event.touches) {
	// 	console.log("Touch")
	// 	startX = parseInt(event.touches[0].clientX - canvas.getBoundingClientRect().left);
	// 	startY = parseInt(event.touches[0].clientY - canvas.getBoundingClientRect().top);

	// }

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
 	// event.preventDefault();
 	console.log(court.zoneArray[0])
 	console.log("TOUCH");
    // let canvasRect = canvas.getBoundingClientRect();
    let touch = event.touches[0];
   	console.log(event.touches[0]);
	startX = parseInt(event.touches[0].clientX - canvas.getBoundingClientRect().left);
	startY = parseInt(event.touches[0].clientY - canvas.getBoundingClientRect().top)
    // startX = touch.pageX - document.documentElement.scrollLeft - canvas.getBoundingClientRect().left;
    // startY = touch.pageY - document.documentElement.scrollTop - canvas.getBoundingClientRect().top;
    console.log(startX, startY);

    let index = 0;
	for (let zone of court.zoneArray) {
		if (is_mouse_in_shape(startX, startY, zone)) {
			current_zone_index = index;
			is_dragging = true;
			console.log("PLAYER")
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
   		console.log(event.touches[0]);
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
		if (court.zoneArray[current_zone_index].centerX - court.zoneArray[current_zone_index].radius <= court.x) {

			court.zoneArray[current_zone_index].centerX +=1;
		} 




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
		if (court.zoneArray[current_zone_index].centerX - court.zoneArray[current_zone_index].radius <= court.x) {

			court.zoneArray[current_zone_index].centerX +=1;
		} 




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
	players.push(new Player(shape.centerX, shape.centerY, shape.radius, shape_index));
	shape_index++;
}

canvas.addEventListener("touchstart", read_touch);
canvas.addEventListener("touchend", mouse_up);
canvas.addEventListener("touchcancel", mouse_out);
canvas.addEventListener("touchmove", touch_move);

canvas.onmousedown = mouse_down;
canvas.onmouseup = mouse_up;
canvas.onmouseout = mouse_out;
canvas.onmousemove = mouse_move;


function animate(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);



	out.draw();
	court.draw();
	players.forEach(player =>
		{	
			player.update();
			player.draw();
	 		}
	 	);
	requestAnimationFrame(animate);
}
animate();
