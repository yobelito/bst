

// Startup script for running BST
import {BespokeServer} from "../lib/server/bespoke-server";
import * as program from "commander";
import {Global} from "../lib/core/global";

program
    .command("start <webhookPort> <nodePort>")
    .description("Starts the BST server")
    .action(function () {
        let webhookPort: number = parseInt(process.argv[3]);
        let serverPort: number = parseInt(process.argv[4]);
        let bespokeServer = new BespokeServer(webhookPort, serverPort);
        bespokeServer.start();
    });

Global.initializeCLI().then(
    () => program.parse(process.argv)
);