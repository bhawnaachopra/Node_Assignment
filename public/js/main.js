$(document).ready(function() {
    $('.delete-band').on('click', function(e) {
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type: 'DELETE',
            url: '/bands/'+id,
            success: function(responce){
                alert('Deleting band');
                window.location.href = '/';
            },
            error: function(err) {
                console.log(err);              
            }
        });
    });
});