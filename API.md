## Classes

<dl>
<dt><a href="#DropboxClientAdapter">DropboxClientAdapter</a></dt>
<dd></dd>
<dt><a href="#DropboxClientFsAdapter">DropboxClientFsAdapter</a></dt>
<dd></dd>
</dl>

## Functions

<dl>
<dt><a href="#generateAuthorisationURL">generateAuthorisationURL(clientID, redirectURI)</a> ⇒ <code>String</code></dt>
<dd><p>Generate a Dropbox authorisation URL</p>
</dd>
<dt><a href="#createClient">createClient(token)</a> ⇒ <code><a href="#DropboxClientAdapter">DropboxClientAdapter</a></code></dt>
<dd><p>Create a new Dropbox client adapter using a token</p>
</dd>
<dt><a href="#convertDirectoryResult">convertDirectoryResult(item)</a> ⇒ <code><a href="#DirectoryResult">DirectoryResult</a></code></dt>
<dd><p>Convert a Dropbox result item to a common format</p>
</dd>
<dt><a href="#createFsInterface">createFsInterface(adapter)</a> ⇒ <code><a href="#DropboxClientFsAdapter">DropboxClientFsAdapter</a></code></dt>
<dd><p>Create an fs-like adapter from a base adapter instance</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#DirectoryResult">DirectoryResult</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#DropboxItemResult">DropboxItemResult</a> : <code>Object</code></dt>
<dd></dd>
</dl>

<a name="DropboxClientAdapter"></a>

## DropboxClientAdapter
**Kind**: global class  

