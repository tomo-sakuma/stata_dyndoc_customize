# stata_dyndoc_customize
File to customize the html output by dyndoc command.


## To make "to the top" button

put below on the top of the file that let stat read using `dyndoc` command

```html
<a id="top"></a>
```

and put below on the bottom

```html
<!—ファイルの最後に置く—>
<div class="sticky">

[top](#top)

</div>
```
