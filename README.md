# Stataのdyndocコマンドについて
`dyndoc` コマンドは，Stata 15 から実装されたコマンド。stataのコマンドと結果はもちろん，markdown形式で文章を書いた結果レポートみたいなものをhtmlファイルやdocxファイルに出力できる。

分析を変えてもその都度出力できるので，進捗報告のたびに結果の表をいちいちまとめたりしなくて良い。本文をガッツリ書いてwordに出力すると，論文の結果パートをstataだけで作成できる。便利。

Rmarkdownと似たような感じ。ただし，いろいろ超便利なRmarkdownと違って操作性が良くない。何もせずに使うと日本語は文字化けするし，数式も使えない。stataのサイトで配布されているheaderとcss使っても日本語文字化け問題は解決しないし，出力される表のデザインが気に入らない。いろいろな問題を解決するための方法をここにメモしておきます。

以下色々書きますが，面倒臭かったらこのコマンドをstataに読ませたいファイルの一番上に貼っておけば，日本語や数式の問題は解決します。

```stata
<<dd_include: https://tomo-sakuma.github.io/stata_dyndoc_customize/stata_header.css >>
```

> dyndocコマンドのマニュアルを一通り読んだ前提で書いています。
markdown，html，cssを使っていますが，この辺り全く知らなくてもできるように書いたつもりです。この辺りを知ってたらよりよくわかると思います（僕は`dyndoc`の出力方法をいじる過程で初めて触った初心者です）。

```html
<!--sample.doというdoファイルに以下の内容が書かれているとして，
dyndoc sample.do,replace embedimage
を実行-->

<<dd_version: 2>>
# Title

<<dd_display: "$S_DATE $S_TIME">>

This is an example

日本語は文字化けする

$$y=ax+b$$

```stata
~~~~
<<dd_do:>>
clear all
sysuse auto.dta
sum

eststo result1: ///
	reg price mpg

esttab result1 ///
	using test1.html ///
	,replace ///
	star(* 0.1 ** 0.05 *** 0.01) ///
	b(3) se(3) brackets r2(3) ar2(3) aic(3)  ///
	label varwidth(25) 

<</dd_do>>
~~~~
```

![Screen Shot 2020-07-08 at 11.11.57.png](/Users/sakumatomohiro/Documents/Screen Shot 2020-07-08 at 11.11.57.png)



# 1. 問題の解決
## 日本語が文字化けするのを防ぎたい
初期状態では，日本語で出力すると文字化けする。対処方法はいろいろあるが，一番単純な方法は，ファイルの最初（本文や内容の前）に以下のコードを貼り付ける方法。cssを使って出力デザインを抜本的に変えたい場合は，cssファイルの中にこのコードを入れておけばいい。

```html
<head>
	<meta http-equiv="content-type" charset="utf-8">
</head>
```
## 数式を入れたい
本文書くときに数式入れたい。そんな場合htmlで数式を表示するMathjaxを使う。`<head>`内に以下のものを入れておくと，tex形式の数式を出力できる。(なんか重複してる感じがするけど，一部抜いたらうまくいかなかったからこのままにしている)

```html
<head>
<script type="text/x-mathjax-config">
	MathJax.Hub.Config({
		tex2jax: {inlineMath: [['$','$'], ['\\(','\\)']]},
  		displayAlign: "left",
  		displayIndent: "2em"
	});
</script>
<script type="text/javascript" async
		src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_CHTML">
</script>
</head>
```

`$$`で囲むとディスプレイ形式，`$`で囲むとインライン形式で数式を入れることができる。


# 2. さらに使い勝手を良くしたい
## ファイル形式は.doでもいい
マニュアルでは.txt形式のファイルを読み込んでいる。

1. do-fileで分析して
2. .txtファイルに貼り付けて
3. dyndocコマンドで.txtファイルを読み込んで出力

という感じ。面倒臭い。試してみると，.do形式のファイルを指定しても普通に動く。なので，

1. .doファイルで分析しながら本文を書き
3. `dyndoc`コマンドで.doファイルを読み込んで出力

って感じで行ける(冒頭の例もそうやった)。なので，doファイルにコマンドも本文も書いておいて，そのファイルの冒頭にでも以下のような`dyndoc`実行のためのコマンドを(html用の)コメントとしてつけておいたらいい。出力するときはこの部分だけ実行する。

```html
<!--dyndoc ファイル名.do,replace embedimage-->
```


## コードを折り畳みたい
コードを表示して出力するか非表示にするかは，マニュアル通りにやれば指定できる。でもRmarkdownみたいに「コードを出力したい，だけど本文読む時邪魔やから，折りたたんでおいて，クリックしたら開くようにしたい。」という場合には工夫が必要（マニュアルには載っていない）。

普通にコードを記入するやつ

```
~~~~
<<dd_do>>
	/*ここにstataコードを書く*/
