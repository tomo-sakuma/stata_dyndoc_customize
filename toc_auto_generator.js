document.addEventListener('DOMContentLoaded', function () {
	var target_toc_id = 'toc';
	var target_headline = 'h3';
	var toc_contents = document.getElementById( target_toc_id );
	var matches = document.querySelectorAll( target_headline );
	var ul = document.createElement('ul');
	matches.forEach( function (value, i) {
		if ( value.id === '' ) {   // if tag has no id, add id
			value.id = i;
		}
		var li = document.createElement('li');
		var a = document.createElement('a');
		a.innerHTML = value.innerHTML;
		a.href = '#' + value.id;
		li.appendChild(a);
		ul.appendChild(li);
	});
	toc_contents.appendChild(ul);
});