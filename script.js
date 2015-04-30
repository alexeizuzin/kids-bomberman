
// Вначале задаем начальные значения данных

// Координаты игрока, хранятся в ассоциативном массиве (объекте)
igrok = {top: 0, left: 0}

// Координаты бомбы
bomba = {top: 0, left: 0}

// Метка - тикает ли таймер бомбы в данный момент
// false - ложь, не тикает
bombTimer = false;

// Координаты двери
dver = {top: 0, left: 0}

// Счетчик монеток
sobranoMonet = 0;

// Координаты монет
// это список из 3 элементов
// элементы - ассоциативные массивы (объекты) с координатами каждой монеты
monetki = [
	{top: 0, left: 0},
	{top: 0, left: 0},
	{top: 0, left: 0}
]

// Координаты семи камней
// тоже массив (список) ассоциативных массивов (объектов) с координатами
kamni = [
	{top: 0, left: 0},
	{top: 0, left: 0},
	{top: 0, left: 0},
	{top: 0, left: 0},
	{top: 0, left: 0},
	{top: 0, left: 0},
	{top: 0, left: 0}
]

// Запуск функции startProgram в момент после полной загрузки веб-страницы
window.onload = startProgram;

// стартовая функция
function startProgram(){

	// при нажатии кнопок клавиатуры, запускаем программу keyProgram
	window.onkeydown = keyProgram;

	// расставлем по игровому полю монетки
	rasstanovkaMonet();
	// затем дверь
	ustanovkaDveri();
	// затем расставляем оставшиеся камни
	rasstanovkaDrugihKamnei();
}

// функция реагирует на нажатия клавиатуры
// в эту функцию автоматически передаются данные о нажатии в переменную 'e'
function keyProgram(e){

	// вверх
    if (e.keyCode == 38){
    	// при нажатии нужной стрелки запускаем функцию движения игрока
    	movePlayer(0, -50)
    }

	// вниз
    if (e.keyCode == 40){
    	movePlayer(0, 50)
    }

	// влево
    if (e.keyCode == 37){
    	movePlayer(-50, 0)
    }

	// вправо
    if (e.keyCode == 39){
    	movePlayer(50, 0)
    }

	// пробел
    if (e.keyCode == 32 || e.charCode == 32){
    	// принажатии пробела проверяем, не запущен ли уже счетчик бомбы
    	if (bombTimer == false){
    		// и тогда устанавиваем бомбу
    		setBomb();
    	}
    }
    console.log(e)
}

// функция для перемещения игрока по полю
// принимает две переменные - это расстояние, на которое надо переместить игрока
//  x - по горизонтали (50 двигает вправо, -50 влево)
//  y - по вертикали (50 двигает вниз, а -50 вверх)
function movePlayer(x, y){
	// запоминаем новое значение координат
	igrok.left = igrok.left + x;
	igrok.top = igrok.top + y;

	// проверяем, свободна ли ячейка для движения игрока
	if(mestoSvobodno()){
		// меняем координаты у html-элемента
		document.getElementById('id_igrok').style.left = igrok.left;
		document.getElementById('id_igrok').style.top = igrok.top;
		// берем монету (которой может и не быть)
		vziatMonetu();
		// сравниваем координаты игрока и двери
		if (igrok.left == dver.left) {
			if (igrok.top == dver.top) {
				// если и top и left совпадают, значит игрок вошел в дверь
				alert('Pobeda!');
			};
		};
	} else {
		// если место не свободно, откручиваем координаты игрока обратно
		igrok.left = igrok.left - x;
		igrok.top = igrok.top - y;
	}
}

// функция для проверки свободно ли место для игрока
// возвращает true, если свободно
// false, если занято
function mestoSvobodno(){
	// проверим, не выходят ли координаты за рамки поля
	if(igrok.left > 450){ return false }
	if(igrok.left < 0){ return false }
	if(igrok.top > 450){ return false }
	if(igrok.top < 0){ return false }

    // поочередно проверяем каждый камень
	for (x in kamni) {
		// если по вертикали камень и игрок равны
		if(kamni[x]['top'] == igrok.top){
			// если по горизонтали камень и игрок равны
			if(kamni[x]['left'] == igrok.left){
				// функция возвращает false, т.е. ложь
				// место не свободно
				return false;
			}
		}
	};	
	// если проверка пройдена и совпадений не найдено, значит место свободно
	// и функция возвращает true, "верно"
	return true
}	

