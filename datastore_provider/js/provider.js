/**
 * Datastore Provider
 */
(function() {
  navigator.getDataStores('things').then(function(stores) {
    dump("DataStores called 'things': " + stores.length + "\n");
    var datastore = stores[0];

    function updateCount() {
	    datastore.getLength().then(function(length) {
	    	document.getElementById('length').textContent = length;
	    });
	}
	updateCount();

	document.getElementById('clear-datastore').addEventListener('click', function(e) {
		e.preventDefault();
		datastore.clear().then(updateCount);
	});

    document.getElementById('create').addEventListener('submit', function(e) {
    	e.preventDefault();

    	var titleEl = document.getElementById('record-name');

		datastore.add({
			name: titleEl.value,
			date: Date.now()
		}).then(function(newId) {
			console.log('Created object with id: ' + newId + '\n');
			titleEl.value = '';
			updateCount();
		});
	});
  });
}());
