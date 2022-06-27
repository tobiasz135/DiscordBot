var express = require("express");
var app = express();
var http = require("http");
var https = require("https");
app.use(express.static("./public"));
const nodemailer = require("nodemailer");
var http_server = http.createServer(app).listen(8484);
var http_io = require("socket.io")(http_server);
const dotenv = require('dotenv');
dotenv.config();

enabled = 1
gamealive = true;


const { Client, Intents, Modal, Channel, MessageEmbed } = require('discord.js');

/*const exampleEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Some title')
	.setURL('https://discord.js.org/')
	.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
	.setDescription('Some description here')
	.setThumbnail('https://i.imgur.com/AfFp7pu.png')
	.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	.addField('Inline field title', 'Some value here', true)
	.setImage('https://i.imgur.com/AfFp7pu.png')
	.setTimestamp()
	.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });*/

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });


// When the client is ready, run this code (only once)
client.once('ready', async () => {
  //const channel = await client.channels.fetch('796126423453663315');
	console.log('Ready!');
  //channel.send("@everyone Hello world");
});

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);


const options = {
  hostname: 'thedrinkitgame.pl',
  port: 443,
  path: '/',
  method: 'GET',
};

setInterval(async () => {
  const channel = await client.channels.fetch('976106571924897843');

  const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`);
    if(res.statusCode != 200 && gamealive){
      const exampleEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Gra umarła')
      .setURL('https://thedrinkitgame.pl/')
      //.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
      .setDescription('Zrób coś kurła')
      .setThumbnail('https://cdn.discordapp.com/attachments/796126423453663315/960122476040429568/DrinkIt_new.png')
      //.addFields(
      //  { name: 'Regular field title', value: 'Some value here' },
      //  { name: '\u200B', value: '\u200B' },
      //  { name: 'Inline field title', value: 'Some value here', inline: true },
      //  { name: 'Inline field title', value: 'Some value here', inline: true },
      //)
      //.addField('Inline field title', 'Some value here', true)
      //.setImage('https://i.imgur.com/AfFp7pu.png')
      .setTimestamp()
      //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });
      gamealive = false;
      channel.send({ embeds: [exampleEmbed] });
    }
    else if(res.statusCode == 200 && !gamealive){
      const exampleEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Gra ożyła')
      .setURL('https://thedrinkitgame.pl/')
      .setThumbnail('https://cdn.discordapp.com/attachments/796126423453663315/960122476040429568/DrinkIt_new.png')
      .setDescription('Gratuluję')
      .addFields(
        { name: 'Response status', value: res.statusCode.toString() })
      .setTimestamp()
      gamealive = true;
      channel.send({ embeds: [exampleEmbed] });
    }
    
  });
  
  req.on('error', error => {
    console.error(error);
  });
  
  req.end();
},60 * 1000)

http_io.on("connection", async function(httpsocket){
  const channel = await client.channels.fetch('976106571924897843');
  console.log("new user");
    httpsocket.on('python-message', function(fromPython){
        httpsocket.broadcast.emit('message', fromPython);
        //console.log(fromPython);
        var count = Object.keys(fromPython).length;
        //console.log(count);
        for(i = 0; i < count; i++){
          item = fromPython[i];
          if(item["items_available"] != 0 && enabled){
            console.log(item["display_name"] + " available!");
            const exampleEmbed = new MessageEmbed()
              //.setColor('#0099ff')
              .setTitle(item["display_name"])
              //.setURL('https://thedrinkitgame.pl/')
              .setDescription('Szybko bo ktoś nam zaraz znowu zapierdoli')
              .setTimestamp()
              .addFields({ name: 'Dostępna ilość', value: item["items_available"].toString() })

            if(item["display_name"] === "Starbucks Łódź Piotrkowska (Na koniec dnia)")
              exampleEmbed.setColor("#32a852")
            else
              exampleEmbed.setColor("#96651a")
            
            channel.send({ embeds: [exampleEmbed] });
            //channel.send(item["display_name"] + " dostępny w TGTG!");
            //send_notification(item);
        }
      }
    })
})