// функция установки бомбы
function setBomb(){
	// устанавливаем координаты бомбы такими же как в данный момент у игрока
	bomba.left = igrok.left;
	bomba.top = igrok.top;
	// затем берем html-элемент бомбы и меняем его координаты
	document.getElementById('id_bomba').style.left = igrok.left;
	document.getElementById('id_bomba').style.top = igrok.top;
	// затем показываем его
	document.getElementById('id_bomba').style.display = 'block';
	// в этой переменной отмечаем, что бомба установлена и включен обратный отсчет
	// это надо для того, чтобы игрок не поставил новой бомбы до взрыва
	bombTimer = true;
	// запускаем таймер: 3 секунды
	setTimeout(bum, 3000);
}

// эта функция рисует взрыв
function bum(){
	// окрашиваем бомбу в красный
	document.getElementById('id_bomba').style.background = 'red';

	// позиционируем горизонтальную полосу взрыва
	document.getElementById('id_vzryv_horiz').style.left = bomba.left - 50;
	document.getElementById('id_vzryv_horiz').style.top = bomba.top + 15;
	document.getElementById('id_vzryv_horiz').style.display = 'block';

	// теперь вертикальную
	document.getElementById('id_vzryv_vert').style.left = bomba.left + 15;
	document.getElementById('id_vzryv_vert').style.top = bomba.top - 50;
	document.getElementById('id_vzryv_vert').style.display = 'block';

	// через 300 миллисекунд запустится очистка взрыва
	setTimeout(ochistka, 300);
}

// убираем взрыв и уничтожаем камни и игрока, если они в зоне взрыва
function ochistka(){
	// снимаем метку, что установлена бомба
	bombTimer = false;

	// прячем элементы и восстанавливаем цвет бомбы
	document.getElementById('id_bomba').style.display = 'none';
	document.getElementById('id_bomba').style.background = 'black';
	document.getElementById('id_vzryv_horiz').style.display = 'none';
	document.getElementById('id_vzryv_vert').style.display = 'none';

	// проверяем координаты каждого камня
	for(x in kamni){
		// если отступ сверху у камня меньше, чем у ячейки под бомбой
		if(kamni[x]['top'] < bomba.top + 51){
			// и если отступ  сверху камня больше, чем у ячейки над бомбой
			if(kamni[x]['top'] > bomba.top - 51){
				// значит камень находится на высоте взрыва

				// проверим теперь, находится ли он на одной вертикали с бомбой
				if(kamni[x]['left'] == bomba.left){
					//значит камень попал в зону взрыва - убираем его

					// Далее вычисляем уникальный id камня
					// Функция parseInt(x) превращает текст "5" в цифру 5
					// - если не превращать текстовую цифру в обыкновенную, будут складываться не цифры
					// а строки: 1 + "1" = "11"
					// Единицу прибавляем потому, что камни у нас в html'е имеют номера от единицы
					// 'id_kamen_01', 'id_kamen_02', 'id_kamen_03' ...
					// а в массиве ключи (индексы) элементов начинаются от 0.
					idKamen = 'id_kamen_0' + (1 + parseInt(x));
					// находим нужный камень и сдвигаем его за пределы поля
					document.getElementById(idKamen).style.top = 550;

					// не забываем сдвигать и координаты в списке координат камней
					kamni[x]['top'] = 550;
				}
			}
		}
		// тоже самое для совпадения по горизонтали
		if(kamni[x]['left'] < bomba.left + 51){
			if(kamni[x]['left'] > bomba.left - 51){
				if(kamni[x]['top'] == bomba.top){
					idKamen = 'id_kamen_0' + (1 + parseInt(x));
					document.getElementById(idKamen).style.left = 550;
					kamni[x]['left'] = 550;
				}
			}
		}
	};

    // а теперь точно также проверим, не попал ли игрок в зону взрыва
	if(igrok.top < bomba.top + 51){
		if(igrok.top > bomba.top - 51){
			if(igrok.left == bomba.left){
				alert('Igrok ubit!');
			}
		}
	}

	if(igrok.left < bomba.left + 51){
		if(igrok.left > bomba.left - 51){
			if(igrok.top == bomba.top){
				alert('Igrok ubit!');
			}
		}
	}

}

