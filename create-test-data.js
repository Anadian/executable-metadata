#!/usr/local/bin/node
const FileSystem = require('fs');

const grep_buffer = FileSystem.readFileSync( '/bin/grep' );
var elf_buffer = Buffer.alloc( 4096 ); // 4 KiB
grep_buffer.copy( elf_buffer, 0, 0, 4096 );
const j2k_buffer = FileSystem.readFileSync( '/home/c*/Dropbox/JoyToKey.exe' );
var pe_buffer = Buffer.alloc( 4096 ); // 4 KiB
j2k_buffer.copy( pe_buffer, 0, 0, 4096 );

FileSystem.writeFileSync( 'test/example.elf', elf_buffer );
FileSystem.writeFileSync( 'test/example.pe', pe_buffer );
