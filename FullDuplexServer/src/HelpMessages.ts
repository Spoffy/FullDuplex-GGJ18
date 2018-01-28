export class HelpMessages {
    static INTRO: string = "\n\
        The aim of the game is for the wanderer make it to the exit of this complex.\n\
        Along the way, they will face a variety of challenges. Predominately: doors.\n\
        \n\
        The overseer needs to help the wanderer face their trials up ahead.\n\
        The overseer can open and close doors and view the location of the player.\n\
        \n\
        However, the wanderer must plant transmitters to give the overseer control.\n\
        Transmitters reveal the map in a fixed radius, and give control to doors in that area.\n\
        \n\
        You only have one transmitter - remember to pick it back up when you move on.\n\
        \n\
        Good luck. Try not to kill each other.\n";


    static GENERAL_COMMANDS: string = "\n\
        This is a list of commands available within the game.\n\
        Space divide commands and parameters.\n\
        \n\
        General Commands\n\
        ================\n\
        \n\
        `?joingame` - Join a game\n\
        `?quit` - Quit the current game you're in. This will cancel the game for the other player. This is a dick move.\n\
        `?help` - Show this dialog.constructor\n\
        `?ping` - Check the bot is available.\n";

    static OVERSEER_COMMANDS: string = "\n\
        Overseer Commands\n\
        =================\n\
        \n\
        `?doors` - Lists all doors in the level, as well as whether they're open or connected to.\n\
        `?open`  - Opens a door that is connected to the overseer.\n\
        `?close` - Close a door that is connected to the overseer.\n\
        `?map`   - Display a map of all covered areas.\n";

    static WANDERER_COMMANDS: string = "\n\
        Wanderer Commands\n\
        ==================\n\
        \n\
        `?move [north|east|south|west]` - Move in one of the cardinal directions\n\
        `?n ?e ?s ?w`  - Shorthand for the above move command\n\
        `?look`        - Look at the current room, as well as all adjacent rooms.\n\
        `?transmitter` - Either plants or picks up a transmitter.\n\
        `?t`           - As above.\n";
}