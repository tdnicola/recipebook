$(document).ready(function() {
    $('.delete-recipe').click(function() {
        var id =$(this).data('id');
        var url = '/delete/' + id;
        if(confirm('Delete recipe?')) {
            $.ajax({
                url: url,
                type: 'delete',
                success: function(res) {
                    console.log('Deleting recipe');
                    window.location.href='/';
                },
                error: function(err) {
                    console.log(err);
                }
            })
        }
    })
})