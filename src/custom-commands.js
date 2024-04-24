require('dotenv').config();
const { SlashCommandBuilder, ApplicationCommandOptionType } = require('discord.js');
const { REST, Routes } = require('discord.js');

// separate to own files later on
const command_list = [
    {
        name: 'coinflip',
        description: 'Heads or tails!',
    },
    {
        name: 'addaccount',
        description: 'Add account information.',
        options: [
            {
                name: 'account-type',
                description: 'What account is this?',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'username',
                description: 'Enter the username.',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'password',
                description: 'Enter the username.',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
        ]

    },
    {
        name: 'displayaccounts',
        description: 'Display all account information.',
    },

];

// rest object
const rest = new REST({ version: '10'}).setToken(process.env.TOKEN);


(async () => {
    try{
        console.log('Registering slash commands...');
        // add commands to private server
        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID, 
                process.env.GUILD_ID
            ), 
            { body: command_list }
        );

        console.log('Slash commands registered successfully.');

    } catch(error){
        console.log(`ERROR: ${error}`);
    }
})();
