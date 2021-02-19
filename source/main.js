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
	//const GetStream = require('get-stream');
	const ConciseBuffer = require('concise-buffer');
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
	//Constants
	const magic_number_buffer = Buffer.from( [ 0x7F, 0x45, 0x4C, 0x46 ] );
	//Variables
	var compare_int = -1;
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
	compare_int = magic_number_buffer.compare( input_buffer, 0, 4 );
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
| 'ERR_INVALID_CHAR' | {Error} | Thrown if the given ELF buffer is malformed and contains erroneous data. |

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
	var compare_int = -1;
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

	compare_int = magic_number_buffer.compare( input_buffer, pe_header_offset_16le, (pe_header_offset_16le + 4) );
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: `compare_int: ${compare_int}`});
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
### parsePE
> Returns a metadata object with information from the given PE-format buffer.

Parametres:
| name | type | description |
| --- | --- | --- |
| input_buffer | {Buffer} | The buffer to parse.  |
| options | {?Object} | [Reserved] Additional run-time options. \[default: {}\] |

Returns:
| type | description |
| --- | --- |
| {Object} | An object whose properties will depend of the PE header data parsed in the buffer. |

Throws:
| code | type | condition |
| --- | --- | --- |
| 'ERR_INVALID_ARG_TYPE' | {TypeError} | Thrown if a given argument isn't of the correct type. |