<</dd_do>>
~~~~
```

の前後に`<details>`をつけて，以下のような形にすることで実装できる。


```html
<details>
<summary> <b>Code</b> </summary>

~~~~
<<dd_do>>
	/*ここにstataコードを書く*/
<</dd_do>>
~~~~

</detail>
```


## 目次をつけたい
レポートが長くなったら目次をつけたい。
そんな場合markdownの目次が使える。

1. [1章のタイトル](#i1)
2. [2章のタイトル](#i2)
という箇条書きの目次を作り，各章の前にタグ`<a>`をつける

```html
<a id="i1"></a>
## 1章のタイトル
```

## トップに戻るボタンをつけたい

レポートが長くなったら目次に戻るボタンをつけたい。

`<head>`の`<style>`内に以下のように入れておく

```
<head>
	<style>
		.sticky {
					position: -webkit-sticky;
					position: sticky;
					bottom: 15px;
					float: right;
			}
	</style>
</head>
```

その上で，出力したいファイルの最初(目次の前とか)に

```html
<a id="top"></a>
```

ファイルの最後に

```html
<div class="sticky">

[↑Top](#top)

</div>
```

を入れる。画面の右下にトップに戻るボタンが表示されるようになる。


## コマンドのハイライト
htmlでStataのsyntax highlightをやってくれるStataxというのがある。`<head>`内に以下のものを入れておく。

```
<head>
	<script type="text/javascript" src='http://haghish.com/statax/Statax.js'></script>
</head>
```

各コマンドの入力部の前後に`<pre class="sh_stata">`と`</pre>`ををつける。コマンドの折り畳みも含めると，こんな感じ。入力辞書にでもショートカットとして入れておくといいかも（僕はsssって打つとこれが出るようにしてます）。

```html
<details>
<summary> <b>Code</b> </summary>
<pre class="sh_stata">

~~~~
<<dd_do:  noresults>>
/*ここstataコード*/
<</dd_do>>
~~~~

</pre></details>

```


## デザインを抜本的に変えたい。
フォントとか表示される横幅とかいろいろ変えたいって思ったら，cssファイルを作成しておき，doファイルの最初にcssを読み込むコマンドをつけておけば良い。(cssの内容をdoファイルにベタ打ちしても同じことはできるけど，ファイル長くなりすぎて肝心の分析の内容とかを確認しづらくなる。)

例えば`head.css`というファイルを作っておいて，doファイルの冒頭に

```
<<dd_include: /Users/(場所)/head.css>>
```

をつけとくと，cssの内容を反映してくれる。


# 色々組み込んだcssを作った
上に書いた日本語文字化け防止とか，トップに戻るボタンとか，数式の出力，コードのハイライトにとかができるようにしたcssをgithubに載せておきました。それを呼び出すのがこの記事の冒頭に書いたこれです。

```
<<dd_include: https://tomo-sakuma.github.io/stata_dyndoc_customize/stata_header.css >>
```

こんな感じになります。


![Screen Shot 2020-07-08 at 11.59.48.png](/Users/sakumatomohiro/Documents/Screen Shot 2020-07-08 at 11.59.48.png)

Codeを押したらこんな感じ。


![Screen Shot 2020-07-08 at 12.07.34.png](relative/Screen Shot 2020-07-08 at 12.07.34.png)

最初のコードを以下のように変更して出力しました。

```
<!--sample.doというdoファイルに以下の内容が書かれているとする
dyndoc sample.do,replace embedimage
を実行-->

<<dd_include: https://tomo-sakuma.github.io/stata_dyndoc_customize/stata_header.css >>


<<dd_version: 2>>
# Title

<<dd_display: "$S_DATE $S_TIME">>


This is an example

日本語は文字化けする

$$y=ax+b$$

<details>
<summary> <b>Code</b> </summary>
<pre class="sh_stata">

~~~~
<<dd_do:>>
clear all
sysuse auto.dta
sum

eststo result1: ///
	reg price mpg

esttab result1 ///
	using test1.html ///
	,replace ///
	star(* 0.1 ** 0.05 *** 0.01) ///
	b(3) se(3) brackets r2(3) ar2(3) aic(3)  ///
	label varwidth(25) 

<</dd_do>>
~~~~

</pre></details>


<<dd_include: test1.html>>




<div class="sticky">

[↑Top](#top)

</div>

```

# stata_dyndoc_customize
A CSS file to customize the HTML output by `dyndoc` command.
You can use it by putting the code below on the very top of the file that you want to let Stata read using the `dyndoc` command.

```stata
<<dd_include: https://tomo-sakuma.github.io/stata_dyndoc_customize/stata_header.css >>

```

## Putting "to the top" button
You can put a "to the top" button that floats and is always at the lower right of the display.

Write the code below on the top  (ex. just under the title)  of the file that you want to let Stata read using `dyndoc` command.

```html
<a id="top"></a>
```

and write the code below on the final line of the file.

```html
<div class="sticky">

[top](#top)

</div>
```
