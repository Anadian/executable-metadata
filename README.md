# executable-metadata
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)
[![Semantic Versioning 2.0.0](https://img.shields.io/badge/semver-2.0.0-brightgreen?style=flat-square)](https://semver.org/spec/v2.0.0.html)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)
[![License](https://img.shields.io/github/license/Anadian/executable-metadata)](https://github.com/Anadian/executable-metadata/blob/master/LICENSE)

> Simply parse and print metadata from an executable binary's header from the command-line.
# Table of Contents
- [Background](#Background)
- [Install](#Install)
- [Usage](#Usage)
- [CLI](#CLI)
- [API](#API)
- [Contributing](#Contributing)
- [License](#License)
# Background
This was more of a research experiment than anything else. `executable-metadata` is a command-line application and NodeJS module for parsing metadata from the headers of Unix [ELF](https://en.wikipedia.org/wiki/Executable_and_Linkable_Format) and Windows [PE](https://en.wikipedia.org/wiki/Portable_Executable) formatted executable binaries. Really, making this was just an excuse for me to learn the formats but it does work and it may be useful if you ever find yourself specifically needing high-level information on executeables in a strictly NodeJS environment: as unlikely as that may be. It returns parsed metadata in a simple JSON object so it can easily be converted or formatted however you need. When doing things outside of a pure NodeJS is acceptable, you may be better off using an existing command-line tool for parsing executable files; for example, [readelf](https://en.wikipedia.org/wiki/Readelf) can tell you far more about a given ELF than this can. 
# Install
To use it as a dependency in a NodeJS project, run:
```sh
npm install --save executable-metadata
```
To use it as a global command-line app, run:
```sh
npm install --global executable-metadata
```
# Usage
To use the command-line interface:
```sh
[npx] executable-metadata [options] binary_files ...
```
Remember to prepend `npx` to the command when you haven't installed it globally.
## CLI
```
executable-metadata

  Simply parse and print metadata from an executable binary's header from the   
  command-line.                                                                 

Options

  -h, --help             Writes this help text to STDOUT.                                              
  -v, --verbose          Verbose output to STDERR.                                                     
  -V, --version          Writes version information to STDOUT.                                         
  -x, --no-quick-exit    Don't immediately exit after printing help, version, and/or config            
                         information.                                                                  
  -I, --input string[]   The path to the file(s) to read input from.                                   
  -o, --stdout           Write output to STDOUT.                                                       
  -O, --output string    The name of the file to write output to.                                      
  -p, --pasteboard       [Reserved] Copy output to pasteboard (clipboard).                             
  -c, --config           Print search paths and configuration values to STDOUT.                        
```
# API
```js
const ExecutableMetadata = require('executable-metadata');
```
See [API.md](API.md) for full API.
# Contributing
Changes are tracked in [CHANGELOG.md](CHANGELOG.md).
# License
MIT ©2021 Anadian

SEE LICENSE IN [LICENSE](LICENSE)

[![Creative Commons License](https://i.creativecommons.org/l/by-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-sa/4.0/)This project's documentation is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-sa/4.0/).
