#!/usr/local/bin/node
'use strict';
/* jshint esversion: 6 */
/**
# [executable-metadata.js](source/executable-metadata.js)
> Simply parse and print metadata from an executable binary's header from the command-line.

Internal module name: `ExecutableMetadata`

Author: Anadian

Code license: MIT
```
	Copyright 2020 Anadian
	Permission is hereby granted, free of charge, to any person obtaining a copy of this 
software and associated documentation files (the "Software"), to deal in the Software 
without restriction, including without limitation the rights to use, copy, modify, 
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to 
permit persons to whom the Software is furnished to do so, subject to the following 
conditions:
	The above copyright notice and this permission notice shall be included in all copies 
or substantial portions of the Software.
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A 
PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT 
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE 
OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
Documentation License: [![Creative Commons License](https://i.creativecommons.org/l/by-sa/4.0/88x31.png)](http://creativecommons.org/licenses/by-sa/4.0/)
> The source-code comments and documentation are written in [GitHub Flavored Markdown](https://github.github.com/gfm/).

> The type notation used in this documentation is based off of the [Google Closure type system](https://github.com/google/closure-compiler/wiki/Types-in-the-Closure-Type-System).

> The status and feature lifecycle keywords used in this documentation are based off of my own standard [defined here](https://github.com/Anadian/FeatureLifeCycleStateStandard).
*/

//#Dependencies
	//##Internal
	//##Standard
	const FileSystem = require('fs');
	const Assert = require('assert').strict;
	//##External
	const GetStream = require('get-stream');
//#Constants
const FILENAME = 'executable-metadata.js';
const MODULE_NAME = 'ExecutableMetadata';
var PACKAGE_JSON = {};
var PROCESS_NAME = '';
if(require.main === module){
	PROCESS_NAME = 'executable-metadata';
} else{
	PROCESS_NAME = process.argv0;
}
//##Errors