History:
| version | change |
| --- | --- |
| 0.0.1 | WIP |
*/
function parsePE( input_buffer, options = {},){
	var arguments_array = Array.from(arguments);
	var _return;
	var return_error;
	const FUNCTION_NAME = 'parsePE';
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: `received: ${ConciseBuffer.getStringFromBuffer(arguments_array[0])}`});
	//Constants
	var machine_types_object = {
		0x00: {
				constant: "IMAGE_FILE_MACHINE_UNKNOWN",
				description: "The content of this field is assumed to be applicable to any machine type"
		},
		0x01d3: {
				constant: "IMAGE_FILE_MACHINE_AM33",
				description: "Matsushita AM33"
		},
		0x8664: {
				constant: "IMAGE_FILE_MACHINE_AMD64",
				description: "x64"
		},
		0x01c0: {
				constant: "IMAGE_FILE_MACHINE_ARM",
				description: "ARM little endian"
		},
		0xaa64: {
				constant: "IMAGE_FILE_MACHINE_ARM64",
				description: "ARM64 little endian"
		},
		0x01c4: {
				constant: "IMAGE_FILE_MACHINE_ARMNT",
				description: "ARM Thumb-2 little endian"
		},
		0x0ebc: {
				constant: "IMAGE_FILE_MACHINE_EBC",
				description: "EFI byte code"
		},
		0x014c: {
				constant: "IMAGE_FILE_MACHINE_I386",
				description: "Intel 386 or later processors and compatible processors"
		},
		0x0200: {
				constant: "IMAGE_FILE_MACHINE_IA64",
				description: "Intel Itanium processor family"
		},
		0x9041: {
				constant: "IMAGE_FILE_MACHINE_M32R",
				description: "Mitsubishi M32R little endian"
		},
		0x0266: {
				constant: "IMAGE_FILE_MACHINE_MIPS16",
				description: "MIPS16"
		},
		0x0366: {
				constant: "IMAGE_FILE_MACHINE_MIPSFPU",
				description: "MIPS with FPU"
		},
		0x0466: {
				constant: "IMAGE_FILE_MACHINE_MIPSFPU16",
				description: "MIPS16 with FPU"
		},
		0x01f0: {
				constant: "IMAGE_FILE_MACHINE_POWERPC",
				description: "Power PC little endian"
		},
		0x01f1: {
				constant: "IMAGE_FILE_MACHINE_POWERPCFP",
				description: "Power PC with floating point support"
		},
		0x0166: {
				constant: "IMAGE_FILE_MACHINE_R4000",
				description: "MIPS little endian"
		},
		0x5032: {
				constant: "IMAGE_FILE_MACHINE_RISCV32",
				description: "RISC-V 32-bit address space"
		},
		0x5064: {
				constant: "IMAGE_FILE_MACHINE_RISCV64",
				description: "RISC-V 64-bit address space"
		},
		0x5128: {
				constant: "IMAGE_FILE_MACHINE_RISCV128",
				description: "RISC-V 128-bit address space"
		},
		0x01a2: {
				constant: "IMAGE_FILE_MACHINE_SH3",
				description: "Hitachi SH3"
		},
		0x01a3: {
				constant: "IMAGE_FILE_MACHINE_SH3DSP",
				description: "Hitachi SH3 DSP"
		},
		0x01a6: {
				constant: "IMAGE_FILE_MACHINE_SH4",
				description: "Hitachi SH4"
		},
		0x01a8: {
				constant: "IMAGE_FILE_MACHINE_SH5",
				description: "Hitachi SH5"
		},
		0x01c2: {
				constant: "IMAGE_FILE_MACHINE_THUMB",
				description: "Thumb"
		},
		0x0169: {
				constant: "IMAGE_FILE_MACHINE_WCEMIPSV2",
				description: "MIPS little-endian WCE v2"
		}
	};
	const bitflags_object = {
		0x0001: {
				constant: "IMAGE_FILE_RELOCS_STRIPPED",
				description: "Image only, Windows CE, and Microsoft Windows NT and later. This indicates that the file does not contain base relocations and must therefore be loaded at its preferred base address. If the base address is not available, the loader reports an error. The default behavior of the linker is to strip base relocations from executable (EXE) files."
		},
		0x0002: {
				constant: "IMAGE_FILE_EXECUTABLE_IMAGE",
				description: "Image only. This indicates that the image file is valid and can be run. If this flag is not set, it indicates a linker error."
		},
		0x0004: {
				constant: "IMAGE_FILE_LINE_NUMS_STRIPPED",
				description: "COFF line numbers have been removed. This flag is deprecated and should be zero."
		},
		0x0008: {
				constant: "IMAGE_FILE_LOCAL_SYMS_STRIPPED",
				description: "COFF symbol table entries for local symbols have been removed. This flag is deprecated and should be zero."
		},
		0x0010: {
				constant: "IMAGE_FILE_AGGRESSIVE_WS_TRIM",
				description: "Obsolete. Aggressively trim working set. This flag is deprecated for Windows 2000 and later and must be zero."
		},
		0x0020: {
				constant: "IMAGE_FILE_LARGE_ADDRESS_AWARE",
				description: "Application can handle > 2-GB addresses."
		},
		0x0040: {
				constant: "IMAGE_FILE_RESERVED",
				description: "This flag is reserved for future use."
		},
		0x0080: {
				constant: "IMAGE_FILE_BYTES_REVERSED_LO",
				description: "Little endian: the least significant bit (LSB) precedes the most significant bit (MSB) in memory. This flag is deprecated and should be zero."
		},
		0x0100: {
				constant: "IMAGE_FILE_32BIT_MACHINE",
				description: "Machine is based on a 32-bit-word architecture."
		},
		0x0200: {
				constant: "IMAGE_FILE_DEBUG_STRIPPED",
				description: "Debugging information is removed from the image file."
		},
		0x0400: {
				constant: "IMAGE_FILE_REMOVABLE_RUN_FROM_SWAP",
				description: "If the image is on removable media, fully load it and copy it to the swap file."
		},
		0x0800: {
				constant: "IMAGE_FILE_NET_RUN_FROM_SWAP",
				description: "If the image is on network media, fully load it and copy it to the swap file."
		},
		0x1000: {
				constant: "IMAGE_FILE_SYSTEM",
				description: "The image file is a system file, not a user program."
		},
		0x2000: {
				constant: "IMAGE_FILE_DLL",
				description: "The image file is a dynamic-link library (DLL). Such files are considered executable files for almost all purposes, although they cannot be directly run."
		},
		0x4000: {
				constant: "IMAGE_FILE_UP_SYSTEM_ONLY",
				description: "The file should be run only on a uniprocessor machine."
		},
		0x8000: {
				constant: "IMAGE_FILE_BYTES_REVERSED_HI",
				description: "Big endian: the MSB precedes the LSB in memory. This flag is deprecated and should be zero."
		}
	};
	const subsystems_object = {
		0: {
			constant: "IMAGE_SUBSYSTEM_UNKNOWN",
			description: "An unknown subsystem"
		},
		1: {
			constant: "IMAGE_SUBSYSTEM_NATIVE",
			description: "Device drivers and native Windows processes"
		},
		2: {
			constant: "IMAGE_SUBSYSTEM_WINDOWS_GUI",
			description: "The Windows graphical user interface (GUI) subsystem"
		},
		3: {
			constant: "IMAGE_SUBSYSTEM_WINDOWS_CUI",
			description: "The Windows character subsystem"
		},
		5: {
			constant: "IMAGE_SUBSYSTEM_OS2_CUI",
			description: "The OS/2 character subsystem"
		},
		7: {
			constant: "IMAGE_SUBSYSTEM_POSIX_CUI",
			description: "The Posix character subsystem"
		},
		8: {
			constant: "IMAGE_SUBSYSTEM_NATIVE_WINDOWS",
			description: "Native Win9x driver"
		},
		9: {
			constant: "IMAGE_SUBSYSTEM_WINDOWS_CE_GUI",
			description: "Windows CE"
		},
		10: {
			constant: "IMAGE_SUBSYSTEM_EFI_APPLICATION",
			description: "An Extensible Firmware Interface (EFI) application"
		},
		11: {
			constant: "IMAGE_SUBSYSTEM_EFI_BOOT_SERVICE_DRIVER",
			description: "An EFI driver with boot services"
		},
		12: {
			constant: "IMAGE_SUBSYSTEM_EFI_RUNTIME_DRIVER",
			description: "An EFI driver with run-time services"
		},
		13: {
			constant: "IMAGE_SUBSYSTEM_EFI_ROM",
			description: "An EFI ROM image"
		},
		14: {
			constant: "IMAGE_SUBSYSTEM_XBOX",
			description: "XBOX"
		},
		16: {
			constant: "IMAGE_SUBSYSTEM_WINDOWS_BOOT_APPLICATION",
			description: "Windows boot application"
		}
	};
	const dll_characteristics_object = {
		0x0020: {
			constant: "IMAGE_DLLCHARACTERISTICS_HIGH_ENTROPY_VA",
			description: "Image can handle a high entropy 64-bit virtual address space."
		},
		0x0040: {
			constant: "IMAGE_DLLCHARACTERISTICS_DYNAMIC_BASE",
			description: "DLL can be relocated at load time."
		},
		0x0080: {
			constant: "IMAGE_DLLCHARACTERISTICS_FORCE_INTEGRITY",
			description: "Code Integrity checks are enforced."
		},
		0x0100: {
			constant: "IMAGE_DLLCHARACTERISTICS_NX_COMPAT",
			description: "Image is NX compatible."
		},
		0x0200: {
			constant: "IMAGE_DLLCHARACTERISTICS_NO_ISOLATION",
			description: "Isolation aware, but do not isolate the image."
		},
		0x0400: {
			constant: "IMAGE_DLLCHARACTERISTICS_NO_SEH",
			description: "Does not use structured exception (SE) handling. No SE handler may be called in this image."
		},
		0x0800: {
			constant: "IMAGE_DLLCHARACTERISTICS_NO_BIND",
			description: "Do not bind the image."
		},
		0x1000: {
			constant: "IMAGE_DLLCHARACTERISTICS_APPCONTAINER",
			description: "Image must execute in an AppContainer."
		},
		0x2000: {
			constant: "IMAGE_DLLCHARACTERISTICS_WDM_DRIVER",
			description: "A WDM driver."
		},
		0x4000: {
			constant: "IMAGE_DLLCHARACTERISTICS_GUARD_CF",
			description: "Image supports Control Flow Guard."
		},
		0x8000: {
			constant: "IMAGE_DLLCHARACTERISTICS_TERMINAL_SERVER_AWARE",
			description: "Terminal Server aware. "
		}
	};
	//Variables
	var pe_header_offset_16le = 0;
	var metadata_object = {
		format: 'PE'
	};
	var offset = 0;
	var bitflag_keys = [];
	var bitflag_values = [];
	var flag_uint = 0;
	var temp_object = {};
	var dll_c_keys = [];
	var dll_c_values = [];
	var flag_object = {};
	var imagebase_bigint = 0n;
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
	metadata_object.pe_header_offset_16le = input_buffer.readUInt16LE( 0x3C );
	offset = metadata_object.pe_header_offset_16le + 4;
	metadata_object.machine_type = input_buffer.readUInt16LE( offset );
	if( machine_types_object[metadata_object.machine_type] != undefined ){
		metadata_object.machine_type_object = machine_types_object[metadata_object.machine_type];
	}
	offset += 2;
	metadata_object.number_of_sections = input_buffer.readUInt16LE( offset );
	offset += 2;
	metadata_object.timestamp = input_buffer.readInt32LE( offset );
	offset += 4;
	metadata_object.coff_symbol_table_offset = input_buffer.readUInt32LE( offset );
	offset += 4;
	metadata_object.coff_number_of_symbol_table_entries = input_buffer.readUInt32LE( offset );
	offset += 4;
	metadata_object.size_of_optional_header = input_buffer.readUInt16LE( offset );
	offset += 2;
	metadata_object.characteristics_bitflag = input_buffer.readUInt16LE( offset );
	metadata_object.characteristics_bitflags = [];
	bitflag_keys = Object.keys( bitflags_object );
	bitflag_values = Object.values( bitflags_object );
	for( var i = 0; i < bitflag_keys.length; i++ ){
		flag_uint = parseInt( bitflag_keys[i], 10 );
		/*if( Math.floor( metadata_object.characteristics_bitflag / flag_uint ) ){
			var flag = ( metadata_object.characteristics_bitflag % ( parseInt(bitflag_keys[i], 10) * 2 ) );
			console.log( flag );
			if( flag != 0 ){
				var temp_object = bitflag_values[i];
				temp_object.code = bitflag_keys[i];
				metadata_object.characteristics_bitflags.push( temp_object );
			}
		}*/
		if( metadata_object.characteristics_bitflag & flag_uint ){
			temp_object = bitflag_values[i];
			temp_object.flag_code = flag_uint;
			metadata_object.characteristics_bitflags.push( temp_object );
		}
	}
	if( metadata_object.size_of_optional_header > 0 ){
		offset += 2;
		metadata_object.object_type_code = input_buffer.readUInt16LE( offset );
		if( metadata_object.object_type_code == 0x010B ){
			metadata_object.object_type = 'PE32';
		} else if( metadata_object.object_type_code == 0x0107 ){
			metadata_object.object_type = 'ROM';
		} else if( metadata_object.object_type_code == 0x020B ){
			metadata_object.object_type = 'PE32+';
		} else{
			Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'warn', message: `Unrecognised object type code: ${metadata_object.object_type_code}`});
		}
		if( metadata_object.object_type === 'PE32' || metadata_object.object_type === 'PE32+' ){
			offset += 2;
			metadata_object.linker = {};
			metadata_object.linker.major_version = input_buffer.readUInt8( offset );
			offset++;
			metadata_object.linker.minor_version = input_buffer.readUInt8( offset );
			offset++;
			metadata_object.size_of_code = input_buffer.readUInt32LE( offset );
			offset += 4;
			metadata_object.size_of_initialized_data = input_buffer.readUInt32LE( offset );
			offset += 4;
			metadata_object.size_of_uninitialized_data = input_buffer.readUInt32LE( offset );
			offset += 4;
			metadata_object.address_of_entry_point = input_buffer.readUInt32LE( offset );
			offset += 4;
			metadata_object.base_of_code = input_buffer.readUInt32LE( offset );
			offset += 4;
			metadata_object.windows_specific = {};
			if( metadata_object.object_type === 'PE32' ){
				metadata_object.base_of_data = input_buffer.readUInt32LE( offset );
				offset += 4;
				metadata_object.windows_specific.image_base = input_buffer.readUInt32LE( offset );
				offset += 4;
			} else if( metadata_object.object_type === 'PE32+' ){
				imagebase_bigint = input_buffer.readBigUInt64LE( offset );
				metadata_object.windows_specific.image_base = imagebase_bigint.toString()+'n';
				offset += 8;
			}
			metadata_object.windows_specific.section_alignment = input_buffer.readUInt32LE( offset );
			offset += 4;
			metadata_object.windows_specific.file_alignment = input_buffer.readUInt32LE( offset );
			offset += 4;
			metadata_object.windows_specific.major_os_version = input_buffer.readUInt16LE( offset );
			offset += 2;
			metadata_object.windows_specific.minor_os_version = input_buffer.readUInt16LE( offset );
			offset += 2;
			metadata_object.windows_specific.major_image_version = input_buffer.readUInt16LE( offset );
			offset += 2;
			metadata_object.windows_specific.minor_image_version = input_buffer.readUInt16LE( offset );
			offset += 2;
			metadata_object.windows_specific.major_subsystem_version = input_buffer.readUInt16LE( offset );
			offset += 2;
			metadata_object.windows_specific.minor_subsystem_version = input_buffer.readUInt16LE( offset );
			offset += 2;
			metadata_object.windows_specific.win32_version = input_buffer.readUInt32LE( offset );
			offset += 4;
			metadata_object.windows_specific.size_of_image = input_buffer.readUInt32LE( offset );
			offset += 4;
			metadata_object.windows_specific.size_of_headers = input_buffer.readUInt32LE( offset );
			offset += 4;
			metadata_object.windows_specific.checksum = input_buffer.readUInt32LE( offset );
			offset += 4;
			metadata_object.windows_specific.subsystem = input_buffer.readUInt16LE( offset );
			if( subsystems_object[metadata_object.windows_specific.subsystem] != undefined ){
				temp_object = subsystems_object[metadata_object.windows_specific.subsystem];
				temp_object.subsystem_code = metadata_object.windows_specific.subsystem;
				metadata_object.windows_specific.subsystem = temp_object;
			}
			offset += 2;
			metadata_object.windows_specific.dll_characteristics = input_buffer.readUInt16LE( offset );
			if( metadata_object.windows_specific.dll_characteristics > 0 ){
				metadata_object.windows_specific.dll_characteristic_flags = [];
				dll_c_keys = Object.keys(dll_characteristics_object);
				dll_c_values = Object.values(dll_characteristics_object);
				for( var i = 0; i < dll_c_keys.length; i++ ){
					if( metadata_object.windows_specific.dll_characteristics & dll_c_keys[i] ){
						flag_object = dll_c_values[i];
						flag_object.flag_code = dll_c_keys[i];
						metadata_object.windows_specific.dll_characteristic_flags.push( flag_object );
					}
				}
			}	
		}
	}
	//console.log(metadata_object);
	_return = metadata_object;
	//Return
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: `returned: ${_return}`});
	return _return;
}
/**
### getMetadataObjectFromExecutableFilePath_Async
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
async function getMetadataObjectFromExecutableFilePath_Async( filepath, options = {} ){
	var arguments_array = Array.from(arguments);
	var _return;
	var return_error;
	const FUNCTION_NAME = 'getMetadataObjectFromExecutableFilePath_Async';
	Logger.log({process: PROCESS_NAME, module: MODULE_NAME, file: FILENAME, function: FUNCTION_NAME, level: 'debug', message: `received: ${arguments_array}`});
	//Variables
	var header_object = null;
	var buffer_size = 0;
	var file_stats = null;
	var header_buffer = null;
	var file_handle = null;
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
	try{
		file_stats = await FileSystem.promises.stat( filepath );
	} catch(error){
		return_error = new Error(`await FileSystem.promises.stat threw an error: ${error}`);
		throw return_error;
	}
	buffer_size = Math.min( file_stats.size, 131072 ); //16 KiB
	try{
		header_buffer = Buffer.alloc( buffer_size );
	} catch(error){
		return_error = new Error(`Buffer.alloc threw an error: ${error}`);
		throw return_error;
	}
	try{
		file_handle = await FileSystem.promises.open( filepath );
	} catch(error){
		return_error = new Error(`await FileSystem.promises.open threw an error: ${error}`);
		throw return_error;
	}
	try{
		await file_handle.read( header_buffer, 0, header_buffer.length, null );
	} catch(error){
		return_error = new Error(`await file_handle.read threw an error: ${error}`);
		throw return_error;
	}
	if( isELF( header_buffer ) === true ){
		header_object = parseELF( header_buffer );
	} else if( isPE( header_buffer ) === true ){
		header_object = parsePE( header_buffer );
	}
	//console.log( header_object );
	try{
		await file_handle.close();
	} catch(error){
		return_error = new Error(`await file_handle.close threw an error: ${error}`);
		throw return_error;
	}
	_return = header_object;

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
	var for_loop_error = null;
	var for_loop_errors = [];
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
		//console.log( options.input );
		if( options.input.length > 0 ){
			for( var i = 0; i < options.input.length; i++ ){
				try{
					function_return = await getMetadataObjectFromExecutableFilePath_Async( options.input[i], options );
					console.log( function_return );
				} catch(error){
					for_loop_error = new Error(`For ${i} (${options.input[i]}): getMetadataObjectFromExecutableFilePath threw an error: ${error}`);
					for_loop_errors.push( for_loop_error );
				}
			}
			if( for_loop_errors.length > 0 ){
				return_error = new Error(`Errors occurred in the for loop: ${for_loop_errors}`);
				//throw return_error;
			}
		} else{
			return_error = new Error('No input files specified.');
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
		//Format
		{ name: 'json', alias: 'j', type: Boolean, description: 'Output the parsed metadata as a JSON object instead of the default text output.' },
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

