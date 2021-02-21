#!/usr/local/bin/node
'use strict';
/**
# [executable-metadata.test.js](source/executable-metadata.test.js)
> AVA test file for `executable-metadata`

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
	const ExecutableMetadata = require('./main.js');
	//##Standard
	const FileSystem = require('fs');
	const ChildProcess = require('child_process');
	//##External
	const AVA = require('ava');
	const MakeDir = require('make-dir');
//#Constants
const FILENAME = 'executable-metadata.test.js';
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

//#Functions
AVA.before( function( t ){
	t.context.elf_filename = 'test/example.elf';
	t.context.elf_buffer = FileSystem.readFileSync( t.context.elf_filename );
	t.context.pe_filename = 'test/example.pe';
	t.context.pe_buffer = FileSystem.readFileSync( t.context.pe_filename );
	MakeDir.sync( 'temp' );
} );

//setLogger
AVA( 'setLogger:Error:InvalidParam', function( t ){
	var func = ExecutableMetadata.setLogger;
	t.throws( func.bind( null, 'a string' ), { instanceOf: TypeError, code: 'ERR_INVALID_ARG_TYPE' } );
} );
AVA( 'setLogger:DisableLogging', function( t ){
	ExecutableMetadata.setLogger( null );
	t.pass();
} );
//isELF
AVA( 'isELF:Error:InvalidParam:input_buffer', function( t ){
	var func = ExecutableMetadata.isELF;
	t.throws( func.bind( null, 'a string' ), { instanceOf: TypeError, code: 'ERR_INVALID_ARG_TYPE' } );
} );
AVA( 'isELF:Error:InvalidParam:options', function( t ){
	var func = ExecutableMetadata.isELF;
	t.throws( func.bind( null, t.context.elf_buffer, 'a string' ), { instanceOf: TypeError, code: 'ERR_INVALID_ARG_TYPE' } );
} );
AVA( 'isELF:Success:true', function( t ){
	var function_return = ExecutableMetadata.isELF( t.context.elf_buffer );
	t.true(function_return);
} );
AVA( 'isELF:Success:false', function( t ){
	var function_return = ExecutableMetadata.isELF( t.context.pe_buffer );
	t.false(function_return);
} );
//isPE
AVA( 'isPE:Error:InvalidParam:input_buffer', function( t ){
	var func = ExecutableMetadata.isPE;
	t.throws( func.bind( null, 'a string' ), { instanceOf: TypeError, code: 'ERR_INVALID_ARG_TYPE' } );
} );
AVA( 'isPE:Error:InvalidParam:options', function( t ){
	var func = ExecutableMetadata.isPE;
	t.throws( func.bind( null, t.context.pe_buffer, 'a string' ), { instanceOf: TypeError, code: 'ERR_INVALID_ARG_TYPE' } );
} );
AVA( 'isPE:Success:true', function( t ){
	var function_return = ExecutableMetadata.isPE( t.context.pe_buffer );
	t.true(function_return);
} );
AVA( 'isPE:Success:false', function( t ){
	var function_return = ExecutableMetadata.isPE( t.context.elf_buffer );
	t.false(function_return);
} );
//parseELF
AVA( 'parseELF:Error:InvalidParam:input_buffer', function( t ){
	var func = ExecutableMetadata.parseELF;
	t.throws( func.bind( null, 'a string' ), { instanceOf: TypeError, code: 'ERR_INVALID_ARG_TYPE' } );
} );
AVA( 'parseELF:Error:InvalidParam:options', function( t ){
	var func = ExecutableMetadata.parseELF;
	t.throws( func.bind( null, t.context.elf_buffer, 'a string' ), { instanceOf: TypeError, code: 'ERR_INVALID_ARG_TYPE' } );
} );
AVA( 'parseELF:Error:Malformatted:input_buffer', function( t ){
	var func = ExecutableMetadata.parseELF;
	t.throws( func.bind( null, t.context.pe_buffer ), { instanceOf: Error, code: 'ERR_INVALID_CHAR' } );
} );
AVA( 'parseELF:Success:true', function( t ){
	var function_return = ExecutableMetadata.parseELF( t.context.elf_buffer );
	t.deepEqual( function_return, {
	"format": "ELF",
	"architecture": {
		"bits": 64
	},
	"abi": {
		"name": "System V",
		"value": 0,
		"version": 0
	},
	"object_type": {
		"string": "ET_DYN",
		"value": 3
	},
	"isa": {
		"name": "amd64",
		"value": 62
	},
	"endianness": "little",
	"format_version": 1
} );
} );
//parsePE
AVA( 'parsePE:Error:InvalidParam:input_buffer', function( t ){
	var func = ExecutableMetadata.parsePE;
	t.throws( func.bind( null, 'a string' ), { instanceOf: TypeError, code: 'ERR_INVALID_ARG_TYPE' } );
} );
AVA( 'parsePE:Error:InvalidParam:options', function( t ){
	var func = ExecutableMetadata.parsePE;
	t.throws( func.bind( null, t.context.pe_buffer, 'a string' ), { instanceOf: TypeError, code: 'ERR_INVALID_ARG_TYPE' } );
} );
/*AVA( 'parsePE:Error:Malformatted:input_buffer', function( t ){
	var func = ExecutableMetadata.parsePE;
	t.throws( func.bind( null, t.context.elf_buffer ), { instanceOf: Error, code: 'ERR_INVALID_CHAR' } );
} );*/
AVA( 'parsePE:Success:true', function( t ){
	var function_return = ExecutableMetadata.parsePE( t.context.pe_buffer );
	t.deepEqual( function_return, {
	"format": "PE",
	"pe_header_offset_16le": 512,
	"machine_type": 332,
	"machine_type_object": {
		"constant": "IMAGE_FILE_MACHINE_I386",
		"description": "Intel 386 or later processors and compatible processors"
	},
	"number_of_sections": 9,
	"timestamp": 1451179981,
	"coff_symbol_table_offset": 0,
	"coff_number_of_symbol_table_entries": 0,
	"size_of_optional_header": 224,
	"characteristics_bitflag": 782,
	"characteristics_bitflags": [
		{
			"constant": "IMAGE_FILE_EXECUTABLE_IMAGE",
			"description": "Image only. This indicates that the image file is valid and can be run. If this flag is not set, it indicates a linker error.",
			"flag_code": 2
		},
		{
			"constant": "IMAGE_FILE_LINE_NUMS_STRIPPED",
			"description": "COFF line numbers have been removed. This flag is deprecated and should be zero.",
			"flag_code": 4
		},
		{
			"constant": "IMAGE_FILE_LOCAL_SYMS_STRIPPED",
			"description": "COFF symbol table entries for local symbols have been removed. This flag is deprecated and should be zero.",
			"flag_code": 8
		},
		{
			"constant": "IMAGE_FILE_32BIT_MACHINE",
			"description": "Machine is based on a 32-bit-word architecture.",
			"flag_code": 256
		},
		{
			"constant": "IMAGE_FILE_DEBUG_STRIPPED",
			"description": "Debugging information is removed from the image file.",
			"flag_code": 512
		}
	],
	"object_type_code": 267,
	"object_type": "PE32",
	"linker": {
		"major_version": 5,
		"minor_version": 0
	},
	"size_of_code": 1593344,
	"size_of_initialized_data": 200704,
	"size_of_uninitialized_data": 0,
	"address_of_entry_point": 5824,
	"base_of_code": 4096,
	"windows_specific": {
		"image_base": 4194304,
		"section_alignment": 4096,
		"file_alignment": 512,
		"major_os_version": 4,
		"minor_os_version": 0,
		"major_image_version": 0,
		"minor_image_version": 0,
		"major_subsystem_version": 5,
		"minor_subsystem_version": 0,
		"win32_version": 0,
		"size_of_image": 2031616,
		"size_of_headers": 1536,
		"checksum": 0,
		"subsystem": {
			"constant": "IMAGE_SUBSYSTEM_WINDOWS_GUI",
			"description": "The Windows graphical user interface (GUI) subsystem",
			"subsystem_code": 2
		},
		"dll_characteristics": 0
	},
	"base_of_data": 1597440
} );
} );
//getMetadataObjectFromExecutableFilePath_Async
AVA( 'getMetadataObjectFromExecutableFilePath_Async:Error:InvalidParam:input_buffer', async function( t ){
	var func = ExecutableMetadata.getMetadataObjectFromExecutableFilePath_Async;
	await t.throwsAsync( func.bind( null, false ), { instanceOf: TypeError, code: 'ERR_INVALID_ARG_TYPE' } );
} );
AVA( 'getMetadataObjectFromExecutableFilePath_Async:Error:InvalidParam:options', async function( t ){
	var func = ExecutableMetadata.getMetadataObjectFromExecutableFilePath_Async;
	//t.log( `elf_filename: ${t.context.elf_filename}` );
	await t.throwsAsync( func.bind( null, t.context.elf_filename, false ), { instanceOf: TypeError, code: 'ERR_INVALID_ARG_TYPE' } );
} );
AVA( 'getMetadataObjectFromExecutableFilePath_Async:Success:ELF', async function( t ){
	var function_return = await ExecutableMetadata.getMetadataObjectFromExecutableFilePath_Async( t.context.elf_filename );
	t.deepEqual( function_return, {
	"format": "ELF",
	"architecture": {
		"bits": 64
	},
	"abi": {
		"name": "System V",
		"value": 0,
		"version": 0
	},
	"object_type": {
		"string": "ET_DYN",
		"value": 3
	},
	"isa": {
		"name": "amd64",
		"value": 62
	},
	"endianness": "little",
	"format_version": 1
} );
} );
AVA( 'getMetadataObjectFromExecutableFilePath_Async:Success:PE', async function( t ){
	var function_return = await ExecutableMetadata.getMetadataObjectFromExecutableFilePath_Async( t.context.pe_filename );
	t.deepEqual( function_return, {
	"format": "PE",
	"pe_header_offset_16le": 512,
	"machine_type": 332,
	"machine_type_object": {
		"constant": "IMAGE_FILE_MACHINE_I386",
		"description": "Intel 386 or later processors and compatible processors"
	},
	"number_of_sections": 9,
	"timestamp": 1451179981,
	"coff_symbol_table_offset": 0,
	"coff_number_of_symbol_table_entries": 0,
	"size_of_optional_header": 224,
	"characteristics_bitflag": 782,
	"characteristics_bitflags": [
		{
			"constant": "IMAGE_FILE_EXECUTABLE_IMAGE",
			"description": "Image only. This indicates that the image file is valid and can be run. If this flag is not set, it indicates a linker error.",
			"flag_code": 2
		},
		{
			"constant": "IMAGE_FILE_LINE_NUMS_STRIPPED",
			"description": "COFF line numbers have been removed. This flag is deprecated and should be zero.",
			"flag_code": 4
		},
		{
			"constant": "IMAGE_FILE_LOCAL_SYMS_STRIPPED",
			"description": "COFF symbol table entries for local symbols have been removed. This flag is deprecated and should be zero.",
			"flag_code": 8
		},
		{
			"constant": "IMAGE_FILE_32BIT_MACHINE",
			"description": "Machine is based on a 32-bit-word architecture.",
			"flag_code": 256
		},
		{
			"constant": "IMAGE_FILE_DEBUG_STRIPPED",
			"description": "Debugging information is removed from the image file.",
			"flag_code": 512
		}
	],
	"object_type_code": 267,
	"object_type": "PE32",
	"linker": {
		"major_version": 5,
		"minor_version": 0
	},
	"size_of_code": 1593344,
	"size_of_initialized_data": 200704,
	"size_of_uninitialized_data": 0,
	"address_of_entry_point": 5824,
	"base_of_code": 4096,
	"windows_specific": {
		"image_base": 4194304,
		"section_alignment": 4096,
		"file_alignment": 512,
		"major_os_version": 4,
		"minor_os_version": 0,
		"major_image_version": 0,
		"minor_image_version": 0,
		"major_subsystem_version": 5,
		"minor_subsystem_version": 0,
		"win32_version": 0,
		"size_of_image": 2031616,
		"size_of_headers": 1536,
		"checksum": 0,
		"subsystem": {
			"constant": "IMAGE_SUBSYSTEM_WINDOWS_GUI",
			"description": "The Windows graphical user interface (GUI) subsystem",
			"subsystem_code": 2
		},
		"dll_characteristics": 0
	},
	"base_of_data": 1597440
} );
} );
//CLI
AVA.cb( 'CLI:Usage', function( t ){
	var stdout_string = '';
	var stderr_string = '';
	var child_process = ChildProcess.fork( './source/main.js', [ '-vVhc' ], { silent: true } );
	t.plan(2);
	child_process.stdio[1].on( 'data', function( chunk ){
		//console.log(`stdout received chunk: ${chunk}`);
		stdout_string += chunk.toString('utf8');
	} );
	child_process.stdio[2].on( 'data', function( chunk ){
		//console.log(`stderr received chunk: ${chunk}`);
	} );
	var expected_stdout_string = FileSystem.readFileSync( 'test/usage-stdout.txt', 'utf8' );
	child_process.on( 'exit', function( code, signal ){
		t.log( `exit returned with code: ${code} and signal: ${signal}.` );
		if( code === 0 ){
			t.is( stdout_string, expected_stdout_string );
			t.pass();
		} else{
			t.fail();
		}
		t.end();
	} );
} );
AVA.cb( 'CLI:stdout', function( t ){
	var stdout_string = '';
	var stderr_string = '';
	var child_process = ChildProcess.fork( './source/main.js', [ '-o', 'test/example.elf' ], { silent: true } );
	t.plan(2);
	child_process.stdio[1].on( 'data', function( chunk ){
		//console.log(`stdout received chunk: ${chunk}`);
		stdout_string += chunk.toString('utf8');
	} );
	child_process.stdio[2].on( 'data', function( chunk ){
		//console.log(`stderr received chunk: ${chunk}`);
	} );
	var expected_stdout_string = FileSystem.readFileSync( 'test/elf-stdout.txt', 'utf8' );
	child_process.on( 'exit', function( code, signal ){
		t.log( `exit returned with code: ${code} and signal: ${signal}.` );
		if( code === 0 ){
			t.is( stdout_string, expected_stdout_string );
			t.pass();
		} else{
			t.fail();
		}
		t.end();
	} );
} );
AVA.cb( 'CLI:output', function( t ){
	/*var stdout_string = '';
	var stderr_string = '';*/
	var child_process = ChildProcess.fork( './source/main.js', [ '-O', 'temp/output.txt', 'test/example.pe' ], { silent: true } );
	t.plan(2);
	/*child_process.stdio[1].on( 'data', function( chunk ){
		//console.log(`stdout received chunk: ${chunk}`);
		stdout_string += chunk.toString('utf8');
	} );
	child_process.stdio[2].on( 'data', function( chunk ){
		//console.log(`stderr received chunk: ${chunk}`);
	} );*/
	var expected_output_buffer = FileSystem.readFileSync( 'test/pe-output.txt' );
	child_process.on( 'exit', function( code, signal ){
		t.log( `exit returned with code: ${code} and signal: ${signal}.` );
		if( code === 0 ){
			var actual_output_buffer = FileSystem.readFileSync( 'temp/output.txt' );
			t.deepEqual( actual_output_buffer, expected_output_buffer );
			t.pass();
		} else{
			t.fail();
		}
		t.end();
	} );
} );
AVA.cb( 'CLI:multi-file', function( t ){
	var stdout_string = '';
	var stderr_string = '';
	var child_process = ChildProcess.fork( './source/main.js', [ '-o', 'test/example.elf', 'test/example.pe' ], { silent: true } );
	t.plan(2);
	child_process.stdio[1].on( 'data', function( chunk ){
		//console.log(`stdout received chunk: ${chunk}`);
		stdout_string += chunk.toString('utf8');
	} );
	child_process.stdio[2].on( 'data', function( chunk ){
		//console.log(`stderr received chunk: ${chunk}`);
	} );
	var expected_stdout_string = FileSystem.readFileSync( 'test/multifile-stdout.txt', 'utf8' );
	child_process.on( 'exit', function( code, signal ){
		t.log( `exit returned with code: ${code} and signal: ${signal}.` );
		if( code === 0 ){
			t.is( stdout_string, expected_stdout_string );
			t.pass();
		} else{
			t.fail();
		}
		t.end();
	} );
} );

//#Exports and Execution
if(require.main === module){
} else{
}
