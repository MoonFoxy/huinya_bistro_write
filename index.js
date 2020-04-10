const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch');
const fs = require('fs');
const im = require('imagemagick');
let sessions = new Map();


client.on('ready', () => {
  console.log(`Долбаеб в сети ${client.user.tag}!`);
});
client.on('message', async message  => {
	if(message.author.bot)return;
	if(message.content == "~help"){
		message.channel.send(`***So far the bot has few commands***\n
***Communicate with the bot:*** // text.\n
***Find out information about the domain / ip:*** ~ip url/domain/ip\n
***Statistics about the coronavirus:*** ~coronavirus\n
***Photopizdec:*** ~photopizdec  `);
	}
		if(message.content.startsWith("//")){
					        let message_content = "";

        for(let i = 1; i < message.content.length; i++) {
            if(i > 1) {
                message_content += `${message.content[i]}`;
				console.log(message.content[i])
            }
        }
		if(message_content.length == 0)return;
	    var body_text = {bot: "main", text: message_content, uid: sessions.get(message.author.id)}
		fetch('http://xu.su/api/send', {
        method: 'post',
        body:    JSON.stringify(body_text),
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(json => {
	console.log(sessions.get(message.author.id))
	message.channel.send(json.text)
        sessions.set(message.author.id, json.uid)
     });

	}	
	if(message.content.startsWith("~ip")){
     let args = message.content.slice(3).trim().split(/ +/g);
	 let url;
	 if(args[0].substring(0, 7) == "http://"){
		 url = args[0].slice(7).trim();
	 	} else {
		url = args[0]
	}
	 if(args[0].substring(0, 8) == "https://"){
		 url = args[0].slice(8).trim();
		 
	} else {
		url = args[0]
	}
	 url = url.split('/')[0]

		fetch(`http://ip-api.com/json/${url}`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(json => {
		if(json.status == "success"){
	message.channel.send(`
	Country: ${json.country}.\n
	Region: ${json.regionName}.\n
	City: ${json.city}.
	Timezone: ${json.timezone}.\n
	Ip: ${json.query}.
	`)
		} else {
			message.channel.send("Incorrect Domain/Ip.");
		}
	});

	};
	if(message.content == "~coronavirus"){
		fetch(`https://api.thevirustracker.com/free-api?global=stats`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json())
    .then(json => {
		if(json.stat == "ok"){
		message.channel.send(`[coronavirus statistics]\n
Infected: ${json.results[0].total_cases} | Deaths: ${json.results[0].total_deaths} | Recovered: ${json.results[0].total_recovered} \n
New Cases Today: ${json.results[0].total_new_cases_today} | New Deaths Today: ${json.results[0].total_new_deaths_today} | Affected Countries: ${json.results[0].total_affected_countries}
		`)
		} else {
			message.channel.send('Error Api')
		}
	});
	}
	if(message.content == "~photopizdec"){
const cooldown = new Set();	
if (cooldown.has(message.author.id)) {
	message.channel.send('Cooldown 5 sec.');
 } else {

		let url;
message.attachments.forEach(attachment => {
  url = attachment.url;
});
if(!url){message.channel.send("What should I pizdec?)")
	return;
}
console.log(url)
let request = require('request-promise');

try {
await request.get({
    url: url,
    encoding: null
})
.then(response => {

    try {
      fs.writeFileSync(__dirname+`/photo_download/${message.author.id}.png`, response);
      console.log('Success in writing file')
    } catch (err) {
		message.channel.send('Ошибка');
      return
    }
});
await im.identify(`./photo_download/${message.author.id}.png`, function(err, features){
  if (err) throw err;
if(features.height > 3000|| features.width > 3000){
	message.channel.send("The photo is too big")
	return
}
var xui222 = features.height / 2;
var xui223 = features.width / 2;
im.convert([`./photo_download/${message.author.id}.png`, '-liquid-rescale', `${xui223}x${xui222}`, `./photo/${message.author.id}.png`], function(err, stdout, stderr){
  if (err) throw err

im.resize({
  srcPath: `./photo/${message.author.id}.png`,
  dstPath: `./photo/${message.author.id}.png`,
  width:   features.width,
  height:   features.height
}, function(err, stdout, stderr){
  if (err) throw err;
   message.channel.send("Hit 50%", { files: [`./photo/${message.author.id}.png`] });
});
   
});


 
})
} catch(err) {
	message.channel.send("Ошибка");
}
        cooldown.add(message.author.id);
        setTimeout(() => {

          cooldown.delete(message.author.id);
        }, 5000);
    }
	}
});

client.login('TOKEN');
