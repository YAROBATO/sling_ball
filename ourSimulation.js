function buildWorld() {
	
	world = new World({
		hUnits: 200,
		//coords: {step: 50},
		unit: "m",
		minUnits: {x: -50, y:-50},
		img: "img/background.png",
		fontColor: "#ffffff"
	});
	min1 = 5;		//erster Zufälliger Ort des Zieles
	max1 = 120;
	aimy = (Math.random() * (max1 - min1)) + min1;
	min2 = 40;
	max2 = 240;
	aimx = (Math.random() * (max2 - min2)) + min2;
	tutorial = true;

	aim = new Actor({img: "img/aim.png", x:aimx, y: aimy, wUnits: 20});
	sling1 = new Line({x1:0, y1: 0,x2: 0, y2: 0, color: 0x000000});
	sling2 = new Line({x1:0, y1: 0,x2: 0, y2: 0, color: 0x000000});
	schleuder2 = new Actor({img: "img/schlöder 2.png", x: 0, y: -17.1, wUnits: 97});
	flugi = new Actor({img: "img/baskeball1.png", x: 0, y:0, wUnits: 10});
	schleuder1 = new Actor({img: "img/schlöder 1.png", x: 0, y: -17.1, wUnits: 97, autorotate: true});
	front = new Actor({img: "img/front.png", x: 125, y: 50 });
	
}
	
function setup() {
	g = 5;			//das g und die Reibung können nach belieben angepasst werden
	reibung = 0.66;
	t = 0;
	dt = 0.016;    // Zeitschritt in Sekunden
	flugi.vx = 0;
	flugi.vy = 0;
	max = 120;		//einige Variabeln...
	rota = 0;
	folgen = false;		
	drehen = true;
	fallen = false;
	gedrückt = false;
	wechseln = true;
	points = 0;
	pointsO = 0;
	round = 1;
	mx = 0;
	my = 0;
}

window.addEventListener("keydown", taste);
window.addEventListener("mousedown", maus)
window.addEventListener("mousemove",maus);
window.addEventListener("click", maus1)

function maus1(__event){ 	//Tutorialfenster bei Klick entfernen
	if (__event.button == 0 && tutorial){
		front.destroy();
		tutorial = false;
	}
}
function maus(_event){ 		//Mausposition von px in units
	mx = world.xToUnit(_event.clientX)
	my = world.yToUnit(_event.clientY)
}


function taste(event) {
	console.log("Eine Taste wurde gedrückt:", event.key);
	
	if((event.key == "ArrowLeft") && (flugi.x >= -44)){flugi.x += -1;}		//mit Pfeiltasten steuern
	if((event.key == "ArrowRight") && (flugi.x <= -6)){flugi.x += 1;}
	if((event.key == "ArrowDown") && (flugi.y >= -36)) {flugi.y += -1;}
	if((event.key == "ArrowUp") && (flugi.y <= 0)) {flugi.y += 1;}
	if((event.key == "Shift") && (mx <= flugi.x + 5) && (mx >= flugi.x -5) && (my <= flugi.y + 5) && (my >= flugi.y -5)){
		folgen = true;
		}
	if((event.key == " ")&&(flugi.x < 0)) {		//wann der Ball gelöst werden soll und mit welcher Geschwindigkeit
		document.getElementById("+punkte").innerHTML = " ";
		folgen = false;
		fallen = true;
		if (flugi.y == 0){
			flugi.vx = flugi.x *(-1) * 5
		}
		if (flugi.x <= flugi.y && flugi.y < 0){		//unterschiedliche Berrechnung der Geschwindigkeit, da zb. einmal x/y gerrechnet wird darf y nicht unter 1 sein, weil die Geschwindigkeit ansonsten zu hoch ist
			flugi.vx = (-1 * flugi.x)*5;
			if (flugi.vx <= 50){flugi.vx = 70}
			flugi.vy = flugi.y/flugi.x * flugi.vx; 
			rota = -0.0007 * flugi.vx ;
			console.log("1")
		}
		if ((flugi.y <= flugi.x && flugi.y < 0)){
			flugi.vy = (-1 * flugi.y)*5;
			if (flugi.vy <= 50){flugi.vy = 70}
			flugi.vx = flugi.x/flugi.y * flugi.vy; 
			rota = -0.0007 * flugi.vx ;
			console.log("2")
		}
		if ((flugi.y*-1)<= flugi.x && flugi.y > 0){
			flugi.vy =  (-1)*flugi.y*5;
			if (flugi.vy >= -50){flugi.vy = -70}
			flugi.vx = flugi.x/flugi.y * flugi.vy; 
			rota = -0.0008 * flugi.vx ;
			console.log("3")
		}
	}
	if((event.key == "Shift") && (folgen) && (mx <= 5) && (my >= -37) && (mx >= -45.5)){ //Der Ball folgt dem Mauszeiger
		flugi.x = mx;
		flugi.y = my;
	}
}

