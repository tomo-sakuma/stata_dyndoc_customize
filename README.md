# stata_dyndoc_customize
File to customize the html output by dyndoc command.


## Putting "to the top" button

put the code below on the top of the file that you want to let Stata read using `dyndoc` command

```html
<a id="top"></a>
```

and put the code below on the bottom

```html
<div class="sticky">

[top](#top)

</div>
```

## Folding code and syntax highlighting

```html
<details>
<summary> <b>Code</b> </summary>
<pre class="sh_stata">

~~~~
<<dd_do: noresults>>
"Stata commands"
<</dd_do>>
~~~~

</pre></details>
```


## Equation
- $equation$ for inline equation.
- $$equation$$ for display formatting
