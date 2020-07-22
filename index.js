const Discord = require('discord.js');
const Canvas = require('canvas');
const bot = new Discord.Client();
const fs = require('fs');
var xpthreshold = 1000;
let data = {
    userdata: []
}
bot.on('ready', () =>{
    console.log("Bot ready");
});



bot.on('message', async msg => {
    if(msg.author.bot){
        return;
    }
    var name = msg.member.displayName.split("]");
    let currentdata = fs.readFileSync('./userdata.json');
    let parseddata = JSON.parse(currentdata);
    var users = {
        id: []
    }
    for(var i = 0; i < (parseddata.userdata).length; i++){ 
        users.id.push(parseddata.userdata[i].id);
        if(msg.member.user.tag == parseddata.userdata[i].id){
            var xp = (parseddata.userdata[i].xp) + 1;
            var lvl = (parseddata.userdata[i].lvl);
            if(xp >= xpthreshold){
                parseddata.userdata[i].xp = 0;
                xp = 0;
                parseddata.userdata[i].lvl = (lvl) +1;
                lvl = (lvl) + 1;
                try{
                    msg.member.setNickname(("[Lv." + lvl + "] " + name[1]));
                }catch(e){
                    console.log(e);
                }
            }
            console.log(xp);
            parseddata.userdata[i].xp = xp;
            
        }
        data.userdata.push(parseddata.userdata[i]);
    }
    if(!users.id.includes(msg.member.user.tag)){
        xp = 1;
        lvl = 1;
        try{
            msg.member.setNickname(("[Lv." + lvl + "] " + msg.member.displayName));
        }catch(e){
            console.log(e);
        }
        data.userdata.push({id: msg.member.user.tag, xp: 1, lvl: 1});
    }
    let stringjson = JSON.stringify(data, null, 2);
    fs.writeFileSync('./userdata.json', stringjson);
    data = {
        userdata: []
    }
    if(msg.content == "!lvl"){
        const canvas = Canvas.createCanvas(700, 250);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '28px sans-serif';
	      ctx.fillStyle = '#ffffff';
        ctx.fillRect(280, 200, 360, 20);
        ctx.fillText(name[1], canvas.width / 2.5, canvas.height / 1.4);
        ctx.fillText(xp + "/" + xpthreshold + "xp", 520, 180);
        ctx.fillStyle = '#035bff';
        ctx.fillRect(280, 200,(xp/2.7), 20);
        ctx.font = '25px sans-serif';
        ctx.fillText("LEVEL:", 500, 70);
        ctx.font = '45px sans-serif';
        ctx.fillText(lvl, 590, 70);
        ctx.beginPath();
        ctx.arc(125, 125, 100, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        const avatar = await Canvas.loadImage(msg.member.user.displayAvatarURL({ format: 'jpg' }));
        ctx.drawImage(avatar, 25, 25, 200, 200);
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'data.png');
        msg.channel.send(attachment);
    }
    
    
    
    
    
    return;



});


bot.login('Discord api key');