function draw() { //Schlinge zeichnen
	sling1.destroy();
	sling2.destroy();
	schleuder1.destroy();
	sling1 = new Line({x1:-5, y1: 0,x2: flugi.x, y2: flugi.y, color: 0x301608, thickness: 8});
	sling2 = new Line({x1:5, y1: 0,x2: flugi.x, y2: flugi.y, color: 0x301608, thickness: 8});
	schleuder1 = new Actor({img: "img/schlöder 1.png", x: 0, y: -17.1, wUnits: 97}); //damit sich die Schleuder vor den Linien befindet
}

function loop() {
	flugi.x += flugi.vx * dt
	flugi.y += flugi.vy * dt

	if(flugi.x <=5 && tutorial == false){ //Wann die Schlinge gezeichnet werden soll 
		draw();	
		if(flugi.x < 0){flugi.rotation = Math.atan(flugi.y/flugi.x);} //Ausrichtung des Balles während er in der Schlinge ist
		if(flugi.x > 0){flugi.rotation = Math.atan(flugi.y/(flugi.x*-1));}
	}
	if(tutorial == false){document.getElementById("runde").innerHTML = "Round: " + round;} //damit nicht während dem Tutorial die Runden angezeigt werden
	if(tutorial == false){document.getElementById("punkte").innerHTML = "Points: " + pointsO;}//damit nicht während dem Tutorial die Punkte angezeigt werden
	
	if (flugi.x >= 300){ 	//wenn der Ball über den Spielrand geht (zurücksetzen)
		document.getElementById("+punkte").innerHTML = "+ " + points;
		flugi.x = 0;
		flugi.y = 0;
		flugi.vy = 0;
		flugi.vx = 0;
		aim.x = (Math.random() * (max2 - min2)) + min2; //Zufälliger Ort des Zieles
		aim.y = (Math.random() * (max1 - min1)) + min1;
		drehen = true;
		fallen = false;
		points = 0;
		flugi.rotation = 0;
		round ++;
		flugi.changeImage("img/baskeball1.png"); //Basketball mit "Gurt"
	}
	if(flugi.x > 0 && fallen){	//sobald der Ball die Schlinge verlässt
		flugi.changeImage("img/basketball.png");
		flugi.rotation += rota;
		flugi.vy = flugi.vy-g;
		if(flugi.y <= -37){
			flugi.vy = flugi.vy*(-reibung);
			flugi.y = -36.9;	
		
		}
	}
	if((flugi.x >= aim.x-5) && (flugi.x <= aim.x) && (flugi.y >=aim.y-16) && (flugi.y <= aim.y + 16) && (drehen)){ //je nachdem wo der Ball die Scheibe getroffen hat --> unterschiedliche Punkte
		flugi.vx = flugi.vx * (-0.4)
		rota = rota * (-0.6)
		if(flugi.y <= aim.y + 3.6 && flugi.y >= aim.y - 3.6){points = 10}
		else if(flugi.y <= aim.y + 7.2  && flugi.y >= aim.y - 7.2){points = 8}
		else if(flugi.y <= aim.y + 10.8 && flugi.y >= aim.y - 10.8){points = 6}
		else if(flugi.y <= aim.y + 14.4 && flugi.y >= aim.y - 14.4){points = 4}
		else if(flugi.y <= aim.y + 18 && flugi.y >= aim.y - 18){points = 2}
		console.log("Punkte: " + points);
		document.getElementById("+punkte").innerHTML = "+ " + points;
		drehen = false;
	}
	if ((drehen == false) && (flugi.x <= 5)){	//Wenn der Ball von der Scheibe abgeprallt ist und zurück bei x = 0 angelangt ist
		flugi.x = 0;
		flugi.y = 0;
		flugi.vy = 0;
		flugi.vx = 0;
		pointsO += points;
		aim.x = (Math.random() * (max2 - min2)) + min2;
		aim.y = (Math.random() * (max1 - min1)) + min1;
		drehen = true;
		fallen = false;
		points = 0;
		round++;
		document.getElementById("+punkte").innerHTML = " ";
		flugi.rotation = 0;
		flugi.changeImage("img/baskeball1.png");
	}
	world.update();
} 
