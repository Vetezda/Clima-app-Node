const inquirer = require('inquirer');
require('colors');

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: '1. Buscar ciudad'
            },
            {
                value: 2,
                name: '2. Historial'
            },
            {
                value: 0,
                name: '0. Salir'
            }
        ]

    }
];


const inquirerMenu = async() => {
    
    console.clear();
    console.log('==========================='.green);
    console.log('   Seleccione una opción');
    console.log('==========================='.green);
    
    const { opcion } = await inquirer.prompt(preguntas);
    
    return opcion;
}

const leerInput = async( message ) => {

    const preguntas = [
        {
            type: 'input',
            name: 'descripcion',
            message,
            validate( value ){
                if ( value.length === 0 ) {
                    return 'Por favor ingrese un valor';
                }
                return true;
            }
        }
    ];
    
    const { descripcion } = await inquirer.prompt(preguntas);
    return descripcion;

}




const pausa = async() => {
    
    const pregunta = [
        {
            type: 'type',
            name: 'opcion',
            message: 'Presione ENTER para continuar',
        }
    ];

    console.log('\n')
    const { opcion } = await inquirer.prompt(pregunta);

}

const listarLugares = async( lugares = [] ) => {

    const choices = lugares.map( ( lugar, i ) => {

        const idx = `${ i + 1 }.`.green;

        return {
            value: lugar.id,
            name: `${ idx } ${ lugar.nombre }`
        }

    });

    choices.unshift({
        value: '0',
        name: '0.'.green + 'Cancelar y regresar'
    });

    const pregunta = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione un lugar',
            choices
        }
    ];

    const { id } = await inquirer.prompt(pregunta);
    
    return id;
}


const confirmar = async( message ) => {

    const pregunta = [
        {
            type: 'confirm',//confirm toma un valor booleano dependiendo de nuetra respuesta Y/n 
            name: 'ok',
            message
        }
    ];
    
    const { ok } = await inquirer.prompt(pregunta);
    return ok;
}


const mostrarListadoChecklist = async( tareas = [] ) => {

    const choices = tareas.map( ( tarea, i ) => {

        const idx = `${ i + 1 }.`.green;

        return {
            value: tarea.id,
            name: `${ idx } ${ tarea.descripcion }`,
            checked: (tarea.completadoEN) ? true : false
        }

    });

    const pregunta = [
        {
            type: 'checkbox',
            name: 'ids',
            message: 'Selecciones',
            choices
        }
    ];

    const { ids } = await inquirer.prompt(pregunta);
    
    return ids;
}
module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoChecklist
}
