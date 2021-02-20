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
	t.is( function_return, {} );
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
	t.is( function_return, {} );
} );
//getMetadataObjectFromExecutableFilePath_Async
AVA( 'getMetadataObjectFromExecutableFilePath_Async:Error:InvalidParam:input_buffer', async function( t ){
	var func = ExecutableMetadata.getMetadataObjectFromExecutableFilePath_Async;
	await t.throwsAsync( func.bind( null, false ), { instanceOf: TypeError, code: 'ERR_INVALID_ARG_TYPE' } );
} );
AVA( 'getMetadataObjectFromExecutableFilePath_Async:Error:InvalidParam:options', async function( t ){
	var func = ExecutableMetadata.getMetadataObjectFromExecutableFilePath_Async;
	t.log( `elf_filename: ${t.context.elf_filename}` );
	await t.throwsAsync( func.bind( null, t.context.elf_filename, false ), { instanceOf: TypeError, code: 'ERR_INVALID_ARG_TYPE' } );
} );
AVA( 'getMetadataObjectFromExecutableFilePath_Async:Success:ELF', async function( t ){
	var function_return = await ExecutableMetadata.getMetadataObjectFromExecutableFilePath_Async( t.context.elf_filename );
	t.is( function_return, {} );
} );
AVA( 'getMetadataObjectFromExecutableFilePath_Async:Success:PE', async function( t ){
	var function_return = await ExecutableMetadata.getMetadataObjectFromExecutableFilePath_Async( t.context.pe_filename );
	t.is( function_return, {} );
} );
//#Exports and Execution
if(require.main === module){
} else{
}
