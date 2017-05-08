# BATCH Boilerplate

1. Setup `io` with `config.js`
2. Extend core methods with `batcher.js`
3. Order batch sequence with any project specific custom methods `sequence.js`
4. `node sequence.js` 

### config.js

Use to configure io, file types and destinations etc.

### batcher.js

Core library methods, using promises to enable async chaining.

### sequence.js

Operate sequences here, by defining workflow, using batcher helper methods:


	let flow = batch.$promise((resolve, reject) => {
    	batch.collect()			// capture filelist
    		.then(batch.set)	// create objects array
    		.then(batch.read)	// get file contents
    		.then(resolve)		// pass to next method
	})
		
	// using cutom methods (toThis && saveAs)
	
	let rename = batch.$promise((resolve, reject, files) => {
	    batch.action(files, toThis).then(resolve)
	})
	let save = batch.$promise((resolve, reject, files) => {
	    batch.action(files, saveAs).then(resolve)
	})
	
	function toThis(file, i) {
	    let f = file.name.split('.')
	    f[0] = `renamed_${i}`
	    return f.join('')
	}
	
	
	// either run as a singular sequence, or chain with custom methods
	
	flow()
		.then(rename)
		.then(save)
		.catch(console.log)