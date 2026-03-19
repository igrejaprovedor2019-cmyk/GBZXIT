const { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle,
  ChannelType,
  PermissionsBitField
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ONLINE
client.once('clientReady', () => {
  console.log(`🔥 Bot online como ${client.user.tag}`);
});

// COMANDO !holo
client.on('messageCreate', async (message) => {

  if (message.author.bot) return;

  if (message.content === '!holo') {

    const embed = new EmbedBuilder()
      .setTitle('👁️🔥 Painel HOLOGRAMA ANDROID 🔥👁️')
      .setDescription(`
👁️🔥 **Adquira Já seu Painel HOLOGRAMA** 🔥👁️  

💎 O famoso sistema de visão avançada (ESP)

👀 **O que ele faz?**  
• Permite ver inimigos através das paredes  
• Mostra posição em tempo real  
• Vantagem total no jogo  

🔥 **Diferenciais**  
• Leve e otimizado 🚀  
• Funciona em várias versões Android  
• Fácil instalação  

🎮 **Ideal para:**  
• Subir rank  
• Jogar competitivo  
• Ter vantagem estratégica  

📦 **Você recebe:**  
• Key no privado  
• Acesso ao download  

💰 **Valor único:**  
👉 R$5,00  

📲 Suporte disponível  

😈🔥 **Garanta agora e saia na frente!**
      `)
      .setImage('https://media.discordapp.net/attachments/1482528899903782932/1484254280088027216/file_000000008530720eb8922a615208f883.png')
      .setColor(0x00ff88);

    const botao = new ButtonBuilder()
      .setCustomId('comprar_holo')
      .setLabel('Comprar Holograma')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(botao);

    message.channel.send({
      embeds: [embed],
      components: [row]
    });
  }
});

// INTERAÇÕES
client.on('interactionCreate', async (interaction) => {

  // CRIAR TICKET HOLOGRAMA
  if (interaction.isButton() && interaction.customId === 'comprar_holo') {

    const canal = await interaction.guild.channels.create({
      name: `holo-${interaction.user.username}`,
      type: ChannelType.GuildText,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: [PermissionsBitField.Flags.ViewChannel]
        },
        {
          id: interaction.user.id,
          allow: [PermissionsBitField.Flags.ViewChannel]
        }
      ]
    });

    const confirmar = new ButtonBuilder()
      .setCustomId('confirmar_pagamento')
      .setLabel('Confirmar Pagamento')
      .setStyle(ButtonStyle.Success);

    const fechar = new ButtonBuilder()
      .setCustomId('fechar_ticket')
      .setLabel('Fechar Ticket')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(confirmar, fechar);

    const embedPix = new EmbedBuilder()
      .setTitle('💰 Pagamento HOLOGRAMA')
      .setDescription(`
💵 Valor: R$5,00  

📲 Chave PIX:  
21983873874  

📌 Após pagar, aguarde confirmação do dono
      `)
      .setImage('https://media.discordapp.net/attachments/1482528899903782932/1484254280088027216/file_000000008530720eb8922a615208f883.png')
      .setColor(0x00ff88);

    await canal.send({
      content: `👁️ Ticket HOLOGRAMA - ${interaction.user}`,
      embeds: [embedPix],
      components: [row]
    });

    return interaction.reply({
      content: `✅ Ticket criado: ${canal}`,
      ephemeral: true
    });
  }

  // CONFIRMAR PAGAMENTO
  if (interaction.isButton() && interaction.customId === 'confirmar_pagamento') {

    const dono = process.env.DONO_ID;

    if (interaction.user.id != dono) {
      return interaction.reply({
        content: '❌ Apenas o dono pode confirmar!',
        ephemeral: true
      });
    }

    await interaction.channel.send(`
✅ Pagamento confirmado!

📦 Sua key será enviada aqui assim que o dono estiver online.
⏳ Aguarde...
    `);

    await interaction.reply({
      content: '✔️ Confirmado!',
      ephemeral: true
    });
  }

  // FECHAR TICKET
  if (interaction.isButton() && interaction.customId === 'fechar_ticket') {

    const dono = process.env.DONO_ID;

    if (interaction.user.id != dono) {
      return interaction.reply({
        content: '❌ Apenas o dono pode fechar!',
        ephemeral: true
      });
    }

    await interaction.reply({
      content: '🗑️ Fechando ticket...',
      ephemeral: true
    });

    setTimeout(() => {
      interaction.channel.delete().catch(() => {});
    }, 2000);
  }

});

client.login(process.env.TOKEN);
