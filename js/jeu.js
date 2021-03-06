var proposition = [];

// construction du tableau contenant le plateau de jeu
function afficherPlateau(plateau, conteneur, id) {
	var table = document.createElement('table');
	table.setAttribute('class', 'plateau');
	if(id){
	    table.setAttribute('id', id);
	}
	var robots = {};
	plateau.robots.forEach(function(robot) {
		if (!(robot.line in robots)) {
			robots[robot.line] = {};
		}
		robots[robot.line][robot.column] = robot;
	});
	
	var tbody = document.createElement('tbody');
	for (var ligne = 0; ligne < 16; ligne++) {
		var tr = document.createElement('tr');
		for (var colonne = 0; colonne < 16; colonne++) {
			var td = document.createElement('td');
			var casePlateau = plateau.board[ligne][colonne];
			
			td.setAttribute('data-colonne', colonne);
			td.setAttribute('data-ligne', ligne);
			
			// classes appliquees sur la case
			var classes = [];
			
			for (var mur in casePlateau) {
				classes.push(mur);
			}
			
			

			if (ligne == plateau.target.l && colonne == plateau.target.c) {
				classes.push('cible');
				classes.push(plateau.target.t);
			}
			
			if (classes.length > 0) {
				td.className = classes.join(' ');
			}
			
			if (ligne in robots && colonne in robots[ligne]) {
				var robot = robots[ligne][colonne];
				var robotSpan = document.createElement('span');
				robotSpan.className = 'robot ' + robot.color;
				robotSpan.setAttribute('data-colonne-origine', colonne);
				robotSpan.setAttribute('data-ligne-origine', ligne);
				
				td.appendChild(robotSpan);
			}
			
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
	}
	table.appendChild(tbody);
	
	conteneur.appendChild(table);
}

function ajouterRedimensionnement() {
	addEventListener('resize', redimensionner);
}

// fonction appelee lors du redimensionnement
function redimensionner() {
	var partie = document.getElementById('partie');
	if (partie) {
		var plateau = document.getElementById('plateau');
		var largeurPlateau;
		var ratio = 0.96;
		if (partie.offsetWidth < partie.offsetHeight) {
			largeurPlateau = partie.offsetWidth * ratio;
			plateau.style.width = largeurPlateau + 'px';
			plateau.style.height = largeurPlateau + 'px';
		} else {
			largeurPlateau = partie.offsetHeight * ratio;
			plateau.style.width = largeurPlateau + 'px';
			plateau.style.height = largeurPlateau + 'px';
		}
		var largeurCase = largeurPlateau / 16;
	
		var L = plateau.querySelectorAll('tr, td');
		for (var i = 0; i < L.length; i++) {
			L[i].style.height = largeurCase + 'px';
		}
		var largeurRobot = (largeurCase - 1) * 0.8;
		var M = plateau.querySelectorAll('.robot');
		for (var i = 0; i < M.length; i++) {
			M[i].style.height = largeurRobot + 'px';
			M[i].style.width  = largeurRobot + 'px';
		}
	
		var N = document.querySelectorAll('#fleches, #boutons');
		for (var i = 0; i < N.length; i++) {
			var largeurConteneur = N[i].offsetWidth;
			var hauteurConteneur = N[i].offsetHeight;
			var table = N[i].querySelector('table');
			var hauteurBouton;
			if (largeurConteneur < hauteurConteneur) {
				hauteurBouton = largeurConteneur / 3.3;
			} else {
				hauteurBouton = hauteurConteneur / 3.3;
			}
		
			var P = table.querySelectorAll('img, .bouton');
			for (var j = 0; j < P.length; j++) {
				P[j].style.width = hauteurBouton + 'px';
				P[j].style.height = hauteurBouton + 'px';
			}
		}
	}
}

// fonction appelee lors du clic sur un robot
function clicRobot() {
	selectionnerRobot(this);
}

// un robot est selectionne, on affiche les cases disponibles et on ajoute les evenements necessaires
function selectionnerRobot(robotElement) {
	masquerSelection();
	afficherSelection(robotElement);
	supprimerClicDestinations();
	masquerCasesAccessibles();
	afficherCasesAccessibles(robotElement);
	ajouterClicDestinations();
}
//tracer la route du robot
function trace(robot, caseArrivee){
	if(util.isChrome()){
		var couleur = getCouleur(robot);
		var caseCourante = robot.parentNode;
		var coordonnees = getCoordonneesCase(caseCourante);
		var direction = getDirection(caseArrivee);
		switch(direction){
			case 'd':
				var trace = document.createElement('span');
				getCase(getCoordonneesCase(caseCourante).ligne,getCoordonneesCase(caseCourante).colonne).appendChild(trace);
				util.addClass(trace,'trace');
				util.addClass(trace,'trace-'+couleur);
				util.addClass(trace,'trace-arrivee-g');
				for(var i = getCoordonneesCase(caseCourante).colonne+1; i < getCoordonneesCase(caseArrivee).colonne;i++){
					var trace = document.createElement('span');
					getCase(getCoordonneesCase(caseCourante).ligne,i).appendChild(trace);
					util.addClass(trace,'trace');
					util.addClass(trace,'trace-'+couleur);
					util.addClass(trace,'trace-d');
				}
				var trace = document.createElement('span');
				getCase(getCoordonneesCase(caseCourante).ligne,getCoordonneesCase(caseArrivee).colonne).appendChild(trace);
				util.addClass(trace,'trace');
				util.addClass(trace,'trace-'+couleur);
				util.addClass(trace,'trace-arrivee-d');
			break;
			case 'g':
				var trace = document.createElement('span');
				getCase(getCoordonneesCase(caseCourante).ligne,getCoordonneesCase(caseArrivee).colonne).appendChild(trace);
				util.addClass(trace,'trace');
				util.addClass(trace,'trace-'+couleur);
				util.addClass(trace,'trace-arrivee-g');
				for(var i = getCoordonneesCase(caseArrivee).colonne+1; i < getCoordonneesCase(caseCourante).colonne;i++){
					var trace = document.createElement('span');
					getCase(getCoordonneesCase(caseCourante).ligne,i).appendChild(trace);
					util.addClass(trace,'trace');
					util.addClass(trace,'trace-'+couleur);
					util.addClass(trace,'trace-g');
				}
				var trace = document.createElement('span');
				getCase(getCoordonneesCase(caseCourante).ligne,getCoordonneesCase(caseCourante).colonne).appendChild(trace);
				util.addClass(trace,'trace');
				util.addClass(trace,'trace-'+couleur);
				util.addClass(trace,'trace-arrivee-d');
			break;
			case 'b':
				var trace = document.createElement('span');
				getCase(getCoordonneesCase(caseCourante).ligne,getCoordonneesCase(caseCourante).colonne).appendChild(trace);
				util.addClass(trace,'trace');
				util.addClass(trace,'trace-'+couleur);
				util.addClass(trace,'trace-arrivee-h');
				for(var i = getCoordonneesCase(caseCourante).ligne+1; i < getCoordonneesCase(caseArrivee).ligne;i++){
					var trace = document.createElement('span');
					getCase(i,getCoordonneesCase(caseCourante).colonne).appendChild(trace);
					util.addClass(trace,'trace');
					util.addClass(trace,'trace-'+couleur);
					util.addClass(trace,'trace-b');
				}
				var trace = document.createElement('span');
				getCase(getCoordonneesCase(caseArrivee).ligne,getCoordonneesCase(caseCourante).colonne).appendChild(trace);
				util.addClass(trace,'trace');
				util.addClass(trace,'trace-'+couleur);
				util.addClass(trace,'trace-arrivee-b');
			break;
			case 'h':
				var trace = document.createElement('span');
				getCase(getCoordonneesCase(caseArrivee).ligne,getCoordonneesCase(caseCourante).colonne).appendChild(trace);
				util.addClass(trace,'trace');
				util.addClass(trace,'trace-'+couleur);
				util.addClass(trace,'trace-arrivee-h');
				for(var i = getCoordonneesCase(caseArrivee).ligne+1; i < getCoordonneesCase(caseCourante).ligne;i++){
					var trace = document.createElement('span');
					getCase(i,getCoordonneesCase(caseCourante).colonne).appendChild(trace);
					util.addClass(trace,'trace');
					util.addClass(trace,'trace-'+couleur);
					util.addClass(trace,'trace-h');
				}
				var trace = document.createElement('span');
				getCase(getCoordonneesCase(caseCourante).ligne,getCoordonneesCase(caseCourante).colonne).appendChild(trace);
				util.addClass(trace,'trace');
				util.addClass(trace,'trace-'+couleur);
				util.addClass(trace,'trace-arrivee-b');
			break;
		}
	}
}

// un robot est deplace vers une case
function deplacerRobot(robotElement, caseElement) {
	var couleurRobot = getCouleur(robotElement);
	var dernierDeplace = getDernierRobotDeplace();
	if (dernierDeplace != null) {
		util.removeClass(dernierDeplace, 'dernier-deplace');
		util.removeClass(getToucheTactile(dernierDeplace), 'dernier-deplace');
	}
	
	if (dernierDeplace != robotElement) {
		proposition.push({
			command: 'select',
			robot: couleurRobot
		});
	}
	
	var coordonnees = getCoordonneesCase(caseElement);
	proposition.push({
		command: 'move',
		line:    coordonnees.ligne,
		column:  coordonnees.colonne
	});
	trace(robotElement, caseElement);
	util.moveTo(robotElement, caseElement);
	
	util.addClass(robotElement, 'deplace');
	util.addClass(robotElement, 'dernier-deplace');
	util.addClass(getToucheTactile(robotElement), 'deplace');
	util.addClass(getToucheTactile(robotElement), 'dernier-deplace');
	
	supprimerClicRobotsDeplaces();
	supprimerClicDestinations();
	masquerCasesAccessibles();
	
	if (util.hasClass(caseElement, 'cible') && getCouleur(caseElement) == couleurRobot) {
		arreterPartie();
		envoyerProposition();
		util.vibrate(1500);
	} else {
		afficherCasesAccessibles(robotElement);
		ajouterClicDestinations();
	}
}

function arreterPartie() {
	supprimerClicRobots();
	supprimerTouches();
	document.getElementById('bouton-recommencer').style.display = 'none';
}

function envoyerProposition() {
	XHR('POST', '/proposition', {
		variables: {
			proposition: JSON.stringify(proposition),
			idGame: getIdGame(),
			login: getLogin()
		},
		
		onload: function(event) {
			var data = JSON.parse(this.responseText);
			
			var messageElem = document.getElementById('message');
			var messageTouchElem = document.getElementById('message-touch');
			switch(data.state) {
				case 'INVALID_EMPTY':
				case 'INVALID_MOVE':
				case 'INVALID_SELECT':
				case 'INCOMPLETE':
					messageElem.className = 'error';
					messageElem.style.display = 'block';
					
					var message = data.details;
					if(message.length == 0)
						message = "Solution invalide"
						
					messageElem.innerHTML = message;
					messageElem.style.display = 'block';
					messageTouchElem.innerHTML = message;
					messageTouchElem.style.display = 'block';
					break;
				case 'SUCCESS':
					messageElem.className = 'info';
					messageElem.style.display = 'block';
					
					var message = data.details;
					if(message.length == 0)
						message = "Proposition envoyée"
						
					messageElem.innerHTML = message;
					messageElem.style.display = 'block';
					messageTouchElem.style.display = 'block';
					break;
				default:
					break;
			}
		}
	});

}
// renvoie la couleur red, green, blue ou yellow d'un robot ou d'une case
function getCouleur(element) {
	var couleurs = [
		'red',
		'green',
		'blue',
		'yellow'
	].filter(function(couleur) {
		return util.hasClass(element, couleur);
	});
	if (couleurs.length > 0) {
		return couleurs[0];
	} else {
		return null;
	}
}

// renvoie la direction d'une case destination
function getDirection(element) {
	var destinations = [
		'destination-g',
		'destination-d',
		'destination-h',
		'destination-b'
	].filter(function(destination) {
		return util.hasClass(element, destination);
	});
	if (destinations.length > 0) {
		return destinations[0].split('-')[1];
	} else {
		return null;
	}
}

// renvoie le robot selectionne
function getRobotSelectionne() {
	return document.querySelector('#plateau .robot.selection');
}

// renvoie le dernier robot qui a ete deplace
function getDernierRobotDeplace() {
	return document.querySelector('#plateau .robot.dernier-deplace');
}

// masque l'effet de selection sur le robot
function masquerSelection() {
	var selection = getRobotSelectionne();
	if (selection != null) {
		util.removeClass(selection, 'selection');
		util.removeClass(getToucheTactile(selection), 'selection');
	}
}

// affiche l'effet de selection sur un robot
function afficherSelection(robotElement) {
	util.addClass(robotElement, 'selection');
	util.addClass(getToucheTactile(robotElement), 'selection');
}

// fonction appelee lors du drag d'un robot
function drag(evt) {
	evt.dataTransfer.effectAllowed = 'copyMove';
	evt.dataTransfer.setData("Text",evt.target.id);
}

// ajoute les evenements clic sur les robots
function ajouterClicRobots() {
	var L = document.querySelectorAll('#plateau .robot');
	for (var i = 0; i < L.length; i++) {
		L[i].addEventListener('mousedown', clicRobot);
		L[i].addEventListener('touchstart', clicRobot);
		L[i].setAttribute('draggable','true');
		L[i].setAttribute('id',i);
		L[i].addEventListener('dragstart', drag);
	}
}

function supprimerClicRobot(robotElement) {
	robotElement.removeEventListener('mousedown', clicRobot);
	robotElement.removeEventListener('touchstart', clicRobot);
	robotElement.setAttribute('draggable','false');
	robotElement.removeEventListener('dragstart', drag);
}

// supprime les evenements clic pour les robots ne pouvant plus etre deplaces
function supprimerClicRobotsDeplaces() {
	var L = document.querySelectorAll('#plateau .robot.deplace:not(.dernier-deplace)');
	for (var i = 0; i < L.length; i++) {
		supprimerClicRobot(L[i]);
	}
}

// supprime les evenements clic sur tous les robots
function supprimerClicRobots() {
	var L = document.querySelectorAll('#plateau .robot');
	for (var i = 0; i < L.length; i++) {
		supprimerClicRobot(L[i]);
	}
}

// renvoie les coordonnees d'une case au format { ligne: y, colonne: x }
function getCoordonneesCase(td) {
	return {
		ligne:   parseInt(td.getAttribute('data-ligne')),
		colonne: parseInt(td.getAttribute('data-colonne'))
	};
}

// renvoie la case correspondant aux coordonnees
function getCase(ligne, colonne) {
	return document.querySelector('td[data-ligne="' + ligne + '"][data-colonne="' + colonne + '"]');
}

// renvoie si une case contient un robot
function contientRobot(caseElement) {
	return caseElement.querySelector('.robot') != null;
}

// renvoie si un deplacement dans une direction est disponible depuis une case donnee
function deplacementPossible(td, direction) {
	if (td == null) {
		return false;
	}
	
	switch (direction) {
		case 'g':
		if (util.hasClass(td, 'g')) {
			return false;
		} else {
			var coordonnees = getCoordonneesCase(td);
			var caseGauche = getCase(coordonnees.ligne, coordonnees.colonne - 1);
			return caseGauche != null && !util.hasClass(caseGauche, 'd') && !contientRobot(caseGauche);
		}
		break;
		
		case 'h':
		if (util.hasClass(td, 'h')) {
			return false;
		} else {
			var coordonnees = getCoordonneesCase(td);
			var caseHaut = getCase(coordonnees.ligne - 1, coordonnees.colonne);
			return caseHaut != null && !util.hasClass(caseHaut, 'b') && !contientRobot(caseHaut);
		}
		break;
		
		case 'b':
		if (util.hasClass(td, 'b')) {
			return false;
		} else {
			var coordonnees = getCoordonneesCase(td);
			var caseBas = getCase(coordonnees.ligne + 1, coordonnees.colonne);
			return caseBas != null && !util.hasClass(caseBas, 'h') && !contientRobot(caseBas);
		}
		break;
		
		case 'd':
		if (util.hasClass(td, 'd')) {
			return false;
		} else {
			var coordonnees = getCoordonneesCase(td);
			var caseDroite = getCase(coordonnees.ligne, coordonnees.colonne + 1);
			return caseDroite != null && !util.hasClass(caseDroite, 'g') && !contientRobot(caseDroite);
		}
		break;
	}
	
	return false;
}

// masque l'effet de case accessible sur toutes les cases
function masquerCasesAccessibles() {
	var L = document.querySelectorAll('#plateau .accessible');
	for (var i = 0; i < L.length; i++) {
		[
			'accessible',
			'destination',
			'destination-g',
			'destination-h',
			'destination-b',
			'destination-d'
		].forEach(function(class_) {
			util.removeClass(L[i], class_);
		});
	}
}

// enlève les traces des robots
function supprimerTraces() {
	var L = document.querySelectorAll('#plateau .trace');
	for (var i = 0; i < L.length; i++) {
			var elem = L[i];
			var parent = elem.parentNode;
			parent.removeChild(elem);
	}
}

function supprimerTrace(caseElement) {
	[
		'trace',
		'trace-blue',
		'trace-red',
		'trace-green',
		'trace-yellow'
	].forEach(function(class_) {
		util.removeClass(caseElement, class_);
	});
}

// affiche les cases accessibles d'un robot
function afficherCasesAccessibles(robotElement) {

	var caseCourante = robotElement.parentNode;
	var coordonnees = getCoordonneesCase(caseCourante);
	
	var c, ligne, colonne;
	
	// deplacement vers la gauche
	colonne = coordonnees.colonne;
	while (true) {
		c = getCase(coordonnees.ligne, colonne);
		if (c == null) {
			break;
		}
		util.addClass(c, 'accessible');
		if (!deplacementPossible(c, 'g')) {
			if (c != caseCourante) {
				util.addClass(c, 'destination');
				util.addClass(c, 'destination-g');
			}
			break;
		}
		colonne--;
	}
	
	// deplacement vers le haut
	ligne = coordonnees.ligne;
	while (true) {
		c = getCase(ligne, coordonnees.colonne);
		if (c == null) {
			break;
		}
		util.addClass(c, 'accessible');
		if (!deplacementPossible(c, 'h')) {
			if (c != caseCourante) {
				util.addClass(c, 'destination');
				util.addClass(c, 'destination-h');
			}
			break;
		}
		ligne--;
	}
	
	// deplacement vers le bas
	ligne = coordonnees.ligne;
	while (true) {
		c = getCase(ligne, coordonnees.colonne);
		if (c == null) {
			break;
		}
		util.addClass(c, 'accessible');
		if (!deplacementPossible(c, 'b')) {
			if (c != caseCourante) {
				util.addClass(c, 'destination');
				util.addClass(c, 'destination-b');
			}
			break;
		}
		ligne++;
	}
	
	// deplacement vers la droite
	colonne = coordonnees.colonne;
	while (true) {
		c = getCase(coordonnees.ligne, colonne);
		if (c == null) {
			break;
		}
		util.addClass(c, 'accessible');
		if (!deplacementPossible(c, 'd')) {
			if (c != caseCourante) {
				util.addClass(c, 'destination');
				util.addClass(c, 'destination-d');
			}
			break;
		}
		colonne++;
	}
}

// fonction appelee lors d'un clic sur une case accessible pour le robot selectionne
function clicDestination() {
	var selection = getRobotSelectionne();
	deplacerRobot(selection, this);
}

// fonction appelee lors du deplacement d'un robot sur une case
function dragOverEnter(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = "move";
}

// fonction appelee lorsqu'un robot est depose sur une case
function drop(evt) {
	if(evt.preventDefault) { evt.preventDefault(); }
    if(evt.stopPropagation) { evt.stopPropagation(); }
	var selection = getRobotSelectionne();
	deplacerRobot(selection, evt.target);
	
	return false;
}

// suppression des evenements clic sur les cases de destination du robot selectionne
function supprimerClicDestinations() {
	var L = document.querySelectorAll('#plateau .destination');
	for (var i = 0; i < L.length; i++) {
		L[i].removeEventListener('mousedown', clicDestination);
		L[i].removeEventListener('touchstart', clicDestination);
		L[i].removeEventListener('dragover',dragOverEnter);
		L[i].removeEventListener('dragenter',dragOverEnter);
		L[i].removeEventListener('drop',drop);
	}
}

// ajout des evenements clic sur les cases de destination du robot selectionne
function ajouterClicDestinations() {
	var L = document.querySelectorAll('#plateau .destination');
	for (var i = 0; i < L.length; i++) {
		L[i].addEventListener('mousedown', clicDestination);
		L[i].addEventListener('touchstart', clicDestination);
		L[i].addEventListener('dragover',dragOverEnter);
		L[i].addEventListener('dragenter',dragOverEnter);
		L[i].addEventListener('drop',drop);
	}
}

// selection du prochain robot disponible pour etre deplace (touche espace)
function selectionnerRobotSuivant() {
	var L = document.querySelectorAll('#plateau .robot:not(.deplace), #plateau .robot.dernier-deplace');
	var selection = getRobotSelectionne();
	if (selection != null) {
		var index = Array.prototype.indexOf.call(L, selection);
		var prochainIndex = (index + 1) % L.length;
		selectionnerRobot(L[prochainIndex]);
	} else {
		selectionnerRobot(L[0]);
	}
}

// selection du robot de la couleur donnee
function selectionnerRobotCouleur(couleur) {
	var robotElement = document.querySelector('#plateau .robot.' + couleur + ':not(.deplace), #plateau .robot.' + couleur + '.dernier-deplace');
	if (robotElement != null) {
		selectionnerRobot(robotElement);
	}
}

// deplacer un robot dans une direction donnee (touches directionnelles)
function deplacerRobotDirection(direction) {
	var selection = getRobotSelectionne();
	var destination = document.querySelector('#plateau .destination-' + direction);
	if (selection != null && destination != null) {
		deplacerRobot(selection, destination);
	}
}

// fonction appelee lors de l'appui sur une touche du clavier
function appuiTouche(e) {
	switch (e.keyCode || e.charCode) {
		case 82: // R
		recommencer();
		e.preventDefault();
		break;
	
		case 32: // espace
		selectionnerRobotSuivant();
		e.preventDefault();
		break;
		
		case 37: // gauche
		deplacerRobotDirection('g');
		e.preventDefault();
		break;
		
		case 38: // haut
		deplacerRobotDirection('h');
		e.preventDefault();
		break;
		
		case 40: // bas
		deplacerRobotDirection('b');
		e.preventDefault();
		break;
		
		case 39: // droite
		deplacerRobotDirection('d');
		e.preventDefault();
		break;
	}
}

function getToucheTactile(robotElement) {
	return document.querySelector('.bouton.' + getCouleur(robotElement));
}

// ajoute les evenements sur les touches pour ecran tactile
function ajouterTouchesTactiles() {
	document.querySelector('.fleche.h').addEventListener('touchstart', clicToucheTactileH);
	document.querySelector('.fleche.g').addEventListener('touchstart', clicToucheTactileG);
	document.querySelector('.fleche.d').addEventListener('touchstart', clicToucheTactileD);
	document.querySelector('.fleche.b').addEventListener('touchstart', clicToucheTactileB);
	
	document.querySelector('.bouton.blue'  ).addEventListener('touchstart', clicToucheTactileBlue);
	document.querySelector('.bouton.green' ).addEventListener('touchstart', clicToucheTactileGreen);
	document.querySelector('.bouton.red'   ).addEventListener('touchstart', clicToucheTactileRed);
	document.querySelector('.bouton.yellow').addEventListener('touchstart', clicToucheTactileYellow);
}

// supprime les evenements sur les touches pour ecran tactile
function supprimerTouchesTactiles() {
	document.querySelector('.fleche.h').removeEventListener('touchstart', clicToucheTactileH);
	document.querySelector('.fleche.g').removeEventListener('touchstart', clicToucheTactileG);
	document.querySelector('.fleche.d').removeEventListener('touchstart', clicToucheTactileD);
	document.querySelector('.fleche.b').removeEventListener('touchstart', clicToucheTactileB);
	
	document.querySelector('.bouton.blue'  ).removeEventListener('touchstart', clicToucheTactileBlue);
	document.querySelector('.bouton.green' ).removeEventListener('touchstart', clicToucheTactileGreen);
	document.querySelector('.bouton.red'   ).removeEventListener('touchstart', clicToucheTactileRed);
	document.querySelector('.bouton.yellow').removeEventListener('touchstart', clicToucheTactileYellow);
}

function clicToucheTactileH() {
	deplacerRobotDirection('h');
}

function clicToucheTactileG() {
	console.log('G');
	deplacerRobotDirection('g');
}

function clicToucheTactileD() {
	deplacerRobotDirection('d');
}

function clicToucheTactileB() {
	deplacerRobotDirection('b');
}

function clicToucheTactileBlue() {
	selectionnerRobotCouleur('blue');
}

function clicToucheTactileGreen() {
	selectionnerRobotCouleur('green');
}

function clicToucheTactileRed() {
	selectionnerRobotCouleur('red');
}

function clicToucheTactileYellow() {
	selectionnerRobotCouleur('yellow');
}

// ajoute l'evenement touche appuyee
function ajouterTouches() {
	document.addEventListener('keydown', appuiTouche);
	ajouterTouchesTactiles();
}

// supprime l'evenement touche appuyee
function supprimerTouches() {
	document.removeEventListener('keydown', appuiTouche);
	supprimerTouchesTactiles();
}

// ajoute les evenements swipe sur le plateau
function ajouterSwipe() {
	var table = document.getElementById('plateau');
	util.addSwipe(table, 'u', function() {
		alert('swipe u');
	});
	util.addSwipe(table, 'l', function() {
		alert('swipe l');
	});
	util.addSwipe(table, 'd', function() {
		alert('swipe d');
	});
	util.addSwipe(table, 'r', function() {
		alert('swipe r');
	});
}

// supprime les evenements swipe
function supprimerSwipe() {
	var table = document.getElementById('plateau');
	util.removeSwipe(table, 'u');
	util.removeSwipe(table, 'l');
	util.removeSwipe(table, 'd');
	util.removeSwipe(table, 'r');
}

// reinitialise les positions initiales des robots
function reinitialiserRobots() {
	var L = document.querySelectorAll('#plateau .robot, #boutons .bouton');
	for (var i = 0; i < L.length; i++) {
		[
			'deplace',
			'dernier-deplace',
			'selection'
		].forEach(function(class_) {
			util.removeClass(L[i], class_);
		});
		if (util.hasClass(L[i], 'robot')) {
			util.moveTo(L[i], getCase(L[i].getAttribute('data-ligne-origine'), L[i].getAttribute('data-colonne-origine')));
		}
	}
}

// recommencer la partie
function recommencer() {
	proposition.length = 0;
	masquerCasesAccessibles();
	supprimerTraces();
	reinitialiserRobots();
	supprimerClicRobots();
	supprimerClicDestinations();
	supprimerTouches();
	ajouterClicRobots();
	ajouterTouches();
}

// renvoie le nombre de mouvements pour une proposition donnee
function getNombreMouvements(proposition) {
	return proposition.filter(function(p) {
		return p.command == 'move';
	}).length;
}

// affiche le score d'une solution donnee
function afficherScore(solution) {
	var scoreElement = document.querySelector('#lesParticipants li[data-nom="' + solution.player + '"] .score');
	var score = getNombreMouvements(solution.proposition);
	scoreElement.innerHTML = '(' + score + ' mouvements)';
	scoreElement.setAttribute('data-score', score);
}

// affiche le gagnant de la partie
function afficherGagnant() {
	var L = document.querySelectorAll('#lesParticipants span[data-score]');
	var imin = 0;
	for (var i = 1; i < L.length; i++) {
		if (parseInt(L[i].getAttribute('data-score')) < parseInt(L[imin].getAttribute('data-score'))) {
			imin = i;
		}
	}
	util.addClass(L[imin], 'gagnant');
}

// affiche/affiche le panneau lateral en touch
function afficherMasquerInfosTouch() {
	if (util.hasClass(document.body, 'touch')) {
		var infos = document.getElementById('infos');
		if (infos.style.display == 'block') {
			masquerInfosTouch();
		} else {
			afficherInfosTouch();
		}
	}
}

// masque le panneau touch
function masquerInfosTouch() {
	if (util.hasClass(document.body, 'touch')) {
		var infos = document.getElementById('infos');
		infos.style.display = 'none';
	}
}

// affiche le panneau touch
function afficherInfosTouch() {
	if (util.hasClass(document.body, 'touch')) {
		var infos = document.getElementById('infos');
		infos.style.display = 'block';
		
		var etapes = 10;
		var duree = 150;
		
		var left = -80;
		infos.style.left = left + '%';
		var deplacer = function() {
			left += 80 / etapes;
			if (left >= 0) {
				left = 0;
				clearInterval(iv);
			}
			infos.style.left = left + '%';
		};
		var iv = setInterval(deplacer, duree / etapes);
	}
}


