let portNum                                  = 3000;
let fs                                       = require('fs');
let express                                  = require('express')
let socketIO                                   = require('socket.io');

let app                                      = express();
let io;
let server;

let startDate = new Date(2024,4,5,9,0)
let hourMin = [9, 30]
let dates = []
console.log(startDate.getHours)
for(let i = 0; i < 16; i++){
    if(hourMin[1] === 0){
        hourMin[1] += 30;
    }else if(hourMin[1] === 30){
        hourMin[1] = 0;
        hourMin[0]++;
    }
    startDate.setHours(hourMin[0])
    startDate.setMinutes(hourMin[1])
    dates.push(startDate)
}
console.log(dates)


server = app.listen(portNum, function () {

    console.log(`Starting on port ${portNum}`)

    app.use(express.static('public'))

    io = socketIO(server);

    io.on('connection', (socketIO) => {

        socketIO.on('js', function (data) {
            try{
                let msg = JSON.parse(data);

                switch (msg.type) {
                    case'updateData':
                        switch(msg.updateType){
                            case 'services': // Services data updates
                                fs.writeFile('public/services.json', JSON.stringify(msg.data), function (err) {
                                    if (err) throw err;
                                    console.log('Saved!');
                                });
                                break;
                            case 'appointments': // Appointments data updates
                                fs.writeFile('public/appointments.json', JSON.stringify(msg.data), function (err) {
                                    if (err) throw err;
                                    console.log('Saved!');
                                });
                                break;
                                default:
                                break;
                        }

                        break;
                    default:
                        break;
                }

            }catch (e) {
                console.log(e.message);

            }
        })

    })
})









