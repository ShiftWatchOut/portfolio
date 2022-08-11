---
title: Crypto JS Doc
date: 2022/8/11
tag: JS, 前端, translation
description: CryptoJS 文档翻译
author: ShiftWatchOut
---

# Crypto JS Doc

> 初始文档: https://code.google.com/archive/p/crypto-js/

标准安全加密算法的 JavaScript 实现。

CryptoJS 是在 JavaScript 中使用最佳实践和设计模式实现的标准安全加密算法的集合（不确定是否还会持续增长）。 它们速度很快，并且具有一致且简单的接口。

如果您对 CryptoJS 有疑问，如果您想讨论新功能，或者您想为项目做出贡献，您可以访问 CryptoJS 的[讨论组](http://groups.google.com/group/crypto-js/topics)。

### 哈希

##### 哈希算法

##### MD5

MD5 是一种广泛使用的哈希函数。 它已被用于各种安全应用程序，也常用于检查文件完整性。 但是，MD5 无法防止碰撞的，因此它并不适用于 SSL 证书或数字签名这类依赖抗碰撞特性的应用。

```js
var hash = CryptoJS.MD5("Message");
```

##### SHA-1

SHA 哈希函数由美国国家安全局 (NSA) 设计。 SHA-1 是现有 SHA 哈希函数中最成熟的，它被用于各种安全应用和协议。 不过，随着攻击方式的更新，SHA-1 的抗碰撞能力一直在减弱。

```js
var hash = CryptoJS.SHA1("Message");
```

##### SHA-2

SHA-256 是 SHA-2 系列中的四个变体之一。 尽管它似乎提供了更好的安全性，但却不像 SHA-1 那样被广泛使用。

```js
var hash = CryptoJS.SHA256("Message");
```

SHA-512 与 SHA-256 基本相同，但它运行在 64 位字上而不是 32 位。（what？）

```js
var hash = CryptoJS.SHA512("Message");
```

CryptoJS 还支持 SHA-224 和 SHA-384，它们大致相同，但分别是 SHA-256 和 SHA-512 的截短版。

##### SHA-3

SHA-3 是一项为期五年的竞赛的胜出者，该竞赛为了选出一种新的加密哈希算法，对 64 种竞争设计进行了评估。

**注意**: 当我将此实现命名为 SHA-3 时，我犯了一个错误。 它应该被命名为 Keccak[c=2d]。 每个 SHA-3 函数都基于 Keccak 算法的一个实例，NIST 将其选为 SHA-3 竞赛的获胜者，但这些 CryptoJS 内的 SHA-3 函数不会产生与 Keccak 相同的哈希值。

```js
var hash = CryptoJS.SHA3("Message");
```

SHA-3 可被配置为输出 224、256、384 或 512 位的哈希长度。 默认为 512 位。

```js
var hash = CryptoJS.SHA3("Message", { outputLength: 512 });
​
var hash = CryptoJS.SHA3("Message", { outputLength: 384 });
​
var hash = CryptoJS.SHA3("Message", { outputLength: 256 });
​
var hash = CryptoJS.SHA3("Message", { outputLength: 224 });
```

##### RIPEMD-160

```js
var hash = CryptoJS.RIPEMD160("Message");
```

##### The Hashing Input

哈希算法接收字符串或 `CryptoJS.lib.WordArray` 的实例作为参数。 WordArray 对象表示一个 32 位字的数组。 当您传递一个字符串时，它会自动转换为 UTF-8 编码的 WordArray。

##### The Hashing Output

算法返回给你的哈希还不是一个字符串。 它是一个 WordArray 对象。 在会隐式转换为字符串的上下文中使用 WordArray 对象时，它会自动转换为十六进制字符串。

```js
var hash = CryptoJS.SHA256("Message");
​
typeof hash
> "object";
​
hash
> "2f77668a9dfbf8d5848b9eeb4a7145ca94c6ed9236e4a773f6dcafa5132b2f91";
```

你可以通过显式调用 `toString` 方法并传递编码器，将 WordArray 对象转换为其他格式。

```js
var hash = CryptoJS.SHA256("Message");
​
hash.toString(CryptoJS.enc.Base64)
> "L3dmip37+NWEi57rSnFFypTG7ZI25Kdz9tyvpRMrL5E=";
​
hash.toString(CryptoJS.enc.Hex)
> "2f77668a9dfbf8d5848b9eeb4a7145ca94c6ed9236e4a773f6dcafa5132b2f91";
```

##### 渐进式哈希

```js
var sha256 = CryptoJS.algo.SHA256.create();
sha256.update("Message Part 1");
sha256.update("Message Part 2");
sha256.update("Message Part 3");
​
var hash = sha256.finalize();
```

##### HMAC

密钥散列消息验证码 (HMAC) 是一种使用加密散列函数进行消息验证的机制。

HMAC 可以与任何迭代加密散列函数结合使用。

```js
var hash = CryptoJS.HmacMD5("Message", "Secret Passphrase");
var hash = CryptoJS.HmacSHA1("Message", "Secret Passphrase");
var hash = CryptoJS.HmacSHA256("Message", "Secret Passphrase");
var hash = CryptoJS.HmacSHA512("Message", "Secret Passphrase");
```

##### Progressive HMAC Hashing

```js
var hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, "Secret Passphrase");
hmac.update("Message Part 1");
hmac.update("Message Part 2");
hmac.update("Message Part 3");
​
var hash = hmac.finalize();
```

##### PBKDF2

PBKDF2 是一个基于密码的密钥派生函数。 在密码学的许多应用中，用户安全最终取决于密码，并且由于密码通常不能直接用作密码密钥，因此需要进行一些处理。

salt 为任何给定的密码提供大量密钥，并且迭代次数增加了从密码生成密钥的成本，从而也增加了攻击的难度。

```js
var salt = CryptoJS.lib.WordArray.random(128 / 8);
var key128Bits = CryptoJS.PBKDF2("Secret Passphrase", salt, {
  keySize: 128 / 32
});
var key256Bits = CryptoJS.PBKDF2("Secret Passphrase", salt, {
  keySize: 256 / 32
});
var key512Bits = CryptoJS.PBKDF2("Secret Passphrase", salt, {
  keySize: 512 / 32
});
var key512Bits1000Iterations = CryptoJS.PBKDF2("Secret Passphrase", salt, {
  keySize: 512 / 32,
  iterations: 1000
});
```

##### Ciphers

##### The Cipher 算法

##### AES

高级加密标准 (AES) 是美国联邦信息处理标准 (FIPS)。 它是经过 5 年的历程，对 15 种设计进行评估后选出的。

```js
var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase");
​
var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase");
```

CryptoJS 支持 AES-128、AES-192 和 AES-256。 它将根据您传入的密钥的大小来选择变体。如果您使用密码，那么它将生成一个 256 位密钥。

##### DES, Triple DES

DES 是以前占主导地位的加密算法，并作为官方联邦信息处理标准 (FIPS) 发布。 由于密钥大小较小，DES 现在被认为是不安全的。

```js
var encrypted = CryptoJS.DES.encrypt("Message", "Secret Passphrase");
​
var decrypted = CryptoJS.DES.decrypt(encrypted, "Secret Passphrase");
```

Triple DES 对每个块应用 DES 三次以增加密钥大小。 该算法在这种形式下被认为是安全的。

```js
var encrypted = CryptoJS.TripleDES.encrypt("Message", "Secret Passphrase");
​
var decrypted = CryptoJS.TripleDES.decrypt(encrypted, "Secret Passphrase");
```

##### Rabbit

Rabbit 是一种高性能流密码，也是 eSTREAM Portfolio 的决赛选手。 它是在 3 年半的时间里选出的四种设计之一，其间有 22 种设计被评估。

```js
var encrypted = CryptoJS.Rabbit.encrypt("Message", "Secret Passphrase");
​
var decrypted = CryptoJS.Rabbit.decrypt(encrypted, "Secret Passphrase");
```

##### RC4, RC4Drop

RC4 是一种广泛使用的流密码。 它被用于流行的协议，例如 SSL 和 WEP。 尽管该算法的简单性和速度令人瞩目，但该算法的历史并没有激发人们对其安全性的信心。

```js
var encrypted = CryptoJS.RC4.encrypt("Message", "Secret Passphrase");
​
var decrypted = CryptoJS.RC4.decrypt(encrypted, "Secret Passphrase");
```

密钥流的前几个字节是非随机的，并且会泄漏有关密钥的信息。 我们可以通过丢弃密钥流的初始部分来防御这种攻击。 这种修改后的算法传统上称为 RC4-drop。

默认情况下，修改后的算法会删除 192 个字（768 字节），但你可以将其配置为删除任意数量的字。

```js
var encrypted = CryptoJS.RC4Drop.encrypt("Message", "Secret Passphrase");
​
var encrypted = CryptoJS.RC4Drop.encrypt("Message", "Secret Passphrase", {
  drop: 3072 / 4
});
​
var decrypted = CryptoJS.RC4Drop.decrypt(encrypted, "Secret Passphrase", {
  drop: 3072 / 4
});
```

##### 自定义 Key 和 IV

```js
var key = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
​
var iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");
​
var encrypted = CryptoJS.AES.encrypt("Message", key, { iv: iv });
```

##### 块模式和填充

```js
var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase", {
  mode: CryptoJS.mode.CFB,
  padding: CryptoJS.pad.AnsiX923
});
```

CryptoJS 支持下列模式:

* CBC (默认)
* CFB
* CTR
* OFB
* ECB

以及下列填充方案:

* Pkcs7 (默认)
* Iso97971
* AnsiX923
* Iso10126
* ZeroPadding
* NoPadding

##### The Cipher 输入

对于明文消息，密码算法接受字符串或 `CryptoJS.lib.WordArray` 的实例。

对于密钥，当您传递一个字符串时，它会被视为密码并用于派生实际密钥和 IV。 或者你可以传递一个代表实际密钥的 WordArray。 如果您传递实际密钥，则还必须传递实际 IV。

对于密文，密码算法接受字符串或 `CryptoJS.lib.CipherParams` 的实例。 CipherParams 对象表示参数的集合，例如 IV、salt 和原始密文本身。 当您传递一个字符串时，它会根据可配置的格式策略自动转换为 CipherParams 对象。

##### The Cipher Output

The plaintext you get back after decryption is a WordArray object. See Hashing's Output for more detail.

The ciphertext you get back after encryption isn't a string yet. It's a CipherParams object. A CipherParams object gives you access to all the parameters used during encryption. When you use a CipherParams object in a string context, it's automatically converted to a string according to a format strategy. The default is an OpenSSL-compatible format.

```js
var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase");
​
encrypted.key
> "74eb593087a982e2a6f5dded54ecd96d1fd0f3d44a58728cdcd40c55227522223 ";
​
encrypted.iv
> "7781157e2629b094f0e3dd48c4d786115";
​
encrypted.salt
> "7a25f9132ec6a8b34";
​
encrypted.ciphertext
> "73e54154a15d1beeb509d9e12f1e462a0";
​
encrypted
> "U2FsdGVkX1+iX5Ey7GqLND5UFUoV0b7rUJ2eEvHkYqA=";
```

You can define your own formats in order to be compatible with other crypto implementations. A format is an object with two methods— stringify and parse—that converts between CipherParams objects and ciphertext strings.

Here's how you might write a JSON formatter:

```js
var JsonFormatter = {
  stringify: function(cipherParams) {
    // create json object with ciphertext
    var jsonObj = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };
​
    // optionally add iv or salt
    if (cipherParams.iv) {
      jsonObj.iv = cipherParams.iv.toString();
    }
​
    if (cipherParams.salt) {
      jsonObj.s = cipherParams.salt.toString();
    }
​
    // stringify json object
    return JSON.stringify(jsonObj);
  },
  parse: function(jsonStr) {
    // parse json string
    var jsonObj = JSON.parse(jsonStr);
​
    // extract ciphertext from json object, and create cipher params object
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
    });
​
    // optionally extract iv or salt
​
    if (jsonObj.iv) {
      cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
    }
​
    if (jsonObj.s) {
      cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s);
    }
​
    return cipherParams;
  }
};
​
var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase", {
  format: JsonFormatter
});
​
encrypted
> {
    ct: "tZ4MsEnfbcDOwqau68aOrQ==",
    iv: "8a8c8fd8fe33743d3638737ea4a00698",
    s: "ba06373c8f57179c"
  };
​
var decrypted = CryptoJS.AES.decrypt(encrypted, "Secret Passphrase", {
  format: JsonFormatter
});
​
decrypted.toString(CryptoJS.enc.Utf8)
> "Message";
```

##### Progressive Ciphering

```js
var key = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");
var iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");
​
// encrypt
var aesEncryptor = CryptoJS.algo.AES.createEncryptor(key, { iv: iv });
​
var ciphertextPart1 = aesEncryptor.process("Message Part 1");
var ciphertextPart2 = aesEncryptor.process("Message Part 2");
var ciphertextPart3 = aesEncryptor.process("Message Part 3");
var ciphertextPart4 = aesEncryptor.finalize();
​
// decrypt
var aesDecryptor = CryptoJS.algo.AES.createDecryptor(key, { iv: iv });
​
var plaintextPart1 = aesDecryptor.process(ciphertextPart1);
var plaintextPart2 = aesDecryptor.process(ciphertextPart2);
var plaintextPart3 = aesDecryptor.process(ciphertextPart3);
var plaintextPart4 = aesDecryptor.process(ciphertextPart4);
var plaintextPart5 = aesDecryptor.finalize();
```

##### Interoperability

With OpenSSL

Encrypt with OpenSSL:

```sh
openssl enc -aes-256-cbc -in infile -out outfile -pass pass:"Secret Passphrase" -e -base64
```

Decrypt with CryptoJS:

```js
var decrypted = CryptoJS.AES.decrypt(openSSLEncrypted, "Secret Passphrase");
```

##### Encoders

CryptoJS can convert from encoding formats such as Base64, Latin1 or Hex to WordArray objects and vice-versa.

```js
var words = CryptoJS.enc.Base64.parse("SGVsbG8sIFdvcmxkIQ==");
​
var base64 = CryptoJS.enc.Base64.stringify(words);
​
var words = CryptoJS.enc.Latin1.parse("Hello, World!");
​
var latin1 = CryptoJS.enc.Latin1.stringify(words);
​
var words = CryptoJS.enc.Hex.parse("48656c6c6f2c20576f726c6421");
​
var hex = CryptoJS.enc.Hex.stringify(words);
​
var words = CryptoJS.enc.Utf8.parse("𔭢");
​
var utf8 = CryptoJS.enc.Utf8.stringify(words);
​
var words = CryptoJS.enc.Utf16.parse("Hello, World!");
​
var utf16 = CryptoJS.enc.Utf16.stringify(words);
​
var words = CryptoJS.enc.Utf16LE.parse("Hello, World!");
​
var utf16 = CryptoJS.enc.Utf16LE.stringify(words);
```