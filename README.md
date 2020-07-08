# stata_dyndoc_customize
A CSS file to customize the HTML output by `dyndoc` command.
You can use it by putting the code below on the very top of the file that you want to let Stata read using the `dyndoc` command.

```
<<dd_include: https://tomo-sakuma.github.io/stata_dyndoc_customize/stata_header.css >>

```

## Putting "to the top" button
You can put a "to the top" button that floats and is always at the lower right of the display.

Write the code below on the top  (ex. just under the title)  of the file that you want to let Stata read using `dyndoc` command.

```html
<a id="top"></a>
```

and write the code below on the bottom

```html
<div class="sticky">

[top](#top)

</div>
```

## Folding code and syntax highlighting
put some HTML tags before and after the code brock of `dyndoc` command.

```html
<details>
<summary> <b>Code</b> </summary>
<pre class="sh_stata">

~~~~
<<dd_do: noresults>>
"Stata commands here"
<</dd_do>>
~~~~

</pre></details>
```


## Equation
- $equation$ for inline equation.
- $$equation$$ for display formatting