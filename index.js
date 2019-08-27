const Discord = require('discord.js');
const client = new Discord.Client();
var request = require('request');

client.on('ready', () => {
    console.log('Hazırım.');
    
    var interval = setInterval (function () {
        var channel = client.channels.find(c => c.id === "KANAL ID")
        request(`https://mcapi.xdefcon.com/server/SUNUCU IP ADRESI/full/json`, function (error, response, body) {
            body = JSON.parse(body);
            channel.setName(`Oyuncular: ${body.players} / ${body.maxplayers}`);
            client.user.setGame(`Oyuncular: ${body.players} / ${body.maxplayers}`)
        })
    }, 2 * 1500);

})

client.on("message", message => {
  if (message.content.startsWith("!mcsunucu")){
    let args = message.content.split(" ").slice(1).join(' ');
    if(!args) return message.reply("İP yazmalısın.")
    let ip = args.replace("!mcsunucu ", "");

    request(`https://mcapi.xdefcon.com/server/${ip}/full/json`, function (error, response, body) {
      if (error) return console.error(error);
      
      body = JSON.parse(body);
      
      if(body.serverStatus === "online"){
        var embed = new Discord.RichEmbed()
            .setColor('#0099ff')
            .setTitle("Sunucu Durumu")
            .setDescription(`${ip} sunucusunun bilgileri aşağıdaki gibidir;`)
            .setThumbnail(`https://eu.mc-api.net/v3/server/favicon/${ip}`)
            .addField("Sunucu Durumu:", "Online", true)
            .addField("Versiyon:", body.version, true)
            .addBlankField()
            .addField("Oyuncular:", `${body.players} / ${body.maxplayers}`, true)
            .addField("Ping:", body.ping, true)
            .setTimestamp()
            .setFooter("Minecraft Sunucu Durumu", `https://eu.mc-api.net/v3/server/favicon/${ip}`)

        return message.channel.send(embed).then(msg =>{
            var interval = setInterval (function () {
                msg.delete(1000)
                request(`https://mcapi.xdefcon.com/server/${ip}/full/json`, function (error, response, body) {
                    if (error) return console.error(error);
                    
                    body = JSON.parse(body);
                    
                    if(body.serverStatus === "online"){
                        var embed = new Discord.RichEmbed()
                            .setColor('#0099ff')
                            .setTitle("Sunucu Durumu")
                            .setDescription(`${ip} sunucusunun bilgileri aşağıdaki gibidir;`)
                            .setThumbnail(`https://eu.mc-api.net/v3/server/favicon/${ip}`)
                            .addField("Sunucu Durumu:", "Online", true)
                            .addField("Versiyon:", body.version, true)
                            .addBlankField()
                            .addField("Oyuncular:", `${body.players} / ${body.maxplayers}`, true)
                            .addField("Ping:", body.ping, true)
                            .setTimestamp()
                            .setFooter("Minecraft Sunucu Durumu", `https://eu.mc-api.net/v3/server/favicon/${ip}`)

                        return msg.channel.send(embed).then(mesic => {
                            mesic.delete(9999)
                        })
                    } else {
                        return msg.reply("Sunucu aktif değil.").then(messic => {
                            messic.delete(9999)
                        });
                    }
                })
            }, 10 * 1000); 
        })
      } else {
        return message.reply("Sunucu aktif değil.");
      }
        
      
    })
    
  }
})

client.login("TOKEN");
