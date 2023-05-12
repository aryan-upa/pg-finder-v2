const flashHolder = document.getElementById('flash-holder');

function addFlash (type, message) {
	if (type === 'error')
		type = 'danger';

	flashHolder.innerHTML +=
		'<div class="alert alert-' + type + ' alert-dismissible fade show" role="alert">' +
		'<span>' + message + '</span>' +
		'<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>' +
		'</div>'
}
