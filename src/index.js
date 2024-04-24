require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');
// connection for sql database
var connection;

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers, 
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

// connect to database
(async () => {
    connection = await require('../database/db');
})();

// login verification
client.login(process.env.TOKEN);

client.on('ready', (c) => {
    console.log(`${c.user.tag} is ON!`);
});



// for dealing with called commands
client.on('interactionCreate', async (interaction) => {
    // if its valid command name
    if (interaction.isChatInputCommand()){
        let result = '';
        let image = '';
        let embed = '';

        // coinflip command
        if (interaction.commandName === 'coinflip'){
            if (Math.round(Math.random()) === 0){
                result = "HEADS";
                image = 'https://media1.tenor.com/m/nJ16vNG4YgEAAAAC/your-name.gif';
            }
            else{
                result = "TAILS";
                image = 'https://media1.tenor.com/m/u-wMBNj0KKQAAAAd/forpersonaluselmao.gif';
            }

            // create embed sent by bot
            embed = new EmbedBuilder()
            .setTitle(result + '  😭')
            .setColor(0x57F287)
            .setImage(image)

        }

        // add account to database
        else if (interaction.commandName === 'addaccount'){
            const accountType = interaction.options.get('account-type').value;
            const username = interaction.options.get('username').value;
            const password = interaction.options.get('password').value;

            connection.query(
                `INSERT INTO accounts (title, username, pass) VALUES ('${accountType}', '${username}', '${password}');`
            )

            // text sent back by bot
            embed = new EmbedBuilder()
            .setTitle(`Account '${accountType}' added to the database!`);
        
        }

        else if (interaction.commandName === 'displayaccounts'){
            const [row, fields] = await connection.query(
                `SELECT * FROM accounts;`
            );

            let print = ``;

            // create print statement for all accounts
            for (let i = 0; i < row.length; i++){
                print += `** ${row[i].title} ** \n `
                print += `user:  ${row[i].username} \n`;
                print += `pass:  ${row[i].pass} \n\n\n\n`;
            }

            
            embed = new EmbedBuilder()
            .setTitle(`ALL ACCOUNTS DISPLAYED:`)
            .setColor(0x57F287)
            .setDescription(print)
        }

        // outside of if elses since we always return an embed 
        interaction.reply({ embeds: [embed] })
    }




});





