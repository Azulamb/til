# TypeScriptの環境導入

手順は以下です。

* Node.jsをインストールする
* npmを使ってTypeScriptをインストール

TypeScriptはNode.jsと呼ばれるJavaScriptの実行環境をインストールすることで導入できます。

# Node.jsをインストールする

Node.jsを自分でインストールしている人、できる人は飛ばしてください。

[Node.jsのインストール](./NodeJS.md)

## Node.jsについて

Node.jsはJavaScriptの実行環境です。
`package.json` と呼ばれるファイルがあるフォルダ内がNode.jsのプロジェクトになります。

Node.jsはモジュールをインストールすると、JavaScript内で読み込んで使うことが出来ますが、通常のモジュールはこのプロジェクトの `node_modules` というフォルダ内にインストールされます。

これからTypeScriptをインストールしますが、TypeScriptはどこからでも使えるようにしたいので、プロジェクトのローカルではなく、グローバルに使えるようインストールします。

## TypeScriptのインストール

Node.jsが使えるようになったら、次のコマンドでTypeScriptをグローバルな環境にインストールします。

```
npm i -g typescript
```

npmを使ってTypeScriptをインストールします。

`i` オプションはインストールで、次の `-g` はグローバルな環境を対象とするオプションです。
`-g` をつけない場合、Node.jsのプロジェクト以下にインストールしてくれますが、今はまだプロジェクトもなく、またすべての環境でTypeScriptを使えるようにする想定なので、グローバルな環境にインストールします。

## インストールの確認

次のコマンドが実行できるか確認しましょう。

```
tsc
```

tscはTypeScriptのコードをJavaScriptに変換するためのコマンドで、何も指定しないと使い方などを表示してくれます。
以下のような感じで表示されるかと思います。

```
Version 2.8.1
Syntax:   tsc [options] [file ...]

Examples: tsc hello.ts
          tsc --outFile file.js file.ts
          tsc @args.txt

Options:
 -h, --help                                         Print this message.
 --all                                              Show all compiler options.
 -v, --version                                      Print the compiler's version.
 --init                                             Initializes a TypeScript project and creates a tsconfig.json file.
 -p FILE OR DIRECTORY, --project FILE OR DIRECTORY  Compile the project given the path to its configuration file, or to a folder with a 'tsconfig.json'.
 --pretty                                           Stylize errors and messages using color and context (experimental).
 -w, --watch                                        Watch input files.
 -t VERSION, --target VERSION                       Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017','ES2018' or 'ESNEXT'.
 -m KIND, --module KIND                             Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'.
 --lib                                              Specify library files to be included in the compilation.
                                                      'es5' 'es6' 'es2015' 'es7' 'es2016' 'es2017' 'es2018' 'esnext' 'dom' 'dom.iterable' 'webworker' 'scripthost' 'es2015.core' 'es2015.collection' 'es2015.generator' 'es2015.iterable' 'es2015.promise' 'es2015.proxy' 'es2015.reflect' 'es2015.symbol' 'es2015.symbol.wellknown' 'es2016.array.include' 'es2017.object' 'es2017.sharedmemory' 'es2017.string' 'es2017.intl' 'es2017.typedarrays' 'es2018.promise' 'es2018.regexp' 'esnext.array' 'esnext.asynciterable'
 --allowJs                                          Allow javascript files to be compiled.
 --jsx KIND                                         Specify JSX code generation: 'preserve', 'react-native', or 'react'.
 -d, --declaration                                  Generates corresponding '.d.ts' file.
 --sourceMap                                        Generates corresponding '.map' file.
 --outFile FILE                                     Concatenate and emit output to single file.
 --outDir DIRECTORY                                 Redirect output structure to the directory.
 --removeComments                                   Do not emit comments to output.
 --noEmit                                           Do not emit outputs.
 --strict                                           Enable all strict type-checking options.
 --noImplicitAny                                    Raise error on expressions and declarations with an implied 'any' type.
 --strictNullChecks                                 Enable strict null checks.
 --strictFunctionTypes                              Enable strict checking of function types.
 --strictPropertyInitialization                     Enable strict checking of property initialization in classes.
 --noImplicitThis                                   Raise error on 'this' expressions with an implied 'any' type.
 --alwaysStrict                                     Parse in strict mode and emit "use strict" for each source file.
 --noUnusedLocals                                   Report errors on unused locals.
 --noUnusedParameters                               Report errors on unused parameters.
 --noImplicitReturns                                Report error when not all code paths in function return a value.
 --noFallthroughCasesInSwitch                       Report errors for fallthrough cases in switch statement.
 --types                                            Type declaration files to be included in compilation.
 --esModuleInterop                                  Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'.
 @<file>                                            Insert command line options and files from a file.
```

### Nodistやnvmを使っている場合の注意事項

Node.jsを直にインストールしていない場合、グローバルにインストールしたTypeScriptはそのNode.jsのバージョンに依存して存在しています。
なので、新しいバージョンをインストールすると `tsc` コマンドが使えないことがあります。
その場合は再度インストールしてください。
