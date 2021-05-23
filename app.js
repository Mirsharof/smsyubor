const express= require('express');
const bodyParser= require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

// init nexmo
const nexmo = new Nexmo({
	apiKey:'910af226',
	apiSecret:'ZVCvull4z62Nd1zI'
},{degub:true});

 // init express

 const app = express();

//  Temppdte engine setup
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// Public folder setup
app.use(express.static(__dirname + '/public' )) 

//body parser midlleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Index route
app.get('/',(req, res)=> {
	res.render('index')
});
//catch drom submit 

app.post('/',(req, res)=>{
	// res.send(req.body);
	// console.log(req.body);
	const number= req.body.number;
	const text= req.body.text;

	nexmo.message.sendSms(
		'12034848525', number, text, {type:'unicode'}, 
		(err, responseData)=>{
			if(err){
				console.log(err); 
			}else{
				console.dir(responseData);
				// get data from response
				const data ={
					id:responseData.messages[0]['message-id'],
					number:responseData.messages[0]['to']
				}
				// emit to th client

				io.emit('smsStatus', data);
			}
		}
	)

});
// Defined port

const port= 3000;

// start Server
const server = app.listen(port, ()=> console.log(`serveer started on port ${port}`) );

const io = socketio(server);
io.on('connection', (socket)=>{
	console.log('ulandi');
	io.on('disconnect',()=>{
		console.log("aloqa yo'q");
	})
})