* [DropboxClientAdapter](#DropboxClientAdapter)
    * [.request](#DropboxClientAdapter.request) : <code>function</code>
    * [.patcher](#DropboxClientAdapter.patcher) : <code>HotPatcher</code>
    * [.deleteFile(path)](#DropboxClientAdapter.deleteFile) ⇒ <code>Promise</code>
    * [.getDirectoryContents(path)](#DropboxClientAdapter.getDirectoryContents) ⇒ <code>Promise.&lt;Array.&lt;DirectoryResult&gt;&gt;</code>
    * [.getFileContents(path)](#DropboxClientAdapter.getFileContents) ⇒ <code>Promise.&lt;String&gt;</code>
    * [.putFileContents(path, data)](#DropboxClientAdapter.putFileContents) ⇒ <code>Promise</code>

<a name="DropboxClientAdapter.request"></a>

### DropboxClientAdapter.request : <code>function</code>
**Kind**: static property of [<code>DropboxClientAdapter</code>](#DropboxClientAdapter)  
**See**: https://github.com/perry-mitchell/cowl  
<a name="DropboxClientAdapter.patcher"></a>

### DropboxClientAdapter.patcher : <code>HotPatcher</code>
**Kind**: static property of [<code>DropboxClientAdapter</code>](#DropboxClientAdapter)  
<a name="DropboxClientAdapter.deleteFile"></a>

### DropboxClientAdapter.deleteFile(path) ⇒ <code>Promise</code>
Delete a remote file

**Kind**: static method of [<code>DropboxClientAdapter</code>](#DropboxClientAdapter)  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>String</code> | The file path |

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

<a name="DropboxClientFsAdapter"></a>

## DropboxClientFsAdapter
**Kind**: global class  

* [DropboxClientFsAdapter](#DropboxClientFsAdapter)
    * [.readdir(remotePath, [options], callback)](#DropboxClientFsAdapter.readdir)
    * [.readFile(remotePath, [options], callback)](#DropboxClientFsAdapter.readFile)
    * [.writeFile(remotePath, data, [options], callback)](#DropboxClientFsAdapter.writeFile)
    * [.unlink(remotePath, callback)](#DropboxClientFsAdapter.unlink)

<a name="DropboxClientFsAdapter.readdir"></a>

### DropboxClientFsAdapter.readdir(remotePath, [options], callback)
Read the contents of a directory

**Kind**: static method of [<code>DropboxClientFsAdapter</code>](#DropboxClientFsAdapter)  

| Param | Type | Description |
| --- | --- | --- |
| remotePath | <code>String</code> | The remote directory |
| [options] | <code>Object</code> | (Not in use) |
| callback | <code>function</code> | The callback to execute with the results or error |

<a name="DropboxClientFsAdapter.readFile"></a>

### DropboxClientFsAdapter.readFile(remotePath, [options], callback)
Read the contents of a file

**Kind**: static method of [<code>DropboxClientFsAdapter</code>](#DropboxClientFsAdapter)  

| Param | Type | Description |
| --- | --- | --- |
| remotePath | <code>String</code> | The remote file path |
| [options] | <code>Object</code> | (Not in use) |
| callback | <code>function</code> | The callback to execute with the results or error |

<a name="DropboxClientFsAdapter.writeFile"></a>

### DropboxClientFsAdapter.writeFile(remotePath, data, [options], callback)
Write to a remote file

**Kind**: static method of [<code>DropboxClientFsAdapter</code>](#DropboxClientFsAdapter)  

| Param | Type | Description |
| --- | --- | --- |
| remotePath | <code>String</code> | The remote file path |
| data | <code>String</code> \| <code>Buffer</code> | The data to write |
| [options] | <code>Object</code> | (Not in use) |
| callback | <code>function</code> | The callback to execute, possibly with an error |

<a name="DropboxClientFsAdapter.unlink"></a>

### DropboxClientFsAdapter.unlink(remotePath, callback)
Delete a remote file

**Kind**: static method of [<code>DropboxClientFsAdapter</code>](#DropboxClientFsAdapter)  

| Param | Type | Description |
| --- | --- | --- |
| remotePath | <code>String</code> | The remote file path |
| callback | <code>function</code> | The callback to execute, possibly with an error |

<a name="generateAuthorisationURL"></a>

## generateAuthorisationURL(clientID, redirectURI) ⇒ <code>String</code>
Generate a Dropbox authorisation URL

**Kind**: global function  
**Returns**: <code>String</code> - The authorisation URL  

| Param | Type | Description |
| --- | --- | --- |
| clientID | <code>String</code> | The OAuth2 client ID |
| redirectURI | <code>String</code> | The redirect URI |

<a name="createClient"></a>

## createClient(token) ⇒ [<code>DropboxClientAdapter</code>](#DropboxClientAdapter)
Create a new Dropbox client adapter using a token

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>String</code> | The dropbox token |

<a name="convertDirectoryResult"></a>

## convertDirectoryResult(item) ⇒ [<code>DirectoryResult</code>](#DirectoryResult)
Convert a Dropbox result item to a common format

**Kind**: global function  

| Param | Type |
| --- | --- |
| item | [<code>DropboxItemResult</code>](#DropboxItemResult) | 

<a name="createFsInterface"></a>

## createFsInterface(adapter) ⇒ [<code>DropboxClientFsAdapter</code>](#DropboxClientFsAdapter)
Create an fs-like adapter from a base adapter instance

**Kind**: global function  
**Returns**: [<code>DropboxClientFsAdapter</code>](#DropboxClientFsAdapter) - An fs-like adapter instance  

| Param | Type | Description |
| --- | --- | --- |
| adapter | [<code>DropboxClientAdapter</code>](#DropboxClientAdapter) | The base adapter instance |

<a name="DirectoryResult"></a>

## DirectoryResult : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | The file name |
| path | <code>String</code> | The parent path of the item |
| type | <code>String</code> | Either "file" or "directory" |
| id | <code>String</code> | The Dropbox item ID |
| size | <code>Number</code> | The size of the item |

<a name="DropboxItemResult"></a>

## DropboxItemResult : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| name | <code>String</code> | Item name |
| path_display | <code>String</code> | Item containing path |
| ".tag" | <code>String</code> | The item type |
| id | <code>String</code> | The Dropbox item ID |
| size | <code>Number</code> | The item size |

