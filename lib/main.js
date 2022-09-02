#!/usr/bin/env node

import chalk from 'chalk';
import gradient from 'gradient-string';

import fs from 'fs';
import path from 'path';
import { askForProjectType } from './utils.js';


const projectDirectory = process.cwd();

const eslintFile = path.join(projectDirectory, '.eslintrc.json');
const prettierFile = path.join(projectDirectory, '.prettierrc.json');
const eslintIgnoreFile = path.join(projectDirectory, '.eslintignore');

async function run() {
  console.log(
    chalk.bold(
      gradient.morning('\n🚀 Welcome to Eslint & Prettier Setup for Mosquito!\n')
    )
  )
  let projectType, packageManager;
  
  try {
    const answers = await askForProjectType();
    
  } catch (error) {
    console.log(chalk.blue('\n👋 Goodbye!'));
    return;
  }

}

run().catch((e) => {
  console.error(e);
});
