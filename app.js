
function add(a, b) {
	    return a + b;
}

module.exports = { add };

if (require.main === module) {
	    console.log("App Running...");
}
