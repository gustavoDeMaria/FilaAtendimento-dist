/**
 * FILA DE ATENDIMENTO
 * @author Gustavo Ferreira <gustavo@demaria.com.br>
 */

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})

const spinnerEl = document.querySelector('.spinner-wrapper')

window.addEventListener('load', () => {
    spinnerEl.style.opacity = '0';

    setTimeout(() => {
        spinnerEl.style.display = 'none';
    });
});

GLOBAL = {
   confirmarExclusao: function (controller) {
        Swal.fire({
            title: 'Tem certeza?',
            text: "Você não poderá reverter isso!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                // Definir a action do formulário
                document.getElementById('formExclusao').action = '@Url.Action("Delete", "{controller}")'.replace('{controller}', controller);

                // Enviar o formulário
                document.getElementById('formExclusao').submit();
            }
        });
    }
};

