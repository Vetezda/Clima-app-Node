const fs = require('fs');
const axios = require('axios');

class Busquedas {

    historial = [];
    dbPath = './db/database.json';

    constructor(){
        this.leerDB();
    }

    get historialCapitalizado(){
        return this.historial.map( lugar => {

            let palabras = lugar.split(' ');//se crea un arreglo de palabras, cada elemento se corta por lo espacios en blanco
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));//tomamos la primera lletra o posision[0] de cada elemento y la convertimos en mayuscula, con substring pegamos el resto de palabra

            return palabras.join(' ');//unismos las palabra separandolas con un espacio en blanco para darle forma a la oracion

        });
    }

    get paramsMapbox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'language': 'es'
        }
    }

    
    
    async ciudades( lugar = '' ) {
        
        try {
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox
            });
            
            const resp = await instance.get();      
            
            return resp.data.features.map( lugar => (
                {
                    id: lugar.id,
                    nombre: lugar.place_name,
                    lng: lugar.center[0],
                    lat: lugar.center[1],
                }
                ));
                
            }catch (error) {
                
            }
            
            
            return [];
        }


    get paramsWeather(){
        return {
            'appid': process.env.OPENWEATHER_KEY,
            'lang': 'es',
            'units': 'metric',
        }
    }
        
    async climaPorLugar( lat, lon ) {

        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    ...this.paramsWeather,
                    lat,
                    lon,
                }
            });

            const resp = await instance.get();      

            const { main, weather } = resp.data;

            return {
                description: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }
            
        }catch (error) {
            
        }


        return [];
    }

    agregarLugarAHistorial( lugar = '') {

        if ( this.historial.includes( lugar.toLocaleLowerCase() ) ) {
            return;
        }

        this.historial = this.historial.splice(0,5);//limitamos el historial para que solo tenga 6 espacios

        this.historial.unshift( lugar.toLocaleLowerCase() );

        this.guardarDB();

    };

    guardarDB() {

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ));
    }

    leerDB() {

        if ( !fs.existsSync( this.dbPath ) ){
            return;
        }
        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8'} );
        const data = JSON.parse( info );
    
        this.historial = data.historial
    }


}

module.exports = Busquedas;
