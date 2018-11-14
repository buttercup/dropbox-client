## Classes

<dl>
<dt><a href="#DropboxClientAdapter">DropboxClientAdapter</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#createClient">createClient(token)</a> ⇒ <code><a href="#DropboxClientAdapter">DropboxClientAdapter</a></code></dt>
<dd><p>Create a new Dropbox client adapter using a token</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#DirectoryResult">DirectoryResult</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="DropboxClientAdapter"></a>

## DropboxClientAdapter
**Kind**: global class  

* [DropboxClientAdapter](#DropboxClientAdapter)
    * [.getDirectoryContents(path)](#DropboxClientAdapter.getDirectoryContents) ⇒ <code>Promise.&lt;Array.&lt;DirectoryResult&gt;&gt;</code>
    * [.getFileContents(path)](#DropboxClientAdapter.getFileContents) ⇒ <code>Promise.&lt;String&gt;</code>
    * [.putFileContents(path, data)](#DropboxClientAdapter.putFileContents) ⇒ <code>Promise</code>

<a name="DropboxClientAdapter.getDirectoryContents"></a>

### DropboxClientAdapter.getDirectoryContents(path) ⇒ <code>Promise.&lt;Array.&lt;DirectoryResult&gt;&gt;</code>
Get the directory contents of a remote path

**Kind**: static method of [<code>DropboxClientAdapter</code>](#DropboxClientAdapter)  
**Returns**: <code>Promise.&lt;Array.&lt;DirectoryResult&gt;&gt;</code> - A promise that resolves with directory results  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | The remote path |

<a name="DropboxClientAdapter.getFileContents"></a>

### DropboxClientAdapter.getFileContents(path) ⇒ <code>Promise.&lt;String&gt;</code>
Get the contents of a remote file

**Kind**: static method of [<code>DropboxClientAdapter</code>](#DropboxClientAdapter)  
**Returns**: <code>Promise.&lt;String&gt;</code> - A promise that resolves with the text contents of the remote
 file  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | The remote path |

<a name="DropboxClientAdapter.putFileContents"></a>

### DropboxClientAdapter.putFileContents(path, data) ⇒ <code>Promise</code>
Put contents to a remote file

**Kind**: static method of [<code>DropboxClientAdapter</code>](#DropboxClientAdapter)  
**Returns**: <code>Promise</code> - A promise that resolves when writing has been completed  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | The remote path to write to |
| data | <code>String</code> \| <code>Buffer</code> | The file data to write |

<a name="createClient"></a>

## createClient(token) ⇒ [<code>DropboxClientAdapter</code>](#DropboxClientAdapter)
Create a new Dropbox client adapter using a token

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | The dropbox token |

<a name="DirectoryResult"></a>

## DirectoryResult : <code>Object</code>
**Kind**: global typedef  
