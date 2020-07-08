# stata_dyndoc_customize
File to customize the html output by dyndoc command.


## Putting "to the top" button

put below on the top of the file that let stat read using `dyndoc` command

```html
<a id="top"></a>
```

and put below on the bottom

```html
<div class="sticky">

[top](#top)

</div>
```

## Folding code with syntax highlighting

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
