$(document).ready(function() {
  $('input[type="radio"]').change(function() {
    $('#input_request').prop('disabled', $(this).val() !== 'request');
    $('#input_other').prop('disabled', $(this).val() !== 'other');
  });
});