// эта функция возвращает случайную координату с шагом 50 (0, 50, 100 ...)
function randomCoordinate(){
	return parseInt(Math.random()*10)*50;
}	

// эта функция расставляет монеты и накрывает их камнями
function rasstanovkaMonet(){
	// перебираем список объектов (массив ассоциативных массивов)
	for (x in monetki) {
		// запоминаем случайные координаты
		randTop = randomCoordinate();
		randLeft = randomCoordinate();
		// записываем координаты в соответствующий элемент массива
		monetki[x]['top'] = randTop;
		monetki[x]['left'] = randLeft;

		// подготавливаем id нужного html-элемента
		id = 'id_moneta_0' + (1 + parseInt(x));
		// позиционируем монету
		document.getElementById(id).style.top = randTop;
		document.getElementById(id).style.left = randLeft;
		// показываем монету
		document.getElementById(id).style.display = 'block';

		// Поскольку у нас 3 монетки, то при перебора массива с монетами
		// их ключи будут 0, 1 и 2
		// Мы используем эти же индексы камней: первые три камня поместим над монетками

		// записываем координаты в массив
		kamni[x]['top'] = randTop;
		kamni[x]['left'] = randLeft;

		// готовим id камня
		idKamen = 'id_kamen_0' + (1 + parseInt(x));
		// позиционируем html-элемент
		document.getElementById(idKamen).style.top = randTop;
		document.getElementById(idKamen).style.left = randLeft;
		// показываем
		document.getElementById(idKamen).style.display = 'block';

	};
}

// эта функция проверяет, совпадают ли координаты игрока с координатами монеток
function vziatMonetu(){
	// перебираем монеты
	for (x in monetki) {

		// если отступ сверху совпадает
		if(monetki[x]['top'] == igrok.top){
			// и если отступ слева сопадает
			if(monetki[x]['left'] == igrok.left){
				// готовим id
				id = 'id_moneta_0' + (1 + parseInt(x));
				// позицыонируем html-элемент вне поля
				document.getElementById(id).style.left = 600;
				// и координату в массиве тоже исправляем
				monetki[x]['left'] = 600;

				// увеличиваем на единицу количество монет
				sobranoMonet++;

				// записываем в html-элемент нужную цифру
				document.getElementById('id_monetok').innerHTML = sobranoMonet;
			}
		}
	};
}

// функция устанавливает дверь и накрывает камнем 
// первые три камня накрыли монеты, четвертый накроет дверь
function ustanovkaDveri(){
	// запоминаем случайные координаты
	randTop = randomCoordinate();
	randLeft = randomCoordinate();
	// записываем координаты двери в ассоциативный массив dver
	dver.left = randLeft;
	dver.top = randTop;

	// двигаем html-элемент в нужное место
	document.getElementById('id_dver').style.top = randTop;
	document.getElementById('id_dver').style.left = randLeft;
	// затем показываем
	document.getElementById('id_dver').style.display = 'block';

	// четвертый камень: записываем координаты в массив
	kamni[3]['top'] = randTop;
	kamni[3]['left'] = randLeft;

	// id вычислять не нужно, и так знаем
	idKamen = 'id_kamen_04';
	// позиционируем html-элемент и показываем
	document.getElementById(idKamen).style.top = randTop;
	document.getElementById(idKamen).style.left = randLeft;
	document.getElementById(idKamen).style.display = 'block';
}

// функция расстановки оставшихся камней (5, 6 и 7)
function rasstanovkaDrugihKamnei(){
	// перебираем все элементы списка камней
	for (x in kamni) {
		// если ключ (идентификатор) больше 3
		if (x > 3) {
			// запоминаем случайные координаты
			randTop = randomCoordinate();
			randLeft = randomCoordinate();

			// записываем в массив
			kamni[x]['top'] = randTop;
			kamni[x]['left'] = randLeft;

			// вычисляем id нужного html-элемента, позиционируем и показываем
			idKamen = 'id_kamen_0' + (1 + parseInt(x));
			document.getElementById(idKamen).style.top = randTop;
			document.getElementById(idKamen).style.left = randLeft;
			document.getElementById(idKamen).style.display = 'block';
		};

	};
}