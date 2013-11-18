/**
 * Datastore Provider
 */
(function() {
  navigator.getDataStores('things').then(function(stores) {
	dump("DataStores called 'things': " + stores.length + "\n");
	var datastore = stores[0];

	var resultsEl = document.getElementById('results');

	resultsEl.addEventListener('click', function(e) {
		if (e.target.classList.contains('delete')) {
			console.log('REMOVING:', e.target.dataset.id);
			datastore.remove(parseInt(e.target.dataset.id, 10)).then(render);
		}
	});

	function render() {
		datastore.getLength().then(function(length) {
			document.getElementById('length').textContent = length;
		});

		resultsEl.innerHTML = '';
		var cursor = datastore.sync();
		function cursorResolve(task) {

			switch (task.operation) {
			  case 'done':
				  // No additional operation has to be done. When 'done' is received, the sync is completed and onchange events can be received again.
				  dump("The current revision ID is: " + task.revisionId + "\n");
				  return;
		 
			   case 'clear':
				 // All the data you have are out-of-sync. Delete all of them.
				 break;
		 
			   case 'add':
				 var newItemEl = document.createElement('li');
				 newItemEl.innerHTML = '<p>' + task.data.name + ' <a href="#" data-id="' + task.id + '" class="delete">delete</a></p>';
				 resultsEl.appendChild(newItemEl);
				 break;

			   case 'update':
				 // Something has to be updated
				 dump("Updating id: " + task.id + " data: " + task.data + "\n");
				 break;
		 
			   case 'remove':
				 dump("Record: " + task.id + " must be removed\n");
				 break;
			 }

			cursor.next().then(cursorResolve);	
		}
		cursor.next().then(cursorResolve);
	}
	render();

	datastore.onchange = function() {
		render();
	}
  });

}());
