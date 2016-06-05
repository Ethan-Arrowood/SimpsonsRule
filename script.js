$("#integral").submit(function( event ) { //execute when the form is submitted
	event.preventDefault(); // prevent page from reloading
	var data = $(this).serializeArray(); //get all the data and make it into an array i.e [1, 2, 3]
	var lowerLimit = math.eval(data[0].value); //get the lower limit (the first data field)
	console.log('b = ' + lowerLimit)
	var upperLimit = math.eval(data[1].value); //get the upper limit (the second data field)
	console.log('a = ' + upperLimit)
	var expr = data[2].value; //get the expression (the third data field)
	console.log('expr = ' + expr)
	var N = 32; //set N

  // -------- Simpsons rule! -------
	// The first part is simple enough to do inline
	// The second part calls the simpsons function to handle the math
	var total = ((upperLimit - lowerLimit) / (3 * N)) * (simpsons(expr, lowerLimit, upperLimit, N));
	console.log('Area under the curve: ' + total );
	$("#result").text(total); //display text to document

	draw(lowerLimit, upperLimit); //make the plot

});

function simpsons(expr, b, a, n) { //the fun part

	/* We need to first figure out how to break down the
	 * range from a to b into even fractions.
	 * In order to do so I am using a for loop that starts at
	 * the lower limit 'b' and counts up to upper limit 'a' using the
	 * step variable calculate by:
	 * taking the absolute value of the difference between 'a' and 'b',
	 * and then dividing that by 'n'
	*/
	var range = []; //initialize array
	var step = math.abs(a-b)/n; //calculate step
	for (var i = b; i <= a; i += step) { //determine the fractions
		range.push(i); //push to array
	}

	var node = math.parse(expr); // parse the expr
	var code = node.compile(); // compile it into a javascript ready function

	var total = 0; // initialize total
	for (var q = 0; q < range.length; q++) { //loop through range array
		/* Simpsons rule requires you to evaluate the range of values between
		 * a and b, using the original expression. And it also requires you to
		 * sometimes multiply by 1, 2, or 4.
		 * I have achieved this by running the index of the range value before any calculation is done,
		 * then using that index I determine which coeeficient I need to multiply by, and then add the
		 * product to the total.
		*/

		//if it is the first or the last calclation
		if (q == 0 || q == range.length - 1) {
			total += code.eval({x:range[q]}); //multiply by 1 (do not multiply)
		} else if (q % 2 == 0) { //if it is an even part of the calculation
			total += 2*(code.eval({x:range[q]})); //multiply by 2
		} else { //if it is an odd part of the calculation
			total += 4*(code.eval({x:range[q]})); //multiply by 4
		}
	}
	return total //return total value
}

function draw(b,a) { //set parameters for plot
	try {
		functionPlot({
			target: '#plot',
			grid: true,
			data: [{
				fn: document.getElementById('eq').value,
				sampler: 'builtIn',
				graphType: 'polyline'
			}, {
				fn: document.getElementById('eq').value,
				range: [b, a],
				closed: true,
				sampler: 'builtIn',
				graphType: 'polyline'
			}]
		});
	}
	catch (err) {
		console.log(err);
		alert(err);
	}
}
