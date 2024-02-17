// Obtener el elemento de entrada
const inputId = document.getElementById('idInput');
const weightInput = document.getElementById('weightInput');
const heightInput = document.getElementById('heightInput');
const btnSend = document.getElementById('btnSend');
const idError = document.getElementById('idError');
const weightError = document.getElementById('weightError');
const heightError = document.getElementById('heightError');
const interpretacionIMC = document.getElementById('interpretacionIMC');



//Inicializamos atributos
weightInput.setAttribute('disabled', true);
heightInput.setAttribute('disabled', true);
let registros = JSON.parse(localStorage.getItem('registrosIMC')) || [];
console.log(registros);

//Mostrar registros
function mostrarRegistros(id){
	// Ocultar imagen
	let img = document.getElementById('img');
	img.style.display = 'none';
	
	let tabla = document.getElementById('tablaRegistros');
	let tablaHTML = `
					<tr class="header-table">
							<td>Id</td>
							<td>Weight</td>
							<td>Height</td>
							<td>IMC value</td>
							<td>Date</td>
					</tr>
	`;
	//Mostramos los 10 ultimos registros del id seleccionado
	let registrosTabla = registros.filter(registro => registro.id == id);
	registrosTabla = registrosTabla.slice(0,10);
	registrosTabla.forEach(registro => {
		if(registro.id == id){
			tablaHTML += `
					<tr>
							<td>${registro.id}</td>
							<td>${registro.weight}</td>
							<td>${registro.height}</td>
							<td>${registro.imc}</td>
							<td>${registro.date}</td>
					</tr>
			`;
		}
		console.log(registro);
	});
	
	
	tabla.innerHTML = tablaHTML;
}

//Función para interpretar el IMC
function interpretarIMC(imc){
	let text = '';
	if(imc < 18.5){
		text = 'Peso bajo';
		interpretacionIMC.style.color = 'blue';
	}
	else if(imc >= 18.5 && imc < 24.9){
		text = 'Peso normal';
		interpretacionIMC.style.color = 'green';
	}
	else if(imc >= 25 && imc < 29.9){
		text = 'Sobrepeso';
		interpretacionIMC.style.color = 'orange';
	}
	else if(imc >= 30 && imc < 34.9){
		text = 'Obesidad grado 1';
		interpretacionIMC.style.color = 'red';
	}
	else if(imc >= 35 && imc < 39.9){
		text = 'Obesidad grado 2';
		interpretacionIMC.style.color = 'pink';
	}
	else if(imc >= 40){
		text = 'Obesidad grado 3';
		interpretacionIMC.style.color = 'purple';
	}
	interpretacionIMC.innerText = text;
}

// Agregar un listener para el evento 'input'
inputId.addEventListener('input', function() {
  // Obtener el valor actual del campo de entrada
  let valor = inputId.value;

  // Eliminar cualquier caracter no numérico
  valor = valor.replace(/\D/g, '');

  // Limitar la longitud del valor a, por ejemplo, 10 caracteres
  const maxLength = 10;
  valor = valor.slice(0, maxLength);
	if (valor.length >= 8) {
		weightInput.removeAttribute('disabled');
		heightInput.removeAttribute('disabled');
	}else{
		weightInput.setAttribute('disabled', true);
		heightInput.setAttribute('disabled', true);
	}

  // Actualizar el valor del campo de entrada
  inputId.value = valor;
});

weightInput.addEventListener('input', function() {
	// Obtener el valor actual del campo de entrada
	let valor = weightInput.value;

	// Eliminar cualquier caracter no numérico
	valor = valor.replace(/\D/g, '');

	// Limitar la longitud del valor a, por ejemplo, 3 caracteres
	const maxLength = 3;
	valor = valor.slice(0, maxLength);

	// Actualizar el valor del campo de entrada
	weightInput.value = valor;
});

heightInput.addEventListener('input', function() {
  // Obtener el valor actual del campo de entrada de estatura
  let valor = heightInput.value;

  // Reemplazar cualquier caracter no numérico o punto decimal adicional
  valor = valor.replace(/[^\d.]/g, '');

  // Si hay más de un punto decimal, eliminar los adicionales
  const parts = valor.split('.');
  if (parts.length > 2) {
    valor = parts[0] + '.' + parts.slice(1).join('');
  }

  // Actualizar el valor del campo de entrada de estatura
  heightInput.value = valor.slice(0, 4);
});


btnSend.addEventListener('click', function() {
	//Realizamos las últimas validaciones

	//Si el id es menor a 8 o mayor a 10 se tomará como inválido
	if (inputId.value.length < 8 || inputId.value.length > 10) {
		idError.innerText = "El id debe tener entre 8 y 10 caracteres";
		return;
	}else{
		idError.innerText = "";
	}

	//Si el peso es mayor a 300 o menor a 3 se tomará como inválido
	if (weightInput.value < 3 || weightInput.value > 300) {
		weightError.innerText = "El peso debe ser mayor a 3 y menor a 300";
		return;
	}else{
		weightError.innerText = "";
	}

	//Si la estatura es mayor a 3 o menor a 0.5 se tomará como inválido
	if (heightInput.value < 0.5 || heightInput.value > 3) {
		heightError.innerText = "La estatura debe ser mayor a 0.5 y menor a 3";
		return;
	}else{
		heightError.innerText = "";
	}

	//Si todo está correcto se procesará la información
	const fecha = new Date();

  // Obtener el día, mes y año
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Se suma 1 porque los meses van de 0 a 11
  const año = fecha.getFullYear();

  // Formatear la fecha como "DD/MM/AAAA"
  const fechaFormateada = `${dia}/${mes}/${año}`;
	let height = heightInput.value;
	let weight = weightInput.value;
	let imc = weight / (height* height);
	imc = imc.toFixed(2);
	let registro = {
		id: inputId.value,
		weight: weight,
		height: height,
		imc: imc,
		date: fechaFormateada
	}

	registros.push(registro);
	localStorage.setItem('registrosIMC', JSON.stringify(registros));
	mostrarRegistros(inputId.value);
	interpretarIMC(imc);
});

