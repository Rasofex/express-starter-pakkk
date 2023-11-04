import {program} from "commander";
import inquirer from "inquirer";
import {cyan, magenta} from "kolorist";
import ora from "ora";

import {fileURLToPath} from 'url';
import path from 'path';
import fs from "fs-extra";
import child_process from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


program.version("1.0.0").description("A simple package for creating Express.javascript applications on JavaScript or TypeScript");

async function promptLanguageSelection() {
    const {selectedLanguage} = await inquirer.prompt([{
        type: "list",
        name: "selectedLanguage",
        message: "What language would you like to use?",
        choices: ["JavaScript", "TypeScript"],
        default: "JavaScript"
    }]);
    return selectedLanguage;
}

async function promptApplicationName() {
    const {applicationName} = await inquirer.prompt([{
        type: "input",
        name: "applicationName",
        message: "What is the name of your application?",
        default: "my-app"
    }]);
    return applicationName;
}

async function copyTemplateToSourceDirectory(language, applicationName) {
    const spinner = ora(`Copying ${language} template...`).start();
    const templatePath = path.join(__dirname, "template", language.toLowerCase());
    const destPath = process.cwd();
    await fs.copy(templatePath, destPath);

    const packagePath = path.join(destPath, 'package.json');
    const packageJson = await fs.readJson(packagePath);

    packageJson.name = applicationName;

    await fs.writeJsonSync(packagePath, packageJson, {spaces: 2});
    spinner.succeed(`${language} template successfully copied`);
}

async function promptInstallDependencies() {
    const {confirm} = await inquirer.prompt([
        {
            type: "confirm",
            name: "confirm",
            message: "Do you want to install the dependencies?",
            default: true
        }
    ]);
    return confirm;
}

async function selectPackageManager() {
    const {selectedPackageManager} = await inquirer.prompt([
        {
            type: "list",
            name: "selectedPackageManager",
            message: "Please select a package manager:",
            choices: ["npm", "yarn", "pnpm"],
            default: "npm"
        }
    ]);
    return selectedPackageManager;
}

function installPackage(packageManager) {
    let command = '';
    switch (packageManager) {
        case "npm":
            command = "npm install";
            break;
        case "yarn":
            command = "yarn install";
            break;
        case "pnpm":
            command = "pnpm install";
            break;
    }
    const spinner = ora("Installing dependencies...").start();
    child_process.exec(command, (err, stdout) => {
        if (err) throw err;
        spinner.succeed("Dependencies successfully installed");
        console.log(stdout);
    });
}

async function genApp() {
    const language = await promptLanguageSelection();
    const applicationName = await promptApplicationName();

    if (language === "TypeScript") {
        return console.log(`${magenta("TypeScript support coming soon. Thank you for your patience :)")}\n`);
        // TODO: add support for TypeScript
    }

    const installDependencies = await promptInstallDependencies();
    if (installDependencies === false) {
        console.log(`${cyan("Skipping install...")}\n`);
        await copyTemplateToSourceDirectory(language, applicationName);
    } else {
        const manager = await selectPackageManager();
        await copyTemplateToSourceDirectory(language, applicationName);
        installPackage(manager);
    }
}

genApp();