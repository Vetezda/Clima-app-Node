require('dotenv').config();
require('colors');
const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquirer")
const Busquedas = require('./models/busquedas');

//console.log(process.env.MAPBOX_KEY);

const main = async() => {

    const busquedas = new Busquedas();

    let opt;

    do {

        opt = await inquirerMenu();

        switch (opt) {
            case 1:
                //Mostrar mensaje: pregunta por nombre de la ciudad
                const ciudadPorBuscar = await leerInput('Ciudad: ');

                //Buscar ciudades o  lugares  con tal nombre
                const lugaresEncontrados = await busquedas.ciudades( ciudadPorBuscar );

                //Seleccionar lugar
                const id = await listarLugares(lugaresEncontrados);
                if ( id === '0' ) continue;

                const lugarSeleccionado = lugaresEncontrados.find( lugar => lugar.id === id);

                busquedas.agregarLugarAHistorial( lugarSeleccionado.nombre );

                //clima
                const clima = await busquedas.climaPorLugar( lugarSeleccionado.lat, lugarSeleccionado.lng );

                //Mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad: ', lugarSeleccionado.nombre);
                console.log('Lat: ', lugarSeleccionado.lat);
                console.log('Lng: ', lugarSeleccionado.lng);
                console.log('Temperatura: ', clima.temp);
                console.log('Mínima: ', clima.min);
                console.log('Máxima: ', clima.max);
                console.log('descripción: ', clima.description);
                break;

            case 2:
                busquedas.historialCapitalizado.forEach( (lugar, i) => {
                    const idx = `${ i + 1 }`.green;
                    console.log(`${idx} ${lugar}`)
                });

            break;
        }

        if ( opt !== 0) await pausa();

        
    } while ( opt !== 0 );

}

main();