//#Global Variables
/* istanbul ignore next */
var Logger = { 
	log: () => {
		return null;
	}
};
//#Functions
/**
## Functions
*/
/**
### setLogger
> Allows this module's functions to log the given logger object.

Parametres:
| name | type | description |
| --- | --- | --- |
| logger | {?object} | The logger to be used for logging or `null` to disable logging. |

Throws:
| code | type | condition |
| --- | --- | --- |
| 'ERR_INVALID_ARG_TYPE' | {TypeError} | Thrown if `logger` is neither an object nor `null` |

History:
| version | change |
| --- | --- |
| 0.0.0 | Introduced |
*/
function setLogger( logger ){
	var return_error = null;
	//const FUNCTION_NAME = 'setLogger';
	//Variables
	//Parametre checks
	/* istanbul ignore else */
	if( typeof(logger) === 'object' ){
		/* istanbul ignore next */
		if( logger === null ){
			logger = { 
				log: () => {
					return null;
				}
			};
		}
	} else{
		return_error = new TypeError('Param "logger" is not an object.');
		return_error.code = 'ERR_INVALID_ARG_TYPE';
		throw return_error;
	}

	//Function
	Logger = logger;
	//Return
}
/**
### isELF
> Returns `true` if the given buffer is in the Unix ELF executable format.

Parametres:
| name | type | description |
| --- | --- | --- |
| input_buffer | {Buffer} | The Node Buffer to be examined.  |
| options | {?Object} | [Reserved] Additional run-time options. \[default: {}\] |

Returns:
| type | description |
| --- | --- |
| {boolean} | `true` if the buffer is in the ELF format; `false` otherwise. |

Throws:
| code | type | condition |
| --- | --- | --- |
| 'ERR_INVALID_ARG_TYPE' | {TypeError} | Thrown if a given argument isn't of the correct type. |

History:
| version | change |
| --- | --- |
| 0.0.1 | WIP |
*/
function isELF( input_buffer, options = {} ){
	var arguments_array = Array.from(arguments);
	var _return;
	var return_error;
	const FUNCTION_NAME = 'isELF';
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: `received: ${arguments_array}`});
	//Variables
	const magic_number_buffer = Buffer.from( [ 0x7F, 0x45, 0x4C, 0x46 ] );
	//Parametre checks
	if( Buffer.isBuffer(input_buffer) === false ){
		return_error = new TypeError('Param "input_buffer" is not Buffer.');
		return_error.code = 'ERR_INVALID_ARG_TYPE';
		throw return_error;
	}
	if( typeof(options) !== 'object' ){
		return_error = new TypeError('Param "options" is not ?Object.');
		return_error.code = 'ERR_INVALID_ARG_TYPE';
		throw return_error;
	}

	//Function
	var compare_int = magic_number_buffer.compare( input_buffer, 0, 4 );
	if( compare_int === 0 ){
		_return = true;
	} else{
		_return = false;
	}

	//Return
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: `returned: ${_return}`});
	return _return;
}
/**
### parseELF
> Returns an object containing ELF metadata from the parsed buffer.

Parametres:
| name | type | description |
| --- | --- | --- |
| input_buffer | {Buffer} | The Node `Buffer` to be parsed.  |
| options | {?Object} | [Reserved] Additional run-time options. \[default: {}\] |

Returns:
| type | description |
| --- | --- |
| {object} | The metadata in an object. |

Throws:
| code | type | condition |
| --- | --- | --- |
| 'ERR_INVALID_ARG_TYPE' | {TypeError} | Thrown if a given argument isn't of the correct type. |

History:
| version | change |
| --- | --- |
| 0.0.1 | WIP |
*/
function parseELF( input_buffer, options = {} ){
	var arguments_array = Array.from(arguments);
	var _return;
	var return_error;
	const FUNCTION_NAME = 'parseELF';
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: `received: ${arguments_array}`});
	//Constants
	const recognised_abis_object = {
		0x00: 'System V',
		0x01: 'HP-UX',
		0x02: 'NetBSD',
		0x03: 'Linux',
		0x04: 'GNU Hurd',
		0x06: 'Solaris',
		0x07: 'AIX',
		0x08: 'IRIX',
		0x09: 'FreeBSD',
		0x0A: 'Tru64',
		0x0B: 'Novell Modesto',
		0x0C: 'OpenBSD',
		0x0D: 'OpenVMS',
		0x0E: 'NonStop Kernel',
		0x0F: 'AROS',
		0x10: 'Fenix OS',
		0x11: 'CloudABI',
		0x12: 'Stratus Technologies OpenVOS'
	};
	const elf_object_types = {
		0x00: 'ET_NONE',
		0x01: 'ET_REL',
		0x02: 'ET_EXEC',
		0x03: 'ET_DYN',
		0x04: 'ET_CORE',
		0xFE00: 'ET_LOOS',
		0xFEFF: 'ET_HIOS',
		0xFF00: 'ET_LOPROC',
		0xFFFF: 'ET_HIPROC'
	};
	const recognised_isas_object = {
		0x00: 'No specific instruction set',
		0x01: 'AT&T WE 32100',
		0x02: 'SPARC',
		0x03: 'x86',
		0x04: 'Motorola 68000 (M68k)',
		0x05: 'Motorola 88000 (M88k)',
		0x06: 'Intel MCU',
		0x07: 'Intel 80860',
		0x08: 'MIPS',
		0x09: 'IBM_System/370',
		0x0A: 'MIPS RS3000 Little-endian',
		0x0E: 'Hewlett-Packard PA-RISC',
		0x0F: 'Reserved for future use',
		0x13: 'Intel 80960',
		0x14: 'PowerPC',
		0x15: 'PowerPC (64-bit)',
		0x16: 'S390, including S390x',
		0x28: 'ARM (up to ARMv7/Aarch32)',
		0x2A: 'SuperH',
		0x32: 'IA-64',
		0x3E: 'amd64',
		0x8C: 'TMS320C6000 Family',
		0xB7: 'ARM 64-bits (ARMv8/Aarch64)',
		0xF3: 'RISC-V',
		0x101: 'WDC 65C816'
	};
	//0x0B - 0x0D 	Reserved for future use
	//Variables
	var metadata_object = {
		format: 'ELF',
		architecture: {},
		abi: {},
		object_type: {},
		isa: {}
	};
	var byte_value = 0;
	//Parametre checks
	if( Buffer.isBuffer(input_buffer) === false ){
		return_error = new TypeError('Param "input_buffer" is not Buffer.');
		return_error.code = 'ERR_INVALID_ARG_TYPE';
		throw return_error;
	}
	if( typeof(options) !== 'object' ){
		return_error = new TypeError('Param "options" is not ?Object.');
		return_error.code = 'ERR_INVALID_ARG_TYPE';
		throw return_error;
	}

	//Function
	byte_value = input_buffer.readUInt8( 0x04 );
	switch(byte_value){
		case 1:
			metadata_object.architecture.bits = 32;
			break;
		case 2:
			metadata_object.architecture.bits = 64;
			break;
		default:
			return_error = new Error(`Parsing error: Invalid value at 0x04 representing 32-bit/64-bit architecture: should be 1 or 2; found: ${byte_value}`);
			return_error.code = 'ERR_INVALID_CHAR';
			Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'error', message: `Throwing error: ${return_error}`});
			throw return_error;
	}
	byte_value = input_buffer.readUInt8( 0x05 );
	switch(byte_value){
		case 1:
			metadata_object.endianness = 'little';
			break;
		case 2:
			metadata_object.endianness = 'big';
			break;
		default:
			return_error = new Error(`Parsing error: Invalid value at 0x05 representing endianness: should be 1 or 2; found: ${byte_value}`);
			return_error.code = 'ERR_INVALID_CHAR';
			Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'error', message: `Throwing error: ${return_error}`});
			throw return_error;
	}
	byte_value = input_buffer.readUInt8( 0x06 );
	if( byte_value !== 1 ){
		Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'warn', message: `ELF format version (byte at 0x06) should probably be 1; instead it's ${byte_value}`});
	}
	metadata_object.format_version = byte_value;
	//ABI
	byte_value = input_buffer.readUInt8( 0x07 );
	if( recognised_abis_object[byte_value] == undefined ){
		Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'warn', message: `Unrecognised value for a ABI: ${byte_value}`});
	} else{
		metadata_object.abi.name = recognised_abis_object[byte_value];
	}
	metadata_object.abi.value = byte_value;
	//ABI version
	byte_value = input_buffer.readUInt8( 0x08 );
	metadata_object.abi.version = byte_value;
	//Zeroes?
	//Object type
	if( metadata_object.edianness === 'big' ){
		byte_value = input_buffer.readUInt16BE( 0x10 );
	} else{
		byte_value = input_buffer.readUInt16LE( 0x10 );
	}
	if( elf_object_types[byte_value] == undefined ){
		Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'warn', message: `Unrecognised object type value (byte at 0x10): ${byte_value}`});
	} else{
		metadata_object.object_type.string = elf_object_types[byte_value];
	}
	metadata_object.object_type.value = byte_value;
	//ISA
	if( metadata_object.endianness === 'big' ){
		byte_value = input_buffer.readUInt16BE( 0x12 );
	} else{
		byte_value = input_buffer.readUInt16LE( 0x12 );
	}
	if( recognised_isas_object[byte_value] == undefined ){
		Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'warn', message: `Unrecognished ISA value (byte at 0x12): ${byte_value}`});
	} else{
		metadata_object.isa.name = recognised_isas_object[byte_value];
	}
	metadata_object.isa.value = byte_value;
	_return = metadata_object;

	//Return
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: `returned: ${_return}`});
	return _return;
}
/**
### isPE
> Returns `true` if the given buffer is in the Windows COFF/PE (portable executable) executable format.

Parametres:
| name | type | description |
| --- | --- | --- |
| input_buffer | {Buffer} | The Node Buffer to be examined.  |
| options | {?Object} | [Reserved] Additional run-time options. \[default: {}\] |

Returns:
| type | description |
| --- | --- |
| {boolean} | `true` if the buffer is in the PE format; `false` otherwise. |

Throws:
| code | type | condition |
| --- | --- | --- |
| 'ERR_INVALID_ARG_TYPE' | {TypeError} | Thrown if a given argument isn't of the correct type. |

History:
| version | change |
| --- | --- |
| 0.0.1 | WIP |
*/
function isPE( input_buffer, options = {} ){
	var arguments_array = Array.from(arguments);
	var _return;
	var return_error;
	const FUNCTION_NAME = 'isPE';
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: `received: ${arguments_array}`});
	//Constants
	const magic_number_buffer = Buffer.from( [ 0x50, 0x45, 0x00, 0x00 ] ); //PE\0\0
	//Variables
	var pe_header_offset_16le = 0;
	//Parametre checks
	if( Buffer.isBuffer(input_buffer) === false ){
		return_error = new TypeError('Param "input_buffer" is not Buffer.');
		return_error.code = 'ERR_INVALID_ARG_TYPE';
		throw return_error;
	}
	if( typeof(options) !== 'object' ){
		return_error = new TypeError('Param "options" is not ?Object.');
		return_error.code = 'ERR_INVALID_ARG_TYPE';
		throw return_error;
	}

	//Function
	pe_header_offset_16le = input_buffer.readUInt16LE( 0x3C );

	var compare_int = magic_number_buffer.compare( input_buffer, pe_header_offset_16le, (pe_header_offset_16le + 4) );
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'note', message: `compare_int: ${compare_int}`});
	if( compare_int === 0 ){
		_return = true;
	} else{
		/*var comparison_sub_buffer = Buffer.alloc( 4 );
		input_buffer.copy( comparison_sub_buffer, 0, pe_header_offset_16le, (pe_header_offset_16le+4) );
		Assert.deepStrictEqual( comparison_sub_buffer, magic_number_buffer, 'They\'re the same?' );
		var comparison_sub_u8array = new Uint8Array( input_buffer.buffer, pe_header_offset_16le, 4 );
		var magic_number_u8array = new Uint8Array( magic_number_buffer );
		Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'note', message: `comparison_sub_u8array: ${comparison_sub_u8array} magic_number_u8array: ${magic_number_u8array}`});
		Assert.deepStrictEqual( comparison_sub_u8array, magic_number_u8array );
		if( comparison_sub_u8array === magic_number_u8array ){
			Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'note', message: `They ARE the same!`});
		} else{
			Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'note', message: `They are NOT the same!`});
		}
		var arr1 = [1,2,3,4];
		var arr2 = [1,2,3,4];
		if( arr1 === arr2 ){
			Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'note', message: 'Strict equality.'});
		}
		if( arr1 == arr2 ){
			Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'note', message: 'Soft equality.'});
		}
		if( Object.is(arr1, arr2) ){
			Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'note', message: 'Same value equality.'});
		}
		Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'note', message: 'Nothing?'});*/
		_return = false;
	}

	//Return
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: `returned: ${_return}`});
	return _return;
}
/**
### getMetadataObjectFromExecutableFilePath
> Returns an object with the header metadata for the executable at the given file path.

Parametres:
| name | type | description |
| --- | --- | --- |
| filepath | {string} | The path to the executable file to be parsed.  |
| options | {?Object} | [Reserved] Additional run-time options. \[default: {}\] |

Returns:
| type | description |
| --- | --- |
| {Object} | An object containing the parsed metadata. What properties the object has will depend of the executable format being parsed. |

Throws:
| code | type | condition |
| --- | --- | --- |
| 'ERR_INVALID_ARG_TYPE' | {TypeError} | Thrown if a given argument isn't of the correct type. |

History:
| version | change |
| --- | --- |
| 0.0.1 | WIP |
*/
async function getMetadataObjectFromExecutableFilePath( filepath, options = {} ){
	var arguments_array = Array.from(arguments);
	var _return;
	var return_error;
	const FUNCTION_NAME = 'getMetadataObjectFromExecutableFilePath';
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: `received: ${arguments_array}`});
	//Variables
	var header_object = null;
	var buffer_size = 0;
	//Parametre checks
	if( typeof(filepath) !== 'string' ){
		return_error = new TypeError('Param "filepath" is not string.');
		return_error.code = 'ERR_INVALID_ARG_TYPE';
		throw return_error;
	}
	if( typeof(options) !== 'object' ){
		return_error = new TypeError('Param "options" is not ?Object.');
		return_error.code = 'ERR_INVALID_ARG_TYPE';
		throw return_error;
	}

	//Function
	var file_stats = await FileSystem.promises.stat( filepath );
	buffer_size = Math.min( file_stats.size, 131072 ); //16 KiB
	var header_buffer = Buffer.alloc( buffer_size ); 
	var file_handle = await FileSystem.promises.open( filepath );
	await file_handle.read( header_buffer, 0, header_buffer.length, null );
	if( isELF( header_buffer ) === true ){
		header_object = parseELF( header_buffer );
		console.log( header_object );
		_return = header_object;
	} else if( isPE( header_buffer ) === true ){
		header_object = parsePE( header_buffer );
	}

	//Return
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: `returned: ${_return}`});
	return _return;
}
/**
### main_Async (private)
> The main function when the script is run as an executable. Not exported and should never be manually called.

Parametres:
| name | type | description |
| --- | --- | --- |
| options | {?options} | An object representing the command-line options. \[default: {}\] |

Status:
| version | change |
| --- | --- |
| 0.0.1 | Introduced |
*/
/* istanbul ignore next */
async function main_Async( options = {} ){
	var arguments_array = Array.from(arguments);
	var return_error = null;
	const FUNCTION_NAME = 'main_Async';
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: `received: ${arguments_array}`});
	//Variables
	var input_buffers_array = [];
	var output_strings_array = '';
	//Parametre checks
	//Function
	///Input
	/*if( options.stdin === true ){
		Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'info', message: 'Reading input from STDIN.'});
		try{
			input_string = await GetStream( process.stdin );
		} catch(error){
			return_error = new Error(`GetStream threw an error: ${error}`);
			Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'error', message: return_error.message});
		}
	} else */
	/*if( options.input != null ){
		Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'info', message: 'Reading input from a file.'});
		if( Array.isArray(options.input) === true && options.input.length > 1 ){
			Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'info', message: 'Multi-file mode engaged.'});
		}
		if( typeof(options.input) === 'string' ){
			Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: `options.input: '${options.input}'`});
			try{
				input_string = FileSystem.readFileSync( options.input, 'utf8' );
			} catch(error){
				return_error = new Error(`FileSystem.readFileSync threw an error: ${error}`);
				Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'error', message: return_error.message});
			}
		} else{
			return_error = new Error('"options.input" is not a string.');
			Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'error', message: return_error.message});
		}
	} else{
		return_error = new Error('No input options specified.');
		Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'error', message: return_error.message});
	}*/
	///Transform
	if( return_error === null ){
		//if( input_string !== '' && typeof(input_string) === 'string' ){
		if( true ){
			function_return = getMetadataObjectFromExecutableFilePath( options.input[0], options );
		} else{
			return_error = new Error('input_string is either null or not a string.');
			Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'error', message: return_error.message});
		}
	}
	///Output
	/*if( return_error === null ){
		if( output_string !== '' && typeof(output_string) === 'string' ){
			if( options.output != null && typeof(output_string) === 'string' ){
				try{
					FileSystem.writeFileSync( options.output, output_string, 'utf8' );
				} catch(error){
					return_error = new Error(`FileSystem.writeFileSync threw an error: ${error}`);
					Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'error', message: return_error.message});
				}
			} else{
				if( options.stdout !== true ){
					Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'warn', message: 'No output options specified; defaulting to STDOUT.'});
				}
				console.log(output_string);
			}
		} else{
			return_error = new Error('"output_string" is either null or not a string.');
			Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'error', message: return_error.message});
		}
	}*/

	//Return
	if( return_error !== null ){
		process.exitCode = 1;
		Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'crit', message: return_error.message});
	}
}
//#Exports and Execution
if(require.main === module){
	var _return = [1,null];
	var return_error = null;
	const FUNCTION_NAME = 'MainExecutionFunction';
	//##Dependencies
		//###Internal
		//###Standard
		const Path = require('path');
		//###External
		const MakeDir = require('make-dir');
		const ApplicationLogWinstonInterface = require('application-log-winston-interface');
		const EnvPaths = require('env-paths');
		const CommandLineArgs = require('command-line-args');
		const CommandLineUsage = require('command-line-usage');
	//Constants
	const EnvironmentPaths = EnvPaths( PROCESS_NAME );
	const OptionDefinitions = [
		//UI
		{ name: 'help', alias: 'h', type: Boolean, description: 'Writes this help text to STDOUT.' },
		//{ name: 'noop', alias: 'n', type: Boolean, description: '[Reserved] Show what would be done without actually doing it.' },
		{ name: 'verbose', alias: 'v', type: Boolean, description: 'Verbose output to STDERR.' },
		{ name: 'version', alias: 'V', type: Boolean, description: 'Writes version information to STDOUT.' },
		{ name: 'no-quick-exit', alias: 'x', type: Boolean, description: 'Don\'t immediately exit after printing help, version, and/or config information.' },
		//Input
		//{ name: 'stdin', alias: 'i', type: Boolean, description: 'Read input from STDIN.' },
		{ name: 'input', alias: 'I', type: String, defaultOption: true, multiple: true, description: 'The path to the file(s) to read input from.' },
		//Output
		{ name: 'stdout', alias: 'o', type: Boolean, description: 'Write output to STDOUT.' },
		{ name: 'output', alias: 'O', type: String, description: 'The name of the file to write output to.' },
		{ name: 'pasteboard', alias: 'p', type: Boolean, description: '[Reserved] Copy output to pasteboard (clipboard).' },
		//Config
		{ name: 'config', alias: 'c', type: Boolean, description: 'Print search paths and configuration values to STDOUT.' },
		//{ name: 'config-file', alias: 'C', type: String, description: '[Resevred] Use the given config file instead of the default.' },
	];
	//Variables
	var function_return = [1,null];
	var quick_exit = false;
	var source_dirname = '';
	var parent_dirname = '';
	var package_path = '';
	//Logger
	try{ 
		MakeDir.sync( EnvironmentPaths.log );
	} catch(error)/* istanbul ignore next */{
		console.error('MakeDir.sync threw: %s', error);
	}
	function_return = ApplicationLogWinstonInterface.InitLogger('debug.log', EnvironmentPaths.log);
	if( function_return[0] === 0 ){
		setLogger( function_return[1] );
	}
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: 'Start of execution block.'});
	//Options
	var Options = CommandLineArgs( OptionDefinitions );
	//Config
	/* istanbul ignore next */
	if( Options.verbose === true ){
		Logger.real_transports.console_stderr.level = 'debug';
		Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'note', message: `Logger: console_stderr transport log level set to: ${Logger.real_transports.console_stderr.level}`});
	}
	///Load package.json
	try{
		source_dirname = Path.dirname( module.filename );
		package_path = Path.join( source_dirname, 'package.json' );
		PACKAGE_JSON = require(package_path);
	} catch(error){
		Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: `Soft error: ${error}`});
		try{
			parent_dirname = Path.dirname( source_dirname );
			package_path = Path.join( parent_dirname, 'package.json' );
			PACKAGE_JSON = require(package_path);
		} catch(error)/* istanbul ignore next */{
			Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: `Soft error: ${error}`});
		}
	}
	//Main
	/* istanbul ignore next */
	if( Options.version === true ){
		console.log(PACKAGE_JSON.version);
		quick_exit = true;
	}
	/* istanbul ignore next */
	if( Options.help === true ){
		const help_sections_array = [
			{
				header: 'executable-metadata',
				content: 'Simply parse and print metadata from an executable binary\'s header from the command-line.',
			},
			{
				header: 'Options',
				optionList: OptionDefinitions
			}
		]
		const help_message = CommandLineUsage(help_sections_array);
		console.log(help_message);
		quick_exit = true;
	}
	/* istanbul ignore next */
	if( Options.config === true ){
		console.log('Paths: ', EnvironmentPaths);
		quick_exit = true;
	}
	if( quick_exit === false || Options['no-quick-exit'] === true ){
		/* istanbul ignore next */
		main_Async( Options );
	}
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: 'End of execution block.'});
} else{
	exports.setLogger = setLogger;
}

